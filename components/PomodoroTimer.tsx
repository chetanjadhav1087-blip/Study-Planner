"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { createStudySession } from "@/app/actions/session-action";

import { useRouter }
    from "next/navigation";

const DEFAULT_TIME = 25 * 60;

type PomodoroTimerProps = {
    taskId: string;
};

export default function PomodoroTimer({
    taskId,
}: PomodoroTimerProps) {
    const [timeLeft, setTimeLeft] =
        useState(DEFAULT_TIME);

    const [isRunning, setIsRunning] =
        useState(false);

    const router = useRouter();

    async function handlePomodoroComplete() {
        await createStudySession(
            taskId,
            25
        );

        router.refresh();
    }

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);

                    setIsRunning(false);

                    handlePomodoroComplete();

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () =>
            clearInterval(interval);
    }, [isRunning]);

    const minutes = Math.floor(
        timeLeft / 60
    );

    const seconds =
        timeLeft % 60;

    return (
        <div className="space-y-2">
            <div className="text-2xl font-bold">
                {minutes}
                :
                {seconds
                    .toString()
                    .padStart(2, "0")}
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={() =>
                        setIsRunning(true)
                    }
                >
                    Start
                </Button>

                <Button
                    variant="outline"
                    onClick={() =>
                        setIsRunning(false)
                    }
                >
                    Pause
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => {
                        setIsRunning(false);
                        setTimeLeft(
                            DEFAULT_TIME
                        );
                    }}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}