import { Task } from "../types/task";

export function getOverdueTasks(tasks: Task[]){
    const today = new Date();
    today.setHours(0,0,0,0);

    return tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);

        return(
            !task.completed && dueDate < today
        );
    });
}

export function getDueTodayTasks(tasks: Task[]){
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0,0,0,0);

        return(
            !task.completed && dueDate.getTime() === today.getTime()
        )
    })
}

export function getDueThisWeekTasks(
  tasks: Task[]
) {
  const today = new Date();

  const nextWeek = new Date();
  nextWeek.setDate(
    today.getDate() + 7
  );

  return tasks.filter((task) => {
    const dueDate = new Date(
      task.dueDate
    );

    return (
      !task.completed &&
      dueDate >= today &&
      dueDate <= nextWeek
    );
  });
}