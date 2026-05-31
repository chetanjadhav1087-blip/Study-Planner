"use client";

import { useState } from "react";

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

type EditTaskDialogProps = {
  task: Task;

  onUpdateTask: (
    id: string,
    title: string,
    subject: string,
    dueDate: string
  ) => void;
};

export default function EditTaskDialog({
  task,
  onUpdateTask,
}: EditTaskDialogProps) {
  const [open, setOpen] =
    useState(false);

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
          onAddTask={(
            title,
            subject,
            dueDate
          ) => {
            onUpdateTask(
              task.id,
              title,
              subject,
              dueDate
            );

            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}