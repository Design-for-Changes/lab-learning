// Average within each participant first: repeated trials are not extra people.
export function summarizePsychologyTrials(trials) {
  if (!Array.isArray(trials) || !trials.length) throw new Error('試行データがありません');
  const groups = new Map(), seen = new Set();
  let correctTrials = 0;
  for (const row of trials) {
    if (!row.participant || !Number.isInteger(row.trial) || row.trial < 1 ||
        !['congruent', 'incongruent'].includes(row.condition) ||
        ![0, 1].includes(row.correct) || !Number.isFinite(row.rt_ms) || row.rt_ms <= 0) {
      throw new Error('参加者・試行番号・条件・正誤・反応時間を確認してください');
    }
    const key = `${row.participant}/${row.trial}`;
    if (seen.has(key)) throw new Error('同じ試行が重複しています');
    seen.add(key);
    if (!groups.has(row.participant)) groups.set(row.participant, {congruent: [], incongruent: []});
    if (row.correct === 1) {
      groups.get(row.participant)[row.condition].push(row.rt_ms);
      correctTrials++;
    }
  }
  const average = values => values.reduce((sum, value) => sum + value, 0) / values.length;
  const participants = [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([participant, conditions]) => {
    if (!conditions.congruent.length || !conditions.incongruent.length) {
      throw new Error(`${participant}に両条件の正答データが必要です`);
    }
    const congruent = average(conditions.congruent), incongruent = average(conditions.incongruent);
    return {participant, congruent, incongruent, difference: incongruent - congruent};
  });
  return {participants, meanDifference: average(participants.map(row => row.difference)),
    totalTrials: trials.length, correctTrials, errorRate: (trials.length - correctTrials) / trials.length};
}
