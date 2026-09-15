import DataTable from './DataTable.jsx';
import { useId, useState } from 'react';
import PageLink from './PageLink.jsx';
import { Section, Next } from './Common.jsx';
import { designStudyChapters, designStudyLinks, designStudyHistory } from './designStudyContent.js';
import { designStudySources } from './designStudySources.js';
import { universalPrinciples } from './designStudyExperience.js';
import { GestaltExplorer, UsabilityHeuristics } from './DesignPerceptionFigures.jsx';
import './designStudy.css';

export { designStudyLinks, designStudyAliases, resolveDesignStudyRoute } from './designStudyContent.js';

function References({ ids }) {
  return <div className="design-references">{ids.map(id => {
    const source = designStudySources[id];
    return <p key={id}><PageLink href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</PageLink><span>{source.note}</span></p>;
  })}</div>;
}

function Choices({ label, options, value, onChange }) {
  return <div className="design-choices" role="group" aria-label={label}>{options.map((text, i) => <button key={text} type="button" aria-pressed={value === i} onClick={() => onChange(i)}>{text}</button>)}</div>;
}

const perspectives = [
  { name: '座り心地を知りたい', fields: ['身体・認知', '材料・構造'], question: '座面の硬さは、姿勢や本人の感じ方とどう関わる？', evidence: '硬さを変えた椅子、姿勢や動作の記録、本人の回答。' },
  { name: '形の意味を知りたい', fields: ['造形・表現', '歴史・文化'], question: 'なぜ、この形がこの時代の「よい椅子」だった？', evidence: '当時の作品、広告、制作者の言葉、生活の記録。' },
  { name: '修理しやすくしたい', fields: ['材料・構造', '生産・経営'], question: '誰が、どの部品を、どんな道具で交換できる？', evidence: '接合部の試作、修理作業、材料や部品の入手経路。' },
  { name: '誰が使えないか知りたい', fields: ['身体・認知', '社会・参加'], question: 'その椅子がある場所で、誰が過ごしにくい？', evidence: '当事者との対話、現場の利用状況、配置や運営の記録。' },
];
const fields = [
  ['造形・表現', 120, 60], ['身体・認知', 450, 65],
  ['歴史・文化', 95, 170], ['材料・構造', 420, 180],
  ['社会・参加', 180, 280], ['生産・経営', 535, 285],
];
function Landscape() {
  const [value, setValue] = useState(0), selected = perspectives[value];
  return <figure className="design-figure"><figcaption><strong>「椅子」のどこに注目する？</strong><span>問いを選ぶと、関わる知識が変わります。</span></figcaption>
    <Choices label="椅子について考える問い" options={perspectives.map(p => p.name)} value={value} onChange={setValue}/>
    <svg className="design-landscape-svg" viewBox="0 0 660 340" role="img" aria-label={`関わる知識の例：${selected.fields.join('と')}。一つの中心から枝分かれする分類ではない。`}>
      <g stroke="#c6c6c6" strokeWidth="2">{[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[0,3],[1,4]].map(([a,b]) => <line key={`${a}-${b}`} x1={fields[a][1]} y1={fields[a][2]} x2={fields[b][1]} y2={fields[b][2]}/>)}</g>
      {fields.map(([name,x,y]) => <g key={name}><rect x={x-78} y={y-27} width="156" height="54" rx="27" fill={selected.fields.includes(name)?'#b62236':'white'} stroke={selected.fields.includes(name)?'#b62236':'#999'}/><text x={x} y={y+6} textAnchor="middle" fill={selected.fields.includes(name)?'white':'#171717'}>{name}</text></g>)}
    </svg>
    <ul className="design-knowledge-list" aria-label="関わる知識の例">{fields.map(([name])=><li key={name} className={selected.fields.includes(name)?'selected':''}>{name}{selected.fields.includes(name)&&<span>この問いに関わる</span>}</li>)}</ul>
    <div className="design-result" aria-live="polite"><h3>{selected.question}</h3><p><strong>手がかり：</strong>{selected.evidence}</p></div>
    <p className="design-caption">関わり方を考えるための模式図です。線や距離は、論文の件数・引用関係を表しません。</p>
  </figure>;
}

