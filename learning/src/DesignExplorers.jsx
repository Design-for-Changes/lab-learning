import { useState } from 'react';
import { fullFactorial3, l4Design } from './experimentMath.js';
import { designFactors, rowLabels, l4AverageTimes, l4Comparison } from './designExamples.js';

export function DesignTable(){
 const [fraction,setFraction]=useState(false),rows=fraction?l4Design:fullFactorial3;
 return <div className="explorer"><div className="explorer-heading"><h3>8通りから、4通りを取り出す</h3><span>サイズ・コントラスト・余白</span></div>
  <div className="segmented" role="group" aria-label="実験条件の組み方"><button aria-pressed={!fraction} onClick={()=>setFraction(false)}>全組み合わせ：8条件</button><button aria-pressed={fraction} onClick={()=>setFraction(true)}>L4直交表：4条件</button></div>
  <div className="table-scroll"><table className="data-table design-table"><caption>{fraction?'この4通りを試す：L4直交表':'全8通り。①〜④の行をL4に使う'}</caption><thead><tr>{fraction&&<th scope="col">行</th>}{designFactors.map(factor=><th scope="col" key={factor.name}>{factor.name}</th>)}{!fraction&&<th scope="col">L4に使う行</th>}</tr></thead><tbody>{rows.map(row=>{
   const selected=l4Design.findIndex(candidate=>candidate.every((level,j)=>level===row[j]));
   return <tr key={row.join('-')} className={!fraction&&selected>=0?'design-selected':undefined}>{fraction&&<th scope="row">{rowLabels[selected]}</th>}{row.map((level,j)=><td key={j}>{designFactors[j].levels[level-1]}</td>)}{!fraction&&<td>{selected>=0?<strong>{rowLabels[selected]} 使う</strong>:'—'}</td>}</tr>;
  })}</tbody></table></div>
  <p className="design-reading" aria-live="polite">{fraction?<><strong>①の行は「小さいボタン・低いコントラスト・狭い余白」の画面。</strong>このように、1行で一つの画面の設定を指定します。L4の「4」は4行という意味です。</>:<>すべて試すなら8通り。色の付いた①〜④だけを使うと4通りになります。<strong>「L4直交表：4条件」</strong>を押して、取り出した表を見てください。</>}</p>
  <p className="explainer">①〜④は行を見分ける目印です。この順に実験する、という指定ではありません。また、4行は4人という意味でもありません。</p>
 </div>;
}

export function L4BalanceExplorer(){
 const pairs=[[0,1],[0,2],[1,2]],[selected,setSelected]=useState(0),[a,b]=pairs[selected];
 return <div className="explorer"><div className="explorer-heading"><h3>2列を選んで、組み合わせを数える</h3><span>先ほどの①〜④を並べ替える</span></div>
  <div className="segmented" role="group" aria-label="直交表で比べる2列">{pairs.map(([i,j],index)=><button key={index} aria-pressed={selected===index} onClick={()=>setSelected(index)}>{designFactors[i].name} × {designFactors[j].name}</button>)}</div>
  <div className="table-scroll"><table className="data-table design-table balance-table"><caption>{designFactors[a].name}と{designFactors[b].name}の4つの組み合わせ</caption><thead><tr><th scope="col">{designFactors[a].name} ↓<br/>{designFactors[b].name} →</th>{designFactors[b].levels.map(level=><th scope="col" key={level}>{level}</th>)}</tr></thead><tbody>{[1,2].map(levelA=><tr key={levelA}><th scope="row">{designFactors[a].levels[levelA-1]}</th>{[1,2].map(levelB=>{
   const matching=l4Design.flatMap((row,index)=>row[a]===levelA&&row[b]===levelB?[rowLabels[index]]:[]);
   return <td key={levelB}><strong>{matching.join('・')}</strong><span className="level-tag">{matching.length}回登場</span></td>;
  })}</tr>)}</tbody></table></div>
  <p className="design-reading" aria-live="polite">{designFactors[a].name}が「{designFactors[a].levels[0]}」のときも「{designFactors[a].levels[1]}」のときも、{designFactors[b].name}は「{designFactors[b].levels[0]}」「{designFactors[b].levels[1]}」が1回ずつ登場します。<strong>4つの組み合わせが、同じ回数ずつある</strong>ことを確認してください。</p>
  <p className="explainer">ボタンでほかの2列に替えても、4つの組み合わせは1回ずつです。このL4は、どの2列でもこの並び方になるように作られています。</p>
 </div>;
}

export function L4ResultsExplorer(){
 const [column,setColumn]=useState(0),groups=l4Comparison(column),difference=groups[0].average-groups[1].average;
 return <div className="explorer"><div className="explorer-heading"><h3>どの行をまとめて、平均を比べる？</h3><span>架空の結果・各行に別々の5人</span></div>
  <p>4通りを5人ずつ、合計20人に試してもらい、行ごとの平均時間が次の値だったとします。人数は説明のための例です。</p>
  <div className="segmented" role="group" aria-label="直交表の結果で比べる項目">{designFactors.map((factor,index)=><button key={factor.name} aria-pressed={column===index} onClick={()=>setColumn(index)}>{factor.name}を比べる</button>)}</div>
  <div className="table-scroll"><table className="data-table design-table l4-results"><caption>同じ課題を正しく終えるまでの平均時間</caption><thead><tr><th scope="col">行</th>{designFactors.map((factor,index)=><th scope="col" key={factor.name} className={column===index?'design-focus':undefined}>{factor.name}</th>)}<th scope="col">平均<br/>秒</th></tr></thead><tbody>{l4Design.map((row,i)=><tr key={i}><th scope="row">{rowLabels[i]}</th>{row.map((level,j)=><td key={j} className={column===j?'design-focus':undefined}>{designFactors[j].levels[level-1]}</td>)}<td><strong>{l4AverageTimes[i]}</strong></td></tr>)}</tbody></table></div>
  <div className="concept-pair design-comparison" aria-live="polite">{groups.map(group=><article key={group.label}><h4>「{group.label}」にした行</h4><p>{group.indices.map(i=>rowLabels[i]).join('と')}をまとめる</p><p className="design-calculation">（{group.values.join(' ＋ ')}）÷ 2<br/>＝ <strong>{group.average}秒</strong></p></article>)}</div>
  <p className="design-reading" aria-live="polite">この表では、{designFactors[column].name}が「{groups[1].label}」の行をまとめた平均は、「{groups[0].label}」より<strong>{difference}秒速い</strong>という結果です。</p>
  <p className="explainer">各行の人数が同じなので、行の平均どうしをそのまま平均できます。この差を、その項目だけの効果だと読んでよいかは、次の説明で確かめます。</p>
 </div>;
}

export function L4Limitation(){return <div className="concept-pair design-comparison">{[1,2].map(level=><article key={level}><h3>余白が「{designFactors[2].levels[level-1]}」行</h3><ul>{l4Design.flatMap((row,index)=>row[2]===level?[<li key={index}><strong>{rowLabels[index]}</strong> サイズ{designFactors[0].levels[row[0]-1]} × コントラスト{designFactors[1].levels[row[1]-1]}</li>]:[])}</ul></article>)}</div>;}
