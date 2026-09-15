import assert from 'node:assert/strict';
import { marketAt, marketScenarios, productionAt, spendingEquilibrium, outputAt } from '../src/economicsMath.js';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
for (const [scenario, expectedPrice, expectedQuantity] of [['baseline',360,60],['demand',440,80],['cost',440,40]]) {
  const equilibrium = marketAt(scenario, expectedPrice);
  assert.equal(equilibrium.price, expectedPrice);
  assert.equal(equilibrium.quantity, expectedQuantity);
  assert.equal(equilibrium.demanded, expectedQuantity);
  assert.equal(equilibrium.supplied, expectedQuantity);
  for (let p = 200; p <= 600; p += 20) {
    const result = marketAt(scenario, p);
    assert.ok(result.demanded >= 0 && result.supplied >= 0);
    assert.equal(Math.sign(result.demanded - result.supplied), Math.sign(expectedPrice - p));
  }
}
for (const key of Object.keys(marketScenarios)) {
  assert.ok(marketAt(key,600).demanded <= marketAt(key,200).demanded);
  assert.ok(marketAt(key,600).supplied >= marketAt(key,200).supplied);
}
const outcomes = [0,1,2,3,4,5,6].map(q=>productionAt(q));
assert.equal(outcomes.reduce((best,row)=>row.profit>best.profit?row:best).quantity,4);
assert.equal(outcomes[4].profit,120);
outcomes.forEach((row,q)=>{
  assert.equal(row.revenue-row.cost,row.profit);
  if(q) assert.equal(row.cost-outcomes[q-1].cost,row.additionalCost);
});
for (const [a,investment,income,consumption] of [[20,80,500,420],[0,80,400,320],[0,100,500,400]]) {
  const row=spendingEquilibrium(a,investment);
  close(row.income,income); close(row.consumption,consumption);
  close(row.income,row.consumption+investment); close(row.saving,investment);
}
const base=outputAt(300,100), inflation=outputAt(360,100), growth=outputAt(300,120);
assert.equal(inflation.real,base.real);
assert.equal(inflation.nominal/base.nominal,1.2);
assert.equal(growth.real/base.real,1.2);
assert.equal(growth.nominal,growth.real);
console.log('Economics: market clearing, shortage and surplus, profit, spending identities, nominal and real output passed.');
