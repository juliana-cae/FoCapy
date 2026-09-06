import test from 'node:test';
import assert from 'node:assert/strict';
import { taskSnapshotsForSession, taskHistoryForFilter, removeTaskFromCompletedSessions, statisticsForPeriod, sessionTaskAssociation } from '../src/core.js';

test('session task snapshots preserve task and tag metadata for historical records',()=>{
 const tasks=[{id:'clean',title:'Clean closet',tag:'Home',tagColor:'#aabbcc',done:false}];
 assert.deepEqual(taskSnapshotsForSession(tasks,['clean']),[{id:'clean',title:'Clean closet',tag:'Home',tagColor:'#aabbcc',tagFontColor:'#15382e'}]);
});
test('history filter returns only completed focus records linked to the requested task',()=>{
 const sessions=[{status:'completed',taskSnapshots:[{id:'clean',title:'Clean closet'}]},{status:'completed',taskSnapshots:[{id:'study',title:'Study'}]},{status:'paused',taskSnapshots:[{id:'clean',title:'Clean closet'}]}];
 assert.equal(taskHistoryForFilter(sessions,'clean').length,1);
});
test('deleting the last task from a completed session excludes that session from statistics',()=>{
 const sessions=[{status:'completed',completedAt:'2026-09-06T12:00:00.000Z',focusMinutes:25,taskIds:['clean'],taskSnapshots:[{id:'clean',title:'Clean closet'}]}];
 const remaining=removeTaskFromCompletedSessions(sessions,'clean');
 assert.equal(remaining[0].statisticsExcluded,true);
 assert.equal(statisticsForPeriod(remaining,'daily',new Date('2026-09-06T18:00:00.000Z')).totalMinutes,0);
});
test('session task association is rebuilt from the current selection',()=>{
 const association=sessionTaskAssociation([{id:'a',title:'Plan'},{id:'b',title:'Read'}],['missing']);
 assert.deepEqual(association,{taskIds:[],taskSnapshots:[]});
});
