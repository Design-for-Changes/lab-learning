import PageLink from './PageLink.jsx';
import { Section, Next } from './Common.jsx';
import { scienceSources } from './scienceSources.js';
import { methodHistory, purposeHistory } from './scienceHistory.js';
import { InferenceDiagram, PasteurQuadrant, ResearchPurpose } from './ScienceFigures.jsx';
import './science.css';

export const scienceChapters = [
 { slug:'foundations', title:'科学とは何か？' },
 { slug:'knowledge', title:'科学はどう知識をつくるのか？' },
 { slug:'history', title:'科学の歴史と考え方の変遷' },
 { slug:'contemporary', title:'現代の科学と主な論点' },
];
export const scienceLinks=scienceChapters.map((c,i)=>[`/science/${c.slug}`,`${String(i+1).padStart(2,'0')}　${c.title}`]);
export const resolveScienceRoute=route=>route==='/science'?'/science/foundations':route;

function References({ids}){return <div className="science-references" aria-label="この節の出典"><span>出典</span>{ids.map(id=><PageLink key={id} href={scienceSources[id].url} target="_blank" rel="noreferrer">{scienceSources[id].label} ↗</PageLink>)}</div>;}
function Point({children}){return <p className="science-point">{children}</p>;}
function FalsifiabilityExample(){return <div className="science-example science-testing-example"><h3>反証可能性とは？</h3><p>その主張が間違いだと分かる観察結果を、具体的に挙げられることです。実際に間違いが見つかった、という意味ではありません。</p><p>例えば「この袋の豆はすべて白い」という主張なら、<strong>「袋の中から白くない豆が一粒でも見つかる」</strong>という結果が反証になります。だから、この主張には反証可能性があります。</p><p>一方、「どんな色の豆が出ても、見えない力がそう決めたのだ」という主張では、どんな結果なら間違いなのかが示されていません。</p><p className="science-caption">反証可能性は主張を試せる形にする条件です。その主張が正しいことや、研究全体が信頼できることを、それだけで保証するわけではありません。</p></div>;}
function Reading({ids}){return <Section title="文献を読む"><p>本文は文献をもとにした学習用の整理です。説明用の例は教材で作成しています。SEPは複数の立場を紹介する事典なので、各項目の中でも論点と立場を区別して読んでください。</p><div className="science-reading">{ids.map(id=>{const source=scienceSources[id];return <details key={id}><summary><span>{source.type}</span>{source.label}</summary><div><PageLink href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</PageLink><p>{source.note}</p></div></details>;})}</div></Section>;}

