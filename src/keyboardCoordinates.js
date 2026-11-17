import { statuses } from './taskData.js';

export function columnCoordinates(event, { context, currentCoordinates }) {
  const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.code];
  if (!direction) return;
  event.preventDefault();
  const { active, over, droppableRects, collisionRect } = context;
  const current = statuses.indexOf(over?.id ?? active?.data.current?.status);
  const next = current + direction;
  if (current < 0 || next < 0 || next >= statuses.length || !collisionRect) return;
  const rect = droppableRects.get(statuses[next]);
  if (!rect) return;
  return {
    x: currentCoordinates.x + rect.left + rect.width / 2 - collisionRect.left - collisionRect.width / 2,
    y: currentCoordinates.y + rect.top + rect.height / 2 - collisionRect.top - collisionRect.height / 2,
  };
}
