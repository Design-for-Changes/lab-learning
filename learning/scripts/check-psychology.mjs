import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { psychologyEffects, psychologyEffectGroups, psychologyEffectPriorities, psychologyHistory, psychologySources, filterPsychologyEffects } from '../src/psychologyContent.js';
import { summarizePsychologyTrials } from '../src/psychologyMath.js';
import { averageErpTrials, erpTimes, erpTrials, illustrativeErp } from '../src/psychologyErp.js';
import { psychologyMeasurements } from '../src/psychologyMeasurements.js';
import { psychologyMeasurementRecords, fnirsExample } from '../src/psychologyMeasurementRecords.js';
import { psychologyRawRecords } from '../src/psychologyRawRecords.js';

// A waveform and its displayed interval summary must describe the same example.
const fnirsMean = (values,from,to) => {
  const selected=values.filter((_,i)=>fnirsExample.time[i]>=from&&fnirsExample.time[i]<to);
  return selected.reduce((sum,v)=>sum+v,0)/selected.length;
};
assert.ok(Math.abs(fnirsMean(fnirsExample.hbo,-4,0))<1e-12);
assert.ok(Math.abs(fnirsMean(fnirsExample.hbo,6,11)-0.6)<1e-12);
assert.ok(Math.abs(fnirsMean(fnirsExample.hbr,6,11)+0.2)<1e-12);
for (const item of psychologyMeasurements) {
  const record=psychologyMeasurementRecords[item.id];
  assert.ok(record?.basis&&record?.context, `Missing data reference: ${item.id}`);
  for (const row of item.rows) assert.equal(row.length,item.columns.length);
  if (record.rows) for (const row of record.rows) assert.equal(row.length,record.columns.length);
  for (const id of item.refs) assert.ok(psychologySources[id], `Missing measurement source: ${id}`);
  for (const id of psychologyRawRecords[item.id].refs||[]) assert.ok(psychologySources[id], `Missing raw-data source: ${id}`);
}

// Averaging is pointwise across aligned trials; duplicate copies preserve the waveform.
assert.deepEqual(averageErpTrials([[1,3,5],[3,5,9]]), [2,4,7]);
assert.deepEqual(averageErpTrials([erpTrials[0],erpTrials[0]]), erpTrials[0]);
assert.throws(() => averageErpTrials([[1,2],[1]]));
const residual = n => averageErpTrials(erpTrials.slice(0,n)).reduce((sum,v,i) => sum+(v-illustrativeErp(erpTimes[i]))**2,0);
assert.ok(residual(32)<residual(8) && residual(8)<residual(1), 'The chosen illustrative trials should show the averaging principle');

for (const item of [...psychologyHistory, ...psychologyEffects]) {
  for (const id of item.refs) assert.ok(psychologySources[id], `Missing psychology source: ${id}`);
}
assert.deepEqual(filterPsychologyEffects('ＳＴＲＯＯＰ').map(row => row.id), ['stroop']);
assert.equal(filterPsychologyEffects('Stroop', '記憶・学習').length, 0);
assert.ok(filterPsychologyEffects('記憶').length > 0);
assert.equal(new Set(psychologyEffects.map(row=>row.id)).size, psychologyEffects.length, 'Effect IDs must be unique for article anchors');
for (const effect of psychologyEffects) {
  assert.ok(psychologyEffectGroups.includes(effect.group), `Unknown effect group: ${effect.id}`);
  assert.ok(psychologyEffectPriorities.some(p=>p.id===effect.priority), `Unknown learning priority: ${effect.id}`);
  for (const key of ['name','english','what','compare','limit']) assert.ok(effect[key]?.trim(), `Missing ${key}: ${effect.id}`);
  assert.ok(effect.refs.length, `Missing references: ${effect.id}`);
}
assert.deepEqual(filterPsychologyEffects('ＳＴＲＯＯＰ','知覚・注意','core').map(row=>row.id), ['stroop']);
assert.equal(filterPsychologyEffects('Stroop','知覚・注意','advanced').length, 0);
assert.deepEqual(filterPsychologyEffects('気分 記憶','動機づけ・情動','field').map(row=>row.id), ['mood-congruent']);
assert.deepEqual(filterPsychologyEffects(), psychologyEffects);

const example = JSON.parse(readFileSync(new URL('../src/psychologyExample.json', import.meta.url)));
const result = summarizePsychologyTrials(example.trials);
assert.equal(result.totalTrials, 64);
assert.equal(result.participants.length, 8);
assert.equal(result.meanDifference, 100);
assert.deepEqual(result.participants.map(row => row.difference), [100,140,80,60,100,180,40,100]);
assert.equal(result.errorRate, 0);

// Different trial counts must not give one participant more weight in the mean difference.
const row = (participant, trial, condition, rt_ms, correct=1) => ({participant, trial, condition, rt_ms, correct});
const unequal = [row('A',1,'congruent',100), row('A',2,'incongruent',120),
  row('B',1,'congruent',200), row('B',2,'congruent',200), row('B',3,'incongruent',260),
  row('B',4,'incongruent',260), row('B',5,'incongruent',900,0)];
const summary = summarizePsychologyTrials(unequal);
assert.equal(summary.meanDifference, 40);
assert.equal(summary.correctTrials, 6);
assert.equal(summary.errorRate, 1/7);
assert.throws(() => summarizePsychologyTrials([unequal[0]]), /両条件/);
assert.throws(() => summarizePsychologyTrials([...unequal,unequal[0]]), /重複/);
assert.throws(() => summarizePsychologyTrials([row('A',1,'congruent',NaN)]));

// The downloadable CSV and actual Python output must agree with the displayed fixture.
const csv = readFileSync(new URL('../public/data/psychology/stroop-example.csv',import.meta.url),'utf8').trim().split(/\r?\n/);
const keys = csv.shift().split(',');
const parsed = csv.map(line => Object.fromEntries(line.split(',').map((value,i) =>
  [keys[i], ['trial','rt_ms','correct'].includes(keys[i]) ? Number(value) : value])));
assert.deepEqual(parsed, example.trials);
const python = execFileSync('python3', [new URL('../public/data/psychology/summarize_stroop.py',import.meta.url).pathname], {encoding:'utf8'});
assert.equal(python.trim(), example.output);
console.log('Psychology: sources, search, participant-level calculation, CSV and Python output passed');