function Foundations(){return <>
 <Section title="scienceは、もともと「知ること」に関わる言葉">
  <p>scienceの語源をたどると、ラテン語の<strong>scientia（知識・理解）</strong>に行き着きます。そのもとには「知る」を意味するscireがあります。英語にはフランス語を経由して入りました。</p>
  <p>ただし、言葉の由来だけでは、現在の科学の特徴までは分かりません。「昨日の昼に何を食べたか」も知識ですが、それを知っているだけで科学研究をしたとは言わないでしょう。では、科学はどのように知識をつくるのでしょうか。</p>
  <References ids={['etymology']}/>
 </Section>
 <Section title="「そう思う」から、他の人も確かめられる説明へ">
  <p>例えば「駅の案内を大きくすれば、迷う人は減る」と思ったとします。それらしく聞こえても、大きさが原因なのか、案内の位置なのか、まだ分かりません。</p>
  <div className="science-three"><article><span>気づき</span><h3>何が起きている？</h3><p>案内があるのに、分岐で立ち止まる人がいる。</p></article><article><span>説明</span><h3>なぜだろう？</h3><p>文字が小さく、分岐に来るまで見えていないのかもしれない。</p></article><article><span>証拠</span><h3>何を見れば確かめられる？</h3><p>文字の大きさを変えたとき、気づく場所や迷う割合は変わるだろうか。</p></article></div>
  <Point>科学では、説明とその根拠を結びつけ、他の人も検討できる知識をつくっていきます。</Point>
  <p>起きていることを調べる<strong>観察</strong>、条件を変えて結果を比べる<strong>実験</strong>、対象の特徴を図や式で表す<strong>モデルづくり</strong>など、用いる方法はさまざまです。</p>
  <p>分かっていることをもとに、別のことを導くのが<strong>推論</strong>です。この教材では、証拠と推論を使って説明や予測を組み立て、批判や修正に開く営みとして、科学を捉えていきます。</p>
  <References ids={['method','social']}/>
 </Section>
 <Section title="「科学らしい言葉」だけでは、信頼できるか分からない">
  <p>「実験で証明」「専門家が推奨」と書かれていても、どの実験で、何を、どこまで確かめたのかが分からなければ、その主張を判断できません。</p>
  <p>科学と科学ではないものをどう区別するかは、<strong>線引き問題</strong>と呼ばれます。特に、科学を装う疑似科学との区別は、医療や教育で何を信頼するかに関わります。</p>
  <p>この問題には歴史があります。「観察で確かめられるか」「間違いだと分かる可能性があるか」「研究が新しい発見につながっているか」など、異なる基準が提案されてきました。一つの基準ですべてを分けられる、という合意には至っていません。</p>
  <div className="science-example"><h3>例えば、結果が合わなかったとき</h3><p>「この条件では予測が外れた」と示して説明を見直すのか、都合の悪い結果を隠して同じ主張を続けるのか。結論の見栄えだけでなく、証拠への向き合い方にも注目できます。</p></div>
  <p>また、科学ではないものが、すべて疑似科学というわけでもありません。詩や芸術などを、科学を装った主張と同じカテゴリーに入れる理由はありません。</p>
  <p><PageLink href="#/science/history#science-method-history">03：線引き問題の歴史をたどる →</PageLink></p>
  <References ids={['demarcation']}/>
 </Section>
 <Section title="修正できることと、何でも同じくらい怪しいことは違う">
  <p>科学的な説明は、新しい証拠や考え方によって修正される可能性があります。ただし、多くの検討を経た説明と、思いついたばかりの説明とでは、支えられている程度が違います。</p>
  <Point>「絶対に正しいか」の二択だけでなく、「何によって、どの範囲まで支えられているか」を考えます。</Point>
  <p>科学が進歩するとは、真理に近づくことなのか、解ける問題が増えることなのか、理解が深まることなのか。この点にも議論があります。「科学とは何か」を学ぶことは、知識の増やし方と、そのよさを判断する基準を考えることでもあります。</p>
  <References ids={['progress']}/>
 </Section>
 <Reading ids={['etymology','demarcation','method','social','progress']}/>
 </>;}

