"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createStudySession } from "@/app/actions/session-action";
import { useRouter } from "next/navigation";
import { playBuzzerSound } from "@/lib/audio";

const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds

type PomodoroTimerProps = {
    taskId: string;
};

export default function PomodoroTimer({ taskId }: PomodoroTimerProps) {
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [completed, setCompleted] = useState(false);
    const router = useRouter();

    // Use a ref to track completion to avoid setState-in-render issues
    const completedRef = useRef(false);

    // Handle side effects when timer completes
    useEffect(() => {
        if (!completed) return;
        setCompleted(false);
        completedRef.current = false;

        async function finish() {
            playBuzzerSound("end");
            await createStudySession(taskId, 25);
            router.refresh();
        }
        finish();
    }, [completed, taskId, router]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsRunning(false);
                    // Schedule completion via state, not inline
                    setCompleted(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((DEFAULT_TIME - timeLeft) / DEFAULT_TIME) * 100;

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Circular timer */}
            <div className="relative flex items-center justify-center">
                <svg width="72" height="72" className="-rotate-90">
                    <circle
                        cx="36"
                        cy="36"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-muted/40"
                    />
                    <circle
                        cx="36"
                        cy="36"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-1000"
                    />
                </svg>
                <span className="absolute text-xs font-bold tabular-nums">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
            </div>

            <div className="flex gap-1">
                <Button
                    size="sm"
                    variant={isRunning ? "secondary" : "default"}
                    disabled={isRunning || timeLeft === 0}
                    onClick={() => {
                        setIsRunning(true);
                        playBuzzerSound("start");
                    }}
                    className="text-xs h-7 px-2"
                >
                    Start
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsRunning(false)}
                    className="text-xs h-7 px-2"
                >
                    Pause
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                        setIsRunning(false);
                        setTimeLeft(DEFAULT_TIME);
                    }}
                    className="text-xs h-7 px-2"
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}