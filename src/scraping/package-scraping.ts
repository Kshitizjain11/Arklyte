//@ts-nocheck
import { DestinationDetailsType, DestinationItineraryType, DetailedItineraryType, PackageItineraryType, } from "@/types/trips";
import { Page } from "puppeteer";
interface PackageInfo {
    id: string | null,
    name: string,
    nights: number,
    days: number,
    inclusions: string[],
    price: number
}

/* keep the type shape for developer reference (used in other files) */
interface PackageDetailsType {
    description: string,
    images: string[],
    themes: string[],
    detailedItinerary: DetailedItineraryType[],
    destinationItinerary: DestinationItineraryType[],
    destinationDetails: DestinationDetailsType[],
    packageItinerary: PackageItineraryType[]



}

export const startPackageScraping = async (page: Page, pkg: PackageInfo) => {
    try {
        const packageDetails = await page.evaluate((regexSource) => {
            // Defensive, plain-JS DOM extraction to avoid runtime errors in the browser
            const packageDetails = {
                description: "",
                images: [],
                themes: [],
                detailedItinerary: [],
                destinationItinerary: [],
                destinationDetails: [],
                packageItinerary: []
            };
            try {
                const packageElement = document.querySelector('#main-container');
                if (!packageElement) return packageDetails;

                try {
                    const descriptionWrapper = packageElement.querySelector('#pkgOverView');
                    const readMore = descriptionWrapper ? descriptionWrapper.querySelector('.readMore') : null;
                    if (readMore && typeof (readMore as Element & { click?: unknown }).click === 'function') {
                        try { (readMore as Element & { click?: () => void }).click(); } catch { /* ignore */ }
                    }
                } catch (_) {
                    /* ignore DOM click errors */
                }

                const overview = packageElement.querySelector('#pkgOverView p');
                const rawHtml = overview && (overview as HTMLElement).innerHTML ? (overview as HTMLElement).innerHTML : '';
                try {
                    const regex = new RegExp(regexSource, 'gi');
                    packageDetails.description = rawHtml.replace(regex, 'Arklyte');
                } catch (_) {
                    packageDetails.description = rawHtml;
                }
                packageDetails.images = Array.from(
                packageElement?.querySelectorAll(".galleryThumbImg")
            ).map((imageElement) =>
                imageElement
                    .getAttribute("src")
                    ?.replace("/t_holidays_responsivedetailsthumbimg", "")
            ) as string[];

            const themeSelector = packageElement?.querySelector("#packageThemes");
            packageDetails.themes = Array.from(themeSelector?.querySelectorAll("li")).map((li)=>li.innerText.trim())

            // day Element
            const descriptions: DetailedItineraryType[] = [];

            const dayElements = packageElement?.querySelectorAll(
      ".itineraryOverlay .subtitle"
    );

    dayElements?.forEach((dayElement) => {
      const title = dayElement.textContent!.trim();
      const value = [];

      // Get the next sibling elements until the next day element
      let nextElement = dayElement.nextElementSibling;
      while (nextElement && !nextElement.classList.contains("subtitle")) {
        const textContent = nextElement.textContent!.trim();
        if (textContent) {
          value.push(textContent);
        }
        nextElement = nextElement.nextElementSibling;
      }

      // Push the title and value into the result array
      descriptions.push({ title, value });
    });
    console.log({ packageDetails });
    packageDetails.detailedItinerary = descriptions;

    const destinationItinerary : {place:string,totalNights:number}[] = []
    const destinationItinerarySelector = packageElement.querySelectorAll(".type-list li") 
    destinationItinerarySelector?.forEach((element) => { 
        const placeElement = element.firstChild;
        const placeText = placeElement?.textContent!.trim()
        .replace(/[\n\t]/g,"")
        const nightsElement = element.querySelector("span")
        let totalNights = 0
        if(nightsElement){
            const nightsText = nightsElement?.textContent!.trim()
            const nightsMatch = nightsText.match(/\d+/)
            totalNights = nightsMatch ? parseInt(nightsMatch[0]) : 0
        }
        destinationItinerary.push({place:placeText!,totalNights})
    })
    packageDetails.destinationItinerary = destinationItinerary

     const readMoreButton = document.getElementById("readMore")
     if(readMoreButton){
        readMoreButton.click()
     }

     const cities:{name:string;description:string,image:string}[] = []

     const cityElements = document.querySelectorAll(".tabbing a")
     cityElements.forEach((cityElement)=>{
        cityElement.click();
        const readMoreButtonCity = document.getElementById("readMore")
        if (readMoreButtonCity){
            readMoreButtonCity.click();
        }

        const cityName = cityElement?.textContent!.trim() || ""
        const cityDescription = document.getElementById("aboutDestPara")?.textContent!.trim() || ""
        const cityImage= document.querySelector(".info-block img")!.getAttribute("src") || ""
        cities.push({name:cityName,description:cityDescription,image:cityImage}) 

        packageDetails.destinationDetails = cities
            const dataExtracted: PackageIteniaryType[] = [];
            const timeline = document.querySelector(".time-line .right-column");
            const articles = timeline?.querySelectorAll("article");

            articles?.forEach((article)=>{
                const cityNameElement = article.querySelector(".title.row.acc-title .first.ng-binding");
                const cityName= cityNameElement ? cityNameElement?.textContent!.trim() : ""
                const daysSelector = article.querySelectorAll(".days.acc-content")
                const daysActivity:{
                    activityType : string,
                    activityDescription : string,
                }[][] = []

                daysSelector.forEach((daySelector)=>{
                    const activityElements = daySelector.querySelectorAll(".items-content")
                    const activities : {
                        activityType:string,
                        activityDescription:string,
                    }[] = []

                    if (activityElements.length > 0) {
          // Loop through each activity element
          activityElements.forEach((activityElement, index) => {
            // Extract activity type
            const activityTypeElement =
              activityElement.querySelector(".content.left.ico");
            const activityType = activityTypeElement
              ? activityTypeElement
                  ?.textContent!.trim()
                  .split(" ")[0]
                  .split(" ")[0]
                  .split("\n")[0]
              : `Activity ${index + 1}`;

            let activityDescription = null;

            if (activityType === "MEAL" || activityType === "SIGHTSEEING") {
              const listHolder = activityElement.querySelector(".list-holder");

              // Check if the list-holder element exists
              if (listHolder) {
                // Extract li elements
                const liElements = listHolder.querySelectorAll("li.ng-scope");

                // Check if any li elements exist
                if (liElements.length > 0) {
                  // Create an array to store scraped data
                  const scrapedData: { index: number; text: string }[] = [];

                  // Loop through each li element and extract text content
                  liElements.forEach((liElement, index) => {
                    const liText = liElement?.textContent!.trim();
                    scrapedData.push({ index: index + 1, text: liText });
                  });

                  // Log the scraped data
                  activityDescription = scrapedData;
                }
              }
            } else if (activityType === "HOTEL") {
              // Extract activity description
              const activityDescriptionElement = activityElement.querySelector(
                ".content.right .name a"
              );
              activityDescription = activityDescriptionElement
                ? activityDescriptionElement?.textContent!.trim()
                : null;
            } else if (activityType === "FLIGHT") {
              const places =
                activityElement.querySelectorAll(".place span.full");

              const scrappedData: string[] = [];
              places.forEach((place) => {
                scrappedData.push(place?.textContent!.trim());
              });
              activityDescription = scrappedData;
            }
            // Log the results

            activities.push({ activityType, activityDescription });
          });
        }
        daysActivity.push(activities);
      });

      dataExtracted.push({
        city: cityName,
        daysActivity,
      });
    });

    packageDetails.packageItinerary = dataExtracted;
                })

            

        } catch (_) {
                // If anything unexpected happens, return the empty structure
            }

            return packageDetails;
        }, 'Yatra');

        const details = { ...pkg, ...packageDetails };
        return details;
    } catch (err) {
        // If evaluate fails, log and return a best-effort object merging the incoming pkg
        console.error("startPackageScraping.evaluate failed:", err);
        return {
            ...pkg,
            description: "",
            images: [],
            themes: [],
            detailedItinerary: [],
            destinationItinerary: [],
            destinationDetails: [],
            packageItinerary: []
        };
    }
}