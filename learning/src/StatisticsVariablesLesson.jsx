import PageLink from './PageLink.jsx';
import { Prompt, Section, Sources, Next } from './Common.jsx';
import RelationshipExplorer from './RelationshipExplorer.jsx';

export default function Variables() {
  return <><p className="eyebrow">03 / 解析を選ぶ前に</p><h1>目的変数って、何？</h1>
    <Section title="知りたい結果と、それを説明する手がかり"><p>画面の文字を大きくすると、操作は速くなるでしょうか。文字サイズ、利用経験、操作時間を記録したとします。このとき、説明したい結果が<strong>目的変数</strong>、その結果との関係を調べる手がかりが<strong>説明変数</strong>です。</p><div className="variable-diagram"><div><span className="eyebrow">説明変数 X</span><strong>文字サイズ<br/>利用経験</strong></div><span className="variable-arrow" aria-hidden="true">→</span><div><span className="eyebrow">目的変数 Y</span><strong>操作時間</strong></div></div><p>目的変数は、応答変数や従属変数とも呼ばれます。矢印はモデル上の関係を表しており、それだけで原因と結果が証明されるわけではありません。</p>
    </Section>

    <Section title="目的変数を決めない解析もある"><p>30脚の椅子について、幅・奥行き・高さ・重さを測りました。「何か1つを予測したい」のではなく、「どんな特徴の椅子があるか、全体を見渡したい」。この場合は、目的変数を置かずに、項目のまとまりや椅子同士の似かたを調べます。</p><div className="concept-pair"><article><h3>目的変数あり</h3><p>結果を説明・予測したい。例：寸法や素材から、椅子の価格を予測する。</p><PageLink href="#/statistics/method/regression">回帰分析など →</PageLink></article><article><h3>目的変数なし</h3><p>データの構造を知りたい。例：寸法から椅子の特徴を整理する。</p><PageLink href="#/statistics/method/pca">主成分分析・クラスター分析など →</PageLink></article></div><p>多変量解析を選ぶとき、この「目的変数を置くか」は便利な分岐です。ただし、有無だけでは手法は決まりません。知りたいこと、値の種類、測定のしかたも必要です。<strong>「まだ決めていない」と「目的変数を置かずに構造を調べたい」も別です。</strong></p>
    </Section>

    <Section title="数字なら、何でも同じように扱える？"><p>学生番号も、5段階評価も、操作時間も数字で書けます。でも、足したり割ったりする意味は違います。</p><div className="table-scroll"><table className="data-table"><thead><tr><th>種類</th><th>例</th><th>数字の意味</th></tr></thead><tbody><tr><th>名義尺度</th><td>製品A/B/C、成功/失敗</td><td>種類の区別。番号の大小に意味はない。</td></tr><tr><th>順序尺度</th><td>不満〜満足の5段階</td><td>順番には意味があるが、隣の段階との間隔が等しいとは限らない。</td></tr><tr><th>間隔尺度</th><td>摂氏温度</td><td>差に意味がある。20℃は10℃の「2倍暑い」ではない。</td></tr><tr><th>比例尺度</th><td>時間、距離、回数</td><td>0が量の不在を表し、比にも意味がある。</td></tr></tbody></table></div><p>ここでは、時間・距離などを「量的な値」、種類や段階を「カテゴリー・順序」として入口を分けます。回数は量的でも整数なので、連続的な時間と同じモデルが常に適するわけではありません。複数の質問を合計した尺度をどう扱うかも、測定方法を踏まえて判断します。</p>
    </Section>

    <Section title="同じ人を2回測ると、データは独立ではない"><p>20人がAとBを使った場合、測定値は40個あっても、独立した40人分のデータではありません。同じ人の測定値には、技能などの共通要因があります。これを<strong>対応があるデータ</strong>として扱います。</p><p>別々の20人がAかBを使うなら、参加者間では独立した2群です。クラス単位で条件を割り当てるなど、集団の中に共通要因がある場合は、別の人だから独立とは限りません。誰を、何回、どの順番で測ったかを記録してください。</p>
    </Section>

    <Section title="線形と非線形は、どう違う？"><p>まずは、グラフの形から考えましょう。<strong>ほぼ直線で表せるなら「線形の関係」、曲がった形になるなら「非線形の関係」</strong>です。例えば、Xが1増えるたびにYが3ずつ減るなら、一定のペースで下がる直線になります。</p><RelationshipExplorer/><p>「初めは大きく変わるが、だんだん頭打ちになる」「途中で向きが変わる」「波のように繰り返す」。こうした形を、一本の直線で表すのは難しいでしょう。</p><p><strong>パターンがある＝非線形、ではありません。</strong>直線にも「一定のペースで変わる」というパターンがあります。パターンとは、データの中に見える規則性のことです。</p><h3>「非線形」という分類はある？</h3><p>あります。ただし、非線形は一つの手法の名前ではありません。頭打ち・U字・波などは、直線では表しきれない関係の形の例です。何を説明したいかに合わせて、曲線の式を決める回帰や、条件で枝分かれする決定木などを検討します。</p><p>ここではまず、<strong>散布図を見て、直線でよさそうか、曲がった傾向が残りそうか</strong>を考えてください。</p><details><summary>補足：「線形の関係」と「線形モデル」の名前は、少し違う</summary><p>回帰分析の「線形モデル」は、線の見た目だけでは決まりません。式の中で、データから決める数を<strong>係数</strong>と呼びます。例えば y = a + bx² なら、決める数はaとbです。</p><p>この式の図は曲線ですが、aとbはそれぞれ一度ずつ掛けて足す形なので、統計では線形モデルに含めます。つまり、<strong>曲線も線形回帰で表せる場合があります。</strong>手法の説明で「線形」と出てきたら、関係の形の話か、式の作り方の話かを確かめましょう。</p></details>
    </Section>

    <Section title="データを集める前に決めておく"><p>何を測れば問いに答えられるか。誰から何件集めるか。欠測が出たらどう扱うか。条件の順序で練習効果が生じないか。解析の見通しは、調査や実験の設計とセットで考えます。欠測は0ではありません。</p>
    </Section>

    <Prompt text={'次の研究について、目的変数・説明変数・観測単位を一緒に整理してください。研究で知りたいこと：【記入】。集めるデータと測り方：【記入】。同じ対象を複数回測るか：【記入】。目的変数を置く研究なのか、置かずに構造を探す研究なのかも説明してください。分からない点を先に質問し、変数名だけで因果関係を決めつけないでください。'}/>
    <Sources links={[["NIST：線形回帰と曲線のモデル","https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd141.htm"],["Penn State：説明変数と応答変数","https://online.stat.psu.edu/stat500/Lesson01"],["scikit-learn：教師あり学習","https://scikit-learn.org/stable/supervised_learning.html"],["scikit-learn：教師なし学習","https://scikit-learn.org/stable/unsupervised_learning.html"]]}/>
    <Next href="/statistics/experiments" label="04　実験計画法へ進む"/>
  </>;
}
