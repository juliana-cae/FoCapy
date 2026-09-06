import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, normalizeTasks, taskIdsForSession } from '../src/core.js';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

test('tasks persist duplicate titles and session associations contain only existing task IDs', () => {
  const tasks = addTask([{ id: 'a', title: 'Revisar texto', done: false }], 'Estudar');
  assert.equal(tasks.length, 2);
  assert.equal(addTask(tasks, ' estudar ').length, 3);
  assert.deepEqual(taskIdsForSession(tasks, ['a', 'missing']), ['a']);
  assert.deepEqual(normalizeTasks([{ title: '  Planejar  ' }])[0], { id: 'task-1', title: 'Planejar', done: false });
});

test('task screen provides checklist association and Categories reveals management progressively', () => {
  assert.match(html, /id="tasks" class="screen"/);
  assert.match(html, /id="new-task"/);
  assert.match(html, /id="task-session-list"/);
  assert.match(html, /data-screen="tasks"/);
  assert.match(html, /id="manage-tags"/);
  assert.match(html, /id="tag-management"[^>]*hidden/);
  assert.match(html, /id="tag-editor"[^>]*hidden/);
  assert.match(app, /function toggleTagManagement\(/);
  assert.match(app, /function renderTasks\(/);
  assert.match(app, /taskIdsForSession\(/);
});
