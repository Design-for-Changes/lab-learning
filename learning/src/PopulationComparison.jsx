import { useState } from 'react';
import { populationComparison } from './populationComparison.js';

const colors=['#cc2939','#2257c6'];
const sx=value=>80+(value-10)/100*520;
const jitter=(id,group=0)=>((id*19+group*7)%59)-29;
const signed=value=>`${value>0?'+':''}${value.toFixed(2)}`;
function Axis({y}){return <>{[20,40,60,80,100].map(value=><g key={value}><line x1={sx(value)} x2={sx(value)} y1={y-4} y2={y+4} className="axis"/><text x={sx(value)} y={y+30} textAnchor="middle">{value}</text></g>)}<line x1="80" x2="600" y1={y} y2={y} className="axis"/><text x="340" y={y+64} textAnchor="middle">操作時間（秒）</text></>;}

export default function PopulationComparison(){
 const [different,setDifferent]=useState(false),[draw,setDraw]=useState(0);
 const model=populationComparison(draw,different),difference=model.sampleMeans[0]-model.sampleMeans[1];
 const centers=different?[74,184]:[114];
 return <div className="explorer population-comparison">
  <div className="explorer-heading"><h3>同じ観測データを、2通りのモデルで考える</h3><span>架空のカテゴリーA・B</span></div>
  <div className="population-stage"><h4>① 観察できたのは、この2群</h4><p>A群・B群を別々の12人ずつ調べた例です。1点が1人、横位置が操作時間です。上下の位置は、点の重なりを避けるためにずらしています。</p>
   <svg className="plot population-plot" viewBox="0 0 640 285" role="img" aria-label={`観測した標本の散布図。A群12人の平均${model.sampleMeans[0].toFixed(2)}秒、B群12人の平均${model.sampleMeans[1].toFixed(2)}秒。標本平均の差は${signed(difference)}秒。赤と青の実線は標本平均。`}>
    {model.samples.map((values,group)=>{const cy=55+group*100;return <g key={group}><text x="28" y={cy+8}>{group?'B':'A'}</text><line x1="80" x2="600" y1={cy} y2={cy} className="grid"/>{values.map((value,i)=><circle key={i} cx={sx(value)} cy={cy+jitter(model.indices[group][i],group)*.75} r="5.5" fill={colors[group]}/>)}<line x1={sx(model.sampleMeans[group])} x2={sx(model.sampleMeans[group])} y1={cy-36} y2={cy+36} stroke={colors[group]} strokeWidth="3"/></g>;})}<Axis y={205}/>
   </svg>
   <div className="histogram-legend"><span><i className="population-dot sample-a"/>A群の人</span><span><i className="population-dot sample-b"/>B群の人</span><span>色付きの縦線：標本平均</span></div>
   <div className="metric-row" aria-live="polite"><span>A群の標本平均 <strong>{model.sampleMeans[0].toFixed(2)}秒</strong></span><span>B群の標本平均 <strong>{model.sampleMeans[1].toFixed(2)}秒</strong></span><span>標本平均の差 A − B <strong>{signed(difference)}秒</strong></span></div>
  </div>
  <div className="population-stage"><h4>② この差を、どう説明する？</h4><p>点は同じまま、背景の母集団モデルを切り替えてください。</p>
   <div className="segmented" role="group" aria-label="母集団のモデル"><button aria-pressed={!different} onClick={()=>setDifferent(false)}>1つの母集団として見る</button><button aria-pressed={different} onClick={()=>setDifferent(true)}>2つの母集団として見る</button></div>
   <p className="population-model-title">{different?'カテゴリーごとに、異なる母平均を考える':'両カテゴリーに、共通の母平均を考える'}</p>
   <svg className="plot population-plot" viewBox="0 0 640 330" role="img" aria-label={different?`同じ観測データに2つの母集団モデルを重ねた図。モデルの中心はAが${model.modelMeans[0].toFixed(2)}秒、Bが${model.modelMeans[1].toFixed(2)}秒。`:`同じ観測データに1つの母集団モデルを重ねた図。両カテゴリー共通のモデルの中心は${model.modelMeans[0].toFixed(2)}秒。標本平均には差があるが、母平均には差がないと考える。`}>
    {centers.map((cy,group)=><g key={group}>
     <rect x="80" y={cy-44} width="520" height="88" rx="18" fill="#f5f5f5" stroke="#ddd"/>
     {different&&<text x="28" y={cy+8}>{group?'B':'A'}</text>}
     {model.modelPoints[group].map((value,id)=><circle key={id} cx={sx(value)} cy={cy+jitter(id)} r="3.3" fill="#bbb"/>)}
     <line x1={sx(model.modelMeans[group])} x2={sx(model.modelMeans[group])} y1={cy-40} y2={cy+40} stroke="#111" strokeWidth="2" strokeDasharray="6 5"/>
     {(different?[group]:[0,1]).map(sampleGroup=>model.samples[sampleGroup].map((value,i)=><circle key={`${sampleGroup}-${i}`} cx={sx(value)} cy={cy+jitter(model.indices[sampleGroup][i],sampleGroup)*.75} r="5.5" fill={colors[sampleGroup]} stroke="white" strokeWidth="1"/>))}
    </g>)}<Axis y={250}/>
   </svg>
   <div className="histogram-legend"><span><i className="population-dot"/>母集団の広がりのイメージ</span><span><i className="line-key dashed-line"/>モデルの中心</span></div>
   <div className="population-conclusion" aria-live="polite"><p><strong>{different?'母平均の違いが、観測された平均差に関わっていると考える。':'観測された平均差は、標本の集まり方によるずれだと考える。'}</strong></p><p>{different?'カテゴリーごとに中心を置けば、標本の平均には合わせやすくなります。ただし、それだけで母平均にも差があるとは結論できません。':'共通の母平均を考えていても、A群とB群の標本平均がぴったり一致するとは限りません。まず、この説明で今回の差をどのくらい説明できるか考えます。'}</p></div>
   <p className="explainer">灰色の点は、観測できていない母集団の広がりを描いた模式図です。破線の中心は、1つのモデルなら全員の平均、2つなら各群の平均に仮に置いています。母平均そのものが分かったわけではありません。広がりは比較のため同じに描いています。</p>
  </div>
  <div className="population-draw"><button onClick={()=>setDraw(previous=>previous+1)}>別の標本例を見る</button><span>平均差が変わっても、考える順序は同じです。</span></div>
 </div>;
}
