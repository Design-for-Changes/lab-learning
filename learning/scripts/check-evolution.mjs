import assert from 'node:assert/strict';
import { hamiltonEffect, selectionSeries } from '../src/evolutionMath.js';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`);
for (const initial of [0, 0.05, 0.5, 0.95, 1]) {
  for (const fitness of [0.5, 0.8, 1, 1.2, 1.5]) {
    const series = selectionSeries(initial, fitness);
    assert.equal(series.length, 31);
    series.forEach((value, generation) => {
      assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
      // Independent closed-form odds solution for constant selection.
      const a = initial * fitness ** generation;
      close(value, a / (a + 1 - initial));
      if (generation > 0) {
        if (fitness > 1) assert.ok(value >= series[generation - 1]);
        if (fitness < 1) assert.ok(value <= series[generation - 1]);
        if (fitness === 1) close(value, initial);
      }
    });
  }
}
assert.deepEqual(selectionSeries(0.3, 1.2, 0), [0.3]);
close(hamiltonEffect(0.5, 3, 1), 0.5);
close(hamiltonEffect(0.5, 2, 1), 0);
close(hamiltonEffect(0.25, 2, 1), -0.5);
close(hamiltonEffect(0, 6, 1), -1);
close(hamiltonEffect(0.75, 0, 0), 0);
for (const args of [[-1, 1], [1.1, 1], [0.5, 0], [0.5, Infinity], [0.5, 1, -1]]) {
  assert.throws(() => selectionSeries(...args), RangeError);
}
for (const args of [[-0.1, 1, 1], [1.1, 1, 1], [0.5, -1, 1], [0.5, 1, NaN]]) {
  assert.throws(() => hamiltonEffect(...args), RangeError);
}
console.log('Evolution models: constant selection, boundaries and Hamilton thresholds passed.');
