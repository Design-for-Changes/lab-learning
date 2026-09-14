import { fnirsExample as example } from './psychologyMeasurementRecords.js';

export default function PsychologyFnirsExample() {
  const x=t=>65+(t+4)/24*500, y=v=>240-v*200;
  const path=values=>values.map((v,i)=>`${i?'L':'M'}${x(example.time[i])},${y(v)}`).join(' ');
  return <figure className="psych-fnirs-figure">
    <figcaption><strong>課題A：開始前の平均を0にした波形</strong><span>同じ人・同じ測定位置の架空データ。線は説明用の点を結んだものです。</span></figcaption>
    <div className="psych-signal-scroll" role="region" aria-label="fNIRSの変化量の図。狭い画面では横にスクロールできます" tabIndex={0}>
      <svg viewBox="0 0 620 375" role="img" aria-label="開始前4秒間の平均が0。課題Aの開始後にΔHbOが増え、ΔHbRが減る架空の例。6〜10秒に示した3点の平均は、それぞれプラス0.6、マイナス0.2マイクロモル毎リットル。">
        <text x="65" y="24">基準からの変化量（μM）</text>
        <rect x={x(-4)} y="65" width={x(0)-x(-4)} height="240" fill="#ededed"/>
        <rect x={x(0)} y="65" width={x(10)-x(0)} height="240" fill="#fcf0f2"/>
        <text x={x(-2)} y="53" textAnchor="middle">開始前</text><text x={x(5)} y="53" textAnchor="middle">課題中</text>
        {[-0.3,0,0.3,0.6].map(v=><g key={v}><line x1="65" x2="565" y1={y(v)} y2={y(v)} stroke={v===0?'#555':'#ddd'} strokeDasharray={v===0?'5 4':undefined}/><text x="53" y={y(v)+6} textAnchor="end">{v>0?'+':''}{v.toFixed(1)}</text></g>)}
        <path d={path(example.hbo)} fill="none" stroke="#a31f35" strokeWidth="3"/>
        <path d={path(example.hbr)} fill="none" stroke="#225781" strokeWidth="3" strokeDasharray="7 4"/>
        {example.time.map((t,i)=><g key={t}><circle cx={x(t)} cy={y(example.hbo[i])} r="3" fill="#a31f35"/><circle cx={x(t)} cy={y(example.hbr[i])} r="3" fill="#225781"/></g>)}
        {[-4,0,6,10,20].map(t=><text key={t} x={x(t)} y="330" textAnchor="middle">{t}</text>)}
        <text x="315" y="360" textAnchor="middle">課題開始からの時間（秒）</text>
      </svg>
    </div>
    <p className="psych-signal-hint small-note">図は横にスクロールできます。</p>
    <ul className="psych-signal-legend"><li><span className="psych-signal-hbo"/>赤の実線：ΔHbO</li><li><span className="psych-signal-hbr"/>青の破線：ΔHbR</li></ul>
    <p>破線の水平線が、開始前を基準にした0です。反応は課題開始と同時に最大になるとは限らないので、<strong>いつの値を比べるか</strong>も先に決めます。実際の波形には揺れや体動などが混ざります。</p>
  </figure>;
}
