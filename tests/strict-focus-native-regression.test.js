import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const root=new URL('..',import.meta.url);
const file=p=>readFileSync(new URL(p,root),'utf8');

test('the app has no Android accessibility-service or overlay implementation',()=>{
 const manifest=file('android/app/src/main/AndroidManifest.xml');
 const app=file('src/app.js'); const html=file('index.html');
 assert.doesNotMatch(manifest,/AccessibilityService|BIND_ACCESSIBILITY_SERVICE/);
 assert.doesNotMatch(app,/openAccessibilitySettings|isAccessibilityEnabled|strictFocusEndTime/);
 assert.doesNotMatch(html,/Strict Focus Mode|strict-focus-activate|strict-focus-status/);
 assert.equal(existsSync(new URL('android/app/src/main/java/com/focusgrove/plus/FocusAccessibilityService.java',root)),false);
 assert.equal(existsSync(new URL('android/app/src/main/java/com/focusgrove/plus/FocusSessionStore.java',root)),false);
 assert.equal(existsSync(new URL('android/app/src/main/res/xml/focus_accessibility_service.xml',root)),false);
});

test('Blindado stays limited to FoCapy visual navigation and screen-on behavior',()=>{
 const plugin=file('android/app/src/main/java/com/focusgrove/plus/FocusScreenPlugin.java');
 assert.match(plugin,/FLAG_KEEP_SCREEN_ON/);
 assert.doesNotMatch(plugin,/Settings\.ACTION_ACCESSIBILITY_SETTINGS|FocusSessionStore|Accessibility/);
});
