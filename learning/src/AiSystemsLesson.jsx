import { useState } from 'react';
import { Section, Sources } from './Common.jsx';
import { SmallTable } from './ArchitectureExplorers.jsx';
import { LocalPythonCommands } from './LocalPythonCommands.jsx';
import './aiSystems.css';

const observations = [10, 12, 14];
const average = observations.reduce((sum, n) => sum + n, 0) / observations.length;
const stages = [
 { role: '利用者', title: '① やってほしいことを伝える', body: '「10秒・12秒・14秒の平均を計算して」', detail: '質問だけでなく、使ってよい計算ツールの説明もモデルへ渡します。', active: 'context' },
 { role: 'モデル', title: '② 計算ツールを使う要求を出す', body: 'ツール名：mean ／ 渡す値：[10, 12, 14]', detail: 'モデルからは、ツールの名前と引数（渡すデータ）が出ます。この時点では、ツールの計算はまだ実行していません。', active: 'model' },
 { role: 'ハーネス', title: '③ 要求を確かめ、ツールへ渡す', body: 'meanは使ってよい？ 値は数のリスト？', detail: '許可したツールか、入力の形式が合うかを確認し、実行します。使えないツールを要求したら、実行せずに扱います。', active: 'harness' },
 { role: '計算ツール', title: '④ 決められた計算を実行する', body: `（10＋12＋14）÷3＝${average}`, detail: '平均を求めるプログラムが計算し、結果を返します。ここは、言葉の続きを予測する計算とは別です。', active: 'tool' },
 { role: 'ハーネス', title: '⑤ 結果を加えて、モデルをもう一度呼ぶ', body: `最初の質問 ＋ ツールの要求 ＋ 結果 ${average}`, detail: '何を頼んで、何が返ったかを文脈に加えます。モデルは、その結果を見て次の出力を作れます。', active: 'context' },
 { role: 'モデル', title: '⑥ 結果を説明して、利用者へ返す', body: `「平均は${average}秒です。合計36秒を、データの個数3で割りました。」`, detail: 'この例では回答して終了します。まだ情報が足りなければ、別のツールを要求して②へ戻る場合もあります。', active: 'model' },
];

function HarnessDiagram() {
 const [step, setStep] = useState(0);
 const current = stages[step];
 return <div className="explorer systems-visual">
  <h3>平均を返すまでを、一手ずつ見る</h3>
  <p>これはツールを使う手順の説明用デモです。モデルの応答は例として用意し、平均だけは表示した数から計算しています。</p>
  <div className="segmented" role="group" aria-label="ハーネスの処理を進める"><button disabled={step === 0} onClick={() => setStep(s => s - 1)}>一つ前へ</button><button disabled={step === stages.length - 1} onClick={() => setStep(s => s + 1)}>次の処理へ</button><button onClick={() => setStep(0)}>最初から見る</button></div>
  <figure>
   <div className="harness-boundary" data-active={current.active}>
    <strong className="harness-boundary-label">ハーネス：全体の実行を管理</strong>
    <div className="harness-context"><strong>モデルに渡す文脈</strong><span>質問・ルール・ツールの説明{step >= 4 ? '・計算結果12' : ''}</span></div>
    <div className="harness-down" aria-hidden="true">↓ モデルへ渡す</div>
    <div className="harness-loop"><div className="harness-model"><strong>言語モデル</strong><span>回答や、ツールの要求を作る</span></div><div className="harness-exchange"><span>要求 →</span><span>← 結果</span></div><div className="harness-tool"><strong>計算ツール</strong><span>平均などの計算を実行する</span></div></div>
    <p className="harness-return">↖ ツールの結果は文脈に加え、モデルへ渡し直す</p>
   </div>
   <figcaption>枠全体がハーネスの担当範囲。色の付いた部分が、今の手順で注目するところです。</figcaption>
  </figure>
  <div className="harness-current" aria-live="polite"><span>{step + 1} / {stages.length}　担当：{current.role}</span><h4>{current.title}</h4><p><strong>{current.body}</strong></p><p>{current.detail}</p></div>
  <details><summary>ここまでに、何が記録された？</summary><ol className="harness-log">{stages.slice(0, step + 1).map(stage => <li key={stage.title}><strong>{stage.role}</strong>：{stage.body}</li>)}</ol></details>
 </div>;
}

