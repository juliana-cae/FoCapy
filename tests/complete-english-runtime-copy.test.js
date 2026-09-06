import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('English translation explicitly covers every dynamic UI copy family',()=>{
 for(const phrase of ['Deep focus','Stopwatch —','Pomodoro —','No categories created.','Select and edit','Edit ','Task category','Complete','Reopen','No completed focus sessions for this filter.','Daily','Weekly','Monthly','Yearly','No sessions in this period.','No categories in this period.','Complete sessions with a category to see performance.','Next season in ','Session completed! Your item was saved to inventory.','Your capybaras are counting on you!','Your daily commitment is waiting for you.']) assert.match(app,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
});
