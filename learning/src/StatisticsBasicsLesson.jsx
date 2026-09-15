import { Prompt, Section, Sources, Next } from './Common.jsx';
import { MeanExplorer } from './Explorers.jsx';
import DistributionContent from './DistributionLesson.jsx';

export default function Basics() {
  return <><p className="eyebrow">01 / 統計解析とデータの基礎</p><h1>統計解析とデータの基礎</h1>
    <Section title="データを整理する。その先を考える。"><p>操作時間を測る、間違えた回数を数える、使った感想を聞く。こうして集めたデータから、傾向や違い、関係を読み取るのが統計解析です。ただし、計算すれば答えが出るわけではありません。「使いやすさ」を時間で捉えてよいのか、というところから考える必要があります。</p><div className="concept-pair"><article><span className="eyebrow">記述統計</span><h3>集めたデータを整理する</h3><p>今回参加した12人は、どのくらいの時間で操作できたか。平均や図を使って、観察した結果を把握します。</p></article><article><span className="eyebrow">推測統計</span><h3>データの向こう側を考える</h3><p>別の人に使ってもらっても、同じ傾向になりそうか。集めた一部のデータから、対象とする集団の特徴を不確かさとともに推定します。</p></article></div><p>調べたい集団全体を<strong>母集団</strong>、実際に調べた一部を<strong>標本</strong>と呼びます。デザインの調査では、想定する「ターゲット層」が母集団にあたることが多いでしょう。全員を調べるのは難しいため、基本的にはその一部を標本として調べます。</p><p>ただし、身近な友人だけを調べて、ターゲット層全体に当てはめられるとは限りません。集め方の偏りは、計算の精密さでは解消できません。</p>
    </Section>

    <Section title="平均を出したら、ばらつきも見る"><p>「平均20秒でした」。これだけでは、みんなが20秒だったのか、1人だけ長くかかったのかが分かりません。</p><MeanExplorer/><p>平均のまわりに値がどのくらい散らばっているかを表す量に、<strong>分散</strong>と<strong>標準偏差</strong>があります。分散は、各値と平均の差を二乗してまとめた量です。その平方根が標準偏差です。</p><p>例えば、操作時間を秒で測った場合、分散の単位は秒²、標準偏差の単位は秒になります。標準偏差は元のデータと同じ単位で読める、というわけです。平均と標準偏差を並べるだけでなく、個々の値や分布も図にして見てください。</p>
    </Section>

    <Section title="平均を取り直すと、平均もばらつく"><p>今回の12人の平均と、別に集めた12人の平均は、ぴったり同じにはならないはずです。平均を出せば、その集団全体の本当の平均が分かる、というわけではありません。</p><div className="concept-pair"><article><h3>一人ひとりの値のばらつき</h3><p>同じ12人の中でも、操作時間には個人差があります。その広がりを表すのが標準偏差です。</p></article><article><h3>平均という推定値のばらつき</h3><p>別の12人を集めれば、平均も変わります。この平均の揺れの大きさを表すのが標準誤差です。</p></article></div><p>独立に集めた同じ分布のデータなら、平均の標準誤差は<strong>標準偏差 ÷ √標本数</strong>で推定できます。個人差が同じくらいなら、調べる人数が多いほど平均の推定は安定します。ただし、集め方の偏りは人数を増やすだけでは解消しません。</p><p>まずは「個々の値のばらつき」と「平均のばらつき」を区別してください。02の推定と検定では、この平均のばらつきが、結論の不確かさを考える手がかりになります。</p>
    </Section>

    <Section title="大きく離れた値があったら"><p>ほかの値から大きく離れた値を<strong>外れ値</strong>と呼びます。先ほどの図では、1人だけ操作時間が長くなると、平均が引っ張られました。分散や標準偏差も、極端な値の影響を強く受けます。</p><p>ただし、外れ値は「間違ったデータ」とは限りません。デザインの調査なら、長く迷った人の行動に、画面の問題を見つける手がかりがあるかもしれません。</p><ul><li><strong>原因を確かめる。</strong>入力ミス、単位の違い、計測の不具合なのか、実際に起きたことなのかを、元の記録に戻って確認します。</li><li><strong>影響を確かめる。</strong>個々の値を図にし、平均と中央値を見比べます。必要に応じて、その値を含める場合と含めない場合で結果がどう変わるかを調べます。</li><li><strong>扱いと理由を記録する。</strong>修正・除外した場合は、元のデータと判断の根拠を残します。欲しい結果を出すために削るものではありません。</li></ul><p>何を外れ値とみなすかは、分布や測定の状況にもよります。数値の基準に引っかかったら自動的に削除する、という扱いは避けてください。</p>
    </Section>

    <DistributionContent/>
    <Section title="関係を見つけることと、原因を示すことは違う"><p>使い慣れた人ほど操作が速かったとしても、慣れだけが原因とは限りません。年齢、事前の知識、使った機器なども関わっているかもしれません。関係を調べる解析、未来を予測する解析、原因を検討する研究では、必要な設計と確かめ方が違います。</p>
    </Section>

    <Prompt text={'統計解析を初めて学んでいます。研究で知りたいことは【ここに書く】です。記述統計で分かることと、推測するために必要な条件を、私の研究に沿って説明してください。母集団と標本、平均とばらつき、標準偏差と標準誤差、ヒストグラムから密度への換算、確率密度の順で、分からないところを一つずつ説明してください。外れ値らしい値がある場合は、原因の確認と結果への影響の調べ方も教えてください。足りない情報は質問し、まだ手法を決めないでください。'}/>
    <Sources links={[["Penn State：統計の基礎","https://online.stat.psu.edu/stat500/Lesson01"],["NIST：外れ値の確認と扱い","https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm"],["NIST：ヒストグラム","https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm"],["NIST：正規分布","https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm"],["NIST：確率分布の一覧","https://www.itl.nist.gov/div898/handbook/eda/section3/eda366.htm"],["SciPy：データから確率密度を推定する","https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gaussian_kde.html"],["SciPy：正規分布の密度と累積確率","https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html"]]}/>
    <Next href="/statistics/inference" label="02　推定と検定へ進む"/>
  </>;
}