function Knowledge(){return <>
 <Section title="観察したことと、その説明を分ける">
  <p>「10人中4人が分岐で立ち止まった」は観察の記録です。「文字が小さかったからだ」は、その記録に対する説明です。同じ観察から、別の説明を考えることもできます。</p>
  <div className="science-three"><article><h3>観察・データ</h3><p>観察は起きていることを調べること。データは、その記録です。立ち止まった人数や時間など、何をどう記録したかも示します。</p></article><article><h3>仮説</h3><p>検討するために仮に立てた説明。例えば「文字が小さく、発見が遅れたのでは」。</p></article><article><h3>理論・モデル</h3><p>理論は、複数の現象を筋道立てて説明する枠組み。モデルは、考えたい特徴を取り出して図や式などで表したものです。</p></article></div>
  <p>理論は「まだ証拠のない思いつき」という意味ではありません。また、データを記録するときにも、「何秒以上止まれば立ち止まったと数えるか」などの判断が入ります。記録の仕方も、説明を検討するための情報です。</p>
  <References ids={['observation']}/>
 </Section>
 <Section title="演繹・帰納・アブダクションを、同じ図で見る" id="science-inference">
  <p>推論の出発点として置く事柄を<strong>前提</strong>、そこから導く答えを<strong>結論</strong>と呼びます。前提から、論理的に必ず成り立つ結論を導くのが<strong>演繹（えんえき）</strong>です。</p>
  <p>「BならばCである」という一般的な規則が<strong>大前提</strong>、「AはBに当てはまる」という事例が<strong>小前提</strong>です。この二つをつなぐと「AはCである」と言えます。この<strong>A→B→CとA→Cのつながり</strong>を共通の図にすると、三つの推論を比べられます。</p>
  <p>観察した例から、まだ見ていないものへ規則を広げるのが<strong>帰納（きのう）</strong>。観察したことを説明するために仮説を考えるのが<strong>アブダクション（仮説形成）</strong>です。</p>
  <InferenceDiagram/>
  <Point>演繹は前提をつないで結論へ。帰納は観察から規則へ。アブダクションは観察を説明する仮説へ。</Point>
  <p>図のアブダクションでは、<strong>A→BとB→Cの両方を仮説として補う場合</strong>を示しています。片方がすでに分かっていれば、もう片方だけを補う場合もあります。中心にあるのは、観察したことを説明するために、必要な前提を考えることです。</p>
  <details className="science-aside"><summary>帰納とアブダクションは、観察の数だけでは分けられない</summary><div><p>帰納は、観察した傾向をまだ見ていないものへ広げます。アブダクションは、「この仮説なら観察を説明できる」と考えます。観察が多くても説明の仮説を立てることはあり、観察が少ない帰納もあります。</p><p>また、観察を重ねても、その規則が必ず成り立つと論理的に保証されるわけではありません。演繹は、仮に置いた条件からでも、そこから何が言えるかを考えられます。</p><p>Peirce（1878）の豆の例は、規則を既知として事例を仮定する形です。この教材では、提供資料の図に合わせ、二つの前提をまとめて仮説として考える例へ広げています。仮説形成では、途中に置く考えBそのものや新しい規則を考案する場合もあります。現代の文献では、複数の候補から最もよい説明を選ぶ意味でもアブダクションという語が使われます。</p></div></details>
  <p className="science-caption">図の構成は蘆澤雄亮『「新しい論文のかたち」討論会用メモ』12頁（提供資料）を参考に再構成。豆の例はPeirce（1878）をもとに教材用に変更し、仮説形成の説明はSEPと照合しています。</p>
  <References ids={['peirce','peirceAbduction','abduction','induction']}/>
 </Section>
 <Section title="予想をつくると、説明を試せる">
  <p>「案内の文字が小さくて気づかなかった」という仮説なら、「位置を変えずに文字を大きくすると、より手前で気づくはずだ」と予想できます。予想と結果を比べることで、説明の検討が進みます。</p>
  <ol className="science-process"><li><strong>手がかりを得る</strong><span>人がどこで迷うかを観察する。</span></li><li><strong>仮の説明を考える</strong><span>文字の大きさが、発見の遅れに関わるのでは。</span></li><li><strong>説明から予想をつくる</strong><span>大きくすると、気づく場所が変わるはずだ。</span></li><li><strong>比較して確かめる</strong><span>位置などの条件をそろえ、結果を比べる。</span></li><li><strong>説明・条件・測定を見直す</strong><span>合う結果も、合わない結果も踏まえ、次の検討へ戻る。</span></li></ol>
  <p className="science-caption">仮説を試す進め方の一例です。実際には探索や道具づくりから始まる研究もあり、この順番がすべての科学に必須というわけではありません。</p>
  <p>予想どおりでも、その説明だけが正しいと決まるわけではありません。予想と違った場合にも、仮説だけでなく、測定の仕方や前提に問題がないかを検討します。</p>
  <p>観察や実験で主張を確かめることを<strong>検証</strong>、主張と両立しない結果を示すことを<strong>反証</strong>と呼びます。次の例で、その違いを押さえます。</p>
  <FalsifiabilityExample/>
  <References ids={['method','popper']}/>
 </Section>
 <Section title="モデルは、何を残し、何を省くかを決める">
  <p>駅の地図は、壁の材質や広告を省いて、通路と分岐を残しています。現実をすべて写していなくても、道順を考える役には立ちます。科学のモデルも、対象のどこに注目するかを選んで表します。</p>
  <p>例えば、通路を線、人の移動を矢印で表すモデルなら、経路を調べやすくなります。一方、照明や混雑を省いたままでは、それらが重要な問題には答えにくくなります。</p>
  <Point>モデルは、何のために使い、どの条件で確かめたかと一緒に読む必要があります。</Point>
  <References ids={['models']}/>
 </Section>
 <Section title="一つの方法で、すべてを確かめるわけではない">
  <p>繰り返せる実験が有効な問いも、残された記録を組み合わせる問いも、数式や計算モデルを使う問いもあります。大切なのは、方法の名前よりも、その方法で知りたいことにどこまで答えられるかです。</p>
  <p>「原因が分かった」「予測できた」「使える方法をつくった」では、主張の中身が違います。その違いは、04で同じ案内表示の例を使って比較します。</p>
  <References ids={['method']}/>
 </Section>
 <Reading ids={['observation','peirce','peirceAbduction','abduction','induction','method','popper','models']}/>
 </>;}

