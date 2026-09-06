import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('Pomodoro signals are fixed to rest start and rest end with no user selector',()=>{
  assert.doesNotMatch(html,/id="pomo-transition-sound"/);
  assert.match(app,/function playRestStartSignal\(/);
  assert.match(app,/function playRestEndSignal\(/);
  assert.match(app,/result\.transition==='rest-start'.*playRestStartSignal\(\)/);
  assert.match(app,/result\.transition==='rest-end'.*playRestEndSignal\(\)/);
  assert.doesNotMatch(app,/before\.pomoPhase==='focus'.*playRestStartSignal\(\)/);
  assert.ok(existsSync(new URL('../assets/pomo-transition-1.mp3',import.meta.url)));
  assert.ok(existsSync(new URL('../assets/pomo-transition-2.mp3',import.meta.url)));
});

test('completion sounds support a multi-file MP3 or WAV library',()=>{
  assert.match(html,/id="completion-upload"[^>]*accept="[^"]*audio\/wav/);
  assert.match(html,/id="completion-sound-library"/);
  assert.match(app,/function saveCompletionSound\(/);
  assert.match(app,/function renderCompletionSoundLibrary\(/);
  assert.match(app,/function deleteCompletionSound\(/);
});
