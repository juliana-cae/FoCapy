import test from 'node:test';
import assert from 'node:assert/strict';
import { BACKUP_INTERVAL_DAYS, backupDue, nextBackupAt, backupFileName, createBackupPayload } from '../src/backup.js';

test('backup is due on first run and after fifteen days', () => {
  assert.equal(BACKUP_INTERVAL_DAYS, 15);
  assert.equal(backupDue(null, '2026-09-06T00:00:00.000Z'), true);
  assert.equal(backupDue('2026-09-06T00:00:00.000Z', '2026-09-20T23:59:59.000Z'), false);
  assert.equal(backupDue('2026-09-06T00:00:00.000Z', '2026-09-21T00:00:00.000Z'), true);
});

test('next backup date is calculated without mutating the input', () => {
  const last = '2026-09-06T12:00:00.000Z';
  assert.equal(nextBackupAt(last), '2026-09-21T12:00:00.000Z');
  assert.equal(last, '2026-09-06T12:00:00.000Z');
});

test('backup file names are safe and deterministic', () => {
  assert.equal(backupFileName('my phone/one', '2026-09-06T12:34:56.000Z'), '20260906T123456Z-my-phone-one.focapy');
});

test('backup payload preserves state and metadata without sharing references', () => {
  const state = { tasks: [{ id: 'a', title: 'Study' }] };
  const payload = createBackupPayload({ state, deviceId: 'phone-1', createdAt: '2026-09-06T12:00:00.000Z' });
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.createdAt, '2026-09-06T12:00:00.000Z');
  assert.deepEqual(payload.state, state);
  assert.notEqual(payload.state, state);
  payload.state.tasks[0].title = 'Changed';
  assert.equal(state.tasks[0].title, 'Study');
});
