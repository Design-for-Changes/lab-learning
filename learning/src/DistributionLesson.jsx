import { useState } from 'react';
import { Section } from './Common.jsx';
import { normalPDF, normalProbability, binomialPMF, poissonPMF, studentT3PDF } from './math.js';
import { histogramTimes, histogramBins, estimatedTimeDensity, estimatedTimeProbability } from './histogram.js';
const densityPoints=Array.from({length:241},(_,i)=>[i/4,estimatedTimeDensity(i/4)]);

function HistogramExplorer(){
 const [width,setWidth]=useState(10),[view,setView]=useState('count');
 const bins=histogramBins(width),focal=bins.find(bin=>bin.low<=10&&bin.high>10);
 const density=view!=='count',withCurve=view==='curve';
 const height=bin=>density?bin.density:bin.count;
 const top=density ? .06 : 20,ticks=density?[0,.02,.04,.06]:[0,5,10,15,20];
 const sx=value=>88+value/60*560,sy=value=>280-value/top*220;
 const curvePath=points=>points.map(([x,y],i)=>`${i?'L':'M'}${sx(x)},${sy(y)}`).join(' ');
 const curveAreaPoints=densityPoints.filter(([x])=>x>=focal.low&&x<=focal.high);
 const unit=density?'密度（1/秒）':'人数（人）';
 const proportion=(focal.share*100).toFixed(1),modelProportion=(estimatedTimeProbability(focal.low,focal.high)*100).toFixed(1);
 const description=`同じ${histogramTimes.length}人分の操作時間。区間の幅は${width}秒、縦軸は${density?'密度':'人数'}。赤い棒は${focal.low}秒以上${focal.high}秒未満の${focal.count}人。${density?`高さ${focal.density.toFixed(4)}毎秒と幅${width}秒の積は、全員の${proportion}パーセント。全ての棒の面積の合計は1。`:bins.map(bin=>`${bin.low}秒以上${bin.high}秒未満は${bin.count}人`).join('、')} ${withCurve?`同じデータから推定した確率密度を黒い曲線で重ねる。この区間の曲線の下の面積は約${modelProportion}パーセント。`:''}`;
 return <div className="explorer">
  <div className="explorer-heading"><h3>人数から、密度、確率密度の曲線へ</h3><span>同じ{histogramTimes.length}人分の架空のデータ</span></div>
  <p>①→②→③の順に切り替えてください。データを変えずに、縦軸と面積の読み方をつなげます。</p>
  <div className="segmented" role="group" aria-label="ヒストグラムから確率密度への見方">
   {[['count','① 人数で見る'],['density','② 密度に直す'],['curve','③ 曲線を重ねる']].map(([value,label])=><button key={value} aria-pressed={view===value} onClick={()=>setView(value)}>{label}</button>)}
  </div>
  <div className="histogram-width"><span>区間の幅</span><div className="segmented" role="group" aria-label="ヒストグラムの区間の幅">
   {[5,10,20].map(value=><button key={value} aria-pressed={width===value} onClick={()=>setWidth(value)}>{value}秒ごと</button>)}
  </div></div>
  <svg className="plot histogram-plot" viewBox="0 0 680 370" role="img" aria-label={`ヒストグラムと確率密度。${description}`}>
   <text x="88" y="26">{unit}</text>
   {ticks.map(value=><g key={value}><line x1="88" x2="648" y1={sy(value)} y2={sy(value)} className="grid"/><text x="74" y={sy(value)+5} textAnchor="end">{value}</text></g>)}
   {bins.map(bin=><g key={bin.low}>
    <rect x={sx(bin.low)} y={sy(height(bin))} width={sx(bin.high)-sx(bin.low)} height={280-sy(height(bin))} fill={bin===focal?'#f6c5ca':'#eee'} stroke={bin===focal?'#cc2939':'#999'} strokeWidth="1.5"/>
    {!density&&<text x={sx((bin.low+bin.high)/2)} y={sy(bin.count)-8} textAnchor="middle">{bin.count}</text>}
   </g>)}
   {withCurve&&<>
    <path d={`${curvePath(curveAreaPoints)} L${sx(focal.high)},280 L${sx(focal.low)},280 Z`} fill="#cc2939" opacity=".18"/>
    <path d={curvePath(densityPoints)} fill="none" stroke="#111" strokeWidth="2.5"/>
   </>}
   <line x1="88" x2="648" y1="280" y2="280" className="axis"/>
   <line x1="88" x2="88" y1="60" y2="280" className="axis"/>
   {[0,10,20,30,40,50,60].map(value=><g key={value}><line x1={sx(value)} x2={sx(value)} y1="280" y2="286" className="axis"/><text x={sx(value)} y="310" textAnchor="middle">{value}</text></g>)}
   <text x="368" y="356" textAnchor="middle">操作時間（秒）</text>
  </svg>
  {withCurve&&<div className="histogram-legend"><span><i className="histogram-key" aria-hidden="true"/>棒：観察したデータの密度</span><span><i className="density-key" aria-hidden="true"/>曲線：推定した確率密度</span></div>}
  <div className="histogram-reading" aria-live="polite">
   <h4>赤い棒：{focal.low}秒以上{focal.high}秒未満</h4>
   {view==='count'?<>
    <p><strong>{histogramTimes.length}人中{focal.count}人（{proportion}%）</strong></p>
    <p>棒の高さが人数です。この段階では、棒の面積をそのまま確率としては読みません。</p>
   </>:<>
    <p><strong>高さ＝人数 ÷（全人数 × 区間の幅）</strong><br/>{focal.count} ÷（{histogramTimes.length} × {width}）≒ {focal.density.toFixed(4)} /秒</p>
    <p><strong>棒の面積＝高さ × 幅 ≒ {proportion}%</strong><br/>「{histogramTimes.length}人中{focal.count}人」という割合を、面積で表したことになります。全ての棒の面積を足すと1（100%）です。</p>
    {withCurve&&<p><strong>同じ区間の曲線の下の面積：約{modelProportion}%</strong><br/>棒は実際に数えた割合、曲線はデータから推定した確率を表しています。</p>}
   </>}
  </div>
  {withCurve?<>
   <p className="explainer">黒い曲線は、この{histogramTimes.length}人分からなめらかに推定した確率密度の一例です。曲線も全体の面積が1になり、図の右側にも続きます。ヒストグラムの区間幅を変えても、この曲線は変わりません。</p>
   <p className="explainer">密度のヒストグラムは、確率密度を近似する方法の一つです。データ数と区間幅が適切なときに形を捉えやすくなります。区間を細かくするだけで正しい曲線が得られるわけではなく、曲線も推定のしかたで変わります。</p>
  </>:<p className="explainer">区間の幅を変えても、元の{histogramTimes.length}人分のデータは同じです。{view==='count'?'次に「② 密度に直す」で、人数を面積として読めるようにしてみましょう。':'「③ 曲線を重ねる」で、同じ縦軸に確率密度を重ねて比べてみましょう。'}</p>}
 </div>;
}

