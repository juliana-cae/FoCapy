import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('only a running Blindada session locks the focus dashboard; pause restores app navigation',()=>{
  assert.match(app,/const locked=state\.current\?\.status==='running'&&state\.strict;document\.documentElement\.classList\.toggle\('session-active-lock',locked\)/);
  assert.doesNotMatch(app,/window\.scrollTo\(\{top:0/);
  assert.match(app,/if\(state\.current\?\.status==='running'&&state\.strict&&name!=='focus'\)return/);
  assert.match(css,/\.session-active-lock,.session-active-lock body\{overflow:hidden/);
  assert.match(html,/id="focus" class="screen active"/);
});

test('running session dashboard is visually lowered without clipping its card content',()=>{
  assert.match(css,/\.session-active-lock #focus\{padding-top:24px/);
  assert.match(css,/\.session-active-lock \.timer-card\{margin-top:22px/);
});
