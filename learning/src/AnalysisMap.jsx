import { methods } from './content.js';
import { Section } from './Common.jsx';

const leaf=(label,ids,note,methodName)=>({label,ids,note,methodName});
const multivariate=[
 {label:'目的変数あり',note:'何か一つの結果を、複数の項目から説明・予測したい',children:[
  leaf('結果が時間・金額などの量','regression','説明変数が複数なら重回帰。曲がった関係も検討する。'),
  leaf('カテゴリーから時間・金額を説明したい','quant1','例：形・素材から、操作時間を説明する。'),
  leaf('カテゴリーから既知のグループを判別したい','quant2','例：経験・利用場所から、選ぶ／選ばないを判別する。'),
  leaf('結果が成功／失敗などの2種類','logistic','どの条件で、成功する確率が変わるか。'),
  leaf('数値やカテゴリーを予測したい',['forest','neural'],'新しいデータでの予測精度を比べる。'),
  leaf('属性の組み合わせと好みを調べたい','conjoint','選択・順位・評定を集める調査を設計する。'),
 ]},
 {label:'目的変数なし',note:'一つの結果を決めず、全体の構造を知りたい',children:[
  {label:'項目を少数の軸・地図にまとめたい',children:[
   leaf('複数の量的な項目','pca'),
   leaf('複数のカテゴリー回答',['mca','quant3'],'数量化理論III類はMCAと対応する。目的変数を置かず回答パターンを見る。'),
   leaf('近い人・製品の関係を重視して、配置を見たい','tsne','t-SNEで探索する。量的な特徴や、0/1に変換したカテゴリー回答を使う。'),
   leaf('2種類のカテゴリーの度数表','ca'),
   leaf('対象同士の距離・非類似度の表','mds'),
   leaf('対象同士の親近性・類似度の表','quant4','例：AとBがどのくらい似ているかを集め、位置に表す。'),
  ]},
  leaf('質問の背後にある共通の特徴を考えたい','factor','例：「分かりやすさ」に関わる質問のまとまり。'),
  leaf('似た人・製品をグループに分けたい','cluster','使う項目や「似ている」の決め方を確認する。'),
  leaf('2つの量・順位の関係を見たい','correlation','どちらか一方を予測するのでなく、関連を見る。'),
 ]},
];
const comparisons=[
 {label:'結果は時間などの量',children:[
  {label:'一つの要因で2条件',children:[leaf('別々の人・対象間は独立','welch'),leaf('同じ人でAとBを測る','paired')]},
  {label:'分散分析：変える項目はいくつ？',children:[
   leaf('1つの項目を変える','anova','例：画面の種類A・B・Cで平均時間を比べる。3つの画面でも、項目は「画面の種類」一つ。','一元配置分散分析'),
   leaf('2つの項目を組み合わせる','anova','例：サイズ × コントラスト。それぞれの違いと、組み合わせによる違いを見る。','二元配置分散分析'),
   leaf('3つ以上の項目を組み合わせる','anova','例：サイズ × コントラスト × 余白なら三元配置。項目ごと・組み合わせごとの違いを調べる。','多元配置分散分析（三元配置など）'),
  ]},
 ]},
 {label:'結果は成功・失敗や、満足度の段階',children:[
  leaf('画面Aを使った人たちと、画面Bを使った人たちで成功率を比べる','categorical','例：Aを使う20人と、Bを使う別の20人。それぞれ、成功した人数・失敗した人数を数える。'),
  leaf('同じ人がAとBを使い、成功・失敗が変わったかを比べる','mcnemar','Aでは失敗・Bでは成功した人と、その逆の人を数える。'),
  leaf('満足度の段階・順位など','ranks','独立か対応ありか、条件数で方法が変わる。'),
 ]},
];
function MethodLinks({ids,methodName}){return <span className="tree-methods">{(Array.isArray(ids)?ids:[ids]).map(id=><a key={id} href={`#/statistics/method/${id}`}>{methodName||methods.find(item=>item.id===id).name} →</a>)}</span>;}
function Branches({items}){return <ul>{items.map(item=><li key={item.label}><div className="tree-node"><strong>{item.label}</strong>{item.note&&<span className="tree-note">{item.note}</span>}{item.ids&&<MethodLinks ids={item.ids} methodName={item.methodName}/>}</div>{item.children&&<Branches items={item.children}/>}</li>)}</ul>;}
export function SelectionChart(){return <Section title="選択チャートで、分かれ道を見る">
 <p>まずは<a href="#/statistics/method/describe">記述統計・可視化</a>や<a href="#/statistics/method/crosstab">クロス集計</a>でデータを見ます。そのうえで、下の分かれ道をたどってください。手法名を押すと、具体例と結果の読み方を開けます。</p>
 <h3>関係・予測や、多変量解析を考える</h3><p><strong>多変量解析</strong>は、複数の項目を一緒に扱い、関係やまとまりを調べる解析です。「説明したい結果を決めるか」から考えましょう。</p>
 <div className="selection-chart"><div className="tree-root">説明・予測したい結果（目的変数）はある？</div><div className="decision-tree"><Branches items={multivariate}/></div></div>
 <h3>条件の違いを比べる・検定する</h3><p>例えば、画面AとBで操作時間や成功率が違うかを調べるときです。結果の種類と、同じ人を測ったかどうかで分かれます。</p>
 <div className="selection-chart"><div className="tree-root">比べたい結果は、どんな値？</div><div className="decision-tree"><Branches items={comparisons}/></div></div>
 <p>一元・二元の「元」は、人数や画面の数ではなく、比べる要因の数です。二元配置以上をまとめて「多元配置」と呼ぶこともあります。これは候補を探すための地図です。<strong>同じ人を何度も測る場合や、クラス・施設のまとまりがある場合</strong>は、そのつながりも扱う必要があります。<a href="#/statistics/method/mixed">混合効果モデル</a>などを検討します。</p>
 <p>関係の仮説全体を調べる<a href="#/statistics/method/sem">構造方程式モデリング（SEM）</a>など、単純な枝分かれでは表しきれない手法もあります。候補の説明で、自分の問いやデータに合うかを確かめてください。</p>
 </Section>;}
