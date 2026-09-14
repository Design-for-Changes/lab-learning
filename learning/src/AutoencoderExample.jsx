import { useState } from 'react';
import example from './autoencoderExample.json';
import { LocalPythonCommands } from './LocalPythonCommands.jsx';

function Digit({values,label}){return <svg className="ae-digit" viewBox="0 0 80 80" role="img" aria-label={label}>{values.map((value,i)=>{const shade=Math.round(255*Math.max(0,Math.min(1,value)));return <rect key={i} x={i%8*10} y={Math.floor(i/8)*10} width="10" height="10" fill={`rgb(${shade},${shade},${shade})`}/>;})}</svg>;}

export default function AutoencoderExample(){
 const [index,setIndex]=useState(0),sample=example.samples[index];
 return <div className="explorer ae-example">
  <h3>実際に、画像を元に戻してみると</h3>
  <p>数字の正解ラベルを使わず、{example.trainCount}枚で学習したモデルです。下の3枚は、学習に使わなかった画像です。元の形と、戻した形を比べてください。</p>
  <div className="segmented" role="group" aria-label="オートエンコーダへ入れる画像">{example.samples.map((_,i)=><button key={i} aria-pressed={i===index} onClick={()=>setIndex(i)}>画像{i+1}</button>)}</div>
  <div className="ae-example-flow" aria-live="polite">
   <div><h4>入力した画像</h4><Digit values={sample.input} label={`画像${index+1}：入力した8×8の手書き画像`}/><p>明るさを表す64個の数</p></div>
   <div className="ae-code"><h4>途中で渡す情報</h4><strong>16個の数</strong><p>［{sample.code.slice(0,3).map(v=>v.toFixed(2)).join('，')}，…］</p><p>この数から形を戻す</p></div>
   <div><h4>復元した画像</h4><Digit values={sample.restored} label={`画像${index+1}：16個の数から復元した8×8の画像`}/><p>再び64個の明るさへ</p></div>
  </div>
  <p>線の位置や形がどのくらい残っていますか。元画像とぴったり同じには戻っていません。<strong>この出力は「何の数字か」という答えではなく、作り直した画像です。</strong>ボタンは表示する画像を切り替えます。</p>
  <details><summary>自分のPythonで学習して、画像を比べる</summary>
   <p>ライブラリに含まれる手書き画像を使うので、自分で画像を集める必要はありません。次のコードは、入力画像そのものをお手本にして学習します。</p>
   <pre className="code-block"><code>{'model.fit(train, train)  # 入力と、復元のお手本は同じ画像\nrestored = model.predict(test)  # 別の画像で確かめる'}</code></pre>
   <div className="download-row"><a href={`${import.meta.env.BASE_URL}data/ai/autoencoder.py`} download>オートエンコーダのPythonコード ↓</a></div>
   <LocalPythonCommands packages="numpy scikit-learn matplotlib" filename="autoencoder.py"/>
   <p>実行すると、元画像と復元画像を並べた<code>autoencoder-result.png</code>と、途中の数などを記録した<code>autoencoder-result.json</code>ができます。</p>
   <p>この実行例では、評価用{example.testCount}枚の平均二乗誤差は{example.testMSE.toFixed(4)}でした。各画素の差を二乗し、全画像で平均した値です。常に学習用の平均画像を返すだけの基準は{example.baselineMSE.toFixed(4)}。この基準より小さくなりましたが、数字の分類精度を測った値ではありません。</p>
   <p>学習と評価は画像単位で分けています。同じ人の筆跡かどうかは分けていないので、「初めて見る人の字でも同じ性能」とまでは確認していません。表示したのは評価用の先頭3枚で、復元の良さでは選んでいません。</p>
   <p>構造は64入力・中間16・64出力。中間層はReLU、出力層は線形です。表示の濃さだけ0〜1に収め、誤差は補正前の値で計算しています。実行環境：scikit-learn {example.sklearnVersion}、NumPy {example.numpyVersion}。環境によって結果に小さな違いが出ることがあります。</p>
  </details>
 </div>;
}
