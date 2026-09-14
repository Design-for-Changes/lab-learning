import { useId, useState } from 'react';
import { attentionWords, attentionVectors, attentionExample } from './architectureMath.js';
import './sequenceAndGan.css';

export function RnnDiagram() {
 const [step, setStep] = useState(1);
 const words = ['猫が', '魚を', '食べる'];
 return <div className="explorer nn-visual">
  <h3>RNN：途中の情報を、次の計算へ渡す</h3>
  <p>「次の語を読む」を押すと、読む順番を追えます。一回の計算には、<strong>今の語と、一つ前までの情報</strong>の両方を入れます。</p>
  <div className="segmented"><button disabled={step === 3} onClick={() => setStep(s => s + 1)}>次の語を読む</button><button onClick={() => setStep(1)}>最初の語へ戻る</button></div>
  <figure>
   <ol className="nn-chain rnn-chain">{words.map((word, i) => <li key={word} className={i < step ? 'nn-read' : 'nn-unread'} aria-current={i === step - 1 ? 'step' : undefined}>
    <span className="nn-step-label">{i + 1}語目：{i < step ? '読んだ' : 'これから'}</span>
    <strong className="nn-word">「{word}」</strong>
    <span className="nn-down" aria-hidden="true">↓ ＋</span>
    <span>{i === 0 ? '最初の状態（例：0の列）' : `前から受け取った情報${i}`}</span>
    <div className="nn-process">同じRNNの計算</div>
    <span className="nn-down" aria-hidden="true">↓</span>
    <strong className="rnn-state">途中の情報{i + 1}</strong>
   </li>)}</ol>
   <figcaption>横に並ぶ箱は、同じRNNを時間順に描いたものです。語ごとに別のモデルを作るのではなく、同じ重みで計算します。</figcaption>
  </figure>
  <p className="nn-status" aria-live="polite"><strong>今は「{words.slice(0, step).join('')}」まで読みました。</strong><br/>{step < 3 ? `途中の情報${step}を、次の「${words[step]}」の計算へ渡します。` : '最後の途中の情報を、文章の分類など、目的に応じた出力の計算に使えます。'}</p>
  <p>この「途中の情報」が<strong>隠れ状態</strong>です。実際は数を並べたベクトルで、文章をそのまま保存したメモではありません。何を残すと役立つかを、学習で重みを調整して身に付けます。</p>
 </div>;
}

export function AttentionDiagram() {
 const [query, setQuery] = useState(2);
 const result = attentionExample(query);
 const marker = `attention-${useId().replace(/:/g, '')}`;
 return <div className="explorer nn-visual">
  <h3>attention：使う情報に、違う割合を掛けて混ぜる</h3>
  <p>例えば「食べる」を処理するとき、ほかの語の情報をどれだけ取り込むかを決めます。<strong>一つだけを選ぶとは限らず、複数の情報を混ぜます。</strong></p>
  <p className="nn-caption">下は、仕組みを見るために2個ずつの数を置いた計算例です。学習した語の意味や、文法の正解を示す数ではありません。</p>
  <div className="segmented" role="group" aria-label="attentionで処理する語">{attentionWords.map((word, i) => <button key={word} aria-pressed={query === i} onClick={() => setQuery(i)}>「{word}」を選ぶ</button>)}</div>
  <figure className="attention-intro-figure">
   <div className="attention-sources">{attentionWords.map((word, i) => <div key={word}><strong>{word}</strong><span>［{attentionVectors[i].join('，')}］</span><b>{(result.weights[i] * 100).toFixed(1)}%</b></div>)}</div>
   <svg viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true" className="attention-threads">
    <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#cc2939"/></marker></defs>
    {result.weights.map((weight, i) => <path key={i} d={`M${50 + i * 100} 0 Q${50 + i * 100} 45 150 80`} fill="none" stroke="#cc2939" strokeWidth={1 + weight * 9} markerEnd={`url(#${marker})`}/>)}
   </svg>
   <div className="attention-mixed" aria-live="polite"><strong>「{attentionWords[query]}」へ取り込む情報</strong><span>約［{result.output.map(n => n.toFixed(2)).join('，')}］</span></div>
   <figcaption>線が太いほど、取り込む割合が大きい。割合の合計は100%です（表示は四捨五入）。次に出す語の確率とは別です。</figcaption>
  </figure>
  <p><strong>今の語を切り替えると、割合も、混ぜた結果も変わります。</strong>実際のattentionでは、語を数で表したものどうしを比べて、この割合を計算します。下のTransformerの説明で、その数の作り方を見ます。</p>
 </div>;
}

