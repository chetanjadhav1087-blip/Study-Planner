"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddTaskForm from "./AddTaskForm";

import { Task } from "@/types/task";

import { updateTask } from "@/app/actions/task-actions";

type EditTaskDialogProps = {
  task: Task;
};

export default function EditTaskDialog({
  task,
}: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <AddTaskForm
          initialTitle={task.title}
          initialSubject={task.subject}
          initialDueDate={task.dueDate}
          onAddTask={async (data) => {
            await updateTask(
              task.id,
              data.title,
              data.subject,
              data.dueDate
            );

            setOpen(false);

            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}