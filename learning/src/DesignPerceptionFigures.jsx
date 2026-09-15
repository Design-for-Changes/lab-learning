import { useState } from 'react';
import { gestaltExamples, usabilityHeuristics } from './designStudyUsability.js';

export function UsabilityHeuristics() {
  return <details className="design-heuristics"><summary>10のユーザビリティ・ヒューリスティックスと、予約画面での例</summary>
    <p>5つの観点が使いやすさを捉える整理なのに対し、10原則は設計案の問題を探すための経験則です。ヒューリスティックスは、こうした判断の手がかりを指します。「保存できたか分からない」なら状態を表示するなど、改善案を考えるときに使います。</p>
    <ol>{usabilityHeuristics.map(([name, example]) => <li key={name}><strong>{name}</strong><p>{example}</p></li>)}</ol>
    <p className="design-caption">Jakob Nielsenの10原則に沿った、教材独自の例です。原則で点検した後も、実際の利用者が使えるかを確かめます。</p>
  </details>;
}

function GestaltPattern({ type }) {
  switch (type) {
    case 'proximity': return <>
      <text x="25" y="30">等間隔</text><text x="25" y="140">間隔を変える</text>
      {[55, 125, 195, 265, 335, 405, 475, 545].map(x => <circle key={x} cx={x} cy="70" r="9"/>)}
      {[55, 85, 200, 230, 345, 375, 490, 520].map(x => <circle key={x} cx={x} cy="190" r="9"/>)}
    </>;
    case 'similarity': return <>{[60, 120, 180].flatMap(y => [85, 170, 255, 340, 425, 510].map((x, i) => i % 2
      ? <rect key={`${x}-${y}`} x={x-12} y={y-12} width="24" height="24"/>
      : <circle key={`${x}-${y}`} cx={x} cy={y} r="12"/>))}</>;
    case 'continuity': return <>
      <g fill="none" stroke="#171717" strokeWidth="4"><path d="M65 185C205 185 395 55 535 55"/><path d="M65 55C205 55 395 185 535 185"/></g>
      <text x="30" y="193">A</text><text x="550" y="63">B</text><text x="30" y="63">C</text><text x="550" y="193">D</text>
    </>;
    case 'closure': return <path d="M245 45H205V85M355 45H395V85M395 155V195H355M245 195H205V155" fill="none" stroke="#171717" strokeWidth="6"/>;
    case 'figureGround': return <>
      <rect x="30" y="12" width="540" height="216" rx="8" fill="#ddd"/>
      {[50,90,130,170].map(y => <rect key={y} x="55" y={y} width="470" height="16" rx="4" fill="#bbb"/>)}
      <rect x="30" y="12" width="540" height="216" rx="8" fill="#171717" opacity=".55"/>
      <rect x="140" y="45" width="320" height="150" rx="8" fill="white" stroke="#171717"/>
      <text x="300" y="92" textAnchor="middle">この日時で予約しますか？</text>
      <rect x="255" y="125" width="90" height="42" rx="5" fill="#b62236"/>
      <text x="300" y="153" textAnchor="middle" fill="white">予約する</text>
    </>;
    case 'commonRegion': return <>
      <g fill="#f7f3f3" stroke="#b62236" strokeWidth="2"><rect x="60" y="32" width="235" height="176" rx="10"/><rect x="305" y="32" width="235" height="176" rx="10"/></g>
      {[82,158].flatMap(y => [100,180,260,340,420,500].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="9"/>))}
    </>;
    default: return null;
  }
}

export function GestaltExplorer() {
  const [value, setValue] = useState(0);
  const selected = gestaltExamples[value];
  return <figure className="design-figure design-gestalt"><figcaption><strong>まとまりの見え方を、設計に使う</strong><span>原理を選ぶと、図と応用例が変わります。</span></figcaption>
    <div className="design-choices" role="group" aria-label="ゲシュタルト心理学の原理">{gestaltExamples.map((item, i) => <button key={item.id} type="button" aria-pressed={value === i} onClick={() => setValue(i)}>{item.name}</button>)}</div>
    <svg viewBox="0 0 600 240" role="img" aria-label={selected.description}><GestaltPattern type={selected.id}/></svg>
    <div className="design-result" aria-live="polite"><h3>{selected.name}（{selected.english}）</h3><p>{selected.meaning}</p><p><strong>設計で使うなら：</strong>{selected.application}</p></div>
  </figure>;
}
