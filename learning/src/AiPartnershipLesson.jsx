import { useState } from 'react';
import { Section, Sources } from './Common.jsx';
import './aiPartnership.css';

const developmentStages = [
 {
  label: '作り始める前',
  title: 'まず、つくりたいものをある程度整理する',
  documents: '目的は、表のデータを図にして比べること。最初は「表を読み込んで集計する」ところまでつくる。図の保存は、その後に加える。',
  implementation: 'これからつくる。AIと一緒に、プログラムを保存する場所と、動かして試せる環境を用意する。',
  checks: '答えを確かめられる小さな表を用意する。集計結果が元のデータと合うかを、そこで試す。',
  point: '目的と最初につくる範囲が分かれば、そこから具体的なつくり方をAIと考えられる。',
 },
 {
  label: '一部分を試す',
  title: '動かしてみると、足りないことが分かる',
  documents: '最初のメモでは、表に空欄がある場合を決めていなかった。',
  implementation: '読み込みと集計ができるものをつくった。しかし、実際の表を入れると、空欄の行で止まってしまう。',
  checks: '毎回、人が空欄を探して表を直すのは手間がかかる。空欄をどう扱うか、AIと相談する。',
  point: '動いたかに加え、自分が実際に使えるかを見る。使って初めて気づくこともある。',
 },
 {
  label: '文書とプログラムを更新する',
  title: '分かったことを、同じ作業場に反映する',
  documents: '「空欄は未回答として別に数え、画面で確認できるようにする」と追記する。',
  implementation: 'その内容に合わせてプログラムを直し、もう一度動かす。',
  checks: '空欄のある表も確認用データに加える。直した理由と確認結果を記録し、次は図の表示に進む。',
  point: '要件の文書、プログラム、確認用データ、記録をそろえて更新する。次の作業は、この状態から続ける。',
 },
];

function DevelopmentWorkspace() {
 const [stage, setStage] = useState(0);
 const current = developmentStages[stage];
 return <div className="ai-environment-development">
  <p className="small-note">表から図をつくるアプリの、架空の開発例です。ボタンで作業場の変化を見られます。</p>
  <div className="segmented" role="group" aria-label="開発中の作業場を見る">
   {developmentStages.map((item, index) => <button type="button" key={item.label} aria-pressed={index === stage} aria-controls="ai-environment-stage" onClick={() => setStage(index)}>{item.label}</button>)}
  </div>
  <div id="ai-environment-stage" className="ai-environment-stage" aria-live="polite" aria-atomic="true">
   <h3>{current.title}</h3>
   <dl>
    <div><dt>要件整理の文書</dt><dd>{current.documents}</dd></div>
    <div><dt>プログラムと実行環境</dt><dd>{current.implementation}</dd></div>
    <div><dt>確認と記録</dt><dd>{current.checks}</dd></div>
   </dl>
   <p><strong>{current.point}</strong></p>
  </div>
 </div>;
}

