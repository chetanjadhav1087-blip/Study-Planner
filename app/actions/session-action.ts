"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStudySession(
    taskId: string,
    duration: number
) {
    await prisma.studySession.create({
        data: {
            taskId,
            duration,
        },
    });

    revalidatePath("/");
}

export async function getTotalStudyTime() {
    const result =
        await prisma.studySession.aggregate({
            _sum: {
                duration: true,
            }
        });

    return result._sum.duration ?? 0;
}

export async function getTodayStudyTime() {
    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0,);

    const result = await prisma.studySession.aggregate({
        where: {
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
    const today = new Date();

    const startOfWeek =
        new Date(today);

    startOfWeek.setDate(
        today.getDate() -
        today.getDay()
    );

    startOfWeek.setHours(
        0,
        0,
        0,
        0
    );

    const result =
        await prisma.studySession.aggregate({
            where: {
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
    return prisma.studySession.count();
}

export async function getAverageSessionLength() {
    const result =
        await prisma.studySession.aggregate({
            _avg: {
                duration: true,
            },
        });

    return Math.round(
        result._avg.duration ?? 0
    );
}
