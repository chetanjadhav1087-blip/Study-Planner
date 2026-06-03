"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CreateTaskInput = {
  title: string;
  subject: string;
  dueDate: string;
};

export async function createTask(
  data: CreateTaskInput
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.task.create({
    data: {
      title: data.title,
      subject: data.subject,
      dueDate: new Date(data.dueDate),
      userId,
    },
  });

  revalidatePath("/");
}

export async function getTasks() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  return prisma.task.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteTask(id: string) {
  const { userId } = await auth();

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (task?.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: {
      id,
    },
  });
  revalidatePath("/");
}

export async function toggle(id: string, completed: boolean) {

  const { userId } = await auth();
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (task?.userId !== userId) {
    throw new Error("Unauthorized");
  }
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
  const { userId } = await auth();
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (task?.userId !== userId) {
    throw new Error("Unauthorized");
  }
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