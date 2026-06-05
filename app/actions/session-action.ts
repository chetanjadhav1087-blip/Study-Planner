"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createStudySession(
    taskId: string,
    duration: number
) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
    });

    if (task?.userId !== userId) {
        throw new Error("Unauthorized");
    }

    await prisma.studySession.create({
        data: {
            taskId,
            duration,
        },
    });

    revalidatePath("/");
}

export async function getTotalStudyTime() {
    const { userId } = await auth();
    if (!userId) return 0;

    const result = await prisma.studySession.aggregate({
        where: {
            task: {
                userId,
            },
        },
        _sum: {
            duration: true,
        }
    });

    return result._sum.duration ?? 0;
}

export async function getTodayStudyTime() {
    const { userId } = await auth();
    if (!userId) return 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await prisma.studySession.aggregate({
        where: {
            task: {
                userId,
            },
            createdAt: {
                gte: startOfDay,
            }
        },
        _sum: {
            duration: true,
        }
    });

    return result._sum.duration ?? 0;
}

export async function getWeekStudyTime() {
    const { userId } = await auth();
    if (!userId) return 0;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const result = await prisma.studySession.aggregate({
        where: {
            task: {
                userId,
            },
            createdAt: {
                gte: startOfWeek,
            },
        },
        _sum: {
            duration: true,
        },
    });

    return result._sum.duration ?? 0;
}

export async function getTotalSessions() {
    const { userId } = await auth();
    if (!userId) return 0;

    return prisma.studySession.count({
        where: {
            task: {
                userId,
            },
        },
    });
}

export async function getAverageSessionLength() {
    const { userId } = await auth();
    if (!userId) return 0;

    const result = await prisma.studySession.aggregate({
        where: {
            task: {
                userId,
            },
        },
        _avg: {
            duration: true,
        },
    });

    return Math.round(result._avg.duration ?? 0);
}

export async function getStudySessions() {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    return prisma.studySession.findMany({
        where: {
            task: {
                userId,
            },
        },
    });
}
