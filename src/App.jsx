import Modal from './components/Modal';
import ProjectTitle from './components/ProjectTitle';

import { useEffect, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import TaskForm from "./components/TaskForm";
import TaskDetailsModal from "./components/TaskDetailsModal";
import { useTasks } from "./hooks/useTasks";
import TaskSummary from "./components/TaskSummary";


function App() {
  const { tasks, storageWarning } = useTasks();
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('kanban-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* Theme switching still works without storage. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('kanban-theme', theme); } catch { /* Session-only preference. */ }
  }, [theme]);

  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask = tasks.find(
    (task) => task.id === selectedTaskId
  );

  function openAddForm(status) {
    setNewTaskStatus(status);
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTask(null);
  }

  function openTaskDetails(task) {
    setSelectedTaskId(task.id);
  }

  function closeTaskDetails() {
    setSelectedTaskId(null);
  }

  return (
    <div className="app-shell min-h-screen">
      <header className="app-header border-b">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">
              TaskFlow
            </h1>

            <p className="text-sm text-gray-500">
              My Kanban Workspace
            </p>
          </div>

          <div className="flex items-center gap-3">
          <button type="button" className="theme-toggle rounded-lg px-3 py-2 text-sm font-semibold"
            aria-label={`Switch to ${theme === 'dark' ? '\u2600 Light' : '\u263e Dark'} theme`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '\u2600 Light' : '\u263e Dark'}
          </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <ProjectTitle />

          <p className="mt-2 text-gray-500">
            Organize your tasks and track progress
          </p>
        </div>

        {storageWarning && <p role="status" className="mb-4 rounded bg-amber-100 p-3">{storageWarning}</p>}
        <TaskSummary />

        <p className="mb-4 text-sm text-gray-500">Drag any card to move it. On touch screens, hold briefly then drag.</p>
        <KanbanBoard
          onAdd={openAddForm}
          onEdit={openEditForm}
          onView={openTaskDetails}
        />
      </main>

      {/* Add / Edit Task Form */}
      {showForm && (
        <Modal labelledBy="task-form-heading" onClose={closeForm}>
            <h2
              id="task-form-heading"
              className="mb-6 text-xl font-bold text-gray-800"
            >
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>

            <TaskForm
              key={editingTask?.id ?? `new-task-${newTaskStatus}`}
              initialTask={editingTask}
              defaultStatus={newTaskStatus}
              onCancel={closeForm}
            />
        </Modal>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          key={selectedTask.id}
          task={selectedTask}
          onClose={closeTaskDetails}
        />
      )}
    </div>
  );
}

export default App;

