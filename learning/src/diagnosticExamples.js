import { normalCDF } from './math.js';

function normalQuantile(p) {
  let low=-8,high=8;
  for(let i=0;i<45;i++){const mid=(low+high)/2;if(normalCDF(mid)<p)low=mid;else high=mid;}
  return (low+high)/2;
}
export const normalScores=Array.from({length:20},(_,i)=>normalQuantile((i+.5)/20));
const order=[6,17,1,12,9,15,3,10,19,5,14,0,11,7,18,4,13,2,16,8];
export function diagnosticExample(kind='steady') {
  if(!['steady','outlier','funnel'].includes(kind))throw new RangeError('図の例を指定してください。');
  const residuals=order.map(index=>3*normalScores[index]);
  if(kind==='outlier')residuals[15]=18;
  if(kind==='funnel')for(let i=0;i<20;i++)residuals[i]=[-1.5,.6,0,-.6,1.5][i%5]*(1+Math.floor(i/5)*2);
  const observations=residuals.map((residual,i)=>({predicted:20+2*i,observed:20+2*i+residual,residual}));
  const sorted=[...residuals].sort((a,b)=>a-b);
  const quantile=p=>{const index=(sorted.length-1)*p,low=Math.floor(index);return sorted[low]+(sorted[Math.min(low+1,sorted.length-1)]-sorted[low])*(index-low);};
  const slope=(quantile(.75)-quantile(.25))/(2*normalQuantile(.75)),center=quantile(.5);
  const bins=Array.from({length:10},(_,i)=>({low:-20+i*4,high:-16+i*4,count:0}));
  for(const residual of residuals)bins[Math.min(9,Math.max(0,Math.floor((residual+20)/4)))].count++;
  return {observations,residuals,sorted,bins,slope,center};
}
