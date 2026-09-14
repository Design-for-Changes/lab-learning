export const xorData=[[0,0,0],[0,1,1],[1,0,1],[1,1,0]];
export const sigmoid=x=>1/(1+Math.exp(-x));
export const initialNetwork=()=>({w1:[[.5,-.4],[-.5,.6]],b1:[.1,-.1],w2:[.7,-.6],b2:.1});
export function forwardNetwork(model,x){
 const h=model.w1.map((weights,j)=>sigmoid(weights[0]*x[0]+weights[1]*x[1]+model.b1[j]));
 return {h,p:sigmoid(h[0]*model.w2[0]+h[1]*model.w2[1]+model.b2)};
}
export function networkLoss(model){return xorData.reduce((sum,[a,b,y])=>{const p=forwardNetwork(model,[a,b]).p;return sum-(y*Math.log(Math.max(p,1e-15))+(1-y)*Math.log(Math.max(1-p,1e-15)))/4;},0);}
export function networkGradient(model){
 const g={w1:[[0,0],[0,0]],b1:[0,0],w2:[0,0],b2:0};
 for(const [a,b,y] of xorData){const {h,p}=forwardNetwork(model,[a,b]),d=(p-y)/4;g.b2+=d;for(let j=0;j<2;j++){g.w2[j]+=d*h[j];const hidden=d*model.w2[j]*h[j]*(1-h[j]);g.b1[j]+=hidden;g.w1[j][0]+=hidden*a;g.w1[j][1]+=hidden*b;}}
 return g;
}
export function trainNetwork(model,rate){const g=networkGradient(model);return {w1:model.w1.map((row,j)=>row.map((v,i)=>v-rate*g.w1[j][i])),b1:model.b1.map((v,j)=>v-rate*g.b1[j]),w2:model.w2.map((v,j)=>v-rate*g.w2[j]),b2:model.b2-rate*g.b2};}
export const graphNodes=['A','B','C','D','E','F'];
export function graphEdges(bridge=true){return [[0,1],[0,2],[1,2],...(bridge?[[2,3]]:[]),[3,4],[3,5],[4,5]];}
export function adjacency(bridge=true){const a=graphNodes.map(()=>graphNodes.map(()=>0));for(const [i,j] of graphEdges(bridge)){a[i][j]=1;a[j][i]=1;}return a;}
export const graphTopics=['家具','映像','家具','家具','映像','家具'];
// Invented later observations. Features use only the original seven edges.
const laterEdges=[[0,3],[1,3],[1,4],[2,5]];
const originalAdjacency=adjacency();
export const linkLearningPairs=graphNodes.flatMap((a,i)=>graphNodes.flatMap((b,j)=>j>i&&!originalAdjacency[i][j]?[{
 pair:`${a}−${b}`,
 common:originalAdjacency[i].some((v,k)=>v&&originalAdjacency[j][k])?1:0,
 topic:graphTopics[i]===graphTopics[j]?1:0,
 outcome:laterEdges.some(([u,v])=>u===i&&v===j)?1:0,
}]:[]));
