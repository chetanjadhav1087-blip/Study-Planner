"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


type CreateTaskInput = {
  title: string;
  subject: string;
  dueDate: string;
};

export async function createTask(
  data: CreateTaskInput
) {
  await prisma.task.create({
    data: {
      title: data.title,
      subject: data.subject,
      dueDate: new Date(data.dueDate),
    },
  });

  revalidatePath("/");
}

export async function getTasks() {
  return prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteTask(id: string) {
    await prisma.task.delete({
        where: { id },
    });
    revalidatePath("/");
}

export async function toggle(id: string, completed: boolean) {
    await prisma.task.update({
        where: { id },
        data: {
            completed: !completed,
        },
    });
    revalidatePath("/");
}

export async function updateTask(
  id: string,
  title: string,
  subject: string,
  dueDate: string
) {
  await prisma.task.update({
    where: { id },
    data: {
      title,
      subject,
      dueDate: new Date(dueDate),
    },
  });

  revalidatePath("/");
}