import { useState } from 'react';
import './poolingAndDepth.css';

const groups = [
 { name: 'A', values: [9, 1, 2, 3], color: '#a82336', pale: '#fcebef' },
 { name: 'B', values: [0, 2, 4, 1], color: '#2362a0', pale: '#eaf2fa' },
 { name: 'C', values: [1, 0, 3, 2], color: '#496825', pale: '#f0f5e8' },
 { name: 'D', values: [2, 6, 0, 1], color: '#80521d', pale: '#fbf1e2' },
];

function PoolingExample() {
 const [selected, setSelected] = useState(0);
 const [moved, setMoved] = useState(false);
 const blocks = groups.map((group, i) => ({ ...group, values: i === 0 && moved ? [3, 1, 2, 9] : group.values }));
 const current = blocks[selected];
 const blockStyle = group => ({ '--pool-color': group.color, '--pool-pale': group.pale });
 return <>
  <h3>プーリング：近くの4つを、1つにまとめる</h3>
  <p>畳み込みで見つけた反応が、地図いっぱいに並んでいるとします。「細かな場所より、この辺りに強い反応があるかを知りたい」とき、近くの数をまとめます。これが<strong>プーリング</strong>です。</p>
  <p>下の数は、特徴マップの反応を表す説明用の数です。今回は、2×2の範囲から<strong>一番大きい数だけを残す、最大プーリング</strong>を試します。</p>
  <figure className="pooling-figure">
   <div className="pooling-flow">
    <div>
     <h4>まとめる前：16個の数</h4>
     <div className="pooling-grid pooling-input" role="group" aria-label="まとめる前の範囲を選ぶ">
      {blocks.map((group, i) => <button key={group.name} className="pooling-block" style={blockStyle(group)} aria-pressed={selected === i} aria-label={`範囲${group.name}：${group.values.join('、')}`} onClick={() => setSelected(i)}>
       <span className="pooling-letter">{group.name}</span>
       <span className="pooling-four">{group.values.map((value, j) => <span key={j} className={value === Math.max(...group.values) ? 'pooling-largest' : ''}>{value}</span>)}</span>
      </button>)}
     </div>
    </div>
    <div className="pooling-arrow" aria-hidden="true">→</div>
    <div>
     <h4>まとめた後：4個の数</h4>
     <div className="pooling-grid pooling-output" role="group" aria-label="最大プーリングの結果">
      {blocks.map((group, i) => <button key={group.name} className="pooling-block" style={blockStyle(group)} aria-pressed={selected === i} aria-label={`範囲${group.name}の最大値：${Math.max(...group.values)}`} onClick={() => setSelected(i)}><span className="pooling-letter">{group.name}</span><strong>{Math.max(...group.values)}</strong></button>)}
     </div>
    </div>
   </div>
   <figcaption>同じ文字・色の範囲が対応します。A〜Dを押して、どの数が残るかを見てみましょう。</figcaption>
  </figure>
  <p className="pooling-calculation" aria-live="polite"><strong>{current.name}の4つ：{current.values.join('・')} → 最大値は{Math.max(...current.values)}</strong><br/>範囲ごとに4個を1個へ。全体では4×4から2×2に小さくなりました。</p>
  <h3>強い反応があった「細かな位置」は、残らない</h3>
  <p>Aの中の9を、左上から右下へ動かしてみましょう。</p>
  <div className="segmented" role="group" aria-label="Aの強い反応の位置"><button aria-pressed={!moved} onClick={() => { setMoved(false); setSelected(0); }}>9を左上に置く</button><button aria-pressed={moved} onClick={() => { setMoved(true); setSelected(0); }}>9を右下へ動かす</button></div>
  <p aria-live="polite">今はAの<strong>{moved ? '右下' : '左上'}に9</strong>があります。それでも、まとめた後のAは<strong>9のまま</strong>です。「Aの範囲に強い反応があった」ことは残りますが、9だけでは、元のどのマスにあったかや、ほかの3つの値は分かりません。</p>
 </>;
}

const digit = ['01110', '11011', '11011', '01110', '11011', '11011', '01110'];
function FeatureSketch({ stage }) {
 return <svg viewBox="0 0 100 100" aria-hidden="true" className="depth-sketch">
  <rect x="1" y="1" width="98" height="98" rx="6" fill="#f5f5f5" stroke="#d3d3d3"/>
  {stage === 0 ? digit.flatMap((row, y) => [...row].map((value, x) => <rect key={`${x}-${y}`} x={20 + x * 12} y={8 + y * 12} width="11" height="11" fill={value === '1' ? '#222' : '#e3e3e3'}/>)) : <g fill="none" stroke="#cc2939" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
   {stage === 1 && <><path d="M23 23 v23 M48 23 h26 M24 74 l20 -20 M64 55 l13 19"/></>}
   {stage === 2 && <><path d="M23 39 Q20 17 44 22 M61 23 Q85 23 78 44 M22 64 Q23 87 44 78 M60 77 Q83 81 78 57"/></>}
   {stage === 3 && <><ellipse cx="50" cy="31" rx="21" ry="20"/><ellipse cx="50" cy="70" rx="23" ry="21"/></>}
  </g>}
 </svg>;
}

const stages = [
 ['入力画像', '画素の明るさを数にする'],
 ['最初の層', '短い線や、明暗の境目を見つける'],
 ['次の層', '前の特徴を組み合わせ、曲がり方などを捉える'],
 ['さらに次の層', 'その組み合わせから、数字の形の手がかりを作る'],
];

export default function PoolingAndDepth() {
 return <div className="pooling-depth">
  <PoolingExample/>
  <h3>深層学習：見つけた特徴を、次の層の材料にする</h3>
  <p>短い線一本だけでは、何の数字かは分かりません。線の曲がり方、曲がった部分の並び方……と、<strong>前の層で見つけた特徴を、次の層で組み合わせる</strong>と、より広い範囲の形を手がかりにできます。</p>
  <figure className="depth-figure">
   <ol className="depth-flow">{stages.map(([title, description], i) => <li key={title}><FeatureSketch stage={i}/><div><strong>{title}</strong><span>{description}</span></div></li>)}</ol>
   <div className="depth-prediction"><span aria-hidden="true">↓</span><strong>出力層で、これらの手がかりから「8」と予測する</strong></div>
   <figcaption>特徴を組み合わせる考え方の図です。実際の途中の値は数の集まりで、必ず各層がこの形を担当するとは限りません。</figcaption>
  </figure>
  <p>このように、<strong>特徴を学ぶ層を何層も重ねたニューラルネットワークを学習させる方法が、深層学習（ディープラーニング）</strong>です。「深い」は、入力から出力までに重なる層の多さを指します。</p>
  <p>プーリングは<strong>近くの反応を少ない数にまとめる処理</strong>、層を重ねるのは<strong>前の計算結果から、さらに特徴を作る工夫</strong>です。CNNでは、この二つを組み合わせることがあります。層を増やせば必ずよくなるわけではなく、目的とデータに合うかを確かめます。</p>
 </div>;
}
