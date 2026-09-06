import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const plugin=readFileSync(new URL('../android/app/src/main/java/com/focusgrove/plus/FocusScreenPlugin.java',import.meta.url),'utf8');

test('Blindado exposes a persisted screen-pinning preference in settings',()=>{
  assert.match(html,/id="shield-lock-screen-setting"/);
  assert.match(html,/id="shield-lock-screen-toggle"/);
  assert.match(app,/shieldLockScreen/);
  assert.match(app,/shield-lock-screen-toggle/);
});

test('native screen pinning starts only while the opted-in Blindado session is running and releases afterward',()=>{
  assert.match(app,/shieldLockScreen:state\.shieldLockScreen/);
  assert.match(app,/lockScreen:running&&state\.shieldLockScreen/);
  assert.match(plugin,/if \(lockScreen\)[\s\S]*startLockTask\(\)[\s\S]*else[\s\S]*stopLockTask\(\)/);
  assert.doesNotMatch(plugin,/AccessibilityService|FocusSessionStore|ACTION_ACCESSIBILITY_SETTINGS/);
});
