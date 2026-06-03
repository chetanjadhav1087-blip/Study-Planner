import { Task } from "@/types/task";

import {
    getOverdueTasks,
    getDueTodayTasks,
    getDueThisWeekTasks,
} from "@/lib/taskStats";

export function useTaskStats(tasks: Task[]) {
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

    return {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        dueTodayTasks,
        dueThisWeekTasks,
    };
}