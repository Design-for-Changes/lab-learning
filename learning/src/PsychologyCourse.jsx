import { default as Table } from './DataTable.jsx';
import PageLink from './PageLink.jsx';
import { useState } from 'react';
import { Section, Sources, Next } from './Common.jsx';
import { psychologyLinks, psychologyHistory, psychologySources, psychologyEffects } from './psychologyContent.js';
import PsychologyErpExample from './PsychologyErpExample.jsx';
import { PsychologyMeasurements, PsychologyDeception, PsychologyExperimentCautions } from './PsychologyMethods.jsx';
import PsychologyEffects from './PsychologyEffects.jsx';
import './psychology.css';

export { psychologyLinks, resolvePsychologyRoute } from './psychologyContent.js';
function Cite({ids}) { return <p className="psych-cite">確認する文献：{ids.map((id,i)=><span key={id}>{i>0&&' ／ '}<PageLink href={psychologySources[id][1]} target="_blank" rel="noreferrer">{psychologySources[id][0]}</PageLink></span>)}</p>; }


function Foundations() { return <>
  <Section title="見えない心を、どうやって調べる？">
    <p>同じ説明を読んでも、すぐに分かる人と迷う人がいます。同じ失敗をしても、もう一度挑戦する人とやめる人がいます。心理学は、こうした<strong>心の働きと行動を、観察やデータに基づいて調べる学問</strong>です。</p>
    <p>「あの人はこう思っているはず」と想像するところから、もう一歩進みます。何を見ればその説明を確かめられるか、別の説明でも同じ結果になるのかを考えます。</p>
    <ol className="psych-flow" aria-label="心理学で説明を確かめる流れ"><li><strong>問い</strong><span>通知があると、読み間違いが増える？</span></li><li><strong>比較</strong><span>同じ課題で、通知あり／なしを比べる</span></li><li><strong>記録</strong><span>間違いの数、読む時間、本人の報告</span></li><li><strong>考察</strong><span>差はある？ 難しさや練習の影響では？</span></li></ol>
    <p className="small-note">通知の例は、研究の組み立て方を説明するための仮の課題です。ここに示しただけでは、通知の効果が実証されたことにはなりません。</p><Cite ids={['overview']}/>
  </Section>
  <Section title="心理学には、いくつもの分野がある">
    <Table headings={['分野','何を知りたいかの例']} rows={[
      ['知覚・認知心理学','何が見えるか、どこに注意を向けるか、どう覚えて判断するか。'],
      ['学習心理学','経験や行動の結果によって、次の行動がどう変わるか。'],
      ['発達心理学','子どもから大人、高齢期まで、心や行動がどう変化するか。'],
      ['社会心理学','他者、集団、社会的な状況が、判断や行動にどう関わるか。'],
      ['人格心理学（パーソナリティ心理学）','人による傾向の違いと、その安定性や変化をどう捉えるか。'],
      ['臨床心理学','心理的な困難をどう理解し、支援し、その支援をどう確かめるか。'],
      ['生理心理学・神経心理学','心や行動と、身体・脳の働きがどう結びつくか。'],
      ['教育・産業／組織心理学など','学習、仕事、組織など、具体的な場面で何が起こるか。'],
    ]}/><p>分野の境目は重なります。「覚えやすい説明」を作る研究なら、認知心理学、教育心理学、デザインの研究が関わるでしょう。脳を測ることも一つの方法ですが、それだけが心理学ではありません。</p><Cite ids={['fields']}/>
  </Section>
  <Section title="『集中した』を、何で表す？">
    <p>「集中」「不安」「満足」は、そのまま定規で測れません。研究では、考えたいものを<strong>どんな課題・質問・記録で捉えるか</strong>を決めます。これを<strong>操作的定義</strong>といいます。</p>
    <Table headings={['知りたいこと','記録の例','それだけでは分からないこと']} rows={[
      ['注意を向けられたか','標的を見つける時間、見落としの数','遅さには、見えにくさや操作の難しさも混ざる。'],
      ['覚えているか','答えを自分で出す「再生」、候補から選ぶ「再認」の正答数','選べることと、何も見ずに思い出せることは違う。'],
      ['どう感じたか','質問への評定、面接で語られた経験','言葉の解釈、答えやすさ、周りへの気づかいも影響する。'],
      ['身体がどう反応したか','視線、心拍、脳波など','一つの生理指標が、一つの感情だけを表すわけではない。'],
    ]}/>
    <p><strong>信頼性</strong>は、測定がどのくらい安定・一貫しているか。<strong>妥当性</strong>は、その得点を、目的の意味で読んでよい根拠があるかです。毎回同じ数字が出ても、測りたいものと違えば十分ではありません。</p>
    <p>自作の「集中力チェック」1問を、そのまま集中力のものさしにはできません。既存の尺度を使う場合も、対象者、言語、利用条件、何を測る尺度かを確かめます。</p><Cite ids={['design']}/>
  </Section>
  <Section title="傾向があることと、一人の本音が分かることは違う">
    <p>心理効果は、ある条件でデータを集めたときに見られる差や傾向です。全員が同じように反応するという約束ではありません。集団で見えた傾向だけで、一人の性格や意図を決めつけないでください。</p>
    <p>この教材では、次に「何を調べるために、どんな方法が生まれたか」を歴史で見ます。そのあと、実験の組み立て方を学び、最後に心理効果の一覧を、比較条件と一緒に読みます。</p>
  </Section>
</>; }

