import test from 'node:test';
import assert from 'node:assert/strict';
import { addSessionTag, normalizeSessionTags, statisticsForPeriod } from '../src/core.js';

test('tags are trimmed, unique regardless of case, and reusable', () => {
  const tags = normalizeSessionTags([' Trabalho ', 'Estudo', 'trabalho', '', null]);
  assert.deepEqual(tags, [{ name: 'Trabalho', color: '#2d6c4d' }, { name: 'Estudo', color: '#2d6c4d' }]);
  assert.deepEqual(addSessionTag(tags, 'Saúde'), [{ name: 'Trabalho', color: '#2d6c4d' }, { name: 'Estudo', color: '#2d6c4d' }, { name: 'Saúde', color: '#2d6c4d' }]);
  assert.deepEqual(addSessionTag(tags, ' estudo '), [{ name: 'Trabalho', color: '#2d6c4d' }, { name: 'Estudo', color: '#2d6c4d' }]);
});

test('statistics aggregate completed focus time by day and tag', () => {
  const sessions = [
    { status: 'completed', completedAt: '2026-09-06T10:00:00.000Z', focusMinutes: 40, tag: 'Trabalho' },
    { status: 'completed', completedAt: '2026-09-06T14:00:00.000Z', focusMinutes: 20, tag: 'Estudo' },
    { status: 'completed', completedAt: '2026-09-05T09:00:00.000Z', focusMinutes: 30, tag: 'Trabalho' },
    { status: 'paused', completedAt: '2026-09-06T12:00:00.000Z', focusMinutes: 99, tag: 'Ignorar' },
  ];
  const stats = statisticsForPeriod(sessions, 'daily', new Date('2026-09-06T18:00:00.000Z'));
  assert.equal(stats.totalMinutes, 90);
  assert.equal(stats.totalSessions, 3);
  assert.deepEqual(stats.tags.slice(0, 2), [
    { tag: 'Trabalho', minutes: 70, sessions: 2 },
    { tag: 'Estudo', minutes: 20, sessions: 1 },
  ]);
  assert.equal(stats.series.at(-1).minutes, 60);
});

test('weekly, monthly, and annual views produce chronological chart series', () => {
  const sessions = [{ status: 'completed', completedAt: '2026-09-06T10:00:00.000Z', focusMinutes: 25, tag: 'Trabalho' }];
  const now = new Date('2026-09-06T18:00:00.000Z');
  for (const period of ['weekly', 'monthly', 'annual']) {
    const stats = statisticsForPeriod(sessions, period, now);
    assert.ok(stats.series.length > 1);
    assert.equal(stats.series.at(-1).minutes, 25);
  }
});
