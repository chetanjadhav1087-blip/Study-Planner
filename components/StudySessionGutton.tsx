"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createStudySession } from "@/app/actions/session-action";
import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";

type StudySessionButtonProps = {
    taskId: string;
};

export default function StudySessionButton({ taskId }: StudySessionButtonProps) {
    const [duration, setDuration] = useState("25");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleStudySession() {
        startTransition(async () => {
            await createStudySession(taskId, Number(duration));
            router.refresh();
        });
    }

    return (
        <div className="flex items-center gap-1.5">
            <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-8 w-[90px] text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="25">25 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
            </Select>

            <Button
                size="sm"
                onClick={handleStudySession}
                disabled={isPending}
                className="h-8 gap-1 text-xs"
            >
                {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Play className="h-3 w-3" />
                )}
                {isPending ? "Saving…" : "Log"}
            </Button>
        </div>
    );
}