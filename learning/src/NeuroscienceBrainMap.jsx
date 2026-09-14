import PageLink from './PageLink.jsx';
import { useId, useState } from 'react';

const regions = {
  frontal: {name:'前頭葉', color:'#bf7768', pale:'#f3dcd5', position:'大脳の前方。頭頂葉の前、側頭葉の上にあります。', function:'運動の準備・実行、目標やルールに沿った行動など。', connection:'運動に関わる領域は頭頂葉・大脳基底核・視床などと、前頭前野は記憶や注意に関わる領域などとやりとりします。', note:'「前頭前野」は前頭葉の一部です。前頭葉全体と同じ意味ではありません。'},
  parietal: {name:'頭頂葉', color:'#aa903f', pale:'#efe6bd', position:'大脳の上側から後方。前頭葉の後ろ、側頭葉の上にあります。', function:'身体の感覚、空間の把握、注意、視覚を使った動作の制御など。', connection:'後頭葉などからの視覚情報と、身体の感覚を関係づけ、前頭葉の運動に関わる領域などへつなぎます。'},
  occipital: {name:'後頭葉', color:'#6186ad', pale:'#dce7f1', position:'大脳のいちばん後ろ側。小脳の上方にあります。', function:'視覚情報の処理。一次視覚野もここにあります。', connection:'視床の外側膝状体から一次視覚野へ届く信号が、さらに側頭葉や頭頂葉の視覚領域などへ広がります。'},
  temporal: {name:'側頭葉', color:'#5d8b74', pale:'#dcece1', position:'大脳の左右の側面の下部。前頭葉・頭頂葉の下にあります。', function:'聴覚、対象の認識、言葉の意味や記憶など。', connection:'後頭葉の視覚領域や前頭葉などとつながります。内側には、海馬や扁桃体があります。', note:'外側から見える皮質と、その奥にある海馬・扁桃体は、別の構造として見分けます。'},
  cerebellum: {name:'小脳', color:'#968378', pale:'#e9e1da', position:'大脳の後ろ下方。脳幹の背側にあります。', function:'運動のタイミングや精度の調整、運動学習など。', connection:'身体の感覚や運動に関する情報を受け、脳幹や視床を介した回路などを通じて運動に関わります。'},
  brainstem: {name:'脳幹', color:'#7c8990', pale:'#e2e8eb', position:'大脳と脊髄の間。中脳・橋・延髄から成ります。', function:'呼吸・循環・覚醒などの調整、感覚や運動の伝達など。', connection:'大脳・小脳・脊髄をつなぐ経路が通り、多数の神経核も含まれます。'},
  thalamus: {name:'視床', color:'#bf7768', pale:'#f3dcd5', position:'左右の半球の間に近い深部。脳幹の上方に、左右一組あります。', function:'核ごとに、感覚の中継や皮質の活動の調整などを担います。', connection:'外側膝状体は視覚皮質、背内側核は前頭前野など、核によって相手が異なります。', note:'「視床」という一つの名前で、すべて同じ処理をしているわけではありません。'},
  basal: {name:'大脳基底核', color:'#6186ad', pale:'#dce7f1', position:'大脳皮質の内側にある複数の神経核。この図は尾状核・被殻・淡蒼球のおおよその配置を示します。', function:'行動の選択・開始の調整や、学習など。', connection:'大脳皮質から入力を受け、視床を経て皮質に戻る回路などをつくります。', note:'一つの塊ではありません。機能的なまとまりには、図に省略した黒質や視床下核なども含みます。'},
  hippocampus: {name:'海馬', color:'#5d8b74', pale:'#dcece1', position:'側頭葉の内側。前後に長く、曲がった形をしています。', function:'新しい出来事や場所に関する記憶の形成・想起など。', connection:'周辺の皮質を介して、大脳皮質のさまざまな情報と関わります。', note:'すべての記憶を保管する一つの箱ではありません。'},
  amygdala: {name:'扁桃体', color:'#aa903f', pale:'#efe6bd', position:'側頭葉の内側、海馬の前方にあります。', function:'経験の情動的な重要性の学習、身体の反応との関係など。', connection:'感覚・記憶に関わる皮質、前頭前野、視床下部や脳幹などと相互に関わります。', note:'恐怖だけを担当する場所ではありません。'},
};
const views = [
  {id:'surface', name:'外側', title:'左側から見た脳', lead:'大脳を四つの葉に分け、その後ろ下方にある小脳と、脊髄へ続く脳幹を見ます。', ids:['frontal','parietal','temporal','occipital','cerebellum','brainstem']},
  {id:'central', name:'中央付近', title:'前から見た断面の模式図', lead:'表面の皮質を通り越して、左右の半球の内側を見ます。視床と大脳基底核は、どちらも左右にあります。', ids:['thalamus','basal']},
  {id:'temporal', name:'側頭葉の内側', title:'左側から、表面を透かして見た模式図', lead:'外側からは見えない海馬と扁桃体を、側頭葉の位置と重ねて示します。ここでは左側の構造を示しています。', ids:['hippocampus','amygdala']},
];
const lobePaths = {
  frontal:'M86 243C42 220 52 153 91 124C100 85 141 60 186 61C227 35 273 37 305 44C309 98 280 142 279 192L251 218Q183 209 161 268Q121 268 86 243Z',
  parietal:'M305 44Q350 50 390 45C451 40 488 74 511 111L471 205L392 221L279 192C280 142 309 98 305 44Z',
  occipital:'M511 111C564 132 579 185 551 229C572 258 529 290 482 291L452 271L471 205Z',
  temporal:'M161 268Q182 209 251 218L279 192Q317 220 392 221L471 205L452 271L482 291C464 334 384 350 353 301C300 325 252 317 220 286Q186 292 161 268Z',
  cerebellum:'M402 290Q467 270 518 310Q549 354 496 375Q440 398 399 350Z',
  brainstem:'M354 298Q355 339 379 373L385 411H419L409 369Q393 335 404 308Z',
};
function keyboard(event, action) { if(event.key==='Enter'||event.key===' '){event.preventDefault();action();} }

