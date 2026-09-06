import test from 'node:test';
import assert from 'node:assert/strict';
import { taskSnapshotsForSession, taskHistoryForFilter } from '../src/core.js';

test('session task snapshots preserve task and tag metadata for historical records',()=>{
 const tasks=[{id:'clean',title:'Clean closet',tag:'Home',tagColor:'#aabbcc',done:false}];
 assert.deepEqual(taskSnapshotsForSession(tasks,['clean']),[{id:'clean',title:'Clean closet',tag:'Home',tagColor:'#aabbcc'}]);
});
test('history filter returns only completed focus records linked to the requested task',()=>{
 const sessions=[{status:'completed',taskSnapshots:[{id:'clean',title:'Clean closet'}]},{status:'completed',taskSnapshots:[{id:'study',title:'Study'}]},{status:'paused',taskSnapshots:[{id:'clean',title:'Clean closet'}]}];
 assert.equal(taskHistoryForFilter(sessions,'clean').length,1);
});
