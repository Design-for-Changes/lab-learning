import PageLink from './PageLink.jsx';
import { useId, useLayoutEffect, useRef, useState } from 'react';

const diagrams = [
  {
    id: 'inheritance', label: '自然選択と遺伝',
    explanation: '自然選択は、個体の違いが子に伝わることを前提とします。メンデルの遺伝の法則と自然選択を数理的に結びつけたのが集団遺伝学です。その成果と、種分化や古生物などの研究が結びつき、総合説へと発展しました。',
    nodes: [
      { id: 'selection', label: '自然選択', years: '1858–1859年', row: 1, column: 1 },
      { id: 'mendel', label: 'メンデルの法則', years: '1865–1866年', row: 1, column: 2 },
      { id: 'population-genetics', label: '集団遺伝学', years: '1918–1931年', row: 2 },
      { id: 'modern-synthesis', label: '総合説', years: '1930–1940年代', row: 3 },
    ],
    edges: [
      { from: 'selection', to: 'population-genetics', label: ['自然選択を', '数理で扱う'] },
      { from: 'mendel', to: 'population-genetics', label: ['遺伝の法則を', '組み込む'] },
      { from: 'population-genetics', to: 'modern-synthesis', label: ['種分化や化石などの', '研究と結びつける'] },
    ],
    sources: ['fisher', 'wright', 'synthesis'],
  },
  {
    id: 'molecules', label: 'DNAと分子進化',
    explanation: 'DNAの研究は、遺伝を担う物質とその構造を明らかにしました。DNAやタンパク質を比較して分子の変化を調べる研究と、集団遺伝学の遺伝的浮動の理論が結びつき、中立説へとつながります。太田の研究では、ごく弱い選択と集団の大きさの関係が重視されました。',
    nodes: [
      { id: 'dna', label: 'DNAの解明', years: '1944–1953年', row: 1, column: 1 },
      { id: 'population-genetics', label: '集団遺伝学', years: '1918–1931年', row: 1, column: 2 },
      { id: 'neutral-theory', label: '中立説', years: '1968年', row: 2 },
      { id: 'nearly-neutral', label: 'ほぼ中立説', years: '1973年の論考', row: 3 },
    ],
    edges: [
      { from: 'dna', to: 'neutral-theory', label: ['分子の変化を', '調べる基盤'] },
      { from: 'population-genetics', to: 'neutral-theory', label: ['遺伝的浮動を', '分子進化に適用'] },
      { from: 'neutral-theory', to: 'nearly-neutral', label: ['弱い選択と集団の', '大きさも考える'] },
    ],
    sources: ['avery', 'watson', 'franklin', 'kimura', 'ohta'],
  },
  {
    id: 'altruism', label: '遺伝と血縁選択',
    explanation: '自然選択と、血縁者が共通祖先から遺伝子を共有することを結びつけて考えます。自分の繁殖が減っても、血縁者の繁殖を十分に増やせば、援助に関わる遺伝子が広がる場合があります。DNAは遺伝情報を担う物質であり、血縁選択は、その遺伝子が行動を通じてどう伝わるかを説明します。',
    nodes: [
      { id: 'selection', label: '自然選択', years: '1858–1859年', row: 1, column: 1 },
      { id: 'shared-genes', label: '血縁者による遺伝子の共有', years: '共通祖先からの遺伝', row: 1, column: 2, target: 'hamilton' },
      { id: 'hamilton', label: '血縁選択・包括適応度', years: '1964年', row: 2 },
    ],
    edges: [
      { from: 'selection', to: 'hamilton', label: ['利他行動の', '進化を説明'] },
      { from: 'shared-genes', to: 'hamilton', label: ['血縁度と援助の', '効果を考える'] },
    ],
    sources: ['dnaDefinition', 'hamilton', 'west'],
  },
  {
    id: 'levels', label: '群選択と血縁選択',
    explanation: '群選択の議論で問題になったのは、集団に役立つ性質が、個体間の競争がある中でも広がるかどうかです。マルチレベル選択では、集団内と集団間の選択を合わせて扱います。同じ進化の過程を、血縁選択では血縁度と援助の効果から、マルチレベル選択では集団内・集団間の差から説明できる場合があります。',
    nodes: [
      { id: 'group-selection', label: '群選択', years: '1962年の議論', row: 1, column: 1 },
      { id: 'hamilton', label: '血縁選択', years: '1964年', row: 1, column: 2 },
      { id: 'multilevel', label: 'マルチレベル選択', years: '2007年の論考', row: 2 },
    ],
    edges: [
      { from: 'group-selection', to: 'multilevel', label: ['集団内と集団間', 'の選択を', '合わせて扱う'] },
      { from: 'hamilton', to: 'multilevel', label: ['同じ過程を', '別の形で説明'], comparison: true },
    ],
    sources: ['smith', 'wilson', 'west'],
  },
];

