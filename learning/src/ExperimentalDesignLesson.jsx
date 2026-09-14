import { Section, Prompt, Sources, Next } from './Common.jsx';
import { FactorialWorkedExample } from './FactorialWorkedExample.jsx';
import { LinearGraphGuide } from './LinearGraphGuide.jsx';
import { DesignTable, L4BalanceExplorer, L4ResultsExplorer, L4Limitation } from './DesignExplorers.jsx';

const steps=[
 ['知りたいことを決める','どんな画面なら、操作しやすくなる？'],
 ['変えるもの・測るものを決める','サイズなどを変え、操作時間を測る。'],
 ['試す組み合わせを決める','全部試す？ 目的に合わせて減らせる？'],
 ['人・人数・順番を決める','誰に、どの画面を、どの順で試してもらう？'],
 ['実験して、結果を比べる','どの設定で速くなるか。ばらつきはどうか。'],
 ['よさそうな設定を、もう一度試す','予想した改善が、実際にも起きるか確かめる。'],
];
const orthogonalArrayGroups=[
 {title:'各項目を2種類に変える表',rows:[
  ['L4','2³',4,'2種類', '3項目'],
  ['L8','2⁷',8,'2種類', '7項目'],
  ['L12','2¹¹',12,'2種類', '11項目'],
  ['L16','2¹⁵',16,'2種類', '15項目'],
  ['L32','2³¹',32,'2種類', '31項目'],
 ]},
 {title:'各項目を3種類以上に変える表',rows:[
  ['L9','3⁴',9,'3種類', '4項目'],
  ['L27','3¹³',27,'3種類', '13項目'],
  ['L16','4⁵',16,'4種類', '5項目'],
  ['L25','5⁶',25,'5種類', '6項目'],
 ]},
 {title:'設定の数が違う項目を、一緒に扱う表（混合水準）',rows:[
  ['L18','2¹ × 3⁷',18,'2種類／3種類', '2種類：1項目\n3種類：7項目'],
  ['L36','2¹¹ × 3¹²',36,'2種類／3種類', '2種類：11項目\n3種類：12項目'],
  ['L54','2¹ × 3²⁵',54,'2種類／3種類', '2種類：1項目\n3種類：25項目'],
 ]},
];
function OrthogonalArrayCatalog(){return <Section id="orthogonal-arrays" title="代表的な直交表一覧">
 <p>直交表には、行の数や、各項目を何種類に変えられるかが違うものがあります。例えば<strong>「小・大」なら2水準、「小・中・大」なら3水準</strong>です。まず、自分の実験で変えたい項目と設定の数を、この一覧に照らします。</p>
 {orthogonalArrayGroups.map(group=><div className="table-scroll" key={group.title}><table className="data-table design-table orthogonal-catalog"><caption>{group.title}</caption><thead><tr><th scope="col">表の名前</th><th scope="col">試す<br/>組み合わせ</th><th scope="col">設定の数<br/>（水準）</th><th scope="col">項目の上限<br/>（列数）</th></tr></thead><tbody>{group.rows.map(([name,notation,runs,levels,columns])=><tr key={`${name}-${notation}`}><th scope="row">{name}<span className="array-notation">（{notation}）</span></th><td>{runs}通り</td><td>{levels}</td><td className="array-columns">{columns}</td></tr>)}</tbody></table></div>)}
 <p className="note"><strong>表の名前の読み方：L9（3⁴）</strong><br/>「L9」は9行、つまり9通りの組み合わせ。「3」は1項目につき3種類の設定。「⁴」は、その項目を入れる列が4本ある、という意味です。ここでの「3⁴」は、表の仕様を表す記号です。</p>
 <p>例えば4項目を、それぞれ小・中・大の3種類に変えるなら、全組み合わせは<strong>3 × 3 × 3 × 3＝81通り</strong>。L9を使うと9通りに絞れます。ただし、組み合わせ特有の効果まで全部見分けられるわけではありません。</p>
 <p>L18（2¹ × 3⁷）なら、2種類に変える項目を1つと、3種類に変える項目を7つまで入れられます。例えば「表示方式は2種類、サイズなどは3種類」というときの候補です。L16のように同じ行数で違う表もあるので、<strong>Lの後の数字だけでなく、かっこの中も確認します。</strong></p>
 <p>一覧の「項目の上限」は、1項目を1列に置いたときの数です。すべての列を使う必要はありません。交互作用を調べるために列を空けるなど、知りたいことによって割り付け方が変わります。<strong>項目が収まるだけで、その表を使ってよいとは決まりません。</strong>どの効果が重なるかも確かめます。</p>
 <p>また、9行は「9人で十分」という意味ではありません。各行を何人で試すか、何回測るか、確認実験をどうするかは別に計画します。</p>
 <p className="note">ここでは代表的な表を掲載しています。各行の数字の並びや、ほかの水準の組み合わせは、<a href="https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/doe/supporting-topics/taguchi-designs/catalogue-of-taguchi-designs/" target="_blank" rel="noreferrer">Minitabの直交表一覧（元の表も掲載） ↗</a>で確認できます。</p>
 </Section>;}
