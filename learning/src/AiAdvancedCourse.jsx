import DataTable from './DataTable.jsx';
import { useState } from 'react';
import { Section,Sources } from './Common.jsx';
import { distillationTeacher,distillationStudents,relativeEntropy } from './aiOverviewMath.js';

function Table({head,rows,className=''}) { return <DataTable headings={head} rows={rows} scrollClassName={`table-scroll ${className}`}/>; }
function Flow({steps,label}){return <ol className="ai-flow" aria-label={label}>{steps.map(([title,body])=><li key={title}><strong>{title}</strong><span>{body}</span></li>)}</ol>;}
function Check({question,answer}){return <div className="note"><h3>ここまで分かればよい</h3><p>{question}</p><details><summary>答えを確認する</summary><p>{answer}</p></details></div>;}

export { default as Architectures } from './AiArchitecturesLesson.jsx';

function DistillationExplorer(){const [selected,setSelected]=useState(0),student=distillationStudents[selected];return <div className="explorer"><h3>「正解は椅子」だけでは、同じに見える二つの出力</h3><p>ある写真に対する仮の予測値です。先生も生徒も、椅子・スツール・机の3種類に確率を付けます。生徒の二つの出力を切り替えてみてください。これは説明用の比較で、ボタンで学習を実行しているわけではありません。</p><div className="segmented" role="group" aria-label="生徒の出力を比較">{['生徒の出力A','生徒の出力B'].map((name,i)=><button key={name} aria-pressed={i===selected} onClick={()=>setSelected(i)}>{name}</button>)}</div><Table className="ai-distillation-table" head={['種類','正解','先生','生徒']} rows={['椅子','スツール','机'].map((name,i)=>[name,i===0?1:0,`${distillationTeacher[i]*100}%`,`${student[i]*100}%`])}/><p aria-live="polite">どちらの生徒も「椅子70%」。正解の椅子に付けた確率だけなら同じです。<strong>{selected===0?'出力Aは先生より机に高い確率を付けています。':'出力Bはスツールと机の割合も先生と一致しています。'}</strong></p><p>確率の並びをお手本にすると、「先生は机よりスツールに近いと予測した」という情報も使えます。この柔らかい目標を<strong>ソフトターゲット</strong>と呼びます。</p><details><summary>確率の並びの違いを、一つの数で測ると？</summary><p>一例が<strong>カルバック・ライブラー情報量（KLダイバージェンス）</strong>です。先生の確率tと生徒の確率sから、Σ t log(t/s)で計算します。今は<strong>{relativeEntropy(distillationTeacher,student).toFixed(3)}</strong>。出力Bでは0になります。蒸留では、この違いを小さくする損失と、実際の正解に合わせる損失を組み合わせる方法があります。</p></details></div>;}

