import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const plugin=readFileSync(new URL('../android/app/src/main/java/com/focusgrove/plus/FocusScreenPlugin.java',import.meta.url),'utf8');
const manifest=readFileSync(new URL('../android/app/src/main/AndroidManifest.xml',import.meta.url),'utf8');

test('Blindado has no kiosk, device-admin, or accessibility-service distribution surface',()=>{
  assert.doesNotMatch(html,/Quiosque gerenciado|external-app-lock|Strict Focus Mode|strict-focus-activate/);
  assert.doesNotMatch(app,/openAccessibilitySettings|isAccessibilityEnabled|FocusAccessibilityService/);
  assert.doesNotMatch(manifest,/DEVICE_ADMIN|FocusDeviceAdminReceiver|AccessibilityService|BIND_ACCESSIBILITY_SERVICE/);
});

test('native Blindado only keeps the FoCapy display awake while it is active',()=>{
  assert.match(plugin,/FLAG_KEEP_SCREEN_ON/);
  assert.doesNotMatch(plugin,/FocusSessionStore|focusEndTime|Settings\.ACTION_ACCESSIBILITY_SETTINGS|Accessibility/);
});
