import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

test('focus sessions expose persisted tags and a statistics destination', () => {
  assert.doesNotMatch(html, /id="session-tag-select"/);
  assert.match(html, /id="new-session-tag"/);
  assert.match(html, /id="add-session-tag"/);
  assert.match(html, /id="statistics" class="screen"/);
  assert.match(html, /data-screen="statistics"/);
  assert.match(html, /data-stats-period="daily"/);
  assert.match(html, /data-stats-period="weekly"/);
  assert.match(html, /data-stats-period="monthly"/);
  assert.match(html, /data-stats-period="annual"/);
  assert.match(html, /id="statistics-chart"/);
  assert.match(html, /id="tag-statistics-body"/);
  assert.match(app, /function renderSessionTags\(\)\{const list=/);
  assert.doesNotMatch(app, /\$\('session-tag-select'\)/);
  assert.match(app, /function renderStatistics\(/);
  assert.match(app, /state\.tags=normalizeCategoryTree\(\[\.\.\.state\.tags/);
  assert.match(app, /state\.current\.tag=state\.selectedTag\|\|''/);
});
