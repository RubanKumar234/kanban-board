import { useEffect, useState } from 'react';
import { TaskContext } from './taskContext';
import { readTasks, validateTask, STORAGE_KEY } from '../taskData';
const initialTasks = [
  {
    id: "task-1",
    title: "Design Kanban Board",
    description: "Create a responsive board layout",
    priority: "High",
    status: "todo",
  },
  {
    id: "task-2",
    title: "Create Task Form",
    description: "Build the add task form",
    priority: "Medium",
    status: "todo",
  },
  {
    id: "task-3",
    title: "Learn React Components",
    description: "Understand props and components",
    priority: "High",
    status: "in-progress",
  },
  {
    id: "task-4",
    title: "Install Node.js",
    description: "Prepare the development environment",
    priority: "Low",
    status: "done",
  },
];


export function TaskProvider({ children }) {
  const [loaded] = useState(() => {
    try { return readTasks(window.localStorage, initialTasks); }
    catch { return { tasks: initialTasks, blocked: true, warning: 'Browser storage is unavailable. Changes will remain in this session only.' }; }
  });
  const [tasks, setTasks] = useState(loaded.tasks);
  const [saveError, setSaveError] = useState('');
  useEffect(() => {
    if (loaded.blocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      // Storage is an external system: report write failures in the UI.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaveError('');
    } catch { setSaveError('Tasks could not be saved. Changes will be lost when this page closes.'); }
  }, [tasks, loaded.blocked]);
  function addTask(data) {
    const task = validateTask({ ...data, id: crypto.randomUUID() });
    if (task) setTasks(previous => [...previous, task]);
  }
  function updateTask(id, data) {
    setTasks(previous => previous.map(task => task.id === id
      ? validateTask({ ...task, ...data, id: task.id }) || task : task));
  }
  function deleteTask(id) { setTasks(previous => previous.filter(task => task.id !== id)); }
  function moveTask(id, status) { updateTask(id, { status }); }
  return <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask,
    storageWarning: [loaded.warning, saveError].filter(Boolean).join(' ') }}>{children}</TaskContext.Provider>;
}
