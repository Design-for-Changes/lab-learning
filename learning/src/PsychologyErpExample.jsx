import { useState } from 'react';
import { erpTimes, erpTrials, averageErpTrials } from './psychologyErp.js';

export default function PsychologyErpExample() {
  const [count, setCount] = useState(1);
  const selected = erpTrials.slice(0, count), average = averageErpTrials(selected);
  const x = t => 70 + (t + 100) / 800 * 540, y = v => 163 - v * 5;
  const path = values => values.map((v, i) => `${i ? 'L' : 'M'}${x(erpTimes[i]).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  return <figure className="psych-demo psych-erp">
    <figcaption><strong>時点をそろえて平均すると、何が変わる？</strong></figcaption>
    <ol className="psych-flow psych-erp-flow"><li><strong>記録する</strong><span>同じ条件で、何度も脳波を取る</span></li><li><strong>そろえる</strong><span>刺激が出た瞬間を、各回の0 msにする</span></li><li><strong>平均する</strong><span>同じ時点の値を足して、回数で割る</span></li></ol>
    <div className="psych-controls" role="group" aria-label="平均する架空の試行数">{[1,8,32].map(n=><button key={n} aria-pressed={n===count} onClick={()=>setCount(n)}>{n===1?'1回の波形':`${n}回を平均`}</button>)}</div>
    <svg viewBox="0 0 680 310" role="img" aria-label={`${count}回の架空の波形${count>1?'の平均':''}。同じ形の成分と、回ごとにずれる揺れを足して作った説明図。平均により350 ms付近の陽性の成分が見やすくなる。`}>
      <text x="70" y="26">電位（μV）</text>
      {[-20,0,20].map(v=><g key={v}><line x1="70" x2="610" y1={y(v)} y2={y(v)} stroke={v===0?'#888':'#ddd'}/><text x="54" y={y(v)+6} textAnchor="end">{v>0?`+${v}`:v}</text></g>)}
      {[0,300,600].map(t=><g key={t}><line x1={x(t)} x2={x(t)} y1="50" y2="263" stroke="#ddd" strokeDasharray="4 4"/><text x={x(t)} y="287" textAnchor="middle">{t}</text></g>)}
      {count>1&&selected.slice(0,3).map((values,i)=><path key={i} d={path(values)} fill="none" stroke="#b8b8b8" strokeWidth="1.2"/>)}
      <path d={path(average)} fill="none" stroke="#b52335" strokeWidth="3"/>
      <text x="610" y="287" textAnchor="end">ms</text>
    </svg>
    <p role="status">赤：{count===1?'1回の波形':`${count}回の平均`}。{count>1&&'灰色：平均に使った波形のうち、最初の3回。'}横軸の0 msが刺激を出した瞬間です。陽性を上向きに描いています。縦軸のμVは、100万分の1ボルトです。</p>
    <p className="small-note"><strong>実測ではなく、平均の仕組みを示す合成データです。</strong>同じ形の成分に、回ごとにずれる揺れを足しています。回数は研究の推奨値ではなく、山の形だけで特定のERP成分とは判定できません。</p>
  </figure>;
}