function MapLabel({id,x,y,path,anchor='start',target}) {
    return <g {...target(id)} className="neuro-atlas-label">
      <path d={path} fill="none" stroke={regions[id].color} strokeWidth="2.5"/>
      <text x={x} y={y} textAnchor={anchor} fill="#26313a" paintOrder="stroke" stroke="#fff" strokeWidth="7" strokeLinejoin="round">{regions[id].name}</text>
    </g>;
  }

export function BrainRegionsFigure() {
  const [viewIndex,setViewIndex] = useState(0);
  const [selected,setSelected] = useState('frontal');
  const uid=useId();
  const view=views[viewIndex], active=regions[selected];
  const pick=id=>setSelected(id);
  const target=id=>({role:'button',tabIndex:0,'aria-label':`${regions[id].name}を図で選ぶ`,'aria-pressed':selected===id,onClick:()=>pick(id),onKeyDown:e=>keyboard(e,()=>pick(id))});
  const fill=id=>selected===id?regions[id].color:regions[id].pale;
  return <figure className="neuro-atlas">
    <div className="neuro-figure-heading"><h3>脳地図：部位の位置と働き</h3></div>
    <div className="neuro-switches" aria-label="脳を見る位置">{views.map((item,i)=><button type="button" key={item.id} aria-pressed={viewIndex===i} onClick={()=>{setViewIndex(i);setSelected(item.ids[0]);}}>{item.name}</button>)}</div>
    <p className="neuro-atlas-view"><strong>{view.title}</strong><span>{view.lead}</span></p>
    <svg className="neuro-atlas-map" viewBox="0 0 660 500" role="group" aria-labelledby={`${uid}-map`}>
      <title id={`${uid}-map`}>{`${view.title}。部位名または図形を選ぶと、下の説明が切り替わります。`}</title>
      {view.id!=='central' && <>
        <text x="40" y="58" className="neuro-atlas-direction">前（顔側）</text><text x="530" y="58" className="neuro-atlas-direction">後</text>
        <g transform="translate(0 55)" opacity={view.id==='surface'?1:.25}>
          {['brainstem','cerebellum','frontal','parietal','occipital','temporal'].map(id=><path key={id} d={lobePaths[id]} fill={view.id==='surface'?fill(id):regions[id].pale} stroke={regions[id].color} strokeWidth={selected===id?4:2} {...(view.id==='surface'?target(id):{})}/>)}
          <g fill="none" stroke="#6b6560" strokeWidth="2" opacity=".3" pointerEvents="none"><path d="M92 188Q136 147 185 183M101 135Q141 109 185 124M154 83Q197 84 211 126M226 67Q252 85 242 132M100 221Q141 221 165 244M331 78Q367 68 387 108M351 151Q397 121 435 148M409 85Q449 85 468 117M312 190Q350 180 376 197M212 251Q267 225 319 255M274 281Q335 267 368 292M402 251Q429 258 429 294M515 155Q544 188 514 224M496 237Q527 253 500 270"/>{[0,1,2,3].map(i=><path key={i} d={`M410 ${318+i*13}Q470 ${297+i*15} ${516-i*3} ${329+i*10}`}/>)}</g>
        </g>
      </>}
      {view.id==='surface' && <>
        <MapLabel target={target} id="frontal" x={28} y={32} path="M119 37L147 103L175 181"/>
        <MapLabel target={target} id="parietal" x={470} y={32} path="M517 40L472 94L401 171"/>
        <MapLabel target={target} id="occipital" x={635} y={200} anchor="end" path="M581 211L548 251"/>
        <MapLabel target={target} id="temporal" x={28} y={397} path="M132 388L260 337"/>
        <MapLabel target={target} id="cerebellum" x={620} y={452} anchor="end" path="M541 442L481 401"/>
        <MapLabel target={target} id="brainstem" x={245} y={484} path="M354 475L395 440"/>
      </>}
      {view.id==='central' && <>
        <text x="120" y="53" className="neuro-atlas-direction">右半球</text><text x="476" y="53" className="neuro-atlas-direction">左半球</text>
        <path d="M326 97C283 59 195 69 149 111C98 136 81 185 97 225C66 283 110 336 161 357C203 390 257 366 291 330L313 290H347L369 330C403 366 457 390 499 357C550 336 594 283 563 225C579 185 562 136 511 111C465 69 377 59 334 97L330 172Z" fill="#f0ece5" stroke="#aba49b" strokeWidth="3"/>
        <path d="M325 115C273 81 209 99 172 131C126 162 115 190 130 232C109 274 141 318 179 333C217 354 251 331 278 301M335 115C387 81 451 99 488 131C534 162 545 190 530 232C551 274 519 318 481 333C443 354 409 331 382 301" fill="none" stroke="#d1c7b9" strokeWidth="13"/>
        <path d="M283 147Q305 156 323 183L316 206Q294 186 285 184ZM377 147Q355 156 337 183L344 206Q366 186 375 184Z" fill="#fff" stroke="#d0c8bf" strokeWidth="2"/>
        <g {...target('basal')} fill={fill('basal')} stroke={regions.basal.color} strokeWidth={selected==='basal'?4:2}>
          <path d="M248 152Q277 160 295 199L281 218Q257 193 244 176Z M412 152Q383 160 365 199L379 218Q403 193 416 176Z"/>
          <path d="M214 192Q176 211 181 259Q194 282 218 277L244 248Z M446 192Q484 211 479 259Q466 282 442 277L416 248Z"/>
          <path d="M244 248L218 277Q246 295 264 278Z M416 248L442 277Q414 295 396 278Z"/>
        </g>
        <g {...target('thalamus')} fill={fill('thalamus')} stroke={regions.thalamus.color} strokeWidth={selected==='thalamus'?4:2}><ellipse cx="294" cy="258" rx="30" ry="40"/><ellipse cx="366" cy="258" rx="30" ry="40"/></g>
        <path d="M330 177V299" stroke="#fff" strokeWidth="6"/>
        <MapLabel target={target} id="basal" x={28} y={425} path="M170 408L205 272"/>
        <MapLabel target={target} id="thalamus" x={545} y={425} path="M539 408L368 281"/>
        <text x="330" y="469" textAnchor="middle" className="neuro-atlas-direction">表面の皮質の内側に、左右一組ずつ配置される</text>
      </>}
      {view.id==='temporal' && <>
        <path d="M160 320Q218 257 334 277Q426 273 467 333Q443 393 356 365Q253 392 160 320Z" fill="#dcece1" fillOpacity=".2" stroke="#5d8b74" strokeDasharray="8 6" strokeWidth="2"/>
        <path {...target('hippocampus')} d="M281 344C315 342 346 332 380 309Q415 287 425 303Q438 333 404 350Q352 379 289 363Z" fill={fill('hippocampus')} stroke={regions.hippocampus.color} strokeWidth={selected==='hippocampus'?4:2}/>
        <ellipse {...target('amygdala')} cx="255" cy="347" rx="25" ry="22" fill={fill('amygdala')} stroke={regions.amygdala.color} strokeWidth={selected==='amygdala'?4:2}/>
        <MapLabel target={target} id="amygdala" x={28} y={431} path="M124 417L249 357"/>
        <MapLabel target={target} id="hippocampus" x={562} y={431} path="M552 419L373 351"/>
        <text x="328" y="248" textAnchor="middle" className="neuro-atlas-direction">海馬・扁桃体は、側頭葉の奥にある</text>
        <text x="328" y="486" textAnchor="middle" className="neuro-atlas-direction">前方に扁桃体、その後ろへ海馬が伸びる</text>
      </>}
    </svg>
    <p className="neuro-atlas-hint">部位名か図形を選ぶと、同じ部位の説明が下に表示されます。図の細い線は、名前と位置を結ぶ引出線です。</p>
    <div className="neuro-atlas-picks" aria-label="説明する部位">{view.ids.map(id=><button type="button" key={id} aria-pressed={selected===id} onClick={()=>pick(id)} style={{'--atlas-color':regions[id].color,'--atlas-pale':regions[id].pale}}><span aria-hidden="true"/>{regions[id].name}</button>)}</div>
    <figcaption className="neuro-atlas-description" aria-live="polite" style={{'--atlas-color':active.color,'--atlas-pale':active.pale}}>
      <h4>{active.name}</h4><dl><div><dt>位置</dt><dd>{active.position}</dd></div><div><dt>主な働き</dt><dd>{active.function}</dd></div><div><dt>つながり</dt><dd>{active.connection}</dd></div></dl>{active.note&&<p>{active.note}</p>}
    </figcaption>
    <p className="neuro-caption">位置関係を学ぶための模式図です。溝や境界、各構造の形・大きさは簡略化しています。中央付近の図は複数の構造の配置をまとめており、厳密な一枚の断面ではありません。<PageLink href="https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system" target="_blank" rel="noreferrer">解剖学的な位置関係の参考：OpenStax ↗</PageLink></p>
  </figure>;
}
