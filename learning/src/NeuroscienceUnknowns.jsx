import PageLink from './PageLink.jsx';
import { Section, Sources, Next } from './Common.jsx';
import { ThalamicCircuitExplorer } from './NeuroscienceExplorers.jsx';
import { neuroscienceSources as references } from './neuroscienceSources.js';

function Cite({ id }) {
  return <a className="neuro-source" href={references[id][1]} target="_blank" rel="noreferrer">{references[id][0]} ↗</a>;
}
function Boundary({ known, unknown }) {
  return <div className="neuro-boundary"><div><h3>手がかりとなる知見</h3><p>{known}</p></div><div><h3>まだ分かっていないこと</h3><p>{unknown}</p></div></div>;
}
function OpenQuestion({ id, title, children }) {
  return <details id={id} className="neuro-open-question"><summary>{title}</summary><div className="neuro-question-content">{children}</div></details>;
}

export default function NeuroscienceUnknowns() {
  return <>
    <p className="eyebrow">04 / 脳科学入門</p><h1 className="neuro-unknown-title"><span>いまだに</span><wbr/><span>わかっていないこと</span></h1>
    <Section title="正直、多くのことが分かっていません。">
      <p>ものが見える。身体を動かす。誰かを理解する。経験を覚え、思い出し、考える。こうした日常の働きが、細胞と回路の活動からどう生まれるかについて、脳科学には、まだ分からないことが広く残っています。</p>
      <p>個々の実験で見えてきた仕組みを、脳全体や一人の人間の体験につなぐには、多くの隔たりがあります。ここでは六つの分野から、代表的な<strong>15の問い</strong>を挙げます。それぞれを開くと、手がかりとなる知見と、まだ説明できていないことを読めます。</p>
    </Section>
    <Section title="細胞と回路">
      <div className="neuro-open-questions">
    <OpenQuestion id="neuro-unknown-coding" title="発火のパターンが変わっても、同じものだと分かるのはなぜか？">
      <Boundary known="刺激の違いに応じて、細胞集団の活動パターンが変わることが分かっています。一方、マウスの嗅覚皮質では、同じにおいへの反応も、日から週の単位で徐々に変わることが観察されています。" unknown="活動パターンが変化する中で、下流の回路は何を手がかりに、同じ対象として扱えるのか。個々の細胞、集団の組み合わせ、発火の頻度や時間関係のうち、どの特徴を使っているのかが問われています。"/>
      <p>同じ刺激に対する神経活動の表現が時間とともに変わる現象を、<strong>表現ドリフト</strong>と呼びます。記録した活動から研究者が刺激を見分けることと、脳の回路が実際にその情報をどう使うかを、つなげて調べる必要があります。</p><Cite id="representationalDrift"/>
    </OpenQuestion>
    <OpenQuestion id="neuro-unknown-glia" title="グリア細胞は、経験によって変わる回路にどう関わるのか？">
      <Boundary known="アストロサイトによる細胞外環境の調整、オリゴデンドロサイトによる髄鞘の形成、ミクログリアによる免疫応答やシナプスへの関与は分かっています。グリアは、神経細胞の活動が成り立つ条件にも関わります。" unknown="各種類のグリアが、どの情報に、どの時間幅で反応し、その変化が神経回路の学習や記憶にどう組み込まれるのか。個別の仕組みを、脳全体の情報処理へつなぐ説明は十分ではありません。"/>
      <h3>記憶への関与も、具体的に調べられている</h3>
      <p>マウスでは、学習に伴って反応するアストロサイトの集団が見つかり、その集団への介入が記憶の想起に影響することが報告されています。別の研究では、恐怖経験に伴うアストロサイトの変化が、後の想起を経た記憶の安定化を支える仕組みが示されました。</p>
      <div className="neuro-citation-list"><Cite id="astrocytes"/><Cite id="stabilization"/></div>
      <p>ここから残る問いは、グリアがどの活動を受け取り、何を変えることで、経験に応じた回路の変化を支えるのか、ということです。</p>
      <details><summary>残る問いを、もう少し具体的に</summary><ul><li>アストロサイトの反応は、経験の内容そのものを表すのか、回路が変化できる条件を調整するのか。両者をどう区別するか。</li><li>部位や細胞の状態が違えば、同じ入力への反応や、ニューロンへの作用はどう変わるか。</li><li>髄鞘の変化による信号の到達タイミングの違いは、回路の協調や学習にどう影響するか。</li><li>動物の特定課題で示された仕組みは、人の複雑な経験にどこまで当てはまるか。</li></ul></details>
    </OpenQuestion>
    <OpenQuestion id="neuro-unknown-thalamus" title="視床は、状況に応じて情報の流れをどう変えるのか？">
      <Boundary known="神経核ごとの接続、感覚情報の中継、発火の性質などが調べられています。マウスの課題では、視床網様核を介した感覚選択や、背内側核による前頭前野の活動の維持も実験で示されています。" unknown="どの核・細胞群が、いつ、何を手がかりに情報の伝わり方を変えるのか。感覚、目標、覚醒状態が変化するときに、これらの調整を一貫して説明・予測する枠組みは、まだ十分ではありません。"/>
      <h3>個別の回路から、全体の情報処理へ</h3>
      <p>「視床を損傷すると注意に問題が出る」という観察に加え、どの細胞を操作すると課題の成績や皮質の活動が変わるかも調べられています。また、サルの研究では、注意に応じた視床枕と視覚皮質の活動の同期が報告されています。</p>
      <p>個別の回路で見えてきた仕組みをつなぎ、状況に応じて視床全体が情報の流れをどう変えるかを説明することが、次の課題です。</p>
      <div className="neuro-citation-list"><Cite id="selection"/><Cite id="thalamus"/><Cite id="pulvinar"/></div>
      <details className="neuro-supplement">
        <summary>わかっている視床の回路を、図で確認する</summary>
        <p>視床は、脳の深部にある複数の<strong>神経核</strong>の集まりです。神経核とは、共通する接続や性質をもつ神経細胞の集団です。細胞の中にある「核」とは別の意味です。</p>
        <p>たとえば外側膝状体は視覚、内側膝状体は聴覚の伝達に関わります。一方、背内側核や視床枕は、前頭前野や複数の皮質領域とのやりとりに関わります。「視床」という一つの名前の下に、接続も働きも異なる回路があります。</p>
        <ThalamicCircuitExplorer/>
      </details>
      <details><summary>「中継」から先に残る問い</summary><ul><li>皮質から戻ってくる信号は、どの細胞を介して次の入力の扱い方を変えるのか。</li><li>情報の内容を伝える働きと、皮質での処理を調整する働きは、どのように分かれ、組み合わさるのか。</li><li>複数の感覚や目標が競合するとき、どの回路が優先されるかを予測できるか。</li><li>起きているとき、眠っているときなどの状態変化と、注意の切り替えには、どの共通点と違いがあるか。</li></ul></details>
    </OpenQuestion>
      </div>
    </Section>
    <Section title="知覚と身体">
      <div className="neuro-open-questions">
    <OpenQuestion title="視覚・聴覚・触覚を、どう一つの出来事にまとめるのか？">
      <Boundary known="人では、一回の光の点滅に複数の音を組み合わせると、光も複数回点滅したように見える現象が確認されています。ある感覚からの入力が、別の感覚の知覚に影響します。" unknown="別々の感覚器から、異なる速さや精度で届く信号を、いつ同じ出来事としてまとめるのか。入力が食い違うとき、どの信号をどの程度採用するか。その判断を細胞と回路がどう実現するのかが、広く残る問いです。"/>
      <p>人の顔を見ながら声を聞く、物に触れながら形を見る。普段は一つの体験として成立することも、脳の中でどう統合されるかを説明するには、多くの段階をつなぐ必要があります。</p><Cite id="multisensory"/>
    </OpenQuestion>
    <OpenQuestion title="身体の状態は、どう感覚や情動になるのか？">
      <Boundary known="心拍など身体内部の状態を感じ取る働きを、内受容感覚と呼びます。人の心拍の知覚を調べた研究では、島皮質などの活動と、身体の信号を捉える課題の成績との関連が示されています。" unknown="心臓や内臓からの入力、過去の経験、今の状況が、どのように組み合わさって、不安・安心・緊張などの体験になるのか。同じ身体の変化が、場面によって違う意味を持つ仕組みも、十分には説明できていません。"/>
      <p>心臓が速く打つことを、楽しみだと感じる場合も、怖いと感じる場合もあります。身体から脳へ、脳から身体へという相互作用を含めて考える問いです。</p><Cite id="interoception"/>
    </OpenQuestion>
      </div>
    </Section>
    <Section title="学習と記憶">
      <div className="neuro-open-questions">
    <OpenQuestion id="neuro-unknown-memory" title="記憶は、変わり続ける脳の中でどう保たれるのか？">
      <Boundary known="シナプス可塑性や、記憶に関わる神経細胞群の活動が調べられています。ワーキングメモリーについても、持続的な発火に加え、断続的な活動や一時的な結びつきの変化に関する知見があります。" unknown="細胞や接続が変化する中で、なぜ同じ経験を長く思い出せるのか。思い出すたびに更新される側面と、安定して残る側面を、分子から回路までつないで説明するには課題が残ります。"/>
      <p>新しい経験で結びつきを変えながら、以前の経験も呼び起こせる。新しい学習、長く保つこと、思い出すたびに更新することを、同じ回路がどう両立させるかが問いになります。</p><Cite id="working"/>
    </OpenQuestion>
    <OpenQuestion title="忘れるときには、何が変わっているのか？">
      <Boundary known="ショウジョウバエでは、においの学習後に特定のドーパミン神経の活動を操作すると、忘却の速さが変わります。記憶の獲得と忘却に、異なる受容体が関わるという知見もあります。" unknown="思い出せないとき、学習で生じた変化が失われたのか、呼び起こす経路が使われにくくなったのか。それぞれがどの条件で起こり、新しい経験による干渉や記憶の更新とどう関係するか。人の日常の忘却までつなぐ説明には、多くの問いが残ります。"/>
      <p>「忘れた」という同じ行動上の結果でも、その手前で起きた回路の変化を調べる必要があります。</p><Cite id="forgetting"/>
    </OpenQuestion>
    <OpenQuestion id="neuro-unknown-sleep" title="睡眠中には、どの経験が選ばれ、どう記憶が変わるのか？">
      <Boundary known="ラットでは、行動中に一緒に活動した海馬の細胞が、その後の睡眠中にも一緒に活動しやすくなることが記録されています。学習後の海馬に生じる短い高周波の活動を妨げると、空間記憶の成績が低下する実験もあります。" unknown="多くの経験のうち、どれを、どの順番で再び活動させるのか。その活動が海馬や皮質のどの結びつきを変え、記憶の保持・更新・知識の一般化につながるのか。経験の内容まで含めた選択と変化の仕組みには、問いが残ります。"/>
      <p>日中の経験に関わる活動が、睡眠中に再び現れることを<strong>再活性化</strong>と呼びます。とくに活動の順序が再現される場合には、<strong>リプレイ</strong>と呼ばれます。何が再び活動するかに加え、その前後で回路にどんな変化が起きるかが重要です。</p>
      <div className="neuro-citation-list"><Cite id="sleepReactivation"/><Cite id="sleepRipples"/></div>
      <details className="neuro-supplement"><summary>夢の体験との関係は？</summary><p>睡眠中の細胞集団の活動と、人が目覚めて報告する夢の内容を、どこまで対応づけられるのかも問いです。夢に現れる場面の組み合わせと、記憶を保ったり更新したりする処理は、どのような関係にあるのでしょうか。</p></details>
    </OpenQuestion>
      </div>
    </Section>
    <Section title="行動と他者">
      <div className="neuro-open-questions">
    <OpenQuestion title="複数の候補から、どう次の行動を選ぶのか？">
      <Boundary known="大脳皮質・基底核・視床の間に、行動に関わる回路があります。また、霊長類のドーパミン神経の一部は、予測した報酬と実際の結果のずれに対応する反応を示します。" unknown="今の目標、過去の成功、習慣、身体の状態が競合するとき、どの活動が選ばれ、他の活動が抑えられるのか。結果がしばらく後に出たとき、どの行動や結びつきを修正するかを、回路がどう決めるのかも問いです。"/>
      <p>慣れたやり方を続けるか、別の方法を試すか。結果の評価が、次の選択や学習へどう変換されるかを考えます。</p><div className="neuro-citation-list"><Cite id="basalLoop"/><Cite id="rewardPrediction"/></div>
    </OpenQuestion>
    <OpenQuestion title="練習によって、動作はどう上達し、応用できるようになるのか？">
      <Boundary known="小脳に障害がある人の研究では、腕を動かした結果として起こる感覚の予測を学び直すことに、難しさが見られます。動作の指令と、その結果を結びつける学習への小脳の関与が調べられています。" unknown="失敗のずれを使う学習、成功した動作を繰り返す学習、意識的に工夫することを、脳はどう組み合わせるのか。身につけた技能が別の道具や状況でも使えるようになるまでに、どの回路がどう変わるのかには、未解明の部分が多くあります。"/>
      <p>練習で昨日より描きやすくなった線を、別のペンでも描ける。そのとき何が保たれ、何を調整しているのかという問いです。</p><Cite id="motorAdaptation"/>
    </OpenQuestion>
    <OpenQuestion id="neuro-unknown-mirror" title="ミラーニューロンは、観察した行為をどう自分の動作と結びつけるのか？">
      <Boundary known="自分が行為を実行するときと、他者の行為を観察するときの両方に反応する細胞が、サルと人で記録されています。行為の観察と実行が、共通の細胞の活動に結びつくことは確認されています。" unknown="見え方の異なる他者の動作と、自分の動作は、どう対応づけられるのか。その活動が、行為の理解・予測・模倣にどう使われるのか。細胞の反応から、それぞれの働きに至る処理は、まだ一つの説明につながっていません。"/>
      <p>たとえば、相手がコップをつかむのを見るときと、自分がつかむときでは、視覚や身体から入る情報が異なります。その入力が同じ細胞の反応に結びつくまでの処理と、そこから次の判断や動作へ進む処理の両方を考える必要があります。</p>
      <div className="neuro-citation-list"><Cite id="mirrorMonkey"/><Cite id="mirrorHuman"/></div>
      <h3>何が、まだつながっていないのか</h3>
      <ul><li><strong>何を対応づけているのか。</strong>手の形、動く方向、行為の目標など、観察と実行で共通して表している情報は何か。細胞や領域によってどう違うか。</li><li><strong>どう身につくのか。</strong>自分の動作を見る経験、他者をまねる経験などが、どの接続を変え、観察と実行の対応をつくるのか。</li><li><strong>その活動は何に使われるのか。</strong>動作を見分けること、先を予測すること、意図を推測することに、それぞれどの処理が必要か。情動や共感に関わる回路とは、どこでどうつながるか。</li></ul>
      <div className="neuro-citation-list"><Cite id="mirrorDataset"/><Cite id="mirrorActionUnderstanding"/></div>
      <details className="neuro-supplement"><summary>学習によって、観察への反応が変わる研究</summary><p>人に、一方の指が動くのを見ながら別の指を動かす訓練を行うと、行為の観察中に測った運動系の反応が、訓練前と逆の対応に変わりました。観察と実行の対応が、感覚と運動の学習によって変わりうることを示す結果です。</p><p>この実験では、経頭蓋磁気刺激（TMS）で運動野を刺激し、筋肉の応答を測っています。次の課題は、その変化を生む細胞や接続を特定し、観察による学習の仕組みにつなげることです。</p><Cite id="mirrorLearning"/></details>
    </OpenQuestion>
      </div>
    </Section>
    <Section title="情動と思考">
      <div className="neuro-open-questions">
    <OpenQuestion id="neuro-unknown-emotion" title="情動は、どの経験の記憶や想起を、どう変えるのか？">
      <Boundary known="人の研究では、好奇心が高いときに学んだ内容が後でよく記憶されることや、扁桃体への電気刺激で翌日の記憶成績が変わることが示されています。情動・動機づけに関わる活動と、記憶の処理の関係が調べられています。" unknown="その場の情動が、どの細胞の入力の効き方や可塑性を、どのタイミングで変えるのか。経験の内容や過去の学習との組み合わせによって、何が記憶され、どの手がかりで呼び起こされやすくなるのかを、具体的に説明するには課題が残ります。"/>
      <p><PageLink href="#/neuroscience/design">03の「昼ごはんと、親友の失敗」の例</PageLink>で考えると、体験時に生じた変化が、その後の想起のしやすさへどうつながるかが問いです。注意、情動、後から思い返すことが、それぞれどの処理に作用するかを調べます。</p>
      <div className="neuro-citation-list"><Cite id="curiosityMemory"/><Cite id="amygdalaMemory"/></div>
    </OpenQuestion>
    <OpenQuestion title="なぜ、そのとき、そのアイデアが生まれるのか？">
      <Boundary known="発想課題では、記憶、内的な思考、目標に沿った制御に関わる複数のネットワークの協調が観察されています。創造性を、一つの場所だけに割り当てる説明では捉えきれません。" unknown="なぜ、ある経験と別の経験がその瞬間に結びつくのか。生まれた考えが、なぜ本人や社会にとって新しく、価値のあるものになるのか。具体的なアイデアの内容や価値まで予測する説明には至っていません。"/>
      <p>この隔たりを埋めるには、脳活動だけでなく、その人の経験、知識、取り組んでいる課題、身体や環境との関わりも調べる必要があります。デザインの観察や実践は、脳の研究に対しても「何を説明したいのか」という具体的な問いを与えます。</p><Cite id="creativity"/>
      <p>03の「複数の経験の活動が重なる」というモデルなら、どの経験に対応する活動が、いつ、どのように重なったかを調べることになります。その重なりから、次の考えがどう生まれるかを説明することが、メカニズムの問いです。</p>
    </OpenQuestion>
      </div>
    </Section>
    <Section title="意識と発達">
      <div className="neuro-open-questions">
    <OpenQuestion title="神経活動から、なぜ主観的な経験が生まれるのか？">
      <Boundary known="何かを意識して見ているときの活動や、覚醒状態による脳の変化を測定できます。意識についての理論も、異なる予測を立てて実験で比較されています。" unknown="情報の処理が、なぜ「赤く見える」「痛いと感じる」といった主観的な経験を伴うのか。どの神経活動が意識の成立に必要で、十分なのかについて、合意された説明はありません。"/>
      <p>2025年に公表された大規模な比較実験では、統合情報理論とグローバル・ニューロナル・ワークスペース理論の予測が検証されました。結果は両理論の一部の予測と一致する一方、それぞれの重要な予測に課題を示しました。一つの実験で意識の問題が解決したという段階ではありません。</p><Cite id="consciousness"/>
    </OpenQuestion>
    <OpenQuestion title="経験から、なぜ異なる脳や個性が育つのか？">
      <Boundary known="遺伝的に同じ系統のマウスを同じ豊かな環境で育てても、探索行動の個体差が次第に広がり、その違いと海馬で新たに生まれる神経細胞の数との関連が観察されています。" unknown="遺伝、発達の時期、身体、経験、偶然の変化が、どのように積み重なって回路の特性を変えるのか。ある経験が、ある人には強く影響し、別の人にはそうならない理由を、具体的なメカニズムとして説明することは難しい課題です。"/>
      <p>経験によって次の行動が変わり、その行動が次に出会う経験を変える。この繰り返しと、回路の変化をつなげて調べる必要があります。</p><Cite id="individualDevelopment"/>
    </OpenQuestion>
      </div>
    </Section>
    <Sources links={[references.mirrorDataset, references.representationalDrift, references.multisensory, references.interoception, references.sleepReactivation, references.forgetting, references.rewardPrediction, references.motorAdaptation, references.individualDevelopment, references.consciousness]}/>
    <Next href="/neuroscience/cells" label="細胞と信号に戻って、つながりを確かめる"/>
  </>;
}
