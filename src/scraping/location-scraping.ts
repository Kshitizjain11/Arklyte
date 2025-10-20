import { Page } from "puppeteer";
interface PackageInfo{
    id: string | null,
    name:string,
    nights:number,
    days:number,
    inclusions: string[],
    price:number
}
export const startLocationScraping = async (page:Page) : Promise<PackageInfo[]> =>{
    // Wait for the network to be idle and content to load
    await page.waitForNetworkIdle();
    
    // Log the page content for debugging
    const pageContent = await page.content();
    console.log("Page Content Length:", pageContent.length);
    
    // Log the page URL for context
    console.log("Scraping location:", await page.url());

    return await page.evaluate(() => {
        // Log what we find for debugging
        const html = document.documentElement.innerHTML;
        console.log("DOM Content Length:", html.length);
        
        // Try multiple selectors that might contain packages
        const selectors = [
            ".packages-container",
            ".package-container",
            ".holiday-package",
            ".package-item",
            "[data-package]",
            "[data-packageid]"
        ];
        
        let packageElements: NodeListOf<Element> | null = null;
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`Found ${elements.length} packages using selector: ${selector}`);
                packageElements = elements;
                break;
            }
        }

        if (!packageElements || packageElements.length === 0) {
            console.warn("No packages found with any selector! DOM structure:", document.body.innerHTML.slice(0, 500));
            packageElements = document.querySelectorAll(".packages-container"); // fallback to original
        }

        console.log("Found package elements:", packageElements.length);
        
        const packages : PackageInfo[] = [];
        packageElements.forEach((packageElement) => {
            const packageInfo : PackageInfo = {
                id: null,
                name: "",
                nights: 0,
                days: 0,
                price: 0,
                inclusions: []
            };

            const pkgElement = packageElement.querySelector(".package-name a");
            console.log("Found name element:", pkgElement !== null);
            
            if (pkgElement) {
                packageInfo.name = (pkgElement as HTMLElement).textContent?.trim() || "";
                
                // Try multiple ways to get package ID
                const href = pkgElement.getAttribute("href");
                const idFromHref = href?.match(/packageId=([^&]+)/)?.[1];
                const idFromData = packageElement.getAttribute("data-packageid");
                packageInfo.id = idFromHref || idFromData || null;
                
                console.log("Package found:", { 
                    name: packageInfo.name.slice(0, 30) + "...",
                    id: packageInfo.id,
                    href: href?.slice(0, 50) + "..."
                });
            }
            
            const durationElement = packageElement.querySelector(".package-duration");
            if (durationElement) {
                const nightsText = durationElement.querySelector(".nights span")?.textContent;
                const daysText = durationElement.querySelector(".days span")?.textContent;
                packageInfo.nights = parseInt(nightsText || "0");
                packageInfo.days = parseInt(daysText || "0");
                console.log("Duration found:", { nights: packageInfo.nights, days: packageInfo.days });
            }

            const inclusionsElement = packageElement.querySelector(".package-inclusions");
            if (inclusionsElement) {
                const inclusionsItems = Array.from(inclusionsElement.querySelectorAll("li"))
                    .map(item => item.querySelector(".icon-name")?.textContent?.trim())
                    .filter(text => text) as string[];
                packageInfo.inclusions = inclusionsItems;
                console.log("Inclusions found:", inclusionsItems);
            }

            const priceElement = packageElement.querySelector(".final-price .amount");
            if (priceElement) {
                const priceText = priceElement.textContent?.replace(/[^\d]/g, "");
                packageInfo.price = parseInt(priceText || "0");
                console.log("Price found:", packageInfo.price);
            }

            // Only add packages that have at least an ID and name
            if (packageInfo.id && packageInfo.name) {
                packages.push(packageInfo);
            } else {
                console.warn("Skipping invalid package:", packageInfo);
            }
        });
        console.log(`Found ${packages.length} valid packages out of ${packageElements.length} elements`);
        return packages;
    });
}