import test from 'node:test';
import assert from 'node:assert/strict';
import { completeTasksForSession } from '../src/core.js';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('only tasks associated with a completed focus session are marked complete',()=>{
 const tasks=[{id:'a',title:'Ler',done:false},{id:'b',title:'Escrever',done:false}];
 const completed=completeTasksForSession(tasks,['b']);
 assert.deepEqual(completed[0],{id:'a',title:'Ler',done:false});
 assert.equal(completed[1].id,'b');
 assert.equal(completed[1].title,'Escrever');
 assert.equal(completed[1].done,true);
 assert.ok(Number.isFinite(Date.parse(completed[1].completedAt)));
});

test('intention opens available task picker and first launch language choice is persistent',()=>{
 assert.match(html,/id="intention-task-dialog"/);
 assert.match(html,/id="first-language-dialog"/);
 assert.match(html,/Which language do you speak\?/);
 assert.match(html,/data-language-choice="en"/);
 assert.match(html,/data-language-choice="pt-BR"/);
 assert.match(app,/function showIntentionTaskDialog\(/);
 assert.match(app,/languageChosen/);
});

test('every task completion flow refreshes the focus task picker',()=>{
 assert.match(app,/state\.tasks=completeTasksForSession\(state\.tasks,done\.taskIds\);[\s\S]*renderIntentionTaskList\(\)/);
 assert.match(app,/done:true,completedAt:new Date\(\)\.toISOString\(\)\}:item\)\);removeTaskFromActiveSession\(task\.id\);renderTimer\(\);saveState\(\);renderTasks\(\);renderIntentionTaskList\(\)/);
});
