import { Section } from './Common.jsx';
import { anovaExample, oneWayAnova, fTail2And18 } from './experimentMath.js';

export default function WorkedAnovaExample(){
 const groups=anovaExample(4,2),result=oneWayAnova(groups),p=fTail2And18(result.f);
 return <Section title="例題：3つの画面を比べて、結果を報告する">
  <p>ここまでの内容を使って、データから考察までつなげてみましょう。一元配置分散分析の図で、最初に表示した21人のデータを使います。</p>
  <div><h3>問題</h3><p>同じ操作をする画面A・B・Cをつくりました。21人を無作為に3群に分け、それぞれ別の7人が1つの画面を使いました。画面によって平均操作時間が違うと言えるでしょうか。さらに、どの画面を採用するか考えてください。</p><p>以下は練習用の架空のデータです。有意水準は調査前に0.05と決め、参加者の独立性、誤差の正規性、等分散の前提が適切だとして計算します。</p></div>
  <div className="table-scroll"><table className="data-table"><thead><tr><th>画面</th><th>7人の操作時間（秒）</th></tr></thead><tbody>{groups.map((group,i)=><tr key={i}><th>{['A','B','C'][i]}</th><td>{group.join('、')}</td></tr>)}</tbody></table></div>
  <div><h3>1. 何を調べるか決める</h3><p>比べるのは、別々の人が使った3つの画面の平均です。要因は「画面の種類」の1つなので、<strong>一元配置分散分析</strong>を使います。帰無仮説は「A・B・Cの母平均は、すべて同じ」です。</p></div>
  <div><h3>2. 平均と、F値を計算する</h3><p>各群の平均はAが{result.means[0]}秒、Bが{result.means[1]}秒、Cが{result.means[2]}秒。21人全体の平均は{result.grand}秒です。</p><p>群の平均どうしの違いと、各群の中のばらつきを計算すると、次のようになります。</p></div>
  <div className="table-scroll"><table className="data-table"><thead><tr><th>計算するもの</th><th>今回の計算</th></tr></thead><tbody><tr><th>群の間の平均平方</th><td>224 ÷ 2 ＝ 112</td></tr><tr><th>群の中の平均平方</th><td>336 ÷ 18 ≒ 18.67</td></tr><tr><th>F値</th><td>112 ÷ 約18.67 ＝ <strong>{result.f.toFixed(2)}</strong></td></tr><tr><th>p値</th><td>自由度2と18のF分布から、<strong>{p.toFixed(4)}</strong></td></tr></tbody></table></div>
  <details><summary>224と336は、どう計算した？</summary><p><strong>群の間：</strong>各群の平均20・24・28秒が、全体の平均24秒からどれくらい離れているかを二乗し、各群の人数を掛けて足します。</p><p className="note">7 ×（20 − 24）² ＋ 7 ×（24 − 24）² ＋ 7 ×（28 − 24）² ＝ 224</p><p><strong>群の中：</strong>一人ずつの時間から、その人が属する群の平均を引き、二乗して足します。Aなら、（14 − 20）² ＋（16 − 20）² ＋ … ＋（26 − 20）² ＝ 112です。BとCも112なので、合計336になります。</p><p>群の間の自由度は3 − 1＝2、群の中は21 − 3＝18です。それぞれの平方和を自由度で割ると、平均平方になります。</p></details>
  <div><h3>3. 結果を読む</h3><p><strong>p＝{p.toFixed(4)}は0.05より小さい</strong>ので、「3つの母平均はすべて同じ」という仮説を退けます。画面の種類による平均時間の違いが見つかった、と判断します。</p><p>ただし、この計算だけでは、どの画面どうしに違いがあるかは決まりません。A対B、B対C、A対Cを調べたい場合は、組ごとに比べる追加の解析（多重比較）を検討します。</p></div>
  <div><h3>4. 考察する</h3><p>今回、最も平均時間が短かったのはAです。Cより平均8秒速かったので、Aは採用候補になります。</p><p>一方で、「AはBよりも確実に速い」「Aがいちばん使いやすい」とまでは言えません。画面どうしの追加の比較に加え、間違いの数や、使った人の感想も確認したいところです。別の利用者や別の作業でも同じ傾向になるか、という点も残ります。</p></div>
  <div><h3>考察文の例</h3><blockquote><p>一元配置分散分析の結果、画面の種類による平均操作時間の違いが見られた（F(2, 18)＝6.00、p＝0.0101）。平均時間はAが20秒、Bが24秒、Cが28秒であり、今回のデータではAが最も短かった。ただし、どの画面どうしに差があるかを調べる追加の比較は行っていない。採用する画面を決めるには、操作ミスや利用者の評価も合わせて検討する必要がある。</p></blockquote></div>
 </Section>;
}
