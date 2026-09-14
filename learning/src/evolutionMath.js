// Two faithfully inherited haploid types; deterministic selection only.
// Type B has relative fitness 1. Mutation, migration and drift are omitted.
export function selectionSeries(initial, relativeFitness, generations = 30) {
  if (!Number.isFinite(initial) || initial < 0 || initial > 1 ||
      !Number.isFinite(relativeFitness) || relativeFitness <= 0 ||
      !Number.isInteger(generations) || generations < 0 || generations > 1000) {
    throw new RangeError('Invalid selection model parameters');
  }
  const series = [initial];
  for (let generation = 0; generation < generations; generation += 1) {
    const p = series.at(-1);
    series.push((p * relativeFitness) / (p * relativeFitness + (1 - p)));
  }
  return series;
}

export function hamiltonEffect(relatedness, benefit, cost) {
  if (![relatedness, benefit, cost].every(Number.isFinite) ||
      relatedness < 0 || relatedness > 1 || benefit < 0 || cost < 0) {
    throw new RangeError('Invalid Hamilton model parameters');
  }
  return relatedness * benefit - cost;
}
