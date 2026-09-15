export { psychologyLinks, resolvePsychologyRoute } from './navigation/psychology.js';
import { psychologyEffectSources } from './psychologyEffectSources.js';
import { psychologyAdditionalEffects } from './psychologyAdditionalEffects.js';




// Original studies, authors' reviews, and institutional teaching resources.
export const psychologySources = {
  ...psychologyEffectSources,
  overview: ['APA：心理学が用いる科学的な方法', 'https://www.apa.org/ed/precollege/topss/science/overview'],
  fields: ['OpenStax Psychology 2e：現代の心理学の分野', 'https://openstax.org/books/psychology-2e/pages/1-3-contemporary-psychology'],
  history: ['OpenStax Psychology 2e：心理学の歴史', 'https://openstax.org/books/psychology-2e/pages/1-2-history-of-psychology'],
  methods: ['OpenStax Psychology 2e：観察・事例・調査の方法', 'https://openstax.org/books/psychology-2e/pages/2-2-approaches-to-research'],
  design: ['OpenStax Psychology 2e：実験・相関・一般化', 'https://openstax.org/books/psychology-2e/pages/2-3-analyzing-findings'],
  ethics: ['OpenStax Psychology 2e：研究倫理', 'https://openstax.org/books/psychology-2e/pages/2-4-ethics'],
  fechner: ['Fechner（1860／英訳1912）Elements of Psychophysics：原著抜粋', 'https://psychclassics.yorku.ca/Fechner/'],
  ebbinghaus: ['Ebbinghaus（1885／英訳1913）Memory：時間と保持の関係', 'https://psychclassics.yorku.ca/Ebbinghaus/memory7.htm'],
  spearman: ['Spearman（1904）“General Intelligence,” Objectively Determined and Measured：原論文PDF', 'https://www.stats.org.uk/factor-analysis/Spearman1904.pdf'],
  classical: ['OpenStax Psychology 2e：古典的条件づけ', 'https://openstax.org/books/psychology-2e/pages/6-2-classical-conditioning'],
  operant: ['OpenStax Psychology 2e：オペラント条件づけ', 'https://openstax.org/books/psychology-2e/pages/6-3-operant-conditioning'],
  watson: ['Watson（1913）Psychology as the Behaviorist Views It：原論文', 'https://psychclassics.yorku.ca/Watson/views.htm'],
  gestalt: ['Wertheimer（1923／英訳1938）Laws of Organization in Perceptual Forms：原論文', 'https://www.yorku.ca/pclassic/Wertheimer/Forms/forms.htm'],
  miller: ['Miller（2003）The Cognitive Revolution: A Historical Perspective：当事者の回顧・抄録', 'https://pubmed.ncbi.nlm.nih.gov/12639696/'],
  chronoscope: ['University of Toronto：反応時間を測ったヒップのクロノスコープ', 'https://utsic.utoronto.ca/wpm_instrument/hipp-chronoscope/'],
  berger: ['Berger（1929）Über das Elektrenkephalogramm des Menschen：ヒトの脳波の原報', 'https://doi.org/10.1007/BF01797193'],
  dawson: ['Dawson（1954）A Summation Technique for the Detection of Small Evoked Potentials：加算する技術の原報', 'https://pubmed.ncbi.nlm.nih.gov/13141922/'],
  sutton: ['Suttonほか（1965）Evoked-potential Correlates of Stimulus Uncertainty：原論文・抄録', 'https://pubmed.ncbi.nlm.nih.gov/5852977/'],
  p300: ['Polich（2007）Updating P300：P3a・P3bを整理した総説', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2715154/'],
  erp: ['Luck・Kappenman：ERPのデータ処理を考える', 'https://erpinfo.org/order-of-steps'],
  visualErp: ['Di Russoほか（2002）：視覚誘発電位のC1・P1・N1の研究', 'https://pubmed.ncbi.nlm.nih.gov/11835601/'],
  visualAttention: ['Clark・Hillyard（1996）：注意を向ける場所とP1・N1の変化', 'https://pubmed.ncbi.nlm.nih.gov/23961943/'],
  erpCore: ['ERP CORE：成分に対応する課題・記録・解析例', 'https://erpinfo.org/erp-core'],
  erpPolarity: ['Luck：ERP成分の陽性・陰性は何を意味するか', 'https://erpinfo.org/blog/category/Interpretation'],
  n400: ['Kutas・Hillyard（1980）：文脈に合わない言葉と事象関連電位', 'https://pubmed.ncbi.nlm.nih.gov/7350657/'],
  mneEpochs: ['MNE-Python：刺激の時点に合わせて脳波を区切る', 'https://mne.tools/stable/auto_tutorials/epochs/10_epochs_overview.html'],
  mneSpectrum: ['MNE-Python：周波数ごとの強さを調べる', 'https://mne.tools/stable/auto_tutorials/time-freq/10_spectrum_class.html'],
  psychopyTiming: ['PsychoPy：表示・入力の時刻と精度を確かめる', 'https://psychopy.org/general/timing/millisecondPrecision.html'],
  scaleValidation: ['Boatengほか（2018）：心理尺度の作成と検証の手順', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6004510/'],
  yarbus: ['Yarbus（1967）Eye Movements During Perception of Complex Objects：原著の章', 'https://link.springer.com/chapter/10.1007/978-1-4899-5379-7_8'],
  eyeTracking: ['眼球運動研究の報告指針（2023年版）：装置・較正・注視の定義', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11225961/'],
  heart: ['心拍・心拍変動研究の公表指針（2024）：測定と解釈の基礎', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11539922/'],
  ppg: ['光電容積脈波法によるウェアラブル計測：仕組みと解析', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7612541/'],
  prv: ['Yudaほか（2020）：脈拍変動と心拍変動を区別する', 'https://pubmed.ncbi.nlm.nih.gov/32811571/'],
  fnirs: ['Yücelほか（2021）：fNIRSの測定・解析・報告の指針', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7793571/'],
  fnirsOriginal: ['Villringerほか（1993）：成人の脳活動に伴う変化を近赤外光で調べる', 'https://pubmed.ncbi.nlm.nih.gov/8361619/'],
  fnirsProcessing: ['MNE-Python：fNIRSの光の記録からヘモグロビンの変化へ', 'https://mne.tools/stable/auto_tutorials/preprocessing/70_fnirs_processing.html'],
  snirf: ['SNIRF仕様：光の時系列・波長・測定位置・イベントの保存', 'https://github.com/fNIRS/snirf/blob/master/snirf_specification.md'],
  bidsMri: ['BIDS仕様：MRI画像・撮影条件の保存形式', 'https://bids-specification.readthedocs.io/en/stable/modality-specific-files/magnetic-resonance-imaging-data.html'],
  phoneSensors: ['Android公式資料：加速度の値・単位・重力の扱い', 'https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion'],
  fnirsSignals: ['fNIRS学会：基準からの変化量と、装置の方式による違い', 'https://fnirs.org/courses/introduction-to-fnirs/lessons/interpreting-fnirs-signals/'],
  fnirsUnits: ['連続光NIRSの計測値：濃度変化と光路長・単位（2018）', 'https://www.jstage.jst.go.jp/article/isciesci/62/10/62_435/_pdf/-char/ja'],
  eda: ['Boucseinほか（2012）Publication Recommendations for Electrodermal Measurements', 'https://pubmed.ncbi.nlm.nih.gov/22680988/'],
  sensing: ['Harariほか（2016）スマートフォンによる行動データ収集：方法と課題', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5572675/'],
  demand: ['Orne（1962）要求特性と心理学実験：原論文', 'https://www.psych.upenn.edu/history/orne/orne1962amerpsychol776783.html'],
  apaEthics: ['APA倫理規程：3.04 危害の回避・8.02 同意と中止の自由・8.07 欺瞞・8.08 事後説明', 'https://www.apa.org/ethics/code'],
  debrief: ['Cornell University：欺瞞・不完全な開示を伴う研究の事後説明案内', 'https://researchservices.cornell.edu/sites/default/files/2019-05/IRB_debriefing_template_4-30-13.pdf'],
  milgram: ['Milgram（1963）Behavioral Study of Obedience：原論文', 'https://doi.org/10.1037/h0040525'],
  obedience: ['Haslamほか（2014）Meta-Milgram：条件による結果の違いの分析', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3976349/'],
  prison: ['Le Texier（2019）Debunking the Stanford Prison Experiment：記録を再検討した研究', 'https://pubmed.ncbi.nlm.nih.gov/31380664/'],
  fmri: ['Kwongほか（1992）Dynamic Magnetic Resonance Imaging of Human Brain Activity：原論文', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC49355/'],
  fmriGlm: ['FSL：fMRIの信号をモデルと比べ、統計画像を作る', 'https://fsl.fmrib.ox.ac.uk/fsl/docs/task_fmri/feat/overview_of_glm_analysis.html'],
  ema: ['Shiffmanほか（2008）Ecological Momentary Assessment：総説・抄録', 'https://pubmed.ncbi.nlm.nih.gov/18509902/'],
  timing: ['Bridgesほか（2020）The Timing Mega-study：実験環境の計時性能の比較', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7512138/'],
  weird: ['Henrichほか（2010）The Weirdest People in the World?：対象集団の偏りを論じた研究', 'https://doi.org/10.1017/S0140525X0999152X'],
  replication: ['Open Science Collaboration（2015）Estimating the Reproducibility of Psychological Science：原論文・抄録', 'https://pubmed.ncbi.nlm.nih.gov/26315443/'],
  prereg: ['Center for Open Science：事前登録', 'https://www.cos.io/initiatives/prereg'],
  registered: ['Center for Open Science：Registered Reports（結果が出る前の査読）', 'https://www.cos.io/initiatives/registered-reports'],
  stroop: ['Stroop（1935）Studies of Interference in Serial Verbal Reactions：原論文', 'https://www.yorku.ca/pclassic/Stroop/'],
  flanker: ['Eriksen & Eriksen（1974）Effects of Noise Letters upon the Identification of a Target Letter：原論文', 'https://doi.org/10.3758/BF03203267'],
  inattentional: ['Simons & Chabris（1999）Gorillas in Our Midst：原論文・抄録', 'https://doi.org/10.1068/p281059'],
  change: ['Rensinkほか（1997）To See or Not to See：原論文・抄録', 'https://doi.org/10.1111/j.1467-9280.1997.tb00427.x'],
  serial: ['Murdock（1962）The Serial Position Effect of Free Recall：原論文', 'https://doi.org/10.1037/h0045106'],
  spacing: ['Cepedaほか（2006）Distributed Practice in Verbal Recall Tasks：メタ分析・抄録', 'https://pubmed.ncbi.nlm.nih.gov/16719566/'],
  testing: ['Roediger & Karpicke（2006）Test-enhanced Learning：原論文・抄録', 'https://pubmed.ncbi.nlm.nih.gov/16507066/'],
  misinformation: ['Loftus & Palmer（1974）Reconstruction of Automobile Destruction：原論文・抄録', 'https://doi.org/10.1016/S0022-5371(74)80011-3'],
  exposure: ['Zajonc（1968）Attitudinal Effects of Mere Exposure：原論文', 'https://doi.org/10.1037/h0025848'],
  heuristics: ['Tversky & Kahneman（1974）Judgment under Uncertainty: Heuristics and Biases：原論文・抄録', 'https://pubmed.ncbi.nlm.nih.gov/17835457/'],
  framing: ['Tversky & Kahneman（1981）The Framing of Decisions and the Psychology of Choice：原論文・抄録', 'https://pubmed.ncbi.nlm.nih.gov/7455683/'],
  availability: ['Tversky & Kahneman（1973）Availability: A Heuristic for Judging Frequency and Probability：原論文・抄録', 'https://doi.org/10.1016/0010-0285(73)90033-9'],
  confirmation: ['Wason（1960）On the Failure to Eliminate Hypotheses in a Conceptual Task：原論文・抄録', 'https://doi.org/10.1080/17470216008416717'],
  loss: ['Tversky & Kahneman（1991）Loss Aversion in Riskless Choice：原論文PDF', 'https://www.sscnet.ucla.edu/polisci/faculty/chwe/austen/tversky1991.pdf'],
  sunk: ['Arkes & Blumer（1985）The Psychology of Sunk Cost：原論文・抄録', 'https://doi.org/10.1016/0749-5978(85)90049-4'],
  halo: ['Thorndike（1920）A Constant Error in Psychological Ratings：原論文', 'https://doi.org/10.1037/h0071663'],
  social: ['OpenStax Psychology 2e：同調・社会的促進・社会的手抜き', 'https://openstax.org/books/psychology-2e/pages/12-4-conformity-compliance-and-obedience'],
  asch: ['Asch（1956）Studies of Independence and Conformity：原論文', 'https://doi.org/10.1037/h0093718'],
  facilitation: ['Zajonc（1965）Social Facilitation：論文書誌', 'https://pubmed.ncbi.nlm.nih.gov/14300526/'],
  bystander: ['Fischerほか（2011）The Bystander-effect：メタ分析・抄録', 'https://pubmed.ncbi.nlm.nih.gov/21534650/'],
  loafing: ['Latanéほか（1979）Many Hands Make Light the Work：原論文', 'https://doi.org/10.1037/0022-3514.37.6.822'],
  depletion: ['Haggerほか（2016）A Multilab Preregistered Replication of the Ego-Depletion Effect：追試・抄録', 'https://pubmed.ncbi.nlm.nih.gov/27474142/'],
};

export const psychologyHistory = [
  {id:'psychophysics',date:'1860年',people:'フェヒナー',title:'感覚を、刺激との関係で測る',question:'光をどのくらい強くすると、明るくなったと気づくのか。',technology:'刺激の強さをそろえて変える器具と、繰り返し比較する手順。装置だけでなく、測る方法そのものを整えた。',method:'精神物理学：刺激の強さを少しずつ変え、違いに気づくかを繰り返し答えてもらう。',data:'刺激の強さと、気づいた割合。感覚を数で調べる道が開ける。',limit:'物理量が2倍でも、感じ方が2倍とは限らない。特定の感覚の測定を、心全体の測定とはしない。',refs:['fechner']},
  {id:'laboratory',date:'1879年',people:'ヴントとライプツィヒの研究室',title:'心の研究に、実験室をつくる',question:'感じる・注意を向けるといった経験を、条件をそろえて調べられるか。',technology:'クロノスコープなどの時間計測器と、刺激を出す装置。刺激から反応までの短い時間を測り、条件間で比較する。',method:'実験心理学：刺激の提示条件を管理し、反応時間や、訓練した参加者の経験の報告を記録する。',data:'一定の課題に対する反応と報告。1879年は心理学の実験室の重要な節目。',limit:'自由に感想を話すことと、統制された自己観察は違う。ただし、本人が報告できない処理もある。',refs:['overview','history','chronoscope']},
  {id:'memory',date:'1885年',people:'エビングハウス',title:'記憶を、繰り返し測れる課題にする',question:'時間がたつと、覚えたことはどのくらい失われるか。',method:'無意味綴りを覚え、時間を空けて学び直す。学習に必要な反復回数がどれだけ減ったかを調べる。',data:'再学習にかかる手間の減少（節約率）と、経過時間の関係。',limit:'主に自分自身と特定の材料を使った研究。「全員が1日で同じ割合だけ忘れる」という法則ではない。',refs:['ebbinghaus']},
  {id:'experience',date:'1890〜1900年代',people:'ジェームズ／フロイトなど',title:'心の働きや、個人の経験を捉える',question:'心は生活の中で何をしているか。本人が気づいていない過程をどう考えるか。',method:'機能主義は心の働きに注目。精神分析は個別の事例や語りから、経験・葛藤・無意識を解釈する。',data:'経験の記述や事例の経過。実験とは異なる問いの立て方が広がる。',limit:'二つは別の立場。事例から得た解釈と、比較実験で確かめた説明も区別する。歴史上の影響力は、全主張が実証されたことを意味しない。',refs:['history']},
  {id:'measurement',date:'1904年など',people:'スピアマンなど',title:'人による違いを、複数の課題から調べる',question:'ある課題が得意な人は、別の課題も得意なのか。',method:'心理測定：複数の課題の得点を集め、相関や、それらに共通する要因を調べる。',data:'人×課題の得点表。後の尺度づくりや因子分析へつながる。',limit:'共通の因子はデータを説明するモデル。得点だけで人の価値や生まれつきの能力を決めるものではなく、言語・教育・文化にも目を向ける。',refs:['spearman','weird']},
  {id:'behaviorism',date:'1910〜1930年代',people:'ワトソン／パヴロフ／スキナーなど',title:'観察できる行動から、学習を調べる',question:'経験や、その後に起きたことによって、行動はどう変わるか。',technology:'反応を記録する装置や、刺激・報酬を一定の条件で出す装置。人が見て数えるだけでなく、行動の回数や時間経過を記録する。',method:'行動主義と条件づけの研究：刺激の組み合わせや行動の結果を変え、反応の回数・速さなどを記録する。',data:'条件の違いと行動の変化。本人の説明に頼らず測れる。',limit:'刺激同士を結びつける古典的条件づけと、行動の結果を扱うオペラント条件づけは別。動物や単純な課題の結果を、人の複雑な行動へ直結させない。',refs:['watson','classical','operant']},
  {id:'gestalt',date:'1910〜1920年代',people:'ヴェルトハイマーなど',title:'部分の足し算ではない、まとまりを見る',question:'同じ点や線なのに、並べ方で見え方が変わるのはなぜか。',method:'ゲシュタルト心理学：点・線・図形の間隔や配置を変え、どうまとまって見えるかを比較する。',data:'配置と知覚のまとまりの対応。近接・類同などの要因。',limit:'ゲシュタルト心理学と、後の心理療法であるゲシュタルト療法は同じものではない。配置には複数の要因が同時に働く。',refs:['gestalt']},
  {id:'eeg',date:'1920年代／1929年公表',people:'ハンス・ベルガー',kind:'計測技術',title:'頭皮から、脳の電気的な変化を記録する',question:'本人が答える前から、脳に関係する信号を追えるか。',technology:'頭部の電極と微弱な電位を検出・記録する装置。ヒトの脳波（EEG）の記録が報告される。',method:'電極で電位差の時間変化を記録し、目を開ける・閉じるなどの条件で波形を比べる。',data:'電位が時間とともに変わる波形と、そのリズム。回答後の成績に加え、課題中の信号を調べられる。',limit:'脳波には複数の活動が混ざり、まばたきや筋肉の活動も入り込む。波形を見ただけで、考えている内容が読めるわけではない。',refs:['berger','erp']},
  {id:'social',date:'1930〜1960年代',people:'アッシュ／ミルグラム／ピアジェなど',title:'他者や発達を、比較の中に入れる',question:'同じ課題でも、周りの人や成長段階で答えが変わるのか。',method:'社会的状況を変える実験、行動観察、子どもへの課題・面接、年齢群や成長過程の比較が発展する。',data:'多数派への同調、権威者の指示への服従、年齢による課題成績など。ミルグラムの実験は03で結果と倫理上の問題を一緒に読む。',limit:'別の年齢の人を一度に比べる横断研究では、育った時代の違いも混ざる。古い有名実験の欺瞞や負担を、そのまままねてよいわけではない。',refs:['social','methods','ethics','milgram']},
  {id:'cognition',date:'1950〜1960年代',people:'ミラー／ブロードベント／ナイサーなど',title:'見えない処理を、反応の違いから考える',question:'見た情報は、どう選ばれ、覚えられ、判断に使われるのか。',technology:'コンピューターによる刺激提示・回答記録が発展。提示順や短い時間間隔を制御し、多くの試行を同じ手順で比べやすくなる。',method:'認知心理学：反応時間・正答率・思い出せた量を測り、注意や記憶の仕組みを表すモデルと比較する。コンピューターや情報理論とも結びつく。',data:'条件ごとの時間と誤り。心の中を直接見なくても、処理の仮説を比べられる。',limit:'反応が遅いというだけで、どの処理が原因かは決まらない。別の説明と区別できる課題が必要。',refs:['miller','stroop']},
  {id:'averaging',date:'1950〜1960年代',people:'ドーソンら／加算装置と計算機',kind:'計測技術',title:'繰り返した反応から、小さな波形を取り出す',question:'複雑な脳波から、音を聞いた直後の反応を取り出せるか。',technology:'刺激の提示時点を記録し、同じ時点でそろえた波形を加算する技術。1954年のDawsonの報告などを経て、計算機による処理へ広がる。',method:'同じ条件を何度も繰り返し、刺激時点を0 msにそろえて平均する「加算平均」。',data:'刺激に対応した小さな電位変化を、背景の揺れから見分けやすくなる。事象関連電位（ERP）の研究を支える。',limit:'刺激と一緒に毎回起こるまばたきなどは、平均しても残る。記録の確認や除外・補正も必要。',refs:['dawson','erp']},
  {id:'humanistic',date:'1950〜1960年代',people:'ロジャーズ／マズローなど',title:'本人にとっての意味や成長も問う',question:'人は自分の経験をどう受け止め、どのように変わっていくのか。',method:'人間性心理学：本人の経験や主体性に注目し、面接、事例、自己についての報告などを扱う。',data:'語り、自己理解、変化の経過。認知・行動の研究と並行した流れ。',limit:'有名な理論図だけで、すべての人に共通する順序が証明されたと考えない。実践の考え方と、検証された主張を分ける。',refs:['history']},
  {id:'erp-components',date:'1960〜1980年代など',people:'サットンら／クータス・ヒリヤードら',kind:'計測から広がった問い',title:'刺激の受け取り方や意味を、反応の違いから調べる',question:'見たり聞いたりした後、予想や文脈によって脳の反応はどう変わるか。',technology:'脳波の記録、出来事の時刻の管理、計算機による加算平均と条件間の比較。',method:'刺激や課題の条件を変え、波形の時間帯・記録位置・大きさを比べる。感覚の早い反応から、判断や意味の処理へと問いが広がる。',data:'C1・P1・N1などの早い視覚反応、予想や課題との関係を調べるP300（1965年の報告など）、意味との関係を調べるN400（1980年の報告）など。',limit:'成分ごとに課題や記録条件が違う。全成分が一つの波形に必ず出るわけではなく、名前だけで心理状態は決まらない。03で課題と成分の例を並べて読む。',refs:['visualErp','sutton','n400','erpCore']},
  {id:'gaze',date:'1960年代以降',people:'ヤルブスら／眼球運動の研究',kind:'計測技術',title:'何を見たかを、視線の動きとして残す',question:'同じ絵でも、聞かれたことが違うと見る場所は変わるか。',technology:'眼球運動を記録する装置。その後、カメラや赤外線を用いる方式が発展し、画面上の視線位置を記録しやすくなる。',method:'同じ絵を見るときの課題を変え、視線の軌跡や一か所を見る時間を比べる。',data:'どこへ、どの順番で、どれだけ視線を向けたか。読み方や情報探索の過程を調べられる。',limit:'眼球運動の測定は1960年代に始まったわけではない。ヤルブスの研究は節目の一つ。視線が向いたことと、理解や好意は同じではない。',refs:['yarbus','eyeTracking']},
  {id:'brain',date:'1990年代以降',people:'認知神経科学の広がり',title:'課題の成績と、脳の指標を結びつける',question:'課題を解いているとき、脳では何が変わっているか。',technology:'MRI装置と撮像・画像解析技術。場所ごとの信号変化を、課題を行う時点と対応づける。',method:'以前からの脳波（EEG）などに加え、機能的磁気共鳴画像法（fMRI）が広がる。行動指標と生理指標を組み合わせる。',data:'反応時間・正答率と、脳活動に関係する信号の変化。',limit:'fMRIは血流・血液の酸素化に関係する間接的な信号。ある部位が活動しただけで、特定の感情や本音だとは言えない。',refs:['fmri']},
  {id:'fnirs',date:'1990年代以降／1993年の報告など',people:'ヴィルリンガーら／光による脳機能計測',kind:'計測技術',title:'近赤外光で、脳の血液側の変化を追う',question:'頭に当てた光から、課題中の変化を捉えられるか。',technology:'光を出す部分と受ける部分を頭に置き、複数の波長で吸収の変化を測る。機能的近赤外分光法（fNIRS）が発展する。',method:'課題と休息などを比べ、酸素化・脱酸素化ヘモグロビンの変化を推定する。',data:'主に脳の表面に近い測定部位の時間変化。装置によっては、座った姿勢など日常に近い場面へ測定を広げやすい。',limit:'皮膚の血流や体動も混ざり、脳の深部を一様に見られるわけではない。神経の電気活動や考えの内容を直接測る方法ではない。',refs:['fnirsOriginal','fnirs']},
  {id:'everyday',date:'2000年代以降',people:'オンライン研究・日常場面での研究',title:'実験室の外でも、その時の記録を取る',question:'実験室で分かったことは、日常生活でも起きているか。',technology:'ネット接続、スマートフォンの通知・加速度・位置センサーなど。『後から思い出す報告』に、その時の報告や継続的な記録を加えられる。',method:'オンライン実験、経験サンプリング法、EMA（生態学的瞬間評価法）などで、遠隔の課題成績や日々の短い報告を集める。',data:'多様な場所からの回答や、同じ人の時間的な変化。方法自体には、それ以前からの蓄積もある。',limit:'募集の偏り、欠測、端末の精度差がある。位置などの記録では、同意とプライバシーの保護も必要。大量の記録があっても、無作為抽出や因果関係が自動的に得られるわけではない。',refs:['ema','timing','sensing']},
  {id:'open',date:'2010年代以降',people:'多研究室の共同研究・オープンサイエンス',title:'誰に、どこで、繰り返しても言えるかを確かめる',question:'同じ手順で取り直しても傾向は出るか。特定の文化や学生だけに限られないか。',technology:'研究計画を日時つきで登録し、データ・コードを共有する基盤。新しいセンサーとは別に、測定と解析を他者が確かめる仕組みが整う。',method:'事前登録、追試、多施設研究、データ・手順の共有が広がる。Registered Reportsでは、結果を見る前に研究計画を査読する。',data:'一つの有名な結果に加えて、研究間の違い、対象や条件を変えた結果。',limit:'追試で違う結果が出たら、元の誤り・偶然・条件差などを調べる。「心理学は全部誤り」「事前登録すれば必ず正しい」のどちらにも飛ばない。',refs:['replication','weird','prereg','registered']},
];

export const psychologyEffectGroups = ['知覚・注意','記憶・学習','判断・意思決定','対人・集団','動機づけ・情動','発達','研究・測定'];
export const psychologyEffectPriorities = [
  {id:'core', label:'まず押さえる', description:'心理学の基礎や、研究の読み方につながる項目。'},
  {id:'field', label:'分野ごとに押さえる', description:'関心のある分野を学ぶときに押さえたい項目。'},
  {id:'advanced', label:'発展', description:'個別の課題や、研究上の議論まで広げて学ぶ項目。'},
];
// The examples are explanations or typical task designs, not newly collected observations.
const originalEffects = [
 {id:'stroop',group:'知覚・注意',name:'ストループ効果',english:'Stroop effect',what:'文字の意味とインクの色が食い違うと、色を答えるのが遅くなったり、間違いやすくなったりする。',compare:'意味と色が一致する条件／不一致の条件で、色への反応時間と誤答率を比べる。',limit:'読める言語、練習、答え方などで変わる。「集中力の低い人」を判定する単独のテストではない。',refs:['stroop']},
 {id:'flanker',group:'知覚・注意',name:'フランカー効果',english:'Flanker effect',what:'答える必要のない周囲の刺激も、中央の刺激への反応を邪魔したり助けたりする。',compare:'中央の文字に反応する課題で、周囲が同じ反応を要求する文字／別の反応を要求する文字のときの時間と誤りを比べる。',limit:'刺激の距離、対応づけ、注意の向け方によって変わる。ストループ効果とは、妨害の作り方が違う。',refs:['flanker']},
 {id:'inattentional',group:'知覚・注意',name:'非注意性盲目',english:'Inattentional blindness',what:'別のことに注意を向けていると、視野に入った予想外の出来事に気づかない場合がある。',compare:'映像内の出来事を数えるなどの課題を行い、予想外の対象に気づいたかを調べる。',limit:'事前に何が出るかを知ると条件が変わる。「見えていれば必ず気づく」への反例であり、誰も見えていないという意味ではない。',refs:['inattentional']},
 {id:'change',group:'知覚・注意',name:'変化盲',english:'Change blindness',what:'途中に空白などが入ると、二つの場面の大きな違いにも気づきにくいことがある。',compare:'変更前後の画像を、空白を挟んで交互に見せ、変更箇所を見つけるまでの時間を測る。',limit:'非注意性盲目は予想外の対象への気づき、変化盲は前後の違いへの気づき。対象や課題を混同しない。',refs:['change']},
 {id:'serial',group:'記憶・学習',name:'系列位置効果（初頭効果・新近効果）',english:'Serial-position effect',what:'単語列を思い出す課題では、最初や最後の項目が、中ほどより思い出されやすい。',compare:'単語を順に提示し、自由に再生させる。何番目の単語が再生されたかを集計する。',limit:'再生までの遅延や妨害課題で形が変わる。人物の第一印象を扱う「初頭効果」とは、課題の違いを確認する。',refs:['serial']},
 {id:'spacing',group:'記憶・学習',name:'分散学習効果',english:'Spacing effect',what:'学習を一度に詰め込むより、間隔を空けて繰り返すほうが、後まで覚えている場合が多い。',compare:'同じ学習量で、続けて練習する条件／間を空ける条件を作り、後日の成績を比べる。',limit:'よい間隔は、何を、いつまで覚えたいかで変わる。「何日おきが常に最適」とは決まらない。',refs:['spacing']},
 {id:'testing',group:'記憶・学習',name:'テスト効果（検索練習効果）',english:'Testing effect / Retrieval practice',what:'読むだけでなく、答えを見ずに思い出す練習が、その後の記憶を助ける。',compare:'文章の再読と、自由再生による練習を比べ、直後と数日後の再生成績を見る。',limit:'直後と後日では有利な条件が違うことがある。間違いへのフィードバックや、そもそも学べているかも考える。',refs:['testing']},
 {id:'misinformation',group:'記憶・学習',name:'事後情報効果',english:'Misinformation effect',what:'出来事の後に聞いた情報や質問の言葉が、後の報告や記憶に影響することがある。',compare:'同じ事故映像を見た後、質問に使う動詞を変え、速度の推定や後日の報告を比べる。',limit:'一つの回答差から、記憶そのものがどのように変わったかまで断定しない。聞き取りでは誘導する質問を避ける。',refs:['misinformation']},
 {id:'exposure',group:'記憶・学習',name:'単純接触効果',english:'Mere-exposure effect',what:'初めはなじみのない刺激に繰り返し接すると、好意的な評価が高くなる場合がある。',compare:'文字や図形などの提示回数を変え、後で好ましさを評定してもらう。',limit:'不快な刺激を何度も見せれば好きになる、とは言えない。頻度、刺激、飽きなどの条件を確かめる。',refs:['exposure']},
 {id:'anchoring',group:'判断・意思決定',name:'アンカリング効果',english:'Anchoring effect',what:'先に示された数が、その後の数値の見積もりの手がかりとなり、判断がそちらへ寄ることがある。',compare:'高い数／低い数を示す条件を作り、同じ数量を推定してもらう。',limit:'提示した数が知識として役立つ場合と、無関係な数に引かれる場合を分ける。人を自在に誘導できる法則ではない。',refs:['heuristics']},
 {id:'framing',group:'判断・意思決定',name:'フレーミング効果',english:'Framing effect',what:'同じ結果でも、得る側面を示すか、失う側面を示すかなどで、選ばれ方が変わることがある。',compare:'結果と確率を同じに保ち、利得／損失の表現を変え、選択の割合を比べる。',limit:'本当に同じ情報かを先に確認する。説明の明確さや、問題の種類によっても結果が変わる。',refs:['framing']},
 {id:'availability',group:'判断・意思決定',name:'利用可能性ヒューリスティック',english:'Availability heuristic',what:'例を思い出しやすいほど、頻繁に起きる・起きやすいと判断することがある。',compare:'思い出しやすさが違う事例群について、頻度や確率の見積もりを比べる。',limit:'ヒューリスティックは判断の近道。多くの場合は役立つが、目立つ出来事や報道量が実際の頻度と一致するとは限らない。',refs:['availability']},
 {id:'confirmation',group:'判断・意思決定',name:'確証バイアス',english:'Confirmation bias',what:'自分の考えに合う情報を集めたり、そのように解釈したりして、反する情報を十分に確かめない傾向。',compare:'代表的な課題では数列の規則を推測し、どんな例を試して仮説を確かめるかを記録する。',limit:'日常の情報解釈まで一つの数列課題で説明しきれるわけではない。考えに合う例を探すことが、いつも不合理とも限らない。',refs:['confirmation']},
 {id:'loss',group:'判断・意思決定',name:'損失回避',english:'Loss aversion',what:'基準にしている状態からの損失を、同程度の利得より重く扱うことがある。',compare:'どこを基準とするかを明確にして、得るものと失うものを含む選択を比較する。',limit:'「損は必ず得の2倍つらい」という固定比ではない。金額、課題、経験、基準点で変わる。',refs:['loss']},
 {id:'sunk',group:'判断・意思決定',name:'サンクコスト効果（埋没費用効果）',english:'Sunk-cost effect',what:'既に費やして取り戻せない時間やお金が、その後も続ける判断を押すことがある。',compare:'これからの費用と利益は同じにして、過去の投資額が違う場面の継続判断を比べる。',limit:'継続すること自体が常に誤りではない。今後の利益や切替費用も違っていないかを調べる。',refs:['sunk']},
 {id:'halo',group:'対人・集団',name:'ハロー効果',english:'Halo effect',what:'相手の全体的な印象が、個別の特徴の評価にも影響することがある。',compare:'同じ人について複数の特徴を評定し、全体の印象と個別の評定の関係を調べる。',limit:'特徴同士が実際に関連している場合もある。評定の相関だけで、すべてを評価者の偏りとは決めない。',refs:['halo']},
 {id:'conformity',group:'対人・集団',name:'同調',english:'Conformity',what:'周りの人の判断に合わせて、自分の回答を変えることがある。',compare:'代表的な研究は線の長さの判断。同じ判断を一人で行う場合と、多数派の回答を聞く場合を比べる。',limit:'同調しない人・試行もある。全員一致か、味方がいるか、回答が公開されるかでも変わる。',refs:['asch','social']},
 {id:'facilitation',group:'対人・集団',name:'社会的促進・社会的抑制',english:'Social facilitation / Social inhibition',what:'他者の存在が、慣れた課題の成績を上げる一方で、難しい課題の成績を下げることがある。',compare:'一人／他者がいる条件と、慣れた／不慣れな課題を組み合わせて、速さや誤りを比べる。',limit:'他者がいると必ず頑張れる、とは言えない。評価される不安、注意の分散など、説明も一つではない。',refs:['facilitation','social']},
 {id:'bystander',group:'対人・集団',name:'傍観者効果',english:'Bystander effect',what:'周りに他の人がいると、一人ひとりが援助する確率が下がる場合がある。',compare:'他者がいる／いない状況で、援助の有無や開始までの時間を比べる。',limit:'危険が明確な場面や、他者が支えとなる場面では弱まる・異なる結果もある。集団全体の「誰かが助ける確率」と、個人の援助確率は別。',refs:['bystander']},
 {id:'loafing',group:'対人・集団',name:'社会的手抜き',english:'Social loafing',what:'集団で成果を出すとき、一人当たりの努力が、単独のときより小さくなることがある。',compare:'単独／集団で拍手や声を出す課題などを使い、個人の努力や出力を比較する。',limit:'協調の難しさによる損失とは区別する。貢献が分かるか、課題に意味を感じるかなどで変わる。',refs:['loafing','social']},
];

const coreEffectIds = new Set(['stroop','inattentional','serial','spacing','testing','misinformation','anchoring','framing','availability','confirmation','conformity']);
export const psychologyEffects = [
  ...originalEffects.map(effect => ({...effect, priority:coreEffectIds.has(effect.id)?'core':'field'})),
  ...psychologyAdditionalEffects,
].sort((a,b) => psychologyEffectGroups.indexOf(a.group)-psychologyEffectGroups.indexOf(b.group)
  || psychologyEffectPriorities.findIndex(p=>p.id===a.priority)-psychologyEffectPriorities.findIndex(p=>p.id===b.priority));

export function filterPsychologyEffects(query='',group='すべて',priority='すべて') {
  const words=query.normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return psychologyEffects.filter(effect => (group==='すべて'||effect.group===group)
    && (priority==='すべて'||effect.priority===priority)
    && words.every(word => [effect.name,effect.english,effect.what,effect.compare,effect.limit].join(' ').normalize('NFKC').toLocaleLowerCase().includes(word)));
}
