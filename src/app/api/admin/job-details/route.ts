import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request : Request)
{
    try {
        const jobs = await prisma.jobs.findMany({orderBy:{createdAt : "desc"}})
        const onGoingJobs = await prisma.jobs.findMany({where : {isComplete : false}})
        return NextResponse.json({jobs,onGoingJobs:onGoingJobs?.length ?? 0},{status:200})
    } catch (error) {
        return NextResponse.json(
      { message: "An unexpected Error occured" },
      { status: 500 }
    );
    }
}