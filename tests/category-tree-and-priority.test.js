import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, categoryOptions, moveCategory, moveTask, normalizeCategoryTree, normalizeTasks, reorderCategories, reorderTasks, taskStatisticsForPeriod, TASK_PRIORITIES } from '../src/core.js';
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

test('moveCategory nests the dragged category inside its target and preserves stable tree order', () => {
  const tags = normalizeCategoryTree([{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }, { id: 'c', name: 'C' }]);
  const moved = moveCategory(tags, 'c', 'a', 'inside');
  assert.deepEqual(moved.map(tag => [tag.id, tag.parentId, tag.order]), [['a', '', 0], ['c', 'a', 1], ['b', '', 2]]);
});

test('moveCategory rejects itself and descendant targets without changing the tree', () => {
  const tags = normalizeCategoryTree([{ id: 'a', name: 'A' }, { id: 'b', name: 'B', parentId: 'a' }, { id: 'c', name: 'C', parentId: 'b' }]);
  assert.deepEqual(moveCategory(tags, 'a', 'a', 'inside'), tags);
  assert.deepEqual(moveCategory(tags, 'a', 'c', 'inside'), tags);
});

test('moveTask reorders a tree block and reparents the dropped task', () => {
  const tasks = normalizeTasks([{ id: 'a', title: 'A' }, { id: 'b', title: 'B', parentTaskId: 'a' }, { id: 'c', title: 'C' }, { id: 'd', title: 'D' }]);
  const moved = moveTask(tasks, 'a', 'd', 'after');
  assert.deepEqual(moved.map(task => [task.id, task.parentTaskId, task.order]), [['c', undefined, 0], ['d', undefined, 1], ['a', undefined, 2], ['b', 'a', 3]]);
  assert.deepEqual(moveTask(moved, 'a', 'b', 'inside'), moved);
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

test('task and category nesting can be removed from their compact lower-left controls', () => {
  assert.match(app, /task-remove-nesting/);
  assert.match(app, /category-remove-nesting/);
  assert.match(app, /Retirar \$\{task\.title\} de subtarefa/);
  assert.match(app, /Retirar \$\{item\.name\} de subcategoria/);
  assert.match(app, /parentTaskId:''/);
  assert.match(app, /parentId:''/);
  assert.match(css, /\.remove-nesting-button\{/);
});

test('active task cards keep title data above a distinct action line and deepen visible nesting', () => {
  assert.match(app, /task-primary-line/);
  assert.match(app, /task-actions-line/);
  assert.match(app, /actions\.append\(unnest,complete,edit,remove\)/);
  assert.match(css, /\.task-actions-line\{[^}]*border-top/);
  assert.match(css, /\.task-subtask\{[^}]*margin-left:calc\(34px/);
  assert.match(css, /\.category-subcategory\{[^}]*margin-left:calc/);
});

test('task category creation follows the requested two-row mobile arrangement', () => {
  assert.match(html, /class="tag-create task-category-create"/);
  assert.match(html, /placeholder="Nome da categoria"/);
  assert.match(html, /Escolher cor/);
  assert.match(html, /Cor da fonte/);
  assert.match(html, /Subcategoria\?/);
  assert.match(html, /task-category-create-button/);
  assert.match(app, /state\.language==='en'\?'Subcategory\?':'Subcategoria\?'/);
  assert.match(css, /\.task-category-create\{[^}]*grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
  assert.match(css, /\.category-name-field\{[^}]*grid-column:1 \/ -1/);
});

test('task parents can be nested at any depth without allowing cycles', () => {
  assert.match(app, /function taskCanUseParent\(tasks,taskId,candidateParentId\)/);
  assert.match(app, /tasks\.filter\(item=>!item\.done&&item\.id!==task\.id&&taskCanUseParent\(tasks,task\.id,item\.id\)\)/);
  assert.doesNotMatch(app, /tasks\.filter\(item=>item\.id!==task\.id&&!item\.parentTaskId\)/);
});

test('live task and category dragging previews the final placement before release', () => {
  assert.match(app, /const previewMove=/);
  assert.match(app, /drag-preview-shift/);
  assert.match(app, /item\.style\.transform=`translateY/);
  assert.match(app, /clearPreview\(\)/);
  assert.match(css, /\.drag-preview-shift\{[^}]*transition:transform/);
  assert.match(css, /\.drop-before\{[^}]*inset 0 4px/);
  assert.match(css, /\.drop-after\{[^}]*inset 0 -4px/);
});

test('inline task editing keeps the title compact, changes priority, and excludes completed parents', () => {
  assert.match(app, /input\.size=Math\.min\(28,Math\.max\(8,task\.title\.length\)\)/);
  assert.match(app, /task-priority-picker/);
  assert.match(app, /Object\.entries\(TASK_PRIORITIES\)/);
  assert.match(app, /priority:priority\.value/);
  assert.match(app, /tasks\.filter\(item=>!item\.done&&item\.id!==task\.id/);
  assert.match(css, /\.task-edit-input\{[^}]*width:auto/);
});

test('task and category drag listeners calculate placement, use move helpers, and protect touch interaction', () => {
  assert.match(app, /moveCategory/);
  assert.match(app, /moveTask/);
  assert.match(app, /document\.elementFromPoint/);
  assert.match(app, /\.closest\('\[data-drag-id\]'\)/);
  assert.match(app, /getBoundingClientRect/);
  assert.match(app, /drop-before/);
  assert.match(app, /drop-after/);
  assert.match(app, /drop-inside/);
  assert.match(app, /setPointerCapture/);
  assert.match(app, /releasePointerCapture/);
  assert.match(app, /addEventListener\('pointerdown'/);
  assert.match(app, /addEventListener\('pointermove'/);
  assert.match(app, /addEventListener\('pointerup'/);
  assert.match(app, /if\(event\.type==='pointerup'\)resolveDrop\(event\)/);
  assert.match(app, /moveTask\(state\.tasks,draggedId,targetId,placement\)/);
  assert.match(app, /moveCategory\(state\.tags,draggedId,targetId,placement\)/);
  assert.match(app, /task-drag-handle/);
  assert.match(app, /category-drag-handle/);
  assert.match(css, /\.task-drag-handle[^}]*touch-action:none/);
  assert.match(css, /\.category-drag-handle[^}]*touch-action:none/);
  assert.doesNotMatch(app, /task-reorder-/);
  assert.doesNotMatch(app, /category-reorder-/);
});

test('task statistics separate selected-period completion from current backlog and hierarchy', () => {
  const stats=taskStatisticsForPeriod([
    {id:'top',title:'Top',tag:'Trabalho',categoryId:'work',priority:'high',done:true,completedAt:'2026-09-07T10:00:00Z'},
    {id:'child',title:'Child',tag:'Trabalho',categoryId:'work',priority:'urgent',parentTaskId:'top',done:false},
    {id:'low',title:'Low',priority:'low',done:true,completedAt:'2026-08-01T10:00:00Z'}
  ],'daily',new Date('2026-09-07T18:00:00Z'));
  assert.equal(stats.completedTotal,1);
  assert.equal(stats.openTotal,1);
  assert.deepEqual([stats.subtasksDone,stats.subtasksTotal],[0,1]);
  assert.equal(stats.priorities.find(item=>item.priority==='high').completed,1);
  assert.equal(stats.priorities.find(item=>item.priority==='urgent').open,1);
  assert.deepEqual(stats.categories[0],{key:'work',name:'Trabalho',completed:1,open:1});
});

test('task statistics UI exposes priorities, hierarchy and category rows', () => {
  assert.match(html, /id="task-statistics-summary"/);
  assert.match(html, /id="task-priority-statistics"/);
  assert.match(html, /id="task-category-statistics"/);
  assert.match(app, /taskStatisticsForPeriod\(state\.tasks,state\.statsPeriod\)/);
  assert.match(app, /subtasksDone/);
  assert.match(css, /\.task-statistics-summary\{/);
});
