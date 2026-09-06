import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const plugin=readFileSync(new URL('../android/app/src/main/java/com/focusgrove/plus/FocusScreenPlugin.java',import.meta.url),'utf8');
const manifest=readFileSync(new URL('../android/app/src/main/AndroidManifest.xml',import.meta.url),'utf8');
test('Strict Focus is configured through accessibility, without a kiosk or device owner mode',()=>{assert.match(html,/Strict Focus Mode/);assert.match(html,/id="strict-focus-activate"/);assert.match(app,/openAccessibilitySettings/);assert.doesNotMatch(html,/Quiosque gerenciado|external-app-lock/);assert.doesNotMatch(manifest,/DEVICE_ADMIN|FocusDeviceAdminReceiver/);});
test('native strict protection stores a time-bound session and opens Android accessibility settings',()=>{assert.match(plugin,/FocusSessionStore/);assert.match(plugin,/focusEndTime/);assert.match(plugin,/Settings\.ACTION_ACCESSIBILITY_SETTINGS/);assert.match(plugin,/isAccessibilityEnabled/);});
