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
import { Pencil } from "lucide-react";

type EditTaskDialogProps = {
  task: Task;
};

export default function EditTaskDialog({ task }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <AddTaskForm
          initialTitle={task.title}
          initialSubject={task.subject}
          initialDueDate={task.dueDate}
          onAddTask={async (data) => {
            await updateTask(task.id, data.title, data.subject, data.dueDate);
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}