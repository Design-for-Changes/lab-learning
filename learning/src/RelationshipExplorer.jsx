import { useState } from 'react';

const patterns=[
 {id:'straight',label:'直線',name:'一定のペースで変わる',fn:x=>44-3*x,body:'Xが1増えるたびに、Yが3ずつ減ります。このように、同じ幅で進むと同じだけ変わる関係は、直線で表せます。'},
 {id:'level',label:'頭打ち',name:'最初は変わるが、だんだん落ち着く',fn:x=>15+29*Math.exp(-.5*x),body:'最初は大きく下がり、後になるほど下がり方が小さくなります。例えば、練習で操作が速くなるものの、次第に改善が小さくなるような形です。'},
 {id:'turn',label:'U字',name:'途中で、変化の向きが逆になる',fn:x=>12+1.2*(x-5)**2,body:'Xが増えると、初めは下がり、途中から上がります。「ずっと増える」「ずっと減る」という一本の直線では、この形を表せません。'},
 {id:'wave',label:'繰り返す',name:'上がる・下がるを繰り返す',fn:x=>28+10*Math.sin(Math.PI*x/3),body:'波のように上がったり下がったりします。例えば、時間帯によって混雑が繰り返すような形です。こうした規則性もパターンです。'},
];
export default function RelationshipExplorer(){
 const [selected,setSelected]=useState('straight');
 const pattern=patterns.find(item=>item.id===selected),sx=x=>70+x*49,sy=y=>260-y*4.4;
 const curve=Array.from({length:101},(_,i)=>{const x=i/10;return `${i?'L':'M'}${sx(x)},${sy(pattern.fn(x))}`;}).join(' ');
 const offsets=[2,-2,1,3,-3,0,2,-1,-2,3,-1];
 return <div className="explorer"><div className="explorer-heading"><h3>点の並びには、どんな形がある？</h3><span>形を比べるための架空の例</span></div>
  <div className="segmented" role="group" aria-label="関係の形">{patterns.map(item=><button key={item.id} aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}>{item.label}</button>)}</div>
  <svg className="plot teaching-plot" viewBox="0 0 640 330" role="img" aria-label={`${pattern.label}の関係。${pattern.name}。点は架空の観測値、線は傾向を表すモデル。`}>
   {[0,20,40].map(y=><g key={y}><line x1="70" x2="560" y1={sy(y)} y2={sy(y)} className="grid"/><text x="55" y={sy(y)+6} textAnchor="end">{y}</text></g>)}
   <line x1="70" x2="560" y1="260" y2="260" className="axis"/>
   {[0,5,10].map(x=><text key={x} x={sx(x)} y="289" textAnchor="middle">{x}</text>)}
   <text x="70" y="28">結果 Y</text><text x="315" y="324" textAnchor="middle">調べる値 X</text>
   <path d={curve} fill="none" stroke="#cc2939" strokeWidth="3"/>
   {offsets.map((offset,x)=><circle key={x} cx={sx(x)} cy={sy(pattern.fn(x)+offset)} r="5" fill="#111"/>)}
  </svg>
  <div className="histogram-reading" aria-live="polite"><h4>{pattern.name}</h4><p>{pattern.body}</p></div>
  <p className="explainer">点が一人ずつの測定値、赤い線が傾向を表すモデルです。実際のデータは、線の上にぴったり並ぶとは限りません。</p>
 </div>;
}
