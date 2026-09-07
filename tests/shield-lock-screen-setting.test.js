import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');
const plugin=readFileSync(new URL('../android/app/src/main/java/com/focusgrove/plus/FocusScreenPlugin.java',import.meta.url),'utf8');

test('Blindado exposes a persisted screen-pinning preference in settings',()=>{
  assert.match(html,/id="shield-lock-screen-setting"[^>]*class="strict-focus-settings"/);
  assert.match(html,/>Ative aqui para intensificar sua blindagem<\/small>/);
  assert.ok(app.includes("'Ative aqui para intensificar sua blindagem':'Enable this to intensify your shield'"));
  assert.doesNotMatch(html,/Fixar FoCapy durante a sessão|O Android exibirá a confirmação nativa/);
  assert.ok(html.indexOf('dialog-note') < html.indexOf('settings-delete-account'));
  assert.ok(css.includes('.strict-focus-settings{margin:18px 0;padding:18px 16px'));
  assert.match(css,/\.completion-picker\{[^}]*display:grid/);
  assert.match(css,/\#settings-dialog\{[^}]*overscroll-behavior:contain/);
  assert.match(css,/\#settings-dialog\{[^}]*-webkit-overflow-scrolling:touch/);
  assert.match(app,/shield-lock-screen-toggle/);
});

test('a persisted keep-awake preference can keep any active focus session awake',()=>{
 assert.match(html,/id="keep-screen-awake-toggle"/);
 assert.match(html,/Manter a tela acesa durante sessão de foco/);
 assert.match(app,/keepScreenAwake:Boolean\(s\.keepScreenAwake\)/);
 assert.match(app,/keepScreenAwake:state\.keepScreenAwake/);
 assert.match(plugin,/boolean keepScreenAwake = call\.getBoolean\("keepScreenAwake", false\)/);
 assert.match(plugin,/if \(keepScreenAwake\)[\s\S]*FLAG_KEEP_SCREEN_ON/);
});

test('native screen pinning starts only while the opted-in Blindado session is running and releases afterward',()=>{
  assert.match(app,/shieldLockScreen:state\.shieldLockScreen/);
  assert.match(app,/lockScreen:running&&state\.shieldLockScreen/);
  assert.match(plugin,/if \(active && lockScreen\)[\s\S]*startLockTask\(\)[\s\S]*else[\s\S]*stopLockTask\(\)/);
  assert.doesNotMatch(plugin,/AccessibilityService|FocusSessionStore|ACTION_ACCESSIBILITY_SETTINGS/);
});
