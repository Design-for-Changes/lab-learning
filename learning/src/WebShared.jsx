import { Sources } from './Common.jsx';
import { webSources } from './webContent.js';

export function WebHeading({ number, title }) { return <><p className="eyebrow">{number} / ウェブインタラクション入門</p><h1>{title}</h1></>; }
export function WebReading({ ids }) { return <Sources links={ids.map(id => webSources[id])}/>; }
export function WebCode({ label, children }) { return <div className="web-code"><span className="web-label">{label}</span><pre tabIndex="0"><code>{children}</code></pre></div>; }
export function WebTable({ caption, headings, rows }) { return <div className="web-table-scroll" tabIndex="0" role="region" aria-label={caption}><table className="data-table web-table"><caption>{caption}</caption><thead><tr>{headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>; }
export function WebFlow({ steps, caption }) { return <figure className="web-flow"><ol>{steps.map(([title, text], i) => <li key={title}><span className="web-step-no">{String(i + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>{caption && <figcaption>{caption}</figcaption>}</figure>; }
