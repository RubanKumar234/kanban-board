import Modal from './Modal';

import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

function TaskDetailsModal({ task, onClose }) {
  const { updateTask } = useTasks();

  const [description, setDescription] = useState(
    task.description || ""
  );

  const [status, setStatus] = useState(task.status);

  function handleSave(event) {
    event.preventDefault();

    updateTask(task.id, {
      description: description.trim(),
      status,
    });

    onClose();
  }

  return (
    <Modal labelledBy="task-details-heading" onClose={onClose}>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-500">
            Task Details
          </p>

          <h2
            id="task-details-heading"
            className="mt-1 text-xl font-bold [overflow-wrap:anywhere]"
          >
            {task.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close task details"
          className="shrink-0 rounded-lg px-3 py-1 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-600">
            Priority
          </p>

          <p className="mt-1 font-semibold text-indigo-600">
            {task.priority}
          </p>
        </div>

        <div>
          <label
            htmlFor="details-description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="details-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
            maxLength={10000}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="details-status"
            className="mb-2 block text-sm font-medium"
          >
            Status
          </label>

          <select
            id="details-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskDetailsModal;


