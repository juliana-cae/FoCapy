import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const ids=new Set([...html.matchAll(/id=["']([^"']+)["']/g)].map(([,id])=>id));

test('optional Vale controls cannot crash the app bootstrap when the Vale screen is absent',()=>{
  assert.ok(!ids.has('world-map'));
  assert.match(app,/function setupTouchControls\(\)\{[^}]*if\(!map\)return/s);
  assert.match(app,/function renderWorld\(\)\{[^}]*if\(!map\)return/s);
});

test('all direct startup DOM bindings resolve to elements in the current interface',()=>{
  const direct=[...app.matchAll(/\$\('([^']+)'\)\.(?:onclick|onchange|oninput|onblur|onkeydown)/g)].map(([,id])=>id);
  assert.deepEqual([...new Set(direct.filter(id=>!ids.has(id)))],[]);
});
