import { normalPDF, normalProbability } from './math.js';

export const histogramTimes=[4,7,9,10,11,12,13,14,14,15,16,16,17,18,18,19,20,21,22,23,24,26,28,31,34,37,41,46,52,58];

export function histogramBins(width){
 if(![5,10,20].includes(width))throw new RangeError('区間の幅は5秒、10秒、20秒です。');
 return Array.from({length:60/width},(_,i)=>{
  const low=i*width,high=low+width;
  const count=histogramTimes.filter(value=>value>=low&&value<high).length;
  return {low,high,count,density:count/(histogramTimes.length*width),share:count/histogramTimes.length};
 });
}

// A Gaussian kernel estimate with a fixed 5-second bandwidth. Reflection at
// zero keeps the time model nonnegative and its total probability equal to 1.
// KDE background: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gaussian_kde.html
const bandwidth=5;
export function estimatedTimeDensity(x){
 if(x<0)return 0;
 return histogramTimes.reduce((sum,time)=>sum+normalPDF(x,time,bandwidth)+normalPDF(x,-time,bandwidth),0)/histogramTimes.length;
}
export function estimatedTimeProbability(low,high){
 if(low<0||high<low)throw new RangeError('0以上の下限と、それ以上の上限を指定してください。');
 return histogramTimes.reduce((sum,time)=>sum+normalProbability(low,high,time,bandwidth)+normalProbability(low,high,-time,bandwidth),0)/histogramTimes.length;
}