export default function AiSystemsLesson() {
 return <>
  <Section title="学んだモデルを、どう動かして仕事をさせる？">
   <p><a href="#/ai">人工知能学習入門</a>では、ニューラルネットワークの仕組みと、重みを学習する方法を扱いました。この<strong>AI入門</strong>では、その続きとして、学習済みモデルで作業を進める仕組みを学びます。</p>
   <p>AIが「資料を読む」「計算する」「結果を確かめる」と動くのは、どういう仕組みでしょうか。文章を扱う<strong>大規模言語モデル（Large Language Model：LLM）</strong>を使ったAIを例に、モデルの計算と、それを動かす周りのプログラムを順に見ます。</p>
   <div className="systems-pair"><div><strong>モデルの中</strong><span>入力をベクトルにし、学習した重みで計算して、次の出力を作る。</span></div><div><strong>モデルの周り</strong><span>何を入力し、どのツールを動かし、結果をどう渡し、いつ終えるかを管理する。</span></div></div>
  </Section>
  <Section title="文章は、一度に全部出てくるわけではない">
   <p>文章を生成する言語モデルでは、<strong>今までの入力と出力から、次のトークンの候補に点数を付け、確率へ直します。</strong>そこから一つを選び、続きに加えて、また次を計算します。</p>
   <figure className="systems-figure"><ol className="systems-route"><li><strong>ここまでの文</strong><span>「今日は」</span></li><li><strong>候補の確率を計算</strong><span>晴れ 60% ／ 雨 30% ／ 雪 10%</span></li><li><strong>一つ選んで加える</strong><span>今回は「晴れ」を選ぶ<br/>「今日は晴れ」</span></li><li><strong>新しい続きから、次を計算</strong><span>「です」など、次の候補へ</span></li></ol><figcaption>数値と単位の分け方は説明用です。実際のトークンは単語より細かい場合もあり、選び方も設定によって変わります。</figcaption></figure>
   <p>この、既にある出力を次の計算に使う生成を<strong>自己回帰的な生成</strong>と呼びます。終了を表すトークンや、長さの上限などで止めます。</p>
   <p>ここでの<strong>推論</strong>は、学習済みの重みを使って出力を求めることです。通常の文章生成では、一語出すたびに重みを学習し直しているわけではありません。</p>
  </Section>
  <Section title="「計算します」と出力しただけでは、計算ツールは動かない">
   <p>例えば「10秒・12秒・14秒の平均を計算して」と頼みます。モデルが文章として答える方法もありますが、<strong>計算用のプログラムに数を渡し、その結果を使って答える</strong>方法もあります。</p>
   <p>モデルに使える道具を伝えておくと、「meanという道具に、この3個の数を渡したい」という要求を出せます。これが<strong>ツール呼び出し（tool calling）</strong>です。関数を呼ぶ場合は<strong>関数呼び出し（function calling）</strong>とも呼ばれます。</p>
   <p>その要求を受け取って実際に道具を動かし、結果を渡し直す役が必要です。こうした<strong>モデルの周りの実行を管理する仕組み</strong>を、ここでは<strong>ハーネス（harness）</strong>と呼びます。CNNのようなニューラルネットワークの構造名ではありません。</p>
   <HarnessDiagram/>
   <p>道具を検索に替えれば、検索結果を材料にして答えられます。ファイルを読む道具なら、読み取った内容が次の入力に加わります。<strong>道具から実際に何が返ったか</strong>が、次の出力を作る材料になります。</p>
  </Section>
  <Section title="ハーネスは、何を管理している？">
   <p>モデルを何度も呼ぶだけでは、途中の結果が抜けたり、同じ失敗を繰り返したりすることがあります。そこで、モデルに渡す情報と、実行の進め方を管理します。製品によってハーネスに含める範囲は違いますが、代表的な仕事は次の通りです。</p>
   <SmallTable head={['管理するもの', '平均を求める例なら']} rows={[
    ['入力する文脈', '質問、単位、使える道具、これまでの結果をそろえて渡す'],
    ['道具の実行', 'meanという道具を呼び、数のリストを渡す'],
    ['権限と入力の確認', '使ってよい道具か、引数が正しい形式かを確かめる'],
    ['途中の結果と記録', '計算結果12が返ったことを記録し、次の呼び出しへ渡す'],
    ['失敗したときの扱い', '数でない値が入ったら、修正を求めるか処理を止める'],
    ['終了の条件', '回答ができたら終える。繰り返し回数や時間にも上限を設ける'],
   ]}/>
   <p>モデル自身が、結果を見ながら次の道具や手順を選んで進む構成は、<strong>AIエージェント</strong>と呼ばれます。決めておいた順番でモデルや道具を呼ぶ構成は<strong>ワークフロー</strong>と呼ばれます。どちらにも、実行を支える周りの仕組みが必要です。</p>
  </Section>
  <Section title="会話の続きや資料は、どこに入る？">
   <p>モデルが出力を作るために参照する、指示・会話・資料・道具の結果などが<strong>コンテキスト（文脈）</strong>です。一度の処理で扱える量には上限があり、その範囲を<strong>コンテキストウィンドウ</strong>と呼びます。</p>
   <div className="context-bundle"><strong>今回、モデルが参照する材料</strong><div><span>利用者の依頼</span><span>守るルール</span><span>必要な会話履歴</span><span>資料の抜粋</span><span>道具の実行結果</span></div><p>↓ これらを使って、次の出力を計算する</p></div>
   <p>長い作業では、ハーネスが途中の状態を保存したり、古い履歴を要約したり、必要な記録を読み直したりします。前の会話を覚えているように見える場合も、こうして<strong>情報を次の入力へ引き継ぐ仕組み</strong>が働いています。</p>
   <h3>資料を渡すことと、追加学習することは違う</h3>
   <p>質問に関係する資料を検索し、その内容を入力へ加えて回答を作る方法が<strong>検索拡張生成（Retrieval-Augmented Generation：RAG）</strong>です。例えば、研究室の測定手順から該当箇所を取り出し、それを見ながら説明させます。</p>
   <SmallTable head={['すること', 'どこが変わる？']} rows={[
    ['会話履歴や道具の結果を渡す', '今回、モデルが参照する文脈'],
    ['RAGで資料を検索して渡す', '今回、モデルが参照する文脈'],
    ['ファインチューニングを行う', 'モデルの学習する重み'],
   ]}/>
   <p>資料を文脈へ追加する段階では、通常、重みは変えません。資料の選び方を間違えたり、大事な条件が要約で抜けたりすれば、答えも影響を受けます。</p>
   <p>重みを変える学習については、<a href="#/ai/pretrained">人工知能学習入門の08「転移学習・知識蒸留」</a>で確認できます。</p>
  </Section>
  <Section title="Pythonで、周りのプログラムの役を確かめる">
   <p>下の例では、モデルが出すツールの要求を用意しておき、<strong>要求を受け取る→平均を計算する→結果を記録する→次の応答へ渡す</strong>処理を、自分のPCで動かします。実際の言語モデルには接続せず、ハーネス側の仕事に注目する練習です。</p>
   <div className="download-row"><a href={`${import.meta.env.BASE_URL}data/ai/harness_demo.py`} download>ハーネスの練習用Pythonコード ↓</a></div>
   <LocalPythonCommands filename="harness_demo.py"/>
   <p>追加のライブラリは不要です。保存したファイルを実行すると、次の順番で表示されます。</p>
   <pre className="code-block"><code>{'[1] 利用者：10秒・12秒・14秒の平均を計算して\n[2] 模擬モデルの要求：mean([10, 12, 14])\n[3] ハーネス：許可したツールと入力を確認\n[4] 計算ツールの結果：12.0\n[5] ハーネス：結果を履歴へ追加\n[6] 模擬モデルの回答：平均は12.0秒です。'}</code></pre>
   <p>出力の[2]と[4]を見比べてください。<strong>「何を呼ぶか」という要求と、「実行して得た値」は別のもの</strong>です。実際のAIを使う場合は、用意した模擬応答の部分を、言語モデルの呼び出しへ置き換えます。</p>
  </Section>
  <Section title="例題：計算を間違えたとき、どこを調べる？">
   <p>利用者は「10・12・14の平均」を頼みました。ところが記録を見ると、モデルはツールに<strong>［10，12，140］</strong>を渡し、ツールは<strong>54</strong>を返しています。</p>
   <p>計算ツールを直すべきでしょうか。それとも、ほかに調べる場所があるでしょうか。</p>
   <details><summary>計算と考察を読む</summary><p>ツールは（10＋12＋140）÷3＝54と正しく計算しています。間違っているのは、<strong>ツールへ渡した値</strong>です。元の依頼と、モデルが作った引数を照合します。</p><p>ハーネスが「数のリストか」だけを確かめても、140が依頼の14と違うことまでは見つかりません。必要に応じて、読み取った元データとの照合を組み込みます。さらに、返った値をモデルが正しく文章にしたかも確認します。</p></details>
   <p>「AIの答えが違った」で終わらせず、<strong>入力した情報、モデルの出力、道具へ渡した値、実行結果、最後の説明</strong>を分けて追えることが、この章の到達点です。</p>
  </Section>
  <Sources links={[
   ['Transformerの原論文：生成とベクトル表現', 'https://arxiv.org/html/1706.03762v7'],
   ['OpenAI：ツール呼び出しの実行手順', 'https://developers.openai.com/api/docs/guides/function-calling'],
   ['Anthropic：ワークフローとAIエージェント', 'https://www.anthropic.com/engineering/building-effective-agents'],
   ['Anthropic：長い作業を支えるハーネス', 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents'],
   ['検索拡張生成（RAG）の原論文', 'https://arxiv.org/abs/2005.11401'],
  ]}/>
 </>;
}
