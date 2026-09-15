import DataTable from './DataTable.jsx';
import PageLink from './PageLink.jsx';
import { Sources } from './Common.jsx';
import { economicsSources as references } from './economicsSources.js';

export function Heading({ number, title }) { return <><p className="eyebrow">{number} / 経済学入門</p><h1>{title}</h1></>; }
export function Cite({ ids }) { return <div className="econ-citations">{ids.map(id => <PageLink key={id} href={references[id][1]} target="_blank" rel="noreferrer">{references[id][0]} ↗</PageLink>)}</div>; }
export function Reading({ ids }) { return <Sources links={ids.map(id => references[id])}/>; }
export function Table(props) { return <DataTable {...props} tableClassName="econ-table"/>; }
