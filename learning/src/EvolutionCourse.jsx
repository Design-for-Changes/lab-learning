import { default as Table } from './DataTable.jsx';
import { resolveEvolutionRoute } from './navigation/evolution.js';
export { evolutionLinks, evolutionAliases, resolveEvolutionRoute } from './navigation/evolution.js';
import PageLink from './PageLink.jsx';
import { Section, Sources, Next } from './Common.jsx';
import { SelectionExplorer, HamiltonExplorer } from './EvolutionExplorers.jsx';
import EvolutionConnections from './EvolutionConnections.jsx';
import './evolution.css';





const references = {
  lamarck: ['Lamarck（1809／再刊1830）Philosophie zoologique', 'https://www.biodiversitylibrary.org/item/105887'],
  wallace: ['Darwin & Wallace（1858）自然選択の共同発表', 'https://darwin-online.org.uk/converted/published/1858_species_F350.html'],
  descent: ['Darwin（1871）The Descent of Man, and Selection in Relation to Sex', 'https://darwin-online.org.uk/content/frameset?itemID=F937.1&viewtype=text&pageseq=1'],
  mendel: ['Mendel（1866）植物雑種に関する実験（英訳PDF）', 'https://askabiologist.asu.edu/sites/default/files/resources/articles/mendel/mendel_experiments_in_plant_hybridization.pdf'],
  fisher: ['Fisher（1918）メンデル遺伝と血縁者間の相関', 'https://digital.library.adelaide.edu.au/items/5ed47714-2635-4af9-8409-cf7eb6f87c3b/full'],
  wright: ['Wright（1931）Evolution in Mendelian Populations', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1201091/'],
  synthesis: ['Huxley（初版1942／再刊2009）Evolution: The Modern Synthesis', 'https://mitpress.mit.edu/9780262513661/evolution/'],
  avery: ['Avery, MacLeod & McCarty（1944）形質転換を起こす物質の研究', 'https://doi.org/10.1084/jem.79.2.137'],
  watson: ['Watson & Crick（1953）DNAの二重らせん構造', 'https://doi.org/10.1038/171737a0'],
  franklin: ['Franklin & Gosling（1953）DNAの分子構造の研究', 'https://doi.org/10.1038/171740a0'],
  ohta: ['Ohta（1973）Slightly Deleterious Mutant Substitutions in Evolution', 'https://doi.org/10.1038/246096a0'],
  smith: ['Maynard Smith（1964）Group Selection and Kin Selection', 'https://doi.org/10.1038/2011145a0'],
  williams: ['Williams（1966）Adaptation and Natural Selection：出版社による紹介（PDF）', 'https://assets.press.princeton.edu/about_pup/PUP100/book/fulltext.pdf'],
  extended: ['Pigliucci & Müller編（2010）Evolution, the Extended Synthesis', 'https://mitpress.mit.edu/9780262513678/evolution-the-extended-synthesis/'],
  textbook: ['OpenStax Biology 2e：進化の基礎', 'https://openstax.org/books/biology-2e/pages/18-1-understanding-evolution'],
  population: ['OpenStax Biology 2e：集団の進化', 'https://openstax.org/books/biology-2e/pages/19-1-population-evolution'],
  genetics: ['OpenStax Biology 2e：集団遺伝学', 'https://openstax.org/books/biology-2e/pages/19-2-population-genetics'],
  adaptation: ['OpenStax Biology 2e：適応進化', 'https://openstax.org/books/biology-2e/pages/19-3-adaptive-evolution'],
  species: ['OpenStax Biology 2e：種の形成', 'https://openstax.org/books/biology-2e/pages/18-2-formation-of-new-species'],
  inheritance: ['OpenStax Biology 2e：遺伝の法則', 'https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance'],
  meiosis: ['OpenStax Biology 2e：減数分裂', 'https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis'],
  phylogeny: ['OpenStax Biology 2e：分類と系統', 'https://openstax.org/books/biology-2e/pages/20-1-organizing-life-on-earth'],
  behavior: ['OpenStax Biology 2e：行動の仕組みと進化', 'https://openstax.org/books/biology-2e/pages/45-7-behavioral-biology-proximate-and-ultimate-causes-of-behavior'],
  allele: ['NHGRI：対立遺伝子（allele）', 'https://www.genome.gov/genetics-glossary/Allele'],
  dnaDefinition: ['NHGRI：DNAとは何か', 'https://www.genome.gov/genetics-glossary/Deoxyribonucleic-Acid-DNA'],
  note: ['蘆澤雄亮（2025）「進化生物学とデザイン」', 'https://note.com/yashizawa/n/n9df3dd852af6'],
  darwin: ['Darwin（1859）On the Origin of Species（初版）', 'https://darwin-online.org.uk/content/frameset?itemID=F373&viewtype=text&pageseq=1'],
  darwinSex: ['Darwin（1859）初版 p.88：性選択の記述', 'https://darwin-online.org.uk/Variorum/1859/1859-88-c-1860.html'],
  insects: ['Darwin（1859）On the Origin of Species：繁殖しない昆虫の問題', 'https://darwin-online.org.uk/Variorum/1859/1859-237-c-1860.html'],
  hamilton: ['Hamilton（1964）The Genetical Evolution of Social Behaviour I', 'https://doi.org/10.1016/0022-5193(64)90038-4'],
  hamiltonText: ['Hamilton（1964）原論文の本文（PDF）', 'https://pdodds.w3.uvm.edu/files/papers/others/1964/hamilton1964a.pdf'],
  trivers: ['Trivers（1971）The Evolution of Reciprocal Altruism', 'https://doi.org/10.1086/406755'],
  triversText: ['Trivers（1971）原論文の本文（PDF）', 'https://greatergood.berkeley.edu/images/uploads/Trivers-EvolutionReciprocalAltruism.pdf'],
  dawkins: ['Dawkins（初版1976／本文は2006年版）The Selfish Gene（PDF）', 'https://academics.lmu.edu/media/lmuacademics/cures/urbanecolab/module09/9.%20Richard%20Dawkins%20-%20The%20Selfish%20Gene%20%281976%29%20-%2030th%20Annversary%20edition%20%282006%29.pdf'],
  hughes: ['Hughes et al.（2008）Ancestral Monogamy Shows Kin Selection Is Key to the Evolution of Eusociality', 'https://doi.org/10.1126/science.1156108'],
  west: ['West, Griffin & Gardner（2007）Social Semantics：利他・協力・群選択の整理（PDF）', 'https://gardner.wp.st-andrews.ac.uk/files/2015/05/WestGriffinGardner_2007a.pdf'],
  wilson: ['Wilson & Wilson（2007）Rethinking the Theoretical Foundation of Sociobiology', 'https://doi.org/10.1086/522809'],
  tinbergen: ['Tinbergen（1963）On Aims and Methods of Ethology', 'https://doi.org/10.1111/j.1439-0310.1963.tb01161.x'],
  tinbergenText: ['Tinbergen（1963）原論文の本文（PDF）', 'https://www.esf.edu/biology/faculty/documents/Tinbergen1963onethology.pdf'],
  gould: ['Gould & Lewontin（1979）The Spandrels of San Marco and the Panglossian Paradigm', 'https://doi.org/10.1098/rspb.1979.0086'],
  gouldText: ['Gould & Lewontin（1979）原論文の本文（PDF）', 'https://www.uv.mx/personal/tcarmona/files/2010/08/Gould-and-Lewontin-1979c.pdf'],
  exaptation: ['Gould & Vrba（1982）Exaptation—a Missing Term in the Science of Form', 'https://doi.org/10.1017/S0094837300004310'],
  kimura: ['Kimura（1968）Evolutionary Rate at the Molecular Level', 'https://doi.org/10.1038/217624a0'],
  experiment: ['Blount, Borland & Lenski（2008）Historical Contingency and the Evolution of a Key Innovation in an Experimental Population of Escherichia coli', 'https://doi.org/10.1073/pnas.0803151105'],
  dutton: ['Dutton（2010）A Darwinian Theory of Beauty（TED）', 'https://www.ted.com/talks/denis_dutton_a_darwinian_theory_of_beauty'],
};
function Cite({ ids }) {
  return <p className="evolution-cite">文献：{ids.map((id, i) => <span key={id}>{i > 0 && ' ／ '}<PageLink href={references[id][1]} target="_blank" rel="noreferrer">{references[id][0]}</PageLink></span>)}</p>;
}
function Reading({ ids }) { return <Sources links={ids.map(id => references[id])}/>; }


function Heading({ number, title }) {
  return <><p className="eyebrow">{number} / 進化生物学入門</p><h1>{title}</h1></>;
}
function Foundations() {
  return <>
    <Heading number="01" title="前提（現代的な解釈）"/>
    <Section title="進化生物学は、何を説明する学問か">
      <p>生物には、驚くほど多様な形や暮らし方があります。一方で、細胞や遺伝情報など、多くの共通点もあります。進化生物学は、この<strong>多様性と共通性が生じた歴史と、その変化をもたらす仕組み</strong>を研究する学問です。</p>
      <p>まず、現代の進化生物学で何が分かっているのかを押さえます。次の「進化生物学の成立と発展」では、発見や論争を通じて、その理解がどのように築かれてきたのかをたどります。最後に、ここで学んだ知識をもとに人間の行動を捉え、進化生物学とデザインの関係を考えます。</p>
      <p>ここでは、広く共有されている基礎的な知識と、説明できる範囲や重要性が今も議論されている理論の両方を扱います。進化が起きてきたという事実と、ある特徴がどのように進化したかを説明する個別の仮説は、分けて考えます。</p>
      <Cite ids={['textbook']}/>
    </Section>
    <Section title="進化とは、世代を通した集団の変化">
      <p><strong>生物の進化とは、集団における遺伝的な特徴が、世代を通して変化すること</strong>です。ある体色の個体や、小さな器官をもつ個体の割合が世代を通して増えることも、遺伝に基づく集団の変化であれば進化に含まれます。個体が成長したり、練習によって上達したりすることとは区別します。</p>
      <p>日常語の「進化」には、より優れたものになるという響きがあります。しかし、生物の進化に、すべての種が向かう共通の完成形はありません。ある環境で有利な特徴が、環境が変わると不利になることもあります。進化は、人間を頂点として生物を優れた順に並べる考え方ではありません。</p>
      <p>生物の系統は、共通祖先から枝分かれしてきました。現在のヒトが現在のチンパンジーから生まれたのではなく、両者の祖先をたどると共通祖先へ行き着きます。<strong>共通祖先から受け継いだものと、分岐後に変わったもの</strong>を調べることで、生物の共通性と違いを理解します。</p>
      <Cite ids={['population', 'phylogeny']}/>
    </Section>
    <Section title="何が受け継がれ、何が変わるのか">
      <p>細胞をもつ生物では、遺伝情報を担う分子がDNAです。DNA上には、機能をもつRNAやタンパク質の産生に関わる領域である<strong>遺伝子</strong>があります。DNAは染色体を構成し、次世代へ受け継がれます。染色体上の同じ位置（遺伝子座）にある、遺伝子の異なる型を<strong>対立遺伝子（アレル）</strong>と呼びます。</p>
      <p>たとえば、ある遺伝子座にAとaという型があるなら、集団の中でAが占める割合を、世代ごとに調べられます。この割合を対立遺伝子の頻度といいます。<strong>対立遺伝子の頻度の変化</strong>として進化を捉えるのが、集団遺伝学の基本です。</p>
      <p>ただし、目に見える特徴が遺伝子だけで決まるとは限りません。体の大きさ、行動、学習のしかたなどの<strong>表現型</strong>には、遺伝子の組み合わせに加え、栄養、経験、発達過程の環境も関わります。遺伝的な影響があることと、環境によって変えられないことは別です。</p>
      <Cite ids={['allele', 'inheritance']}/>
    </Section>
    <Section title="自然選択は、進化を起こす過程の1つ">
      <p>自然選択を理解するには、個体間に違いがあること、その違いの一部が遺伝すること、違いによって繁殖成功に差が生じること、という3つの条件を考えます。これらがそろうと、より多くの子孫を残す個体がもつ特徴が、世代を通して集団に広がる可能性があります。</p>
      <p>殺虫剤への抵抗性を例にすると、抵抗性の違いが遺伝し、殺虫剤のある環境で抵抗性の高い個体が多く子孫を残すことで、集団の構成が変わります。将来を予測して必要な変異を作る、という仕組みではありません。</p>
      <p>ある環境で、どれだけ次世代に寄与するかを表す概念が<strong>適応度</strong>です。生存だけでなく、交配や受精の機会、子が成長する確率なども関わります。配偶相手の獲得や受精の機会に差が生じることで働く選択を、<strong>性選択</strong>といいます。</p>
      <Cite ids={['adaptation']}/>
      <Table headings={['過程', '集団に何が起こるか']} rows={[
        ['突然変異', 'DNA配列が変わり、新しい対立遺伝子が生じる。必要な変化が目的に合わせて起きるわけではない。'],
        ['自然選択', '遺伝する特徴による繁殖成功の差から、対立遺伝子などの頻度が変わる。'],
        ['遺伝的浮動', '有限の集団で、偶然によって次世代に残る遺伝子の割合が変わる。小さな集団ほど影響が大きい。'],
        ['遺伝子流動', '移動した個体の繁殖や花粉の移動などを通じ、集団間で遺伝子が移る。'],
      ]}/>
      <p>自然選択を通して生存や繁殖に役立つ特徴が形成されること、またはその特徴を<strong>適応</strong>といいます。進化には遺伝的浮動なども関わるため、すべての変化を適応として説明できるわけではありません。また、適応には歴史的な制約もあります。ある働きを高めると別の働きが低下する、トレードオフが生じることもあります。</p>
      <Cite ids={['genetics']}/>
      <details><summary>自然選択の単純なモデルを動かす</summary><p>2つの型がそのまま遺伝すると仮定し、次世代への寄与の差が集団をどう変えるかを見ます。この図では自然選択だけを取り出しています。</p><SelectionExplorer/></details>
    </Section>
    <Section title="集団の変化が、系統の枝分かれにつながる">
      <p>集団間の遺伝子の交流が減り、それぞれの集団で異なる変化が蓄積すると、やがて集団間で繁殖しにくくなることがあります。こうした過程によって複数の種が生じるのが<strong>種分化</strong>です。</p>
      <p>生物学的種概念では、自然界で互いに交配し、繁殖可能な子孫を残しうる集団のまとまりを種として捉えます。ただし、無性生殖する生物や化石にはそのまま使えないため、形態や系統に基づく種の捉え方も使います。</p>
      <figure className="evolution-figure evolution-tree"><svg className="plot" viewBox="0 0 500 265" role="img" aria-label="種Aと種Bが、種Cとの共通祖先より新しい共通祖先をもつ系統樹。枝の長さは時間を表さない。"><path d="M45 140H145 M145 75V210 M145 75H265 M265 40V110 M265 40H405 M265 110H405 M145 210H405" fill="none" stroke="var(--ink)" strokeWidth="3"/><circle cx="145" cy="140" r="5" fill="var(--blue)"/><circle cx="265" cy="75" r="5" fill="var(--blue)"/><text x="420" y="46">種A</text><text x="420" y="116">種B</text><text x="420" y="216">種C</text><text x="35" y="166">共通祖先</text><text x="250" y="250" textAnchor="middle">祖先から子孫への枝分かれ →</text></svg><figcaption>AとBは、Cとの共通祖先より新しい共通祖先を共有します。枝の長さは時間や変化量を表していません。</figcaption></figure>
      <p>系統樹の分岐点は共通祖先に対応します。近縁かどうかは、図の上下の位置や枝どうしの近さではなく、どの共通祖先を共有するかで判断します。似た特徴が異なる系統で独立に生じる<strong>収斂進化</strong>もあるため、形の似かただけで系統関係は決まりません。</p>
      <Cite ids={['species', 'phylogeny']}/>
    </Section>
    <Section title="行動が起きる仕組みと、その進化を分けて考える">
      <p>鳥がさえずるとき、神経やホルモンの働き、周囲の刺激、過去の学習を調べれば、いま行動が起こる仕組みが分かります。一方、さえずりが繁殖にどう関わるか、祖先からどう変わってきたかを調べれば、その進化について考えられます。</p>
      <p>前者を<strong>至近要因</strong>、後者を<strong>究極要因</strong>の説明と呼びます。「究極」は、より根本的な原因という意味ではありません。同じ現象に対して、異なる問いを立てているのです。</p>
      <p>進化の説明に、生物自身が適応度を計算して行動するという前提は必要ありません。好き、怖い、気になるといった反応が行動を引き起こす仕組みと、その仕組みが形成されてきた歴史は、別の問いとして調べます。この区別は、最後に人間とデザインを考えるときにも重要になります。</p>
      <Cite ids={['tinbergen', 'behavior']}/>
      <p>他者を助ける行動も、進化の研究の対象です。行為者自身が直接得る利益に加え、血縁者の繁殖への効果や、集団の構造などが関わります。「自分で多く繁殖する個体だけが残る」という説明では捉えきれません。次の部では、利他行動をめぐって説明がどう広がったかをたどります。</p>
      <Cite ids={['hamilton', 'west']}/>
    </Section>
    <Section title="現在の理解を支える証拠">
      <p>進化の研究では、化石、体の構造、地理的な分布、DNA配列、野外での観察、実験を組み合わせます。化石からは過去の生物の姿を、分子や形態の比較からは系統関係を調べられます。集団を継続して観察したり実験したりすることで、変化の過程を調べることもできます。</p>
      <p>たとえば大腸菌の長期進化実験では、世代を重ねる集団の変化を記録し、保存した過去の集団から実験を再開できます。Blountらの2008年の研究は、ある環境でクエン酸を利用する能力が生じる過程を調べ、過去の変化の積み重ねが後の進化に影響することを示しました。</p>
      <p>「過去の出来事だから何も確かめられない」というわけではありません。仮説が正しければどのような証拠が得られるはずかを考え、資料や実験結果と照らし合わせます。この方法も、理論とともに発展してきました。次は、その道筋をたどります。</p>
      <Cite ids={['experiment']}/>
    </Section>
    <Reading ids={['textbook', 'population', 'genetics', 'behavior', 'experiment']}/>
    <Next href="/evolution/history" label="02　進化生物学の成立と発展"/>
  </>;
}

function TimelineEntry({ id, years, point, people, title, summary, children }) {
  return <li className="evolution-event">
    <div className="evolution-event-period">
      <p className="evolution-event-date">{years}</p>
      <p className="evolution-event-point">{point.map(part => <span key={part}>{part}</span>)}</p>
    </div>
    <section className="evolution-event-content" aria-labelledby={`evolution-${id}`}>
      <p className="evolution-event-people">{people}</p>
      <h2 id={`evolution-${id}`} tabIndex="-1">{title}</h2>
      <p className="evolution-event-summary">{summary}</p>
      <details className="evolution-event-more">
        <summary aria-label={`${title}：背景と説明`}>背景と説明</summary>
        <div className="evolution-event-detail">{children}</div>
      </details>
    </section>
  </li>;
}

function History() {
  return <>
    <Heading number="02" title="進化生物学の成立と発展"/>
    <EvolutionConnections references={references}/>
    <div className="evolution-history">
      <ol className="evolution-chronology" aria-label="進化生物学の歴史年表">
        <TimelineEntry id="lamarck" point={["用不用説と", "獲得形質の遺伝"]} years="1809年" people="ラマルク" title="種の変化を、自然の仕組みで説明する"
          summary="化石や各地の生物の違いを、どう理解するか。ラマルクは種が変わると考え、環境や習性、器官の使い方と、生涯に獲得した性質の遺伝を結びつけて説明しました。">
          <p>前の部では、生物の集団が変化し、系統が枝分かれすることを前提にしました。しかし、それ自体が説明すべき問題だった時代があります。現在と異なる生物の化石が出てくること、各地に似ているが同じではない生物がいることを、どう理解すればよいのでしょうか。</p>
          <p>ダーウィン以前にも、種が変化するという考えはありました。ラマルクは1809年の『動物哲学』で、環境や習性の変化に伴って生物が変わるという理論を展開しました。器官を使う・使わないことによる変化と、生涯に獲得した性質の遺伝を、その説明に組み込みました。</p>
          <p>ラマルクの説明を、そのまま現代の進化理論として採用することはできません。ただ、種を固定的なものとせず、<strong>生物が変化する原因を、自然の仕組みによって説明しようとした</strong>ことが、後の議論の背景となりました。問われるのは「変わるか」だけでなく、「何によって変わるのか」でした。</p>
          <Cite ids={['lamarck']}/>
        </TimelineEntry>
        <TimelineEntry id="selection" point={["自然選択（淘汰）", "の登場"]} years="1858–1859年" people="ダーウィン／ウォレス" title="自然選択による進化の説明"
          summary="「生物は何によって変わるのか」という問いに、遺伝する個体差と、生存・繁殖の差を結びつけて答えました。ただし、個体の違いがどう受け継がれるのかは、未解明のままでした。">
          <p>生物が生む子の数は、その環境で生き残れる数を上回ります。同じ種の個体にも違いがあり、その一部は子へ伝わります。もし、その違いによって生き残り方や繁殖に差があるなら、次世代には特定の特徴が多く受け継がれるはずです。</p>
          <p>ダーウィンとウォレスは、この<strong>自然選択</strong>の考えに独立に到達しました。両者の論考は1858年に共同で発表され、1859年にはダーウィンの『種の起源』が出版されます。人が望む特徴をもつ個体を選んで繁殖させると、家畜や栽培植物が変化することも、選択の作用を考える手がかりでした。</p>
          <p>この説明では、将来役立つ姿をあらかじめ目指す必要がありません。親から子へ伝わる変異に選択が働くことで、環境に合った特徴が積み重なりえます。共通祖先からの分岐と合わせることで、適応、多様性、共通性を結びつける説明になりました。</p>
          <Cite ids={['wallace', 'darwin']}/>
          <p>ただし、これで全体が完成したわけではありません。そもそも変異はどこから生まれ、どう受け継がれるのか。生存には不利に見える装飾や、自分では繁殖しない働きバチをどう説明するか。後の研究につながる問いが残りました。</p>
        </TimelineEntry>
        <TimelineEntry id="mendel" point={["遺伝の法則の発見"]} years="1865–1866年" people="メンデル" title="遺伝する要素の組み合わせと分離"
          summary="自然選択が働くには、個体の違いが子孫に受け継がれる必要があります。メンデルはエンドウの実験から、遺伝する要素の組み合わせと分離によって、特徴の伝わり方を説明しました。この研究と進化論が結びつくのは、後のことです。">
          <p>自然選択が小さな違いを積み重ねるには、その違いが子孫に残る必要があります。親の性質が絵の具のように混ざり続けるだけなら、珍しい変異は交配のたびに薄まってしまうかもしれません。遺伝の仕組みは、進化論にとっても重要な問題でした。</p>
          <p>メンデルはエンドウを交配し、子や孫にどの特徴が現れるかを数えました。1865年に報告し、論文は1866年に刊行されています。ある世代で見えなくなった特徴が、後の世代に一定の割合で現れることを、遺伝する要素の組み合わせと分離から説明しました。</p>
          <p>現在の記号でAa同士の交配を考えると、それぞれの親から、Aをもつ配偶子とaをもつ配偶子が半分ずつできます。受精によってこれらが組み合わさり、子の遺伝子型の期待比はAA：Aa：aa＝1：2：1になります。AaでもAの特徴が現れるという顕性の関係なら、表現型の期待比は3：1です。<strong>表現型に現れなくても、遺伝する要素が失われたとは限らない</strong>と分かります。</p>
          <Cite ids={['mendel', 'inheritance']}/>
          <details><summary>補足：メンデルの法則を、現代の細胞の知識で捉える</summary><p>二倍体の生物では、染色体を2組もち、減数分裂で配偶子に渡る組数が半分になります。受精で両親由来の組がそろいます。組換えは既存の遺伝子の組み合わせを変え、突然変異は新しい対立遺伝子を生みます。メンデルがDNAの構造まで知っていた、という意味ではありません。</p><Cite ids={['meiosis']}/></details>
        </TimelineEntry>
        <TimelineEntry id="sexual-selection" point={["性選択（淘汰）", "の展開"]} years="1871年" people="ダーウィン" title="性選択を詳しく論じる"
          summary="自然選択による進化を生存の有利さだけで考えると、目立つ羽などの説明が難しくなります。性選択は、こうした特徴と配偶相手を得る機会の差を結びつけます。ダーウィンは1859年に言及し、1871年に詳しく論じました。">
          <p>目立つ羽や大きな角は、生存には不利でも、交配相手を得るうえでは有利に働くかもしれません。ダーウィンは『種の起源』の<strong>1859年の初版ですでに性選択に言及</strong>し、1871年の『人間の由来と性に関連した選択』で詳しく論じました。自然選択への反論を受けて、後の改版で初めて付け足した概念ではありません。</p>
          <p>ここで説明に加わるのは、配偶相手をめぐる競争と、相手の選り好みによる選択です。生き残る能力だけでなく、繁殖の機会まで含めて特徴を見る必要が明確になります。</p>
          <Cite ids={['darwinSex', 'descent']}/>
        </TimelineEntry>
        <TimelineEntry id="mendel-revisited" point={["メンデルの法則の", "再評価"]} years="1900年前後" people="メンデルの研究の再評価" title="遺伝の法則と、連続的な個体差をどう結びつけるか"
          summary="メンデルの法則が再評価され、遺伝する違いを捉える手がかりが得られました。一方、身長のように連続的な個体差がある特徴を、個別の遺伝要素でどう説明するかが問題になります。この問いが集団遺伝学へとつながります。">
          <p>この研究はすぐに進化論と結びついたわけではなく、1900年前後に再び注目されます。一方、生物には身長のように個体差が連続的に現れる特徴もあります。個別の要素として受け継がれる遺伝と、この連続的な個体差を、どう結びつけるかが次の問題になりました。</p>
          <Cite ids={['mendel', 'fisher']}/>
        </TimelineEntry>
        <TimelineEntry id="population-genetics" point={["集団遺伝学の成立"]} years="1918–1931年" people="フィッシャー／ホールデン／ライトら" title="集団遺伝学の発展"
          summary="自然選択とメンデルの遺伝の法則を、数理的に結びつけました。遺伝する多数の要素から連続的な個体差を説明し、選択や偶然によって、集団内の対立遺伝子の割合がどう変わるかを扱えるようになりました。">
          <p>フィッシャーは1918年、メンデルの法則に従って遺伝する多数の要素の効果を考えることで、連続的な個体差と血縁者間の類似性を説明できることを示しました。1つ1つの遺伝要素が個別に受け継がれても、その効果が重なれば、集団では連続的な違いとして現れます。</p>
          <p>フィッシャー、ホールデン、ライトらが発展させた<strong>集団遺伝学</strong>では、対立遺伝子の頻度が世代ごとにどう変わるかを数理的に扱います。自然選択、突然変異、集団間の移動、有限の集団で起こる偶然が、それぞれ頻度の変化にどう関わるかを考えられるようになりました。</p>
          <p>たとえば有利な変異でも、それをもつ個体が最初は1個体しかいなければ、その個体が偶然に子を残せず、変異が失われることがあります。ライトの1931年の研究などは、集団の大きさや構造と、選択・浮動の関係を扱いました。<strong>進化を理解するには、その環境で何が有利かに加えて、集団の大きさや構造も考えることが必要</strong>だと分かってきたのです。</p>
          <Cite ids={['fisher', 'wright']}/>
        </TimelineEntry>
        <TimelineEntry id="modern-synthesis" point={["総合説の成立"]} years="1930–1940年代" people="ドブジャンスキー／マイヤー／ハクスリーら" title="遺伝学と進化研究を結びつける総合説"
          summary="集団遺伝学で説明する遺伝的な変化と、野外の集団、種分化、分類、化石などの研究を結びつけました。集団内の変化から、種が分かれ、生物が多様化する過程までを、共通の枠組みで捉えるようになります。">
          <p>1930〜1940年代には、この遺伝学と、野外の集団、種分化、分類、古生物などの研究が結びついていきます。ドブジャンスキーやマイヤーらの仕事を含むこの展開を<strong>現代的総合（総合説）</strong>と呼びます。ハクスリーの1942年の著書『Evolution: The Modern Synthesis』は、その統合をまとめたものです。</p>
          <p>遺伝する変異に自然選択などが働くと、集団の遺伝的な構成が変わり、集団間の分化や種の形成につながります。このように、自然選択と遺伝が1つの説明の中で結びつきました。前の部で学んだ「集団における遺伝的な特徴の変化」という捉え方が、ここで具体的な研究の枠組みになったのです。</p>
          <Cite ids={['synthesis']}/>
        </TimelineEntry>
        <TimelineEntry id="dna" point={["遺伝を担う", "DNAの解明"]} years="1944–1953年" people="エイブリーら／フランクリンとゴスリング／ワトソンとクリック" title="遺伝を担う物質と、その構造の解明"
          summary="遺伝の研究では、特徴がどう伝わるかに加え、その情報を何が担うのかが問題でした。1944年の形質転換の研究と1953年の構造研究は、遺伝をDNAという物質と結びつけ、複製や変化を分子の水準で調べる基盤となりました。">
          <p>遺伝の要素がどのように伝わるかを説明できても、その実体がどのような物質なのかは別の問いです。1944年のエイブリー、マクロード、マッカーティの研究は、肺炎球菌の性質を変える物質がDNAであることを示しました。1953年には、フランクリンとゴスリングらのX線研究とともに、ワトソンとクリックのDNA二重らせんモデルが発表されます。</p>
          <p>1953年はDNAという物質そのものが初めて見つかった年ではなく、<strong>その構造の解明が進んだ年</strong>です。遺伝情報の複製や変化を分子の水準で調べる基盤が整い、タンパク質やDNAを生物間で比べる研究が広がります。</p>
          <Cite ids={['avery', 'watson', 'franklin']}/>
        </TimelineEntry>
        <TimelineEntry id="group-selection" point={["群選択による", "行動の説明"]} years="1962年" people="ウィン＝エドワーズ" title="社会行動を、集団への利益から説明する"
          summary="自然選択によって、自分の繁殖を減らす行動はどう進化できるのか。ウィン＝エドワーズは、個体の行動を集団の存続や繁殖上の利益と結びつけ、群選択による説明を試みました。集団内の個体間競争をどう考えるかが、論争になります。">
          <p>分子の研究と並行して、行動の研究でも、自然選択の説明を深める議論が進んでいました。たとえば働きバチは、採餌や育児を担い、女王の繁殖を支えます。自分で繁殖する機会を抑えて他個体を助ける性質が、どうして進化できるのでしょうか。</p>
          <p>この難しさはダーウィンも認識していました。『種の起源』では繁殖しない昆虫を論じ、家族に対する選択という方向から説明を試みています。後世の血縁選択の数理理論が完成していたわけではありませんが、問い自体は古くからありました。</p>
          <Cite ids={['insects']}/>
          <p>ウィン＝エドワーズは1962年、動物が個体数を調整する社会行動などを、集団への利益と群選択から説明しようとしました。しかし、同じ集団の中に繁殖を控えない個体が現れれば、その個体が増えてしまうかもしれません。集団全体に役立つことだけでは、個体間の競争がある中で、その性質が維持される条件を説明できません。</p>
          <Cite ids={['smith']}/>
        </TimelineEntry>
        <TimelineEntry id="tinbergen" point={["行動を捉える", "4つの問い"]} years="1963年" people="ティンバーゲン" title="行動を調べる4つの問いを整理する"
          summary="行動がいま起こる仕組みと、その行動が進化した理由は、別の問いです。ティンバーゲンは、仕組み・発達・生存上の価値・進化の歴史を区別し、それらを合わせて行動を理解する視点を示しました。">
          <p>行動研究では、1963年にティンバーゲンが、仕組み、発達、生存上の価値、進化の歴史という4つの問いを整理していました。現在の機能だけでなく、行動が起こる仕組み、個体の発達に伴う変化、祖先からの変化を合わせて調べる視点です。前の部の至近要因・究極要因の区別も、ここに関わります。</p>
          <Cite ids={['tinbergen']}/>
        </TimelineEntry>
        <TimelineEntry id="hamilton" point={["血縁選択と", "包括適応度"]} years="1964年" people="ハミルトン" title="血縁者の繁殖への効果から、利他行動を説明する"
          summary="自然選択と、血縁者が共通祖先から遺伝子を共有することを結びつけました。自分の繁殖への効果だけでなく、血縁度で重みづけした相手の繁殖への効果を考えることで、利他行動が広がる条件を示しました。">
          <p>ハミルトンは1964年、行為者自身の繁殖への効果に加え、遺伝的に関係する相手の繁殖への効果を考える理論を示しました。同じ祖先から受け継いだ遺伝子のコピーは、その個体だけでなく血縁者にもあります。行為者自身が残す子の数が減っても、同じ遺伝子を共有する相手が残す子の数が十分に増えれば、援助に関わる遺伝子は広がりえます。</p>
          <p>この関係を簡潔に表すのが、<strong>r × b &gt; c</strong>というハミルトンのルールです。血縁度rで重みづけした相手への利益bが、行為者自身の費用cを上回ることが、利他性が選ばれる条件になります。ここでの利益と費用とは、適応度の増減のことです。</p>
          <p>たとえば、r＝0.5の相手の繁殖成功が3増え、行為者自身の繁殖成功が1減るなら、0.5×3−1＝0.5です。血縁度だけで結果が決まるのではなく、援助によって何がどれだけ変わるかが重要です。これは<strong>血縁選択と包括適応度</strong>の考え方につながります。</p>
          <Cite ids={['hamilton']}/>
          <details><summary>血縁度・利益・費用を変えて、条件を確かめる</summary><HamiltonExplorer/></details>
          <details><summary>補足：働きバチの姉妹の血縁度は、なぜ3/4になるのか</summary><p>オスが単倍体、メスが二倍体という半倍数性のもとで、親同士が非血縁で、同じ母・同じ父をもつ姉妹を考えます。父から受け取る遺伝子はすべて共通です。これは姉妹それぞれの遺伝子の半分に当たります。母から受け取る残り半分のうち、平均して半分が共通の祖先に由来するので、期待値は1/2＋1/4＝3/4になります。</p><p>ただし、女王が複数のオスと交尾した巣では、すべての働きバチが同父の姉妹ではありません。半倍数性だけで真社会性の進化が決まるわけでもなく、交配様式、育児の利益、生活史などを合わせて考えます。祖先の単婚と真社会性の起源を比較したHughesらの研究は、その実証例です。</p><Cite ids={['hughes']}/></details>
        </TimelineEntry>
        <TimelineEntry id="selection-levels" point={["群選択への批判"]} years="1964–1966年" people="メイナード＝スミス／ウィリアムズ" title="選択が働く水準と条件を問い直す"
          summary="群選択で集団全体の利益を説明しても、その中で協力しない個体が増える可能性が残ります。メイナード＝スミスやウィリアムズは、集団への利益と個体間競争を合わせて考え、どの条件で選択が働くかを問いました。">
          <p>メイナード＝スミスの1964年の論考や、ウィリアムズの1966年の著書は、選択がどの水準で、どの条件のもとで働くのかを厳しく問いました。この批判は、集団を考えること自体を禁止したのではなく、説明すべき仕組みを明確にするものでした。</p>
          <Cite ids={['smith', 'williams']}/>
        </TimelineEntry>
        <TimelineEntry id="neutral-theory" point={["中立説の登場"]} years="1968年" people="木村資生" title="分子進化の中立説を提案する"
          summary="DNAやタンパク質を比較して分子の変化を調べる研究と、集団遺伝学の遺伝的浮動の理論が結びつきました。木村は、分子レベルで固定する変化の多くを、選択上ほぼ中立な変異の浮動によって説明しました。">
          <p>すると、分子にはどれほどの速さで変化が蓄積するのか、その変化をすべて有利な適応として説明できるのか、という問いが生まれます。木村資生は1968年、分子レベルで固定する変化の多くについて、選択上ほぼ中立な変異の<strong>遺伝的浮動による固定</strong>を重視する中立説を提案しました。</p>
          <Cite ids={['kimura']}/>
        </TimelineEntry>
        <TimelineEntry id="reciprocity" point={["互恵的利他行動", "の理論"]} years="1971年" people="トリヴァース" title="互恵的利他行動の理論"
          summary="血縁選択によって利他行動の理解は進みましたが、血縁関係の薄い相手への援助もあります。トリヴァースは、いま負担する費用と、繰り返し関わる中で得られる将来の利益を結びつけ、互恵的利他行動を説明しました。">
          <p>血縁選択によって利他性の理解は進みましたが、血縁関係の薄い相手との協力がすべて説明されたわけではありません。トリヴァースは1971年、その場では費用のある援助でも、繰り返し関わる中で将来の利益を得られるなら、維持されうると論じました。<strong>互恵的利他行動</strong>の理論です。</p>
          <p>互恵的な関係が成立するかどうかは、再び関わる可能性、利益と費用の大きさ、援助に応じない相手への対応などによって変わります。また、共同で利益を得る協力や、異なる種がともに利益を得る相利共生もあります。他者に利益をもたらすというだけでは、生物学的な利他行動とはいえません。</p>
          <Cite ids={['trivers', 'west']}/>
        </TimelineEntry>
        <TimelineEntry id="nearly-neutral" point={["ほぼ中立説の展開"]} years="1973年" people="太田朋子" title="ほぼ中立な変異に着目する"
          summary="太田は、中立説が重視した分子の変化と遺伝的浮動の関係に、ごく弱い自然選択と集団の大きさを組み込んで考えました。わずかに不利な変異も、条件によっては浮動で固定しうると論じました。">
          <p>太田朋子は1973年、ごくわずかに不利な変異も、条件によっては浮動で固定しうることを論じました。ほぼ中立な変異では、選択の弱さと集団の大きさの関係が重要になります。</p>
          <p>これらは、適応や自然選択の存在を否定する理論ではありません。<strong>どの水準の、どの変化を説明しているのか</strong>に応じて、自然選択と偶然がそれぞれどれほど影響しているかを考える必要があるのです。</p>
          <Cite ids={['kimura', 'ohta']}/>
        </TimelineEntry>
        <TimelineEntry id="selfish-gene" point={["遺伝子を中心とした", "進化観"]} years="1976年" people="ドーキンス" title="遺伝子のコピーから進化を捉える視点を広く伝える"
          summary="血縁選択や互恵性などの研究を、「世代を超えて遺伝子のコピーがどう残るか」という視点で結びつけ、広く伝えました。個体が他者を助けることと、その行動に関わる遺伝子が広がることは、両立しうると説明します。">
          <p>ドーキンスの1976年の『利己的な遺伝子』は、こうした研究を、<strong>世代を超えて残る遺伝子のコピーという視点</strong>から説明して広く伝えました。個体の行動としては利他的でも、遺伝子の伝わり方に注目すると、その行動を促す性質が広がる理由を説明できる場合がある、という見方です。</p>
          <p>「利己的」は遺伝子の意識や意図を意味しません。また、人間は道徳的に利己的であるべきだという主張にもなりません。遺伝子が集団の中で増減する仕組みと、個体の気持ちや社会の価値判断は、区別する必要があります。</p>
          <Cite ids={['dawkins']}/>
        </TimelineEntry>
        <TimelineEntry id="adaptation" point={["適応主義への批判", "と外適応"]} years="1979–1982年" people="グールド／ルウォンティン／ヴルバ" title="適応の説明を問い直す"
          summary="自然選択で特徴を説明するとき、現在役立つことと、その特徴が生じた理由を結びつけすぎる問題が指摘されました。適応主義への批判と外適応の議論は、発生や構造の制約、もとの役割も調べる必要性を示しました。">
          <p>進化の理論は、行動や形の由来を説明する力をもちます。その一方で、いまある特徴を見て、それが役立ちそうな理由を後から考えるだけでも、もっともらしい物語を作れてしまいます。どこまでが証拠に支えられた説明なのでしょうか。</p>
          <p>グールドとルウォンティンは1979年、特徴を細かく切り分け、それぞれに適応上の理由を割り当てる説明を批判しました。ある特徴が別の特徴の副産物として生じることもあり、その形成には、発生・構造・系統による制約も関わります。1982年にはグールドとヴルバが、もともと別の役割をもっていた特徴などが新たな機能に使われる<strong>外適応</strong>を論じています。</p>
          <p>この議論で大切なのは、<strong>現在の役立ち方だけでは、その特徴が生じた理由は説明できない</strong>という点です。自然選択の説明を捨てるのではなく、他の可能性と比べ、何を根拠に適応と判断するのかを問います。</p>
          <Cite ids={['gould', 'exaptation']}/>
        </TimelineEntry>
        <TimelineEntry id="multilevel" point={["マルチレベル選択", "への注目"]} years="2007年" people="D. S. ウィルソン／E. O. ウィルソン" title="複数の水準で働く選択から、社会生物学を捉え直す"
          summary="群選択の議論で問題になった集団内の競争と、集団間の差を合わせて扱います。同じ進化の過程を、血縁選択では血縁度と援助の効果から、マルチレベル選択では集団内・集団間の差から説明できる場合があります。">
          <p>ウィルソンとウィルソンの2007年の論考は、複数水準の選択を重視して社会生物学を捉え直しました。一方、血縁選択との関係や用語の使い方を整理する研究もあります。同じ進化の過程を、一方では血縁関係と援助の効果から、他方では集団内・集団間の差から説明できる場合もあります。</p>
          <p>群選択への批判の後も、集団間の差が進化にどう関わるかという問いは残りました。集団の中では、協力に伴う費用を負担しない個体が有利かもしれません。一方で、協力する個体の多い集団が、他の集団より多くの子孫を残すかもしれません。</p>
          <p><strong>マルチレベル選択</strong>は、このように複数の階層で働く選択を扱います。集団内と集団間の選択が、逆向きに働くこともあります。次は、協力型がそのまま子へ伝わると仮定した、理解のための数値例です。実測データではありません。</p>
          <Table headings={['集団', 'はじめの協力型 / 全体', '次世代の協力型 / 全体']} rows={[
          ['協力型が多い集団', '16 / 20 ＝ 80%', '28 / 40 ＝ 70%'],
          ['協力型が少ない集団', '4 / 20 ＝ 20%', '1 / 10 ＝ 10%'],
          ['2集団を合計', '20 / 40 ＝ 50%', '29 / 50 ＝ 58%'],
          ]}/>
          <p>各集団内では協力型の割合が下がっていても、協力型が多かった集団がより多くの子孫を残すため、全体では割合が上がります。ただし、実際にこうした条件が成立するかは、個体の移動、集団の形成、繁殖などから確かめる必要があります。</p>
          <Cite ids={['wilson', 'west']}/>
        </TimelineEntry>
        <TimelineEntry id="today" point={["発生・ゲノム研究", "への広がり"]} years="現在" people="進化発生生物学・ゲノム比較など" title="複数の知見を組み合わせて、進化を調べる"
          summary="集団遺伝学や分子進化の知見は、発生の研究やゲノム比較とも結びついています。遺伝子の違いが形や行動にどう関わるか、その変化に選択・浮動・過去の歴史がどう影響するかを、複数の証拠から調べています。">
          <p>したがって、この歴史は「群選択が否定され、血縁選択が否定され、最後にマルチレベル選択で完成した」という一本道ではありません。<strong>対象と問いを分け、各理論が説明する範囲と条件を明確にしてきた過程</strong>です。</p>
          <p>現在は、遺伝と発生の関係を扱う進化発生生物学や、ゲノムの比較などへも研究が広がっています。自然選択、遺伝的浮動、遺伝、発生、系統の歴史に関する知識を組み合わせて、具体的な現象を調べます。最初の部で押さえた現代的な理解は、こうした研究の積み重ねによって築かれてきたものです。</p>
          <Cite ids={['extended']}/>
        </TimelineEntry>
      </ol>
      <p className="evolution-history-note">年代は、ここで取り上げた発表や研究の時期を示しています。複数の研究は並行して進んでおり、年表の後にある理論が、それ以前の理論をすべて置き換えたわけではありません。</p>
    </div>
    <Reading ids={['darwin', 'mendel', 'fisher', 'wright', 'synthesis', 'kimura', 'hamiltonText', 'triversText', 'dawkins', 'gouldText', 'wilson', 'west']}/>
    <Next href="/evolution/design" label="03　進化生物学とデザイン"/>
  </>;
}

function Design() {
  return <>
    <Heading number="03" title="進化生物学とデザイン"/>
    <Section title="人間の行動を、どのような視点から理解するか">
      <p>人間も、生物としての歴史をもっています。ものを見る、危険を避ける、他者に注意を向ける、経験から学ぶ。デザインが関わるこうした働きにも、その仕組みが形成されてきた進化の歴史があります。</p>
      <p>ただし、ある製品を選ぶ行動を見ただけで、その進化的な理由まで分かるわけではありません。生活環境、学習、文化、社会関係、本人の目的なども、いまの行動に関わります。進化生物学を学ぶことで、人間の行動について、いまの仕組みだけでなく、その仕組みが生じた歴史にも目を向けられます。</p>
      <p>まず、前の部で扱ったティンバーゲンの4つの問いを使って、人間の行動について考えてみましょう。</p>
      <Table headings={['問い', '着目すること']} rows={[
        ['仕組み', 'どんな刺激、知覚、感情、神経や身体の働きが、いまの行動を起こすのか。'],
        ['発達', '経験や学習を通じて、その反応や習慣がどう形成されたのか。'],
        ['機能', 'その特徴が、どのような条件で生存や繁殖に関わるのか。'],
        ['系統の歴史', '関連する特徴が、祖先からどのように変化してきたのか。近縁な生物とは何が共通し、何が異なるのか。'],
      ]}/>
      <p>この4つの問いをデザインに応用すると、「なぜそうするのか」を考える際に、行動が起こる仕組みと、その進化的な背景などを分けて検討できます。</p>
      <Cite ids={['tinbergen', 'behavior']}/>
    </Section>
    <Section title="「美しい」と感じることは、性選択で説明できるか">
      <p>デニス・ダットンはTEDの講演で、美を感じることの進化的な背景について考え、巧みに作られた手斧を、作り手の能力を示す信号として捉える議論を紹介しています。性選択と人間の表現をつなぐ、具体的な例です。</p>
      <Cite ids={['dutton']}/>
      <p>ここでは、仮説をいくつかの段階に分け、それぞれで何を説明しようとしているかを整理します。①巧みな制作物が能力を知らせる、②それが相手の評価を変える、③その評価が過去の繁殖成功に影響した、④その結果、美に反応する性質が進化した、という段階は、それぞれ確かめる内容が異なります。</p>
      <p>いま魅力的に見えるというだけでは、人間がそれを魅力的だと感じるようになった進化的な理由まで説明することはできません。学習や文化による違い、他の機能からの転用なども考えられます。ここに、前の部で見た適応主義への批判が関わります。</p>
      <Cite ids={['gould', 'exaptation']}/>
    </Section>
    <Section title="蘆澤雄亮の考察：淘汰圧と、いま感じる欲求">
      <p>蘆澤雄亮の「進化生物学とデザイン」は、洋服を選ぶ、ゲームを続ける、かわいいものを好むといった身近な行動から、進化生物学との接点を考察しています。</p>
      <p>記事が着目するのは、<strong>進化の過程で形成された欲求や反応が、それぞれの状況で別の行動を引き起こす</strong>という見方です。現在の行動を1つずつ、直接的な生存や繁殖上の利益に結びつけようとすると、説明が苦しくなることを指摘しています。</p>
      <p>たとえば「かわいいと感じて近づきたくなる」は、いまの動機に関する説明です。その反応を生む仕組みがなぜ進化したのか、その反応が現在の状況でも生存や繁殖に役立つのかは、それぞれ別に調べる必要があります。至近要因と究極要因、現在の機能と歴史的な由来を分けると、記事の問題意識を整理できます。</p>
      <p>個々の欲求の由来についての記事中の説明は、蘆澤による考察として読みます。進化生物学の確立した説明と同じ扱いにはせず、本編で学んだ知識を使って考える材料に位置づけます。</p>
      <Cite ids={['note']}/>
    </Section>
    <Section title="デザインに持ち帰る視点">
      <p>進化生物学を学ぶことで、「いま役立つ理由」と「その特徴が生じた理由」、「本人の動機」と「その仕組みの歴史」を分けて考えられるようになります。人の行動を1つの欲求だけで説明せず、複数の可能性を検討する手がかりになります。</p>
      <p>たとえば収集を促すサービスを考える場合、何を集めたくなるのか、どんな経験が好みに影響するのか、本人はその体験をどう受け止めるのかを調べられます。進化的な仮説は、調査で何を問うかを考える手がかりの1つになります。ただし、具体的な利用者の行動や経験は、実際の調査で確かめる必要があります。</p>
      <p>また、ある傾向に生物学的な背景があることから、社会や製品をどう設計すべきかが決まるわけではありません。人間の行動についての知見を踏まえたうえで、どのような体験や関係をつくりたいのかを考えます。進化生物学から得た理解は、こうしたデザインの判断を考える材料になります。</p>
    </Section>
    <Reading ids={['note', 'dutton', 'tinbergenText', 'gouldText', 'exaptation']}/>
    <Next href="/" label="学習資料の一覧へ戻る"/>
  </>;
}

const chapters = {
  '/evolution/foundations': Foundations,
  '/evolution/history': History,
  '/evolution/design': Design,
};
export default function EvolutionCourse({ route }) {
  const Chapter = chapters[resolveEvolutionRoute(route)];
  return Chapter ? <Chapter/> : <><h1>ページが見つかりません</h1><Next href="/evolution/foundations" label="進化生物学入門の最初へ戻る"/></>;
}
