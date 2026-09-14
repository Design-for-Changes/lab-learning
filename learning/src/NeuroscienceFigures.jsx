import PageLink from './PageLink.jsx';
import { useId, useRef, useState } from 'react';
import { neuroscienceSources } from './neuroscienceSources.js';

const asset = name => `${import.meta.env.BASE_URL}images/neuroscience/${name}`;
const heights = { 'neuron-structure.png':1320, 'action-potential.png':738, 'axon-propagation.png':605, 'hebb-pairing.png':1870, 'note-connections.png':846, 'note-main-circuits.png':846 };

export function NoteFigure({file, title, alt, children}) {
  const dialog = useRef(null);
  const [originalSize,setOriginalSize] = useState(false);
  const titleId = useId();
  return <figure className="neuro-note-figure">
    <div className="neuro-figure-heading"><h3>{title}</h3><button type="button" onClick={() => {setOriginalSize(false);dialog.current.showModal();}} aria-label={`図を拡大：${title}`}>拡大する <span aria-hidden="true">↗</span></button></div>
    <img src={asset(file)} alt={alt} width="1200" height={heights[file]} loading="lazy" decoding="async"/>
    <figcaption>{children}<PageLink href={neuroscienceSources.note[1]} target="_blank" rel="noreferrer">図：蘆澤雄亮「脳の構造とデザイン」 ↗</PageLink></figcaption>
    <dialog ref={dialog} className="neuro-image-dialog" aria-labelledby={titleId} onClick={e => { if (e.target === e.currentTarget) dialog.current.close(); }}>
      <div className="neuro-dialog-heading"><h3 id={titleId}>{title}</h3><button type="button" aria-pressed={originalSize} onClick={()=>setOriginalSize(!originalSize)}>{originalSize?'幅に合わせる':'原寸で見る'}</button><button type="button" autoFocus onClick={() => dialog.current.close()}>閉じる</button></div>
      <div className={`neuro-image-scroll${originalSize?' original-size':''}`} tabIndex="0" aria-label="拡大した図。必要に応じて縦横にスクロールできます"><img src={asset(file)} alt={alt} width="1200" height={heights[file]}/></div>
      <p>「原寸で見る」でさらに拡大できます。大きな図は縦横にスクロールして読めます。</p>
    </dialog>
  </figure>;
}

const synapseStages = [
  ['活動電位が到達', '軸索を伝わった活動電位が、シナプス前終末の膜電位を変えます。'],
  ['Ca²⁺が流入', '膜電位の変化によって、電位依存性Ca²⁺チャネルが開きます。細胞外のCa²⁺が、終末の中へ流れ込みます。'],
  ['伝達物質を放出', '流入したCa²⁺が引き金となり、シナプス小胞が膜と融合します。中の神経伝達物質が、シナプス間隙へ放出されます。'],
  ['受容体に作用', '神経伝達物質が、受け手の受容体に結合します。この図では、受容体のチャネルが開き、イオンが流れる例を示しています。'],
];

