import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('Pomodoro rest mode uses Descanso, a soft yellow theme, and allows leaving without stopping',()=>{
  assert.match(html,/Vivencie o seu tempo/);
  assert.match(html,/<span>Descanso<\/span>/);
  assert.match(app,/Descanso · \$\{c\.pomoBreakMinutes\} min/);
  assert.match(app,/c\.pomoPhase==='break'\?'DESCANSO':'FOCO'/);
  assert.match(app,/classList\.toggle\('resting',pomoRunning&&c\.pomoPhase==='break'\)/);
  assert.match(css,/\.app-shell\.resting\{/);
  assert.match(app,/state\.current\?\.pomoPhase==='break'/);
  assert.match(app,/const elapsed=Math\.max\(1,Math\.floor\(\(Date\.now\(\)-state\.lastTickAt\)\/1000\)\)/);
});
