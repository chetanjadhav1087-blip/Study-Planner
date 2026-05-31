/*
TODO :
Move 
totalTasks
completedTasks
pendingTasks
overdueTasks
dueTodayTasks
dueThisWeekTasks

to src/hooks/useTaskStats.ts
and return 
{
  totalTasks,
  completedTasks,
  pendingTasks,
  overdueTasks,
  dueTodayTasks,
  dueThisWeekTasks
}
*/

"use client"

import { useState } from "react";

import Navbar from "@/components/Navbar";
// import AddTaskForm from "@/components/AddTaskForm";
import AddTaskDialog from "@/components/AddTaskDialog";
import TaskCard from "@/components/TaskCard";
import StatsCard from "@/components/StatsCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Filter } from "@/types/filter";
import { SortOption } from "@/types/SortOption";

import { useTasks } from "@/hooks/useTasks";
import { useFilteredTasks } from "@/hooks/useFilteredTasks";

import {
  getOverdueTasks,
  getDueTodayTasks,
  getDueThisWeekTasks
} from "@/lib/taskStats";

export default function Home() {
  const [search, setSearch] = useState("");
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  

  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");

  const filteredTasks = useFilteredTasks(tasks, filter);
  const searchTasks = filteredTasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    task.subject
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  function completionRate() {
    if (totalTasks !== 0) {
      return (completedTasks / totalTasks) * 100;
    }
  }

  const sortedTasks = [...searchTasks].sort(
    (a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );

        case "oldest":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "completed":
          return Number(b.completed) -
            Number(a.completed);

        case "dueDate":
        default:
          return (
            new Date(a.dueDate).getTime() -
            new Date(b.dueDate).getTime()
          );
      }
    }
  );

  const overdueTasks =
    getOverdueTasks(tasks);

  const dueTodayTasks =
    getDueTodayTasks(tasks);

  const dueThisWeekTasks =
    getDueThisWeekTasks(tasks);
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

          <StatsCard
            title="Overdue"
            value={overdueTasks.length}
          />

          <StatsCard
            title="Due Today"
            value={dueTodayTasks.length}
          />

          <StatsCard
            title="Due This Week"
            value={dueThisWeekTasks.length}
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

        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as SortOption)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort Tasks" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="dueDate">
              Due Date
            </SelectItem>

            <SelectItem value="newest">
              Newest
            </SelectItem>

            <SelectItem value="oldest">
              Oldest
            </SelectItem>

            <SelectItem value="completed">
              Completed First
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdateTask={updateTask}
            />
          ))}
        </div>
      </div>
    </main>
  );
}