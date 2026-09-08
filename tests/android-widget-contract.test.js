import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const manifest = readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
const activity = readFileSync(new URL('../android/app/src/main/java/com/focapy/app/MainActivity.java', import.meta.url), 'utf8');
const provider = readFileSync(new URL('../android/app/src/main/java/com/focapy/app/FocapyWidgetProvider.java', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../android/app/src/main/res/layout/focapy_widget.xml', import.meta.url), 'utf8');

test('Android home widget exposes focus, stopwatch, and task shortcuts', () => {
  assert.match(manifest, /FocapyWidgetProvider/);
  assert.match(manifest, /@xml\/focapy_widget_info/);
  assert.match(provider, /ACTION_FOCUS = "focus"/);
  assert.match(provider, /ACTION_STOPWATCH = "stopwatch"/);
  assert.match(provider, /ACTION_TASKS = "tasks"/);
  assert.match(layout, /id="@\+id\/widget_focus"/);
  assert.match(layout, /id="@\+id\/widget_stopwatch"/);
  assert.match(layout, /id="@\+id\/widget_tasks"/);
  assert.ok(existsSync(new URL('../android/app/src/main/res/xml/focapy_widget_info.xml', import.meta.url)));
});

test('widget actions open tasks or safely start the requested focus mode', () => {
  assert.match(activity, /window\.focapyWidgetAction/);
  assert.match(app, /function runWidgetAction\(action\)/);
  assert.match(app, /action==='tasks'/);
  assert.match(app, /action==='stopwatch'\?'cronometro':'foco'/);
  assert.match(app, /window\.addEventListener\('focapy-widget-action'/);
});
