export const statuses = ['todo', 'in-progress', 'done'];
export const STORAGE_KEY = 'kanban-tasks';

export function validateTask(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      typeof value.id !== 'string' || !value.id.trim() || value.id.length > 200 ||
      statuses.includes(value.id) ||
      typeof value.title !== 'string' || !value.title.trim() || value.title.length > 100 ||
      typeof value.description !== 'string' || value.description.length > 10000 ||
      !['Low', 'Medium', 'High'].includes(value.priority) || !statuses.includes(value.status)) return null;
  return { id: value.id, title: value.title.trim(), description: value.description,
    priority: value.priority, status: value.status };
}

export function readTasks(storage, defaults) {
  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { tasks: defaults, warning: '' };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Expected an array');
    const seen = new Set();
    const tasks = parsed.map(validateTask).filter(task => {
      if (!task || seen.has(task.id)) return false;
      seen.add(task.id);
      return true;
    });
    if (tasks.length !== parsed.length) {
      storage.setItem(`${STORAGE_KEY}-recovery`, raw);
      return { tasks, warning: 'Invalid saved tasks were skipped. The original data is backed up in kanban-tasks-recovery.' };
    }
    return { tasks, warning: '' };
  } catch {
    // Do not overwrite unreadable data until a recovery copy can be made.
    try {
      if (raw != null) storage.setItem(`${STORAGE_KEY}-recovery`, raw);
    } catch {
      return { tasks: defaults, blocked: true, warning: 'Saved data could not be recovered. Changes will remain in this session only.' };
    }
    return { tasks: defaults, warning: 'Saved tasks could not be loaded. Check browser storage; any readable original data was backed up.' };
  }
}
