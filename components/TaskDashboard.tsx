"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import AddTaskDialog from "@/components/AddTaskDialog";
import TaskCard from "@/components/TaskCard";
import TaskPieChart from "@/components/TaskPieChart";
import AIChatBot from "@/components/AIChatBot";

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

import { StudySession } from "@prisma/client";

import {
    getTotalStudyTime,
    getAverageSessionDuration,
} from "@/lib/studyAnalytics";

import {
    getOverdueTasks,
    getDueTodayTasks,
    getDueThisWeekTasks,
} from "@/lib/taskStats";

import {
    CheckCircle2,
    Clock,
    AlertCircle,
    CalendarClock,
    CalendarDays,
    ListTodo,
    Activity,
    Search,
    SortAsc,
} from "lucide-react";

type TaskDashboardProps = {
    tasks: Task[];
    sessions: StudySession[];
};

export default function TaskDashboard({ tasks, sessions }: TaskDashboardProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("dueDate");

    const filteredTasks = useFilteredTasks(tasks, filter);

    const searchTasks = filteredTasks.filter(
        (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.subject.toLowerCase().includes(search.toLowerCase())
    );

    const totalStudyTime = getTotalStudyTime(sessions);
    const averageSessionDuration = getAverageSessionDuration(sessions);
    const totalSessions = sessions.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const overdueTasks = getOverdueTasks(tasks);
    const dueTodayTasks = getDueTodayTasks(tasks);
    const dueThisWeekTasks = getDueThisWeekTasks(tasks);

    const sortedTasks = [...searchTasks].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "completed":
                return Number(b.completed) - Number(a.completed);
            case "dueDate":
            default:
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
    });

    const filterButtons: { label: string; value: Filter; count: number }[] = [
        { label: "All", value: "all", count: totalTasks },
        { label: "Pending", value: "pending", count: pendingTasks },
        { label: "Done", value: "completed", count: completedTasks },
    ];

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Track your tasks, study sessions, and progress.
                    </p>
                </div>

                {/* Stats and Analytics Dashboard */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            Overview
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <StatsCard title="Total Tasks" value={totalTasks} icon={ListTodo} />
                            <StatsCard title="Completed" value={completedTasks} icon={CheckCircle2} accent="linear-gradient(135deg,#10b981,#06b6d4)" />
                            <StatsCard title="Pending" value={pendingTasks} icon={Clock} accent="linear-gradient(135deg,#f59e0b,#f97316)" />
                            <StatsCard title="Overdue" value={overdueTasks.length} icon={AlertCircle} accent="linear-gradient(135deg,#ef4444,#f43f5e)" />
                            <StatsCard title="Due Today" value={dueTodayTasks.length} icon={CalendarClock} accent="linear-gradient(135deg,#8b5cf6,#6366f1)" />
                            <StatsCard title="This Week" value={dueThisWeekTasks.length} icon={CalendarDays} />
                            <StatsCard title="Study Time" value={`${totalStudyTime} min`} icon={Clock} accent="linear-gradient(135deg,#6366f1,#8b5cf6)" />
                            <StatsCard title="Sessions" value={totalSessions} icon={Activity} accent="linear-gradient(135deg,#ec4899,#f43f5e)" />
                            <StatsCard title="Avg Session" value={`${averageSessionDuration} min`} icon={Activity} />
                        </div>
                    </div>
                    <div className="md:col-span-1 flex flex-col justify-end">
                        <TaskPieChart tasks={tasks} />
                    </div>
                </section>

                {/* Controls */}
                <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        {/* Filter pills */}
                        <div className="flex gap-2 flex-wrap">
                            {filterButtons.map(({ label, value, count }) => (
                                <Button
                                    key={value}
                                    size="sm"
                                    variant={filter === value ? "default" : "outline"}
                                    onClick={() => setFilter(value)}
                                    className="rounded-full"
                                >
                                    {label}
                                    <span className={`ml-1.5 text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                                        filter === value ? "bg-primary-foreground/20" : "bg-muted"
                                    }`}>
                                        {count}
                                    </span>
                                </Button>
                            ))}
                        </div>

                        <AddTaskDialog />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Search tasks or subjects…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                            <SelectTrigger className="w-full sm:w-[180px] gap-1">
                                <SortAsc className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dueDate">Due Date</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="completed">Completed First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                {/* Task list */}
                <section className="space-y-3">
                    {sortedTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                            <ListTodo className="h-10 w-10 mb-3 opacity-30" />
                            <p className="font-medium">No tasks found</p>
                            <p className="text-sm mt-1">
                                {search ? "Try a different search term." : "Add your first task above."}
                            </p>
                        </div>
                    ) : (
                        sortedTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={() => {}}
                                onDelete={() => {}}
                            />
                        ))
                    )}
                </section>
            </div>

            <AIChatBot />
        </main>
    );
}