export default function AiPartnershipLesson() {
 return <div className="ai-partnership">
  <Section title="AIとの仕事を、マネジメントする">
   <p className="ai-partnership-key">目的に向かって仕事が進むように、必要なものと作業環境を用意し、結果を見ながら調整する。</p>
   <p><strong>マネジメント</strong>とは、目的を実現するために、人や道具、情報をどう使って仕事を進めるかを考え、実際の状況に合わせて調整することです。AIとの仕事にも、この見方が必要です。</p>
   <p><a href="#/ai-intro/behavior">02</a>で見たように、道具を使えるAIは、ファイルを読み、プログラムを動かし、その結果を見て次の作業を考えられます。人が一つずつ操作を指定しなくても、ある範囲の仕事を進められるようになっています。</p>
   <p>そこで考えるのは、<strong>何を目指すか、どこまで任せるか、必要なものはそろっているか、できたものは目的に合うか</strong>です。例えば、アプリが動いても、自分が比べたいものを比べられなければ、仕事は終わっていません。</p>
   <p>その土台になるのが、<strong>環境整備</strong>です。資料を置く場所、編集や計算に使う道具、結果を見る画面、やり直すための記録など、AIと自分が使う「作業場」をつくります。</p>
   <div className="ai-partnership-pair">
    <section><strong>AIが作業しやすい環境</strong><h3>必要なものを探し、使い、確かめられる</h3><p>例えば、要件の文書、編集するファイル、動作を試す場所をつなげておく。</p></section>
    <section><strong>自分が作業しやすい環境</strong><h3>考えたいことに合わせて、道具を変えられる</h3><p>例えば、データを変えながら図を比べられる画面を、AIとつくる。</p></section>
   </div>
   <p>環境づくり自体も、AIと進められます。必要な資料や使える道具を一緒に調べ、まず一つの作業ができるところから始めます。使う人の目的と、AIが実際にできることを、ここで結びつけます。</p>
  </Section>

  <Section title="何を用意すると、AIが作業を進められるか">
   <p>仕事に合わせて、次のようなものをそろえます。すべてを新しくつくる必要はなく、普段使っているフォルダーやアプリも使えます。</p>
   <ul className="ai-partnership-environment">
    <li><h3>必要な資料を、見つけて読める場所</h3><p>元データ、参考資料、決まったことを、AIが参照できる場所に置きます。どれが今使う資料かも分かるようにします。表を計算するなら元の表、文章を直すなら編集できる原稿を用意するといった具合です。</p></li>
    <li><h3>作業に使える道具と、任せる範囲</h3><p>集計には計算を実行する道具、コーディングにはファイルを編集してプログラムを動かす道具が必要です。共有サービスの資料を使うなら、MCPなどで接続する方法もあります。例えば、元データは読むだけ、試作用のファイルは編集できる、というように、道具で扱える範囲も決めます。</p></li>
    <li><h3>できたものを、実際に試せる場所</h3><p>アプリなら動く画面、集計なら答えを確かめられるデータを用意します。AIが結果を調べ、自分も見たり操作したりできるようにします。</p></li>
    <li><h3>途中から続けたり、戻したりできる記録</h3><p>作業中のファイル、変更の履歴、まだ残っていることを保存します。次回も読み直して続けられ、修正で壊れたときには前の状態へ戻せるようにします。</p></li>
   </ul>
   <p><strong>置いてあるだけでAIが必ず読めるとは限りません。</strong>実際にその資料を開けるか、道具を動かせるか、結果を見られるかを一緒に確かめます。使える機能は、AIアプリや接続の設定によって変わります。</p>
   <p className="small-note">接続の仕組みは<a href="#/ai-intro/behavior">02「AIの挙動特性」</a>、道具や資料の提供方法は<a href="https://modelcontextprotocol.io/docs/learn/server-concepts" target="_blank" rel="noreferrer">MCP公式の説明</a>を参照してください。</p>
  </Section>

  <Section title="例：要件を整理する場所を用意して、開発する">
   <p>自分用のアプリをAIとつくる場合を考えます。最初に、作業フォルダーの中に<strong>要件を整理する文書のコーナー</strong>を用意します。「要件」とは、誰のために何をつくり、何ができる必要があるか、ということです。</p>
   <figure className="ai-environment-map">
    <div className="ai-environment-map-title">アプリ開発の作業フォルダー</div>
    <dl>
     <div><dt>要件整理</dt><dd>目的、必要な機能、最初につくる範囲、まだ決まっていないこと。</dd></div>
     <div><dt>プログラム</dt><dd>実際に動かすプログラムの中身（コード）。AIも自分も、同じファイルを編集する。</dd></div>
     <div><dt>動作確認</dt><dd>試すためのデータや、動作を確かめる仕組み。確認用の画面を開く方法も置く。</dd></div>
     <div><dt>作業記録</dt><dd>変更した理由、確認できたこと、残っていること。</dd></div>
    </dl>
    <figcaption>置き場の一例です。フォルダー名や文書の数より、必要なものがどこにあるか分かり、実際に使えることが大切です。</figcaption>
   </figure>
   <p>まずAIと相談し、要件の文書をある程度つくります。例えば、<strong>「表から図をつくりたい。最初は読み込みと集計まで。図の保存は後で追加する」</strong>というように、目的と最初に取り組む範囲を整理します。分からないことは、未決定として残せます。</p>
   <p>この例では、AIに資料を調べ、つくり方の案を出し、コードの変更と動作確認を進めてもらいます。自分は実際に使って「欲しかった比較ができるか」を判断します。追加したいことが出たら、今取り組むか、後にするかも整理します。</p>
   <p>そこから一部分をつくって動かし、使って気づいたことを次の修正に反映します。<strong>コードを直したら、決めたことも文書へ戻す。</strong>こうすると、次に作業するときも、その時点の考え方と動くものを参照できます。</p>
   <DevelopmentWorkspace/>
   <p>このように、小さくつくって試し、分かったことに合わせて変えるのは、<strong>アジャイルな開発</strong>で重視される考え方です。最初の整理と、その後の変更の両方を支える作業場を用意します。<a href="https://agilemanifesto.org/iso/ja/principles.html" target="_blank" rel="noreferrer">アジャイル宣言の原則 ↗</a></p>
   <details><summary>技術の補足：長い開発を続けるための環境</summary><div className="ai-partnership-detail"><p>Anthropicの開発事例では、機能の一覧、変更履歴、進捗の記録、アプリを起動する仕組み、ブラウザで動作を確かめる道具を組み合わせています。次の作業で状況を読み直し、動くものを確かめてから続きを進める構成です。</p><p>特定のWebアプリ開発での事例です。この章のフォルダー構成が最適だと実証されたわけではありません。</p><p><a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" target="_blank" rel="noreferrer">Anthropic：長時間の作業を支える仕組み ↗</a></p></div></details>
  </Section>

  <Section title="自分が使いやすい環境も、AIにつくってもらう">
   <p>例えば、研究でデータを変えながら何度も図を比べたいとします。毎回ファイルを開き直し、計算し、図を保存する作業が続くなら、<strong>データの入力と図の表示を一つの画面にまとめる</strong>方法があります。</p>
   <figure className="ai-partnership-tool">
    <div className="ai-partnership-tool-build"><strong>AIとつくる、自分用の作業画面</strong><span>データを入力する欄と、結果の図を並べる。値を変えて比べ、必要な図を保存できるようにする。</span></div>
    <div className="ai-partnership-tool-use"><strong>できた環境で、自分が作業する</strong><ol><li><b>値を変える</b><span>気になる条件を試す</span></li><li><b>図を見比べる</b><span>違いや傾向を考える</span></li><li><b>結果を残す</b><span>図と、そのときのデータを保存する</span></li></ol></div>
    <figcaption>これは画面の構成例です。新しいアプリをつくるほか、いつもの表計算ソフトや既存の道具を使いやすくする方法もあります。</figcaption>
   </figure>
   <p>自分はその画面を使って考え、使いにくいところが分かったら、AIと道具を直します。例えば「二つの条件を同時に比べたい」と気づいたら、比較できる表示を加えます。自分で直したデータや図も、AIが読み直せる形で残します。</p>
   <p><strong>自分にとって見やすく、操作しやすいことも、環境整備の一部です。</strong>つくった道具の計算が合うか、保存した結果を開き直せるかも、実際に使って確かめます。</p>
   <details><summary>実例：授業用の道具「WeightedMDS For Web」</summary><div className="ai-partnership-detail"><p>キーワードと動画への重みを入力し、その関係を図で見る授業用ツールです。入力表、CSVの入出力、図の保存を一つの画面にまとめています。</p><p>自分が試したいことに合わせて作業環境をつくる、という発想の実例です。この紹介から、時間短縮や学習効果まで実証されたとは扱いません。</p><p><a href="https://weightedmds.vercel.app/" target="_blank" rel="noreferrer">WeightedMDS For Webを開く ↗</a></p></div></details>
  </Section>

  <Section title="使って分かったことを、環境に反映する">
   <p>最初に用意した環境が、そのままずっと合うとは限りません。仕事の内容も、資料も、AIが使える機能も変わります。<strong>うまく進まなかったときは、環境のどこが原因なのかも調べます。</strong></p>
   <dl className="ai-environment-maintenance">
    <div><dt>古い資料を使ってしまう</dt><dd>今使う資料と保管用の資料を区別し、参照先を直す。</dd></div>
    <div><dt>直すたびに、別のところが壊れる</dt><dd>問題が起きたケースを動作確認に加え、前の状態へ戻せる履歴を残す。</dd></div>
    <div><dt>自分が毎回、結果を加工し直している</dt><dd>必要な形で表示・保存できるよう、道具や画面を変える。</dd></div>
    <div><dt>文書が増えて、内容が食い違う</dt><dd>今の判断を反映し、不要になった説明や重複を整理する。</dd></div>
   </dl>
   <p>変えた後は、同じような作業で試します。<strong>手直しが減ったか、確かめやすくなったか、自分が使いやすくなったか。</strong>準備や手入れにかかる時間も含めて見ます。かえって手間が増えたなら、元に戻したり、もっと簡単な構成にしたりします。</p>
   <details><summary>研究の補足：文書を足せば、成果が良くなるとは限らない</summary><div className="ai-partnership-detail"><p>Gloaguenほか（2026、6月改訂版）は、コード修正課題で指示ファイルの有無を比較しました。LLMが自動生成した指示ファイルを加えても、成功率の統計的に有意な改善は認められず、推論コストは増加しました。開発者が用意した文書は別条件で評価され、自動生成の文書とは結果が異なります。</p><p>要件を人と整理することや、この章の環境の更新方法を直接検証した研究ではありません。文書を増やした事実と、実際の仕事が改善したかを分けて考える根拠として参照しています。</p><p><a href="https://arxiv.org/abs/2602.11988v2" target="_blank" rel="noreferrer">原論文：Evaluating AGENTS.md（4.2節）↗</a></p></div></details>
   <p className="ai-partnership-key">AIが仕事を進められる環境をつくる。自分が仕事を進めやすい環境も、AIとつくる。目的に合う結果が出ているかを見て、その環境と仕事の分担を調整する。これを、AIと協働するためのマネジメントとして考えます。</p>
  </Section>
  <Sources links={[
   ['MCP公式：AIが使う道具と資料の接続', 'https://modelcontextprotocol.io/docs/learn/server-concepts'],
   ['アジャイル宣言の原則：動くものを確かめ、変更に対応する', 'https://agilemanifesto.org/iso/ja/principles.html'],
   ['Anthropic：長い作業を支える作業環境の事例', 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents'],
   ['Gloaguenほか（2026）：指示ファイルの効果を比較した研究・6月改訂版', 'https://arxiv.org/abs/2602.11988v2'],
  ]}/>
  <p className="ai-partnership-source-note">二つの作業環境という観点とWeightedMDSの事例は、蘆澤雄亮「AIのあれこれ」（2026年9月8日更新）で示された理解・考え方を参照しています。技術の説明は02と上記の一次資料に基づきます。フォルダー構成や開発の流れは教材上の提案であり、効果が実証された万能の方法としては扱いません。</p>
 </div>;
}
