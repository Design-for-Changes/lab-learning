import PageLink from './PageLink.jsx';
import { Section, Sources, Next } from './Common.jsx';
import NeuroscienceUnknowns from './NeuroscienceUnknowns.jsx';
import { EmotionMemoryNetwork } from './EmotionMemoryNetwork.jsx';
import { NeuronConnectivityFigure, NeuronTypesFigure, SynapticSummationFigure } from './NeuronFoundations.jsx';
import { neuroscienceSources as references } from './neuroscienceSources.js';
import './neuroscience.css';
import { NoteFigure, SynapseFigure, GliaFigure, BrainRegionsFigure } from './NeuroscienceFigures.jsx';

export const neuroscienceLinks = [
  ['/neuroscience/cells', '01　細胞と信号'],
  ['/neuroscience/circuits', '02　回路と認知機能'],
  ['/neuroscience/design', '03　脳科学とデザイン'],
  ['/neuroscience/unknowns', '04　いまだにわかっていないこと'],
];
export const neuroscienceAliases = { '/neuroscience': '/neuroscience/cells' };
export const resolveNeuroscienceRoute = path => neuroscienceAliases[path] || path;

function Reading({ids}) { return <Sources links={ids.map(id => references[id])}/>; }
function Cite({id}) { return <PageLink className="neuro-source" href={references[id][1]} target="_blank" rel="noreferrer">{references[id][0]} ↗</PageLink>; }

