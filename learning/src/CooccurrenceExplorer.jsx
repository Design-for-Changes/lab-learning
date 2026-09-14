import { useState } from 'react';
import data from './cooccurrenceData.json';
import { cooccurrenceCounts } from './cooccurrenceMath.js';

const {words,documents}=data;
const {binary,counts}=cooccurrenceCounts(documents,words);
const positions=[[95,65],[95,255],[400,65],[400,255]];

export default function CooccurrenceExplorer(){
 const [threshold,setThreshold]=useState(1);
 const edges=words.flatMap((_,i)=>words.flatMap((_,j)=>j>i&&counts[i][j]>=threshold?[[i,j,counts[i][j]]]:[]));
 return <div className="explorer">
  <h3>1．短い感想を、単語の有無に直す</h3>
  <p>架空の家具の感想6件です。今回は「椅子・机・軽い・丈夫」の4語を選び、<strong>同じ感想の中に一緒に出たら、共起した</strong>と数えます。1行が感想1件。語があれば1、なければ0です。</p>
  <div className="table-scroll"><table className="data-table"><thead><tr><th>感想</th><th>原文</th>{words.map(word=><th key={word}>{word}</th>)}</tr></thead><tbody>{documents.map((doc,i)=><tr key={doc.id}><th>{doc.id}</th><td>{doc.text}</td>{binary[i].map((value,j)=><td key={j}>{value}</td>)}</tr>)}</tbody></table></div>
  <p>感想2に「椅子」が2回出ても、この表では1です。実際の文章では、まず語を取り出し、「いす／椅子」などの表記をそろえるルールを決めます。ここでは、取り出した語をあらかじめ用意しました。</p>
  <h3>2．二つの列が、両方1の行を数える</h3>
  <p>「椅子」と「軽い」が両方1なのは感想1・2・3。共起した感想は<strong>3件</strong>です。二つの列の同じ行を掛け、足しても求められます。</p>
  <p className="note"><strong>1×1 ＋ 1×1 ＋ 1×1 ＋ 0×0 ＋ 0×0 ＋ 0×1 ＝ 3</strong><br/>両方1の行だけが、合計に1を足します。</p>
  <div className="table-scroll"><table className="data-table ai-adjacency"><caption>共起件数の行列：行と列の語が、同じ感想に出た件数</caption><thead><tr><th>語</th>{words.map(word=><th key={word}>{word}</th>)}</tr></thead><tbody>{counts.map((row,i)=><tr key={i}><th>{words[i]}</th>{row.map((value,j)=><td key={j}>{value}</td>)}</tr>)}</tbody></table></div>
  <p>斜めの「椅子×椅子」の3は、椅子が出た感想の件数です。自分自身と結ぶ線には使いません。上の0/1の行列をXとすると、行と列を入れ替えた<strong>転置行列Xᵀ</strong>とXの積、<strong>XᵀX</strong>で、この表をまとめて計算できます。</p>
  <h3>3．共起した語どうしを、線で結ぶ</h3>
  <label className="control">線を引く最低共起件数：{threshold}件<input type="range" min="1" max="3" step="1" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></label>
  <svg className="plot" viewBox="0 0 500 320" role="img" aria-label={`共起ネットワーク。${threshold}件以上の共起を${edges.length}本の線で表示。${edges.map(([i,j,n])=>`${words[i]}と${words[j]}は${n}件`).join('。')}`}>
   {edges.map(([i,j,n])=>{const [x1,y1]=positions[i],[x2,y2]=positions[j],fraction=x1!==x2&&y1!==y2?.38:.5,x=x1+(x2-x1)*fraction,y=y1+(y2-y1)*fraction;return <g key={`${i}-${j}`}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cc2939" strokeWidth={n*2}/><rect x={x-15} y={y-13} width="30" height="26" rx="6" fill="white"/><text x={x} y={y+6} textAnchor="middle">{n}</text></g>;})}
   {words.map((word,i)=><g key={word}><circle cx={positions[i][0]} cy={positions[i][1]} r="34" fill="white" stroke="#333" strokeWidth="2"/><text x={positions[i][0]} y={positions[i][1]+6} textAnchor="middle">{word}</text></g>)}
  </svg>
  <p aria-live="polite"><strong>表示中：{edges.length}本。</strong>線の数字と太さは共起件数です。点の大きさは全部同じで、位置は読みやすいように固定しています。</p>
  <p>2件以上にすると「椅子−軽い」と「机−丈夫」が残ります。消えた線の共起が0になったわけではありません。<strong>表示する条件を変えた</strong>だけです。「軽いから椅子を選ぶ」といった原因や、好意的な評価までは、この図だけでは分かりません。元の感想に戻って確認します。</p>
  <details><summary>よく出る語ほど、線が多くならない？</summary><p>なりやすいので、件数に加えて、語が現れた件数に対する割合も考えます。例えば<strong>Jaccard係数</strong>は「両方が出た件数 ÷ 少なくとも片方が出た件数」。椅子と軽いなら3÷（3＋4−3）＝0.75です。01の集合の共通部分と和集合を使っています。使う指標が違えば、図も変わります。</p></details>
 </div>;
}
