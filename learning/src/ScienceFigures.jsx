import { useState } from 'react';

const inferenceForms = [
 { id:'deduction', title:'演繹', formula:'二つの前提をつないで、結論を導く', targets:['result'], observed:[],
   rule:'この袋の豆は、すべて白い。', case:'この豆は、この袋から取り出した。', result:'だから、この豆は白い。',
   status:'導く結論', takeaway:'A→BとB→Cをつなげて、A→Cを導く。前提が正しく、この推論の形なら、結論も必ず成り立つ。' },
 { id:'induction', title:'帰納', formula:'観察したつながりから、規則を推測する', targets:['rule'], observed:['case','result'],
   rule:'この袋の豆は、すべて白いのではないか。', case:'何粒かの豆を、この袋から取り出した。', result:'調べた豆は、すべて白かった。',
   status:'一般化する規則', takeaway:'観察したA→BとA→Cから、B→Cを推測する。調べた豆から袋全体へ広げるので、まだ見ていない黒い豆が残っている可能性はある。' },
 { id:'abduction', title:'アブダクション', formula:'二つのつながりを仮説で補い、観察を説明する', targets:['case','rule'], observed:['result'],
   rule:'この袋には、白い豆だけが入っているのかもしれない。', case:'この豆は、この袋から来たのかもしれない。', result:'ここに、白い豆がある。',
   status:'説明する仮説', takeaway:'分かっているのはA→C。「A→Bで、B→Cなら、この観察を説明できる」と、二つのつながりをセットで仮に置く。説明の候補ができた段階なので、出どころと袋の中身を確かめる必要がある。' },
];
const inferenceRoles=[
 {key:'case',label:'A → B',role:'小前提',path:'M 103 322 L 297 88',position:'ab'},
 {key:'rule',label:'B → C',role:'大前提',path:'M 343 88 L 537 322',position:'bc'},
 {key:'result',label:'A → C',role:'結論',path:'M 115 350 L 525 350',position:'ac'},
];

