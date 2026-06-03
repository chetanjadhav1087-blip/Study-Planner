import TaskDashboard
  from "@/components/TaskDashboard";

import { getTasks }
  from "./actions/task-actions";

import { mapTask }
  from "@/lib/task-mapper";

import {
  getTodayStudyTime,
  getTotalStudyTime,
  getWeekStudyTime,
  getAverageSessionLength,
  getTotalSessions,
} from "./actions/session-action";

import StudyStats from "@/components/StudyStats";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StudyAnalytics from "@/components/StudyAnalytics";


export default async function Home() {
  const { userId } = await auth();

  const totalStudyTime =
    await getTotalStudyTime();

  const todayStudyTime =
    await getTodayStudyTime();

  const weekStudyTime =
    await getWeekStudyTime();

  const totalSessions =
    await getTotalSessions();

  const averageSession =
    await getAverageSessionLength();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbTasks =
    await getTasks();

  const tasks =
    dbTasks.map(mapTask);

  return (
    <>
      <TaskDashboard
        tasks={tasks}
      />

      <StudyStats
        total={totalStudyTime}
        today={todayStudyTime}
        week={weekStudyTime}
      />

      <StudyAnalytics
        totalStudyTime={totalStudyTime}
        totalSessions={totalSessions}
        averageSession={averageSession}
      />
    </>
  );
}