const distributions=[
 ['正規分布','平均を中心に左右対称にばらつく連続的な値。','測定誤差などのモデル。平均と標準偏差で形が決まる。'],
 ['二項分布','決めた回数の試行のうち、何回成功したか。','20人中、何人が操作に成功したか。試行の独立性と、成功確率が一定であることを仮定する。'],
 ['ポアソン分布','一定の時間・範囲に、何回起きたか。','1時間の問い合わせ件数など。一定の発生率や独立な発生を仮定するので、集中して起きる場合には合わないことがある。'],
 ['一様分布','ある区間で、密度が一定の連続的な値。','0〜1の一様乱数など。同じ幅の区間には、同じ確率が割り当てられる。'],
 ['t分布','正規分布に似ているが、裾が厚い分布。','母集団の標準偏差を標本から推定するときの、平均の検定・信頼区間などに使う。形は自由度で変わる。'],
];
const distributionPlots={
 '正規分布':{example:'平均0、標準偏差1の例。',domain:[-4,4],ticks:[-4,-2,0,2,4],yTicks:[0,.2,.4],top:.45,label:'値 x',density:normalPDF},
 '二項分布':{example:'20回試して、1回の成功確率が0.5の場合。',domain:[-.5,20.5],ticks:[0,5,10,15,20],yTicks:[0,.1,.2],top:.2,label:'成功した回数',values:Array.from({length:21},(_,k)=>[k,binomialPMF(k,20,.5)])},
 'ポアソン分布':{example:'1時間に平均3回起きる場合。13回以上にも小さな確率が続きます。',domain:[-.5,12.5],ticks:[0,3,6,9,12],yTicks:[0,.1,.2],top:.25,label:'1時間に起きた回数',values:Array.from({length:13},(_,k)=>[k,poissonPMF(k,3)])},
 '一様分布':{example:'0〜1の範囲で密度が1。それ以外は0の例。',domain:[-.5,1.5],ticks:[-.5,0,.5,1,1.5],yTicks:[0,.5,1],top:1.2,label:'値 x',points:[[-.5,0],[0,0],[0,1],[1,1],[1,0],[1.5,0]]},
 't分布':{example:'実線は自由度3のt分布、破線は標準正規分布。中心から離れた裾の高さを比べてください。',domain:[-4,4],ticks:[-4,-2,0,2,4],yTicks:[0,.2,.4],top:.45,label:'値 x',density:studentT3PDF,compare:normalPDF},
};
function DistributionPlot({name}){
 const model=distributionPlots[name],left=56,right=456,bottom=218;
 const sx=x=>left+(x-model.domain[0])/(model.domain[1]-model.domain[0])*(right-left),sy=y=>bottom-y/model.top*162;
 const sample=fn=>Array.from({length:161},(_,i)=>{const x=model.domain[0]+(model.domain[1]-model.domain[0])*i/160;return [x,fn(x)];});
 const path=points=>points.map(([x,y],i)=>`${i?'L':'M'}${sx(x)},${sy(y)}`).join(' ');
 const points=model.points||(model.density?sample(model.density):null);
 const unit=model.values?'確率':'確率密度';
 return <figure className="distribution-figure">
  <svg className="plot" viewBox="0 0 480 282" role="img" aria-label={`${name}のグラフ。${model.example}横軸は${model.label}、縦軸は${unit}。`}>
   <text x={left} y="28">{unit}</text>
   {model.yTicks.map(value=><g key={value}><line x1={left} x2={right} y1={sy(value)} y2={sy(value)} className="grid"/><text x={left-10} y={sy(value)+5} textAnchor="end">{value}</text></g>)}
   {points&&<><path d={`${path(points)} L${right},${bottom} L${left},${bottom} Z`} fill="#f6c5ca"/><path d={path(points)} fill="none" stroke="#cc2939" strokeWidth="2.5"/></>}
   {model.compare&&<path d={path(sample(model.compare))} fill="none" stroke="#555" strokeWidth="2" strokeDasharray="6 5"/>}
   {model.values?.map(([value,probability])=>{const width=(right-left)/(model.domain[1]-model.domain[0])*.65;return <rect key={value} x={sx(value)-width/2} y={sy(probability)} width={width} height={bottom-sy(probability)} fill="#cc2939"/>;})}
   <line x1={left} x2={right} y1={bottom} y2={bottom} className="axis"/>
   <line x1={left} x2={left} y1="56" y2={bottom} className="axis"/>
   {model.ticks.map(value=><text key={value} x={sx(value)} y="246" textAnchor="middle">{value}</text>)}
   <text x="256" y="274" textAnchor="middle">{model.label}</text>
  </svg>
  <figcaption>{model.example}</figcaption>
 </figure>;
}
function NormalExplorer(){
 const [mu,setMu]=useState(0),[sigma,setSigma]=useState(1),[low,setLow]=useState(-1),[high,setHigh]=useState(1);
 const sx=x=>52+(x+6)/12*548, top=1.4,sy=y=>264-y/top*224;
 const points=Array.from({length:241},(_,i)=>{const x=-6+i/20;return [sx(x),sy(normalPDF(x,mu,sigma))];});
 const curve=points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
 const fill=Array.from({length:121},(_,i)=>{const x=low+(high-low)*i/120;return `${sx(x).toFixed(2)},${sy(normalPDF(x,mu,sigma)).toFixed(2)}`;});
 const probability=normalProbability(low,high,mu,sigma);
 return <div className="explorer"><div className="explorer-heading"><h3>確率は、曲線の下の面積</h3><span>平均・標準偏差・区間を変える</span></div>
 <svg className="plot teaching-plot" viewBox="0 0 640 310" role="img" aria-label={`平均${mu}、標準偏差${sigma}の正規分布。${low}から${high}の確率は${(probability*100).toFixed(2)}パーセント。`}>
  {[0,.5,1].map(f=><g key={f}><line x1="52" x2="600" y1={sy(top*f)} y2={sy(top*f)} stroke="#ddd"/><text x="44" y={sy(top*f)+5} textAnchor="end">{(top*f).toFixed(2)}</text></g>)}
  <text x="52" y="23">確率密度</text>
  <path d={`M${sx(low)},264 L${fill.join(' L')} L${sx(high)},264 Z`} fill="#cc2939" opacity=".18"/>
  <path d={curve} fill="none" stroke="#111" strokeWidth="2.5"/>
  {[low,high].map((x,i)=><line key={i} x1={sx(x)} x2={sx(x)} y1="264" y2={sy(normalPDF(x,mu,sigma))} stroke="#cc2939" strokeWidth="2"/>)}
  {[-6,-3,0,3,6].map(x=><text key={x} x={sx(x)} y="289" textAnchor="middle">{x}</text>)}
  <text x="608" y="289">x</text>
 </svg>
 <div className="distribution-controls">
  <label>平均 μ：{mu.toFixed(1)}<input type="range" min="-2" max="2" step="0.1" value={mu} onChange={e=>setMu(+e.target.value)}/></label>
  <label>標準偏差 σ：{sigma.toFixed(1)}<input type="range" min="0.3" max="2" step="0.1" value={sigma} onChange={e=>setSigma(+e.target.value)}/></label>
  <label>区間の下限：{low.toFixed(1)}<input type="range" min="-6" max="6" step="0.1" value={low} onChange={e=>{const value=+e.target.value;setLow(value);setHigh(previous=>Math.max(previous,value));}}/></label>
  <label>区間の上限：{high.toFixed(1)}<input type="range" min="-6" max="6" step="0.1" value={high} onChange={e=>{const value=+e.target.value;setHigh(value);setLow(previous=>Math.min(previous,value));}}/></label>
 </div>
 <div className="segmented"><button onClick={()=>{setLow(mu-sigma);setHigh(mu+sigma);}}>平均 ± 1σ</button><button onClick={()=>{setLow(mu-2*sigma);setHigh(mu+2*sigma);}}>平均 ± 2σ</button></div>
 <p className="explainer">下限・上限はどちらも−6〜6の目盛りです。片方がもう片方を越えると、同じ値まで一緒に動きます。</p>
 <div className="metric-row"><span>赤い区間に入る確率 <strong>{(probability*100).toFixed(2)}%</strong></span></div>
 <p className="explainer">縦軸の高さは確率密度、赤く塗った面積が確率です。標準偏差を小さくすると山は高くなりますが、曲線全体の面積は1のままです。曲線は表示範囲の外にも続きます。</p>
 </div>;
}
export default function DistributionContent(){return <>
 <Section title="まず、集めたデータの分布を見る"><p>平均だけでは、どんな値がどのくらい出てくるかは分かりません。その全体の形を表すのが「分布」です。</p><p>操作時間を「0〜10秒」「10〜20秒」のように区切り、それぞれ何人いたかを数えてみます。区間ごとの件数を棒で表すと、よく出る値や、長く時間がかかった人が見えてきます。これがヒストグラムです。</p><HistogramExplorer/><p>ヒストグラムの棒は、観察したデータをまとめたものです。その面積の合計が1になるように直すと、確率密度と同じ尺度で形を比べられます。値が生じる仕組みを表すモデルには、データから推定する方法や、後で見る正規分布などを仮定する方法があります。</p></Section>
 <Section title="確率と確率密度は違う"><p>上の図の「② 密度に直す」では、棒の面積が、その区間に入った人の<strong>割合</strong>を表しました。「③ 曲線を重ねる」では、曲線の下の面積が、モデルで推定した<strong>確率</strong>を表します。どちらも面積で読む、という点がつながっています。</p><p>例えば、操作時間が10秒以上20秒未満に入る確率を知りたいなら、確率密度の曲線の下で、その区間の面積を求めます。<strong>曲線の高さそのものは確率ではありません。</strong></p><p>確率密度は、単位あたりにどのくらい確率が集まっているかを表します。例えば0.5秒の範囲に一定の密度で全ての確率が収まるモデルなら、高さは2 /秒です。高さが1を超えても、面積は2 × 0.5＝1になります。</p><p>連続分布のモデルで「ちょうど10秒」という一点の確率は、区間の幅が0なので0です。ただし、測定器で10秒と記録されることはあります。測定値が丸められているためです。</p><p>一方、サイコロのような飛び飛びの値では、「1が出る確率＝1/6」のように、それぞれの値に確率を割り当てられます。連続的な値で区間の面積を考える場合と、区別してください。</p></Section>
 <Section title="よく出てくる確率分布"><p>分布は、見た目だけで選ぶものではありません。値がどのように生じたのか、何をモデル化するのかに合わせて考えます。</p><div className="reference-list">{distributions.map(([name,body,example])=><article key={name}><h3>{name}</h3><p>{body}</p><p className="tool-detail">{example}</p><DistributionPlot name={name}/></article>)}</div><p>ここに挙げたものは一部です。二項分布やポアソン分布は飛び飛びの値、正規分布・一様分布・t分布は連続的な値の分布です。</p></Section>
 <Section title="正規分布は、山形のモデル"><p>正規分布は、平均を中心に左右対称の山形をした確率分布です。平均μが中心の位置、標準偏差σが広がりを決めます。平均0、標準偏差1のものを標準正規分布と呼びます。</p><NormalExplorer/><p>正規分布では、平均±1標準偏差に約68%、±2標準偏差に約95%が入ります。あらゆるデータに使える割合ではなく、正規分布の場合の性質です。</p></Section>

 </>;}