export default function ExperimentalDesignLesson(){return <>
 <p className="eyebrow">04 / 実験計画法</p><h1>全部試すと大変。実験をどう組み立てる？</h1>
 <p>ボタンの大きさ、色の見やすさ、周りの余白。どれを変えると操作しやすくなるでしょうか。まず「何を、どう比べるか」を決めてからデータを集めます。これが実験計画の出発点です。</p>
 <p className="note"><strong>全部の組み合わせを試すと、実験が多すぎる。知りたいことを残しながら、統計的な考え方で実験数を減らせないか？</strong><br/>この章では、完全要因計画から直交表へ進み、「減らせる理由」と「減らすと分からなくなること」を考えます。</p>
 <Section title="まず、実験計画の手順をつかむ"><ol className="experiment-steps">{steps.map(([title,body],i)=><li key={title}><span className="course-no">{i+1}</span><div><strong>{title}</strong><p>{body}</p></div></li>)}</ol><p>③の組み合わせだけでなく、④の人数や順番まで決めてから実験します。結果を見てから、都合よく計画を変えるものではありません。</p></Section>
 <Section title="①・② 何を変えて、何を測る？"><p>ここでは「同じ操作を、間違えずに、短い時間で終えられる画面を探す」と決めましょう。測るのは、課題を正しく終えるまでの時間です。間違えた回数や、終えられなかった人も記録します。</p><p>画面について変える候補を、次の3つに絞ります。</p>
  <div className="table-scroll"><table className="data-table design-table"><thead><tr><th scope="col">変える項目</th><th scope="col">設定1</th><th scope="col">設定2</th></tr></thead><tbody><tr><th scope="row">ボタンのサイズ</th><td>小</td><td>大</td></tr><tr><th scope="row">コントラスト<br/>背景との見分けやすさ</th><td>低</td><td>高</td></tr><tr><th scope="row">ボタン周りの余白</th><td>狭い</td><td>広い</td></tr></tbody></table></div>
  <p>「サイズ」のように変える項目を<strong>要因</strong>、「小・大」のような設定を<strong>水準</strong>と呼びます。難しい言葉に見えますが、ここでは「3つの項目を、それぞれ2種類に変える」ということです。</p><p>「小・大」だけでは同じ実験を再現できないので、実際には寸法や色の値も記録します。課題、端末、説明のしかた、時間の測り方はそろえます。</p>
 </Section>
 <Section title="③ まず、全部の組み合わせを数える"><p>いったん余白は同じにして、サイズとコントラストだけを考えます。小・大と低・高を組み合わせると、<strong>2 × 2＝4通り</strong>です。</p>
  <div className="table-scroll"><table className="data-table design-table balance-table"><caption>サイズとコントラストを、全部組み合わせる</caption><thead><tr><th scope="col">サイズ ↓<br/>コントラスト →</th><th scope="col">低</th><th scope="col">高</th></tr></thead><tbody><tr><th scope="row">小</th><td>小 × 低</td><td>小 × 高</td></tr><tr><th scope="row">大</th><td>大 × 低</td><td>大 × 高</td></tr></tbody></table></div>
  <p>こうして、<strong>すべての組み合わせを試すのが完全要因計画</strong>です。「大きくすると速くなるか」だけでなく、「見えにくいときに限って、大きくする効果が強くなるか」も調べられます。このように、効果がもう一つの条件で変わることを、02では<strong>交互作用</strong>と呼びました。</p>
  <p>次に、4通りそれぞれに余白の「狭い・広い」を加えます。4通りがそれぞれ2通りに分かれるので、<strong>2 × 2 × 2＝8通り</strong>になります。</p>
 </Section>
 <Section title="全部試すと、実験が増えすぎる"><p>変える項目を増やすと、組み合わせは急に多くなります。それぞれ2種類の設定でも、次の数になります。</p>
  <div className="table-scroll"><table className="data-table design-table"><thead><tr><th scope="col">変える項目の数</th><th scope="col">全組み合わせ</th></tr></thead><tbody><tr><th scope="row">2項目</th><td>2 × 2 ＝ 4通り</td></tr><tr><th scope="row">3項目</th><td>2 × 2 × 2 ＝ 8通り</td></tr><tr><th scope="row">5項目</th><td>2⁵ ＝ 32通り</td></tr><tr><th scope="row">10項目</th><td>2¹⁰ ＝ 1,024通り</td></tr></tbody></table></div>
  <p>しかも、1通りを1回だけ測って終わりではありません。人によるばらつきも知るため、同じ設定を何人かに試してもらいます。仮に1通りにつき別々の5人なら、8通りで40人、32通りでは160人が必要です。</p>
  <p><strong>そこで、「比べやすい組み合わせだけを選び、実験数を減らせないか」と考えます。</strong>そのために使う道具の一つが、次の直交表です。必要人数が5人と決まっているわけではなく、ここでの5人は負担を比べるための例です。</p>
 </Section>
 <Section title="直交表で、試す組み合わせを減らす"><p>8通りから適当に4通りを選ぶと、例えば「小さいボタンは全部見えにくい、大きいボタンは全部見やすい」という偏りができるかもしれません。それでは、サイズとコントラストのどちらが効いたのか分かりません。</p>
  <p><strong>直交表は、設定の組み合わせが釣り合うように並べた表</strong>です。ここでは、3項目・各2種類の設定を、4通りで試す「L4直交表」を使います。</p>
  <DesignTable/>
  <div><h3>表の読み方は、この3つ</h3><ul><li><strong>列は「何を変えるか」。</strong>サイズ、コントラスト、余白の3列です。</li><li><strong>行は「一度に組み合わせる設定」。</strong>①なら「小・低・狭い」の画面を作ります。</li><li><strong>数字の1・2は設定の目印。</strong>一般的な直交表では「小・大」を「1・2」と書きます。良い・悪いの点数ではありません。この教材では、読みやすく設定名で表示しています。</li></ul></div>
  <p>1通りを別々の5人に試してもらう例なら、<strong>完全要因計画は8 × 5＝40人、L4は4 × 5＝20人</strong>。作る画面の種類も、測定の数も半分になります。ただし、8通りと同じことが全部分かるわけではありません。</p>
 </Section>
 <Section title="なぜ、この4通りなら比べやすい？"><p>サイズの「小」と「大」を比べたいとします。小のときにも大のときにも、コントラストの低・高が同じ回数ずつ入っていれば、「小のほうだけ全部見えにくかった」という偏りを避けられます。</p><L4BalanceExplorer/>
  <p>このように組み合わせをそろえることで、<strong>少ない実験から、各項目の違いを比べる手がかり</strong>を得られます。4通りを適当に選ぶのではなく、どの設定どうしも釣り合うように選んでいるところがポイントです。</p>
  <p>ただし、「サイズとコントラストの組み合わせ特有の効果」まで大きい場合には、各項目の効果と区別できないことがあります。まず結果の計算を見てから、この限界を確かめましょう。</p>
 </Section>
 <OrthogonalArrayCatalog/>
 <LinearGraphGuide/>
 <Section title="④ 誰に、何回、どの順番で試してもらう？"><p>試す画面が決まったら、人と順番を決めます。ここをそろえないと、画面の違い以外の影響が混ざります。</p>
  <div className="caution-list">
   <article className="caution-item"><h3>くじ引きのように、担当する画面を決める</h3><p>操作が得意な人にだけ大きいボタンを使ってもらうと、速かった理由が分かりません。誰がどれを使うかを、くじ引きなどで決めます。これが<strong>ランダム化</strong>です。実施順も、特定の画面だけ朝・夕方に固まらないようにします。</p></article>
   <article className="caution-item"><h3>同じ設定を、複数の人で確かめる</h3><p>1人が速くできただけでは、その人が得意だった可能性があります。同じ設定を別々の人に試してもらうのが、この例での<strong>反復</strong>です。結果のばらつきも分かります。同じ1人を5回測ることとは区別します。</p></article>
   <article className="caution-item"><h3>初心者・経験者の片方に偏らせない</h3><p>経験が大きく影響しそうなら、初心者の中で各画面へ割り振り、経験者の中でも各画面へ割り振ります。このように、似た条件のまとまりの中で比べる工夫が<strong>ブロック化</strong>です。解析でも、どのまとまりの人かを考慮します。</p></article>
   <article className="caution-item"><h3>同じ人に全部試してもらう場合は、順番も工夫する</h3><p>個人差をそろえて比べやすくなりますが、後の画面では練習で速くなったり、疲れて遅くなったりします。2画面なら「A→B」の人と「B→A」の人を同じ人数にする方法があります。これを<strong>カウンターバランス</strong>と呼びます。4画面なら、順序の割り振りや休憩も計画します。</p><p>同じ5人が4画面を試すなら、測定は20回でも参加者は5人です。参加者IDと実施順を残し、対応のある検定や繰り返し測定に合う解析を使います。</p></article>
  </div>
  <p>何人必要かは、見つけたい差と、予想されるばらつきなどから考えます。<strong>「直交表が4行だから4人でよい」とは決まりません。</strong>実験前に、予備調査の結果や使う解析方法も含めて検討します。</p>
  <details><summary>くじ引きで分ければ、全利用者を代表できる？</summary><p>「集まった人をどの画面に割り振るか」と「誰に参加してもらうか」は別です。身近な学生だけでくじ引きをしても、子どもや高齢者を含む全利用者の代表にはなりません。結果を当てはめたい人たちに合わせて、参加者の集め方も考えます。</p></details>
 </Section>
 <Section title="⑤ 実験したら、行をまとめて平均を比べる"><p>ここからは、L4で実験した後の練習です。サイズなら「小の行」と「大の行」を集め、それぞれ平均します。コントラストや余白でも、同じように行をまとめ直せます。</p><L4ResultsExplorer/>
  <p>このように、ほかの項目を取り混ぜて、ある1項目の平均的な違いを見ることを<strong>主効果を見る</strong>と言います。どの設定がよさそうかを考える入口になります。</p><p>ただし、平均だけでは結果の確かさは決まりません。一人ずつの測定値も図にし、ばらつきと、測り方に合う解析を確認します。L4の行平均4つだけで、自由に有意差まで判断できるわけではありません。</p>
 </Section>
 <Section title="4通りでは、見分けられないこともある"><p>先ほど余白を比べると、狭い行の平均は17秒、広い行は11秒でした。「余白を広げれば6秒速くなる」と言い切ってよいでしょうか。</p><L4Limitation/>
  <p>よく見ると、余白が狭いときと広いときでは、<strong>サイズとコントラストの組み合わせも、そっくり入れ替わっています。</strong></p><p>そのため、「余白を広げたことが効いた」のか、「サイズとコントラストの組み合わせが効いた」のか、この4通りでは分けて考えられません。別の効果が重なって見えることを<strong>交絡</strong>と呼びます。</p>
  <div className="concept-pair design-comparison"><article><h3>すでに試した④</h3><p>大 × 高 × <strong>狭い</strong></p><p>平均14秒</p></article><article><h3>まだ試していない組み合わせ</h3><p>大 × 高 × <strong>広い</strong></p><p>何秒になるかは、まだ測っていない</p></article></div>
  <p>この2つも比べれば、サイズとコントラストを同じにしたまま、余白を変えた結果を確かめられます。</p><p><strong>組み合わせ特有の効果が小さいと考えられるなら、L4で各項目の違いを探る。組み合わせの効果まで詳しく知りたいなら、全8通りなどに実験を広げる。</strong>何を知りたいかに合わせて決めます。同じ4通りを測る人数だけ増やしても、この重なりは解消しません。</p><p>実験数を減らすとは、何でも省略してよいということではありません。<strong>知りたいことを絞り、その問いに答えられる組み合わせを残す</strong>という判断です。</p>
 </Section>
 <FactorialWorkedExample/>
 <Section title="⑥ よさそうな設定を、もう一度試す"><p>L8の計算例では「大・低・広い」が平均8秒で、もっとも短くなりました。これを候補にして、別の参加者でも同じ傾向になるかを確かめます。これが<strong>確認実験</strong>です。</p><ol><li>候補と比較する元の画面を決め、課題・測り方をそろえる。</li><li>必要人数と割り付け方、何を改善とみなすかを、実験前に決める。</li><li>平均時間だけでなく、ばらつき、間違い、未完了も記録して比べる。</li></ol><p>一方、先ほどのL4の例で候補になった「大・高・広い」は、まだ試していない組み合わせでした。その場合は、各項目を別々に選んだ結果が、組み合わせても通用するかを確かめます。</p><p><strong>少ない実験で候補を絞り、最後にその候補を実験で確かめる</strong>ところまでが、一続きの手順です。予想と違ったら、組み合わせの効果や、参加者・環境の違いを見直します。</p><p>自分の研究でも、冒頭の6項目を1枚に書き出してください。「全部なら何通りか」「どこを減らすか」「取ったデータから何を計算するか」「どの結果なら次に進むか」まで決めます。</p></Section>
 <Prompt text={'実験計画法を初めて学んでいます。知りたいこと：【記入】。変えたい項目と設定：【記入】。測る結果：【記入】。集められる参加者と時間：【記入】。使う環境で変わりそうなこと：【記入】。まず、目的→変えるもの・測るもの→組み合わせ→人・人数・順番→実験と比較→確認実験、の順で計画を整理してください。完全要因計画では何通りになるかを数え、実験数を減らす必要があれば直交表などを検討してください。直交表は、各行の意味、2列の組み合わせが釣り合う理由、平均の比べ方、減らすと区別できなくなる効果を、具体的な表で説明してください。線点図を使う場合は、点・線・数字が何を表すか、直交表の列との対応から説明してください。難しい用語は実例の後に説明し、人数や表を根拠なく決めないでください。'}/>
 <Sources links={[
  ['Penn State：実験計画、ランダム化と反復','https://online.stat.psu.edu/stat503/Lesson01'],
  ['NIST：ブロック化','https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm'],
  ['Penn State：2水準の要因計画','https://online.stat.psu.edu/stat503/Lesson06'],
  ['NIST：直交表・実験計画の一覧','https://www.itl.nist.gov/div898/software/dataplot/designs.htm'],
  ['Minitab：直交表の一覧と実際の配列','https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/doe/supporting-topics/taguchi-designs/catalogue-of-taguchi-designs/'],
  ['Minitab：直交表の列と交互作用の対応','https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/doe/supporting-topics/taguchi-designs/interactions-and-interaction-tables/'],
 ]}/><Next href="/statistics/choose" label="05　解析を選ぶ・調べるへ進む"/>
 </>;}
