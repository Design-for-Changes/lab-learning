import DataTable from './DataTable.jsx';
import { Sources } from './Common.jsx';
import { webSources } from './webContent.js';

export function WebHeading({ number, title }) { return <><p className="eyebrow">{number} / ウェブインタラクション入門</p><h1>{title}</h1></>; }
export function WebReading({ ids }) { return <Sources links={ids.map(id => webSources[id])}/>; }
export function WebCode({ label, children }) { return <div className="web-code"><span className="web-label">{label}</span><pre tabIndex="0"><code>{children}</code></pre></div>; }
export function WebTable(props) { return <DataTable {...props} tableClassName="web-table" scrollClassName="web-table-scroll" scrollLabel={props.caption}/>; }
export function WebFlow({ steps, caption }) { return <figure className="web-flow"><ol>{steps.map(([title, text], i) => <li key={title}><span className="web-step-no">{String(i + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>{caption && <figcaption>{caption}</figcaption>}</figure>; }