function goToEvent(id) {
  const heading = document.getElementById(`evolution-${id}`);
  heading?.focus({ preventScroll: true });
  heading?.scrollIntoView({ block: 'start' });
}

function ConnectionChart({ diagram }) {
  const chartRef = useRef(null);
  const markerId = useId().replace(/:/g, '');
  const [geometry, setGeometry] = useState(null);

  useLayoutEffect(() => {
    const chart = chartRef.current;
    const update = () => {
      const box = chart.getBoundingClientRect();
      const nodes = Object.fromEntries([...chart.querySelectorAll('[data-concept]')].map(node => {
        const rect = node.getBoundingClientRect();
        return [node.dataset.concept, { x: rect.left - box.left + rect.width / 2, top: rect.top - box.top, bottom: rect.bottom - box.top }];
      }));
      setGeometry({ width: box.width, height: box.height, nodes });
    };
    const observer = new ResizeObserver(update);
    observer.observe(chart);
    chart.querySelectorAll('[data-concept]').forEach(node => observer.observe(node));
    update();
    return () => observer.disconnect();
  }, [diagram]);

  return <div className="evolution-connection-chart" ref={chartRef}>
    {geometry && <svg className="evolution-connection-lines" viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
      <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="var(--blue)"/></marker></defs>
      {diagram.edges.map(edge => {
        const from = geometry.nodes[edge.from], to = geometry.nodes[edge.to];
        const start = from.bottom + 6, end = to.top - 8, middle = (start + end) / 2;
        const endX = to.x + Math.sign(from.x - to.x) * 12;
        return <path key={`${edge.from}-${edge.to}`} d={`M${from.x} ${start} C${from.x} ${middle}, ${endX} ${middle}, ${endX} ${end}`} fill="none" stroke="var(--blue)" strokeWidth="1.75" strokeDasharray={edge.comparison ? '5 4' : undefined} markerStart={edge.comparison ? `url(#${markerId})` : undefined} markerEnd={`url(#${markerId})`}/>;
      })}
    </svg>}
    {diagram.nodes.map(node => <button key={node.id} type="button" className={`evolution-concept${node.column ? '' : ' centered'}`} data-concept={node.id} style={{ gridRow: node.row, gridColumn: node.column || '1 / -1' }} onClick={() => goToEvent(node.target || node.id)} aria-label={`${node.label}の年表へ`}>
      <span>{node.years}</span><strong>{node.label}</strong><span className="evolution-concept-jump">年表へ ↓</span>
    </button>)}
    {geometry && diagram.edges.map(edge => {
      const from = geometry.nodes[edge.from], to = geometry.nodes[edge.to];
      return <p className="evolution-connection-label" key={`${edge.from}-${edge.to}`} style={{ left: (from.x + to.x) / 2, top: (from.bottom + to.top) / 2, maxWidth: from.x === to.x ? '70%' : '26%' }}>
        <span className="visually-hidden">{diagram.nodes.find(node => node.id === edge.from).label}と{diagram.nodes.find(node => node.id === edge.to).label}の関係：</span>
        {edge.label.map(line => <span key={line}>{line}</span>)}
      </p>;
    })}
  </div>;
}

export default function EvolutionConnections({ references }) {
  const [activeId, setActiveId] = useState(diagrams[0].id);
  const diagram = diagrams.find(item => item.id === activeId);
  const headingId = useId();
  return <section className="evolution-connections" aria-labelledby={headingId}>
    <h2 id={headingId}>理論と発見は、どう結びついたか</h2>
    <div className="evolution-connection-choices" role="group" aria-label="つながりを選ぶ">
      {diagrams.map(item => <button key={item.id} type="button" aria-pressed={item.id === activeId} onClick={() => setActiveId(item.id)}>{item.label}</button>)}
    </div>
    <ConnectionChart key={diagram.id} diagram={diagram}/>
    <p className="evolution-connection-explanation">{diagram.explanation}</p>
    <p className="evolution-cite">文献：{diagram.sources.map((id, index) => <span key={id}>{index > 0 && ' ／ '}<PageLink href={references[id][1]} target="_blank" rel="noreferrer">{references[id][0]}</PageLink></span>)}</p>
    <p className="evolution-connection-note">線は、理論や発見の関係を表します。破線の両矢印は、同じ過程を異なる形で説明できる関係です。各項目を押すと年表へ移ります。</p>
  </section>;
}
