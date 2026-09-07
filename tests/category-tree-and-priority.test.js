import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, categoryOptions, normalizeCategoryTree, normalizeTasks, reorderCategories, reorderTasks, TASK_PRIORITIES } from '../src/core.js';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

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

test('categories and tasks reorder by touch-friendly directional controls', () => {
  const categories = normalizeCategoryTree(['A', 'B', 'C']);
  assert.deepEqual(reorderCategories(categories, categories[1].id, -1).map(category => category.name), ['B', 'A', 'C']);
  const tasks = normalizeTasks([{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c', title: 'C' }]);
  assert.deepEqual(reorderTasks(tasks, 'b', 1).map(task => task.title), ['A', 'C', 'B']);
});

test('tasks persist category association, manual order, and all four priorities', () => {
  assert.deepEqual(Object.keys(TASK_PRIORITIES), ['low', 'normal', 'high', 'urgent']);
  const task = addTask([], 'Urgent task', 'Work', '#abcdef', '#15382e', 'urgent', 'category-1')[0];
  assert.equal(task.priority, 'urgent');
  assert.equal(task.categoryId, 'category-1');
  assert.equal(task.order, 0);
  assert.equal(normalizeTasks([task])[0].priority, 'urgent');
});

test('task UI visibly exposes priority, category editing, and ordering controls', () => {
  assert.match(app, /task-priority-picker/);
  assert.match(app, /TASK_PRIORITIES/);
  assert.match(app, /task-category-picker/);
  assert.match(app, /task-edit-input/);
  assert.match(app, /reorderTasks\(state\.tasks,task\.id,direction\)/);
  assert.match(app, /task-reorder task-reorder-/);
});

test('category UI visibly exposes hierarchy, parent selector, and ordering controls', () => {
  assert.match(html, /id="new-task-category-parent"/);
  assert.match(app, /categoryOptions\(state\.tags\)/);
  assert.match(app, /category-reorder category-reorder-/);
  assert.match(app, /reorderCategories\(state\.tags,item\.id,direction\)/);
  assert.match(app, /'↳ '\.repeat\(item\.depth\)/);
});
