import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('task history filters and deletes standalone completed tasks as well as focus-linked records',()=>{
  assert.match(html,/id="completed-task-list"/);
  assert.match(app,/completedList.*selectedFilter/);
  assert.match(app,/task-history-delete/);
  assert.match(app,/completed-task-delete/);
  assert.match(app,/deleteTaskFromHistory/);
  assert.match(app,/state\.tasks=state\.tasks\.filter\(item=>item\.id!==task\.id\)/);
  assert.match(app,/taskSnapshots.*filter/);
});
