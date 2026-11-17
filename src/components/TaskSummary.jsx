
import { useTasks } from "../hooks/useTasks";

function TaskSummary() {
  const { tasks } = useTasks();

  const summary = [
    {
      label: "Total Tasks",
      tone: "total",
      count: tasks.length,
      color: "text-indigo-600",
    },
    {
      label: "To Do",
      tone: "todo",
      count: tasks.filter(
        (task) => task.status === "todo"
      ).length,
      color: "text-slate-600",
    },
    {
      label: "In Progress",
      tone: "in-progress",
      count: tasks.filter(
        (task) => task.status === "in-progress"
      ).length,
      color: "text-amber-600",
    },
    {
      label: "Done",
      tone: "done",
      count: tasks.filter(
        (task) => task.status === "done"
      ).length,
      color: "text-green-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {summary.map((item) => (
        <div
          key={item.label}
          data-status={item.tone}
          className="summary-card rounded-xl p-5"
        >
          <p className="text-sm text-gray-500">
            {item.label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${item.color}`}
          >
            {item.count}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TaskSummary;
