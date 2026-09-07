import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, categoryOptions, normalizeCategoryTree, normalizeTasks, reorderCategories, reorderTasks, TASK_PRIORITIES } from '../src/core.js';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('category normalization adds stable hierarchy metadata while preserving legacy names and colors', () => {
  const categories = normalizeCategoryTree([{ name: 'Work', color: '#abcdef' }, { id: 'child', name: 'Deep work', parentId: 'category-1', order: 0 }]);
  assert.equal(categories[0].name, 'Work');
  assert.equal(categories[1].parentId, categories[0].id);
  assert.deepEqual(categories.map(category => category.order), [0, 1]);
  assert.equal(categoryOptions(categories)[1].depth, 1);
});

test('legacy categories and invalid parents normalize safely without data loss', () => {
  const categories = normalizeCategoryTree(['Home', { name: 'Study', parentId: 'missing', order: 9 }]);
  assert.deepEqual(categories.map(category => category.name), ['Home', 'Study']);
  assert.equal(categories[1].parentId, '');
});

test('categories and tasks retain reorder helpers for persisted drag results', () => {
  const categories = normalizeCategoryTree(['A', 'B', 'C']);
  assert.deepEqual(reorderCategories(categories, categories[1].id, -1).map(category => category.name), ['B', 'A', 'C']);
  const tasks = normalizeTasks([{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c', title: 'C' }]);
  assert.deepEqual(reorderTasks(tasks, 'b', 1).map(task => task.title), ['A', 'C', 'B']);
});

test('tasks persist a valid parent task relation while legacy task data remains valid', () => {
  const parent = addTask([], 'Parent')[0];
  const child = addTask([parent], 'Child', '', '#abcdef', '#15382e', 'urgent', '', parent.id)[1];
  assert.equal(child.parentTaskId, parent.id);
  assert.equal(normalizeTasks([{ id: 'legacy', title: 'Legacy' }])[0].parentTaskId, undefined);
  assert.equal(normalizeTasks([{ id: 'orphan', title: 'Orphan', parentTaskId: 'missing' }])[0].parentTaskId, undefined);
});

test('task UI renders priority as an unlabeled solid top-left marker with a colored card perimeter', () => {
  assert.match(app, /task-priority-marker/);
  assert.match(app, /row\.style\.borderColor=priorityColor/);
  assert.doesNotMatch(app, /task-priority-badge/);
  assert.match(css, /\.task-priority-marker\{[^}]*background:var\(--task-priority-color\)/);
  assert.match(css, /\.task-row\{[^}]*border:2px solid var\(--task-priority-color\)/);
});

test('task creation and inline editor expose a parent task selector and indent children under parents', () => {
  assert.match(html, /id="new-task-parent"/);
  assert.match(app, /task-parent-picker/);
  assert.match(app, /task-subtask/);
  assert.match(app, /parentTaskId/);
});

test('task and category list rows use Pointer Event drag listeners rather than visible directional controls', () => {
  assert.match(app, /addEventListener\('pointerdown'/);
  assert.match(app, /addEventListener\('pointermove'/);
  assert.match(app, /addEventListener\('pointerup'/);
  assert.match(app, /reorderTasks\(state\.tasks,draggedId,direction\)/);
  assert.match(app, /reorderCategories\(state\.tags,draggedId,direction\)/);
  assert.match(app, /task-drag-handle/);
  assert.match(app, /category-drag-handle/);
  assert.doesNotMatch(app, /task-reorder-/);
  assert.doesNotMatch(app, /category-reorder-/);
});
