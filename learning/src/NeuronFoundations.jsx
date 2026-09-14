import { useId, useState } from 'react';

const patterns = [
  {name:'1:1の接続',label:'二つの細胞の接続を抜き出す',nodes:[[120,210,'A'],[500,210,'B']],edges:[[0,1]],detail:'AからBへの接続だけを取り出した図です。AやBが、ほかの細胞ともつながっている可能性は残ります。'},
  {name:'N:1（収束）',label:'複数の細胞から、入力が集まる',nodes:[[100,90,'A'],[100,210,'B'],[100,330,'C'],[500,210,'D']],edges:[[0,3],[1,3],[2,3]],detail:'Dは、A・B・Cから入力を受けます。入力の強さやタイミング、興奮性・抑制性の作用などが、Dの活動に関わります。'},
  {name:'1:N（発散）',label:'一つの細胞から、出力が広がる',nodes:[[120,210,'A'],[520,90,'B'],[520,210,'C'],[520,330,'D']],edges:[[0,1],[0,2],[0,3]],detail:'Aの軸索が分岐して、複数の相手にシナプスをつくる関係です。それぞれの相手に対する伝わりやすさは、同じとは限りません。'},
  {name:'N:Mの接続',label:'収束と発散が、同じ回路にある',nodes:[[100,90,'A'],[100,210,'B'],[100,330,'C'],[520,90,'D'],[520,210,'E'],[520,330,'F']],edges:[[0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5]],detail:'AはDとEへ出力し、EはA・B・Cから入力を受けています。N:Mでも、すべての細胞がすべての相手につながるとは限りません。'},
  {name:'再帰的な接続',label:'信号が、前の細胞へ戻ってくる',nodes:[[110,120,'A'],[510,120,'B'],[310,325,'C']],edges:[[0,1],[1,2],[2,0]],detail:'AからB、BからC、CからAへと戻る回路の例です。一方向に進む回路のほか、相互接続や、このようなループもあります。'},
];

export function NeuronConnectivityFigure() {
  const [selected,setSelected]=useState(3);
  const uid=useId();
  const item=patterns[selected];
  return <figure className="neuro-drawing neuro-connectivity">
    <div className="neuro-figure-heading"><h3>ニューロンは、どのようにつながるか</h3></div>
    <div className="neuro-figure-controls" aria-label="ニューロンの接続パターン">{patterns.map((p,i)=><button type="button" key={p.name} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{p.name}</button>)}</div>
    <p className="neuro-network-title" aria-live="polite">{item.label}</p>
    <svg viewBox="0 0 640 420" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{item.name}</title><desc id={`${uid}-desc`}>{item.detail}</desc>
      <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#788897"/></marker></defs>
      {item.edges.map(([from,to])=>{const a=item.nodes[from],b=item.nodes[to],angle=Math.atan2(b[1]-a[1],b[0]-a[0]);return <path key={`${from}-${to}`} d={`M${a[0]+38*Math.cos(angle)} ${a[1]+38*Math.sin(angle)}L${b[0]-43*Math.cos(angle)} ${b[1]-43*Math.sin(angle)}`} stroke="#788897" strokeWidth="3" fill="none" markerEnd={`url(#${uid}-arrow)`}/>;})}
      {item.nodes.map(([x,y,name])=><g key={name}><circle cx={x} cy={y} r="35" fill="#eef3f9" stroke="#617f9f" strokeWidth="3"/><text x={x} y={y+9} textAnchor="middle" fontSize="27" fontWeight="600" fill="#263744">{name}</text></g>)}
    </svg>
    <figcaption aria-live="polite"><strong>{item.name}</strong><p>{item.detail}</p><p className="neuro-caption">丸は細胞、矢印は細胞間の接続を表します。一本の矢印の間にも、複数のシナプスがありえます。図の細胞数は、関係を説明するための例です。</p></figcaption>
  </figure>;
}

