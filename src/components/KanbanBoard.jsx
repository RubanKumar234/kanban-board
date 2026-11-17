import { columnCoordinates } from '../keyboardCoordinates';

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  closestCenter,
} from "@dnd-kit/core";

import TaskColumn from "./TaskColumn";
import { useTasks } from "../hooks/useTasks";


function KanbanBoard({ onAdd, onEdit, onView }) {

  const { tasks, moveTask } = useTasks();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: columnCoordinates })
  );

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "bg-slate-500",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-amber-500",
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-500",
    },
  ];


function detectCollision(args) {
  if (!args.pointerCoordinates) return closestCenter(args);
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return rectIntersection(args);
}


  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (!task) {
      return;
    }

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    if (task.status !== newStatus) {
      moveTask(taskId, newStatus);
    }
  }

  return (
 
    <DndContext
    sensors={sensors}
    collisionDetection={detectCollision}
    onDragEnd={handleDragEnd}
    accessibility={{
        screenReaderInstructions: {
        draggable:
            "Press Space to pick up a task. Use arrow keys to move it. Press Space again to drop, or Escape to cancel.",
        },
    }}
    >

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {columns.map((column) => (
        <TaskColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          tasks={tasks.filter(
            (task) => task.status === column.id
          )}
          onAdd={onAdd}
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </div>
  </DndContext>
);
}

export default KanbanBoard;
