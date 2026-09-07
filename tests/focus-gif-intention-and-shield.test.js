import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('running focus restores the dashboard GIF rather than replacing it with a photo',()=>{
  assert.match(app,/focusImage/);
  assert.match(html,/id="focus-capy"/);
});
test('intention starts compact and turns editable only when its label is tapped',()=>{
  assert.match(html,/id="intention-label"/);
  assert.match(html,/id="intention"[^>]*hidden/);
  assert.match(app,/function openIntentionEditor\(/);
  assert.match(css,/\.intention-row input\{[^}]*width:190px/);
  assert.ok(css.includes('.intention-label{border:1px solid var(--line);border-radius:12px'));
  assert.match(css,/\.intention-label:hover/);
});
test('pausing, ending, restarting or disabling Blindado immediately releases focus lock',()=>{
  assert.match(app,/const active=state\.current\?\.status==='running',locked=active&&state\.strict/);
  assert.match(app,/const running=state\.current\?\.status==='running'&&state\.strict/);
  assert.match(app,/\$\('strict-toggle'\)\.onchange=e=>\{state\.strict=e\.target\.checked;if\(state\.strict\)showShieldLockNotice\(\);syncFocusProtection\(\);renderTimer\(\);saveState\(\)\}/);
});
test('the Blindado activation notice uses the supplied capybara image and requested opening copy',()=>{
  assert.match(html,/id="shield-lock-notice-dialog"/);
  assert.match(html,/assets\/shielded-capybara-notice\.jpg/);
  assert.match(html,/>Caso queira realmente se blindar\.\.\.<\/h2>/);
  assert.match(app,/showShieldLockNotice\(\)/);
});