function History() { return <>
  <Section title="技術が変わると、調べられる問いも変わる">
    <p>反応が終わるまでの時間を測る。反応する前の脳波を記録する。どこを見たかを残す。日常生活の変化を追う。<strong>計測技術の進化によって、それまで確かめにくかった問いを調べられるようになりました。</strong></p>
    <p>年表では、考え方の変遷に<strong>「支えた計測・記録技術」</strong>を重ねています。時間を測る、電気的な変化を記録する、光や画像で血液側の変化を捉えるなど、何が記録できるようになったかを追います。年は発明年に統一せず、原報や研究の広がった時期を示しています。</p>
    <p><strong>新しい方法が出ても、古い方法が全部いらなくなったわけではありません。</strong>現在も、実験、観察、面接、質問紙を、問いに応じて使います。以下は主に欧米で展開した流れの一部で、心理学の歴史全体を網羅する年表ではありません。</p>
  </Section>
  <ol className="psych-timeline" aria-label="考え方と研究方法の歴史">{psychologyHistory.map(item=><li key={item.id}>
    <div className="psych-era"><strong>{item.date}</strong><span>{item.people}</span>{item.kind&&<span className="psych-kind">{item.kind}</span>}</div>
    <article><h2>{item.title}</h2><p className="psych-question">{item.question}</p><dl>{item.technology&&<div className="psych-technology"><dt>支えた計測・記録技術</dt><dd>{item.technology}</dd></div>}<div><dt>どう調べた？</dt><dd>{item.method}</dd></div><div><dt>何を記録・比較できる？</dt><dd>{item.data}</dd></div></dl>{item.id==='averaging'&&<div className="psych-erp-explanation"><p><strong>脳波（EEG）</strong>は、記録した電位の時間変化。<strong>事象関連電位（ERP）</strong>は、刺激などの出来事に対応した電位変化です。ERPを調べる基本的な方法の一つが、同じ条件の波形をそろえて平均する方法です。</p><PsychologyErpExample/><p>図のように、刺激と無関係にずれる揺れは平均すると小さくなりやすく、時点がそろう反応は残ります。ただし、毎回同じ時点のまばたきなども残り得ます。<strong>平均すれば、どんな混入も消せるわけではありません。</strong></p><p>どんな課題・記録・処理が必要かは、<PageLink href="#/psychology/methods">03の計測方法・ERP成分の例</PageLink>へ進みます。</p></div>}<details><summary>読み方の注意と文献</summary><p>{item.limit}</p><Cite ids={item.refs}/></details></article>
  </li>)}</ol>
  <Section title="現在は、方法を組み合わせて確かめる">
    <p>例えば、通知で読解が妨げられるかを調べるなら、実験室で通知だけを変える比較に加え、実生活でいつ集中しにくかったかを記録する方法もあります。前者は条件をそろえやすく、後者は生活の中の状況を捉えやすい。それぞれに得意な問いがあります。</p>
    <p>同じ人に何度も答えてもらった記録を、別々の人のデータとして数えないことも大切です。測定機器が新しくなっても、比較の設計と統計の基礎は必要です。</p><Cite ids={['ema','timing']}/>
  </Section>
</>; }

