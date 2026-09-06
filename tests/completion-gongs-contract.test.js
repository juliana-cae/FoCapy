import test from 'node:test';
import assert from 'node:assert/strict';
import { completionToneForMinutes } from '../src/core.js';
import { existsSync, readFileSync } from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('built-in gong selection follows the selected focus duration',()=>{
  assert.equal(completionToneForMinutes(25),'gongo-1');
  assert.equal(completionToneForMinutes(45),'gongo-2');
  assert.equal(completionToneForMinutes(60),'gongo-3');
  assert.equal(completionToneForMinutes(90),'gongo-3');
});

test('the three requested gong files exist',()=>{
  for(const name of ['completion-gongo-1.mp3','completion-gongo-2.mp3','completion-gongo-3.mp3']) assert.ok(existsSync(new URL(`../assets/${name}`,import.meta.url)));
});

test('duration selection changes built-in gongs but preserves uploaded custom audio',()=>{
  assert.match(app,/function selectBuiltInCompletionTone\(minutes\)\{if\(!isCustomCompletionTone\(\)\)state\.completionTone=completionToneForMinutes\(minutes\)\}/);
  assert.match(app,/selectBuiltInCompletionTone\(state\.minutes\);saveState\(\)/);
  assert.match(app,/gongo-1':'\.\.\/assets\/completion-gongo-1\.mp3/);
  assert.match(app,/gongo-2':'\.\.\/assets\/completion-gongo-2\.mp3/);
  assert.match(app,/gongo-3':'\.\.\/assets\/completion-gongo-3\.mp3/);
});
