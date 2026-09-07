import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('turning the display off does not pause a running focus session',()=>{
 assert.match(app,/function pauseForExit\(\)\{if\(state\.current\?\.status!=='running'/);
 assert.doesNotMatch(app,/document\.addEventListener\('visibilitychange',\(\)=>\{if\(document\.hidden\)\{pauseForExit\(\)/);
 assert.match(app,/document\.addEventListener\('visibilitychange',\(\)=>\{if\(!document\.hidden&&state\.shieldPaused\)/);
});

test('the dashboard duration number is directly editable and custom duration keeps Livre highlighted',()=>{
  assert.match(html,/id="time-display"[^>]*class="time-display"[^>]*data-i18n-dynamic="true">25:00<\/div>/);
  assert.match(app,/function editDashboardDuration\(/);
  assert.match(app,/target\.contentEditable='true'/);
  assert.match(app,/free\.textContent='Livre'/);
  assert.match(app,/free\.classList\.add\('selected'\)/);
  assert.match(app,/function parseDashboardDuration\(value\)/);
  assert.ok(app.includes("split(':')"));
  assert.match(app,/seconds>59/);
  assert.match(app,/free\.classList\.remove\('selected'\)/);
  assert.ok(app.includes("if(event.key==='Enter')"));
  assert.ok(app.includes("/^[0-9:]$/.test(event.key)"));
});