import { Task } from "@/types/task";
import { Filter } from "@/types/filter";

export function useFilteredTasks(
  tasks: Task[],
  filter: Filter
) {
  return tasks.filter((task) => {
    if (filter === "pending") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });
}