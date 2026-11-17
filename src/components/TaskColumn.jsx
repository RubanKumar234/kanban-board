
import { useDroppable, useDndContext } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function TaskColumn({
  id,
  title,
  tasks,
  color,
  onAdd,
  onEdit,
  onView,
}) {
  const { active } = useDndContext();
  const isDragSource = active?.data.current?.status === id;
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ position: "relative", zIndex: isDragSource ? 20 : 0 }}
      
        className={`task-column min-w-0 rounded-2xl p-4 transition-colors ${
        isOver
            ? "column-over ring-2 ring-indigo-400"
            : ""
        }`}

    >
      <div data-status={id} className="column-heading mb-5 flex items-center justify-between gap-2 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${color}`}
          ></span>

          <h2 className="font-bold text-gray-800">
            {title}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
        <button type="button" data-add-task aria-label={`Add task to ${title}`} title={`Add task to ${title}`}
          onClick={() => onAdd(id)} className="column-add rounded-lg text-xl font-semibold text-indigo-600">+</button>
        <span className="column-count rounded-full px-3 py-1 text-sm font-semibold text-gray-600">
          {tasks.length}
        </span>
        </div>
      </div>

      <div className="min-h-40 space-y-3">
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400">
            Drop tasks here
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskColumn;

