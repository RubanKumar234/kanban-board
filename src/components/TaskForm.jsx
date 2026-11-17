
import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

function TaskForm({ onCancel, initialTask, defaultStatus = "todo" }) {
  const { addTask, updateTask } = useTasks();

  const [title, setTitle] = useState(
    initialTask?.title || ""
  );

  const [description, setDescription] = useState(
    initialTask?.description || ""
  );

  const [priority, setPriority] = useState(
    initialTask?.priority || "Medium"
  );

  const [status, setStatus] = useState(
    () => initialTask?.status ?? defaultStatus
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    };

    if (initialTask) {
      updateTask(initialTask.id, taskData);
    } else {
      addTask(taskData);
    }

    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="task-title"
          className="mb-1 block text-sm font-medium"
        >
          Task Title *
        </label>

        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          maxLength={100}
          required
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="task-description"
          className="mb-1 block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your task"
          rows={4}
          maxLength={10000}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="task-priority"
          className="mb-1 block text-sm font-medium"
        >
          Priority
        </label>

        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="task-status"
          className="mb-1 block text-sm font-medium"
        >
          Status
        </label>

        <select
          id="task-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700"
        >
          {initialTask ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;

