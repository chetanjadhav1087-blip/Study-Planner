"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Task } from "@/types/task";

import EditTaskDialog from "./EditTaskDialog";

type TaskCardProp = {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateTask: (
        id: string,
        title: string,
        subject: string,
        dueDate: string
    ) => void;
}

export default function TaskCard({
    task,
    onToggle,
    onDelete,
    onUpdateTask,
}: TaskCardProp) {

    const isOverdue =
        !task.completed &&
        new Date(task.dueDate) < new Date();

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

                {isOverdue && (
                    <Badge variant="destructive">
                        OVERDUE
                    </Badge>
                )}
                <div className="text-sm text-muted-foreground">
                    <p>{task.subject}</p>
                    <p>Due: {task.dueDate}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <EditTaskDialog
                    task={task}
                    onUpdateTask={onUpdateTask}
                />

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                        onDelete(task.id)
                    }
                >
                    Delete
                </Button>
            </div>


        </Card>
    );
}