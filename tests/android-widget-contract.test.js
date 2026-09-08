import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const manifest = readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
const provider = readFileSync(new URL('../android/app/src/main/java/com/focapy/app/TaskMonitorWidgetProvider.java', import.meta.url), 'utf8');
const plugin = readFileSync(new URL('../android/app/src/main/java/com/focusgrove/plus/TaskWidgetPlugin.java', import.meta.url), 'utf8');
const activity = readFileSync(new URL('../android/app/src/main/java/com/focapy/app/MainActivity.java', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../android/app/src/main/res/layout/task_monitor_widget.xml', import.meta.url), 'utf8');

test('native task monitor widget renders three native task slots without launching the app', () => {
  assert.match(manifest, /TaskMonitorWidgetProvider/);
  assert.match(manifest, /@xml\/task_monitor_widget_info/);
  assert.doesNotMatch(manifest, /FocapyWidgetProvider/);
  assert.match(provider, /PendingIntent\.getBroadcast/);
  assert.doesNotMatch(provider, /PendingIntent\.getActivity/);
  assert.match(provider, /ACTION_COMPLETE_TASK/);
  assert.match(provider, /updateAllWidgets/);
  assert.match(layout, /widget_task_0/);
  assert.match(layout, /widget_task_1/);
  assert.match(layout, /widget_task_2/);
  assert.ok(existsSync(new URL('../android/app/src/main/res/xml/task_monitor_widget_info.xml', import.meta.url)));
});

test('task widget plugin persists snapshots and returns widget completion IDs for JS reconciliation', () => {
  assert.match(activity, /registerPlugin\(TaskWidgetPlugin\.class\)/);
  assert.match(plugin, /@CapacitorPlugin\(name = "TaskWidget"\)/);
  assert.match(plugin, /@PluginMethod/);
  assert.match(plugin, /syncTasks/);
  assert.match(plugin, /SharedPreferences/);
  assert.match(plugin, /completedTaskIds/);
  assert.match(plugin, /TaskMonitorWidgetProvider\.updateAllWidgets/);
});

test('web state syncs pending tasks and applies native completions locally', () => {
  assert.match(app, /function syncNativeTaskWidget\(\)/);
  assert.match(app, /window\.Capacitor\?\.Plugins\?\.TaskWidget/);
  assert.match(app, /completedTaskIds/);
  assert.match(app, /completeTasksForSession\(state\.tasks,completedTaskIds\)/);
  assert.match(app, /syncNativeTaskWidget\(\)/);
});