function Cells() {
  return <>
    <p className="eyebrow">01 / 脳科学入門</p><h1>細胞と信号</h1>
    <Section title="脳とは、細胞が相互に働く器官">
      <p>ものを見る。誰かの話を聞く。昨日のことを思い出す。こうした働きは、脳の中にある細胞の活動と、その相互作用によって支えられています。脳科学は、細胞・回路・行動を調べながら、知覚や思考がどのように生まれるのかを明らかにしようとする学問です。</p>
      <div className="neuro-levels" aria-label="脳を理解する三つの段階"><div><strong>細胞</strong><span>信号を生み、受け取り、調整する</span></div><span aria-hidden="true">↓</span><div><strong>回路</strong><span>複数の細胞や領域が相互に働く</span></div><span aria-hidden="true">↓</span><div><strong>知覚・記憶・行動</strong><span>回路の働きを通じて実現する</span></div></div>
      <p>ただし、細胞の性質が分かれば、思考の仕組みまで直ちに分かるわけではありません。この教材では、現在分かっていることを細胞から回路へつなぎ、最後に、まだ説明できていないことを整理します。</p>
      <p>脳は、脊髄や末梢の神経を通じて身体とつながっています。外界からの刺激だけでなく、身体の状態や過去の経験も、脳の活動に影響します。</p>
    </Section>
    <Section title="ニューロンは、入力を受けて信号を送る">
      <p><strong>ニューロン（神経細胞）</strong>は、電気的・化学的な信号を使ってほかの細胞に働きかけます。典型的なニューロンには、入力を受ける<strong>樹状突起</strong>、核を含む<strong>細胞体</strong>、信号を遠くへ送る<strong>軸索</strong>があります。</p>
      <NoteFigure file="neuron-structure.png" title="ニューロンの構造をたどる" alt="細胞体から長い軸索が伸び、その先端が別の細胞とシナプスを形成する。細胞核、シナプス小胞、シナプス間隙などの位置を示す図。"><ol className="neuro-figure-reading"><li><strong>上側：細胞体と、そこから伸びる突起。</strong>複数の場所で入力を受け、その影響が統合されます。</li><li><strong>長く伸びた部分：軸索。</strong>活動電位が先端へ伝わります。</li><li><strong>下側：次の細胞との接点。</strong>シナプス小胞から伝達物質を放出し、隙間を隔てた受け手に作用します。</li></ol></NoteFigure>
    </Section>
    <Section title="ニューロンの接続には、複数のパターンがある">
      <p>一つのニューロンには、さまざまな相手からの入力が集まり、軸索の枝分かれを通じて複数の相手へ出力することもあります。こうした細胞間のつながりが、<strong>神経回路</strong>をつくります。</p>
      <p>接点が<strong>シナプス</strong>、入力を受ける枝が<strong>樹状突起</strong>です。シナプスは樹状突起のほか、細胞体や軸索などにもできます。すべての細胞が同じ数・同じ形でつながっているわけではありません。</p>
      <NeuronConnectivityFigure/>
      <p><strong>接続相手の細胞数と、シナプスの数は別です。</strong>同じ相手と複数のシナプスをつくることがあるためです。たとえば大脳皮質や海馬の典型的な錐体細胞には、約1万の興奮性シナプスがあるとする説明があります。これは「必ず1万個の別々の細胞とつながる」という意味ではありません。</p>
      <div className="neuro-citation-list"><Cite id="convergence"/><Cite id="synapseCount"/></div>
    </Section>
    <Section title="ニューロンには、どのような種類があるか？">
      <p>ニューロンはすべて同じ形・同じ働きではありません。まず、<strong>何をするかという役割、受け手への作用、細胞の形</strong>という三つの見かたを分けます。</p>
      <p>以下に出てくる<strong>発火</strong>とは、ニューロンが活動電位という電気的な信号を生じることです。発火の仕組みは、次の節で見ます。</p>
      <NeuronTypesFigure/>
      <div className="neuro-citation-list"><Cite id="neuronTypes"/><Cite id="neuronRoles"/></div>
    </Section>
    <Section title="活動電位とは、膜電位の急な変化">
      <p>細胞膜の内外には電位差があり、これを<strong>膜電位</strong>と呼びます。膜を通るイオンの流れが変わると、膜電位も変化します。ある条件を満たすと起こる急な電位変化が<strong>活動電位</strong>です。活動電位を生じることを「発火する」といいます。</p>
      <NoteFigure file="action-potential.png" title="発火すると、膜電位はどう変わるか" alt="膜電位の時間変化。静止時の約マイナス70mVから急に上昇し、プラス側に達した後に低下する。一時的な過分極を経て静止時へ戻る模式的な波形。"><ol className="neuro-figure-reading"><li><strong>立ち上がり：脱分極。</strong>多くのニューロンでは、電位依存性Na⁺チャネルが開き、Na⁺が細胞内へ流れ込みます。</li><li><strong>下降：再分極。</strong>Na⁺チャネルの不活性化や、K⁺の流出によって、膜電位が再び低下します。</li><li><strong>戻る途中：過分極。</strong>一時的に、静止時より負の側へ振れることがあります。</li></ol><p>図の電位と時間は模式的な例です。すべての神経細胞で同じ数値になるわけではありません。</p></NoteFigure>
      <p>信号が強いと、活動電位が際限なく大きくなるわけではありません。発火の頻度やタイミング、どの細胞が一緒に活動するかなどに、情報が表れます。</p>
      <NoteFigure file="axon-propagation.png" title="電位の変化が、軸索の隣の部分へ伝わる" alt="ニューロンの細胞体から伸びる軸索。興奮した部分から隣接する部分へ電位変化が広がり、ナトリウムイオンの透過性が高まる様子。"><p>ある部分の電位変化が隣の部分に影響し、そこで新たな活動電位が生じます。この繰り返しによって信号が伝わります。同じNa⁺が軸索の端から端まで運ばれるという意味ではありません。</p></NoteFigure>
    </Section>
    <Section title="シナプスとは、細胞間で信号を伝える接点">
      <p>ニューロンが別の細胞へ信号を伝える接点を<strong>シナプス</strong>と呼びます。化学シナプスでは、送る側と受け取る側の間に小さな隙間があり、神経伝達物質がその間を移動して受容体に結合します。</p>
      <SynapseFigure/>
      <div className="concept-pair"><article><h3>興奮性の作用</h3><p>受け取る細胞を、発火しやすい状態へ近づけます。グルタミン酸は、脳で主要な興奮性伝達を担う物質です。</p></article><article><h3>抑制性の作用</h3><p>受け取る細胞を、発火しにくい状態にします。GABAは、成熟した脳で主要な抑制性伝達を担う物質です。</p></article></div>
      <p>実際の作用は、伝達物質の名前だけでなく、受容体の種類や受け取る細胞の状態によって決まります。また、ドーパミンやノルアドレナリンなどは、回路の反応や可塑性を調整します。「一つの物質が、一つの感情をつくる」と対応させると、働きを見誤ります。</p>
    </Section>
    <Section id="neuro-summation" title="多くのニューロンは、複数の入力を統合して発火する">
      <p>多くのニューロンでは、一つのシナプスからの弱い入力だけでは発火に至らず、<strong>複数の入力が重なることで発火に至ります。</strong>入力による膜電位の変化が重なり、発火が始まる境界である<strong>閾値</strong>に達する、という仕組みです。</p>
      <p>この重なりを<strong>加重</strong>と呼びます。入力を受け取ったことと、受け手自身が発火することを、図で分けて見ます。</p>
      <SynapticSummationFigure/>
      <div className="concept-pair"><article><h3>空間的加重</h3><p>複数の場所に届いた入力の影響が重なります。複数のニューロンから近い時刻に入力を受ける場合が、その例です。</p></article><article><h3>時間的加重</h3><p>先の入力の影響が残る間に、次の入力が届いて重なります。入力が届く間隔も、発火に関わります。</p></article></div>
      <p>受け手は、興奮性の入力と抑制性の入力を合わせて統合します。どの入力が、どれほど強く、どのタイミングで届くかによって、発火するかどうかが変わります。</p>
      <div className="neuro-citation-list"><Cite id="summation"/><Cite id="summationFigure"/></div>
    </Section>
    <Section title="経験によって、信号の伝わりやすさが変わる">
      <p>ここまでは、発火して信号を伝えること（<strong>fire</strong>）を見ました。次に見るのは、その活動や経験に応じて、結びつきが変わること（<strong>wire</strong>）です。結びつきの変化には、接点の増減だけでなく、既にあるシナプスの効き方の変化も含まれます。</p>
      <p>同じ入力でも、過去の活動に応じてシナプスの効き方が変わることがあります。こうした変化を<strong>シナプス可塑性</strong>と呼びます。学習や記憶を支える仕組みの一つです。</p>
      <div className="concept-pair"><article><h3>長期増強（LTP）</h3><p>シナプスの伝達効率が、持続的に高くなる変化。</p></article><article><h3>長期抑圧（LTD）</h3><p>シナプスの伝達効率が、持続的に低くなる変化。</p></article></div>
      <p>ヘッブの考え方は、送り手と受け手の活動の関係によって結びつきが変わる、という学習の説明です。実際の変化には発火の順序や間隔、反復のしかた、神経調節物質なども関わります。LTDは細胞が死ぬことや、脳が「退化する」ことを意味しません。</p>
      <NoteFigure file="hebb-pairing.png" title="弱い入力が、強い入力と組み合わさると" alt="受け手Aに弱い入力Wと強い入力Sが入る。ペアリング前はWによる応答が小さい。WとSを組み合わせた後、Wだけでも大きなシナプス応答が生じる模式図。"><p><strong>Aは受け手、Wは弱い入力、Sは強い入力</strong>を表します。曲線は、受け手に生じるシナプス応答の大きさを表しています。</p><ol className="neuro-figure-reading"><li><strong>上段：組み合わせる前。</strong>Wだけでは応答が小さく、Sでは大きな応答が生じます。</li><li><strong>中段：二つの入力を組み合わせる。</strong>Wの入力と、Sによる受け手の強い脱分極が重なる条件をつくります。</li><li><strong>下段：組み合わせた後。</strong>Wとのシナプスが増強され、Wだけでも以前より大きな応答が生じます。</li></ol><p>ヘッブ型の連合的な増強を示す模式図です。実際には入力の順序・間隔などの条件に依存します。</p></NoteFigure>
      <details><summary>受容体の変化と、学習の関係をもう少し詳しく</summary><p>海馬でよく研究されている興奮性シナプスでは、グルタミン酸の入力と、受け手の脱分極が組み合わさると、NMDA受容体を通るCa²⁺の流入が起こります。これが細胞内の反応を動かし、AMPA受容体の数や働きなどを変えます。</p><p>その結果、後で同じ入力が来たときの応答が変わります。ただし、これは可塑性の代表例です。すべてのシナプスが同じ仕組みで変化するわけでも、一つのシナプスに一つの思い出が入るわけでもありません。</p><Cite id="plasticity"/></details>
    </Section>
    <Section title="グリア細胞も、回路の働きに関わる">
      <p>脳を構成する細胞には、ニューロンのほかに<strong>グリア細胞</strong>があります。グリアは一種類の細胞ではありません。ここでは、脳と脊髄にある代表的な三つを押さえます。</p>
      <GliaFigure/>
      <p>グリアの基本的な働きは分かっており、記憶への関与を示す実験もあります。一方、グリアとニューロンの相互作用を、日常の学習や思考の仕組みへどうつなぐかには、多くの問いが残っています。</p>
      <PageLink href="#/neuroscience/unknowns">グリア細胞について残る問いは、04で詳しく見る →</PageLink>
    </Section>
    <Reading ids={['brain', 'neuron', 'convergence', 'synapseCount', 'neuronTypes', 'neuronRoles', 'summation', 'summationFigure', 'glia', 'oligodendrocytes', 'microglia', 'plasticity', 'astrocytes']}/>
    <Next href="/neuroscience/circuits" label="02　回路と認知機能へ進む"/>
  </>;
}

