import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { taskHistoryForFilter } from '../src/core.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');
const sessions=[
 {status:'completed',taskSnapshots:[{id:'a',title:'Plan',tag:'Work'}]},
 {status:'completed',taskSnapshots:[{id:'b',title:'Read',tag:'Study'}]},
 {status:'completed',taskSnapshots:[{id:'c',title:'Write',tag:'Work'}]}
];

test('task history filters by task and category together',()=>{
 assert.deepEqual(taskHistoryForFilter(sessions,'','Work').map(s=>s.taskSnapshots[0].id),['a','c']);
 assert.deepEqual(taskHistoryForFilter(sessions,'a','Work').map(s=>s.taskSnapshots[0].id),['a']);
 assert.deepEqual(taskHistoryForFilter(sessions,'a','Study'),[]);
});

test('task list offers in-place category creation, task editing and individual deletion',()=>{
 assert.match(html,/id="create-task-category"/);
 assert.match(app,/className='text-button task-edit'/);
 assert.match(app,/className='text-button task-delete'/);
 assert.match(app,/className='text-button task-history-delete'/);
 assert.match(html,/Crie tarefas que podem ser associadas à sua próxima sessão de foco/);
 assert.match(html,/placeholder="Add Tarefa"/);
 assert.doesNotMatch(html,/class="task-entry-field"><span>Tarefa<\/span>/);
 assert.ok(app.includes("'Add Tarefa':'Add Task'"));
 assert.ok(css.includes('.add-task-form{display:grid;grid-template-columns:minmax(0,1fr) 112px auto'));
 assert.ok(css.includes('.task-entry-field{display:grid'));
 assert.ok(css.includes('.add-task-form #new-task-tag{width:112px'));
 assert.match(css,/\.task-row input\[type="checkbox"\]\{[^}]*width:19px/);
 assert.match(css,/\.task-row input\.task-edit-input\{[^}]*width:100%/);
});

test('task history starts hidden and opens only through its explicit toggle',()=>{
 assert.match(html,/id="task-history-toggle"[^>]*aria-expanded="false"/);
 assert.match(html,/id="task-history-content"[^>]*hidden/);
 assert.match(app,/function toggleTaskHistory\(\)/);
 assert.match(app,/\$\('task-history-toggle'\)\.onclick=toggleTaskHistory/);
});

test('the running dashboard shows its task snapshots and starts the animated GIF',()=>{
 const timer=app.match(/function renderTimer\(\)\{([\s\S]*?)\nfunction renderInsights/)[1];
 const focusContext=app.match(/function renderFocusContext\(session\)\{([\s\S]*?)\nfunction renderTimer/)[1];
 assert.match(focusContext,/session\?\.taskSnapshots\|\|\[\]/);
 assert.match(timer,/renderFocusCapy\(running\)/);
});
