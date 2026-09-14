import { mean, variance, pairedTimes } from './math.js';

// These functions are deliberately limited to the lesson's 12-person example (df = 11).
export const studentT11PDF = t => 256 / (63 * Math.PI * Math.sqrt(11)) * (1 + t * t / 11) ** -6;

export function twoSidedT11Probability(t) {
  if (!Number.isFinite(t)) throw new RangeError('t値には有限の数を指定してください。');
  // Substitute t = sqrt(11) * tan(theta) to integrate both infinite tails.
  const start = Math.atan(Math.abs(t) / Math.sqrt(11)), n = 512;
  const step = (Math.PI / 2 - start) / n;
  let sum = Math.cos(start) ** 10;
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * Math.cos(start + i * step) ** 10;
  return Math.min(1, Math.max(0, 2 * 256 / (63 * Math.PI) * step * sum / 3));
}

const differences = pairedTimes.a.map((value, i) => value - pairedTimes.b[i]);
if (differences.length !== 12) throw new Error('この教材のt分布は12人・自由度11専用です。');
const average = mean(differences), sd = Math.sqrt(variance(differences));
const se = sd / Math.sqrt(differences.length), t = average / se;
export const pairedTExample = { n: 12, df: 11, average, sd, se, t, p: twoSidedT11Probability(t) };
