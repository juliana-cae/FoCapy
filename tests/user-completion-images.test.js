import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { COMPLETION_IMAGE_FILES, pickCompletionImage } from '../src/core.js';

const received = [
  'completion-feeding.jpg',
  'completion-rider.jpg',
  'completion-water-side.jpg',
  'completion-pink-cup.jpg',
  'completion-flowers.jpg',
  'completion-basin.jpg',
  'completion-resting.jpg',
  'completion-family.jpg',
  'completion-underwater.jpg',
  'completion-water-portrait.jpg',
  'completion-seaside-drink.jpg',
  'completion-lake-snack.jpg',
  'completion-pair-mud.jpg',
  'completion-pair-rest.jpg',
  'completion-bird.jpg',
  'completion-cat-cuddle.jpg',
  'completion-sunset-lake.jpg',
  'completion-pink-heart-glasses.jpg',
];

test('user-provided capybara images are available in the random completion pool', () => {
  for (const file of received) {
    assert.ok(COMPLETION_IMAGE_FILES.includes(file), `${file} is in the completion pool`);
    assert.equal(existsSync(new URL(`../assets/${file}`, import.meta.url)), true, `${file} is bundled`);
  }
  assert.equal(pickCompletionImage(() => 0), COMPLETION_IMAGE_FILES[0]);
  assert.equal(pickCompletionImage(() => 0.999999), COMPLETION_IMAGE_FILES.at(-1));
});
