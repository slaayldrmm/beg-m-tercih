import test from 'node:test';
import assert from 'node:assert/strict';
import { toProvinceSlug } from './province-slug';

test('toProvinceSlug normalizes Turkish province names consistently', () => {
  assert.equal(toProvinceSlug('İstanbul'), 'istanbul');
  assert.equal(toProvinceSlug('İzmir'), 'izmir');
  assert.equal(toProvinceSlug('Şanlıurfa'), 'sanliurfa');
  assert.equal(toProvinceSlug('Iğdır'), 'igdir');
  assert.equal(toProvinceSlug('Düzce'), 'duzce');
});
