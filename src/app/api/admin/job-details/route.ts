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

    // Workaround for Postgres 'prepared statement already exists' (42P05)
  const msg = error && typeof error === 'object' && 'message' in error ? (error as { message?: string }).message : String(error);
    if (typeof msg === 'string' && msg.includes('prepared statement')) {
      try {
        // create a temporary Prisma client and retry once
        const { PrismaClient } = await import('../../../../generated/prisma');
        const tempPrisma = new PrismaClient();
        try {
          const jobs = await tempPrisma.jobs.findMany({ orderBy: { createdAt: 'desc' } });
          const onGoingJobs = await tempPrisma.jobs.findMany({ where: { isComplete: false } });
          return NextResponse.json({ jobs, onGoingJobs: onGoingJobs?.length ?? 0 }, { status: 200 });
        } finally {
          await tempPrisma.$disconnect();
        }
      } catch (retryErr) {
        console.error('Retry with temporary PrismaClient failed:', retryErr);
      }
    }

    return NextResponse.json(
      {
        message: 'Database connection error. Please try again.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}