export function SynapseFigure() {
  const [stage, setStage] = useState(0);
  const uid = useId().replace(/:/g, '');
  return <figure className="neuro-drawing">
    <div className="neuro-figure-heading"><h3>電気の変化が、化学的な伝達につながる</h3><span className="neuro-label">化学シナプス</span></div>
    <svg viewBox="0 0 620 440" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{`シナプスでの伝達：${synapseStages[stage][0]}`}</title>
      <desc id={`${uid}-desc`}>上が送り手の終末、下が受け手の膜。間にはシナプス間隙がある。{synapseStages[stage][1]}</desc>
      <defs><marker id={`${uid}-arrow`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="#cc2939"/></marker></defs>
      <path d="M230 20V58H90V133Q90 216 310 216Q530 216 530 133V58H390V20" fill="#f0f2f4" stroke="#69727a" strokeWidth="2"/>
      <text x="100" y="90" className="neuro-svg-label">送り手の終末</text>
      <path d="M80 411V330Q80 286 190 286H430Q540 286 540 330V411" fill="#f5ece5" stroke="#a09283" strokeWidth="2"/>
      <text x="110" y="387" className="neuro-svg-label">受け手の細胞</text>
      <path d="M88 246H176M450 246H532" stroke="#d3d3d3" strokeWidth="1.5"/>
      <text x="96" y="270" fill="#5d5d5d" fontSize="17">シナプス間隙</text>
      <g opacity={stage === 0 ? 1 : .2}><path d="M305 24V91" stroke="#cc2939" strokeWidth="5" markerEnd={`url(#${uid}-arrow)`}/><path d="M282 38L297 29L285 57L299 49" stroke="#cc2939" strokeWidth="3" fill="none"/><text x="318" y="44" fill="#cc2939" fontSize="17">活動電位</text></g>
      <g stroke="#748b99" fill="#fff" strokeWidth="2"><circle cx="208" cy="141" r="30"/><circle cx="408" cy="123" r="27"/>{stage < 2 && <circle cx="312" cy="161" r="29"/>}</g>
      {[[198,132],[218,133],[208,150],[399,114],[417,121],[405,136],...(stage < 2 ? [[302,155],[321,154],[313,172]] : [])].map(([cx,cy], i) => <circle key={i} cx={cx} cy={cy} r="5" fill="#cc2939" opacity=".7"/>)}
      <path d="M190 172L154 194" stroke="#69727a"/><text x="106" y="210" fontSize="15" fill="#5d5d5d">シナプス小胞</text>
      <g opacity={stage === 1 ? 1 : .35}><rect x="516" y="96" width="23" height="14" rx="4" fill="#365e85"/><rect x="516" y="124" width="23" height="14" rx="4" fill="#365e85"/>{[0,1,2].map(i => <circle key={i} cx={557 + (i % 2) * 20} cy={89 + i * 27} r="6" fill="#365e85"/>)}<text x="548" y="68" fontSize="18" fill="#365e85">Ca²⁺</text>{stage === 1 && <path d="M574 117H474" stroke="#cc2939" strokeWidth="4" markerEnd={`url(#${uid}-arrow)`}/>}</g>
      {stage >= 2 && <g><path d="M284 214Q272 172 310 172Q350 172 337 214" stroke="#748b99" strokeWidth="2" fill="#fff"/>{[[305,203],[321,213],[301,226],[340,234],[259,253],[383,267]].map(([cx,cy], i) => <circle key={i} cx={cx} cy={cy} r="6" fill="#cc2939"/>)}<path d="M320 200L370 178" stroke="#cc2939"/><text x="369" y="174" fontSize="15" fill="#cc2939">神経伝達物質</text></g>}
      {[230,390].map(x => <g key={x}><path d={`M${x-20} 282h15v42h-15q-6-21 0-42M${x+5} 282h15q6 21 0 42h-15Z`} fill={stage === 3 ? '#cc2939' : '#9d938b'} stroke="#776d65" strokeWidth="1.5"/>{stage < 3 && <path d={`M${x-5} 306h10`} stroke="#776d65" strokeWidth="4"/>}</g>)}
      <text x="467" y="319" fontSize="16" fill="#5d5d5d">受容体</text><path d="M452 313H415" stroke="#8a8178"/>
      {stage === 3 && <g><circle cx="213" cy="274" r="6" fill="#cc2939"/><path d="M230 266V354" stroke="#cc2939" strokeWidth="3" markerEnd={`url(#${uid}-arrow)`}/><text x="253" y="356" fill="#cc2939" fontSize="17">イオンが流れる</text></g>}
    </svg>
    <div className="neuro-figure-controls" aria-label="シナプス伝達の段階">{synapseStages.map(([label], i) => <button type="button" key={label} aria-pressed={stage === i} onClick={() => setStage(i)}>{i + 1}　{label}</button>)}</div>
    <figcaption aria-live="polite"><strong>{stage + 1}　{synapseStages[stage][0]}</strong><p>{synapseStages[stage][1]}</p><p className="neuro-caption">配置と大きさは模式的に示しています。受容体には、チャネルを直接開くもののほか、細胞内の反応を介して作用するものもあります。</p></figcaption>
  </figure>;
}

const glialTypes = [
  {name:'アストロサイト',japanese:'星状膠細胞',color:'#3c7562',target:'シナプスの周囲・血管',detail:'枝を伸ばしてシナプスの周囲や血管に接します。細胞外のイオンや神経伝達物質を調整し、代謝や神経活動に関わります。'},
  {name:'オリゴデンドロサイト',japanese:'希突起膠細胞',color:'#66699a',target:'軸索・髄鞘',detail:'突起の先で軸索を包み、髄鞘をつくります。一つの細胞が複数の軸索の一部を包むことができます。信号の伝導と軸索の代謝を支えます。'},
  {name:'ミクログリア',japanese:'小膠細胞',color:'#ae713f',target:'細胞やシナプスの周囲',detail:'枝を伸ばして周囲の状態を監視し、細胞の残骸などを取り込みます。免疫応答に加えて、発達や経験に伴うシナプスの変化にも関わります。'},
];
function BranchCell({x,y,color,scale=1}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">{Array.from({length:7},(_,i) => {const a=i*Math.PI*2/7,dx=Math.cos(a),dy=Math.sin(a);return <g key={i}><path d={`M${dx*10} ${dy*10}L${dx*43} ${dy*43}L${dx*66+dy*12} ${dy*66-dx*12}`}/><path d={`M${dx*35} ${dy*35}L${dx*45-dy*19} ${dy*45+dx*19}`}/></g>;})}<circle r="15" fill={color}/><circle r="6" fill="#fff" opacity=".55" stroke="none"/></g>;
}
export function GliaFigure() {
  const [selected,setSelected]=useState(0);
  const uid=useId();
  const active=glialTypes[selected];
  return <figure className="neuro-drawing">
    <div className="neuro-figure-heading"><h3>グリアは、回路のどこに関わるのか？</h3></div>
    <svg viewBox="0 0 640 470" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>ニューロンとグリア細胞の位置関係</title><desc id={`${uid}-desc`}>{active.name}を強調。{active.detail}図の上側に軸索、右側にシナプス、下側に血管を示す。</desc>
      <path d="M45 140L77 180L48 211M28 175L76 181L102 202M76 180L103 140M68 238L108 212M112 211H462Q491 211 491 232Q492 252 465 252H444" stroke="#4e606d" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M74 178Q105 167 121 195Q147 204 132 222Q105 246 79 222Q88 206 74 178Z" fill="#dce2e6" stroke="#4e606d" strokeWidth="2"/><circle cx="106" cy="207" r="9" fill="#8496a3"/>
      <path d="M442 271Q477 255 514 271L550 311" fill="none" stroke="#4e606d" strokeWidth="8" strokeLinecap="round"/>
      <text x="68" y="118" fontSize="18" fill="#4e606d">ニューロン</text><text x="210" y="255" fontSize="17" fill="#4e606d">軸索</text><text x="507" y="244" fontSize="16" fill="#4e606d">シナプス</text>
      <path d="M56 423H572" stroke="#e9caca" strokeWidth="30" strokeLinecap="round"/><path d="M56 423H572" stroke="#b87171" strokeWidth="2" strokeDasharray="8 6"/><text x="492" y="457" fontSize="17" fill="#8b5353">血管</text>
      <g opacity={selected===1?1:.22}><BranchCell x={307} y={96} color={glialTypes[1].color} scale={.58}/><path d="M291 124Q270 151 247 211M314 124Q345 156 362 211" stroke={glialTypes[1].color} strokeWidth="3" fill="none"/>{[225,278,341].map(x=><g key={x}><rect x={x} y="194" width="41" height="34" rx="12" fill="#bbbcd6" stroke={glialTypes[1].color} strokeWidth="2"/><path d={`M${x+12} 197V225M${x+20} 196V226M${x+28} 197V225`} stroke={glialTypes[1].color} fill="none"/></g>)}<text x="307" y="36" textAnchor="middle" fontSize="18" fill={glialTypes[1].color}>② オリゴデンドロサイト</text><text x="292" y="179" textAnchor="middle" fontSize="16" fill={glialTypes[1].color}>髄鞘</text></g>
      <g opacity={selected===0?1:.22}><BranchCell x={320} y={340} color={glialTypes[0].color} scale={.75}/><path d="M361 312Q407 270 456 269M344 369Q372 396 398 411M294 376L282 409" stroke={glialTypes[0].color} strokeWidth="4" fill="none"/><path d="M268 411H297M384 412H411M448 264L465 268" stroke={glialTypes[0].color} strokeWidth="9" strokeLinecap="round"/><text x="84" y="349" fontSize="18" fill={glialTypes[0].color}>① アストロサイト</text></g>
      <g opacity={selected===2?1:.22}><BranchCell x={519} y={115} color={glialTypes[2].color} scale={.68}/><path d="M505 157Q485 177 479 203" stroke={glialTypes[2].color} strokeWidth="2.5" fill="none"/><text x="510" y="47" textAnchor="middle" fontSize="18" fill={glialTypes[2].color}>③ ミクログリア</text></g>
    </svg>
    <div className="neuro-figure-controls" aria-label="グリア細胞を選ぶ">{glialTypes.map((type,i)=><button type="button" key={type.name} onClick={()=>setSelected(i)} aria-pressed={i===selected} style={{'--figure-accent':type.color}}>{i+1}　{type.name}</button>)}</div>
    <figcaption aria-live="polite"><strong style={{color:active.color}}>{active.name}（{active.japanese}）</strong><p className="neuro-label">関わる場所：{active.target}</p><p>{active.detail}</p><p className="neuro-caption">細胞の形と位置関係を簡略化した模式図です。色は細胞の種類を区別するためにつけています。</p></figcaption>
  </figure>;
}

export { BrainRegionsFigure } from './NeuroscienceBrainMap.jsx';
