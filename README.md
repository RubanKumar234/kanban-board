# TaskFlow Kanban

Responsive React Kanban with task creation, editing, deletion, details, summaries and drag-and-drop.

## Run

Use Node 24 (tested: 24.15.0). Run `npm ci`, then `npm run dev`.
Run `npm run lint`, `npm test` and `npm run build` before release.
Use `npm run preview` to inspect the production build. Deploy `dist/` to a static HTTPS host; no backend secrets are required.

## Controls

Drag anywhere on a card surface with the mouse. On touch screens, hold a card for 220ms before dragging; a normal swipe scrolls. View, Edit and Delete buttons remain independent. Click a card or focus it and press Enter to open details. Use Space to start keyboard dragging. Edit the project title with the pencil beside the heading; saved titles persist in this browser. Use the header theme switch for light/dark mode; the preference is saved when browser storage is available.
For keyboard movement, focus a card and press Space/Enter. Right/Down advances a column; Left/Up goes back. Space/Enter drops; Escape cancels.
Alternatively change Status in Edit or Details.
Dialogs support Tab wrapping, Escape and focus restoration. Cancel discards unsaved edits.

## Data

Tasks are stored per browser and origin in `kanban-tasks`. Clearing browser storage deletes them. Invalid data is backed up to `kanban-tasks-recovery` before replacement. Failed recovery disables writes for the session. Storage failures are displayed on the board. Concurrent tabs use last-write-wins behavior.
Titles allow 100 characters and descriptions 10,000. This is a local personal board, without accounts or multi-user synchronization.

See VERIFICATION.md for source provenance, passed checks and release limitations.

## Quick task actions

Use the + before a column count to create a task with that status preselected.
Click a task title or description to edit it inline, then Save or Cancel. Escape cancels; Enter saves a title; Ctrl/Cmd+Enter saves a description. Plain Enter adds a description line. Dragging from the text still moves the card; dragging is disabled while an inline editor is open. Click the rest of the card, or focus the card and press Enter, for details.


# TaskFlow — React Kanban Board

A responsive task management application built using React and Tailwind CSS.

## Features

- Create, edit, and delete tasks
- Drag tasks between To Do, In Progress, and Done
- View and update task details
- Save tasks using browser localStorage
- Manage task state using React Context API
- Responsive Kanban Board
- Task progress summary

## Technologies

- React
- Vite
- Tailwind CSS
- dnd-kit
- Context API
- localStorage

## Run Locally

npm install
npm run dev

## Production Build

npm run build
npm run preview