export function VectorTransformDiagram() {
 const [index, setIndex] = useState(0);
 const inputs = [[1, 2], [2, 1]];
 const input = inputs[index], output = [input[0] + input[1], input[1]];
 const marker = `vector-${useId().replace(/:/g, '')}`;
 const x = value => 40 + value * 55, y = value => 220 - value * 45;
 return <div className="explorer nn-visual">
  <h3>ベクトルの変換も、「重みを掛けて足す」</h3>
  <p>01のベクトルは、順番を決めた数の並びでした。その数に重みを掛けて足し、<strong>別の数の並びを作る</strong>ことができます。04のニューロンの計算とつながっています。</p>
  <div className="segmented" role="group" aria-label="変換するベクトル">{inputs.map((values, i) => <button key={i} aria-pressed={index === i} onClick={() => setIndex(i)}>入力［{values.join('，')}］</button>)}</div>
  <figure className="vector-transform-figure">
   <svg viewBox="0 0 300 260" role="img" aria-label={`重みは同じまま、入力ベクトル${input.join('、')}を、${output.join('、')}に変換する図。`}>
    <defs>{['#2362a0', '#cc2939'].map((color, i) => <marker key={color} id={`${marker}-${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={color}/></marker>)}</defs>
    {[0, 1, 2, 3, 4].map(n => <g key={n}><line x1={x(n)} x2={x(n)} y1={y(0)} y2={y(4)} stroke="#ddd"/><line x1={x(0)} x2={x(4)} y1={y(n)} y2={y(n)} stroke="#ddd"/><text x={x(n)} y="239" textAnchor="middle">{n}</text>{n > 0 && <text x="26" y={y(n) + 5} textAnchor="end">{n}</text>}</g>)}
    <text x="40" y="21">2番目の数</text><text x="180" y="258">1番目の数</text>
    <line x1={x(0)} y1={y(0)} x2={x(input[0])} y2={y(input[1])} stroke="#2362a0" strokeWidth="3" markerEnd={`url(#${marker}-0)`}/>
    <line x1={x(0)} y1={y(0)} x2={x(output[0])} y2={y(output[1])} stroke="#cc2939" strokeWidth="3" markerEnd={`url(#${marker}-1)`}/>
   </svg>
   <div className="vector-calculation" aria-live="polite"><p className="vector-before"><strong>変換前 ［{input.join('，')}］</strong></p><p>1番目を作る重み［1，1］<br/>{input[0]}×1＋{input[1]}×1＝<strong>{output[0]}</strong></p><p>2番目を作る重み［0，1］<br/>{input[0]}×0＋{input[1]}×1＝<strong>{output[1]}</strong></p><p className="vector-after"><strong>変換後 ［{output.join('，')}］</strong></p></div>
   <figcaption>青が変換前、赤が変換後です。図にできるよう2個の数にしました。ここでの座標は、語の意味の地図ではありません。</figcaption>
  </figure>
  <p>この二組の重みを表にしたものが<strong>重み行列</strong>です。入力を変えても、同じ重みで変換します。Transformerでもこの計算を使い、どんな重みが役立つかを学習します。</p>
 </div>;
}

export function TransformerDiagram() {
 return <div className="explorer nn-visual">
  <h3>Transformer：ベクトルを作り替えながら、文脈を取り込む</h3>
  <figure>
   <ol className="transformer-route">
    <li><strong>① 語などの単位を、ベクトルにする</strong><div className="nn-token-row"><span>猫 → ［…］</span><span>魚 → ［…］</span><span>食べる → ［…］</span></div><p>このような数での表現を<strong>埋め込み（embedding）</strong>と呼びます。順番を扱えるよう、位置の情報も組み込みます。</p></li>
    <li><strong>② 同じ入力から、三つの役のベクトルを作る</strong><p>それぞれ別の重み行列で変換します。全ての語について行う計算です。</p><div className="qkv-source">各語のベクトル</div><div className="qkv-branches">{[['Q','Query','何を参照するか','WQ'],['K','Key','照合する手がかり','WK'],['V','Value','取り込む中身','WV']].map(([letter, name, role, matrix]) => <div key={letter}><span className="qkv-origin">同じ元のベクトル</span><span className="nn-down" aria-hidden="true">↓</span><small>重み {matrix} で変換</small><strong>{letter}：{name}</strong><span>{role}</span></div>)}</div></li>
    <li><strong>③ QとKを比べ、Vを混ぜる</strong><div className="transformer-mixing"><span>今の語のQと、各語のKを比べる<br/>照合して、割合を決める</span><b aria-hidden="true">↓</b><span>各語のVに割合を掛けて足す<br/>周りの情報を取り込む</span></div><p>同じ文章の中の情報を取り込むので、<strong>自己注意機構（self-attention）</strong>と呼びます。</p></li>
    <li><strong>④ 各位置で、もう一度特徴を作り替える</strong><p>取り込んだ情報を、重み付きの計算と<strong>活性化関数</strong>に通します。04のニューラルネットワークと同様の処理です。</p><div className="nn-token-row"><span>周りの情報を含む［…］</span><span aria-hidden="true">→</span><span>次の層に渡す［…］</span></div></li>
   </ol>
   <figcaption>②〜④を含む層を重ね、予測に使う表現を作ります。文章の続きを生成するなら、最後に「次のトークンごとの点数→確率→一つ選ぶ」と進みます。</figcaption>
  </figure>
  <p>Transformerの中では、<strong>数の並びを変換すること</strong>と、<strong>ほかの位置の情報を取り込むこと</strong>を組み合わせています。attentionの割合も入力によって変わり、活性化関数も使うので、全体が一回の行列の掛け算だけで終わるわけではありません。</p>
  <details><summary>実際の構造には、もう少し工夫がある</summary><p>別々の重みで複数組のattentionを計算して合わせるのが<strong>マルチヘッド注意機構</strong>です。また、元の入力を足し戻す<strong>残差接続</strong>や、値の大きさを整える<strong>層正規化</strong>も使います。文章を順に生成するモデルでは、まだ先の語を見ないようにします。</p></details>
 </div>;
}

function DigitSketch({ generated = false }) {
 return <svg viewBox="0 0 64 64" aria-hidden="true" className="gan-digit-sketch"><rect x="1" y="1" width="62" height="62" rx="5" fill="#f5f5f5" stroke="#ccc"/><path d={generated ? 'M20 15 Q45 9 42 27 Q22 38 39 43 Q48 57 18 51' : 'M19 15 Q46 8 42 25 Q37 32 29 32 Q48 31 44 46 Q39 60 18 50'} fill="none" stroke={generated ? '#cc2939' : '#222'} strokeWidth="5" strokeLinecap="round"/></svg>;
}

export function GanDiagram() {
 const [phase, setPhase] = useState(0);
 return <div className="explorer nn-visual">
  <h3>GAN：いま直すのは、どちらの重み？</h3>
  <p>図の手順を切り替えてみましょう。<strong>GとDを交互に練習させ、学習後はGで画像を作ります。</strong></p>
  <div className="segmented" role="group" aria-label="GANの手順">{['① Dを練習する', '② Gを練習する', '③ 学習後に生成する'].map((label, i) => <button key={label} aria-pressed={phase === i} onClick={() => setPhase(i)}>{label}</button>)}</div>
  <figure>
   <div className={`gan-teaching-flow ${phase === 2 ? 'gan-generation-only' : ''}`}>
    <div className="gan-inputs">
     {phase === 0 && <div className="gan-input-route"><strong>集めた画像</strong><DigitSketch/><span>出所の正解：実際のデータ</span></div>}
     <div className="gan-input-route"><span>乱数（作り始めの種）</span><span className="nn-down" aria-hidden="true">↓</span><div className={`nn-process ${phase === 1 ? 'nn-updating' : ''}`}><strong>生成器 G</strong><span>{phase === 1 ? 'いま重みを直す' : phase === 0 ? 'この回は重みを固定' : '学習済みの重みを使う'}</span></div><span className="nn-down" aria-hidden="true">↓</span><DigitSketch generated/><strong>生成した画像</strong>{phase === 0 && <span>出所の正解：生成データ</span>}</div>
    </div>
    {phase < 2 && <><div className="gan-to-judge" aria-hidden="true">→</div><div className={`gan-judge ${phase === 0 ? 'nn-updating' : ''}`}><strong>識別器 D</strong><span>{phase === 0 ? 'いま重みを直す' : 'この回は重みを固定'}</span><hr/><span>入力の画像が<br/>実際のデータらしいか<br/>を出力する</span>{phase === 0 && <small>両方の経路に、同じDを使う</small>}</div></>}
   </div>
   {phase === 0 && <div className="gan-feedback"><strong>Dの出力と、分かっている出所を比べる</strong><span>間違いが減るように、Dの重みを直す。</span></div>}
   {phase === 1 && <div className="gan-feedback"><strong>← Dを通して、Gの直し方を調べる</strong><span>Dが生成画像を「実際のデータらしい」とする出力が高くなるよう、Gの重みを直す。Dの計算は使うが、Dの重みは変えない。</span></div>}
   {phase === 2 && <div className="gan-feedback"><strong>新しい乱数 → 学習済みのG → 生成画像</strong><span>生成するときはDを使わず、Gの重みも直さない。</span></div>}
   <figcaption>画像は役割を説明するための模式図です。ボタンは手順の切り替えで、学習の実行結果ではありません。</figcaption>
  </figure>
  <p className="nn-status" aria-live="polite">{phase === 0 ? '①は見分ける練習です。「実際の画像か、Gが作った画像か」は用意した側が分かるので、答え合わせできます。' : phase === 1 ? '②は作る練習です。一枚の正解画像に近づけるのではなく、Dの判断を手がかりにGを直します。これには05の誤差逆伝播を使います。' : '③は学習済みモデルを使う段階です。乱数を変えて画像を作り、似たものばかり出ないかなどを確認します。'}</p>
 </div>;
}
