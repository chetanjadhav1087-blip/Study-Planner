"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { createStudySession } from "@/app/actions/session-action";
type StudySessionButtonProps = {
    taskId: string;
};

export default function StudySessionButton({
    taskId,
}: StudySessionButtonProps) {
    const [duration, setDuration] =
        useState(25);

    const [isPending, startTransition] =
        useTransition();

    function handleStudySession() {
        startTransition(async () => {
            await createStudySession(
                taskId,
                duration
            );
        });
    }

    return (
        <div className="flex gap-2 items-center">
            <select
                value={duration}
                onChange={(e) =>
                    setDuration(
                        Number(e.target.value)
                    )
                }
                className="border rounded px-2 py-1"
            >
                <option value={15}>15 min</option>
                <option value={25}>25 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
            </select>

            <Button
                onClick={handleStudySession}
                disabled={isPending}
            >
                {isPending
                    ? "Saving..."
                    : "Study"}
            </Button>
        </div>
    );
}