function StroopExample() {
  const [condition,setCondition]=useState('一致');
  const [revealed,setRevealed]=useState(false);
  const colors=['#b52335','#16629a','#22653c'];
  return <figure className="psych-demo"><figcaption><strong>文字を読まずに、インクの色を答えてみる</strong></figcaption>
    <div className="psych-controls" role="group" aria-label="ストループ課題の提示条件">{['一致','不一致'].map(label=><button key={label} aria-pressed={condition===label} onClick={()=>{setCondition(label);setRevealed(false);}}>{label}</button>)}</div>
    <div className="psych-stimuli" role="img" aria-label={condition==='一致'?'赤いインクの「赤」、青いインクの「青」、緑のインクの「緑」':'赤いインクの「青」、青いインクの「緑」、緑のインクの「赤」'}>{(condition==='一致'?['赤','青','緑']:['青','緑','赤']).map((word,i)=><span style={{color:colors[i]}} key={i} aria-hidden="true">{word}</span>)}</div>
    <button className="psych-answer" onClick={()=>setRevealed(!revealed)} aria-expanded={revealed}>答える色を{revealed?'隠す':'見る'}</button>{revealed&&<p role="status">左から「赤・青・緑」。文字の意味が変わっても、正解の色は同じです。</p>}
    <p className="small-note">課題を理解するための提示例です。反応時間を測る実験ではなく、この体験だけで効果の有無や個人の能力を判定しません。実際の研究では、色の見え方や言語、表示環境も確認します。</p>
  </figure>;
}

function Methods() { return <div className="psych-methods">
  <Section title="研究方法を選ぶ">
    <Table headings={['方法','集めるデータ','分かること・限界']} rows={[
      ['実験法','条件を変えたときの回答・行動','条件をそろえ、適切に割り付けることで、原因を検討する。'],
      ['観察法','いつ、誰が、何をしたか','実際の行動を捉える。観察だけで原因は決まらない。'],
      ['質問紙法','質問への回答や尺度の得点','本人の感じ方や経験を比べる。実際の行動とは区別する。'],
      ['面接法・事例研究','語りや行動の経過、記録','背景を詳しく調べる。一つの事例を全員へ当てはめない。'],
    ]}/>
    <details><summary>時間を追って調べる方法と文献</summary><div className="psych-detail-body">
      <Table headings={['方法','どう記録する？','注意すること']} rows={[
        ['縦断研究','同じ人を時間を空けて繰り返し測る。','途中で参加しなくなる人の偏り。'],
        ['横断研究','同じ時期に、異なる年齢群などを比べる。','加齢の変化と、育った時代の違いが混ざる。'],
        ['日常場面での反復測定','その時々の気分・状況・行動を短く記録する。','同じ人の回答間の依存や、未回答を扱う。'],
      ]}/><p>方法は組み合わせられます。例えば「質問紙を使った縦断研究」もあります。質問紙を使うだけでは、条件を操作する実験にはなりません。</p><Cite ids={['methods','design','ema']}/>
    </div></details>
  </Section>
  <Section title="変える条件と、測る結果を決める">
    <p>ストループ課題で考えます。画面に色の名前を出し、<strong>文字の意味ではなく、インクの色</strong>を答えてもらいます。「赤」という文字が赤色なら一致、青色なら不一致です。</p><StroopExample/>
    <Table headings={['決めるもの','この例では']} rows={[
      ['仮説','文字の意味と色が不一致だと、一致より色への反応に時間がかかる。'],
      ['独立変数（操作する条件）','文字の意味とインクの色の一致／不一致。'],
      ['従属変数（記録する結果）','反応時間と誤答率。'],
      ['統制する条件','文字サイズ、色、表示位置、回答方法、説明、練習など。'],
      ['交絡として気になること','不一致を必ず後半にすると、疲れによる遅さと区別できない。'],
    ]}/><p>表示する文字、計時を始める時点、回答するキーまで決めます。</p><Cite ids={['stroop']}/>
  </Section>
  <Section title="比べる人と順序を決める">
    <Table headings={['計画','どう比べる？','混ざりやすい影響']} rows={[
      ['参加者内計画','同じ人が一致・不一致の両方を行い、その人の差を出す。','練習、疲れ、先に行った課題。'],
      ['参加者間計画','別々の人を条件に割り付け、群どうしを比べる。','人による反応の速さの違い。'],
    ]}/>
    <p>A→Bだけでなく、B→Aの順で行う人も同じ人数にすると、順序の偏りを減らせます。これが<strong>カウンターバランス</strong>です。前の課題の影響が残る場合は、休憩なども検討します。</p>
    <details><summary>無作為割付と無作為抽出の違い</summary><div className="psych-detail-body"><p><strong>無作為割付</strong>は参加者を条件へ振り分けること、<strong>無作為抽出</strong>は対象集団から参加者を選ぶことです。友人を無作為に2群へ分けても、世の中から無作為に人を集めたことにはなりません。課題の提示順を無作為にする方法もあります。</p><Cite ids={['design']}/></div></details>
  </Section>
  <PsychologyMeasurements/>
  <PsychologyDeception/>
  <PsychologyExperimentCautions/>
  <Section title="実施する手順をまとめる">
    <ol className="psych-steps"><li><strong>問い：</strong>何と何を、どの指標で比べるかを書く。</li><li><strong>対象：</strong>参加条件と人数・試行数を、先行研究や必要な精度を根拠に決める。</li><li><strong>参加者への説明：</strong>同意の取り方、負担、中止の方法を決め、必要な倫理審査を受ける。</li><li><strong>準備：</strong>課題、割付、順序、機器を用意し、実際の端末で予備実験をする。</li><li><strong>解析：</strong>主要な比較と、誤答・無反応・計測不良・極端な値の扱いを先に決める。</li><li><strong>実施：</strong>記録を取り、計画から変更した点も残す。</li></ol>
    <p>結果を見る前に計画を記録するのが<strong>事前登録</strong>です。最初から決めた検証と、結果を見て思いついた探索を、報告で区別します。</p><Cite ids={['prereg','ethics','timing']}/>
  </Section>
</div>; }

