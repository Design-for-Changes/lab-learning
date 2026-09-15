import { useId, useState } from 'react';
import { marketAt, marketScenarios, spendingEquilibrium, outputAt } from './economicsMath.js';

const number = value => Number(value.toFixed(1)).toLocaleString('ja-JP');
export function EconFlow({ steps, caption }) {
  return <figure className="econ-flow"><ol>{steps.map(([title, body]) => <li key={title}><strong>{title}</strong><span>{body}</span></li>)}</ol>{caption && <figcaption>{caption}</figcaption>}</figure>;
}
function Switches({ label, options, value, onChange }) {
  return <div className="econ-switches" role="group" aria-label={label}>{options.map(([key, title]) => <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)}>{title}</button>)}</div>;
}
export function ComparisonExplorer() {
  const id = useId(), [comparison, setComparison] = useState(false);
  return <div className="econ-explorer">
    <h3>政策の前後で10増えた。その全部が政策の効果か</h3>
    <p>A地域では政策が実施され、雇用の指数が100から110になりました。同じ期間に、政策のなかったB地域でも100から106になっています。計算を学ぶための架空データです。</p>
    <Switches label="比較の作り方" options={[[false,'A地域の前後だけを見る'],[true,'B地域の変化も比べる']]} value={comparison} onChange={setComparison}/>
    <div className="econ-chart-scroll" role="region" aria-label="政策前後の比較図。狭い画面では横にスクロールできます" tabIndex="0">
      <svg className="econ-chart" viewBox="0 0 620 370" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>政策前後の雇用の変化を比較する</title><desc id={`${id}-desc`}>{comparison?'A地域は10増加、B地域は6増加。政策がなければ同じ変化をしたと仮定すると、差の差は4。':'A地域は政策前の100から政策後の110へ、10増加。これだけでは政策の効果を区別できません。'}</desc>
        <text x="62" y="27">雇用の指数</text>
        {[100,106,110].map(v=><g key={v}><line x1="62" x2="480" y1={310-(v-100)*20} y2={310-(v-100)*20} className="econ-grid"/><text x="51" y={316-(v-100)*20} textAnchor="end">{v}</text></g>)}
        <path d="M62 64V310H480" className="econ-axis"/>
        <path d="M110 310L400 110" className="econ-demand"/>
        <circle cx="110" cy="310" r="6" fill="#333"/><circle cx="400" cy="110" r="6" fill="#cc2939"/>
        <text x="417" y="103" className="econ-demand-label">A：政策あり</text><text x="417" y="127">＋10</text>
        {comparison&&<><path d="M110 310L400 190" className="econ-supply"/><circle cx="400" cy="190" r="6" fill="#2865b0"/><text x="417" y="206" className="econ-supply-label">B：政策なし</text><text x="417" y="230">＋6</text><path d="M396 110H385V190H396" className="econ-axis"/><text x="410" y="165" fontWeight="700">差4</text></>}
        <text x="110" y="341" textAnchor="middle">政策前</text><text x="400" y="341" textAnchor="middle">政策後</text>
      </svg>
    </div>
    <p className="econ-scroll-hint">図は左右にスクロールできます。</p>
    <p className="econ-result-message" aria-live="polite">{comparison?'差の差は、Aの変化10 − Bの変化6 ＝ 4。政策がなければAも6増えた、と考えられる場合に、4を政策の効果と解釈します。':'A地域の前後差は、110 − 100 ＝ 10。共通の景気回復なども含まれるので、10をそのまま政策の効果とは言えません。'}</p>
    <p className="econ-caption">折れ線は、二つの時点の変化を結んでいます。A地域だけで同時に別の支援策が始まった場合などは、この比較だけで政策の効果を取り出せません。</p>
  </div>;
}
export function BudgetExplorer() {
  const id = useId(), [budget, setBudget] = useState(1200), [books, setBooks] = useState(2);
  const spent = books * 300, coffees = Math.floor((budget - spent) / 200), rest = budget - spent - coffees * 200;
  return <div className="econ-explorer">
    <h3>同じ予算を、どう振り分けるか</h3>
    <p>ノートは1冊300円、コーヒーは1杯200円。ほかには使わず、残りの予算で買えるだけコーヒーを買う例です。</p>
    <Switches label="使える予算" options={[[1200,'予算1,200円'],[1800,'予算1,800円']]} value={budget} onChange={value => {setBudget(value);setBooks(Math.min(books, value / 300));}}/>
    <label className="econ-control" htmlFor={id}>ノートを買う数：<strong>{books}冊</strong><input id={id} type="range" min="0" max={budget / 300} step="1" value={books} onChange={e => setBooks(Number(e.target.value))}/></label>
    <div className="econ-budget-bar" role="img" aria-label={`ノート${spent}円、コーヒー${coffees * 200}円、残り${rest}円`}><span style={{width: `${spent / budget * 100}%`}}/><span style={{width: `${coffees * 200 / budget * 100}%`}}/><span style={{width: `${rest / budget * 100}%`}}/></div>
    <div className="econ-results" aria-live="polite"><p><span>ノート</span><strong>{books}冊</strong>{number(spent)}円</p><p><span>コーヒー</span><strong>{coffees}杯</strong>{number(coffees * 200)}円</p><p><span>残った予算</span><strong>{rest}円</strong></p></div>
    <p className="econ-caption">予算が同じなら、ノートを2冊増やす600円で、コーヒーを3杯買えます。価格が変わらず予算が増えると、選べる組み合わせが広がります。</p>
  </div>;
}
export function MarketExplorer() {
  const id = useId(), [scenario, setScenario] = useState('baseline'), [price, setPrice] = useState(360);
  const model = marketAt(scenario, price), settings = marketScenarios[scenario];
  const x = q => 62 + q * 3.5, y = p => 328 - p * .32;
  const line = (intercept, slope) => {const qs = Array.from({length:141},(_,q)=>q).filter(q => intercept+slope*q>=0 && intercept+slope*q<=900);return qs.map(q=>`${x(q)},${y(intercept+slope*q)}`).join(' ');};
  const gap = model.demanded - model.supplied;
  return <div className="econ-explorer">
    <h3>需要・供給は、どう変わるか</h3>
    <Switches label="市場の条件" options={Object.entries(marketScenarios).map(([key,value])=>[key,value.label])} value={scenario} onChange={setScenario}/>
    <div className="econ-chart-scroll" role="region" aria-label="需要と供給の図。狭い画面では横にスクロールできます" tabIndex="0"><svg className="econ-chart" viewBox="0 0 620 390" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>需要と供給の交点で、均衡価格と数量が決まる</title><desc id={`${id}-desc`}>{settings.label}。均衡価格{model.price}円、均衡数量{model.quantity}個。選んだ価格{price}円では需要量{number(model.demanded)}個、供給量{number(model.supplied)}個。</desc>
      {[0,200,400,600,800].map(p=><g key={p}><line x1="62" x2="560" y1={y(p)} y2={y(p)} className="econ-grid"/><text x="50" y={y(p)+5} textAnchor="end">{p}</text></g>)}
      <path d="M62 24V328H568" className="econ-axis"/>{[0,40,80,120].map(q=><text key={q} x={x(q)} y="353" textAnchor="middle">{q}</text>)}<text x="62" y="17">価格（円）</text><text x="565" y="380" textAnchor="end">1日あたりの数量（個）</text>
      {scenario!=='baseline'&&<><polyline points={line(600,-4)} className="econ-baseline"/><polyline points={line(120,4)} className="econ-baseline"/></>}
      <polyline points={line(600+settings.demand,-4)} className="econ-demand"/><polyline points={line(120+settings.cost,4)} className="econ-supply"/>
      <text x={x(118)} y={y(600+settings.demand-4*118)+24} className="econ-demand-label">需要</text><text x={x(100)} y={y(120+settings.cost+400)-14} className="econ-supply-label">供給</text>
      <line x1="62" x2="560" y1={y(price)} y2={y(price)} className="econ-price"/>
      <circle cx={x(model.demanded)} cy={y(price)} r="6" fill="#cc2939"/><rect x={x(model.supplied)-5} y={y(price)-5} width="10" height="10" fill="#2865b0"/>
      <circle cx={x(model.quantity)} cy={y(model.price)} r="6" fill="#111"/><text x={x(model.quantity)+12} y={y(model.price)-14}>均衡</text>
    </svg></div>
    <p className="econ-scroll-hint">図は左右にスクロールできます。</p>
    <p className="econ-caption">赤い線：需要　青い線：供給　横の点線：選んだ価格。条件を変えたときの薄い破線は、もとの市場です。</p>
    <label className="econ-control" htmlFor={`${id}-price`}>価格を動かす：<strong>{price}円</strong><input id={`${id}-price`} type="range" min="200" max="600" step="20" value={price} onChange={e=>setPrice(Number(e.target.value))}/></label>
    <div className="econ-results" aria-live="polite"><p><span>この条件の均衡</span><strong>{model.price}円</strong>{model.quantity}個</p><p><span>選んだ価格での需要量</span><strong>{number(model.demanded)}個</strong></p><p><span>選んだ価格での供給量</span><strong>{number(model.supplied)}個</strong></p></div>
    <p className="econ-result-message" aria-live="polite">{Math.abs(gap)<.001?'需要量と供給量が一致しています。':gap>0?`需要量が供給量を${number(gap)}個上回ります。この価格では品不足が生じます。`:`供給量が需要量を${number(-gap)}個上回ります。この価格では売れ残りが生じます。`}</p>
    <p>{scenario==='demand'?'どの価格でも買いたい数量が増え、需要曲線が右へ移動しました。もとの市場より、均衡価格も数量も上がります。':scenario==='cost'?'同じ数量を売るために必要な価格が上がり、供給曲線が上へ移動しました。均衡価格は上がりますが、数量は減ります。':'価格だけを動かすと、同じ需要曲線・供給曲線の上で、買いたい数量と売りたい数量が変わります。'}</p>
    <details><summary>この図の前提と計算式</summary><p>架空の競争的な市場です。品質、所得、ほかの商品の価格などを固定し、数量と価格を直線で表しています。需要側の価格は600＋需要の変化−4×数量、供給側の価格は120＋費用の変化＋4×数量です。二つの価格が等しくなる数量を求めます。売買が必ず即座に成立することを表す図ではありません。</p></details>
  </div>;
}
export function GDPExplorer() {
  const [scenario,setScenario]=useState('base');
  const options={base:{price:300,quantity:100,label:'もとの状態'},price:{price:360,quantity:100,label:'価格だけが上がる'},quantity:{price:300,quantity:120,label:'生産量だけが増える'}};
  const current=options[scenario], data=outputAt(current.price,current.quantity);
  return <div className="econ-explorer"><h3>金額が増えた理由は、値上がりか、生産の増加か</h3><p>パンだけを生産する経済を考えます。もとの年は1個300円で100個。比較する期間の長さと品質は同じとします。</p><Switches label="名目と実質の比較" options={Object.entries(options).map(([k,v])=>[k,v.label])} value={scenario} onChange={setScenario}/><div className="econ-results" aria-live="polite"><p><span>価格 × 生産量</span><strong>{current.price}円 × {current.quantity}個</strong></p><p><span>名目GDP</span><strong>{number(data.nominal)}円</strong>その年の価格で計算</p><p><span>実質GDP</span><strong>{number(data.real)}円</strong>もとの年の300円で計算</p></div><p className="econ-result-message" aria-live="polite">{scenario==='price'?'値上がりで名目GDPは20％増えました。生産量は変わらないので、この例の実質GDPは同じです。':scenario==='quantity'?'生産量が20％増えたので、名目GDPと実質GDPがともに20％増えました。':'この年を比較の基準にすると、名目GDPと実質GDPはともに30,000円です。'}</p><p className="econ-caption">固定した基準価格を使う、一つの財だけの例です。実際のGDP統計では、多数の財・サービスの価格や品質の変化を調整します。</p></div>;
}
export function ThriftExplorer() {
  const [scenario,setScenario]=useState('base');
  const options={base:{a:20,i:80,label:'もとの状態'},saving:{a:0,i:80,label:'みんなが消費を減らす'},investment:{a:0,i:100,label:'投資も増える'}};
  const chosen=options[scenario], result=spendingEquilibrium(chosen.a,chosen.i);
  return <div className="econ-explorer"><h3>節約したい額と、実現する貯蓄は同じか</h3><p>所得が1増えると、そのうち0.8を消費する経済です。企業に生産を増減する余地があり、価格が変わらず、支出に合わせて生産と所得が調整される短期のモデルを使います。政府と海外は省略しています。</p><Switches label="消費と投資の条件" options={Object.entries(options).map(([k,v])=>[k,v.label])} value={scenario} onChange={setScenario}/><div className="econ-results" aria-live="polite"><p><span>調整後の所得</span><strong>{number(result.income)}</strong></p><p><span>調整後の消費</span><strong>{number(result.consumption)}</strong></p><p><span>調整後の貯蓄</span><strong>{number(result.saving)}</strong></p></div>
    <EconFlow steps={scenario==='base'?[['所得500','消費420と貯蓄80に分かれる'],['消費420 ＋ 投資80','合わせた支出が500になる'],['生産・所得500','この水準で支出と生産が一致する']]:scenario==='saving'?[['同じ所得でも、消費を20減らす','当初の所得500なら、貯蓄を80から100へ増やしたい'],['支出の減少が、売上と所得の減少へ','所得が減ると、そこから支出する額も減る'],['所得400・消費320へ調整','貯蓄は80。増やしたかった100にはならない']]:[['同じ所得でも、消費を20減らす','一方、企業の投資が80から100へ増える'],['消費の減少を、投資が補う','この例では、支出の合計が維持される'],['所得500・消費400へ調整','貯蓄は100になり、増えた投資に対応する']]}/>
    <p className="econ-caption">数値の単位は共通の架空単位です。投資が固定された場合と、同時に増えた場合を比較しています。節約に反応して投資が自動的に増えると仮定しているわけではありません。</p>
    <details><summary>式で確かめる</summary><p>消費 C ＝ a ＋ 0.8Y、支出と生産の一致 Y ＝ C ＋ I と置きます。したがって Y ＝ (a ＋ I) ÷ 0.2。貯蓄 S ＝ Y − C なので、この経済では調整後の S ＝ I です。消費の基礎部分 a を20減らし、Iを固定すると、Yは100減ります。価格、投資、政府支出などが動けば結果も変わります。</p></details>
  </div>;
}
