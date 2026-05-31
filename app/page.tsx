import TaskDashboard
  from "@/components/TaskDashboard";

import { getTasks }
  from "./actions/task-actions";

import { mapTask }
  from "@/lib/task-mapper";

export default async function Home() {
  const dbTasks =
    await getTasks();

  const tasks =
    dbTasks.map(mapTask);

  return (
    <TaskDashboard
      tasks={tasks}
    />
  );
}