//@ts-nocheck
import { DestinationDetailsType, DestinationItineraryType, DetailedItineraryType, PackageIteniaryType, } from "@/types/trips";
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
    detailedItinary: DetailedItineraryType[],
    destinationItinary: DestinationItineraryType[],
    destinationDetails: DestinationDetailsType[],
    packageItinerary: PackageIteniaryType[]



}

export const startPackageScraping = async (page: Page, pkg: PackageInfo) => {
    try {
        const packageDetails = await page.evaluate((regexSource) => {
            // Defensive, plain-JS DOM extraction to avoid runtime errors in the browser
            const packageDetails = {
                description: "",
                images: [],
                themes: [],
                detailedItinary: [],
                destinationItinary: [],
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
            detailedItinary: [],
            destinationItinary: [],
            destinationDetails: [],
            packageItinerary: []
        };
    }
}