function NeuronShape({kind}) {
  return <svg viewBox="0 0 220 150" role="img" aria-label={`${kind==='pseudo'?'偽単極性':kind==='bipolar'?'双極性':'多極性'}ニューロンの模式図`}>
    <g fill="none" stroke="#54738d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      {kind==='pseudo'?<><path d="M25 102H191M109 102V54M25 102L12 89M25 102L12 115M191 102L206 90M191 102L206 114"/><circle cx="109" cy="42" r="19" fill="#e5eef6"/></>:kind==='bipolar'?<><path d="M20 76H88M130 76H191M20 76L10 59M20 76L10 93M191 76L205 65M191 76L205 87"/><ellipse cx="109" cy="76" rx="22" ry="17" fill="#e5eef6"/></>:<><path d="M96 61L78 27L59 15M78 27L92 12M86 78H51L28 62M51 78L32 98M96 92L69 121L51 127M69 121L77 137M113 59L128 29L119 15M128 29L148 16M123 82H178L204 69M178 82L204 105"/><path d="M94 60L116 58L130 78L115 102L91 96L82 78Z" fill="#e5eef6"/></>}
    </g>
  </svg>;
}

export function NeuronTypesFigure() {
  const [view,setView]=useState('role');
  return <figure className="neuro-drawing neuro-neuron-types">
    <div className="neuro-figure-heading"><h3>「種類」は、何を基準に分けるかで変わる</h3></div>
    <div className="neuro-switches" aria-label="ニューロンの分類基準"><button type="button" aria-pressed={view==='role'} onClick={()=>setView('role')}>役割で分ける</button><button type="button" aria-pressed={view==='effect'} onClick={()=>setView('effect')}>作用で分ける</button><button type="button" aria-pressed={view==='shape'} onClick={()=>setView('shape')}>形で分ける</button></div>
    <div aria-live="polite">
      {view==='role'&&<div className="neuro-type-cards">
        <article><span>感覚の入力</span><h4>感覚ニューロン</h4><p>身体や感覚器からの情報を、脳や脊髄へ伝える役割。</p><p className="neuro-type-example">例：皮膚の刺激を伝えるニューロン</p></article>
        <article><span>回路の中での処理</span><h4>介在ニューロン</h4><p>ほかのニューロンの間で情報をやりとりし、回路の活動を調整する役割。</p><p className="neuro-type-example">例：脊髄の反射回路にあるニューロン</p></article>
        <article><span>身体への出力</span><h4>運動ニューロン</h4><p>ここでは、筋肉へ信号を送り、収縮を起こすニューロンを見ます。</p><p className="neuro-type-example">例：手の筋肉を動かす脊髄のニューロン</p></article>
      </div>}
      {view==='effect'&&<div className="neuro-type-cards">
        <article><span className="neuro-effect-sign" aria-hidden="true">○ → ○</span><h4>興奮性ニューロン</h4><p>受け手が発火しやすくなる方向に働きかけます。脳では、グルタミン酸を使う細胞が代表例です。</p></article>
        <article><span className="neuro-effect-sign" aria-hidden="true">○ ⊣ ○</span><h4>抑制性ニューロン</h4><p>受け手が発火しにくくなる方向に働きかけます。成熟した脳では、GABAを使う細胞が代表例です。</p></article>
      </div>}
      {view==='shape'&&<><div className="neuro-type-cards">
        <article><NeuronShape kind="pseudo"/><h4>偽単極性</h4><p>細胞体から出た一本の突起が、二方向へ分かれます。</p><p className="neuro-type-example">例：脊髄神経節の感覚ニューロン</p></article>
        <article><NeuronShape kind="bipolar"/><h4>双極性</h4><p>細胞体の両側から、樹状突起と軸索が出ます。</p><p className="neuro-type-example">例：網膜の双極細胞</p></article>
        <article><NeuronShape kind="multi"/><h4>多極性</h4><p>複数の樹状突起と、通常一本の軸索をもちます。</p><p className="neuro-type-example">例：錐体細胞、プルキンエ細胞、脊髄の運動ニューロン</p></article>
      </div><p className="neuro-types-note"><strong>錐体細胞</strong>は細胞体が錐体状の細胞、<strong>プルキンエ細胞</strong>は小脳にあり、扇状に広がる樹状突起をもつ細胞です。これらは、多極性という大きな分類の中に含まれます。</p></>}
    </div>
    <figcaption>{view==='role'?<p>役割から見た分類例です。脳内では、領域間をつなぐ投射ニューロンと、主に局所で働く介在ニューロンを区別することもあります。</p>:view==='effect'?<p>実際の作用は、伝達物質だけでなく、受容体や受け手の状態にも依存します。また、ドーパミンなどを使い、回路の応答や可塑性を調整する細胞もあります。</p>:<p>図は突起の出方を簡略化しています。「多極性」は出力先の数ではなく、細胞体から出る突起による分類です。</p>}<strong>同じ細胞を、複数の基準で説明できます。</strong><p>たとえば、脊髄のあるニューロンを「筋肉へ出力する運動ニューロン」であり、「形は多極性」と説明できます。</p></figcaption>
  </figure>;
}

