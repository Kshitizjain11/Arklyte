import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"
import { addJob } from "@/lib/queue";

export async function POST(request:Request)
{
    try {
        const {url,jobType} = await request.json()
        const response = await prisma.jobs.create({data: {url,jobType}})
    await addJob("new location", { url, jobType, id: response.id });
        return NextResponse.json({jobCreated: true},{status:201})
        
               
        } catch (error) {
                console.error('create-job error', error);
                return NextResponse.json(
                            { message: "An unexpected Error occured" },
                            { status: 500 }
                        );
    }
}
