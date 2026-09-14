import { useState } from 'react';
import { anovaExample, oneWayAnova, fTail2And18, twoWayExample, twoWayAnova2x2, fTail1And16 } from './experimentMath.js';

const showP=p=>p<.0001?'< 0.0001':p.toFixed(4);
function AnovaTable({rows,error}){return <>
 <div className="table-scroll"><table className="data-table anova-result-table"><thead><tr><th>調べること</th><th>F値</th><th>p値</th></tr></thead><tbody>{rows.map(row=><tr key={row.name}><th>{row.name}</th><td>{row.f.toFixed(2)}</td><td><strong>{showP(row.p)}</strong></td></tr>)}</tbody></table></div>
 <details><summary>平方和・自由度も含めた表を見る</summary><div className="table-scroll"><table className="data-table"><thead><tr><th>要因</th><th>平方和（SS）</th><th>自由度（df）</th><th>平均平方（MS）</th><th>F値</th><th>p値</th></tr></thead><tbody>{rows.map(row=><tr key={row.name}><th>{row.name}</th><td>{row.ss.toFixed(2)}</td><td>{row.df}</td><td>{row.ms.toFixed(2)}</td><td>{row.f.toFixed(2)}</td><td>{showP(row.p)}</td></tr>)}<tr><th>誤差（残差）</th><td>{error.ss.toFixed(2)}</td><td>{error.df}</td><td>{error.ms.toFixed(2)}</td><td>—</td><td>—</td></tr></tbody></table></div><p>平方和は、ずれを二乗して足した数。平均平方は、それを自由度で割った数です。各要因の平均平方を、誤差の平均平方で割るとF値になります。「誤差」の行には、説明しきれなかった人ごとのばらつきが入ります。</p></details>
 </>;}

export function OneWayExplorer(){
 const [gap,setGap]=useState(4),[spread,setSpread]=useState(2);
 const groups=anovaExample(gap,spread),result=oneWayAnova(groups),p=fTail2And18(result.f);
 const sx=x=>72+x/60*510;
 const rows=[{name:'画面の種類',ss:result.between,df:result.dfBetween,ms:result.msBetween,f:result.f,p}];
 return <div className="explorer"><div className="explorer-heading"><h3>群の間の差と、群の中のばらつき</h3><span>架空の21人・各群7人</span></div>
  <svg className="plot teaching-plot" viewBox="0 0 640 300" role="img" aria-label={`一元配置分散分析の例。3群の平均は${result.means.join('、')}秒。F値${result.f.toFixed(2)}、p値${showP(p)}。点は個々の参加者、縦線は群の平均。`}>
   {[0,20,40,60].map(x=><g key={x}><line x1={sx(x)} x2={sx(x)} y1="28" y2="220" className="grid"/><text x={sx(x)} y="250" textAnchor="middle">{x}</text></g>)}
   {groups.map((group,i)=>{const y=55+i*70;return <g key={i}><text x="20" y={y+6}>{['A','B','C'][i]}</text><line x1={sx(0)} x2={sx(60)} y1={y} y2={y} className="grid"/>{group.map((x,j)=><circle key={j} cx={sx(x)} cy={y+(j%2?8:-8)} r="5" fill="#cc2939"/>)}<line x1={sx(result.means[i])} x2={sx(result.means[i])} y1={y-23} y2={y+23} stroke="#111" strokeWidth="3"/></g>;})}
   <text x="327" y="285" textAnchor="middle">操作時間（秒）</text>
  </svg>
  <div className="distribution-controls"><label>群の平均の間隔：{gap}秒<input type="range" min="0" max="10" step="1" value={gap} onChange={e=>setGap(+e.target.value)}/></label><label>群内の広がり：{spread}倍<input type="range" min="1" max="4" step="1" value={spread} onChange={e=>setSpread(+e.target.value)}/></label></div>
  <p className="explainer">赤い点は一人ずつの時間、黒い縦線は各群の平均です。スライダーを動かすと、図と下の計算結果が一緒に変わります。</p>
  <h4>このデータの分散分析の結果</h4>
  <AnovaTable rows={rows} error={{ss:result.within,df:result.dfWithin,ms:result.msWithin}}/>
  <div className="histogram-reading" aria-live="polite"><h4>「画面の種類」の行を読む</h4><p>平均は、Aが{result.means[0]}秒、Bが{result.means[1]}秒、Cが{result.means[2]}秒です。調べる仮説は「3つの画面の母平均は、すべて同じ」です。</p><p>{p<=.05?`p値は${showP(p)}で、0.05より小さい値です。前もって有意水準を0.05に決めていたなら、「3つとも同じ平均」という仮説を退けます。どこかには平均の違いがありそうだ、と読みます。`:`p値は${showP(p)}です。有意水準0.05では、「3つとも同じ平均」という仮説を退けるだけの結果は得られていません。「同じだと証明できた」という意味ではありません。`}</p><p>この表だけでは、AとB、BとC、AとCのどの組に違いがあるかまでは分かりません。図の平均の位置と、次に必要な比較を考えます。</p></div>
 </div>;
}