export function PretrainedModels(){return <>
 <p className="lede">写真の特徴を既に学んだモデルがあるなら、その経験を利用できます。ここでは「既存モデルを自分の課題に合わせる」と「別の小さなモデルへ学びを渡す」を、具体例で区別します。</p>
 <Section title="写真を見分ける力を、自分の課題に使いたい">
  <p>いろいろな物の写真を学んだモデルで、研究室にある椅子の種類を分類したいとします。入力の大きさなどを合わせ、まず現状でどこまでできるか確認します。そのまま使って答えを出す段階は<strong>推論</strong>で、重みを変更する学習とは区別します。</p>
  <p>元の課題で学んだ特徴などを、別の課題に利用するのが<strong>転移学習（transfer learning）</strong>です。例えば、画像から特徴を取り出す部分を固定し、最後の分類部分を自分の椅子の種類に合わせて学習します。</p>
  <Flow label="転移学習の例" steps={[["学習済みモデル","写真から特徴を取り出す部分"],["自分のデータ","椅子の写真と、種類の正解"],["分類部分を学習","自分の分類先に合わせる"],["別の写真で評価","撮影に使っていない個体でも通用するか"]]}/>
  <p>さらに、既に学習された重みの一部または全体も追加のデータで調整することを<strong>ファインチューニング（fine-tuning）</strong>と呼びます。少量のデータで強く変えすぎると、元の能力を崩したり、05の過学習を起こしたりするため、検証用で確かめます。</p>
  <Check question="学習済みモデルを読み込み、写真を入力しただけでファインチューニングしたことになる？" answer="なりません。重みを変更せず出力を求めたなら推論です。追加のデータを使って既存の重みを調整したときに、ファインチューニングになります。"/>
 </Section>
 <Section title="大きなモデルの答え方を、小さなモデルへ渡したい">
  <p>よく当たるモデルがあっても、動かすのが重く、手元の機器では待ち時間やメモリが問題になることがあります。そこで、そのモデルの出力をお手本に、別の小さなモデルを学ばせる方法を考えます。</p>
  <Flow label="知識蒸留の例" steps={[["同じ写真を入力","先生と生徒の両方へ渡す"],["先生の出力を保存","先生の重みは固定"],["生徒の重みを調整","先生の出力や正解に近づける"],["生徒だけで評価・利用","精度、速度、メモリを測る"]]}/>
  <p>この学び方が<strong>知識蒸留（knowledge distillation）</strong>です。お手本を出すのが<strong>教師モデル</strong>、学ぶのが<strong>生徒モデル</strong>。単に重みのファイルを小さく保存するのではなく、生徒側で学習します。ここでは、分類の確率をお手本にする代表的な方法を見ます。</p><DistillationExplorer/>
  <p>実際には、こうした入力を何件も用意し、05の「損失を求めて重みを直す」を生徒で繰り返します。先生と生徒の内部構造が同じである必要はありません。先生の誤りも受け継ぐ可能性があるので、蒸留後も実際の正解で評価します。</p>
  <details><summary>次に調べる用語：温度と蒸留の種類</summary><p>分類の確率が一つの候補へ集中しすぎると、ほかの候補の違いを使いにくくなります。出力の確率をならすための設定を<strong>温度（temperature）</strong>と呼びます。温度と、正解を使う損失・先生に近づける損失の配分を検証します。確率だけでなく、中間の特徴や、先生が作った回答を教材として使う蒸留もあります。</p></details>
  <Check question="蒸留すると、小さくなっても先生と同じ性能が必ず残る？" answer="保証されません。小ささ・速さと、必要な課題での性能を測って判断します。先生なしで同じ生徒を学習した場合とも比べ、蒸留の効果を確かめます。"/>
 </Section>
 <Section title="自分で試すなら、何をどう進める？">
  <Table head={['順番','すること','残す結果']} rows={[["1．課題を一つ決める","椅子の写真を3種類に分類する、など","入力、正解、どの間違いが困るか"],["2．データを分ける","同じ椅子の別角度が学習用とテスト用に混ざらないようにする","個体ごとの学習用・検証用・テスト用一覧"],["3．小さな基準を作る","学習済みの特徴を固定し、分類部分を学ぶ","検証用の正解率と、間違えた写真"],["4．必要なら追加学習する","重みの一部をファインチューニングする","変更前後の比較。悪化した種類も確認"],["5．重さが問題なら蒸留する","先生の出力を使う生徒と、使わない同じ構造の生徒を比べる","精度、推論時間、モデルの大きさ"],["6．最後に評価する","設定を固定し、残したテスト用で確認する","混同行列と、実際に使える条件"]]}/>
  <p>最初の到達点は、すべてを一から実装することではありません。<strong>何を入力し、どの重みを変え、何と比べて学び、別のデータで何を確かめたかを説明できること</strong>です。コードはAIに任せても、この4点は自分で決めます。</p>
  <p>続きの教材<strong>「AI入門」</strong>では、学習したモデルを動かす側へ進みます。文章を出力するモデルに、計算や検索などの道具を組み合わせ、作業を進める仕組みを見ます。</p>
 </Section>
 <Sources links={[["PyTorch：転移学習とファインチューニング","https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"],["知識蒸留の原論文","https://arxiv.org/abs/1503.02531"],["PyTorch：知識蒸留の実装例","https://docs.pytorch.org/tutorials/beginner/knowledge_distillation_tutorial.html"]]}/>
 </>;}