function Circuits() {
  return <>
    <p className="eyebrow">02 / 脳科学入門</p><h1>回路と認知機能</h1>
    <Section title="部位の位置と働きを、脳地図で確かめる">
      <p><strong>大脳皮質</strong>は、大脳の表面を覆う層です。前頭葉・頭頂葉・側頭葉・後頭葉は、大脳を位置によって分けた呼び方です。その内側には、視床や大脳基底核などの構造があります。</p>
      <p>まず外側から見て、次に中央付近、側頭葉の内側へ進みます。図の部位名と、下に表示される「位置・主な働き・つながり」を対応させて読んでください。</p>
      <BrainRegionsFigure/>
      <p><strong>機能局在</strong>とは、領域によって関わりの強い機能が異なることです。一つの葉にも複数の領域があり、一つの領域が一つの機能を単独で完結させるわけではありません。</p>
    </Section>
    <Section id="neuro-mirror-neurons" title="ミラーニューロンとは、行為の実行と観察に反応する細胞">
      <p>自分で物をつかむときと、他者が物をつかむのを見るとき。その両方で活動するニューロンが、サルの運動前野で見つかりました。こうした反応を示す細胞を<strong>ミラーニューロン</strong>と呼びます。</p>
      <figure className="neuro-mirror-figure">
        <figcaption>同じニューロンを、二つの条件で調べる</figcaption>
        <div className="neuro-mirror-conditions">
          <div><span>条件 A：実行</span><strong>自分で物をつかむ</strong><span className="neuro-mirror-arrow" aria-hidden="true">↘</span></div>
          <div><span>条件 B：観察</span><strong>他者が物をつかむのを見る</strong><span className="neuro-mirror-arrow" aria-hidden="true">↙</span></div>
        </div>
        <div className="neuro-mirror-response"><svg viewBox="0 0 120 100" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M47 40 25 19M25 19 12 20M25 19 24 7M42 52 14 50M14 50 7 38M14 50 5 61M50 67 26 83M26 83 13 79M26 83 23 95M70 58 91 60 109 79M91 60 111 47"/></g><circle cx="58" cy="51" r="19" fill="currentColor"/><circle cx="59" cy="51" r="7" fill="white"/></svg><div><strong>同じニューロンが、どちらでも活動する</strong><span>実行した試行と、観察した試行を比較する</span></div></div>
        <p className="neuro-caption">反応の特徴を示す模式図です。二つの行為を同時に行う図や、神経の接続図ではありません。</p>
      </figure>
      <p>これは、形や伝達物質による分類ではなく、<strong>何をしているときに反応するか</strong>に着目した呼び方です。行為を見ることと、自分で行うことに、共通して関わる細胞があると分かります。</p>
      <div className="neuro-citation-list"><Cite id="mirrorMonkey"/><Cite id="mirrorHuman"/></div>
      <details className="neuro-supplement"><summary>人でも、同じような反応はあるのか？</summary><p>臨床上の理由で電極を入れた患者の研究でも、行為の実行と観察の両方に反応する細胞が、補足運動野や海馬周辺などで記録されています。一部には、実行時には興奮し、観察時には抑制される細胞もありました。</p><p>観察と実行が共通の細胞に関わることは、模倣や観察による学習を考える手がかりです。それだけで、相手の気持ちが分かることや、情動・連想・創造性の仕組みまで説明できるわけではありません。</p></details>
      <PageLink href="#/neuroscience/unknowns">観察と実行がどう結びつくか、04で残る問いを見る →</PageLink>
    </Section>
    <Section title="記憶には、異なる仕組みがある">
      <div className="concept-pair"><article><h3>ワーキングメモリー</h3><p>話の前半を覚えながら後半を聞く、候補を比べながら選ぶ。その場で情報を保ち、使う働きです。前頭前野や頭頂葉、感覚領域などの相互作用が関わります。</p></article><article><h3>長期記憶</h3><p>昨日の出来事、言葉の意味、自転車の乗り方など。長く残る記憶にも複数の種類があり、同じ回路ですべてを担っているわけではありません。</p></article></div>
      <p>海馬は新しい出来事の記憶の形成や想起に重要ですが、すべての記憶を保管する一つの箱ではありません。経験のさまざまな情報が、海馬と大脳皮質などの相互作用を通じて結びつきます。</p>
      <details className="neuro-supplement"><summary>研究例：手がかりから、出来事の他の要素を思い出す</summary><p>部分的な手がかりから、学習した全体のパターンを再現する働きを<strong>パターン補完</strong>といいます。人のfMRI研究では、出来事の一部を思い出すとき、直接尋ねられていない要素に対応する皮質の活動も再現され、その程度が海馬の活動と関連しました。</p><p>この研究は、出来事の要素を結びつけて思い出す仕組みを調べたものです。</p><Cite id="patternCompletion"/></details>
      <p>また、情報を保つあいだ、同じニューロンがずっと発火し続けることだけが唯一の仕組みではありません。断続的な活動や、細胞どうしの一時的な結びつきの変化がどう組み合わさるかも調べられています。</p><Cite id="working"/>
    </Section>
    <Section title="注意・記憶・感情は、相互に影響する">
      <p>同じ物を見ても、いま探している物なら気づきやすく、過去に嫌な経験をした物なら警戒することがあります。目から届く情報に、目標や記憶、情動的な重要性が関わるからです。</p>
      <div className="neuro-function-links"><div><strong>注意</strong><span aria-hidden="true">↔</span><strong>記憶</strong><p>何に注意を向けるかが記憶に影響し、覚えていることが注意を導く。</p></div><div><strong>記憶</strong><span aria-hidden="true">↔</span><strong>感情</strong><p>経験の重要性が記憶に影響し、思い出した経験が感情を変える。</p></div><div><strong>感情</strong><span aria-hidden="true">↔</span><strong>注意</strong><p>気になることが注意を引き、注意の向け方が感情の受け止め方に影響する。</p></div></div>
      <p className="neuro-caption">上の線は、認知機能どうしの関係を表します。一対一の神経接続や、固定した処理順序を表す図ではありません。</p>
      <p>「大脳皮質が理性、辺縁系が感情」と完全に分けることも、「感情がいつも先に処理される」と順番を固定することもできません。感情と認知には重なる領域や回路があり、相互に影響します。</p>
      <details><summary>注意が感情の処理に関わる実験の例</summary><p>顔の表情に対する脳の反応を調べた実験では、別の課題にどれだけ注意を使うかによって、扁桃体を含む領域の反応が変わりました。感情に関わる情報の処理も、注意の条件から切り離せないことを示す例です。</p><Cite id="emotion"/></details>
    </Section>
    <Section title="研究方法によって、見えているものが違う">
      <div className="neuro-methods"><article><h3>活動を記録する</h3><p>電極による記録は電気的な活動を捉えます。fMRIのBOLD信号は、神経活動に伴う血液の酸素化の変化を間接的に捉えます。時間や空間の細かさ、測れる範囲が異なります。</p></article><article><h3>活動を変えて確かめる</h3><p>動物実験などで特定の細胞や回路に介入し、行動がどう変わるかを調べます。活動と行動の因果関係に近づけますが、効果は介入した範囲や課題の条件に依存します。</p></article><article><h3>損傷による変化を調べる</h3><p>ある領域の損傷と機能の変化を対応づけます。ただし、つながる別の領域への影響や、損傷後の適応もあるため、その場所だけに機能が入っているとは言い切れません。</p></article></div>
      <p><strong>活動の相関、解剖学的な接続、介入による因果関係</strong>は、それぞれ異なる証拠です。脳の図に線を引くときも、どの証拠に基づく線なのかを確かめる必要があります。</p>
    </Section>
    <Reading ids={['brain', 'brainAtlas', 'mirrorMonkey', 'mirrorHuman', 'patternCompletion', 'working', 'emotion']}/>
    <Next href="/neuroscience/design" label="03　脳科学とデザインへ進む"/>
  </>;
}

