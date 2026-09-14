import { useId, useState } from 'react';

const nodes = [
  { id: 'pfc', x: 24, y: 54, name: '前頭前野', sub: '眼窩面・内側部など' },
  { id: 'cingulate', x: 270, y: 54, name: '帯状皮質', sub: '帯状回・脳梁膨大後部など' },
  { id: 'association', x: 516, y: 54, name: '連合野', sub: '側頭葉・頭頂葉など' },
  { id: 'amygdala', x: 24, y: 262, name: '扁桃体', sub: '情動的な意味の学習など' },
  { id: 'entorhinal', x: 270, y: 262, name: '海馬傍領域', sub: '嗅内皮質など' },
  { id: 'hippocampus', x: 516, y: 262, name: '海馬', sub: '出来事の記憶の形成・想起' },
  { id: 'body', x: 24, y: 470, name: '視床下部・脳幹', sub: '心拍など身体反応の調整' },
  { id: 'thalamus', x: 270, y: 470, name: '視床前核', sub: '海馬・帯状皮質とつながる' },
  { id: 'mammillary', x: 516, y: 470, name: '乳頭体', sub: '視床下部の一部' },
];

// Arrows summarize projections between the named regions, not individual synapses.
const edges = [
  { id: 'pfc-cingulate', from: 'pfc', to: 'cingulate', d: 'M204 86H264', both: true, group: 'cortex' },
  { id: 'cingulate-association', from: 'cingulate', to: 'association', d: 'M450 86H510', both: true, group: 'cortex' },
  { id: 'amygdala-pfc', from: 'amygdala', to: 'pfc', d: 'M112 256V124', both: true, group: 'cortex' },
  { id: 'amygdala-entorhinal', from: 'amygdala', to: 'entorhinal', d: 'M204 294H264', both: true, group: 'emotion' },
  { id: 'amygdala-body', from: 'amygdala', to: 'body', d: 'M112 332V464', group: 'emotion' },
  { id: 'association-entorhinal', from: 'association', to: 'entorhinal', d: 'M565 124C552 179 436 203 409 256', both: true, group: 'cortex' },
  { id: 'cingulate-entorhinal', from: 'cingulate', to: 'entorhinal', d: 'M358 124V256', both: true, group: 'memory' },
  { id: 'entorhinal-hippocampus', from: 'entorhinal', to: 'hippocampus', d: 'M450 294H510', both: true, group: 'memory' },
  { id: 'hippocampus-mammillary', from: 'hippocampus', to: 'mammillary', d: 'M604 332V464', group: 'memory', label: '脳弓', lx: 624, ly: 402 },
  { id: 'mammillary-thalamus', from: 'mammillary', to: 'thalamus', d: 'M510 502H452', group: 'memory', label: '乳頭視床路', lx: 482, ly: 565 },
  { id: 'thalamus-cingulate', from: 'thalamus', to: 'cingulate', d: 'M295 464C220 420 220 202 295 124', group: 'memory' },
];

const views = [
  { id: 'all', name: 'つながりの全体像', title: '情動・記憶・認知に関わる領域は、相互につながる', description: '扁桃体は前頭前野や海馬傍領域、身体反応に関わる領域とつながります。帯状皮質と連合野にも接続があり、海馬を含む経路とともに、複数のやりとりが成り立っています。' },
  { id: 'memory', name: '海馬を含むループ', title: '海馬から出て、帯状皮質・海馬傍領域を経て戻る', description: '海馬 → 脳弓 → 乳頭体 → 視床前核 → 帯状皮質 → 海馬傍領域・嗅内皮質 → 海馬。Papez（パペッツ）回路として知られる経路です。海馬と嗅内皮質の間にも、双方向の接続があります。' },
  { id: 'cortex', name: '皮質へ広がる経路', title: '帯状皮質や扁桃体からも、他の皮質領域へつながる', description: '帯状皮質は、前頭前野や側頭葉・頭頂葉の連合野とつながります。扁桃体と前頭前野の間にも接続があります。皮質への働きかけを考えるときには、海馬を経由する経路とともに、こうした経路も見る必要があります。' },
];

export function EmotionMemoryNetwork() {
  const [selected, setSelected] = useState('all');
  const uid = useId().replaceAll(':', '');
  const view = views.find(item => item.id === selected);
  const activeEdges = edges.filter(edge => selected === 'all' || edge.group === selected);
  const activeNodes = new Set(activeEdges.flatMap(edge => [edge.from, edge.to]));
  return <figure className="neuro-emotion-network">
    <div className="neuro-switches" aria-label="情動と記憶の回路の表示">
      {views.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.name}</button>)}
    </div>
    <p className="neuro-emotion-scroll-hint">図は左右にスクロールできます。</p>
    <div className="neuro-emotion-map" tabIndex={0} role="region" aria-label="情動と記憶の接続図。狭い画面では横にスクロールできます">
      <svg viewBox="0 0 720 586" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
        <title id={`${uid}-title`}>{view.title}</title>
        <desc id={`${uid}-desc`}>{view.description}矢印は領域間の投射をまとめたもので、部位の解剖学的な位置を示す図ではありません。</desc>
        <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#54738d"/></marker></defs>
        {edges.map(edge => {
          const active = selected === 'all' || edge.group === selected;
          return <g key={edge.id} opacity={active ? 1 : 0.12}>
            <path d={edge.d} fill="none" stroke="#54738d" strokeWidth={selected === 'all' ? 2.5 : 3.5} markerEnd={`url(#${uid}-arrow)`} markerStart={edge.both ? `url(#${uid}-arrow)` : undefined}/>
            {edge.label && <text className="neuro-emotion-edge-label" x={edge.lx} y={edge.ly} textAnchor={edge.id === 'mammillary-thalamus' ? 'middle' : 'start'}>{edge.label}</text>}
          </g>;
        })}
        {nodes.map(node => <g key={node.id} opacity={activeNodes.has(node.id) ? 1 : 0.22}>
          <rect x={node.x} y={node.y} width="176" height="64" rx="8" fill="#f3f6f8" stroke="#8ba0b2" strokeWidth="1.5"/>
          <text x={node.x + 88} y={node.y + 26} textAnchor="middle" className="neuro-emotion-node-name">{node.name}</text>
          <text x={node.x + 88} y={node.y + 47} textAnchor="middle" className="neuro-emotion-node-sub">{node.sub}</text>
        </g>)}
      </svg>
    </div>
    <figcaption>
      <div className="neuro-emotion-reading" aria-live="polite"><strong>{view.title}</strong><p>{view.description}</p></div>
      <p className="neuro-caption">矢印は代表的な投射をまとめたものです。両矢印は双方向の接続を表します。各領域には細かな区分があり、図は全接続を網羅していません。線は発火や増幅の実測を示すものではありません。</p>
    </figcaption>
  </figure>;
}
