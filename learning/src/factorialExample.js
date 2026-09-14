import { mean } from './math.js';
import { fTail1And16 } from './experimentMath.js';
import { designFactors, l8Design } from './designExamples.js';
// Independent, invented 24-person experiment: three different people in each condition.
const averages=[24,20,16,12,12,8,16,12];
export const factorialRows=l8Design.map((row,i)=>({condition:i+1,levels:[row[0],row[1],row[3]],values:[averages[i]-2,averages[i],averages[i]+2],average:averages[i]}));
export const factorialObservations=factorialRows.flatMap((row,i)=>row.values.map((time,j)=>({person:`P${String(i*3+j+1).padStart(2,'0')}`,condition:row.condition,levels:row.levels,time})));
export function factorialMainEffect(column){
 const groups=[1,2].map(level=>{const rows=factorialRows.filter(row=>row.levels[column]===level);return {label:designFactors[column].levels[level-1],rows,average:mean(rows.flatMap(row=>row.values))};});
 return {groups,difference:groups[1].average-groups[0].average};
}
export function factorialInteraction(a,b){
 const cells=[1,2].map(la=>[1,2].map(lb=>{const rows=factorialRows.filter(row=>row.levels[a]===la&&row.levels[b]===lb);return {rows,average:mean(rows.flatMap(row=>row.values))};}));
 const changes=cells.map(row=>row[1].average-row[0].average);
 return {cells,changes,difference:changes[1]-changes[0]};
}
export const factorialAnova=(()=>{
 const n=factorialObservations.length,grand=mean(factorialObservations.map(p=>p.time));
 const errorSS=factorialRows.reduce((sum,row)=>sum+row.values.reduce((s,v)=>s+(v-row.average)**2,0),0),errorDF=n-factorialRows.length,errorMS=errorSS/errorDF;
 const terms=[[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]].map(columns=>{
  const coefficient=mean(factorialObservations.map(p=>p.time*columns.reduce((sign,c)=>sign*(2*p.levels[c]-3),1))),ss=n*coefficient**2,f=ss/errorMS;
  return {label:columns.map(c=>designFactors[c].name).join(' × '),ss,df:1,ms:ss,f,p:fTail1And16(f)};
 });
 return {n,grand,terms,errorSS,errorDF,errorMS,totalSS:factorialObservations.reduce((sum,p)=>sum+(p.time-grand)**2,0)};
})();
export const factorialCSV='\uFEFFparticipant_id,condition,size,contrast,margin,time_sec\n'+factorialObservations.map(p=>[p.person,p.condition,...p.levels,p.time].join(',')).join('\n')+'\n';
