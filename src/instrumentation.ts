import { Browser } from "puppeteer";
import { startLocationScraping } from "./scraping";
import prisma from "./lib/prisma";

export const register = async () => {
    if(process.env.NEXT_RUNTIME === "nodejs"){
        const {Worker} = await import("bullmq")
        const {connection} = await import('@/lib/redis')
        // const {jobsQueue} = await import('@/lib/queue')
        const puppeteer = await import("puppeteer")
        const BROWSER_WS = "wss://brd-customer-hl_e0b01b8f-zone-arklyte:dap05aepjlci@brd.superproxy.io:9222";
        
        new Worker("jobsQueue",async (job)=>{
        let browser : undefined | Browser = undefined
            try {
            browser = await puppeteer.connect({browserWSEndpoint :BROWSER_WS})
            console.log({job})
            const page = await browser.newPage()
            if(job.data.jobType.type === "location"){
                console.log("Connected! Navigating to " + job.data.url)
                try {
                    // Increase timeout and fallback to simpler waitUntil
                    await page.goto(job.data.url, {
                        timeout: 60000,
                        waitUntil: 'domcontentloaded'
                    });
                    await page.setViewport({ width: 1366, height: 768 });
                    console.log(`Navigation complete! Scraping page content...`);
                    const packages = await startLocationScraping(page);
                    console.log("Packages found:", packages.length);
                    console.log({ packages });
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
            }

    
        } catch (error) {
            console.log(error)
            await prisma.jobs.update({where:{id:job.data.id},data:{isComplete:true,status:"failed"}})

        }finally{
            await browser?.close()
            console.log("Browser closed Successfully")
        }
        },{connection,concurrency:10,removeOnComplete:{count:1000},removeOnFail:{count:5000}})
    }

}
