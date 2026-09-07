import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('leaving any running focus pauses it and shows the sad capybara on return',()=>{
 assert.match(app,/function pauseForExit\(\)\{if\(state\.current\?\.status!=='running'/);
 assert.match(app,/document\.addEventListener\('visibilitychange',\(\)=>\{if\(document\.hidden\)\{pauseForExit\(\)/);
 assert.match(app,/else if\(state\.shieldPaused\)\{showShieldPausedNotice\(\)/);
});

test('the dashboard duration number is directly editable and custom duration keeps Livre highlighted',()=>{
  assert.match(html,/id="time-display"[^>]*class="time-display"[^>]*type="button"/);
  assert.match(app,/function editDashboardDuration\(/);
  assert.match(app,/target\.replaceWith\(input\)/);
  assert.match(app,/free\.textContent='Livre'/);
  assert.match(app,/free\.classList\.add\('selected'\)/);
});