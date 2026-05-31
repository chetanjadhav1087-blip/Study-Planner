"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import AddTaskDialog from "@/components/AddTaskDialog";
import TaskCard from "@/components/TaskCard";

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
import { Task } from "@/types/task";

import { useFilteredTasks } from "@/hooks/useFilteredTasks";

import {
    getOverdueTasks,
    getDueTodayTasks,
    getDueThisWeekTasks,
} from "@/lib/taskStats";

type TaskDashboardProps = {
    tasks: Task[];
};

export default function TaskDashboard({
    tasks,
}: TaskDashboardProps) {
    const [search, setSearch] = useState("");

    const [filter, setFilter] =
        useState<Filter>("all");

    const [sortBy, setSortBy] =
        useState<SortOption>("dueDate");

    const filteredTasks =
        useFilteredTasks(tasks, filter);

    const searchTasks =
        filteredTasks.filter(
            (task) =>
                task.title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                task.subject
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );

    const totalTasks = tasks.length;

    const completedTasks =
        tasks.filter(
            (task) => task.completed
        ).length;

    const pendingTasks =
        tasks.filter(
            (task) => !task.completed
        ).length;

    const overdueTasks =
        getOverdueTasks(tasks);

    const dueTodayTasks =
        getDueTodayTasks(tasks);

    const dueThisWeekTasks =
        getDueThisWeekTasks(tasks);

    const sortedTasks =
        [...searchTasks].sort(
            (a, b) => {
                switch (sortBy) {
                    case "newest":
                        return (
                            new Date(
                                b.createdAt
                            ).getTime() -
                            new Date(
                                a.createdAt
                            ).getTime()
                        );

                    case "oldest":
                        return (
                            new Date(
                                a.createdAt
                            ).getTime() -
                            new Date(
                                b.createdAt
                            ).getTime()
                        );

                    case "completed":
                        return (
                            Number(
                                b.completed
                            ) -
                            Number(
                                a.completed
                            )
                        );

                    case "dueDate":
                    default:
                        return (
                            new Date(
                                a.dueDate
                            ).getTime() -
                            new Date(
                                b.dueDate
                            ).getTime()
                        );
                }
            }
        );

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-xl mx-auto p-6 space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatsCard
                        title="Total Tasks"
                        value={totalTasks}
                    />

                    <StatsCard
                        title="Completed"
                        value={completedTasks}
                    />

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

                {/* Add Task */}
                <AddTaskDialog />

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={
                            filter === "all"
                                ? "default"
                                : "outline"
                        }
                        onClick={() =>
                            setFilter("all")
                        }
                    >
                        All ({totalTasks})
                    </Button>

                    <Button
                        variant={
                            filter === "pending"
                                ? "default"
                                : "outline"
                        }
                        onClick={() =>
                            setFilter("pending")
                        }
                    >
                        Pending ({pendingTasks})
                    </Button>

                    <Button
                        variant={
                            filter ===
                                "completed"
                                ? "default"
                                : "outline"
                        }
                        onClick={() =>
                            setFilter(
                                "completed"
                            )
                        }
                    >
                        Completed (
                        {completedTasks})
                    </Button>
                </div>

                {/* Sort */}
                <Select
                    value={sortBy}
                    onValueChange={(
                        value
                    ) =>
                        setSortBy(
                            value as SortOption
                        )
                    }
                >
                    <SelectTrigger className="w-[220px]">
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

                {/* Search */}
                <Input
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                {/* Task List */}
                <div className="space-y-2">
                    {sortedTasks.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            No tasks found
                        </div>
                    ) : (
                        sortedTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={() => { }}
                                onDelete={() => { }}
                            />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}