function Effects() {
  return <>
    <Section title="名前よりも、何と何を比べたかを見る"><p>「心理効果」と呼ばれるものには、実験で見られる差、知覚の現象、判断の傾向などが含まれます。すべてが同じ種類の法則ではありません。以下は入門で触れておきたい<strong>{psychologyEffects.length}項目</strong>です。</p><p>各項目の<strong>比較条件 → 記録する値 → 結果の読み方</strong>を見てください。原論文は出発点です。自分の研究で使うときは、近い条件の追試やレビューも読み、効果の大きさ・ばらつき・適用範囲を確かめます。</p></Section>
    <PsychologyEffects/>
    <Section title="有名な効果なら、確かだろうか？"><p>効果の名前が広く知られていても、どの条件で、どのくらい出るのかが議論されている場合があります。例えば<strong>自我消耗</strong>では、「一つ目の自己制御課題が、次の課題の成績を下げる」という説明が検討されてきました。</p><p>2016年の事前登録された多研究室の追試では、採用した手順で、想定された効果を明確には確認できませんでした。これは、その手順での重要な結果です。「疲れること自体が存在しない」とも、「どんな方法でも必ず起こる」とも読めません。</p><Cite ids={['depletion','replication']}/></Section>
    <Section title="デザインに使うときも、確かめる"><p>「アンカリングだから、この値段を先に出せば売れる」と飛ばさず、対象者、提示の仕方、実際の選択を調べます。心理学の知見から仮説を作ることと、制作したものに効果があることを示すことは、別の段階です。</p><p>一覧から気になる項目を一つ選び、<strong>誰について、何を変え、何を測ればよいか</strong>を、03の手順に沿って書いてみてください。</p></Section>
  </>;
}

const pages=[Foundations,History,Methods,Effects];
export default function PsychologyCourse({route}) {
  const index=psychologyLinks.findIndex(([path])=>path===route);
  if(index<0)return <><h1>ページが見つかりません</h1><PageLink href="#/psychology">心理学入門へ戻る</PageLink></>;
  const Lesson=pages[index];
  return <div className="psych-course"><p className="eyebrow">{String(index+1).padStart(2,'0')} / 心理学入門</p><h1>{psychologyLinks[index][1].replace(/^\d+　/,'')}</h1><Lesson/>{index===0&&<Sources links={['overview','fields'].map(id=>psychologySources[id])}/>}<Next href={psychologyLinks[index+1]?.[0]||'/'} label={psychologyLinks[index+1]?`${psychologyLinks[index+1][1]}へ進む`:'学習資料へ戻る'}/></div>;
}
