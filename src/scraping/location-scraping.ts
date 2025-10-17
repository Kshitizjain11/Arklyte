import { Page } from "puppeteer";
interface PackageInfo{
    id: string | null,
    name:string
}
export const startLocationScraping = async (page:Page) : Promise<PackageInfo[]> =>{
    // Wait for the network to be idle and content to load
    await page.waitForNetworkIdle();
    
    // Log the page content for debugging
    const pageContent = await page.content();
    console.log("Page Content Length:", pageContent.length);
    
    return await page.evaluate(() => {
        // Log what we find for debugging
        const html = document.documentElement.innerHTML;
        console.log("DOM Content Length:", html.length);
        
        const packageElements = document.querySelectorAll(".packages-container");
        console.log("Found package elements:", packageElements.length);
        
        // Try alternative selectors that might contain packages
        const alternativeElements = document.querySelectorAll(".package, .holiday-package, [data-type='package']");
        console.log("Alternative elements found:", alternativeElements.length);
        
        const packages : PackageInfo[] = [];
        packageElements.forEach((packageElement) => {
            const packageInfo : PackageInfo = {
                id: null,
                name: ""
            }
            const nameElement = packageElement.querySelector(".package-name a");
            console.log("Found name element:", nameElement !== null);
            packageInfo.name = nameElement ? (nameElement as HTMLElement).textContent || "" : "";
            packages.push(packageInfo);
        });
        return packages;
    });
}