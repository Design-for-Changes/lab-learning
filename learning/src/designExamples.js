import { l4Design } from './experimentMath.js';
import { mean } from './math.js';

export const designFactors=[
 {name:'サイズ',levels:['小','大']},
 {name:'コントラスト',levels:['低','高']},
 {name:'余白',levels:['狭い','広い']},
];
export const rowLabels=['①','②','③','④'];
// Conventional L8 column order; a line in the linear graph names an interaction column.
export const l8Design=[
 [1,1,1,1,1,1,1], [1,1,1,2,2,2,2],
 [1,2,2,1,1,2,2], [1,2,2,2,2,1,1],
 [2,1,2,1,2,1,2], [2,1,2,2,1,2,1],
 [2,2,1,1,2,2,1], [2,2,1,2,1,1,2],
];
export const l8Interactions=[
 {columns:[1,2],interaction:3,label:'サイズ × コントラスト'},
 {columns:[1,4],interaction:5,label:'サイズ × 余白'},
 {columns:[2,4],interaction:6,label:'コントラスト × 余白'},
];
// Invented averages of five different participants per row, not individual observations.
export const l4AverageTimes=[20,10,12,14];
export function l4Comparison(column){
 if(!Number.isInteger(column)||column<0||column>2)throw new RangeError('比較する列は0〜2です。');
 return [1,2].map(level=>{
  const indices=l4Design.flatMap((row,index)=>row[column]===level?[index]:[]);
  const values=indices.map(index=>l4AverageTimes[index]);
  return {label:designFactors[column].levels[level-1],indices,values,average:mean(values)};
 });
}
