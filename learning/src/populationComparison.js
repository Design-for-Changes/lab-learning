import { mean } from './math.js';

const offsets=[-22,-17,-13,-10,-8,-6,-5,-3,-2,-1,1,2,3,5,6,8,10,13,17,22];
const deviations=Array.from({length:80},(_,i)=>offsets[i%20]+[-1.5,-.5,.5,1.5][Math.floor(i/20)]);
const examplePool=deviations.map(value=>60+value);

// Model selection changes the explanatory model, never the observed samples.
export function populationComparison(draw=0,different=false){
  if(!Number.isInteger(draw)||draw<0)throw new RangeError('標本例は0以上の整数です。');
  let state=(draw+1)*3177;
  const random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
  const shuffled=examplePool.map((_,i)=>i);
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  const indices=[shuffled.slice(0,12),shuffled.slice(12,24)];
  const samples=indices.map(ids=>ids.map(id=>examplePool[id]));
  const sampleMeans=samples.map(mean),commonMean=mean(samples.flat());
  const modelMeans=different?sampleMeans:[commonMean,commonMean];
  const modelPoints=modelMeans.map(center=>deviations.map(value=>center+value));
  return {indices,samples,sampleMeans,modelMeans,modelPoints};
}
