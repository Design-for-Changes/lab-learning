import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { mean,median,variance,regression,pca2,projectionVariance,chairPoints,pairedTimes,normalPDF,normalCDF,normalProbability,binomialPMF,poissonPMF,studentT3PDF,twoPredictorVIF,correlatedPoints } from '../src/math.js';
import { populationComparison } from '../src/populationComparison.js';
import { pairedTExample, studentT11PDF, twoSidedT11Probability } from '../src/pairedTExample.js';
import { histogramTimes, histogramBins, estimatedTimeDensity, estimatedTimeProbability } from '../src/histogram.js';
import { anovaExample, oneWayAnova, fTail2And18, twoWayAnova2x2, twoWayExample, fTail1And16, fullFactorial3, l4Design } from '../src/experimentMath.js';
import { questionsFor,recommend,validateAnswers,changeAnswer } from '../src/chooser.js';
import { methods } from '../src/content.js';
import { diagnosticExample, normalScores } from '../src/diagnosticExamples.js';
import { l4Comparison, l4AverageTimes, l8Design, l8Interactions } from '../src/designExamples.js';
import { factorialRows, factorialObservations, factorialMainEffect, factorialInteraction, factorialAnova, factorialCSV } from '../src/factorialExample.js';
import { methodGuides } from '../src/methodGuides.js';
const close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
close(mean([10,10,10,10,60]),20);close(median([10,60,10,10,10]),10);
close(variance([1,2,3]),1);close(regression([[1,3],[2,5],[3,7]]).slope,2);close(regression([[1,3],[2,5],[3,7]]).r,1);
const p=pca2(chairPoints);
close(projectionVariance(p.centered,p.angle),p.values[0]);close(projectionVariance(p.centered,p.angle+Math.PI/2),p.values[1]);
close(p.values[0]+p.values[1],variance(chairPoints.map(x=>x[0]))+variance(chairPoints.map(x=>x[1])));
close(mean(p.centered.map(x=>x[0])),0);close(mean(p.centered.map(x=>x[1])),0);
assert.ok(p.ratio>0&&p.ratio<=1);
for(let d=-90;d<=90;d++)assert.ok(projectionVariance(p.centered,d*Math.PI/180)<=p.values[0]+1e-9);
const diff=pairedTimes.a.map((v,i)=>v-pairedTimes.b[i]);close(mean(diff),5);close(Math.sqrt(variance(diff)),7.211102550927978);
assert.equal(diff.filter(x=>x>0).length,8);assert.equal(diff.filter(x=>x<0).length,3);
// Compare the lesson's numerical output with an independent integral and a known t-table critical value.
close(pairedTExample.average,5);close(pairedTExample.se,2.0816659994661326);
close(pairedTExample.t,2.401922307076307);assert.equal(pairedTExample.df,11);
close(pairedTExample.p,0.035112919242060614);
close(studentT11PDF(0),0.38998975705668937);
close(twoSidedT11Probability(2.200985160082949),.05);
close(twoSidedT11Probability(0),1);
close(twoSidedT11Probability(-pairedTExample.t),pairedTExample.p);
assert.ok(twoSidedT11Probability(3)<twoSidedT11Probability(2));
assert.throws(()=>twoSidedT11Probability(NaN));
// Distribution areas and VIF must match known values, independently of the drawings.
close(normalPDF(0),0.3989422804014327);
close(normalCDF(0),0.5);
close(normalProbability(-1,1),0.682689492137,2e-7);
close(normalProbability(-2,2),0.954499736104,2e-7);
close(normalProbability(1,5,3,2),normalProbability(-1,1));
assert.ok(normalPDF(0,0,.3)>1);
assert.equal(normalProbability(1,1),0);
// The distribution examples must preserve probability and known moments.
const binomial=Array.from({length:21},(_,k)=>binomialPMF(k,20,.5));
close(binomial.reduce((sum,p)=>sum+p,0),1);
close(binomial.reduce((sum,p,k)=>sum+k*p,0),10);
close(binomial.reduce((sum,p,k)=>sum+(k-10)**2*p,0),5);
close(binomial[10],.176197052001953125);
assert.equal(binomialPMF(0,20,0),1);assert.equal(binomialPMF(20,20,1),1);
assert.equal(binomialPMF(21,20,.5),0);assert.equal(binomialPMF(.5,20,.5),0);
assert.throws(()=>binomialPMF(1,20,1.1));
const poisson=Array.from({length:40},(_,k)=>poissonPMF(k,3));
close(poisson.reduce((sum,p)=>sum+p,0),1);
close(poisson.reduce((sum,p,k)=>sum+k*p,0),3);
close(poisson.reduce((sum,p,k)=>sum+(k-3)**2*p,0),3);
close(poisson[0],.049787068367863944);close(poisson[2],poisson[3]);
assert.equal(poissonPMF(0,0),1);assert.equal(poissonPMF(1,0),0);
assert.throws(()=>poissonPMF(1,-1));
close(studentT3PDF(0),.36755259694786135);
close(studentT3PDF(-2),studentT3PDF(2));
assert.ok(studentT3PDF(3)>normalPDF(3));
const tArea=Array.from({length:40000},(_,i)=>studentT3PDF(-200+(i+.5)*.01)*.01).reduce((sum,p)=>sum+p,0);
close(tArea,1,3e-7);
for(const sigma of [.3,1,2]){
 const step=sigma/100,low=1-8*sigma;
 const area=Array.from({length:1600},(_,i)=>normalPDF(low+(i+.5)*step,1,sigma)*step).reduce((a,b)=>a+b,0);
 close(area,1,1e-8);
}
assert.throws(()=>normalPDF(0,0,0));assert.throws(()=>normalCDF(0,0,-1));
assert.throws(()=>normalProbability(2,1));assert.throws(()=>twoPredictorVIF(1.01));
close(twoPredictorVIF(0),1);close(twoPredictorVIF(.9),5.263157894736842);
close(twoPredictorVIF(.99),50.251256281407);assert.equal(twoPredictorVIF(1),Infinity);
for(const r of [-.99,-.5,0,.3,.9,.99])close(regression(correlatedPoints(r)).r,r);
// Switching population models must keep every observed point unchanged.
for(let draw=0;draw<5;draw++){
 const common=populationComparison(draw),separate=populationComparison(draw,true);
 assert.deepEqual(common.samples,separate.samples);
 assert.deepEqual(common.sampleMeans,separate.sampleMeans);
 close(common.modelMeans[0],common.modelMeans[1]);
 close(common.modelMeans[0],mean(common.samples.flat()));
 assert.deepEqual(separate.modelMeans,separate.sampleMeans);
 for(const model of [common,separate]){
  assert.deepEqual(model.samples.map(group=>group.length),[12,12]);
  assert.equal(new Set(model.indices.flat()).size,24);
  model.modelPoints.forEach((points,i)=>close(mean(points),model.modelMeans[i]));
 }
}
assert.notDeepEqual(populationComparison(0).samples,populationComparison(1).samples);
close(populationComparison(0).sampleMeans[0]-populationComparison(0).sampleMeans[1],4);
assert.throws(()=>populationComparison(-1));
// Histograms and the density model use the same observations and conserve area.
assert.equal(histogramTimes.length,30);
for(const width of [5,10,20]){
 const bins=histogramBins(width);
 assert.equal(bins.reduce((sum,b)=>sum+b.count,0),30);
 close(bins.reduce((sum,b)=>sum+b.density*width,0),1);
 for(const bin of bins)close(bin.density*width,bin.share);
}
assert.equal(histogramBins(10)[1].count,13);
assert.throws(()=>histogramBins(0));assert.throws(()=>estimatedTimeProbability(-1,10));
const integrate=(fn,low,high,step=.005)=>{
 const count=Math.round((high-low)/step),dx=(high-low)/count;
 return Array.from({length:count},(_,i)=>fn(low+(i+.5)*dx)*dx).reduce((sum,x)=>sum+x,0);
};
close(integrate(estimatedTimeDensity,0,120,.05),1,1e-7);
close(estimatedTimeProbability(0,120),1,1e-7);
for(const [low,high] of [[0,20],[10,15],[10,20]])close(estimatedTimeProbability(low,high),integrate(estimatedTimeDensity,low,high),1e-7);
assert.equal(estimatedTimeDensity(-1),0);assert.equal(estimatedTimeProbability(10,10),0);
// ANOVA: sum-of-squares decomposition, reference values, shift/scale invariance.
const groups=anovaExample(4,2),anova=oneWayAnova(groups);
assert.deepEqual(anova.means,[20,24,28]);close(anova.between,224);close(anova.within,336);
assert.equal(anova.dfBetween,2);assert.equal(anova.dfWithin,18);close(anova.f,6);
close(fTail2And18(anova.f),.010077696);
close(fTail2And18(0),1);
close(oneWayAnova(groups.map(g=>g.map(x=>x*10+30))).f,anova.f);
close(oneWayAnova(anovaExample(0,2)).f,0);
assert.ok(oneWayAnova(anovaExample(4,4)).f<anova.f);
const uneven=[[1,2,3],[3,4],[5,7,8,9]],u=oneWayAnova(uneven);
close(u.between+u.within,uneven.flat().reduce((sum,x)=>sum+(x-u.grand)**2,0));
assert.throws(()=>oneWayAnova([[1],[2]]));assert.throws(()=>fTail2And18(-1));
// Numerically integrate the independent df=(2,18) F density over its tail.
close(integrate(x=>(1+x/9)**-10,6,200),fTail2And18(6),1e-8);
// Balanced two-way example: independent reference values, decomposition and invariance.
for(const crossing of [false,true]){
 const cells=twoWayExample(crossing),r=twoWayAnova2x2(cells);
 assert.equal(r.n,5);close(r.error.ss,640);assert.equal(r.error.df,16);close(r.error.ms,40);
 close(r.size.f,crossing?0:12.5);close(r.contrast.f,crossing?0:12.5);close(r.interaction.f,crossing?50:0);
 close(r.totalSS,cells.flat(2).reduce((sum,x)=>sum+(x-r.grand)**2,0));
 const scaled=twoWayAnova2x2(cells.map(row=>row.map(cell=>cell.map(x=>3*x+100))));
 for(const effect of ['size','contrast','interaction'])close(scaled[effect].f,r[effect].f);
 const swapped=twoWayAnova2x2([0,1].map(j=>cells.map(row=>row[j])));
 close(swapped.size.f,r.contrast.f);close(swapped.contrast.f,r.size.f);close(swapped.interaction.f,r.interaction.f);
}
close(fTail1And16(0),1);close(fTail1And16(12.5),.0027492553418089205,1e-10);
close(fTail1And16(50),.000002645792284372561,1e-12);
close(fTail1And16(4.493998477666355),.05,1e-10);
assert.throws(()=>fTail1And16(-1));assert.throws(()=>twoWayAnova2x2([[[1,2],[3,4]],[[1],[2]]]));
// Each diagnostic view represents the same 20 observations without losing counts.
const steady=diagnosticExample(),outlier=diagnosticExample('outlier'),funnel=diagnosticExample('funnel');
for(const example of [steady,outlier,funnel]){
 assert.equal(example.observations.length,20);assert.equal(example.bins.reduce((n,b)=>n+b.count,0),20);
 assert.deepEqual(example.sorted,[...example.residuals].sort((a,b)=>a-b));
 example.observations.forEach(point=>close(point.observed-point.predicted,point.residual));
 assert.ok(example.residuals.every(value=>value>=-20&&value<20));
 assert.deepEqual(example.observations.map(p=>p.predicted),steady.observations.map(p=>p.predicted));
}
assert.equal(outlier.observations[15].observed,68);
assert.equal(outlier.residuals.filter((x,i)=>x!==steady.residuals[i]).length,1);
normalScores.forEach((z,i)=>close(normalCDF(z),(i+.5)/20,1e-8));
const blockVariances=[0,1,2,3].map(i=>variance(funnel.residuals.slice(i*5,i*5+5)));
assert.ok(blockVariances.every((value,i)=>i===0||value>blockVariances[i-1]));
assert.throws(()=>diagnosticExample('unknown'));
// Every pair of L4 columns contains all four combinations, yet C is aliased with A*B.
assert.equal(new Set(fullFactorial3.map(row=>row.join(','))).size,8);
for(const [a,b] of [[0,1],[0,2],[1,2]])assert.equal(new Set(l4Design.map(row=>`${row[a]},${row[b]}`)).size,4);
for(const row of l4Design){const [a,b,c]=row.map(v=>2*v-3);assert.equal(c,-a*b);}
assert.ok(l4Design.every(row=>fullFactorial3.some(full=>full.join(',')===row.join(','))));
// The graph's 1/2/4 allocation must cover all eight screens, with pair effects in 3/5/6.
assert.deepEqual(l8Design.map(row=>[row[0],row[1],row[3]]),fullFactorial3);
for(let a=0;a<7;a++)for(let b=a+1;b<7;b++){
 const pairs=l8Design.map(row=>`${row[a]},${row[b]}`);
 for(const pair of ['1,1','1,2','2,1','2,2'])assert.equal(pairs.filter(value=>value===pair).length,2);
}
for(const {columns:[a,b],interaction} of l8Interactions)for(const row of l8Design){
 const coded=row.map(level=>2*level-3);
 assert.equal(coded[interaction-1],-coded[a-1]*coded[b-1]);
}
for(const row of l8Design){const x=row.map(level=>2*level-3);assert.equal(x[6],x[0]*x[1]*x[3]);}
// The teaching example must group the correct rows, preserve the grand mean and match hand calculations.
for(const [column,expected] of [[0,[15,13]],[1,[16,12]],[2,[17,11]]]){
 const comparison=l4Comparison(column);
 assert.deepEqual(comparison.map(group=>group.average),expected);
 assert.deepEqual(comparison.flatMap(group=>group.indices).sort(),[0,1,2,3]);
 close(mean(comparison.map(group=>group.average)),mean(l4AverageTimes));
}
assert.deepEqual(l4Comparison(2).map(group=>group.indices),[[0,3],[1,2]]);
assert.throws(()=>l4Comparison(-1));assert.throws(()=>l4Comparison(3));
assert.equal(factorialObservations.length,24);assert.equal(new Set(factorialObservations.map(p=>p.person)).size,24);
factorialRows.forEach(row=>close(mean(row.values),row.average));
assert.deepEqual([0,1,2].map(c=>factorialMainEffect(c).difference),[-6,-2,-4]);
assert.deepEqual(factorialInteraction(0,1).cells.map(row=>row.map(c=>c.average)),[[22,14],[10,14]]);
assert.equal(factorialInteraction(0,1).difference,12);assert.equal(factorialInteraction(0,2).difference,0);assert.equal(factorialInteraction(1,2).difference,0);
assert.deepEqual(factorialAnova.terms.map(t=>t.f),[54,6,24,54,0,0,0]);
close(factorialAnova.errorMS,4);close(factorialAnova.errorSS+factorialAnova.terms.reduce((s,t)=>s+t.ss,0),factorialAnova.totalSS);
assert.equal(await readFile('public/data/l8-screen-example.csv','utf8'),factorialCSV);
const compare={response:'yes',goal:'compare',outcome:'numeric',dependency:'independent',groups:'two'};
const ids=a=>recommend(a).candidates.map(x=>x.id);
assert.deepEqual(ids(compare),['welch']);assert.deepEqual(ids({...compare,dependency:'repeated'}),['paired']);
assert.deepEqual(ids({...compare,outcome:'binary',dependency:'repeated'}),['mcnemar']);
assert.deepEqual(ids({...compare,outcome:'binary'}),['categorical']);
assert.deepEqual(ids({...compare,groups:'many',dependency:'repeated'}),['anova','mixed']);
assert.deepEqual(ids({...compare,outcome:'ordinal'}),['ranks']);
assert.deepEqual(ids({response:'yes',goal:'compare',outcome:'numeric',dependency:'unsure'}),[]);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'numeric'}),['pca']);
assert.deepEqual(ids({response:'no',exploration:'latent',format:'numeric'}),['factor']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'category'}),['mca']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'table'}),['ca']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'distance'}),['mds']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'mixed'}),[]);
assert.deepEqual(ids({response:'unsure'}),[]);
assert.deepEqual(changeAnswer(compare,'response','no'),{response:'no'});
assert.deepEqual(changeAnswer(compare,'outcome','binary'),{response:'yes',goal:'compare',outcome:'binary'});
assert.throws(()=>validateAnswers({response:'no',goal:'compare'}));
assert.throws(()=>validateAnswers({response:'invalid'}));assert.throws(()=>validateAnswers([]));
assert.throws(()=>validateAnswers({response:'yes',outcome:'numeric'}));
let leaves=0;
function visit(a){const result=recommend(a);for(const c of result.candidates){assert.ok(methods.some(m=>m.id===c.id));assert.ok(c.reason&&c.check);}const next=questionsFor(a).find(q=>!a[q.key]);if(!next){leaves++;return;}for(const option of next.options)visit({...a,[next.key]:option.value});}
visit({});
const csv=(await readFile('public/data/ui_comparison.csv','utf8')).trim().split(/\r?\n/).slice(1).map(x=>x.split(','));
assert.equal(csv.length,12);assert.equal(new Set(csv.map(r=>r[0])).size,12);assert.equal(csv.filter(r=>r[1]==='AB').length,6);
assert.deepEqual(csv.map(r=>+r[2]),pairedTimes.a);assert.deepEqual(csv.map(r=>+r[3]),pairedTimes.b);
const notebook=JSON.parse(await readFile('public/data/ui-comparison.ipynb','utf8'));
assert.equal(notebook.nbformat,4);assert.ok(notebook.cells.some(c=>c.cell_type==='code'));
const baseline=await readFile('public/data/analysis.py','utf8');
const notebookCode=notebook.cells.filter(c=>c.cell_type==='code').map(c=>c.source.join('')).join('\n');
assert.ok(notebookCode.includes(baseline.slice(0,baseline.indexOf('# 練習では')).trim()));
assert.ok(notebookCode.includes(baseline.slice(baseline.indexOf('# 練習では')).trim()));
assert.equal(methods.length,26);assert.equal(new Set(methods.map(m=>m.id)).size,26);
const methodExamples=JSON.parse(await readFile('src/methodExampleResults.json','utf8')).examples;
assert.deepEqual(Object.keys(methodExamples).sort(),methods.map(m=>m.id).sort());
assert.deepEqual(Object.keys(methodGuides).sort(),methods.map(m=>m.id).sort());
for(const method of methods){
 const example=methodExamples[method.id];
 assert.ok(example.input.rows.length>0&&example.output.rows.length>0);
 assert.equal(await readFile(`public/data/method-examples/${method.id}.py`,'utf8'),example.code);
 assert.equal((await readFile(`public/data/method-examples/${method.id}.csv`,'utf8')).trim().split(/\r?\n/).length-1,example.count);
}
// Cross-check generated Python outputs against the independently tested lesson examples.
close(methodExamples.paired.output.rows[0][0],pairedTExample.average);
close(methodExamples.paired.output.rows[0][4],pairedTExample.t,1e-6);
close(methodExamples.paired.output.rows[0][6],pairedTExample.p,1e-6);
close(methodExamples.anova.output.rows[0][methodExamples.anova.output.columns.indexOf('F')],6);
assert.deepEqual(methodExamples.quant1.output.rows.map(row=>row[2]),[-3,3,2,-2]);
console.log(`Math, practice data and ${leaves} complete analysis-choice paths passed.`);

