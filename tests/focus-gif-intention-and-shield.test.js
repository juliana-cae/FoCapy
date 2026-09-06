import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('running focus restores the dashboard GIF rather than replacing it with a photo',()=>{
  assert.match(app,/running\?'assets\/focus-capybara\.gif'/);
});

test('intention starts compact and turns editable only when its label is tapped',()=>{
  assert.match(html,/id="intention-label"[^>]*type="button"/);
  assert.match(html,/id="intention"[^>]*hidden/);
  assert.match(app,/function openIntentionEditor\(/);
  assert.match(css,/\.intention-row input\{[^}]*width:190px/);
});

test('pausing, ending, restarting or disabling Blindado immediately releases focus lock',()=>{
  assert.match(app,/const locked=state\.current\?\.status==='running'&&state\.strict/);
  assert.match(app,/const running=state\.current\?\.status==='running'&&state\.strict/);
  assert.match(app,/\$\('strict-toggle'\)\.onchange=e=>\{state\.strict=e\.target\.checked;syncFocusProtection\(\);renderTimer\(\);saveState\(\)\}/);
});
