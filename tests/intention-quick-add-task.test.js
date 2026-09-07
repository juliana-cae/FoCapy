import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('intention task dialog can create and immediately associate a new task',()=>{
 assert.match(html,/id="new-intention-task"/);
 assert.match(html,/id="add-intention-task"/);
 assert.match(app,/function addIntentionTask\(/);
 assert.match(app,/state\.sessionTaskIds=\[\.\.\.state\.sessionTaskIds,created\.id\]/);
 assert.match(app,/function syncCurrentTaskAssociation\(\)/);
 assert.match(app,/state\.current\.taskIds=association\.taskIds/);
 assert.match(app,/state\.current\.taskSnapshots=association\.taskSnapshots/);
 assert.match(app,/function renderIntentionTaskList\(\)/);
 assert.match(app,/renderIntentionTaskList\(\);renderTasks\(\)/);
 assert.doesNotMatch(app,/association\.disabled=state\.current\?\.status==='running'/);
 assert.match(app,/syncCurrentTaskAssociation\(\);saveState\(\);renderTimer\(\);renderIntentionTaskList\(\);renderTasks\(\)/);
});
