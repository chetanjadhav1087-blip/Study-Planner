"use client"

import { useState } from "react";

import Navbar from "@/components/Navbar";
// import AddTaskForm from "@/components/AddTaskForm";
import AddTaskDialog from "@/components/AddTaskDialog";
import TaskCard from "@/components/TaskCard";
import StatsCard from "@/components/StatsCard";

import { Button } from "@/components/ui/button";

import { Filter } from "@/src/types/filter";

import { useTasks } from "@/src/hooks/useTasks";
import { useFilteredTasks } from "@/src/hooks/useFilteredTasks";

export default function Home() {
  // const [tasks, setTasks] = useState<Task[]>([]);
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTasks = useFilteredTasks(tasks, filter);
  // const [filter, setFilter] = useState<Filter>("all");

  // useEffect(() => {
  //   const savedTasks = localStorage.getItem('tasks');

  //   if (savedTasks) {
  //     setTasks(JSON.parse(savedTasks));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('tasks', JSON.stringify(tasks));
  // }, [tasks])

  // function addTask(
  //   title: string,
  //   subject: string,
  //   dueDate: string,
  // ) {
  //   const newTask: Task = {
  //     id: crypto.randomUUID(),
  //     title,
  //     subject,
  //     dueDate,
  //     completed: false,
  //   };

  //   setTasks([...tasks, newTask]);
  // }

  // function toggleTask(id: string) {
  //   const updatedTask = tasks.map((task) =>
  //     task.id === id ? {
  //       ...task, completed: !task.completed,
  //     } :
  //       task
  //   );

  //   setTasks(updatedTask);
  // }

  // function deleteTask(id: string) {
  //   const filteredTask = tasks.filter((task) =>
  //     task.id !== id
  //   );

  //   setTasks(filteredTask);
  // }

  // const filteredTask = tasks.filter(
  //   (task) => {
  //     if (filter === 'pending') {
  //       return !task.completed;
  //     }
  //     if (filter === 'completed') {
  //       return task.completed;
  //     }

  //     return true;
  //   }
  // );

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  function completionRate(){
    if(totalTasks !== 0){
      return (completedTasks/totalTasks)*100;
    }
  }
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
          />

          <StatsCard
            title="Completed"
            value={completedTasks}
          />
          <span>{completionRate()}%</span>

          <StatsCard
            title="Pending"
            value={pendingTasks}
          />
        </div>

        <AddTaskDialog onAddTask={addTask} />

        <div className="flex gap-2">
          <Button
            variant={
              filter === "all"
                ? "default"
                : "outline"
            }
            onClick={() => setFilter("all")}
          >
            <span>All({totalTasks})</span>
          </Button>

          <Button
            variant={
              filter === "pending"
                ? "default"
                : "outline"
            }
            onClick={() => setFilter("pending")}
          >
            <span>Pending({pendingTasks})</span>
          </Button>

          <Button
            variant={
              filter === "completed"
                ? "default"
                : "outline"
            }
            onClick={() => setFilter("completed")}
          >
            <span>Completed({completedTasks})</span>
            
          </Button>
        </div>

        <div className="space-y-2">
          {filteredTasks.map((task) => (
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