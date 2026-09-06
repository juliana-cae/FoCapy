import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('audio previews toggle from Testar to pause and the 18h reminder is scheduled',()=>{
  assert.doesNotMatch(html,/id="sound-status"/);
  assert.match(html,/id="ambient-test"/);
  assert.match(html,/id="completion-test"/);
  assert.match(app,/function toggleAmbientPreview\(/);
  assert.match(app,/function toggleCompletionPreview\(/);
  assert.match(app,/scheduleDailyReminder\(\)/);
  assert.match(app,/hour:18/);
  assert.match(app,/Capivaras estão contando com você/);
  assert.match(css,/\.pomo-field\.configured[^}]*#477856/);
});
