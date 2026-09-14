import { sigmoid } from './aiMath.js';

export const cnnFilters=[
 {name:'縦方向を見る重み',values:[[-1,1,-1],[-1,1,-1],[-1,1,-1]]},
 {name:'横方向を見る重み',values:[[-1,-1,-1],[1,1,1],[-1,-1,-1]]},
];
export const cnnSamples=[
 {name:'中央の縦棒',vertical:true,column:3},
 {name:'右へ動かした縦棒',vertical:true,column:5},
 {name:'中央の横棒',vertical:false,column:3},
].map(sample=>({...sample,pixels:Array.from({length:7},(_,i)=>Array.from({length:7},(_,j)=>Number(sample.vertical?j===sample.column&&i>=2&&i<=4:i===3&&j>=2&&j<=4)))}));
export function cnnForward(pixels){
 const raw=cnnFilters.map(({values})=>Array.from({length:5},(_,i)=>Array.from({length:5},(_,j)=>values.reduce((sum,row,r)=>sum+row.reduce((s,w,c)=>s+w*pixels[i+r][j+c],0),0))));
 const maps=raw.map(map=>map.map(row=>row.map(v=>Math.max(0,v))));
 const pooled=maps.map(map=>Math.max(...map.flat()));
 return {raw,maps,pooled,verticalProbability:sigmoid(2*pooled[0]-2*pooled[1])};
}

// Small, hand-set vectors illustrate the calculation, not learned word meanings.
export const attentionWords=['猫','魚','食べる'];
export const attentionVectors=[[1,0],[0,1],[1,1]];
export function attentionExample(queryIndex,causal=false){
 const query=attentionVectors[queryIndex];
 const scores=attentionVectors.map((key,i)=>causal&&i>queryIndex?null:query.reduce((sum,q,j)=>sum+q*key[j],0)/Math.sqrt(2));
 const maximum=Math.max(...scores.filter(s=>s!==null));
 const exp=scores.map(s=>s===null?0:Math.exp(s-maximum)),sum=exp.reduce((a,b)=>a+b,0);
 const weights=exp.map(value=>value/sum);
 const output=[0,1].map(j=>attentionVectors.reduce((total,v,i)=>total+weights[i]*v[j],0));
 return {query,scores,weights,output};
}

export const ganReal=[2,3,4],ganSeeds=[-1,0,1];
export const initialGan=()=>({shift:-2,w:0,b:0});
export const ganGenerate=model=>ganSeeds.map(z=>z+model.shift);
export const ganJudge=(model,x)=>sigmoid(model.w*x+model.b);
export function ganLosses(model){
 const fake=ganGenerate(model),clip=p=>Math.max(1e-12,Math.min(1-1e-12,p));
 return {
  discriminator:-ganReal.reduce((sum,x,i)=>sum+Math.log(clip(ganJudge(model,x)))+Math.log(1-clip(ganJudge(model,fake[i]))),0)/6,
  generator:-fake.reduce((sum,x)=>sum+Math.log(clip(ganJudge(model,x))),0)/3,
 };
}
export function ganDiscriminatorGradient(model){
 let w=0,b=0;const fake=ganGenerate(model);
 ganReal.forEach((real,i)=>{const dr=ganJudge(model,real)-1,df=ganJudge(model,fake[i]);w+=(dr*real+df*fake[i])/6;b+=(dr+df)/6;});
 return {w,b};
}
export const ganGeneratorGradient=model=>ganGenerate(model).reduce((sum,x)=>sum+(ganJudge(model,x)-1)*model.w/3,0);
export function updateGanDiscriminator(model,rate=.2){const g=ganDiscriminatorGradient(model);return {...model,w:model.w-rate*g.w,b:model.b-rate*g.b};}
export function updateGanGenerator(model,rate=.2){return {...model,shift:model.shift-rate*ganGeneratorGradient(model)};}
export const trainGanRound=model=>updateGanGenerator(updateGanDiscriminator(model));