export function InteractionExplorer(){
 const [interaction,setInteraction]=useState(false);
 const cells=twoWayExample(interaction),result=twoWayAnova2x2(cells),lines=result.means;
 const rows=[{name:'サイズ',...result.size},{name:'コントラスト',...result.contrast},{name:'交互作用',...result.interaction}].map(row=>({...row,p:fTail1And16(row.f)}));
 const sy=y=>240-y/50*200;
 return <div className="explorer"><div className="explorer-heading"><h3>効果が、もう一つの条件で変わる？</h3><span>架空の20人・4条件に5人ずつ</span></div>
  <div className="segmented" role="group" aria-label="交互作用の例"><button aria-pressed={!interaction} onClick={()=>setInteraction(false)}>平行なパターン</button><button aria-pressed={interaction} onClick={()=>setInteraction(true)}>交互作用のパターン</button></div>
  <svg className="plot teaching-plot" viewBox="0 0 600 330" role="img" aria-label={interaction?'20人の架空データ。小→大の平均時間。低コントラストは40→20秒、高コントラストは20→40秒。ボタンの効果が逆転する。':'20人の架空データ。小→大の平均時間。低コントラストは40→30秒、高コントラストは30→20秒。どちらも10秒短くなる。'}>
   {[0,20,40].map(y=><g key={y}><line x1="80" x2="520" y1={sy(y)} y2={sy(y)} className="grid"/><text x="65" y={sy(y)+5} textAnchor="end">{y}</text></g>)}<text x="80" y="24">操作時間（秒）</text>
   {cells.map((row,i)=>row.map((cell,j)=>cell.map((value,k)=><circle key={`${i}-${j}-${k}`} cx={140+j*320+(i?12:-12)+(k-2)*4} cy={sy(value)} r="3.5" fill={i?'#111':'#cc2939'} fillOpacity=".45"/>)))}
   {lines.map((values,i)=><g key={i}><line x1="140" x2="460" y1={sy(values[0])} y2={sy(values[1])} stroke={i?'#111':'#cc2939'} strokeWidth="3" strokeDasharray={i?'8 5':undefined}/>{values.map((v,j)=><circle key={j} cx={140+j*320} cy={sy(v)} r="6" fill={i?'#111':'#cc2939'}/>)}</g>)}
   <text x="140" y="276" textAnchor="middle">小</text><text x="460" y="276" textAnchor="middle">大</text><text x="300" y="315" textAnchor="middle">ボタンのサイズ</text>
  </svg>
  <div className="histogram-legend"><span><i className="line-key accent-line"/>低コントラスト</span><span><i className="line-key dashed-line"/>高コントラスト</span></div>
  <p className="explainer">小さい点が一人ずつの時間、大きい点と線が各条件の平均です。4条件には、それぞれ別々の5人が参加したとします。切り替えると、データと下の計算結果も変わります。</p>
  <h4>このデータの分散分析の結果</h4><AnovaTable rows={rows} error={result.error}/>
  <div className="histogram-reading" aria-live="polite"><h4>まず「交互作用」、次に各要因の行を読む</h4>
   {interaction?<><p><strong>交互作用のp値は0.0001未満</strong>です。有意水準0.05では、「サイズの効果は、コントラストによらず同じ」という仮説を退けます。</p><p>図を見ると、大きくしたときに低コントラストでは20秒速く、高コントラストでは20秒遅くなっています。「大きいほうがよい」と一言ではまとめられません。</p><p>サイズとコントラストのp値は、どちらも1.0000です。両方を平均すると、反対向きの違いが打ち消し合うためです。この2行だけで「どちらも関係がない」と判断すると、組み合わせの違いを見落とします。</p></>:<><p><strong>交互作用のp値は1.0000</strong>です。有意水準0.05では、コントラストによってサイズの効果が変わるとは言えない結果です。図でも2本の線は平行です。ただし、交互作用がないと証明したわけではありません。</p><p><strong>サイズとコントラストのp値は、どちらも{showP(rows[0].p)}</strong>で、0.05より小さくなっています。それぞれについて、平均の違いが見つかったと読みます。</p><p>差の方向は図に戻って読みます。この例では、大きいボタンは平均10秒速く、高コントラストも平均10秒速い、という結果です。</p></>}
  </div>
  <p className="explainer">ここでは前もって各検定の有意水準を0.05に決めたとします。p値は、参加者が独立で、各条件の誤差が正規分布に従い、ばらつきが同じという前提で計算しています。</p>
  <details><summary>計算に使った20人のデータを見る</summary><div className="table-scroll"><table className="data-table"><thead><tr><th>条件</th><th>操作時間（秒）</th></tr></thead><tbody>{cells.map((row,i)=>row.map((cell,j)=><tr key={`${i}-${j}`}><th>{['低','高'][i]}コントラスト・{['小','大'][j]}</th><td>{cell.join('、')}</td></tr>))}</tbody></table></div></details>
 </div>;
}

export function ConfidenceIntervalFigure(){return <figure className="confidence-figure">
 <svg className="plot population-plot" viewBox="0 0 640 200" role="img" aria-label="対応のある12人の例。平均差の推定値5秒、95%信頼区間は約0.4秒から9.6秒。帰無仮説の0秒は区間の外。">
  <line x1="66" x2="66" y1="32" y2="134" stroke="#cc2939" strokeWidth="2" strokeDasharray="6 5"/>
  <line x1="86" x2="546" y1="83" y2="83" stroke="#111" strokeWidth="4"/>
  {[86,546].map(x=><line key={x} x1={x} x2={x} y1="70" y2="96" stroke="#111" strokeWidth="3"/>)}
  <circle cx="316" cy="83" r="7" fill="#cc2939"/>
  <text x="86" y="54" textAnchor="middle">0.4</text><text x="316" y="54" textAnchor="middle">平均差 5</text><text x="546" y="54" textAnchor="middle">9.6</text>
  <text x="66" y="161" textAnchor="middle">0</text><text x="566" y="161" textAnchor="middle">10</text>
  <text x="316" y="161" textAnchor="middle">A − Bの時間差（秒）</text>
 </svg><figcaption>横線：95%信頼区間　／　赤い破線：「平均差は0」の位置</figcaption>
 </figure>;}
