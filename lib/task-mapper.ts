import { Task as PrismaTask } from "@prisma/client";
import { Task } from "@/types/task";

export function mapTask(
  task: PrismaTask
): Task {
  return {
    id: task.id,
    title: task.title,
    subject: task.subject,
    dueDate: task.dueDate.toISOString(),
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
  };
}