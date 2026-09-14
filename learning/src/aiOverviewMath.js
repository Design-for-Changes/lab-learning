export const convolutionImage=Array.from({length:5},()=>[0,0,1,0,0]);
export const convolutionFilter=[[-1,0,1],[-1,0,1],[-1,0,1]];
export function convolutionAt(row,column){return convolutionFilter.reduce((sum,line,i)=>sum+line.reduce((s,w,j)=>s+w*convolutionImage[row+i][column+j],0),0);}
export const distillationTeacher=[.7,.25,.05];
export const distillationStudents=[[.7,.05,.25],[.7,.25,.05]];
export function relativeEntropy(target,prediction){return target.reduce((sum,p,i)=>sum+p*Math.log(p/prediction[i]),0);}
