"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import AddTaskForm from "./AddTaskForm";

import { createTask } from "@/app/actions/task-actions";

export default function AddTaskDialog() {
  const [open, setOpen] =
    useState(false);

  const router = useRouter();

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
          onAddTask={async (data) => {
            await createTask(data);

            setOpen(false);

            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}