/**
 * Unit tests for KPSS Prediction Engine (using Node.js built-in test runner)
 * Tests edge cases, threshold margins, quota simulation, and list balance logic.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

// Import prediction functions
import { 
  calculateAdjustedScore, 
  predictPlacement, 
  analyzePreferenceBalance 
} from './prediction.ts';

// Mock province data
const mockProvince = {
  il: "ANKARA",
  periods: {
    "2024/5": { donem: "2024/5", year: 2024, total_quota: 100, min_score: 75.0, max_score: 85.0, placements_count: 5, general_quota: 90, special_quota: 10 },
    "2025/4": { donem: "2025/4", year: 2025, total_quota: 80, min_score: 77.0, max_score: 86.0, placements_count: 4, general_quota: 75, special_quota: 5 },
    "2025/5": { donem: "2025/5", year: 2025, total_quota: 90, min_score: 78.0, max_score: 87.0, placements_count: 4, general_quota: 85, special_quota: 5 }
  },
  total_quota: 270,
  overall_min_score: 75.0,
  overall_max_score: 87.0,
  latest_min_score: 78.0,
  latest_period: "2025/5"
};

test('1. calculateAdjustedScore - baseline without simulation', () => {
  const score = calculateAdjustedScore(80.0, { quotaChangePercent: 0, competitionMultiplier: 1.0 });
  assert.equal(score, 80.0);
});

test('2. calculateAdjustedScore - quota increase relaxes target score', () => {
  // +20% quota should shift target score down by 2 * 0.25 = 0.50 points
  const score = calculateAdjustedScore(80.0, { quotaChangePercent: 20, competitionMultiplier: 1.0 });
  assert.equal(score, 79.5);
});

test('3. calculateAdjustedScore - competition increase pushes target score up', () => {
  // 1.05x competition should shift score up by 0.05 * 8 = 0.40 points
  const score = calculateAdjustedScore(80.0, { quotaChangePercent: 0, competitionMultiplier: 1.05 });
  assert.equal(score, 80.4);
});

test('4. predictPlacement - safe classification (diff >= +1.25)', () => {
  // User score 80.0 vs target 78.0 -> diff = +2.00 >= 1.25 -> 'safe'
  const result = predictPlacement(80.0, mockProvince);
  assert.equal(result.category, 'safe');
  assert.equal(result.categoryTitle, 'Güvenli Tercih');
  assert.equal(result.scoreDifference, 2.0);
});

test('5. predictPlacement - boundary safe edge case exactly +1.25', () => {
  const result = predictPlacement(79.25, mockProvince);
  assert.equal(result.category, 'safe');
});

test('6. predictPlacement - possible classification (-0.85 <= diff < +1.25)', () => {
  // User score 77.5 vs target 78.0 -> diff = -0.50 -> 'possible'
  const result = predictPlacement(77.5, mockProvince);
  assert.equal(result.category, 'possible');
});

test('7. predictPlacement - boundary possible edge case exactly -0.85', () => {
  const result = predictPlacement(77.15, mockProvince);
  assert.equal(result.category, 'possible');
});

test('8. predictPlacement - risky classification (-2.20 <= diff < -0.85)', () => {
  // User score 76.5 vs target 78.0 -> diff = -1.50 -> 'risky'
  const result = predictPlacement(76.5, mockProvince);
  assert.equal(result.category, 'risky');
});

test('9. predictPlacement - boundary risky edge case exactly -2.20', () => {
  const result = predictPlacement(75.8, mockProvince);
  assert.equal(result.category, 'risky');
});

test('10. predictPlacement - unlikely classification (diff < -2.20)', () => {
  // User score 74.0 vs target 78.0 -> diff = -4.00 -> 'unlikely'
  const result = predictPlacement(74.0, mockProvince);
  assert.equal(result.category, 'unlikely');
});

test('11. analyzePreferenceBalance - empty list', () => {
  const balance = analyzePreferenceBalance([]);
  assert.equal(balance.status, 'empty');
  assert.equal(balance.score, 0);
});

test('12. analyzePreferenceBalance - high risk warning when zero safe choices', () => {
  const items = [
    { category: 'risky' },
    { category: 'unlikely' },
    { category: 'possible' }
  ];
  const balance = analyzePreferenceBalance(items);
  assert.equal(balance.status, 'high_risk');
  assert.ok(balance.message.includes('hiç Güvenli tercih yok'));
});

test('13. analyzePreferenceBalance - balanced list', () => {
  const items = [
    { category: 'safe' },
    { category: 'safe' },
    { category: 'possible' },
    { category: 'possible' },
    { category: 'risky' }
  ];
  const balance = analyzePreferenceBalance(items);
  assert.equal(balance.status, 'balanced');
  assert.equal(balance.score, 95);
});
