import { createSession, createStopwatchSession, finishSession, normalizeTasks } from './core.js';

export function mergeNativeTaskChanges(tasks = [], result = {}, completedAt = new Date().toISOString()) {
  const completed = new Set((Array.isArray(result.completedTaskIds) ? result.completedTaskIds : []).map(String));
  const current = normalizeTasks(tasks).map(task => completed.has(task.id) && !task.done
    ? { ...task, done: true, completedAt }
    : task);
  const known = new Set(current.map(task => task.id));
  const created = [];
  for (const raw of Array.isArray(result.createdTasks) ? result.createdTasks : []) {
    const id = String(raw?.id || '').trim();
    const title = String(raw?.title || '').trim().replace(/\s+/g, ' ').slice(0, 100);
    if (!id || !title) continue;
    created.push(id);
    if (known.has(id)) continue;
    known.add(id);
    current.push({ id, title, done: completed.has(id), ...(completed.has(id) ? { completedAt } : {}), priority: 'normal', order: current.length });
  }
  return { tasks: normalizeTasks(current), acknowledgedCreatedTaskIds: [...new Set(created)] };
}

export function focusSessionFromNative(snapshot) {
  if (!snapshot?.token || !['foco', 'cronometro'].includes(snapshot.mode)) return null;
  const elapsedSeconds = Math.max(0, Math.floor(Number(snapshot.elapsedSeconds) || 0));
  const session = snapshot.mode === 'cronometro'
    ? createStopwatchSession({ label: 'Cronômetro · widget' })
    : createSession({ seconds: Math.max(60, Math.floor(Number(snapshot.durationSeconds) || 1500)), label: 'Foco · widget' });
  return {
    ...session,
    id: `widget-${String(snapshot.token)}`,
    elapsedSeconds,
    status: snapshot.running ? 'running' : 'paused',
    createdAt: snapshot.startedAt || session.createdAt,
    nativeWidgetToken: String(snapshot.token)
  };
}

export function completedFocusSessionFromNative(event) {
  if (!event?.id) return null;
  const durationSeconds = Math.max(60, Math.floor(Number(event.durationSeconds) || 1500));
  const session = createSession({ seconds: durationSeconds, label: 'Foco · widget' });
  return { ...finishSession(session, event.completedAt || new Date().toISOString()), id: `widget-${String(event.id)}`, nativeWidgetEventId: String(event.id) };
}
