"use client";

import { useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTaskFormProps = {
  onAddTask: (
    title: string,
    subject: string,
    dueDate: string
  ) => void;
};

export default function AddTaskForm({
  onAddTask,
}: AddTaskFormProps) {

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    e.preventDefault();

    if (!title.trim()) return;

    onAddTask(title, subject, dueDate);

    setTitle("");
    setSubject("");
    setDueDate("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
    >
      <Input
        type="text"
        placeholder="Enter your task..."
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <Input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) =>
          setSubject(e.target.value)
        }
      />

      <Input
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
      />

      <Button type="submit">
        Add
      </Button>
    </form>
  );
}