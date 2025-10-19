import { NextResponse } from "next/server"

export const GET = async()=>{
    try {
        const trips = await prisma.trips.findMany({
            orderBy: {scrapedOn : "desc"}
        })
        if (trips) return NextResponse.json({trips},{status:200})
        else return NextResponse.json({msg:"No trips found!"},{status:404})
    } catch (error) {
        return NextResponse.json({message: "An unexpected error occured."},{status:500})
    }
}