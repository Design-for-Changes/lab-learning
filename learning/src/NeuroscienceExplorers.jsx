import PageLink from './PageLink.jsx';
import { useId, useState } from 'react';
import { neuroscienceSources } from './neuroscienceSources.js';

const circuits = [
  {
    name: '視覚の入力', title: '視床を経由して、視覚皮質へ届く',
    nodes: [['網膜', '光を神経の信号に変える'], ['視床の外側膝状体', '視覚情報を中継・調整する'], ['一次視覚野', '線の向きなどの特徴に応答する']],
    edges: [['down', '網膜の神経節細胞から信号が届く'], ['both', '皮質へ送り、皮質からの信号も受ける']],
    description: '視覚の主要な経路の一つです。一次視覚野から、さらに多くの領域へ処理が広がります。視床も皮質から入力を受けるので、情報が一方向に通過するだけの経路ではありません。',
    source: 'brain',
  },
  {
    name: '注意による選択', title: '必要な感覚に応じて、伝わり方を変える',
    nodes: [['前頭前野', '課題のルールに応じた制御に関わる'], ['視床網様核', '視床を取り囲む抑制性の細胞群'], ['感覚を中継する視床の核', '皮質へ送る感覚信号が調整される']],
    edges: [['down', 'ルールに応じて活動を調整する'], ['inhibit', '抑制性の出力で伝達を調整する']],
    description: '視覚と聴覚を選び分けるマウスの実験で調べられた回路の一部です。抑制の強さを変えることで、必要な情報と妨げになる情報の伝わり方を調整します。注意全体を、この経路だけで説明できるわけではありません。',
    source: 'selection',
  },
  {
    name: '考えを保つ', title: '視床と皮質のやりとりが、活動を支える',
    nodes: [['前頭前野の神経細胞群', 'いま使うルールを表す活動'], ['視床の背内側核', '前頭前野と相互に接続する']],
    edges: [['both', '相互のやりとりが、皮質の活動を支える']],
    description: 'マウスの注意課題では、背内側核からの入力が前頭前野内の機能的な結びつきを強め、ルールを表す活動を維持することが示されました。「視床が情報を中継する」という説明に、皮質での処理を支える役割が加わります。',
    source: 'thalamus',
  },
];

export function ThalamicCircuitExplorer({ initialSelection = 0 }) {
  const [selected, setSelected] = useState(initialSelection);
  const detailId = useId();
  const circuit = circuits[selected];
  return <div className="neuro-explorer">
    <div className="neuro-switches" aria-label="視床の回路を選ぶ">{circuits.map((item, i) => <button type="button" key={item.name} aria-pressed={i === selected} aria-controls={detailId} onClick={() => setSelected(i)}>{item.name}</button>)}</div>
    <div id={detailId} aria-live="polite">
      <h3>{circuit.title.split('、').map((part, i, parts) => <span key={part}>{part}{i < parts.length - 1 ? '、' : ''}</span>)}</h3>
      <div className="neuro-circuit">
        {circuit.nodes.map(([name, description], i) => <div className="neuro-circuit-part" key={name}>
          <div className="neuro-circuit-node"><strong>{name}</strong><span>{description}</span></div>
          {circuit.edges[i] && <div className={`neuro-edge ${circuit.edges[i][0]}`}><span className="neuro-edge-line" aria-hidden="true"/><p>{circuit.edges[i][1]}</p></div>}
        </div>)}
      </div>
      <p>{circuit.description}</p>
      <p className="neuro-caption">線は説明に必要な接続を抜き出しています。矢印は信号の向き、両矢印は双方向の接続、端の横線は抑制を表します。</p>
      <PageLink className="neuro-source" href={neuroscienceSources[circuit.source][1]} target="_blank" rel="noreferrer">{neuroscienceSources[circuit.source][0]} ↗</PageLink>
    </div>
  </div>;
}
