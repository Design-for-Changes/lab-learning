import { useId, useState } from 'react';
import { webLibraryGroups, webLibraryCount, findWebLibraries } from './webLibraries.js';

export default function WebLibraryCatalog() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const id = useId();
  const groups = findWebLibraries(category, query);
  const count = groups.reduce((total, group) => total + group.items.length, 0);
  return <div className="web-library-catalog">
    <div className="web-library-filters">
      <label htmlFor={`${id}-search`}>名前・用途から探す<input id={`${id}-search`} type="search" value={query} placeholder="例：D3、地図、ドラッグ、3D" onChange={event => setQuery(event.target.value)}/></label>
      <label htmlFor={`${id}-category`}>用途で絞り込む<select id={`${id}-category`} value={category} onChange={event => setCategory(event.target.value)}><option value="all">すべての用途</option>{webLibraryGroups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}</select></label>
      <button type="button" className="web-action" disabled={!query && category === 'all'} onClick={() => { setQuery(''); setCategory('all'); }}>絞り込みを解除</button>
    </div>
    <p className="web-library-count" role="status">{webLibraryCount}件中 {count}件を表示</p>
    {groups.map(group => <section key={group.id} className="web-library-group" aria-labelledby={`${id}-${group.id}`}>
      <h3 id={`${id}-${group.id}`}>{group.title} <span>／ {group.items.length}件</span></h3>
      <ul>{group.items.map(([name, description, kind, url]) => <li key={name}>
        <div><a href={url} target="_blank" rel="noreferrer">{name} <span aria-label="公式サイトを新しいタブで開く">↗</span></a><span className="web-library-kind">{kind}</span></div>
        <p>{description}</p>
      </li>)}</ul>
    </section>)}
    {!count && <p>該当する項目がありません。検索語を短くするか、用途の絞り込みを解除してください。</p>}
  </div>;
}