function Design() {
  return <>
    <p className="eyebrow">03 / 脳科学入門</p><h1>脳科学とデザイン</h1>
    <Section title="同じ10日前の出来事でも、思い出しやすさが違う">
      <div className="concept-pair"><article><h3>10日前に食べた昼ごはん</h3><p>何を食べたか、すぐには思い出せない。</p></article><article><h3>10日前に親友がやらかした失敗</h3><p>その場面や、笑ったり驚いたりしたことを思い出せる。</p></article></div>
      <p>このような思い出しやすさの違いを、身近に感じることがあります。なぜ、情動が動いた経験は、後から呼び起こされやすいのか。体験時の入力がどう回路に作用し、経験によって何が変わるのかを考えます。</p>
      <p>さらに、<strong>複数の経験に関わる活動が呼び起こされ、重なり合う「多重状態」として、連想を捉えられるのではないか。</strong>この章では、蘆澤雄亮のこのモデルを、細胞と回路の仕組みから考えます。</p>
    </Section>
    <Section title="入力の重なりと、回路のやりとりから連想を考える">
      <p><PageLink href="#/neuroscience/cells">01で見たように</PageLink>、<strong>多くのニューロンは、複数の入力を統合して発火します。</strong>連想に関わる回路についても、この共通の仕組みを土台に考えます。</p>
      <p>ある細胞の発火は、接続先の細胞への入力になります。相互接続やループがあれば、その活動が、別の細胞を経て再び入力として戻る経路もあります。学習によって変わった結びつきは、その後の入力の効き方に関わります。</p>
      <p>こうしたやりとりの中で、<strong>どの入力が重なり、どの活動が次の活動を引き起こすのか。</strong>この章では、そのメカニズムを手がかりに、情動と連想の関係を考えます。</p>
    </Section>
    <Section title="部位や回路によって、メカニズムの特性が異なる">
      <p>発火やシナプス伝達という共通の原理の上に、<strong>どこから入力を受けるか、入力がどれほど効くか、結びつきがどの条件で変わるか</strong>という違いがあります。回路の働きを考えるには、この特性まで見る必要があります。</p>
      <p>その一例が、海馬の<strong>長期増強（LTP）</strong>です。海馬の興奮性シナプスでは、特定の入力条件で伝達が持続的に強まり、後の同じ入力に対する応答が大きくなることが確かめられています。経験によって、次に届く入力の効き方が変わる仕組みです。</p>
      <p>LTPが生じる条件や、その変化を担う仕組みも、経路によって異なります。こうした可塑性と接続の特性を合わせて、海馬を含む回路の働きを考えます。</p>
      <div className="neuro-citation-list"><Cite id="ltpExperiment"/><Cite id="ltpPathways"/></div>
      <details className="neuro-supplement"><summary>同じ海馬の細胞でも、入力経路によってLTPの仕組みが異なる</summary><p>海馬のCA3という領域の錐体細胞は、歯状回からの苔状線維と、他の錐体細胞からの連合・交連線維の入力を受けます。この二つの入力を同じ細胞で調べた実験では、どちらにもLTPが生じましたが、誘導の条件が異なりました。</p><p>連合・交連線維のLTPには、受け手側のNMDA受容体の活性化とCa²⁺の上昇が必要でした。一方、苔状線維のLTPは、その条件に依存しませんでした。同じ細胞に入るシナプスでも、可塑性の特性が異なることを示しています。</p></details>
    </Section>
    <Section title="情動に関わる回路は、皮質とどうつながるか？">
      <p>情動に関わる活動を考えるには、扁桃体、帯状皮質、前頭前野、海馬、視床下部などのつながりを見る必要があります。これらは、記憶や認知、身体反応に関わる領域と、複数の経路でやりとりしています。</p>
      <EmotionMemoryNetwork/>
      <p><strong>帯状回の皮質からも、他の大脳皮質へ投射があります。</strong>帯状皮質と前頭前野・連合野のつながり、扁桃体と前頭前野のつながり、海馬と海馬傍領域のやりとりを、図でたどってみてください。</p>
      <p>Papez回路は、もともと情動の説明として提案され、現在は記憶に関わる回路として重視されています。図のループも、より広いネットワークの一部です。</p>
      <div className="neuro-citation-list"><Cite id="limbicConnections"/><Cite id="amygdalaConnections"/><Cite id="limbicSystem"/></div>
    </Section>
    <Section title="海馬の損傷は、回路の働きを考える手がかりになる">
      <p>皮質との接続が複数あっても、海馬の役割が小さいとはいえません。<strong>海馬の両側の損傷は、新しい出来事の記憶の形成を大きく損ない、損傷前の出来事の想起にも影響します。</strong>特に最近の出来事への影響が知られています。</p>
      <p>ここから考えたいのは、海馬を含むやりとりが失われると、なぜ覚えたり思い出したりすることが難しくなるのか、という問いです。回路の中で海馬が担う処理を説明することが、メカニズムの理解につながります。</p>
      <div className="neuro-citation-list"><Cite id="hippocampalLesion"/><Cite id="episodicRecall"/></div>
      <details className="neuro-supplement"><summary>損傷研究で調べている記憶</summary><p>ここで中心にしているのは、経験した出来事などを意識的に覚え、思い出す記憶です。研究では損傷の範囲と記憶の時期を確かめます。新しい記憶や最近の出来事の想起が損なわれても、遠い過去の記憶や、技能の学習が保たれる場合があります。</p></details>
    </Section>
    <Section title="入力パターンに応じて、ループが活動を増幅するという仮説">
      <p>参考記事「脳の構造とデザイン」では、回路のやりとりを踏まえて、次の仮説を提示しています。</p>
      <blockquote className="neuro-hypothesis-quote"><p>記憶するにしろ、記憶を呼び起こすにしろ、計画するにしろ、感情系のループ回路が増幅に寄与している</p><footer>蘆澤雄亮「脳の構造とデザイン」より／著者の仮説</footer></blockquote>
      <p>このモデルでは、<strong>事象の入力パターンに応じて、増幅のループが働く</strong>と考えます。そのためには、どの入力パターンに反応するかという、学習の痕跡が必要です。学習された結びつきを前提に、回路内の活動がどう引き起こされ、他の活動を呼び起こすかに注目しています。</p>
      <p>冒頭の親友の失敗のように、ある経験の活動が呼び起こされる。さらに、関連する複数の経験の活動が呼び起こされ、重なり合う。この<strong>「多重状態」として連想を考える</strong>のが、このモデルの見方です。</p>
      <p>海馬を含むループと、帯状皮質や前頭前野などを介したやりとりを、この見方から考えます。その延長にあるのが、連想とアイデアについての次の仮説です。</p>
      <blockquote className="neuro-hypothesis-quote"><p>アイデアをよく出そうと思ったら、情動回路を発火させないと、連想が起こらない</p><footer>蘆澤雄亮の仮説</footer></blockquote>
      <p>どの回路の、どのような活動が連想を促すのかは、検証する問いとして残ります。</p><Cite id="note"/>
      <details className="neuro-supplement"><summary>関連する研究：扁桃体への刺激と、その後の記憶</summary><p>頭蓋内電極による検査を受けていた、てんかん患者14人の実験では、物の画像を見た直後に扁桃体を刺激すると、翌日の再認成績が改善しました。主観的な情動反応は報告されず、翌日の想起時には扁桃体・海馬・嗅周皮質の活動の相互作用にも変化が見られました。</p><p>情動に関わる領域への介入が記憶に影響する研究例です。ここで測ったのは物の記憶で、連想やアイデア生成ではありません。</p><Cite id="amygdalaMemory"/></details>
    </Section>
    <Section title="体験するときに、「なるほど」と思えるところを探す">
      <p>この仮説からは、<strong>体験する時点で、意識して興味が湧くところを探す</strong>という実践につながります。「なぜこの形なのか」「自分の経験とどうつながるか」と見て、納得したり、驚いたりするところを見つけます。</p>
      <p>ここで考えているのは、その場の連想とともに、<strong>後で関連する活動を呼び起こすトリガーとなる、学習された結びつきの形成</strong>です。参考記事も、体験の中で「なるほど」と思えることを探す姿勢を提案しています。</p><Cite id="note"/>
      <div className="neuro-practice"><h3>経験を、次の発想につなげてみる</h3><ol><li><strong>「なるほど」と思える点を探す。</strong>見学、会話、読書、制作の中で、理由を知りたいところや、面白いと感じるところに目を向ける。</li><li><strong>自分の経験と結びつける。</strong>何に納得したか、何を思い出したか、その場面や感覚とともに記録する。</li><li><strong>別の場面で、結びつきをたどる。</strong>後の制作で何がきっかけになって思い出されたかを振り返り、浮かんだ組み合わせを案にする。</li></ol><p>体験時の関わり方と、後の想起・連想を、自分の経験として確かめるための実践です。</p></div>
      <details className="neuro-supplement"><summary>関連する研究：好奇心が高いときの学習と記憶</summary><p>雑学の問いへの好奇心を調べた人の研究では、好奇心が高かった問いの答えが、後でよく記憶されていました。答えを待つ間に提示された、問いとは無関係な顔の記憶にも改善が見られました。</p><p>好奇心と後の記憶の関係を示す結果です。「なるほど」と感じる点を意識して探す実践や、増幅のトリガーが形成される仕組みを直接検証した実験ではありません。</p><Cite id="curiosityMemory"/></details>
    </Section>
    <Reading ids={['note', 'summation', 'ltpExperiment', 'ltpPathways', 'limbicConnections', 'amygdalaConnections', 'limbicSystem', 'hippocampalLesion', 'episodicRecall', 'amygdalaMemory', 'curiosityMemory']}/>
    <Next href="/neuroscience/unknowns" label="04　いまだにわかっていないことへ進む"/>
  </>;
}


export default function NeuroscienceCourse({route}) {
  const pages = { '/neuroscience/cells': Cells, '/neuroscience/circuits': Circuits, '/neuroscience/design': Design, '/neuroscience/unknowns': NeuroscienceUnknowns };
  const Page = pages[resolveNeuroscienceRoute(route)];
  return Page ? <Page/> : <><h1>ページが見つかりません</h1><PageLink href="#/neuroscience">脳科学入門に戻る</PageLink></>;
}
