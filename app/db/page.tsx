import { getTasks } from "../actions/task-actions";

export default async function Page() {
  const tasks = await getTasks();

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id}>
          {task.title}
        </div>
      ))}
    </div>
  );
}