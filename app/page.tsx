import TaskDashboard from "@/components/TaskDashboard";
import { getTasks } from "./actions/task-actions";
import { mapTask } from "@/lib/task-mapper";
import {
  getTodayStudyTime,
  getTotalStudyTime,
  getWeekStudyTime,
  getAverageSessionLength,
  getTotalSessions,
  getStudySessions,
} from "./actions/session-action";
import StudyStats from "@/components/StudyStats";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StudyAnalytics from "@/components/StudyAnalytics";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [
    totalStudyTime,
    todayStudyTime,
    weekStudyTime,
    totalSessions,
    averageSession,
    sessions,
    dbTasks,
  ] = await Promise.all([
    getTotalStudyTime(),
    getTodayStudyTime(),
    getWeekStudyTime(),
    getTotalSessions(),
    getAverageSessionLength(),
    getStudySessions(),
    getTasks(),
  ]);

  const tasks = dbTasks.map(mapTask);

  return (
    <>
      <TaskDashboard tasks={tasks} sessions={sessions} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 space-y-8">
        {/* Study time summary */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Study Time
          </h2>
          <StudyStats
            total={totalStudyTime}
            today={todayStudyTime}
            week={weekStudyTime}
          />
        </section>

        {/* Analytics */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Analytics
          </h2>
          <StudyAnalytics
            totalStudyTime={totalStudyTime}
            totalSessions={totalSessions}
            averageSession={averageSession}
          />
        </section>
      </div>
    </>
  );
}