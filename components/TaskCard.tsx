"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Task } from "@/types/task";

import EditTaskDialog from "./EditTaskDialog";
import { deleteTask, toggle } from "@/app/actions/task-actions";

import { useRouter } from "next/navigation";

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

    const isOverdue =
        !task.completed &&
        new Date(task.dueDate) < new Date();

    const router = useRouter();

    return (
        <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={task.completed}
                    onCheckedChange={async () => {
                        await toggle(
                            task.id,
                            task.completed
                        );
                        router.refresh();
                    }}
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
                />

                <Button
                    variant="destructive"
                    onClick={async () => {
                        await deleteTask(task.id);

                        router.refresh();
                    }}
                >
                    Delete
                </Button>
            </div>


        </Card>
    );
}