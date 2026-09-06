import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');
const plugin=readFileSync(new URL('../android/app/src/main/java/com/focusgrove/plus/FocusScreenPlugin.java',import.meta.url),'utf8');
const manifest=readFileSync(new URL('../android/app/src/main/AndroidManifest.xml',import.meta.url),'utf8');

test('Fixar FoCapy is automatic for every session without a preferences opt-in',()=>{
  assert.match(app,/externalAppLock:'pin'/);
  assert.match(app,/externalAppLock:s\.externalAppLock==='kiosk'\?'kiosk':'pin'/);
  assert.match(app,/setFocusState\(\{active:running,shielded,externalAppLock:state\.externalAppLock\}\)/);
  assert.doesNotMatch(html,/value="none"[^>]*>Sem bloqueio/);
});

test('preferences present a refined lock selector and reveal context only after selection',()=>{
  assert.match(html,/class="external-app-lock-picker"/);
  assert.match(html,/value="pin"[^>]*>Fixar FoCapy/);
  assert.match(html,/value="kiosk"[^>]*>Quiosque gerenciado/);
  assert.match(html,/id="external-app-lock-detail"[^>]*hidden/);
  assert.match(app,/function renderExternalAppLockDetail\(reveal=false\)/);
  assert.match(app,/renderExternalAppLockDetail\(true\)/);
  assert.match(app,/Se não souber configurar o Device Owner, escolha Fixar FoCapy\./);
  assert.match(css,/\.external-app-lock-picker\{/);
  assert.match(css,/#settings-dialog form\{[^}]*gap:22px/);
});

test('native focus protection starts and releases Android lock task with session state',()=>{
  assert.match(plugin,/startLockTask\(\)/);
  assert.match(plugin,/stopLockTask\(\)/);
  assert.match(plugin,/"pin"\.equals\(externalAppLock\)/);
  assert.match(plugin,/"kiosk"\.equals\(externalAppLock\)/);
  assert.match(plugin,/isDeviceOwnerApp/);
  assert.match(plugin,/setLockTaskPackages/);
  assert.match(manifest,/FocusDeviceAdminReceiver/);
  assert.match(manifest,/android\.permission\.BIND_DEVICE_ADMIN/);
});
