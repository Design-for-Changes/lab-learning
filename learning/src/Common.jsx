import PageLink from './PageLink.jsx';
import { useState } from 'react';
export function Prompt({text,title="もう少し知りたくなったら、AIに聞く"}){
 const [status,setStatus]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(text);setStatus('コピーしました');}catch{setStatus('コピーできませんでした。文章を選択してコピーしてください。');}}
 return <section className="ai-box"><div className="ai-heading"><h3>{title}</h3><button onClick={copy}>コピー</button></div><textarea aria-label="AIに聞く文章" readOnly value={text} rows={5}/><p className="copy-status" role="status">{status}</p></section>;
}
export function Section({id,title,children}){return <section id={id} className="section"><header className="section-title"><h2>{title}</h2></header><div className="section-body">{children}</div></section>;}
export function Sources({links}){return <section className="sources"><h2>詳しく読む</h2><ul>{links.map(([title,url])=><li key={url}><PageLink href={url} target="_blank" rel="noreferrer">{title} ↗</PageLink></li>)}</ul></section>;}
export function Next({href,label}){return <PageLink className="next-link" href={`#${href}`}>{label} →</PageLink>;}
