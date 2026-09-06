import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const root=new URL('..',import.meta.url);
const file=p=>readFileSync(new URL(p,root),'utf8');
test('strict focus uses an accessibility service and persistent end time',()=>{
 const manifest=file('android/app/src/main/AndroidManifest.xml'); const service=file('android/app/src/main/java/com/focusgrove/plus/FocusAccessibilityService.java'); const store=file('android/app/src/main/java/com/focusgrove/plus/FocusSessionStore.java');
 assert.match(manifest,/FocusAccessibilityService/);assert.match(manifest,/BIND_ACCESSIBILITY_SERVICE/);assert.match(service,/TYPE_ACCESSIBILITY_OVERLAY/);assert.match(service,/TYPE_WINDOW_STATE_CHANGED/);assert.match(service,/TYPE_WINDOWS_CHANGED/);assert.match(service,/GLOBAL_ACTION_DISMISS_NOTIFICATION_SHADE/);assert.match(store,/focusEndTime/);assert.match(store,/allowedPackages/);
});
test('web strict focus opens accessibility settings and no kiosk UI survives',()=>{const app=file('src/app.js'),html=file('index.html');assert.match(app,/openAccessibilitySettings/);assert.match(app,/isAccessibilityEnabled/);assert.doesNotMatch(app,/externalAppLock==='kiosk'/);assert.doesNotMatch(html,/Quiosque gerenciado/);assert.match(html,/strict-focus-activate/);});