const researchExamples = [
  { source: 'jssdMotorcycle', label: '身体と操作', question: 'ハンドルなどの位置と、操作や姿勢はどう関わるか。', method: '二輪車のシミュレーターで位置を変え、両手両足の追跡操作や、座る位置の変化を調べる。', limit: '操作効率や姿勢について報告していますが、掲載本文には参加人数や詳しい数値表がありません。効果の大きさを再計算できる資料ではありません。' },
  { source: 'jssdCircle', label: '造形と表現', question: '円形を直線や曲線と組み合わせると、どんな表現ができるか。', method: '作例を並べ、分割・反復・引き伸ばしなどの構成と、表現上の意味を考察する。', limit: '形から受ける印象は著者の解釈です。多くの人が同じ印象を持つことを確かめた評価実験とは区別します。' },
  { source: 'jssdSociety', label: '暮らしと社会', question: '同じ地域で、電気釜と冷蔵庫はどう受け入れられたか。', method: '長野県の一つの村落を対象に、製品の選択・使用・価値の見出され方と、生活の変化を調べる。', limit: '著者は二つの製品の受容の違いを論じています。一つの地域を対象とした研究で、社会全体についての結論には調査の積み重ねが必要としています。' },
];
function Papers() {
  return <div className="design-papers">{researchExamples.map(item => <article key={item.source}><span className="design-tag">{item.label}</span><h3>{designStudySources[item.source].name}</h3><p><strong>問い：</strong>{item.question}</p><p><strong>調べ方：</strong>{item.method}</p><details><summary>どこまで言える？／原文を読む</summary><div className="design-detail"><p>{item.limit}</p><References ids={[item.source]}/></div></details></article>)}</div>;
}
function History() {
  return <ol className="design-history" aria-label="デザインの歴史">{designStudyHistory.map(item => <li key={item.title}><span className="design-date">{item.date}</span><div><h3>{item.title}</h3><p>{item.question}</p><details><summary>背景と出来事を読む</summary><div className="design-detail"><p>{item.text}</p><References ids={item.refs}/></div></details></div></li>)}</ol>;
}

