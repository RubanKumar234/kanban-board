import { useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Modal from './Modal';

export default function ProjectTitle() {
  const [title, setTitle] = useState(() => {
    try {
      const saved = localStorage.getItem('kanban-project-title');
      if (saved?.trim() && saved.length <= 100) return saved.trim();
    } catch { /* Keep a usable title without storage. */ }
    return 'Project Board';
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [warning, setWarning] = useState('');
  const input = useRef(null);
  function save(event) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) { input.current.setCustomValidity('Enter a project title.'); input.current.reportValidity(); return; }
    setTitle(next);
    try { localStorage.setItem('kanban-project-title', next); setWarning(''); }
    catch { setWarning('Project title changed for this session only because browser storage is unavailable.'); }
    setEditing(false);
  }
  return <>
    <div className="flex items-center gap-3">
      <h2 className="min-w-0 text-3xl font-bold text-gray-800 [overflow-wrap:anywhere]">{title}</h2>
      <button type="button" aria-label="Edit project title" className="theme-toggle shrink-0 rounded-lg p-3"
        onClick={() => { setDraft(title); setEditing(true); }}><FaEdit aria-hidden="true" /></button>
    </div>
    {warning && <p role="status" className="mt-2 text-sm text-gray-500">{warning}</p>}
    {editing && <Modal labelledBy="project-title-heading" onClose={() => setEditing(false)}>
      <h2 id="project-title-heading" className="mb-5 text-xl font-bold">Edit project title</h2>
      <form onSubmit={save}>
        <label htmlFor="project-title" className="mb-2 block text-sm font-medium">Project title</label>
        <input ref={input} id="project-title" value={draft} maxLength={100} required className="w-full rounded-lg border p-3"
          onChange={event => { event.target.setCustomValidity(''); setDraft(event.target.value); }} />
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="rounded-lg border px-4 py-2" onClick={() => setEditing(false)}>Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Save title</button>
        </div>
      </form>
    </Modal>}
  </>;
}
