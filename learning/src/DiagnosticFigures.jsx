import { useState } from 'react';
import { diagnosticExample, normalScores } from './diagnosticExamples.js';

const examples=[['steady','偏りの小さい例'],['outlier','1つだけ極端な例'],['funnel','右ほどばらつく例']];
const descriptions={
 steady:['0の近くに値が集まり、左右に分かれています。まず、どのあたりに多いかを見ます。','点が破線の近くに並んでいます。この例は、正規分布から大きく外れた形には見えません。','0の上下に点が散らばり、右へ行くほど広がるような大きな変化は目立ちません。'],
 outlier:['右端の離れた場所に、1つだけ値があります。ほかとは大きく違う値が混じっていることが分かります。','右上の点が破線から大きく離れています。大きい値の側が、正規分布で考えた並び方と違うことが分かります。','予測50秒のところに、残差＋18秒の点があります。実際には68秒かかりました。なぜこの人だけ大きくずれたか、元の記録を確かめます。'],
 funnel:['全体をひとまとめにすると、値が広く散らばっていることは分かります。ただし、予測時間との関係までは見えません。','中央と両端で、破線からのずれ方が違います。予測時間との関係は、次の残差の図で確かめます。','右に行くほど点が上下に広がっています。時間が長い条件ほど、予測からのずれも大きい例です。ばらつきが一定という考えを見直す手がかりになります。'],
};

export default function DiagnosticFigures(){
 const [kind,setKind]=useState('steady'),data=diagnosticExample(kind);
 const sx=value=>72+(value+20)/40*500,sy=value=>240-(value+20)/40*200;
 const qx=value=>72+(value+2.2)/4.4*500,px=value=>72+(value-20)/40*500;
 return <div className="explorer diagnostic-examples">
  <div className="explorer-heading"><h3>同じ20人のデータを、3つの図で見る</h3><span>読み方を練習する架空の例</span></div>
  <p>あるモデルが予測した操作時間と、実際に測った時間を比べます。<strong>残差は「実測値 − 予測値」</strong>です。例えば、予測30秒・実測34秒なら、残差は＋4秒になります。</p>
  <p>下の3つの図は、すべて同じ残差を使っています。ボタンを切り替えて、どこが変わるか見てください。</p>
  <div className="segmented" role="group" aria-label="データを確かめる図の例">{examples.map(([id,label])=><button key={id} aria-pressed={kind===id} onClick={()=>setKind(id)}>{label}</button>)}</div>
  <figure className="diagnostic-figure"><h4>① ヒストグラム：どんな値が多い？</h4>
   <svg className="plot population-plot" viewBox="0 0 640 320" role="img" aria-label={`${examples.find(([id])=>id===kind)[1]}の残差のヒストグラム。横軸は残差、縦軸は人数。合計20人。`}>
    {[0,5,10].map(count=><g key={count}><line x1="72" x2="572" y1={240-count*18} y2={240-count*18} className="grid"/><text x="55" y={246-count*18} textAnchor="end">{count}</text></g>)}
    <text x="72" y="28">人数</text>
    {data.bins.map(bin=><rect key={bin.low} x={sx(bin.low)+1} y={240-bin.count*18} width="48" height={bin.count*18} fill="#cc2939" fillOpacity=".55"/>)}
    {[-20,-10,0,10,20].map(value=><text key={value} x={sx(value)} y="272" textAnchor="middle">{value}</text>)}
    <text x="320" y="310" textAnchor="middle">残差（秒）</text>
   </svg><figcaption aria-live="polite">{descriptions[kind][0]}</figcaption>
  </figure>
  <figure className="diagnostic-figure"><h4>② Q–Qプロット：正規分布と似た並び方？</h4>
   <p>残差を小さい順に並べ、「正規分布なら、この順番の値はどこに来るか」と比べます。<strong>点がだいたい一直線に並ぶか</strong>を見ます。</p>
   <svg className="plot population-plot" viewBox="0 0 640 330" role="img" aria-label={`${examples.find(([id])=>id===kind)[1]}の正規Q–Qプロット。横軸は正規分布の基準の位置、縦軸は小さい順に並べた残差。破線と点のずれを見る。`}>
    {[-20,0,20].map(value=><g key={value}><line x1="72" x2="572" y1={sy(value)} y2={sy(value)} className="grid"/><text x="55" y={sy(value)+6} textAnchor="end">{value}</text></g>)}
    <text x="72" y="28">残差（秒）</text>
    <line x1={qx(-2)} x2={qx(2)} y1={sy(data.center-2*data.slope)} y2={sy(data.center+2*data.slope)} stroke="#777" strokeWidth="2" strokeDasharray="6 5"/>
    {data.sorted.map((value,i)=><circle key={i} cx={qx(normalScores[i])} cy={sy(value)} r="5" fill="#cc2939"/>)}
    {[-2,0,2].map(value=><text key={value} x={qx(value)} y="273" textAnchor="middle">{value}</text>)}
    <text x="320" y="313" textAnchor="middle">正規分布なら並ぶ位置（基準）</text>
   </svg><figcaption aria-live="polite">{descriptions[kind][1]}</figcaption>
  </figure>
  <figure className="diagnostic-figure"><h4>③ 残差の図：ずれ方に決まりがある？</h4>
   <p>横軸は予測した時間、縦軸は残差です。<strong>0の上下に、同じくらいの幅で散らばっているか</strong>を見ます。</p>
   <svg className="plot population-plot" viewBox="0 0 640 320" role="img" aria-label={`${examples.find(([id])=>id===kind)[1]}の残差の散布図。横軸は予測した時間20秒から60秒、縦軸は残差マイナス20秒から20秒。1点が1人。`}>
    {[-20,0,20].map(value=><g key={value}><line x1="72" x2="572" y1={sy(value)} y2={sy(value)} className="grid"/><text x="55" y={sy(value)+6} textAnchor="end">{value}</text></g>)}
    <text x="72" y="28">残差（秒）</text>
    <line x1="72" x2="572" y1={sy(0)} y2={sy(0)} stroke="#777" strokeDasharray="6 5"/>
    {data.observations.map((row,i)=><circle key={i} cx={px(row.predicted)} cy={sy(row.residual)} r="5" fill="#cc2939"/>)}
    {[20,40,60].map(value=><text key={value} x={px(value)} y="273" textAnchor="middle">{value}</text>)}
    <text x="320" y="310" textAnchor="middle">予測した時間（秒）</text>
   </svg><figcaption aria-live="polite">{descriptions[kind][2]}</figcaption>
  </figure>
  <p className="explainer">図は、前提に合わないところを探す手がかりです。点がきれいに並んだだけで、正規性や独立性が証明できるわけではありません。</p>
 </div>;
}
