import { useId, useState } from 'react';
import { hamiltonEffect, selectionSeries } from './evolutionMath.js';

export function SelectionExplorer() {
  const id = useId();
  const [initial, setInitial] = useState(0.2);
  const [fitness, setFitness] = useState(1.2);
  const series = selectionSeries(initial, fitness);
  const points = series.map((p, i) => `${56 + i * 17.6},${240 - p * 196}`).join(' ');
  return <div className="explorer evolution-explorer">
    <div className="explorer-heading"><h3>条件を変えて、30世代にわたる変化を見る</h3><span>自然選択の単純なモデル</span></div>
    <p>型Aと型Bがあり、それぞれの型がそのまま子に伝わるとします。型Bが残す平均子孫数を1としたとき、型Aが残す平均子孫数の比を変えて、集団に占める型Aの割合がどう変わるかを見ます。</p>
    <label className="control" htmlFor={`${id}-initial`}><span>開始時の型Aの割合：{Math.round(initial * 100)}%</span><input id={`${id}-initial`} type="range" min="0" max="1" step="0.05" value={initial} onChange={e => setInitial(Number(e.target.value))}/></label>
    <label className="control" htmlFor={`${id}-fitness`}><span>型Bを1とした型Aの平均子孫数の比：{fitness.toFixed(2)}</span><input id={`${id}-fitness`} type="range" min="0.5" max="1.5" step="0.05" value={fitness} onChange={e => setFitness(Number(e.target.value))}/></label>
    <figure className="evolution-figure">
      <svg className="plot" viewBox="0 0 620 300" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>世代ごとの型Aの割合</title>
        <desc id={`${id}-desc`}>初期値{Math.round(initial * 100)}%。30世代後は{(series.at(-1) * 100).toFixed(1)}%。型Bを1とした型Aの平均子孫数の比は{fitness.toFixed(2)}。</desc>
        {[0, 0.5, 1].map(p => <g key={p}><line className="grid" x1="56" x2="584" y1={240 - p * 196} y2={240 - p * 196}/><text x="46" y={245 - p * 196} textAnchor="end">{p * 100}%</text></g>)}
        <line className="axis" x1="56" x2="584" y1="240" y2="240"/>
        {[0, 10, 20, 30].map(g => <text key={g} x={56 + g * 17.6} y="264" textAnchor="middle">{g}</text>)}
        <text x="320" y="290" textAnchor="middle">世代</text>
        <polyline points={points} fill="none" stroke="var(--blue)" strokeWidth="3"/>
      </svg>
      <figcaption>赤線は集団に占める型Aの割合を表します。型Aと型Bが残す平均子孫数の比は世代によらず一定とし、突然変異・移住・遺伝的浮動は含めていません。</figcaption>
    </figure>
    <p className="evolution-result" role="status">30世代後の型Aの割合：<strong>{(series.at(-1) * 100).toFixed(1)}%</strong>。{initial === 0 || initial === 1 ? 'このモデルでは新しい型が生まれないため、開始時に1種類しかなければ、その型だけの集団が続きます。' : fitness === 1 ? '両方の型が残す平均子孫数が等しいため、このモデルでは割合は変わりません。' : fitness > 1 ? '型Aは型Bより平均して多くの子孫を残すため、集団に占める割合が増えます。' : '型Aは型Bより平均して残す子孫が少ないため、集団に占める割合が減ります。'}</p>
    <details><summary>計算と前提を確認する</summary><p>次世代の型Aの割合は p′ = p × wA ÷ (p × wA + 1 − p)。p は現在の型Aの割合、wA は型Bの平均子孫数を1とした型Aの相対適応度です。2つの型がそのまま遺伝する、単倍体や無性生殖の生物を想定しています。集団が十分大きい場合に、各世代で期待される割合を計算しています。実際の集団では、有限の個体数に伴う偶然や環境の変化も加わります。</p></details>
    <p className="note">平均子孫数の比を1.20から0.80に変えてみましょう。これは、環境の変化によって型Aの相対適応度が変わった状況に当たります。どちらの型が増えるか、グラフで確かめてください。</p>
  </div>;
}

export function HamiltonExplorer() {
  const id = useId();
  const [r, setR] = useState(0.5);
  const [b, setB] = useState(3);
  const [c, setC] = useState(1);
  const net = hamiltonEffect(r, b, c);
  const neutral = Math.abs(net) < 1e-9;
  return <div className="explorer evolution-explorer">
    <div className="explorer-heading"><h3>利他行動が広がる条件を確かめる</h3><span>ハミルトンのルール</span></div>
    <p>援助による相手の繁殖成功の増加を b、行為者自身の繁殖成功の減少を c とします。利益と費用を同じ尺度で測り、血縁度で重みづけした利益と費用を差し引きできる、単純な状況を考えます。</p>
    <label className="control" htmlFor={`${id}-r`}><span>血縁度 r：{r.toFixed(2)}</span><input id={`${id}-r`} type="range" min="0" max="1" step="0.05" value={r} onChange={e => setR(Number(e.target.value))}/></label>
    <label className="control" htmlFor={`${id}-b`}><span>相手への利益 b：{b.toFixed(2)}</span><input id={`${id}-b`} type="range" min="0" max="6" step="0.25" value={b} onChange={e => setB(Number(e.target.value))}/></label>
    <label className="control" htmlFor={`${id}-c`}><span>行為者自身の費用 c：{c.toFixed(2)}</span><input id={`${id}-c`} type="range" min="0" max="3" step="0.25" value={c} onChange={e => setC(Number(e.target.value))}/></label>
    <div className="evolution-result" role="status"><p className="evolution-formula">r × b − c = {net.toFixed(2)}</p><p>{neutral ? 'r × b = c。血縁度で重みづけした利益と費用が等しく、この式からは、利他行動を促す形質が選択によって増減する方向は予測されません。' : net > 0 ? 'r × b > c。この条件では、助ける行動を促す形質が自然選択で増えうると考えます。' : 'r × b < c。この条件では、助ける行動を促す形質が自然選択で増えるとは予測しません。'}</p></div>
    <p className="note">rを固定してbとcを動かしてください。相手との血縁度が高くても、どのような場合に r × b &gt; c を満たさなくなるでしょうか。</p>
    <details><summary>この式で扱っていること</summary><p>これは進化の条件を理解する教材用の計算です。個体が頭の中で血縁度を計算する、という意味はありません。現実の生物に適用するには、行動を促す性質が遺伝するか、集団がどのような構造をもつか、競争がどう働くか、利益と費用をどう測るかなどを検討する必要があります。rも単なる「DNAの一致率」ではありません。</p></details>
  </div>;
}