export function InferenceDiagram(){
 const [selected,setSelected]=useState('deduction');
 const form=inferenceForms.find(item=>item.id===selected);
 const state=key=>form.targets.includes(key)?'inferred':form.observed.includes(key)?'observed':'given';
 const status=key=>form.targets.includes(key)?form.status:form.observed.includes(key)?'観察したこと':'前提として置く';
 return <figure className="science-inference-figure" aria-labelledby="science-inference-title">
 <figcaption id="science-inference-title">同じ三つのつながりで、どこを導くかを見る</figcaption>
 <div className="science-buttons" role="group" aria-label="推論を切り替える">{inferenceForms.map(item=><button type="button" key={item.id} aria-pressed={selected===item.id} aria-controls="science-inference-diagram" onClick={()=>setSelected(item.id)}>{item.title}</button>)}</div>
 <p className="science-caption">実線は出発点となる情報、赤い破線は導く・補うつながり。切り替えると、破線になる場所が変わります。</p>
 <div id="science-inference-diagram" className={`science-inference-form ${form.id}`}>
  <div className="science-inference-visual">
   <div className="science-inference-map" aria-hidden="true">
   <svg viewBox="0 0 640 430">
    <defs>{['given','observed','inferred'].map(kind=><marker key={kind} id={`inference-arrow-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path className={kind} d="M 0 0 L 10 5 L 0 10 Z"/></marker>)}</defs>
    {inferenceRoles.map(({key,path})=><path key={key} data-edge={key} className={`science-inference-edge ${state(key)}`} d={path} markerEnd={`url(#inference-arrow-${state(key)})`}/>)}
    {[[80,350,'A'],[320,60,'B'],[560,350,'C']].map(([x,y,label])=><g key={label} className="science-inference-node"><circle cx={x} cy={y} r="30"/><text x={x} y={y} dy=".35em" textAnchor="middle">{label}</text></g>)}
   </svg>
   {inferenceRoles.map(({key,label,role,position})=><div key={key} className={`science-inference-edge-label ${position} ${state(key)}`}><span>{role}</span><strong>{label}</strong>{form.targets.includes(key)&&<small>ここを{key==='result'?'導く':'補う'}</small>}</div>)}
   </div>
   <p className="science-inference-key"><span><b>A</b> 調べる豆</span><span><b>B</b> この袋の豆</span><span><b>C</b> 白いもの</span></p>
  </div>
  <div className="science-inference-reading" aria-live="polite">
   <h3>{form.title}</h3><p className="science-inference-formula">{form.formula}</p>
   <dl>{inferenceRoles.map(({key,label,role})=><div key={key} className={state(key)}><dt><span>{label} <small>{role}</small></span><em>{status(key)}</em></dt><dd>{form[key]}</dd></div>)}</dl>
  </div>
 </div>
 <p className="science-inference-takeaway" aria-live="polite">{form.takeaway}</p>
 <p className="science-caption">「A→B」は「AはBに当てはまる」の意味で、因果関係の矢印ではありません。「大前提・小前提・結論」は演繹を基準にした位置の名前です。帰納・アブダクションでは、破線の部分がその推論の結論になります。</p>
 </figure>;}

const quadrants = {
 bohr: { name:'基礎的理解を目指す', person:'ボーアの象限', understand:'追求する', use:'特定の用途を考慮しない', description:'仕組みそのものを理解しようとする研究。今すぐの用途が決まっていなくても、問いに答えることに価値がある。', example:'例えば、人が二つの音を聞き分ける仕組みを調べる。特定の製品開発は目的に置かない。' },
 pasteur: { name:'理解と利用の両方を目指す', person:'パスツールの象限', understand:'追求する', use:'考慮する', description:'実際に困っている問題に取り組みながら、その背後の仕組みも解明しようとする研究。Stokesが「用途に触発された基礎研究」として注目した領域。', example:'例えば、駅で案内放送を聞き逃す問題を解くために、人の注意と音の知覚の仕組みも調べる。' },
 edison: { name:'具体的な利用を目指す', person:'エジソンの象限', understand:'根本的な理解の追求を主目的にしない', use:'考慮する', description:'実際の目的を達成するために、使える方法や技術を探る研究。基礎的理解を主目的に置かないことは、研究が簡単だという意味ではない。', example:'例えば、既存の知見を使い、駅の放送装置の配置を比較して、聞き逃しが少なくなる条件を探る。' },
};

export function PasteurQuadrant(){
 const [selected,setSelected]=useState('pasteur');
 const item=quadrants[selected];
 return <figure className="science-quadrant" aria-labelledby="quadrant-title">
  <figcaption id="quadrant-title">研究の目的は、二つの軸で見られる</figcaption>
  <p className="science-axis-x">横軸：利用を考慮するか →</p>
  <div className="science-quadrant-grid">
   <span className="science-axis-corner">縦軸：<br/>基礎的理解を<br/>追求するか</span><span className="science-axis-label">用途を考慮しない</span><span className="science-axis-label">用途を考慮する</span>
   <span className="science-axis-label">追求する</span>
   {['bohr','pasteur'].map(id=><button type="button" key={id} aria-pressed={selected===id} aria-controls="quadrant-reading" onClick={()=>setSelected(id)}><strong>{quadrants[id].name}</strong><span>{quadrants[id].person}</span></button>)}
   <span className="science-axis-label">主目的に<br/>置かない</span><div className="science-quadrant-empty">この二軸では<br/>両方を主目的に<br/>置かない領域</div>
   <button type="button" aria-pressed={selected==='edison'} aria-controls="quadrant-reading" onClick={()=>setSelected('edison')}><strong>{quadrants.edison.name}</strong><span>{quadrants.edison.person}</span></button>
  </div>
  <div className="science-figure-reading" id="quadrant-reading" aria-live="polite">
   <h3>{item.person}</h3><p>{item.description}</p><p className="science-example">説明用の例：{item.example}</p>
  </div>
  <p className="science-caption">Stokes（1997）の二軸をもとに作図。三つの領域を選ぶと説明が変わります。人物名は研究の志向を示す手本で、人物の仕事すべてを分類するものではありません。</p>
 </figure>;
}

const purposes = [
 { label:'現象を説明する', claim:'案内の見落としには、周囲の情報量が関わるのでは？', evidence:'情報量を変えた条件で、案内に気づく割合などを比較する。視力、慣れ、明るさといった別の説明も検討する。', limit:'一つの駅での結果だけで、すべての場所の原因を説明できるとは限らない。', output:'何が、どんな条件で、見落としに関わるのかという説明。' },
 { label:'結果を予測する', claim:'案内の配置や人の流れから、見落としの起こりやすさを予測できるのでは？', evidence:'モデルをつくるときに使っていない場所や時間のデータで、予測と実際の結果を比べる。', limit:'よく予測できても、予測に使った要因が原因だと分かるわけではない。', output:'どんな範囲で、どれくらい当たるかが分かる予測モデル。' },
 { label:'方法を提案する', claim:'分岐の前に案内を配置すると、迷う人を減らせるのでは？', evidence:'比較する配置を用意し、到達時間・誤った経路・利用者の困りごとを調べる。別の場所でも使える条件を検討する。', limit:'平均時間が短くても、一部の利用者が困る場合がある。「よい」の基準と適用範囲を示す必要がある。', output:'どの利用者・場所・条件で役立つかを示した設計方法。' },
];

export function ResearchPurpose(){
 const [selected,setSelected]=useState(0);
 const item=purposes[selected];
 return <div className="science-purpose">
  <p className="science-caption">同じ「駅の案内」を研究する、説明用の架空例</p>
  <div className="science-buttons" role="group" aria-label="研究の目的を選ぶ">{purposes.map((p,i)=><button key={p.label} type="button" aria-pressed={i===selected} aria-controls="purpose-reading" onClick={()=>setSelected(i)}>{p.label}</button>)}</div>
  <div id="purpose-reading" className="science-figure-reading" aria-live="polite"><h3>{item.claim}</h3><dl className="science-reasoning"><div><dt>何を確かめる？</dt><dd>{item.evidence}</dd></div><div><dt>何が残る？</dt><dd>{item.limit}</dd></div><div><dt>どんな知識になる？</dt><dd>{item.output}</dd></div></dl></div>
 </div>;
}
