"use client"

import { useState } from "react";

import Navbar from "@/components/Navbar";
import AddTaskForm from "@/components/AddTaskForm";
import TaskCard from "@/components/TaskCard";

import { Task } from "@/src/task/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]> ([]);

  function addTask(
    title: string,
    subject: string,
    dueDate: string,
  ) {
    const newTask: Task = {
      id: Date.now(),
      title,
      subject,
      dueDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);
  }

  function toggleTask(id: number){
    const updateedTask = tasks.map((task) => 
      task.id === id ? {
        ...task, completed: !task.completed,
      } :
      task
    );

    setTasks(updateedTask);
  }

  function deleteTask(id: number) {
    const filteredTask = tasks.filter((task) => 
      task.id !== id
    );

    setTasks(filteredTask);
  }
  return (
     <main className="min-h-screen">
      <Navbar />

      <div className="max-w-xl mx-auto p-6 space-y-6">
        <AddTaskForm onAddTask={addTask} />

        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>
    </main>
  );
}