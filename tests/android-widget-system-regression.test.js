import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mergeNativeTaskChanges, focusSessionFromNative, completedFocusSessionFromNative } from '../src/widget-sync.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const manifest = read('android/app/src/main/AndroidManifest.xml');
const focusProvider = read('android/app/src/main/java/com/focapy/app/FocusWidgetProvider.java');
const focusState = read('android/app/src/main/java/com/focapy/app/FocapyWidgetState.java');
const focusAlarm = read('android/app/src/main/java/com/focapy/app/FocusCompletionReceiver.java');
const focusDurationActivity = read('android/app/src/main/java/com/focapy/app/FocusDurationActivity.java');
const taskProvider = read('android/app/src/main/java/com/focapy/app/TaskMonitorWidgetProvider.java');
const taskInputActivity = read('android/app/src/main/java/com/focapy/app/WidgetTaskInputActivity.java');
const plugin = read('android/app/src/main/java/com/focusgrove/plus/TaskWidgetPlugin.java');
const taskLayout = read('android/app/src/main/res/layout/task_monitor_widget.xml');
const focusLayout = read('android/app/src/main/res/layout/focapy_focus_widget.xml');
const app = read('src/app.js');

test('task widget can complete and create tasks natively without MainActivity', () => {
  assert.match(taskProvider, /ACTION_COMPLETE_TASK/);
  assert.match(taskProvider, /WidgetTaskInputActivity\.class/);
  assert.doesNotMatch(taskProvider, /MainActivity\.class/);
  assert.match(taskInputActivity, /enqueueCreatedTask/);
  assert.match(taskLayout, /widget_add_task/);
  assert.match(manifest, /\.WidgetTaskInputActivity/);
});

test('task bridge retains native mutations until JS explicitly acknowledges them', () => {
  assert.match(plugin, /createdTasks/);
  assert.match(plugin, /acknowledgedCreatedTaskIds/);
  assert.match(plugin, /acknowledgedFocusEventIds/);
  assert.match(plugin, /completedTaskIds/);
  assert.match(app, /nativeTaskWidgetPending/);
  assert.match(app, /acknowledgedCreatedTaskIds/);
  assert.match(app, /acknowledgedFocusEventIds/);
});

test('native task merge is idempotent and preserves existing app task metadata', () => {
  const tasks = [{ id: 'a', title: 'Existing', done: false, tag: 'Work', priority: 'high' }];
  const native = { completedTaskIds: ['a'], createdTasks: [{ id: 'native-1', title: '  New task  ' }] };
  const once = mergeNativeTaskChanges(tasks, native, '2026-09-10T12:00:00.000Z');
  const twice = mergeNativeTaskChanges(once.tasks, native, '2026-09-10T12:00:01.000Z');
  assert.equal(once.tasks[0].done, true);
  assert.equal(once.tasks[0].tag, 'Work');
  assert.equal(once.tasks[0].priority, 'high');
  assert.equal(once.tasks[1].title, 'New task');
  assert.deepEqual(twice.tasks, once.tasks);
  assert.deepEqual(once.acknowledgedCreatedTaskIds, ['native-1']);
});

test('focus widget exposes idle duration, running pause, and paused resume without MainActivity', () => {
  assert.match(focusProvider, /RESUME/);
  assert.match(focusProvider, /FocusDurationActivity\.class/);
  assert.doesNotMatch(focusProvider, /MainActivity\.class/);
  assert.match(focusDurationActivity, /setDurationMinutes/);
  assert.match(focusLayout, /focus_widget_duration/);
  assert.match(focusLayout, /focus_widget_resume/);
  assert.match(manifest, /\.FocusDurationActivity/);
});

test('focus completion is alarm-driven, notifies, queues a reward event, and refreshes widgets', () => {
  assert.match(focusState, /AlarmManager/);
  assert.match(focusState, /FocusCompletionReceiver/);
  assert.match(focusState, /setAndAllowWhileIdle|setExactAndAllowWhileIdle/);
  assert.match(focusAlarm, /NotificationManager/);
  assert.match(focusAlarm, /enqueueCompletedFocus/);
  assert.match(focusAlarm, /FocusWidgetProvider\.updateAllWidgets/);
  assert.match(manifest, /android\.permission\.POST_NOTIFICATIONS/);
  assert.match(manifest, /\.FocusCompletionReceiver/);
});

test('native focus snapshots map to app sessions and completed events map to rewards exactly once', () => {
  const active = focusSessionFromNative({ token: 'focus-1', mode: 'foco', durationSeconds: 1200, elapsedSeconds: 30, running: false, startedAt: '2026-09-10T10:00:00.000Z' });
  assert.equal(active.id, 'widget-focus-1');
  assert.equal(active.totalSeconds, 1200);
  assert.equal(active.elapsedSeconds, 30);
  assert.equal(active.status, 'paused');
  const completed = completedFocusSessionFromNative({ id: 'done-1', durationSeconds: 1500, completedAt: '2026-09-10T10:25:00.000Z' });
  assert.equal(completed.id, 'widget-done-1');
  assert.equal(completed.status, 'completed');
  assert.equal(completed.focusMinutes, 25);
  assert.equal(completed.completedAt, '2026-09-10T10:25:00.000Z');
});
