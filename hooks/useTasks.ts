import { useState, useEffect } from "react";

import { Task } from "../types/task";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");

        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function addTask(
        title: string,
        subject: string,
        dueDate: string,
    ) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            subject,
            dueDate,
            completed: false,
            createdAt: new Date().toUTCString(),
        };

        setTasks((prev) => [...prev, newTask,]);
    }

    function toggleTask(id: string) {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        completed:
                            !task.completed,
                    }
                    : task
            )
        );
    }

    function deleteTask(id: string) {
        setTasks((prev) =>
            prev.filter(
                (task) => task.id !== id
            )
        );
    }

    function updateTask(
        id: string,
        title: string,
        subject: string,
        dueDate: string
    ) {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        title,
                        subject,
                        dueDate,
                    }
                    : task
            )
        );
    }

    return {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
    };
}