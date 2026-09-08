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
 assert.match(html,/placeholder="Tarefa"/);
 assert.doesNotMatch(html,/placeholder="Add Tarefa"/);
 assert.match(app,/function syncTaskComposerAccents\(\)/);
 assert.match(css,/\.task-add-card #add-task-form #new-task-tag,[\s\S]*background:#e7e3d8/);
 assert.match(css,/\.task-row input\[type="checkbox"\]\{[^}]*width:19px/);
 assert.match(css,/\.task-row input\.task-edit-input\{[^}]*width:100%/);
});

test('new task controls follow the compact three-zone mobile layout',()=>{
 assert.match(html,/class="add-task-form"[\s\S]*class="task-main-fields"[\s\S]*id="new-task-tag"/);
 assert.match(html,/class="task-secondary-fields"[\s\S]*id="new-task-priority"[\s\S]*id="new-task-parent"/);
 assert.match(html,/class="task-submit-row"[\s\S]*Adicionar/);
 assert.match(html,/class="rhythm-controls"[\s\S]*id="session-completion-sound-button"[\s\S]*id="session-type"[\s\S]*id="free-duration"/);
 assert.match(html,/id="session-type" aria-label="Tipo de sessão"/);
 assert.doesNotMatch(html,/<label for="session-type">Tipo<\/label>/);
 assert.match(css,/\.rhythm-controls \.session-kind select\{[^}]*width:auto/);
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
