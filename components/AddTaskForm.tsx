"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type AddTaskFormProps = {
  onAddTask: (data: {
    title: string;
    subject: string;
    dueDate: string;
  }) => Promise<void> | void;

  initialTitle?: string;
  initialSubject?: string;
  initialDueDate?: string;
};

export default function AddTaskForm({
  onAddTask,
  initialDueDate,
  initialSubject,
  initialTitle,
}: AddTaskFormProps) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [dueDate, setDueDate] = useState(initialDueDate ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onAddTask({ title, subject, dueDate });
      setTitle("");
      setSubject("");
      setDueDate("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="task-title">Task</Label>
        <Input
          id="task-title"
          type="text"
          placeholder="e.g. Complete chapter 5 exercises"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-subject">Subject</Label>
        <Input
          id="task-subject"
          type="text"
          placeholder="e.g. Mathematics"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="task-due">Due Date</Label>
        <Input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Saving…
          </>
        ) : (
          initialTitle ? "Save Changes" : "Add Task"
        )}
      </Button>
    </form>
  );
}