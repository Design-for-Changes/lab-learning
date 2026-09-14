import PageLink from './PageLink.jsx';
import { useState } from 'react';
import { Section,Prompt,Sources } from './Common.jsx';
import examples from './aiExampleResults.json';
import { xorData } from './aiMath.js';

const base=import.meta.env.BASE_URL;
const example=examples.xor;
function Table({head,rows}){return <>{head.length>4&&<p className="practice-table-hint">表を横にスクロールすると、答え合わせまで読めます。</p>}<div className={`table-scroll architecture-table ${head.length>4?'practice-results-table':''}`}><table className="data-table"><thead><tr>{head.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></>;}
const outputRows=probabilities=>xorData.map(([a,b,y],i)=>[a,b,y,probabilities[i].toFixed(6),probabilities[i]>=.5?1:0,(probabilities[i]>=.5?1:0)===y?'○ 正解':'× 間違い']);

function LearningResults(){
 const [index,setIndex]=useState(0),snapshot=example.snapshots[index],history=example.history[index];
 return <div className="explorer">
  <h3>同じ4問への答えが、どう変わったか</h3>
  <p>Pythonで計算した記録です。ボタンで学習の途中を見比べます。ここでは、ブラウザー上で新しく学習を実行しているわけではありません。</p>
  <div className="segmented" role="group" aria-label="XORの学習結果を比較">{example.snapshots.map((row,i)=><button key={row.step} aria-pressed={index===i} onClick={()=>setIndex(i)}>{row.step===0?'学習前':`${row.step}回後`}</button>)}</div>
  <p aria-live="polite"><strong>{snapshot.step}回：4問中{history['正解数']}問正解。平均損失は{history['平均損失'].toFixed(4)}。</strong></p>
  <Table head={['x1','x2','正解 y','出力 p','判定','答え合わせ']} rows={outputRows(snapshot.probabilities)}/>
  <p>変わったのは、ネットワークの重みと、それによって出た予測です。<strong>入力の4問と正解は、途中で変えていません。</strong></p>
 </div>;
}

export default function AiPracticeLesson(){return <>
 <Section title="この章は、05の学習を自分のPCで確かめる実験">
  <p>05では、画面のボタンでニューラルネットワークを学習させました。ここでは<strong>同じXORの4通りを、自分のPCのPythonで学習させます。</strong>確かめたいのは、「重みを直す前と後で、答えがどう変わるか」です。</p>
  <p>自分ですべてのコードを書ける必要はありません。まず用意されたコードを動かし、<strong>何を覚えさせたか → 何が出てきたか → できるようになったか</strong>を説明できるようになりましょう。</p>
  <div className="note"><p><strong>今回の実験</strong><br/>二つのスイッチのうち、片方だけがONならランプを点ける。この4通りの例から、ニューラルネットワークに答え方を学ばせる。</p></div>
 </Section>
 <Section title="1．覚えさせたい4通りを、表にする">
  <p>スイッチはOFFを0、ONを1。ランプも消灯を0、点灯を1にします。片方だけONなら点灯するルールが、01・04で扱った<strong>XOR（排他的論理和）</strong>です。</p>
  <Table head={['スイッチA：x1','スイッチB：x2','ランプの正解：y','ルールの読み方']} rows={[
   [0,0,0,'両方OFFなので、消灯'],[0,1,1,'BだけONなので、点灯'],[1,0,1,'AだけONなので、点灯'],[1,1,0,'両方ONなので、消灯'],
  ]}/>
  <p>一行が一問です。<code>x1</code>と<code>x2</code>を入力し、点灯するかを予測させます。<code>y</code>は答え合わせに使う正解で、予測するときの入力には混ぜません。</p>
  <p>この表を、カンマで列を区切る<strong>CSVファイル</strong>にしたものが<code>xor.csv</code>です。中身は次の5行。先頭は列の名前、その下の4行が問題と正解です。</p>
  <pre className="code-block"><code>{'x1,x2,y\n0,0,0\n0,1,1\n1,0,1\n1,1,0'}</code></pre>
 </Section>
 <Section title="2．コンピューターには、何をさせる？">
  <p>人ならこの表からルールを読めます。今回は、そのルールを条件分岐で直接プログラムに書く代わりに、<strong>4問の答え合わせを繰り返して、重みを調整させます。</strong></p>
  <ol className="exercise-list"><li><strong>4問を読み込む。</strong>入力の二つの列と、答え合わせ用の列に分ける。</li><li><strong>05と同じネットワークを用意する。</strong>入力2個 → 隠れ層のニューロン2個 → 出力1個。最初の重みも05と同じにする。</li><li><strong>今の重みで答える。</strong>出力は「ランプを点ける確率」の予測値。</li><li><strong>正解と比べ、重みを少し直す。</strong>05の順伝播・損失・誤差逆伝播・更新を繰り返す。</li><li><strong>途中の成績と、最後の4問への答えを表示する。</strong>その結果を自分で読む。</li></ol>
  <p>この手順を書いた<strong>Pythonコードのファイル</strong>が<code>xor.py</code>です。<strong>CSVは教材となるデータ、.pyは計算させる手順</strong>という役割の違いがあります。</p>
 </Section>
 <Section title="3．二つのファイルを保存して、実行する">
  <ol className="exercise-list"><li>自分のPCに、<code>nn-practice</code>というフォルダーを作る。</li><li>下の二つを保存し、どちらもそのフォルダーへ入れる。</li><li>そのフォルダーを開いたターミナルで、下の命令を実行する。</li></ol>
  <div className="download-row"><PageLink href={`${base}data/ai/xor.csv`} download>① 問題と正解：xor.csv ↓</PageLink><PageLink href={`${base}data/ai/xor.py`} download>② 学習の手順：xor.py ↓</PageLink></div>
  <pre className="code-block"><code>{'nn-practice/\n  xor.csv   ← 4問と正解\n  xor.py    ← 学習させる手順'}</code></pre>
  <p><strong>ターミナル</strong>は、文字でPCに命令を出す画面です。研究室で設定したPython環境を使います。普段VS Codeを使っているなら、上のフォルダーを開き、「ターミナル」から「新しいターミナル」を開けます。</p>
  <details><summary>ターミナルで保存先のフォルダーへ移動するには</summary><p><code>cd</code>は、作業するフォルダーを変える命令です。次の引用符の中を、実際の<code>nn-practice</code>フォルダーの場所に置き換えます。</p><pre className="code-block"><code>{'cd "nn-practiceフォルダーの実際のパス"'}</code></pre><p>Macなら例として<code>/Users/自分のユーザー名/Downloads/nn-practice</code>、Windowsなら<code>C:\Users\自分のユーザー名\Downloads\nn-practice</code>のような場所です。保存先が違えば、その場所を使います。</p></details>
  <p>コードは、表を読む<strong>pandas</strong>と、行列を計算する<strong>NumPy</strong>を使います。まだ入っていなければ、先に次を実行します。</p>
  <pre className="code-block"><code>python -m pip install numpy pandas</code></pre>
  <p>続いて、次の命令を入力してEnterを押します。これはPythonに「<code>xor.py</code>に書かれた手順を実行して」と伝える命令です。</p>
  <pre className="code-block"><code>python xor.py</code></pre>
  <p>この2行は<strong>ターミナルに入力する命令</strong>です。<code>xor.py</code>の中には書きません。普段<code>python3</code>や<code>py</code>で起動しているなら、両方の命令の<code>python</code>を同じように置き換えます。</p>
  <p>実行すると、ターミナルに<strong>［1］読み込んだ問題 → ［2］学習の途中経過 → ［3］学習後の答え合わせ</strong>が表示されます。入力したCSVは、そのまま残ります。</p>
  <details><summary>エラーが出たとき、まず確認するところ</summary><Table head={['表示された内容','確認すること']} rows={[
   ['xor.py が見つからない','ターミナルで開いている場所に xor.py があるか。'],
   ['xor.csv が見つからない','xor.py と xor.csv を同じフォルダーに入れたか。'],
   ['No module named numpy / pandas','実行に使うPythonで、上のライブラリの準備をしたか。'],
  ]}/><p>解決しなければ、エラー全文と実行した命令をAIに渡してください。結果の数字が表示される前に止まった場合は、学習の成績を判断する段階にはまだ進んでいません。</p></details>
 </Section>
 <Section title="4．最後の表を見て、4問を答え合わせする">
  <p>最初は、出力の<strong>［3］学習後の答え合わせ</strong>を見ます。5000回更新した、この教材の実行結果は次のとおりです。</p>
  <Table head={['入力 x1','入力 x2','正解 y','出力 p','判定 prediction','答え合わせ']} rows={outputRows(example.probabilities)}/>
  <p><code>p</code>は、ネットワークが「点灯する＝1」と予測した確率です。<strong>0.5以上なら1、0.5未満なら0</strong>と判定し、その答えを<code>prediction</code>に表示します。</p>
  <p>例えば入力［0，1］の行では、<code>p</code>は約0.998なので判定は1。正解<code>y</code>も1なので合っています。入力［0，0］は約0.002なので判定は0。こちらも正解と一致します。</p>
  <p><strong>自分の画面でも、predictionとyを一行ずつ比べてください。</strong>4行とも一致していたら、今回の4問は答えられるようになっています。小数点以下の細部は、実行環境で少し変わることがあります。</p>
 </Section>
 <Section title="5．学習前と後で、何が変わった？">
  <p>次に、出力の<strong>［2］学習の途中経過</strong>へ戻ります。更新回数0は、重みをまだ一度も直していない状態です。</p>
  <Table head={['更新回数','平均損失','4問中の正解数']} rows={example.history.map(r=>[r['更新回数'],r['平均損失'].toFixed(6),r['正解数']])}/>
  <p><strong>正解数</strong>は、判定が正解と一致した件数。<strong>平均損失</strong>は、05で見た予測の外れ方を4問で平均した値で、小さいほどこの4問の正解に合っています。例えば、1が正解なのに低い確率を付けると、大きい損失になります。</p>
  <LearningResults/>
  <p>100回では2問正解、1000回では4問正解になりました。1000回と5000回はどちらも4問正解ですが、5000回のほうが損失は小さくなっています。<strong>同じ正解数でも、出している確率は違う</strong>と読めます。</p>
 </Section>
 <Section title="6．自分で実験：100回で止めたらどうなる？">
  <p>今度は、学習する回数だけを変えてみます。実行前に、「4問のうち何問くらい合いそうか」を考えてください。</p>
  <ol className="exercise-list"><li><code>xor.py</code>をエディタで開く。</li><li>上のほうにある<code>UPDATES = 5000</code>を、<code>UPDATES = 100</code>へ変える。</li><li>保存し、ターミナルで再び<code>python xor.py</code>を実行する。</li><li>最後の正解数と平均損失を、5000回のときと比べる。</li></ol>
  <pre className="code-block"><code>{'UPDATES = 100  # まず、この数字だけを変える'}</code></pre>
  <p>このコードは、実行するたびに同じ最初の重みから始めます。5000回の続きを100回学ぶわけではありません。入力CSV、ネットワークの形、学習率はそろえて、<strong>回数を変えた影響だけ</strong>を見ます。</p>
  <details><summary>この設定で得られる結果と、考えること</summary><p>100回では4問中2問正解、平均損失は約0.6933。5000回では4問中4問正解、平均損失は約0.0022です。この設定では、100回から学習を進めると、この4問に合うようになりました。05の過学習の話と区別し、「どんなデータでも長く学ぶほどよい」と広げないことが大切です。</p></details>
 </Section>
 <Section title="7．何が分かったかを、自分の言葉でまとめる">
  <p>実行できたことに加えて、入力・結果・そこから言えることを書きます。例えば、今回なら次のようにまとめられます。</p>
  <div className="note"><p>XORの4通りの入力と正解を使い、入力2個・隠れ層2個・出力1個のニューラルネットワークを学習させた。同じ初期値から100回と5000回の更新を比べた。正解数は2問から4問へ増え、平均損失も小さくなった。この設定では、重みの更新によって4通りのルールに合う予測を得られた。</p><p><strong>ただし、4通りすべてを学習に使っている。学習に使わないデータへの予測性能を評価した実験ではない。</strong></p></div>
  <p>このXORでは、0/1の入力の組み合わせを全部練習しています。写真や実験データを扱うなら、まだ見ていないデータにも通用するかが次の課題です。そのために、05で見た学習用・検証用・テスト用の分け方を使います。</p>
  <details><summary>AIにコードの変更を頼むときの例</summary><Prompt title="実験の目的を保ったまま、コードを変える" text={'XORの4通りを学習する添付のxor.pyを修正してください。\n入力はxor.csvのx1・x2、正解はyです。正解yを予測時の入力に混ぜないでください。\n確かめたいこと：学習回数を100回と5000回に変えると、4問への答えがどう変わるか。\nネットワークの構造・初期値・学習率は同じにし、各実験を同じ初期値から始めてください。\n各回数の平均損失、入力ごとの予測確率、判定、正解との一致を表示してください。\n変更した箇所と実行方法を説明してください。今回の4問への成績と、未知のデータへの性能を区別してください。'}/></details>
  <details><summary>コードの各部分を、05の手順と対応させる</summary><p>コードのコメント1〜7は、このページの「コンピューターにさせること」に対応します。<code>@</code>は行列の掛け算。コードを読むときは、まず「予測する部分」「正解と比べる部分」「重みを変える部分」を探してください。</p><pre className="code-block"><code>{example.code}</code></pre></details>
 </Section>
 <Section title="次は、入力や目的が変わったら？">
  <p>この実験で動かしたのは、二つの数から0・1を答える小さなネットワークでした。次に手書きの数字を読み取りたいとしたら、入力は画像になり、答えは0〜9になります。</p>
  <p>画像の中の近いマスをまとめて調べたい。正解ラベルのない画像も使いたい。さらに、文章を読んだり、新しい画像を作ったりしたい。<strong>基本の計算を、何のためにどう変えるか</strong>を、07で考えます。</p>
 </Section>
 <Sources links={[["Deep Learning：順伝播型ニューラルネットワーク","https://www.deeplearningbook.org/contents/mlp.html"],["scikit-learn：学習用と評価用を分ける理由","https://scikit-learn.org/stable/modules/cross_validation.html"]]}/>
 </>;}
