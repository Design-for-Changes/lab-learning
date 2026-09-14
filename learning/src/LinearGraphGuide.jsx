import { Section } from './Common.jsx';
import { l8Design, l8Interactions } from './designExamples.js';

const nodes=[
 {column:1,x:180,y:70,label:'サイズ',labelY:28},
 {column:2,x:70,y:240,label:'コントラスト',labelY:286},
 {column:4,x:290,y:240,label:'余白',labelY:286},
];
const edgePositions=[[116,153],[244,153],[180,240]];
function Point({x,y,column}){return <g className="linear-point"><circle cx={x} cy={y} r="18"/><text x={x} y={y+7} textAnchor="middle">{column}</text></g>;}
function EdgeNumber({x,y,column}){return <g className="linear-edge-number"><rect x={x-19} y={y-17} width="38" height="34" rx="5"/><text x={x} y={y+7} textAnchor="middle">{column}</text></g>;}

export function LinearGraphGuide(){return <Section id="linear-graphs" title="線点図で、列の使い道を決める">
 <p>直交表のどの列に、サイズやコントラストを入れればよいでしょうか。組み合わせの効果も調べたいとき、その割り付けを考える図が<strong>線点図（せんてんず）</strong>です。</p>
 <ul className="linear-legend"><li><strong>● 点：</strong>サイズなど、一つの項目を置く場所。</li><li><strong>― 線：</strong>両端の項目の交互作用を調べるための場所。</li><li><strong>数字：</strong>その場所に対応する、直交表の列番号。人数や実施順ではありません。</li></ul>
 <div className="explorer linear-example"><h3>L4：3列目は、何に使う？</h3>
  <figure><svg viewBox="0 0 360 175" role="img" aria-label="L4の線点図。1列目のサイズと2列目のコントラストを結ぶ線は3列目に対応する。">
   <line x1="65" y1="80" x2="295" y2="80" className="linear-edge"/>
   <Point x={65} y={80} column={1}/><Point x={295} y={80} column={2}/><EdgeNumber x={180} y={80} column={3}/>
   <text x="65" y="35" textAnchor="middle">サイズ</text><text x="285" y="35" textAnchor="middle">コントラスト</text>
   <text x="180" y="137" textAnchor="middle">線の「3」＝この2項目の交互作用</text>
  </svg><figcaption>点の1・2と、それらを結ぶ線の3を、直交表の列と対応させます。</figcaption></figure>
  <p>サイズを1列目、コントラストを2列目に入れると、この2項目の<strong>交互作用は3列目と重なります。</strong>例えば「見えにくいときだけ、大きくする効果が強まるか」を調べるために使う列です。</p>
  <p>先ほどのL4では、この3列目に「余白」を入れていました。そのため、<strong>余白の効果と、サイズ × コントラストの交互作用を見分けられません。</strong>線の場所にも別の項目を入れると、こうして効果が重なります。</p>
  <p>サイズとコントラストの交互作用を調べたいなら、3列目に余白を入れないようにします。余白も交互作用も調べたいなら、次のように使える列を増やします。</p>
 </div>
 <div className="explorer linear-example"><h3>L8：項目を置く列と、交互作用に使う列を分ける</h3>
  <p>サイズを1列目、コントラストを2列目、余白を4列目に置く例です。各項目は、ここでも2種類の設定に変えます。</p>
  <figure><svg viewBox="0 0 360 310" role="img" aria-label="L8の線点図。点は1列目サイズ、2列目コントラスト、4列目余白。線はサイズとコントラストが3列目、サイズと余白が5列目、コントラストと余白が6列目。">
   {l8Interactions.map(({columns,interaction},i)=>{const a=nodes.find(node=>node.column===columns[0]),b=nodes.find(node=>node.column===columns[1]);return <g key={interaction}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="linear-edge"/><EdgeNumber x={edgePositions[i][0]} y={edgePositions[i][1]} column={interaction}/></g>;})}
   {nodes.map(node=><g key={node.column}><Point {...node}/><text x={node.x} y={node.labelY} textAnchor="middle">{node.label}</text></g>)}
  </svg><figcaption>点は1・2・4列、線は3・5・6列。7列目はこの例では項目を置きません。</figcaption></figure>
  <div className="table-scroll"><table className="data-table design-table"><caption>線の数字は、何を調べる列？</caption><thead><tr><th scope="col">線の列番号</th><th scope="col">調べる交互作用</th></tr></thead><tbody>{l8Interactions.map(({interaction,label})=><tr key={interaction}><th scope="row">{interaction}列目</th><td>{label}</td></tr>)}</tbody></table></div>
  <p><strong>3・5・6列目には、新しい項目を入れません。</strong>実際に作る画面は、1・2・4列目の数字でサイズ・コントラスト・余白を決めます。3・5・6列目は、結果から交互作用を調べるために使います。</p>
  <details><summary>L8の数字の表と、列の対応を見る</summary><p>「1・2」は設定の目印です。サイズなら小・大、コントラストなら低・高、余白なら狭い・広いに置き換えます。色の付いた1・2・4列が、実際の画面を決める列です。</p>
   <div className="table-scroll"><table className="data-table design-table linear-array"><caption>L8（2⁷）：8行・7列</caption><thead><tr><th scope="col">行</th>{Array.from({length:7},(_,i)=><th scope="col" key={i} className={[0,1,3].includes(i)?'design-focus':undefined}>{i+1}列</th>)}</tr></thead><tbody>{l8Design.map((row,i)=><tr key={i}><th scope="row">{i+1}</th>{row.map((level,j)=><td key={j} className={[0,1,3].includes(j)?'design-focus':undefined}>{level}</td>)}</tr>)}</tbody></table></div>
   <p>7列目は、今回の割り付けでは3項目の交互作用に対応します。何も項目を置いていないからといって、自動的に「誤差」として扱えるわけではありません。</p>
  </details>
 </div>
 <p>今回の3項目については、L8の1・2・4列を使うと<strong>全8通りを試すことになります。</strong>L4で4通りに減らすと見分けられなかった効果を、実験を増やして調べる例です。L8を使えば、いつでも実験数が減るわけではありません。</p>
 <p>線点図は、項目と交互作用をどの列に置くかを考えるために使います。結果のばらつきを見積もるための反復や、人数の計画も必要です。また、図と列番号は対応する直交表に合わせて使います。L9などにこの図をそのまま当てはめることはできず、L12にはこの形式の線点図がありません。</p>
 </Section>;}
