import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStopwatchSession, finishSession, awardVegetation } from '../src/core.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('a stopwatch session counts elapsed time upward and finalizes its real focused duration',()=>{
  const session=createStopwatchSession({label:'Cronômetro — leitura'});
  assert.equal(session.isStopwatch,true);
  assert.equal(session.totalSeconds,0);
  assert.equal(session.elapsedSeconds,0);
  const completed=finishSession({...session,elapsedSeconds:95*60});
  assert.equal(completed.focusMinutes,95);
  assert.equal(completed.elapsedSeconds,95*60);
  assert.equal(completed.totalSeconds,95*60);
});

test('long stopwatch sessions use the same high-effort reward table',()=>{
  const completed=finishSession({...createStopwatchSession({}),elapsedSeconds:120*60});
  const reward=awardVegetation({},completed.focusMinutes,()=>.999999);
  assert.equal(completed.focusMinutes,120);
  assert.equal(reward.item.rarity,'lendário');
});

test('Tipo offers Cronômetro and the UI starts it without a preset duration',()=>{
  assert.match(html,/option value="cronometro">Cronômetro/);
  assert.match(app,/state\.sessionType==='cronometro'\?createStopwatchSession\(\{label:sessionLabel\(\)\}\)/);
  assert.match(app,/const stopwatch=Boolean\(c\.isStopwatch\)/);
  assert.match(html,/id="start-button"[^>]*>Começar/);
  assert.match(html,/id="reset-button"[^>]*>Abandonar/);
  assert.match(html,/id="stopwatch-finish-button"[^>]*>Finalizar/);
  assert.match(app,/running\?translateValue\('Pausar'\)/);
  assert.match(app,/stopwatchFinish\.hidden=!stopwatch\|\|!running/);
  assert.match(app,/\$\('stopwatch-finish-button'\)\.onclick=completeSession/);
  assert.match(app,/state\.current\.tag=tag/);
  assert.match(app,/info\.hidden=!pomoRunning/);
  assert.doesNotMatch(app,/if\(state\.current\?\.isStopwatch&&state\.current\.elapsedSeconds>0\)\{completeSession\(\);return\}/);
});
