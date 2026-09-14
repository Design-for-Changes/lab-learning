import { mean } from './math.js';

// Equal-sized groups are used by the teaching figure; the calculation also
// handles unequal group sizes. This is the ordinary fixed-effects one-way ANOVA.
export function oneWayAnova(groups) {
  if(groups.length<2||groups.some(g=>g.length<2||g.some(x=>!Number.isFinite(x))))throw new RangeError('2群以上、各群に有限の値が2つ以上必要です。');
  const values=groups.flat(),grand=mean(values),means=groups.map(mean);
  const between=groups.reduce((sum,g,i)=>sum+g.length*(means[i]-grand)**2,0);
  const within=groups.reduce((sum,g,i)=>sum+g.reduce((s,x)=>s+(x-means[i])**2,0),0);
  const dfBetween=groups.length-1,dfWithin=values.length-groups.length;
  const msBetween=between/dfBetween,msWithin=within/dfWithin;
  return {means,grand,between,within,dfBetween,dfWithin,msBetween,msWithin,f:msWithin>0?msBetween/msWithin:NaN};
}
export function anovaExample(gap,spread) {
  return [0,1,2].map(group=>[-3,-2,-1,0,1,2,3].map(offset=>20+group*gap+offset*spread));
}
// Closed-form F survival function ONLY for the figure's df=(2,18).
export function fTail2And18(f) {
  if(!Number.isFinite(f)||f<0)throw new RangeError('F値は0以上の有限の値です。');
  return (1+f/9)**-9;
}

// Balanced 2 x 2 design: rows are contrast, columns are size, each cell has replicates.
export function twoWayAnova2x2(cells) {
  if(cells.length!==2||cells.some(row=>row.length!==2))throw new RangeError('2要因・各2水準のデータが必要です。');
  const n=cells[0][0].length;
  if(n<2||cells.flat().some(cell=>cell.length!==n||cell.some(x=>!Number.isFinite(x))))throw new RangeError('各条件に同数の、有限の観測値が2つ以上必要です。');
  const means=cells.map(row=>row.map(mean)),grand=mean(means.flat());
  const contrastMeans=means.map(mean),sizeMeans=[0,1].map(j=>mean(means.map(row=>row[j])));
  const contrastSS=2*n*contrastMeans.reduce((sum,x)=>sum+(x-grand)**2,0);
  const sizeSS=2*n*sizeMeans.reduce((sum,x)=>sum+(x-grand)**2,0);
  const interactionSS=n*means.reduce((sum,row,i)=>sum+row.reduce((s,x,j)=>s+(x-contrastMeans[i]-sizeMeans[j]+grand)**2,0),0);
  const errorSS=cells.reduce((sum,row,i)=>sum+row.reduce((s,cell,j)=>s+cell.reduce((total,x)=>total+(x-means[i][j])**2,0),0),0);
  const errorDF=4*(n-1),errorMS=errorSS/errorDF;
  const effect=ss=>({ss,df:1,ms:ss,f:errorMS>0?ss/errorMS:NaN});
  return {means,grand,n,sizeMeans,contrastMeans,size:effect(sizeSS),contrast:effect(contrastSS),interaction:effect(interactionSS),error:{ss:errorSS,df:errorDF,ms:errorMS},totalSS:sizeSS+contrastSS+interactionSS+errorSS};
}
export function twoWayExample(interaction=false) {
  const means=interaction?[[40,20],[20,40]]:[[40,30],[30,20]];
  return means.map(row=>row.map(center=>[-8,-4,0,4,8].map(offset=>center+offset)));
}
// F survival function ONLY for the example's effect df=1 and residual df=16.
export function fTail1And16(f) {
  if(!Number.isFinite(f)||f<0)throw new RangeError('F値は0以上の有限の値です。');
  // F(1,16) = t(16)^2; t = 4*tan(theta) turns the infinite tail into cos(theta)^15.
  const start=Math.atan(Math.sqrt(f)/4),n=512,step=(Math.PI/2-start)/n;
  let sum=Math.cos(start)**15;
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*Math.cos(start+i*step)**15;
  return Math.min(1,Math.max(0,6435/2048*step*sum/3));
}
export const fullFactorial3=[1,2].flatMap(a=>[1,2].flatMap(b=>[1,2].map(c=>[a,b,c])));
export const l4Design=[[1,1,1],[1,2,2],[2,1,2],[2,2,1]];
