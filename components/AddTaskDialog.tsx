"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import AddTaskForm from "./AddTaskForm";

type AddTaskDialogProps = {
  onAddTask: (
    title: string,
    subject: string,
    dueDate: string
  ) => void;
};

export default function AddTaskDialog({
  onAddTask,
}: AddTaskDialogProps) {
  const [open, setOpen] =
    useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <AddTaskForm
          onAddTask={(
            title,
            subject,
            dueDate
          ) => {
            onAddTask(
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