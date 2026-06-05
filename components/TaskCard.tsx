"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StudySessionButton from "./StudySessionGutton";
import PomodoroTimer from "./PomodoroTimer";
import EditTaskDialog from "./EditTaskDialog";

import { Task } from "@/types/task";
import { deleteTask, toggle } from "@/app/actions/task-actions";
import { useRouter } from "next/navigation";

import { CalendarDays, Clock, Trash2, BookOpen } from "lucide-react";

type TaskCardProp = {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

export default function TaskCard({ task }: TaskCardProp) {
    const [isOverdue, setIsOverdue] = useState(false);
    const [showPomodoro, setShowPomodoro] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsOverdue(!task.completed && new Date(task.dueDate) < new Date());
    }, [task.completed, task.dueDate]);

    const formattedDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "No date";

    return (
        <Card
            className={`p-4 border transition-all duration-200 hover:shadow-md group ${
                task.completed
                    ? "opacity-60 border-border/40"
                    : isOverdue
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border/60 hover:border-primary/30"
            }`}
        >
            {/* Top row: checkbox + title + badges */}
            <div className="flex items-start gap-3">
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    className="mt-0.5 shrink-0"
                    onCheckedChange={async () => {
                        await toggle(task.id, task.completed);
                        router.refresh();
                    }}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <label
                            htmlFor={`task-${task.id}`}
                            className={`font-medium leading-snug cursor-pointer select-none ${
                                task.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                            }`}
                        >
                            {task.title}
                        </label>

                        {isOverdue && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                Overdue
                            </Badge>
                        )}
                        {task.completed && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                Done
                            </Badge>
                        )}
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {task.subject && (
                            <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {task.subject}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {formattedDate}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    <EditTaskDialog task={task} />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                            await deleteTask(task.id);
                            router.refresh();
                        }}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Bottom row: study session + pomodoro toggle */}
            <div className="mt-3 pt-3 border-t border-border/40 flex flex-wrap items-center gap-3">
                <StudySessionButton taskId={task.id} />

                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs gap-1 text-muted-foreground"
                    onClick={() => setShowPomodoro((p) => !p)}
                >
                    <Clock className="h-3 w-3" />
                    {showPomodoro ? "Hide Timer" : "Pomodoro"}
                </Button>
            </div>

            {showPomodoro && (
                <div className="mt-3 pt-3 border-t border-border/40 flex justify-center">
                    <PomodoroTimer taskId={task.id} />
                </div>
            )}
        </Card>
    );
}