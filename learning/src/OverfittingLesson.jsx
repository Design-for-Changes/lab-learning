import { useState } from 'react';
import { Section } from './Common.jsx';
import { LocalPythonCommands } from './LocalPythonCommands.jsx';
import example from './overfittingExample.json';

const base=import.meta.env.BASE_URL;
const names=['学び始め','途中','続けた後'];
const x=epoch=>55+epoch/3000*435,y=loss=>225-loss/1.6*180;

export default function OverfittingLesson(){
 const [selected,setSelected]=useState(0),row=example.snapshots[selected];
 return <>
  <Section title="練習では満点。でも、初めての問題では？">
   <p>XORは、全4通りを繰り返し練習する例でした。実際に予測したいのは、まだ答えを見ていないデータです。問題集の答えを覚えて満点を取れても、少し違う問題を解けるとは限らない、という場面を考えてください。</p>
   <p>次は、二つの特徴から成功1／失敗0を予測する架空データ160件です。入力は0/1に限らず、1.83や−3.08のような値を取ります。結果には、入力二つだけでは説明できない揺れも含めています。</p>
   <div className="table-scroll"><table className="data-table"><thead><tr><th>入力1</th><th>入力2</th><th>記録された結果</th></tr></thead><tbody><tr><td>1.83</td><td>−3.08</td><td>失敗0</td></tr><tr><td>0.96</td><td>0.07</td><td>成功1</td></tr><tr><td>1.32</td><td>0.39</td><td>成功1</td></tr></tbody></table></div>
   <p>最初に、90件を練習用、30件を途中の確認用、40件を最後の試験用に分けます。<strong>重みを直すのは練習用90件だけ。</strong>確認用30件は、今の重みで予測し、答え合わせだけをします。以下は実際にPythonで計算した結果です。</p>
   <div className="explorer"><h3>学習を進めると、二つの成績はどうなる？</h3>
    <div className="segmented" role="group" aria-label="比較する学習時点">{names.map((name,i)=><button key={name} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{name}：{example.snapshots[i].epoch}回</button>)}</div>
    <div className="ai-score-pair" aria-live="polite"><p><span>練習用90件</span><strong>{row.trainCorrect}件正解</strong>間違い {90-row.trainCorrect}件<br/>平均損失 {row.trainLoss.toFixed(4)}</p><p><span>確認用30件</span><strong>{row.validationCorrect}件正解</strong>間違い {30-row.validationCorrect}件<br/>平均損失 {row.validationLoss.toFixed(4)}</p></div>
    <p>グラフの横軸は学習回数、縦軸は先ほどの<strong>平均損失（予測の外れ方。小さいほどよい）</strong>です。青の実線が練習用、赤の破線が確認用。点は上で選んだ時点です。</p>
    <svg className="plot" viewBox="0 0 530 295" role="img" aria-label={`学習経過。${row.epoch}回で練習用の平均損失${row.trainLoss.toFixed(4)}、確認用${row.validationLoss.toFixed(4)}。後半は練習用が下がり、確認用が上がる。`}>
     {[0,.4,.8,1.2,1.6].map(t=><g key={t}><line x1="55" x2="490" y1={y(t)} y2={y(t)} stroke="#ddd"/><text x="44" y={y(t)+5} textAnchor="end">{t}</text></g>)}
     {[["trainLoss","#2865b0",undefined],["validationLoss","#cc2939","7 5"]].map(([key,color,dash])=><g key={key}><path d={example.history.map((r,i)=>`${i?'L':'M'}${x(r.epoch).toFixed(1)},${y(r[key]).toFixed(1)}`).join(' ')} fill="none" stroke={color} strokeWidth="3" strokeDasharray={dash}/><circle cx={x(row.epoch)} cy={y(row[key])} r="6" fill={color}/></g>)}
     {[0,1000,2000,3000].map(t=><text key={t} x={x(t)} y="250" textAnchor={t===0?'start':t===3000?'end':'middle'}>{t}</text>)}
     <text x="55" y="25">平均損失</text><text x="270" y="282" textAnchor="middle">学習回数（エポック）</text>
    </svg>
    <p><strong>75回→3000回：</strong>練習用の間違いは10件から0件へ減りました。しかし、確認用の間違いは3件から4件へ増え、平均損失も約0.20から1.45へ上がりました。学習を続けたことが、確認用の改善にはつながっていません。</p>
    <p>損失は、間違いの件数だけでなく、<strong>外した答えにどれだけ高い確率を付けたか</strong>でも大きくなります。だから、間違いが1件増えただけでも、損失が大きく増える場合があります。</p>
   </div>
  </Section>
  <Section title="練習したデータに、合わせすぎてしまう">
   <p>例えば、たまたま記録された例外まで当てようとして、予測ルールを細かく変えすぎたらどうなるでしょう。練習したデータにはよく合う一方、別のデータでは当たりにくくなります。<strong>このように学習用データに合わせすぎ、未知のデータへの予測がうまくいかない状態を、過学習（overfitting）と呼びます。</strong></p>
   <p>上のように練習用だけが改善し、確認用が悪くなる動きは、過学習を疑う手がかりです。長く学習すれば必ず起こるわけではありません。使えるデータ量、揺れ、モデルの複雑さなどによって変わります。ニューラルネットワーク以外でも起こります。</p>
   <p>反対に、練習用にも十分に合っていなければ、学習不足やモデルが単純すぎる可能性を考えます。これを<strong>アンダーフィッティング（underfitting、適合不足）</strong>と呼びます。目標は、まだ使っていないデータにも予測が通用することです。この性質が<strong>汎化</strong>です。</p>
  </Section>
  <Section title="では、何を見て、どう直す？">
   <ol className="exercise-list"><li><strong>最初にデータを分ける。</strong>重みを学ぶ「学習用」、途中の選択に使う「検証用」、最後の評価に残す「テスト用」です。上の練習用・確認用・試験用に対応します。</li><li><strong>学習用と検証用を、同じ図で追う。</strong>検証用が悪くなるのに学習用だけよくなるなら、続ける前に設定を見直します。一度の上下だけで決めつけません。</li><li><strong>よかった時点の重みを保存し、学習を止める。</strong>検証用が一定期間改善しなければ止める方法が、早期終了（early stopping）です。上の比較なら、3000回より75回時点の損失が小さかったと読めます。</li><li><strong>モデルの複雑さやデータを見直す。</strong>中間層の部品を減らす、重みが大きくなりすぎないよう損失に罰則を加える「正則化」、実際に使う条件に合うデータを増やす、といった方法を検証します。</li><li><strong>選択を終えたら、残したテスト用で一度評価する。</strong>検証用を見て設定を選んだので、それとは別の答え合わせが必要です。この図では、テスト用40件の成績はまだ計算していません。</li></ol>
   <p>同じ人の繰り返し記録が両方に入る場合や、過去から未来を予測する場合は、人ごと・時期ごとに分けるなど、実際の使い方に合わせます。</p>
   <details><summary>同じ例を、自分のPythonで確認する</summary><p>入力2個・中間層16個・出力1個のネットワークです。中間層はtanh（−1〜1に変換する関数）、出力はシグモイド関数。更新には歩幅を調整するAdamを使います。揺れに合わせすぎる例を観察するため、重みへの罰則は0にしています。標準化の平均・標準偏差も学習用だけから求めます。</p><div className="download-row"><a href={`${base}data/ai/overfitting.csv`} download>入力CSVを保存 ↓</a><a href={`${base}data/ai/overfitting.py`} download>Pythonコードを保存 ↓</a><a href={`${base}data/ai/overfitting-history.csv`} download>学習経過のCSV ↓</a></div><LocalPythonCommands packages="numpy pandas scikit-learn" filename="overfitting.py"/><pre className="code-block"><code>{example.output}</code></pre><p>乱数とデータの分け方を固定した教材用の一例です。「75回がどのデータでも最適」という意味ではありません。実行環境によって細部は変わる場合があります。</p></details>
  </Section>
 </>;
}
