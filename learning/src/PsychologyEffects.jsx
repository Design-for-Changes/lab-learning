import PageLink from './PageLink.jsx';
import { useState } from 'react';
import { psychologySources, psychologyEffects, psychologyEffectGroups, psychologyEffectPriorities, filterPsychologyEffects } from './psychologyContent.js';

function Priority({value}) {
  return <span className={`psych-priority psych-priority-${value}`}>{psychologyEffectPriorities.find(p=>p.id===value).label}</span>;
}

export default function PsychologyEffects() {
  const [query,setQuery] = useState('');
  const [group,setGroup] = useState('すべて');
  const [priority,setPriority] = useState('すべて');
  const filtered = filterPsychologyEffects(query,group,priority);
  const reset = () => {setQuery('');setGroup('すべて');setPriority('すべて');};
  return <section className="psych-effects" aria-label="心理効果の検索と一覧">
    <h2>色は、学ぶ順番の目安</h2>
    <p>この入門教材での重要度を、学習優先度として分けています。初めは<strong>「まず押さえる」</strong>から読み、興味のある分野へ広げてください。</p>
    <ul className="psych-priority-legend">{psychologyEffectPriorities.map(p=><li key={p.id}><Priority value={p.id}/><p>{p.description}</p></li>)}</ul>
    <p className="small-note">色は学術的な価値や、研究結果の確かさの順位ではありません。再現性や適用できる条件は、各項目の「注意点」で確認します。</p>
    <div className="psych-effect-filters">
      <label className="psych-search">名前や内容で探す<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="例：記憶、Stroop、条件づけ"/></label>
      <label>分野<select value={group} onChange={e=>setGroup(e.target.value)}>{['すべて',...psychologyEffectGroups].map(value=><option key={value}>{value}</option>)}</select></label>
      <label>学習優先度<select value={priority} onChange={e=>setPriority(e.target.value)}><option value="すべて">すべて</option>{psychologyEffectPriorities.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
    </div>
    <div className="psych-effect-status"><p role="status">{psychologyEffects.length}項目中 <strong>{filtered.length}項目</strong>を表示</p>{(query||group!=='すべて'||priority!=='すべて')&&<button type="button" onClick={reset}>絞り込みを解除</button>}</div>
    {filtered.length?<div className="psych-effect-list">{filtered.map(effect=><article key={effect.id} id={`psych-effect-${effect.id}`} className={`psych-effect-entry psych-priority-${effect.priority}`}>
      <header>
        <span className="psych-effect-group">{effect.group}</span>
        <h3>{effect.name}</h3>
        <span className="psych-english" lang="en">{effect.english}</span>
        <Priority value={effect.priority}/>
      </header>
      <div className="psych-effect-explanation">
        <p>{effect.what}</p>
        <details><summary>比較方法・注意点・文献<span className="visually-hidden">：{effect.name}</span></summary>
          <h4>どう比べて、何を記録する？</h4><p>{effect.compare}</p>
          <h4>注意点</h4><p>{effect.limit}</p>
          <p className="psych-cite">確認する文献：{effect.refs.map((id,i)=><span key={id}>{i>0&&' ／ '}<PageLink href={psychologySources[id][1]} target="_blank" rel="noreferrer">{psychologySources[id][0]}</PageLink></span>)}</p>
        </details>
      </div>
    </article>)}</div>:<p className="note">該当する項目はありません。言葉や条件を変えるか、「絞り込みを解除」で一覧へ戻れます。</p>}
  </section>;
}
