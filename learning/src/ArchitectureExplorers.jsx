import { useState } from 'react';
import { cnnFilters,cnnSamples,cnnForward,attentionWords,attentionVectors,attentionExample,ganReal,ganSeeds,initialGan,ganGenerate,ganJudge,ganLosses,updateGanDiscriminator,updateGanGenerator } from './architectureMath.js';

export function SmallTable({head,rows}){return <div className="table-scroll architecture-table"><table className="data-table"><thead><tr>{head.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;}

function Matrix({values,label,image=false,highlight,selected,onSelect}){
 return <div><p className="architecture-matrix-label"><strong>{label}</strong></p><div className="architecture-matrix" style={{gridTemplateColumns:`repeat(${values[0].length}, 28px)`}} role={onSelect?'group':'img'} aria-label={onSelect?label:`${label}。各行：${values.map(row=>row.join('、')).join('／')}`}>
  {values.flatMap((row,i)=>row.map((value,j)=>{const active=highlight?i>=highlight[0]&&i<highlight[0]+3&&j>=highlight[1]&&j<highlight[1]+3:selected?.[0]===i&&selected?.[1]===j;const style={background:image?(value?'#f7f7f7':'#252525'):value>0?'#f6dce0':value<0?'#deebf7':'white',color:image&&!value?'white':'#222'};return onSelect?<button key={`${i}-${j}`} style={style} aria-label={`出力 ${i+1}行${j+1}列：${value}`} aria-pressed={active} onClick={()=>onSelect([i,j])}>{value}</button>:<span key={`${i}-${j}`} className={active?'architecture-cell-selected':''} style={style}>{image?'':value}</span>;}))}
 </div></div>;
}

export function ConvolutionIntro(){
 const [column,setColumn]=useState(0),pixels=cnnSamples[0].pixels;
 const raw=cnnForward(pixels).raw[0][2][column];
 const middle=[2,3,4].reduce((sum,row)=>sum+pixels[row][column+1],0);
 const sides=[2,3,4].reduce((sum,row)=>sum+pixels[row][column]+pixels[row][column+2],0);
 return <div className="explorer architecture-explorer">
  <h3>同じ小さな窓を、横へ動かす</h3>
  <p>白を1、黒を0とした小さな画像です。赤い窓の中だけに注目します。右へ動かすと、同じ計算で別の場所を調べられます。</p>
  <div className="segmented" role="group" aria-label="畳み込みの窓を動かす"><button disabled={column===0} onClick={()=>setColumn(c=>c-1)}>窓を左へ</button><button disabled={column===4} onClick={()=>setColumn(c=>c+1)}>窓を右へ</button></div>
  <div className="architecture-grids"><Matrix values={pixels} label="画像：赤枠が調べる窓" image highlight={[2,column]}/><Matrix values={cnnFilters[0].values} label="フィルター：掛ける数"/></div>
  <p>このフィルターは、真ん中の列に白いマスがあると加点し、両側の列にあると減点します。<strong>真ん中に白い縦線が通る形へ、大きく反応する見方</strong>です。仕組みを見るために、人が数を決めました。</p>
  <p className="note" aria-live="polite"><strong>窓は左から{column+1}番目。反応は{middle}−{sides}＝{raw}。</strong><br/>{raw===3?'白い縦線が窓の中央に入り、反応が大きくなりました。':raw<0?'白い線が窓の端にあり、今探している並びとは違います。':'窓の中に白い縦線が入っていません。'}</p>
  <p>「窓を右へ」を2回押し、中央の縦線に重ねてみましょう。さらに動かしても、<strong>フィルターの数は同じまま</strong>です。</p>
 </div>;
}

export function CnnExplorer(){
 const [sampleIndex,setSampleIndex]=useState(0),[filterIndex,setFilterIndex]=useState(0),[patch,setPatch]=useState([2,2]);
 const sample=cnnSamples[sampleIndex],result=cnnForward(sample.pixels),raw=result.raw[filterIndex][patch[0]][patch[1]],output=Math.max(0,raw);
 const terms=cnnFilters[filterIndex].values.flatMap((row,i)=>row.map((w,j)=>`${sample.pixels[patch[0]+i][patch[1]+j]}×(${w})`));
 return <div className="explorer architecture-explorer">
  <h3>縦棒か横棒かを、最後まで計算してみる</h3>
  <p>下の3枚は7×7の画像です。白が1、黒が0。まず画像を変え、途中の値と判定がどう変わるか見てください。<strong>この例の重みは、計算を追うために手で設定しています。</strong></p>
  <div className="segmented" role="group" aria-label="CNNへ入れる画像">{cnnSamples.map((s,i)=><button key={s.name} aria-pressed={i===sampleIndex} onClick={()=>{setSampleIndex(i);setPatch([2,i===1?4:2]);}}>{s.name}</button>)}</div>
  <h3>① 画像の一部に、同じ9個の重みを掛ける</h3>
  <div className="segmented" role="group" aria-label="CNNのフィルター">{cnnFilters.map((f,i)=><button key={f.name} aria-pressed={i===filterIndex} onClick={()=>setFilterIndex(i)}>{f.name}</button>)}</div>
  <div className="architecture-grids"><Matrix values={sample.pixels} label="入力画像：赤枠が今見る範囲" image highlight={patch}/><Matrix values={cnnFilters[filterIndex].values} label="3×3の重み"/><Matrix values={result.maps[filterIndex]} label="特徴マップ：マスを押して確認" selected={patch} onSelect={setPatch}/></div>
  <p aria-live="polite"><strong>赤枠の計算結果は{raw}。負なら0にするReLUを通すと{output}。</strong>特徴マップの選んだマスに、この値が入ります。</p>
  <details><summary>今の1マスの掛け算を、全部見る</summary><p className="architecture-equation">{terms.join(' ＋ ')} ＝ {raw}</p><p>04のニューロンと同じ積和です。今回はバイアスを0にしています。掛ける相手が、画像の近くにある9画素になりました。</p></details>
  <p>縦方向の重みは、中央の列が白いと加点し、両隣も白いと減点します。横方向の重みは、その横向き版です。<strong>どちらの形に反応するかが、重みの並べ方で変わります。</strong></p>
  <h3>② 二つの地図から、強い反応を取り出す</h3>
  <p>それぞれの特徴マップで、一番大きい値を一つ取り出します。ここでは「画像のどこかに縦らしい形・横らしい形があるか」を、二つの数にまとめます。</p>
  <SmallTable head={['取り出す値','現在の画像での値']} rows={[["縦の特徴マップの最大値",result.pooled[0]],["横の特徴マップの最大値",result.pooled[1]]]}/>
  <h3>③ 二つの数を、前の章のニューロンへ入れる</h3>
  <p>縦の値に2、横の値に−2を掛けて足し、シグモイド関数を通します。04で使った「重み付き合計→0〜1の出力」です。</p>
  <p className="note" aria-live="polite"><strong>z＝2×{result.pooled[0]}−2×{result.pooled[1]}＝{2*(result.pooled[0]-result.pooled[1])}</strong><br/>このモデルの出力：縦棒 {(100*result.verticalProbability).toFixed(1)}%／横棒 {(100*(1-result.verticalProbability)).toFixed(1)}%。<br/><strong>判定：{result.verticalProbability>=.5?'縦棒':'横棒'}</strong></p>
  <p>中央の縦棒を右へ動かすと、地図で反応する場所が動きます。それでも最大値は3のままなので、判定は縦棒のままです。<strong>同じ重みで各位置を調べる意味が、ここにあります。</strong>どんな移動や変形にも対応できると確認した例ではありません。</p>
 </div>;
}

export function AttentionExplorer(){
 const [queryIndex,setQueryIndex]=useState(2),[causal,setCausal]=useState(false),result=attentionExample(queryIndex,causal);
 return <div className="explorer architecture-explorer">
  <h3>参照する割合を、実際に計算してみる</h3>
  <p>計算を小さくするため、「猫が魚を食べる」から3語だけを取り出します。各語に2個の数を仮に割り当てました。<strong>学習した語の意味を表す値ではなく、計算練習用です。</strong></p>
  <SmallTable head={['語','練習用のベクトル']} rows={attentionWords.map((word,i)=>[word,`［${attentionVectors[i].join('，')}］`])}/>
  <div className="segmented" role="group" aria-label="注意を計算する語">{attentionWords.map((word,i)=><button key={word} aria-pressed={i===queryIndex} onClick={()=>setQueryIndex(i)}>「{word}」を処理</button>)}</div>
  <h3>① 今の語と、各語の数を掛けて足す</h3>
  <p>今は「{attentionWords[queryIndex]}」の［{result.query.join('，')}］を、各語のベクトルと比べます。01の内積を使い、数の大きさを調整するため√2で割ります。</p>
  <SmallTable head={['比べる語','内積 ÷ √2','参照する割合']} rows={attentionWords.map((word,i)=>[word,result.scores[i]===null?'後ろの語なので隠す':`（${result.query[0]}×${attentionVectors[i][0]}＋${result.query[1]}×${attentionVectors[i][1]}）÷√2 ＝ ${result.scores[i].toFixed(3)}`,`${(100*result.weights[i]).toFixed(1)}%`])}/>
  <h3>② 合計1になる割合に直す</h3>
  <p>比較した値が大きいほど大きな割合になるように変換し、合計を1にします。この変換が<strong>ソフトマックス関数</strong>です。二値の出力で使ったシグモイドと同様、ここでは数を割合に直す役目です。</p>
  <div className="attention-bars" aria-label="計算された注意の割合">{attentionWords.map((word,i)=><div key={word}><span>{word}</span><div><span style={{width:`${100*result.weights[i]}%`}}/></div><strong>{(100*result.weights[i]).toFixed(1)}%</strong></div>)}</div>
  <h3>③ その割合で、各語の情報を混ぜる</h3>
  <p className="architecture-equation" aria-live="polite">{result.weights.map((w,i)=>`${w.toFixed(3)}×［${attentionVectors[i].join('，')}］`).join(' ＋ ')}<br/><strong>＝ 約［{result.output.map(v=>v.toFixed(3)).join('，')}］</strong></p>
  <p>この二つの数が、周りの情報を混ぜた「{attentionWords[queryIndex]}」の新しい表現です。参照する割合と、最後に出す次の語の確率は別のものです。上の語を切り替えると、同じ入力の中でも参照する割合が変わります。</p>
  <label className="ai-toggle"><input type="checkbox" checked={causal} onChange={e=>setCausal(e.target.checked)}/> 続きを予測する設定：後ろの語は見ない</label>
  <p>「猫」を選んでこの設定を入れると、後ろの「魚」「食べる」の割合が0になります。答えを先に見ないための仕組みで、<strong>因果マスク</strong>と呼びます。文章全体を読む用途では、後ろの語も使う場合があります。</p>
  <details><summary>Q・K・Vは、今の計算のどこ？</summary><p>今の語から作る「何を参照するか」の数がQuery（Q）、照合する各語の数がKey（K）、割合を掛けて混ぜる情報がValue（V）です。この練習はQ・K・Vに同じベクトルを使いました。実際は、入力のベクトルに、それぞれ別の学習する重み行列を掛けて作ります。ソフトマックスは各比較値sに対してexp(s)を求め、その合計で割る計算です。</p></details>
 </div>;
}

export function GanExplorer(){
 const [state,setState]=useState(()=>({model:initialGan(),dSteps:0,gSteps:0}));
 const {model}=state,fake=ganGenerate(model),loss=ganLosses(model),low=Math.floor(Math.min(-4,...fake)),high=Math.ceil(Math.max(6,...fake));
 const px=value=>50+(value-low)/(high-low)*440;
 function advance(kind){setState(previous=>{let model=previous.model,dSteps=previous.dSteps,gSteps=previous.gSteps;for(let i=0;i<(kind==='both'?100:1);i++){if(kind!=='g'){model=updateGanDiscriminator(model);dSteps++;}if(kind!=='d'){model=updateGanGenerator(model);gSteps++;}}return {model,dSteps,gSteps};});}
 return <div className="explorer architecture-explorer">
  <h3>画像の前に、三つの数を作るところから</h3>
  <p>本物のデータは<strong>2・3・4</strong>。生成器Gは、種の数−1・0・1に、学習する値aを足します。最初はa＝−2なので、作る数は−3・−2・−1です。画像と違って、一つ一つの変化を見られる小さなGANです。</p>
  <div className="gan-paths"><p><strong>本物の2・3・4</strong><br/>──────────→ Dへ<br/>出所の正解は1</p><p><strong>種の数−1・0・1</strong><br/>→ Gでaを足す → Dへ<br/>出所の正解は0</p></div>
  <div className="segmented" role="group" aria-label="GANで学習する役"><button disabled={state.dSteps>=2000} onClick={()=>advance('d')}>① Dだけ1回学ぶ</button><button disabled={state.gSteps>=2000||state.dSteps===0} onClick={()=>advance('g')}>② Gだけ1回学ぶ</button><button disabled={Math.max(state.dSteps,state.gSteps)>1900} onClick={()=>advance('both')}>D→Gを100回繰り返す</button><button onClick={()=>setState({model:initialGan(),dSteps:0,gSteps:0})}>最初に戻す</button></div>
  <svg className="plot" viewBox="0 0 540 245" role="img" aria-label={`本物は2、3、4。生成した数は${fake.map(x=>x.toFixed(2)).join('、')}。生成器のaは${model.shift.toFixed(3)}。`}>
   <text x="50" y="30">本物のデータ</text><line x1="50" x2="490" y1="65" y2="65" stroke="#ccc"/>{ganReal.map(value=><g key={value}><circle cx={px(value)} cy="65" r="7" fill="#2865b0"/><text x={px(value)} y="94" textAnchor="middle">{value}</text></g>)}
   <text x="50" y="127">Gが作ったデータ</text><line x1="50" x2="490" y1="163" y2="163" stroke="#ccc"/>{fake.map((value,i)=><g key={i}><circle cx={px(value)} cy="163" r="7" fill="#cc2939"/><text x={px(value)} y="193" textAnchor="middle">{value.toFixed(2)}</text></g>)}
   <text x="50" y="231">両方とも同じ数直線：{low} 〜 {high}</text>
  </svg>
  <p aria-live="polite"><strong>Gのa＝{model.shift.toFixed(3)}。Dの重みw＝{model.w.toFixed(3)}、バイアスb＝{model.b.toFixed(3)}。</strong><br/>学習回数：Dは{state.dSteps}回、Gは{state.gSteps}回。</p>
  <SmallTable head={['入力の出所','Dが「本物」とする確率']} rows={[["本物の3",`${(ganJudge(model,3)*100).toFixed(1)}%`],[`Gが作った中央の数 ${model.shift.toFixed(2)}`,`${(ganJudge(model,model.shift)*100).toFixed(1)}%`]]}/>
  <p>Dは、04と同じ<strong>シグモイド（w×入力＋b）</strong>で確率を出します。最初はw＝0なので、どの数も50%。この時点では本物を見分ける力がありません。まず①を押してから②を押してください。</p>
  <p><strong>①ではDのw・bだけ、②ではGのaだけが変わります。</strong>「100回繰り返す」では交互に更新します。行き過ぎて戻ることもあり、毎回まっすぐ近づくわけではありません。最初から交互に1000回なら、この設定ではaが約3になり、生成する数が本物の並びへ近づきます。</p>
  <details><summary>二つの役は、どんな損失で学んでいる？</summary><p>Dは本物に1、生成に0を答える二値交差エントロピーを使います（現在{loss.discriminator.toFixed(3)}）。Gは、自分が作った数にDが高い「本物」の確率を付けるよう、−log D(G(z))を小さくします（現在{loss.generator.toFixed(3)}）。Gの更新では、Dの重みを固定したまま、Dを通じてaの勾配を求めます。</p><p>3個の種を固定し、学習率を0.2にした計算練習です。Gは数を横へずらせるだけ、Dは一つのニューロンという制限があります。画像を生成できるモデルではありません。</p></details>
 </div>;
}
