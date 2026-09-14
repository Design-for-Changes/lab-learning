// Illustrative waveforms, not EEG measurements or a model for diagnosing people.
export const erpTimes = Array.from({length: 161}, (_, i) => -100 + i * 5);
export const illustrativeErp = t => 8 * Math.exp(-(((t - 350) / 85) ** 2)) - 3 * Math.exp(-(((t - 130) / 40) ** 2));
export const erpTrials = Array.from({length: 32}, (_, trial) => erpTimes.map(t => {
  const phase = trial * 2.399963229728653;
  const noise = 8 * Math.sin(t / 37 + phase) + 5 * Math.cos(t / 19 + phase * 1.7) + 3 * Math.sin(t / 9 + phase * 2.3);
  return illustrativeErp(t) + noise;
}));
export function averageErpTrials(trials) {
  if (!trials.length || !trials[0].length || trials.some(row => row.length !== trials[0].length || row.some(v => !Number.isFinite(v)))) {
    throw new Error('同じ時点でそろえた波形が必要です');
  }
  return trials[0].map((_, i) => trials.reduce((sum, row) => sum + row[i], 0) / trials.length);
}