const summationCases = [
  {label:'弱い入力が一つ', heading:'この弱い入力だけでは、閾値に届かない', inputs:'Aから、一回の弱い入力', fire:false, both:false, trace:'M100 405H185Q196 366 211 378Q228 402 277 405H575', description:'Aからの入力でCの膜電位が少し変わりますが、この例では発火の閾値に届かず、活動電位は生じません。'},
  {label:'空間的加重', heading:'複数の場所からの入力が重なる', inputs:'AとBから、近い時刻に入力', fire:true, both:true, trace:'M100 405H185Q204 380 222 330L234 270L250 422Q266 407 298 405H575', description:'AとBからの興奮性入力が近い時刻に届き、その影響が重なります。この例ではCの膜電位が閾値に達し、活動電位が生じます。'},
  {label:'時間的加重', heading:'短い間隔の入力が重なる', inputs:'Aからの入力を、短い間隔で繰り返す', fire:true, both:false, trace:'M100 405H155Q168 370 192 383Q205 346 230 360Q244 337 259 330L271 270L287 422Q306 407 337 405H575', description:'先の入力の影響が残る間に、次の入力が届きます。この例では膜電位の変化が時間的に重なって閾値に達し、Cが発火します。'},
];

export function SynapticSummationFigure() {
  const [selected,setSelected]=useState(1);
  const uid=useId();
  const item=summationCases[selected];
  const active='#b82e4b';
  return <figure className="neuro-drawing neuro-summation">
    <div className="neuro-figure-heading"><h3>入力が重なると、受け手の反応はどう変わるか</h3></div>
    <div className="neuro-figure-controls" aria-label="入力の重なり方">{summationCases.map((entry,index)=><button type="button" key={entry.label} aria-pressed={selected===index} onClick={()=>setSelected(index)}>{entry.label}</button>)}</div>
    <p className="neuro-network-title" aria-live="polite">{item.heading}</p>
    <svg viewBox="0 0 640 470" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{item.heading}</title><desc id={`${uid}-desc`}>{item.description}</desc>
      <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>
      <text x="320" y="35" textAnchor="middle" fontSize="21" fill="#424950">{item.inputs}</text>
      <path d="M119 91L379 126" fill="none" stroke={active} strokeWidth="4" markerEnd={`url(#${uid}-arrow)`}/>
      <path d="M119 175L379 139" fill="none" stroke={item.both?active:'#cbd0d5'} strokeWidth="4" markerEnd={`url(#${uid}-arrow)`}/>
      <path d="M463 132H565" fill="none" stroke={item.fire?active:'#cbd0d5'} strokeWidth="4" markerEnd={`url(#${uid}-arrow)`}/>
      {[[80,86,'A',true],[80,181,'B',item.both],[420,132,'C',item.fire]].map(([x,y,label,on])=><g key={label}><circle cx={x} cy={y} r="36" stroke={on?active:'#adb6bd'} strokeWidth="3" fill={on?'#fff0f3':'#f4f5f6'}/><text x={x} y={y+9} textAnchor="middle" fontSize="27" fontWeight="600" fill="#263744">{label}</text></g>)}
      <text x="532" y="178" textAnchor="middle" fontSize="21" fill={item.fire?active:'#606b75'}>{item.fire?'発火する':'発火しない'}</text>
      <text x="100" y="248" fontSize="20" fill="#424950">受け手Cの膜電位</text>
      <path d="M90 265V432H584" fill="none" stroke="#939da6" strokeWidth="2"/>
      <path d="M100 330H575" stroke="#939da6" strokeWidth="2" strokeDasharray="7 6"/>
      <text x="574" y="316" textAnchor="end" fontSize="19" fill="#606b75">発火の閾値</text>
      <path d={item.trace} fill="none" stroke={active} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
      <text x="575" y="461" textAnchor="end" fontSize="19" fill="#606b75">時間 →</text>
    </svg>
    <figcaption aria-live="polite"><strong>{item.label}</strong><p>{item.description}</p><p className="neuro-caption">A・Bは送り手、Cは受け手です。細胞数は接続を省略した例で、発火に必要な個数を示しません。波形は受け手の膜電位を示す模式図で、高さ・時間は実測値ではありません。</p></figcaption>
  </figure>;
}
