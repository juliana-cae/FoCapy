import test from 'node:test';
import assert from 'node:assert/strict';
import { VEGETATION, statisticsForPeriod } from '../src/core.js';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

test('catalog is ordered by coherent rarity and Peideta has no wind emoji', () => {
  const order = ['comum', 'incomum', 'raro', 'lendário', 'suprema', 'amaldiçoado'];
  const levels = VEGETATION.map(item => order.indexOf(item.rarity));
  assert.ok(levels.every((level, index) => index === 0 || level >= levels[index - 1]));
  assert.equal(VEGETATION.find(item => item.id === 'peideta').icon.includes('💨'), false);
});

test('statistics expose color-preserving category series for each period point', () => {
  const sessions = [
    { status: 'completed', completedAt: '2026-09-01T12:00:00.000Z', focusMinutes: 25, tag: 'Estudo', tagColor: '#3366CC' },
    { status: 'completed', completedAt: '2026-09-02T12:00:00.000Z', focusMinutes: 40, tag: 'Trabalho', tagColor: '#CC6633' },
    { status: 'completed', completedAt: '2026-09-02T13:00:00.000Z', focusMinutes: 10, tag: 'Estudo', tagColor: '#3366CC' },
  ];
  const stats = statisticsForPeriod(sessions, 'daily', new Date('2026-09-02T18:00:00Z'));
  assert.deepEqual(stats.categorySeries.map(item => [item.tag, item.color]), [['Trabalho', '#cc6633'], ['Estudo', '#3366cc']]);
  assert.deepEqual(stats.categorySeries.find(item => item.tag === 'Estudo').points.slice(-2), [25, 10]);
  assert.match(html, /id="category-statistics-chart"/);
  assert.match(app, /function renderCategoryStatisticsChart\(/);
});
