import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.jobs.findMany({ orderBy: { createdAt: "desc" } });
    const onGoingJobs = await prisma.jobs.findMany({
      where: { isComplete: false },
    });

    return NextResponse.json(
      {
        jobs,
        onGoingJobs: onGoingJobs?.length ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in job-details API:", error);

        return NextResponse.json(
            {
                message: "Database connection error. Please try again.",
                error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
            },
            { status: 500 }
  );}
}