const experiences = [
  ['使う前', '難しそう。でも、旅行の写真をきれいに残したい。', '広告、他の人の話、以前使ったカメラなどが、期待や不安に関わる。'],
  ['初めて使う', 'ボタンが分かった。思ったより簡単だ。', '目の前の操作や結果を通して、予想していた使い方を確かめる。'],
  ['使った後', '夕焼けを撮れたのが、うれしかった。', '一回の体験を振り返り、印象に残ったことや意味を言葉にする。'],
  ['使い続ける', '傷はついたけれど、自分の相棒みたい。', '使用と振り返りが積み重なり、慣れや意味づけが変わることがある。'],
];
function Experience() {
  const [value,setValue] = useState(0);
  return <figure className="design-figure"><figcaption><strong>カメラは同じ。時間を進めてみる</strong><span>一人の経験を想定した架空の例です。</span></figcaption><Choices label="カメラを使う時点" options={experiences.map(x=>x[0])} value={value} onChange={setValue}/><div className="design-experience" aria-live="polite"><span className="design-tag">{experiences[value][0]}</span><p className="design-voice">「{experiences[value][1]}」</p><p>{experiences[value][2]}</p></div><p className="design-caption">必ずこの順に気持ちが変わるわけではありません。期待や記憶は、次の使用にも関わります。</p></figure>;
}
function MentalModel() {
  const [clear,setClear] = useState(0);
  return <figure className="design-figure"><figcaption><strong>「予約 3時間」は、何が3時間後？</strong></figcaption><Choices label="予約の表示" options={['予約 3時間','終了まで 3時間']} value={clear} onChange={setClear}/><div className="design-flow"><article><span>設計者の意図</span><strong>3時間後に<br/>洗濯が終わる</strong></article><article className="design-machine"><span>表示・動作・説明</span><strong>{clear?'終了まで':'予約'}<br/>3時間</strong></article><article><span>使う人の理解の例</span><strong>{clear?'終わるまでの時間か':'始まるまでの時間？'}</strong></article></div><p aria-live="polite">{clear?'何の時間かを表示すると、理解の手がかりが増えます。実際に伝わるかは、使う人に確かめます。':'設計者の意図は、表示や動作などを通じて伝わります。意図しただけでは、同じ理解にはなりません。'}</p></figure>;
}
function Door() {
  const [clear,setClear] = useState(0);
  return <figure className="design-figure"><figcaption><strong>押して開くドアに、どんな手がかりを付ける？</strong></figcaption><Choices label="ドアの手がかり" options={['棒の取っ手','押す板と表示']} value={clear} onChange={setClear}/><div className="design-door-layout"><svg viewBox="0 0 250 250" role="img" aria-label={clear?'押すと書かれた平らな板が付いたドア':'つかめる棒の取っ手が付いた、押して開くドア'}><rect x="40" y="10" width="170" height="230" fill="#f5f5f5" stroke="#171717" strokeWidth="3"/>{clear?<><rect x="160" y="87" width="32" height="70" fill="#b62236"/><text x="125" y="57" textAnchor="middle">押す</text></>:<><circle cx="176" cy="92" r="8" fill="#aaa"/><circle cx="176" cy="162" r="8" fill="#aaa"/><path d="M176 92h-18v70h18" fill="none" stroke="#171717" strokeWidth="9"/></>}</svg><p aria-live="polite">{clear?'平らな板や「押す」という表示が、押す行為の手がかりになります。':'取っ手はつかめます。でも、この形から「引くのかな」と考える人もいるかもしれません。'}</p></div></figure>;
}
function Dialogue() {
  return <figure className="design-figure"><figcaption><strong>誰が、どの段階に関わる？</strong></figcaption><div className="design-flow"><article><span>依頼を受ける</span><strong>依頼者 ↔ 設計者</strong><p>目的や条件を話す。</p></article><article><span>使われ方を知る</span><strong>設計者 ↔ 使う人</strong><p>観察し、経験を聞く。</p></article><article><span>一緒に考える</span><strong>使う人 ↔ 設計者<br/>↕<br/>運営する人など</strong><p>問いや案をつくり、決定に関わる。</p></article></div><p className="design-caption">関係の違いを示す模式図です。実際のプロジェクトでは併存し、対話相手もこれ以外に広がります。</p></figure>;
}
const thinkingModes = [
  { title: '使う人を知る', name: 'Empathize', term: '共感', action: '観察して、話を聞く', example: '来場者が入口で立ち止まる。話を聞くと、「受付がどこか分からない」と言う。自分の想像だけで困りごとを決めず、本人の行動や経験から知る。' },
  { title: '問いを定める', name: 'Define', term: '問題定義', action: '何を考えるか絞る', example: '観察をもとに、「初めて来た人が、入口から受付を見つけるには？」と問いを置く。「大きな看板をつくる」と解決方法まで決めてしまわない。' },
  { title: '案を出す', name: 'Ideate', term: '発想', action: '違う案をいくつも出す', example: '高い位置の看板、床の矢印、受付の配置変更などを考える。文字を大きくする案だけでなく、違うやり方も並べてみる。' },
  { title: '試作する', name: 'Prototype', term: '試作', action: '試せる形にする', example: '紙の看板をつくっている途中で、「そもそも来場者は、どこで迷うのだろう」と気づく。その時点で観察に移っても、問いを考え直してもよい。試作を完成させてから次へ進む必要はない。' },
  { title: '試す', name: 'Test', term: 'テスト', action: '使ってもらい、確かめる', example: '初めて来た人に試してもらうと、看板の文字よりも、入口から看板が見えないことが問題だった。置く場所を変えて試作し直す。必要なら、問いや観察にも戻る。' },
];
const thinkingPositions = [[500, 90], [840, 310], [720, 645], [280, 645], [160, 310]];
const thinkingConnections = thinkingPositions.flatMap(([x, y], from) =>
  thinkingPositions.slice(from + 1).map(([toX, toY], offset) => {
    const dx = toX - x, dy = toY - y;
    // End each arrow outside its card, including the arrowhead.
    const inset = Math.min(160 / Math.abs(dx), 85 / Math.abs(dy));
    return { from, to: from + offset + 1, x1: x + dx * inset, y1: y + dy * inset, x2: toX - dx * inset, y2: toY - dy * inset };
  })
);
function DesignThinking() {
  const [value, setValue] = useState(3);
  const arrowId = useId();
  const selected = thinkingModes[value];
  return <figure className="design-figure design-thinking">
    <figcaption><strong>どの活動の途中でも、どの活動へも行き来できる</strong><span>箱を選ぶと、その活動と他の4つを結ぶ双方向の矢印が赤くなります。</span></figcaption>
    <div className="design-thinking-map">
      <svg viewBox="0 0 1000 735" className="design-thinking-connections" role="img" aria-label={`5つの活動のすべての組み合わせを、双方向の矢印で結んだ図。選択中の「${selected.title}」からも、他のどの活動へも移れる。始点・終点や決まった順序はない。`}>
        <defs>{['muted', 'active'].map(tone => <marker key={tone} id={`${arrowId}-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={tone === 'active' ? '#b62236' : '#999'}/></marker>)}</defs>
        {[false, true].map(active => <g key={String(active)}>{thinkingConnections.filter(edge => (edge.from === value || edge.to === value) === active).map(({ from, to, ...points }) => <line key={`${from}-${to}`} {...points} stroke={active ? '#b62236' : '#b8b8b8'} strokeWidth={active ? 4 : 2.5} markerStart={`url(#${arrowId}-${active ? 'active' : 'muted'})`} markerEnd={`url(#${arrowId}-${active ? 'active' : 'muted'})`}/>)}</g>)}
      </svg>
      <ul className="design-thinking-nodes" aria-label="順序を定めない、デザイン思考の5つの活動">
        {thinkingModes.map((mode, i) => <li key={mode.name} style={{ left: `${thinkingPositions[i][0] / 10}%`, top: `${thinkingPositions[i][1] / 735 * 100}%` }}>
          <button type="button" aria-pressed={value === i} aria-controls="design-thinking-example" onClick={() => setValue(i)}>
            <strong>{mode.title}</strong><span lang="en">{mode.name}</span><small>{mode.action}</small>
          </button>
        </li>)}
      </ul>
    </div>
    <div id="design-thinking-example" className="design-result" aria-live="polite">
      <h3>{selected.term}（{selected.name}）</h3>
      <p><strong>展示会の案内なら：</strong>{selected.example}</p>
    </div>
    <p className="design-caption">観察の途中に思いついた案を試作したり、案を考えている途中で話を聞き直したりします。どこから始めてもよく、一つの活動を終えるまで他へ移れないという区切りもありません。</p>
    <p className="design-caption">Stanford d.schoolの5つの活動をもとに、相互に行き来できる関係を示した教材用の図です。毎回すべての矢印をたどる必要はありません。</p>
  </figure>;
}
const stages = [
  ['発見する','Discover','来場者・担当者の行動や経験を調べ、何が起きているかを広く探る。'],
  ['問いを定める','Define','案内の大きさだけが問題なのか。「入口で受付の場所が分からない」など、調べたことから問いを絞る。'],
  ['案を広げる','Develop','表示、誘導、受付の配置など、異なる案をつくって試す。'],
  ['試して届ける','Deliver','条件に合う案を確かめ、実施する。使われ方を見て、必要なら前の段階へ戻る。'],
];
function Diamond() {
  const [value,setValue] = useState(0);
  return <figure className="design-figure"><figcaption><strong>展示会の案内を考える</strong><span>問いを広げて絞る → 案を広げて絞る</span></figcaption><svg viewBox="0 0 640 190" role="img" aria-label="二つのひし形。第一は問いの発散と収束、第二は解決案の発散と収束。必要に応じて前へ戻る。">{['20,90 160,10 160,170','160,10 300,90 160,170','340,90 480,10 480,170','480,10 620,90 480,170'].map((points,i)=><polygon key={i} points={points} fill={value===i?'#b62236':'#f4e5e7'} stroke="#b62236"/>)}<g fontSize="20" textAnchor="middle">{[115,205,435,525].map((x,i)=><text key={i} x={x} y="97" fill={value===i?'white':'#171717'}>{i%2?'絞る':'広げる'}</text>)}</g></svg><Choices label="ダブルダイヤモンドの段階" options={stages.map(x=>x[0])} value={value} onChange={setValue}/><div className="design-result" aria-live="polite"><h3>{stages[value][0]} / {stages[value][1]}</h3><p>{stages[value][2]}</p></div><p className="design-caption">Design Councilのダブルダイヤモンドをもとにした教材用の図。実際には途中の問いや案へ何度も戻ります。</p></figure>;
}
function Principles() {
  return <div className="design-principles">{universalPrinciples.map(([title,text],i)=><details key={title}><summary><span>{i+1}</span>{title}</summary><p>{text}</p></details>)}</div>;
}
const visualizations = { landscape: Landscape, history: History, papers: Papers, experience: Experience, mentalModel: MentalModel, door: Door, dialogue: Dialogue, thinking: DesignThinking, diamond: Diamond, principles: Principles, gestalt: GestaltExplorer, heuristics: UsabilityHeuristics };

export default function DesignStudyCourse({ route }) {
  const index = designStudyChapters.findIndex(chapter => route === `/design/${chapter.slug}`);
  if (index < 0) return <h1>ページが見つかりません</h1>;
  const chapter = designStudyChapters[index], next = designStudyLinks[index+1];
  return <div className="design-course"><p className="eyebrow">{String(index+1).padStart(2,'0')} / デザイン学入門</p><h1>{chapter.title}</h1>
    {chapter.sections.map((section,i)=>{const Visual=visualizations[section.visual];return <Section key={section.title} id={`design-${chapter.slug}-${i+1}`} title={section.title}>
      {section.lead&&<p><strong>{section.lead}</strong></p>}{(section.paragraphs||[]).map(p=><p key={p}>{p}</p>)}
      {section.table&&<DataTable {...section.table}/>}{Visual&&<Visual/>}
      {section.note&&<details><summary>{section.note[0]}</summary><p>{section.note[1]}</p></details>}
      {section.links&&<ul className="design-related">{section.links.map(([href,label])=><li key={href}><PageLink href={href}>{label} →</PageLink></li>)}</ul>}
      {section.refs&&<details className="design-source-toggle"><summary>参考にした記事・文献</summary><References ids={section.refs}/></details>}
    </Section>;})}
    {next?<Next href={next[0]} label={`${next[1]}へ進む`}/>:<Next href="/" label="学習資料の一覧へ"/>}
  </div>;
}