function Timeline({items,label}){return <ol className="science-timeline" aria-label={label}>{items.map(item=><li key={item.date}><div className="science-timeline-date">{item.date}</div><article><h3>{item.title}</h3><p className="science-work">{item.work}</p>{item.terms&&<dl className="science-term-definitions">{item.terms.map(([term,meaning])=><div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>}<dl className="science-reasoning"><div><dt>背景</dt><dd>{item.why}</dd></div><div><dt>転換点</dt><dd><strong>{item.point}</strong></dd></div><div><dt>残る問い</dt><dd>{item.remaining}</dd></div></dl><details><summary>補足と文献</summary><div><p>{item.note}</p><References ids={item.sources}/></div></details></article></li>)}</ol>;}

function History(){return <>
 <Section title="科学の変遷を、二つの問いからたどる">
  <div className="science-two"><article><span>線引き問題の歴史</span><h3>何をもって、科学と呼べる？</h3><p>検証や反証という基準から、研究の進み方や複数の観点を重ねる議論へ。</p><PageLink href="#science-method-history">この流れを読む ↓</PageLink></article><article><span>目的と担い手の変遷</span><h3>何のために、誰が知識をつくる？</h3><p>Pure／Appliedの区分から、理解と利用の重なり、設計が生む知識へ。</p><PageLink href="#science-purpose-history">Pure／Appliedの流れを読む ↓</PageLink></article></div>
  <p>年表は、科学全体の出来事を網羅するものではありません。科学観を変えた議論を選び、何が問題になり、どう捉え直したかを示します。古い考えがすべて消え、新しい考えに置き換わったという一本道ではありません。</p>
 </Section>
 <Section title="線引き問題の歴史：何を基準に、科学を区別する？" id="science-method-history">
  <p>なぜ線を引くのか。科学という名前が、治療法や学校で教える内容を信頼する理由になるからです。ただし、「どの主張も後から説明できる理論」と「間違いが見つかりながら発展する研究」を、一つの基準でうまく分けるのは簡単ではありません。</p>
  <p>科学と科学ではないものの区別が<strong>線引き問題</strong>です。その中でも、科学を装いながら証拠の扱いなどに重大な問題を抱える<strong>疑似科学</strong>との区別が、社会的な課題になります。</p>
  <div className="science-two"><article><h3>検証：主張を確かめる</h3><p>観察や実験で、その主張が成り立つかを調べること。例えば「この袋の豆はすべて白い」なら、中身を調べます。一部が白かっただけでは、袋全体について確かめたことにはなりません。</p></article><article><h3>反証：主張と合わない結果を示す</h3><p>その主張が成り立たないと分かる結果を示すこと。同じ袋から白くない豆が一粒でも見つかれば、「すべて白い」という主張の反証になります。</p></article></div>
  <FalsifiabilityExample/>
  <References ids={['popper','demarcation']}/>
  <p>この違いを押さえて、観察と推論をめぐる前史から線引きの議論をたどります。主張に意味があるか、科学と呼べるか、研究として信頼できるかは、関係していますが同じ問いではありません。</p>
  <Timeline items={methodHistory} label="線引き問題の前史と基準の変遷"/>
  <Point>視線は、個々の主張を検証・反証できるかという問いから、研究がどう進み、証拠や批判にどう応えるかへ広がりました。</Point>
  <p>反証可能性が不要になったわけではありません。何を評価するかを、主張、研究の連続した取り組み、共同体の実践へと広げながら、複数の立場で議論が続いています。</p>
  <References ids={['demarcation','multicriteria']}/>
 </Section>
 <Section title="Pure vs Applied、そして捉え直し" id="science-purpose-history">
  <p><strong>Pure science（純粋科学）</strong>は、現象の仕組みを理解することに重きを置く科学。<strong>Applied science（応用科学）</strong>は、具体的な問題に科学の知識を役立てることに重きを置く科学です。まず、この違いを入口にします。</p>
  <p><strong>Basic research（基礎研究）</strong>も、根本的な理解を深める研究を指す言葉です。ただし、これらの言葉の範囲や価値づけは、時代や制度で変わります。理解と利用を両方目指す研究もあるため、後で二つの軸に分けて考えます。</p>
  <Point>「理解する研究」と「役立てる研究」を分けるだけでは、実際の知識の生まれ方を捉えきれません。</Point>
  <p>この節では、19世紀末の米国での区分、戦後の基礎研究支援、1990年代以降の捉え直しをつなぎます。蘆澤（2026）第2節の問題提起を入口に、参照先の文献へ戻って整理しています。</p>
  <References ids={['lucier','ashizawa']}/>
  <Timeline items={purposeHistory} label="PureとAppliedの区分と捉え直しの年表"/>
  <p>制作と知識の関係は、04の<PageLink href="#/science/contemporary#science-rtd">Research through Design：つくることを通して知る</PageLink>で、具体例を使って考えます。</p>
 </Section>
 <Section title="パスツールの象限" id="science-quadrant">
  <p>図を二つの軸で区切った四つの領域を<strong>象限（しょうげん）</strong>と呼びます。ここでは、<strong>理解を深めたいか</strong>と<strong>利用を考えるか</strong>を別々の軸にします。この二軸なら、利用を考えながら基礎的な理解も深める研究を置けます。</p>
  <PasteurQuadrant/>
  <p>パスツールは、発酵や病気という実際の問題を追いながら、微生物についての基礎的な理解も進めました。Stokesはこの例から、科学と技術が互いを促す関係を論じました。</p>
  <References ids={['stokes']}/>
 </Section>
 <Section title="何が、どうシフトしたのか">
  <div className="science-shifts"><article><h3>確かめ方への視線</h3><p>観察と論理だけでなく、モデル、測定、研究共同体での批判など、知識を支える実際の働きにも目が向けられるようになった。</p></article><article><h3>研究目的の捉え方</h3><p>基礎と応用を分ける見方に加えて、利用上の問題が基礎的な理解を促す関係を捉える見方が示された。</p></article><article><h3>知識をつくる場</h3><p>専門分野の中での研究に加えて、現場や異なる専門との関わり、設計の実践が生む知識をどう位置づけるかが論点になった。</p></article></div>
  <p>その結果、研究を評価するときには、「何を知ろうとしているか」「誰と、どの場でつくる知識か」「何によって成果を確かめるか」を合わせて考える必要が見えてきます。</p>
  <p>研究者たちが共有する理論・方法・問題の捉え方を<strong>パラダイム</strong>と呼び、その枠組み自体の大きな転換を<strong>パラダイムシフト</strong>と呼びます。蘆澤論文では、研究の目的や評価の捉え方が変わることも含む、広い意味で使われています。</p>
  <details className="science-aside"><summary>ここでいう「パラダイムシフト」の意味</summary><div><p>クーンのパラダイムは、研究共同体が共有する問題・手本・方法などに関わる概念です。一方、蘆澤論文第2節は、研究の目的や信頼性の評価をめぐる広い転換を論じています。ここでは後者を「捉え方の転換」という問題提起として扱います。PureからAppliedへ科学全体が一斉に移行した、という意味にはしていません。</p><References ids={['kuhn','ashizawa']}/></div></details>
  <References ids={['method','social','stokes','cross']}/>
 </Section>
 <Reading ids={['method','induction','logicalEmpiricism','popper','kuhn','lakatos','multicriteria','demarcation','newDemarcation','progress','lucier','bush','gibbons','mode2Review','stokes','cross','ashizawa']}/>
 </>;}

function Contemporary(){return <>
 <Section title="研究の目的が変われば、確かめることも変わる">
  <p>現象を説明したいのか、結果を予測したいのか、使える方法を提案したいのか。同じ対象を研究していても、主張の中身によって必要な証拠が変わります。</p>
  <ResearchPurpose/>
  <Point>「データを取った」だけで終わらず、そのデータが、どの主張をどこまで支えるかを考えます。</Point>
  <References ids={['observation','models','cross']}/>
 </Section>
 <Section title="Research through Design：つくることを通して知る" id="science-rtd">
  <p><strong>Research through Design（リサーチ・スルー・デザイン、RtD）</strong>は、デザインをつくり、試し、その過程を振り返ることを通して知識を生む研究です。ここでいう「デザイン」には、道具や画面だけでなく、サービスや人の関わり方の設計も含まれます。</p>
  <p>まだ存在しない仕組みが、どんな体験や問題を生むのか。考えを試せる形にした<strong>試作品（プロトタイプ）</strong>をつくると、言葉だけでは気づかなかった使い方や価値の対立が見えてきます。そこから「何をよくしたいのか」という問いも捉え直していきます。</p>
  <References ids={['rtdOverview','zimmermanRtd']}/>
  <div className="science-example"><h3>例：自分に合う道を選べる案内をつくる</h3><p>最短経路を教える案内と、静かな道や階段の少ない道も選べる案内を試作するとします。「よい案内」とは、速く着けることなのか、納得して道を選べることなのか。つくったものを使うことで、こうした問いを具体的に考えられます。</p><p className="science-caption">RtDの考え方を示す教材用の架空例です。実際の研究結果ではありません。</p></div>
  <div className="science-three"><article><span>つくる</span><h3>考えを、触れられる形にする</h3><p>異なる案内を試作する。どんな道を選べるようにしたか、その理由も記録する。</p></article><article><span>試して、捉え直す</span><h3>使い方や会話から、問いを深める</h3><p>どう道を選んだか、何に迷ったかを観察する。速さだけでは捉えきれない「よさ」に気づいたら、問いや設計を見直す。</p></article><article><span>知識として伝える</span><h3>何が分かったかを、設計例と示す</h3><p>選択肢の見せ方、そこで生まれる迷い、使う状況との関係を整理する。試作品と記録を添え、他の人が検討できるようにする。</p></article></div>
  <p>この三つは行き来します。成果には、試作品だけでなく、問いの新しい捉え方、設計で考慮すべき点、今とは違う使い方の提案などがあります。つくったもの自体も、その知識を具体的に伝える役割を持ちます。</p>
  <Point>RtDでは、つくることが、考えを試し、問いを変え、知識を生む手段になります。</Point>
  <p>03で扱ったPure／Appliedは、主に研究の目的をめぐる区分です。RtDは、制作を通してどう知識を生むかという考え方で、使えるものをつくりながら、その背後にある問題への理解を深めることもできます。</p>
  <details className="science-aside"><summary>文献では、どう議論されてきた？</summary><div><p><strong>Frayling（1993/94）</strong>は、芸術・デザインの制作を通した研究を、研究と制作の関係の一つとして位置づけました。</p><p><strong>Zimmerman・Forlizzi・Evenson（2007）</strong>は、<strong>HCI（人とコンピュータの関わりを研究する分野）</strong>で、RtDによる知識の貢献を論じました。過程が追えるか、何が新しいか、なぜその状態を目指すのか、他の研究が成果を引き継げるか、という四つの観点を提案しています。</p><p><strong>Gaver（2012）</strong>は、RtDの知識には、後で改めうること、状況に依存すること、新しい可能性を提案することがあると論じます。普遍的な法則だけを成果とするのでなく、具体的な設計例に結びついた知識も重視する立場です。</p><References ids={['frayling','zimmermanRtd','gaverRtd']}/></div></details>
 </Section>
 <Section title="設計を研究するとき、「よい」の中身も問われる">
  <p>「新しい案内をつくって、迷う人が減った」。そこで次に考えるのは、なぜ減ったのか、どんな場所や人にも使えるのか、何を犠牲にしたのかです。</p>
  <p>例えば、案内を大きくして平均の到達時間が短くなっても、通路を圧迫したり、別の案内が読みにくくなったりするかもしれません。よさを一つの数字にまとめる前に、誰の、どの問題を改善するのかを明らかにする必要があります。</p>
  <p>RtDでも、作品を完成させただけで、研究上の主張が支えられるわけではありません。何を問い、制作や利用の記録から何を読み取り、どこまで言えるのかを示す必要があります。</p>
  <p>蘆澤（2026）は、設計手法などの研究では、何をもって信頼を高め、何をきっかけに改訂するかが見えにくくなると問題提起しています。これを「評価する基準と、見直す条件を考える」という問いとして扱います。</p>
  <References ids={['ashizawa','cross','objectivity','zimmermanRtd','gaverRtd']}/>
 </Section>
 <Section title="客観性：判断の根拠を、他者にひらく">
  <p><strong>客観性</strong>には複数の捉え方があります。ここでは、個人の好みや都合に左右されにくく、他の人も根拠を検討できることに注目します。</p>
  <p>「客観的」は、単に数字を使ったという意味ではありません。何を測るか、どの誤りを重くみるか、どんな研究を優先するかにも判断が入ります。</p>
  <p>例えば案内の評価なら、速さ、正確さ、安心感、利用できる人の範囲のどれを重くみるかで、選ぶ案が変わりえます。評価基準を示し、その選び方にも議論の余地を残すことが大切です。</p>
  <p>何を大切にし、何を優先するかを決めるのが<strong>価値判断</strong>です。それが科学にどこまで関わるべきかには、異なる立場があります。価値を含むことと、都合に合わせて証拠を曲げることは区別して考えます。</p>
  <References ids={['objectivity']}/>
 </Section>
 <Section title="再現性：他の人が確かめられる形にする">
  <p>ここでは、同じデータと手順から同じ計算結果を得られることを<strong>再現性</strong>、新しくデータを集めて以前の研究結果を確かめることを<strong>追試</strong>と呼び分けます。</p>
  <div className="science-two"><article><h3>同じ記録から、計算をたどれる？</h3><p>データ、処理方法、プログラムを使って、報告された結果までたどれるか。</p></article><article><h3>新しく調べても、結論は支えられる？</h3><p>別の参加者や場所で調べたとき、同じ傾向が得られるか。条件の違いで何が変わるか。</p></article></div>
  <p>再現性・追試などの用語は分野によって使い方が異なります。何を繰り返して確かめるのかを具体的に示す方が、誤解を減らせます。</p>
  <p>追試で異なる結果が出たときは、偶然、方法、対象、条件などを検討します。一度合わなかっただけで元の主張がすべて誤りと決まるわけでも、一度合えば確定するわけでもありません。</p>
  <References ids={['reproducibility']}/>
 </Section>
 <Section title="共同体：批判が届き、知識が変わる仕組みをつくる">
  <p>ある分野の知識や方法を共有し、研究を検討し合う人たちの集まりが<strong>研究共同体</strong>です。</p>
  <p>科学者一人が、すべての装置・計算・先行研究を自分だけで確かめることは困難です。研究は他者の専門知識や記録を頼りに進みます。そのため、誰をどの根拠で信頼するかも、科学の問題になります。</p>
  <p>査読は、他の専門家が研究を点検する仕組みです。ただし、それだけで結論が保証されるわけではありません。公開後の批判、追試、訂正も含めて知識を検討します。</p>
  <div className="science-example"><h3>批判を受け付けるだけでは、更新は起きない</h3><p>問題が指摘されたときに、データや説明を再検討し、必要なら結論を変える。SEPが紹介するLonginoの立場では、こうした批判への応答も、共同体の客観性を支える条件です。</p></div>
  <p>データや方法の公開は、そのための足場になります。参加者のプライバシーなどにも配慮しつつ、何を公開でき、何を他者が検討できるかを整えます。</p>
  <References ids={['social','reproducibility']}/>
 </Section>
 <Section title="科学の知識を読むときの、三つの問い">
  <ol className="science-takeaways"><li><strong>何を主張している？</strong><span>現象の説明、予測、方法の提案。その中身を具体的にする。</span></li><li><strong>どんな根拠がある？</strong><span>観察、比較、計算などが、その主張にどうつながるかを読む。</span></li><li><strong>どこまでいえて、何が残る？</strong><span>成り立つ条件と限界、次に確かめるべきことを読む。</span></li></ol>
  <p>Pure／Appliedの捉え直しから見えてきたのは、理解と利用が互いにつながる研究の姿です。そのつながりの中で、目的に合う根拠を示し、他の人が検討・更新できる知識にすることが求められます。</p>
  <p><PageLink href="/lab-learning/research/science/">研究ガイド：研究とは何かを理解する ↗</PageLink>では、ここで学んだ考え方を、研究室での研究の進め方につなげます。</p>
 </Section>
 <Reading ids={['observation','models','cross','frayling','rtdOverview','zimmermanRtd','gaverRtd','ashizawa','objectivity','social','reproducibility']}/>
 </>;}

const lessons=[Foundations,Knowledge,History,Contemporary];
export default function ScienceCourse({route}){
 const index=scienceChapters.findIndex(c=>`/science/${c.slug}`===route);
 if(index<0)return <><h1>ページが見つかりません</h1><PageLink href="#/science">科学入門へ</PageLink></>;
 const chapter=scienceChapters[index],Lesson=lessons[index];
 return <article className="science-course"><p className="eyebrow">{String(index+1).padStart(2,'0')} / 科学入門</p><h1>{chapter.title}</h1><Lesson/><nav className="science-pagination" aria-label="前後の章">{index>0&&<PageLink href={`#/science/${scienceChapters[index-1].slug}`}>← {scienceChapters[index-1].title}</PageLink>}{index<3&&<Next href={`/science/${scienceChapters[index+1].slug}`} label={scienceLinks[index+1][1]}/>}</nav></article>;
}
