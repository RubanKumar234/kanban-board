import { useEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTasks } from "../hooks/useTasks";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function TaskCard({ task, onEdit, onView }) {
  const { deleteTask, updateTask } = useTasks();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const editor = useRef(null);
  const cardRef = useRef(null);
  useEffect(() => { if (editing) editor.current?.focus(); }, [editing]);
  function finish() {
    const field = editing;
    setEditing(null);
    requestAnimationFrame(() => cardRef.current?.querySelector(`[data-inline-field="${field}"]`)?.focus());
  }
  function save(event) {
    event.preventDefault();
    if (editing === 'title' && !draft.trim()) {
      editor.current.setCustomValidity('Enter a task title.'); editor.current.reportValidity(); return;
    }
    updateTask(task.id, { [editing]: draft.trim() });
    finish();
  }
  function field(name) {
    const title = name === 'title';
    if (editing === name) return <form className="inline-editor mt-2" onSubmit={save} onClick={event => event.stopPropagation()}
      onKeyDown={event => {
        event.stopPropagation();
        if (event.key === 'Escape') { event.preventDefault(); finish(); }
        if (!title && event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); event.currentTarget.requestSubmit(); }
      }}>
      {title ? <input ref={editor} aria-label="Task title" value={draft} required maxLength={100}
        onChange={event => { event.target.setCustomValidity(''); setDraft(event.target.value); }} />
        : <textarea ref={editor} aria-label="Task description" value={draft} maxLength={10000} rows={4}
          onChange={event => setDraft(event.target.value)} />}
      <div className="mt-2 flex gap-2">
        <button type="submit" className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">Save</button>
        <button type="button" onClick={finish} className="rounded border px-3 py-1 text-sm">Cancel</button>
      </div>
    </form>;
    return <button type="button" data-inline-field={name} aria-label={`Edit ${name} for ${task.title}`}
      className={`inline-edit-trigger w-full text-left [overflow-wrap:anywhere] ${title ? 'font-semibold text-gray-800' : 'mt-2 whitespace-pre-wrap text-sm text-gray-500'}`}
      onClick={event => { event.stopPropagation(); setDraft(task[name]); setEditing(name); }}>
      {task[name] || 'Click to add a description'}
    </button>;
  }
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } = useDraggable({
    id: task.id, data: { status: task.status }, disabled: Boolean(editing),
  });
  const priorityColors = { High: "bg-red-100 text-red-700", Medium: "bg-yellow-100 text-yellow-700", Low: "bg-green-100 text-green-700" };
  // Keep action buttons independent of the card's mouse, touch and keyboard sensor.
  const activate = name => event => {
    if (editing || event.target.closest('input, textarea, form')) return;
    if (event.target.closest('button') && !event.target.closest('[data-inline-field]')) return;
    if (name === 'onKeyDown' && event.target !== event.currentTarget) return;
    listeners?.[name]?.(event);
  };
  return (
    <div ref={node => { cardRef.current = node; setNodeRef(node); setActivatorNodeRef(node); }}
      {...attributes} aria-disabled={undefined} role="group" aria-roledescription="draggable task" aria-label={`Move ${task.title}`}
      onMouseDown={activate('onMouseDown')} onTouchStart={activate('onTouchStart')} onKeyDown={event => {
        if (event.target === event.currentTarget && event.key === 'Enter' && !isDragging) {
          event.preventDefault(); onView(task); return;
        }
        activate('onKeyDown')(event);
      }}
      onClick={event => { if (!editing && !isDragging && !event.target.closest('button, input, textarea, form')) onView(task); }}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.8 : 1, position: 'relative', zIndex: isDragging ? 10 : undefined }}
      data-status={task.status}
      className={`task-card rounded-xl p-4 ${isDragging ? 'is-dragging' : ''}`}>
      <div>{field('title')}</div>
      <div>{field('description')}</div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
        <div className="flex gap-1">
          <button type="button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)} className="card-action rounded text-indigo-600"><FaEdit aria-hidden="true" /></button>
          <button type="button" aria-label={`Delete ${task.title}`} onClick={() => { if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) deleteTask(task.id); }} className="card-action rounded text-red-600"><FaTrash aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}

