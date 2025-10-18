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
                name: "",
                nights:0,
                days:0,
                price:0,
                inclusions:[]
            }
            const nameElement = packageElement.querySelector(
        ".package-name a"
      ) as HTMLAnchorElement;
      const href = nameElement.getAttribute("href");
      const packageIdMatch = href?.match(/packageId=([^&]+)/);
      packageInfo.id = packageIdMatch ? packageIdMatch[1] : null;

      // Extracting package name
      packageInfo.name =
        (packageElement.querySelector(".package-name a") as HTMLElement)
          .textContent || "";
            
            const pkgElement = packageElement.querySelector(".package-name a");
            console.log("Found name element:", pkgElement !== null);
            packageInfo.name = pkgElement ? (pkgElement as HTMLElement).textContent || "" : "";
            
            const durationElement = packageElement.querySelector(".package-duration")
            packageInfo.nights = parseInt((durationElement?.querySelector(".nights span") as HTMLElement)?.textContent || "0")
            packageInfo.days = parseInt((durationElement?.querySelector(".days span") as HTMLElement)?.textContent || "0")

            const inclusionsElement = packageElement.querySelector(".package-inclusions")
            const inclusionsItems = Array.from(inclusionsElement?.querySelectorAll("li") || []).map(item=>item.querySelector(".icon-name")?.textContent || "")
            packageInfo.inclusions=inclusionsItems;

            const priceElement = packageElement.querySelector(".final-price .amount")
            packageInfo.price = parseInt(priceElement?.textContent.replace(/,/g,"") || "0")
            packages.push(packageInfo);
        });
        return packages;
    });
}