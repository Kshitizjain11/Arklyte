import type { Browser } from "puppeteer";
import { startLocationScraping, startPackageScraping } from "./scraping";
import prisma from "./lib/prisma";

export const register = async () => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { Worker } = await import("bullmq")
        const { connection } = await import('@/lib/redis')
        // const {jobsQueue} = await import('@/lib/queue')
        const puppeteer = await import("puppeteer")
        const BROWSER_WS = "wss://brd-customer-hl_aebf7289-zone-arklyte:k611nmtpji1p@brd.superproxy.io:9222";

        // reduce concurrency to avoid overloading the remote browser
        new Worker("jobsQueue", async (job) => {
            let browser: undefined | Browser = undefined
            try {
                browser = await puppeteer.connect({ browserWSEndpoint: BROWSER_WS })
                const page = await browser.newPage()
                // increase timeout for slow pages and use domcontentloaded for faster start
                await page.goto(job.data.url, {
                    timeout: 200000,
                    waitUntil: 'domcontentloaded'
                });
                await page.setViewport({ width: 1366, height: 768 });
                console.log(`Navigation complete! Scraping page content...`);
                if (job.data.jobType.type === "location") {
                    console.log("Connected! Navigating to " + job.data.url)
                    try {
                        // Increase timeout and fallback to simpler waitUntil
                        const packages = await startLocationScraping(page);
                        await prisma.jobs.update({ where: { id: job.data.id }, data: { isComplete: true, status: "complete" } })
                        for (const pkg of packages) {
                            const jobCreated = await prisma.jobs.findFirst({
                                where: {
                                    url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`
                                }
                            })
                            if (!jobCreated) {
                                // create a DB job for the package
                                const newJob = await prisma.jobs.create({
                                    data: {
                                        url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                                        jobType: { type: "package" }
                                    }
                                })
                                console.log('Created package job in DB', newJob.id, newJob.url)
                                // dynamic import so bundlers don't include server-only queue/bullmq in other runtimes
                                const { addJob } = await import('./lib/queue');
                                // pass a minimal, serializable payload to the queue (avoid Dates/complex objects)
                                const payload = {
                                    id: newJob.id,
                                    url: newJob.url,
                                    jobType: newJob.jobType,
                                    packageDetails: pkg
                                }
                                await addJob("package", payload)
                            }
                        }
                    } catch (navErr) {
                        console.error("Navigation error:", navErr);
                        // Try to log page content for debugging
                        try {
                            const failedContent = await page.content();
                            console.log("Page content after navigation error:", failedContent.slice(0, 1000)); // Print first 1000 chars
                        } catch (contentErr) {
                            console.error("Could not get page content after navigation error:", contentErr);
                        }
                    }
                } else if (job.data.jobType.type === "package") {
                    // console.log(job.data)
                    // Already Scraped Check
                    // Scrape the Package
                    // Store the package in trips model
                    // Mark the job as completed
                    const alreadyScraped = await prisma.trips.findUnique({ where: { id: job.data.packageDetails.id } })
                    if (!alreadyScraped) {
                        const pkg = await startPackageScraping(page, job.data.packageDetails)
                        // Only insert if id and name are present
                        if (pkg.id && pkg.name) {
                            const tripData = {
                                id: pkg.id,
                                name: pkg.name,
                                nights: pkg.nights || 0,
                                days: pkg.days || 0,
                                destinationItinerary: Array.isArray(pkg.destinationItinerary) ? pkg.destinationItinerary : [],
                                images: Array.isArray(pkg.images) ? pkg.images : [],
                                inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
                                themes: Array.isArray(pkg.themes) ? pkg.themes : [],
                                price: pkg.price || 0,
                                destinationDetails: Array.isArray(pkg.destinationDetails) ? pkg.destinationDetails : [],
                                detailedItinerary: Array.isArray(pkg.detailedItinerary) ? pkg.detailedItinerary : [],
                                description: pkg.description || "",
                                packageItinerary: Array.isArray(pkg.packageItinerary) ? pkg.packageItinerary : [],
                                scrapedOn: new Date(),
                            };
                            try {
                                await prisma.trips.create({ data: tripData });
                                await prisma.jobs.update({ where: { id: job.data.id }, data: { isComplete: true, status: "complete" } })
                            } catch (err) {
                                console.error('Failed to insert trip:', err, tripData);
                                await prisma.jobs.update({ where: { id: job.data.id }, data: { isComplete: true, status: "failed" } })
                            }
                        } else {
                            console.error('Scraped package missing id or name:', pkg);
                            await prisma.jobs.update({ where: { id: job.data.id }, data: { isComplete: true, status: "failed" } })
                        }
                    }
                }


            } catch (error) {
                console.log(error)
                await prisma.jobs.update({ where: { id: job.data.id }, data: { isComplete: true, status: "failed" } })

            } finally {
                await browser?.close()
                console.log("Browser closed Successfully")
            }
        }, { connection, concurrency: 10, removeOnComplete: { count: 1000 }, removeOnFail: { count: 5000 } })
    }

}