// Render all routes without a browser to catch missing components and internal links.
const {createServer}=await import('vite');
const server=await createServer({server:{middlewareMode:true,watch:null,ws:false},appType:'custom'});
try{
 const {default:App}=await server.ssrLoadModule('/src/App.jsx');
 const {default:React}=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');
 const routes=['/','/statistics','/statistics/basics','/statistics/inference','/statistics/variables','/statistics/experiments','/statistics/distributions','/statistics/choose','/statistics/methods','/statistics/checks','/statistics/tools','/statistics/python',...methods.map(m=>`/statistics/method/${m.id}`)];
 let homeHTML='',basicsHTML='',legacyDistributionHTML='',entryHTML='',inferenceHTML='',variablesHTML='',experimentsHTML='',chooseHTML='',legacyMethodsHTML='',checksHTML='';
 for(const route of routes){
  globalThis.location={hash:`#${route}`};
  const html=renderToStaticMarkup(React.createElement(App));
  assert.ok(html.includes('id="main"'));assert.ok(!html.includes('ページが見つかりません'));assert.ok(!html.includes('undefined'));
  for(const m of html.matchAll(/href="#(\/[^\"]*)"/g))assert.ok(routes.includes(m[1]),`Invalid route ${m[1]}`);
  for(const m of html.matchAll(/href="\/lab-learning\/learning\/(data\/[^\"]*)"/g))await access(`public/${m[1]}`);
  if(route==='/')homeHTML=html;
  if(route==='/statistics/choose')chooseHTML=html;
  if(route==='/statistics/methods')legacyMethodsHTML=html;
  if(route==='/statistics/checks')checksHTML=html;
  if(route==='/statistics')entryHTML=html;
  if(route==='/statistics/inference')inferenceHTML=html;
  if(route==='/statistics/variables')variablesHTML=html;
  if(route==='/statistics/experiments')experimentsHTML=html;
  if(route==='/statistics/basics')basicsHTML=html;
  if(route==='/statistics/distributions')legacyDistributionHTML=html;
 }
 assert.equal(chooseHTML,legacyMethodsHTML,'Old methods URL must show the merged choice and reference chapter');
 assert.ok(!chooseHTML.includes('method-search'));
 assert.equal((chooseHTML.match(/class="chapter-nav"[\s\S]*?<\/nav>/)?.[0].match(/<a /g)||[]).length,7);
 assert.ok(!chooseHTML.includes('type="radio"'));assert.ok(!chooseHTML.includes('class="segmented"'));
 assert.ok(!chooseHTML.includes('表で、手法の役割を見比べる'));
 for(const method of methods)assert.ok(chooseHTML.includes(`href="#/statistics/method/${method.id}"`));
 for(const title of ['やってはいけないこと','注意するべきこと'])assert.ok(checksHTML.includes(`<h2>${title}</h2>`));
 for(const title of ['手法ごとに、仮定するものが違う','比較を増やすと、判断も変わる','予測は、未知のデータで確かめる'])assert.ok(!checksHTML.includes(`<h2>${title}</h2>`));
 assert.equal(entryHTML,basicsHTML,'Statistics entry must open chapter 01 directly');
 assert.ok(basicsHTML.indexOf('平均を取り直すと')<basicsHTML.indexOf('まず、集めたデータの分布を見る'));
 assert.ok(!basicsHTML.includes('ここで、p値を読む'));
 const inferenceHeadings=[...inferenceHTML.matchAll(/<h2>(.*?)<\/h2>/g)].map(match=>match[1]);
 const flow=['同じ人で比べるときは、一人ずつ差を作る','差を、ばらつきに対して測る','標本の平均が違う。母集団も違う？','ここで、帰無仮説を置く','F検定：2つの分散を比べる','t検定：平均の差を調べる','ここで、p値を読む','差は、何秒くらいありそうか？','一元配置分散分析：1つの要因で平均を比べる','二元配置分散分析：2つの要因と交互作用','計算の前提を、図と設計に戻って確かめる','例題：3つの画面を比べて、結果を報告する'];
 flow.forEach((heading,i)=>{assert.ok(inferenceHeadings.includes(heading));if(i>0)assert.ok(inferenceHeadings.indexOf(flow[i-1])<inferenceHeadings.indexOf(heading));});
 assert.ok(inferenceHTML.includes('一元配置分散分析'));assert.ok(inferenceHTML.includes('二元配置分散分析'));
 assert.ok(variablesHTML.includes('04　実験計画法へ進む'));
 assert.ok(experimentsHTML.includes('確認実験'));assert.ok(!experimentsHTML.includes('タグチメソッド'));assert.ok(!experimentsHTML.includes('SN比'));
 assert.ok(experimentsHTML.includes('代表的な直交表一覧'));assert.ok(experimentsHTML.includes('線点図で、列の使い道を決める'));
 assert.equal(legacyDistributionHTML,basicsHTML,'Old distribution URL must open the merged basics lesson');
 assert.equal((homeHTML.match(/準備中/g)||[]).length,9);assert.ok(homeHTML.includes('デザイン学入門'));assert.ok(homeHTML.includes('ウェブインタラクション入門'));
 const {default:Chooser}=await server.ssrLoadModule('/src/Chooser.jsx');
 const html=renderToStaticMarkup(React.createElement(Chooser,{answers:{...compare,dependency:'repeated'},setAnswers:()=>{}}));
 assert.ok(html.includes('対応のあるt検定'));assert.ok(html.includes('目的変数なし'));assert.ok(!html.includes('checked=""'));
 console.log(`${routes.length} routes rendered; portal, candidate output, internal links and downloads passed.`);
}finally{await server.close();delete globalThis.location;}
