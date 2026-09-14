import {useState} from 'react';
const labels={purpose_reading:'読書',purpose_work:'仕事',purpose_chat:'会話',material_wood:'木',material_steel:'金属',material_fabric:'布',style_natural:'自然な印象',style_sharp:'シャープ',style_soft:'柔らかな印象'};
const colors={purpose:'#b6293a',material:'#24628a',style:'#38765b'};
const offsets={purpose_reading:[-18,-38],material_wood:[-35,-5],style_natural:[10,26],purpose_work:[-5,-40],material_steel:[-45,3],style_sharp:[-8,35],purpose_chat:[-30,40],material_fabric:[15,-36],style_soft:[20,10]};
const mainProfiles=[['reading','wood','natural'],['work','steel','sharp'],['chat','fabric','soft']];
const words={reading:'読書',work:'仕事',chat:'会話',wood:'木',steel:'金属',fabric:'布',natural:'自然な印象',sharp:'シャープ',soft:'柔らかな印象'};
const sx=v=>210+v*70,sy=v=>180-v*70;
function Axes(){return <>{[-2,-1,0,1,2].map(v=><g key={v}><line x1={sx(v)} x2={sx(v)} y1="32" y2="328" stroke={v===0?'#aaa':'#e7e7e7'}/><line x1="62" x2="358" y1={sy(v)} y2={sy(v)} stroke={v===0?'#aaa':'#e7e7e7'}/><text x={sx(v)} y="349" textAnchor="middle">{v}</text><text x="52" y={sy(v)+5} textAnchor="end">{v}</text></g>)}<text x="210" y="377" textAnchor="middle">第1軸</text><text x="66" y="21">第2軸</text></>;}
export function CategoryPatternPlots({id,example}){
 const [selected,setSelected]=useState(-1);
 const cats=example.output.rows.map(r=>({key:r[0],x:r[1],y:r[2]}));
 const pi=example.sampleProfiles.columns;
 const profiles=example.sampleProfiles.rows.map(row=>({keys:['purpose','material','style'].map(c=>row[pi.indexOf(c)]),n:row[pi.indexOf('人数')],x:row[pi.indexOf('軸1')],y:row[pi.indexOf('軸2')]}));
 const chosen=selected<0?null:mainProfiles[selected];
 const activeKeys=chosen?.map((v,i)=>`${['purpose','material','style'][i]}_${v}`);
 const selectedRow=chosen&&profiles.find(p=>p.keys.every((v,i)=>v===chosen[i]));
 const title=id==='quant3'?'カテゴリースコアの散布図':'カテゴリー座標の散布図';
 return <div className="category-patterns"><h3>カテゴリーと回答者のまとまりを読む</h3><p>60人が、椅子の「利用目的・素材・印象」を一つずつ選んだ架空の例です。回答の傾向を追えるように構成しています。図の点は、0/1の回答表から計算したスコアの位置です。</p><div className="segmented" role="group" aria-label="元の回答と配置を照合する"><button aria-pressed={selected<0} onClick={()=>setSelected(-1)}>すべて見る</button>{mainProfiles.map((p,i)=><button key={p[0]} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{p.map(v=>words[v]).join('・')}</button>)}</div><p className="note" aria-live="polite">{selectedRow?<>この組み合わせを選んだのは<strong>{selectedRow.n}人</strong>です。上の図では当てはまる3カテゴリー、下の図ではその回答者の位置を強調しています。</>:<>元の回答では「読書・木・自然」が16人、「仕事・金属・シャープ」が14人、「会話・布・柔らかい」が12人です。ほかの18人には、これらを取り混ぜた回答があります。</>}</p>
 <figure className="method-coordinate category-map"><figcaption><strong>{title}</strong></figcaption><svg viewBox="0 0 420 390" role="img" aria-label="9カテゴリーを第1軸と第2軸に配置。読書・木・自然な印象、仕事・金属・シャープ、会話・布・柔らかな印象がそれぞれ近くに位置します。"><Axes/>{cats.map(p=>{const [dx,dy]=offsets[p.key],active=!chosen||activeKeys.includes(p.key),color=active?colors[p.key.split('_')[0]]:'#bbb';return <g key={p.key} opacity={active?1:.4}><line x1={sx(p.x)} y1={sy(p.y)} x2={sx(p.x)+dx} y2={sy(p.y)+dy-4} stroke={color}/><circle cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill={color}/><text x={sx(p.x)+dx} y={sy(p.y)+dy} textAnchor={dx<0?'end':'start'} fill={color}>{labels[p.key]}</text></g>;})}</svg><figcaption className="category-legend"><span style={{color:colors.purpose}}>● 利用目的</span><span style={{color:colors.material}}>● 素材</span><span style={{color:colors.style}}>● 印象</span></figcaption></figure>
 <p>例えば「仕事・金属・シャープ」が近い位置にあります。元の表でも、その3つを一緒に選んだ人が14人いる、と確認できます。色は<strong>質問の種類</strong>を示しており、分類したグループの色ではありません。</p>
 <figure className="method-coordinate sample-map"><figcaption><strong>{id==='quant3'?'サンプルスコアの散布図（回答者）':'回答者の座標の散布図'}</strong></figcaption><svg viewBox="0 0 420 390" role="img" aria-label="60人を回答の組み合わせごとに表示。同じ回答の人は同じ位置に重なるため、円の面積を人数に比例させています。3つの代表的な回答の間にも、混ざった回答の人がいます。"><Axes/>{profiles.map(p=>{const active=chosen&&p.keys.every((v,i)=>v===chosen[i]);return <g key={p.keys.join('-')}><title>{`${p.keys.map(v=>words[v]).join('・')}：${p.n}人`}</title><circle cx={sx(p.x)} cy={sy(p.y)} r={3.8*Math.sqrt(p.n)} fill={active?'#b6293a':'#69757c'} opacity={chosen&&!active ? .35 : .85}/>{p.n>=10&&<text x={sx(p.x)} y={sy(p.y)+5} textAnchor="middle" fill="white" style={{fontSize:16}}>{p.n}</text>}</g>;})}</svg><figcaption>同じ回答の人は同じ位置です。円の面積は人数に比例し、大きい円内の数字も人数です。</figcaption></figure>
 <p>大きい3つの円の間にも点があります。混ざった回答をした人まで無理に3群に分けるのでなく、<strong>どんな回答が近く、どこに中間の回答があるか</strong>を読みます。この解析はグループ番号を確定するクラスター分析ではありません。</p><p className="small-note">カテゴリーと回答者は別の図で読んでいます。別の種類の点どうしの距離を、直接「関係の強さ」とはしません。配置はデータで変わり、常に3つのまとまりになるわけではありません。</p></div>;
}
