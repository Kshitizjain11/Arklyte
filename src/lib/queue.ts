import type { Queue as BullQueue, JobsOptions } from "bullmq";

let jobsQueue: BullQueue | null = null;

async function createQueue(): Promise<BullQueue> {
    if (jobsQueue) return jobsQueue;
    // dynamic import so bundlers don't include bullmq in client bundles
    const [{ Queue }, { connection }] = await Promise.all([
        import("bullmq"),
        import("./redis"),
    ]);

    jobsQueue = new Queue("jobsQueue", {
        connection,
        defaultJobOptions: {
            attempts: 2,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
        },
    });

    return jobsQueue;
}

export async function addJob(name: string, data: unknown, opts?: JobsOptions) {
    const q = await createQueue();
    // jobs payload should be a plain object
    const payload = (data ?? {}) as Record<string, unknown>;
    return q.add(name, payload, opts);
}

export async function getQueue() {
    return await createQueue();
}