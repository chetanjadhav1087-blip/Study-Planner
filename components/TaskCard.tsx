"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { Task } from "@/src/types/task";

type TaskCardProp = {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({
    task,
    onToggle,
    onDelete,
}: TaskCardProp) {
    return (
        <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={task.completed}
                    onCheckedChange={() =>
                        onToggle(task.id)
                    }
                />

                <p
                    className={
                        task.completed
                            ? "line-through text-muted-foreground"
                            : ""
                    }
                >
                    {task.title}
                </p>
                <div className="text-sm text-muted-foreground">
                    <p>{task.subject}</p>
                    <p>Due: {task.dueDate}</p>
                </div>
            </div>

            <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(task.id)}
            >
                Delete
            </Button>
        </Card>
    );
}