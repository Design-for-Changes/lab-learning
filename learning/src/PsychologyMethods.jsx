import PageLink from './PageLink.jsx';
import { Section } from './Common.jsx';
import { psychologySources } from './psychologyContent.js';
import { psychologyMeasurements } from './psychologyMeasurements.js';
import PsychologyErpComponents from './PsychologyErpComponents.jsx';
import { psychologyMeasurementRecords } from './psychologyMeasurementRecords.js';
import PsychologyFnirsExample from './PsychologyFnirsExample.jsx';
import { psychologyRawRecords } from './psychologyRawRecords.js';

function References({ids}) { return <p className="psych-cite">確認する文献：{ids.map((id,i)=><span key={id}>{i>0&&' ／ '}<PageLink href={psychologySources[id][1]} target="_blank" rel="noreferrer">{psychologySources[id][0]}</PageLink></span>)}</p>; }

function DataTable({name,columns,rows,caption}) {
  return <div className="psych-sample-scroll" role="region" aria-label={name} tabIndex={0}>
    <table className="psych-sample-table"><caption>{caption}</caption><thead><tr>{columns.map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((value,j)=>j===0?<th scope="row" key={j}>{value}</th>:<td key={j}>{value}</td>)}</tr>)}</tbody></table>
  </div>;
}

function MeasurementData({item}) {
  const record=psychologyMeasurementRecords[item.id];
  const raw=psychologyRawRecords[item.id];
  return <div className="psych-measure-data">
    <h3>1. 保存される生データ</h3>
    <p>{raw.description}</p>
    {raw.files.map(file=><figure key={file.name} className="psych-raw-file"><figcaption>{file.name}</figcaption><pre tabIndex={0} aria-label={file.name}><code>{file.data}</code></pre></figure>)}
    <p>{raw.fields}</p>
    <h3>2. 必要な処理</h3>
    <ol className="psych-processing">{raw.processing.map(step=><li key={step}>{step}</li>)}</ol>
    {raw.refs&&<References ids={raw.refs}/>}
    <h3>3. 処理後に得られる結果</h3>
    <p>{item.output}</p>
    {raw.outputNote&&<p className="small-note">{raw.outputNote}</p>}
    <p className="psych-data-basis"><strong>数値の基準を読む</strong>{record.basis}</p>
    {['fnirs','erp'].includes(item.id)&&<p>{record.context}</p>}
    {item.id==='fnirs'&&<PsychologyFnirsExample/>}
    {['fnirs','erp'].includes(item.id)&&<DataTable name={`${item.name}の処理後の例`} columns={record.columns} rows={record.rows} caption="変換・基準補正後の架空の例（生データではありません）"/>}
    <h4>{record.resultTitle}</h4>
    <DataTable name={`${item.name}の計算例`} columns={item.columns} rows={item.rows} caption="処理・集計の結果を読むための架空の例"/>
    <p>{item.reading}</p>
    {item.id==='fnirs'&&<>
      <p><strong>μMと書かれていても、ここでは絶対濃度ではなく、その変化量です。</strong>光路長を仮定して濃度変化に換算する装置も、光路長を含んだ「濃度変化×距離」をmM・mmなどで出力する装置もあります。後者は距離を含むので、単なる濃度の単位には置き換えられません。</p>
      <p>例えば、別の人の＋0.3と比べて「この人は2倍考えた」とは言えません。頭部の組織や光の通り方、装着状態も違うためです。まず各参加者の中で、測定位置・基準区間・集計する時間帯をそろえて条件差を求め、参加者間のばらつきを検討します。</p>
      <p className="small-note">ここでは一般的なCW方式を説明しています。時間領域方式（TD）・周波数領域方式（FD）など、絶対濃度の推定が可能な方式もあります。使う装置の方式と出力の定義を確認してください。</p>
      <References ids={['fnirsSignals','fnirsUnits','fnirsProcessing']}/>
    </>}
  </div>;
}

function MeasurementProcedure({item}) {
  return <details className="psych-measure-detail"><summary>測定前の準備・注意点・文献</summary><div className="psych-measure-body">
      <h3>用意するもの・残す記録</h3><p>{item.device}</p>
      <h3>記録する手順</h3><ol className="psych-steps">{item.steps.map(step=><li key={step}>{step}</li>)}</ol>
      <h3>ここは確認する</h3><p>{item.limit}</p><References ids={item.refs}/>
  </div></details>;
}

export function PsychologyMeasurements() { return <div className="psych-measurements">
  <Section id="psych-measure-heading" title="何を測りたいかで、計測方法を選ぶ">
    <p>ストループ課題なら、反応時間を測るほか、脳波を同時に記録する方法もあります。各方法を開くと、<strong>生データ → 必要な処理 → 結果</strong>を確認できます。ファイル名・数値は説明用の架空例です。</p>
    <p className="small-note">ここでの生データは、研究者が補正・除外・平均する前に保存した記録です。機器の中で単位への換算や画像の再構成が行われている場合もあります。元ファイルは残し、加工したデータを別に保存します。</p>
    <div className="psych-measure-list">{psychologyMeasurements.map(item=><details key={item.id} id={`psych-measure-${item.id}`} className="psych-measure-toggle">
    <summary>{item.name}</summary>
    <div className="psych-measure-content">
    <p className="psych-measure-question">{item.question}</p>
    <p>{item.mechanism}</p>
    <MeasurementData item={item}/>
    {item.id==='erp'&&<PsychologyErpComponents/>}
    <MeasurementProcedure item={item}/>
    </div>
  </details>)}</div>
  </Section>
</div>; }

const concealment = [
  ['フィラー刺激・フィラー項目','主に調べたいもの以外の刺激や質問を混ぜる。例：注目する種類の単語以外も提示する。','課題の構成を整えたり、狙いが特定の項目だと気づかれにくくしたりする。追加するだけで必ず欺瞞になるわけではない。'],
  ['妨害刺激（ディストラクター）','反応する必要のない情報を提示する。例：フランカー課題で中央の文字の周囲に別の文字を置く。','注意の妨害そのものを調べるための条件。目的を隠すフィラーとは役割が違う。'],
  ['統制条件・プラセボ条件','比較の基準を置く。プラセボ条件では、調べたい操作を含まないが見た目や手続きを似せた条件などを使う。','操作そのものと、期待や手続きによる影響を区別したい。統制条件なら何でもプラセボというわけではない。'],
  ['盲検化（マスキング）','どの条件かを、参加者・測定者・判定者のうち必要な人に知らせない。','期待が回答や判定に入るのを減らす。「誰に何を知らせないか」を明記する。虚偽の説明をすることとは別。'],
  ['実験協力者（サクラ）','普通の参加者のように見えて、研究者と決めた行動をする人を入れる。','他者の発言や行動をそろえる。本当の役割を隠して参加者を誤認させる場合は、欺瞞として検討する。'],
  ['目的の一部を伏せる・カバーストーリー','仮説などの情報を一部開示しない、または実際とは異なる目的・状況を説明する。','不完全な開示と、虚偽の説明を区別する。何を伏せるか、参加の判断にどう影響するかを審査で検討する。'],
];

export function PsychologyDeception() { return <Section id="psych-dummy-heading" title="ダミーと実験協力者">
  <p><strong>ダミー</strong>は、本題とは別に混ぜる質問や、本物に見せた条件などの呼び方です。実験の狙いを気づかれにくくしたり、比較する状況をそろえたりするために用意します。</p>
  <h3>アッシュの同調研究：周りの答えにつられるか</h3>
  <ol className="psych-steps">
    <li>参加者と数人の協力者が、順番に<strong>線の長さ</strong>を答える。</li>
    <li>協力者は普通の参加者のふりをして、指定された試行で<strong>同じ誤答</strong>をする。</li>
    <li>参加者が自分の判断を答えるか、周りの誤答に合わせるかを記録する。</li>
  </ol>
  <p>この協力者が、いわゆる「サクラ」です。教材では<strong>実験協力者</strong>と呼びます。協力者を使うと、周りの人の答え方を研究者がそろえられます。アッシュの研究では、多数派に合わせる試行も、合わせない試行も見られました。</p>
  <p>最初から「周りに合わせるかを調べます」と伝えれば、意識して合わせない人もいるかもしれません。このように、参加者が実験の狙いを推測する手がかりを<strong>要求特性</strong>と呼びます。協力者の役割を隠すことにも、倫理的な検討が必要です。</p>
  <details><summary>関連する手続きと正式名称</summary><div className="psych-detail-body">
    <p>ダミーは一つの決まった手法名ではありません。例えば、調べたい質問に別の質問を混ぜる場合、その追加の質問は<strong>フィラー項目</strong>です。何を、何のために加えるかで名前を使い分けます。</p>
    <div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">手続き</th><th scope="col">何をする？</th><th scope="col">目的・区別する点</th></tr></thead><tbody>{concealment.map(([name,action,reason])=><tr key={name}><th scope="row">{name}</th><td>{action}</td><td>{reason}</td></tr>)}</tbody></table></div>
    <p>追加した質問が回答に影響することもあります。狙いを隠せたか、余計な影響が生まれていないかを予備調査で確かめます。</p>
    <References ids={['demand','asch','social','apaEthics']}/>
  </div></details>
</Section>; }

export function PsychologyExperimentCautions() { return <Section id="psych-experiment-cautions" title="実験の注意点">
  <p><strong>以下は、現代の研究で「絶対にしてはいけないこと」を学ぶための例です。当時の手順をそのまま再現してはいけません。</strong></p>
  <article className="psych-study-note">
    <h3>ミルグラムの服従実験：だまして強い苦痛を与えない</h3>
    <p>参加者は「相手に電気ショックを与えている」と信じる状況に置かれました。実際に電流が流れていなくても、相手を傷つけたと思う苦痛は生じます。</p>
    <p><strong>してはいけないこと：</strong>身体的な痛みや強い精神的苦痛が予想される実験に、だまして参加させること。参加者の「やめたい」という意思を押さえて続けさせること。</p>
    <details><summary>手順・結果と問題点を読む</summary><div className="psych-detail-body">
      <p>1963年の報告では、参加者は記憶の実験と説明され、「学習者」の誤答に対して電気ショックを与える役を担当しました。学習者は実験協力者で、ショックは実際には流れていませんでした。</p>
      <p>成人男性40人中26人が、装置の最大値450 Vの段階まで操作を続けました。26÷40＝65%です。これはその対象・条件での値で、条件を変えた研究では結果も異なります。</p>
      <p>研究成果が得られても、だまして強い苦痛を与えたり、中止する自由を奪ったりしてよい理由にはなりません。参加者が状況をどう理解したかは、結果の解釈にも関わります。</p><References ids={['milgram','obedience','apaEthics']}/>
    </div></details>
  </article>
  <article className="psych-study-note">
    <h3>スタンフォード監獄実験：苦痛や屈辱を放置しない</h3>
    <p>模擬監獄で看守役・囚人役の行動を観察しました。参加者への屈辱的な扱いや心理的負担、途中でやめる自由の扱いが問題になりました。</p>
    <p><strong>してはいけないこと：</strong>「実験だから」と屈辱的な扱いや強い苦痛を与えたり、放置したりすること。参加者がやめられない状況を作ること。危険や深刻な苦痛が生じたら、研究より参加者の保護を優先して中止します。</p>
    <details><summary>手順と、その後の再検討を読む</summary><div className="psych-detail-body">
      <p>1971年に、参加者へ看守役・囚人役を割り当てて行われました。「役割が人を変える例」として知られていますが、役割そのものと研究者の指示の影響を分けて考える必要があります。</p>
      <p>Le Texierによる2019年の記録・証言の再検討は、看守への指示などを指摘しています。「役を与えるだけで誰でも残酷になる」と確定した法則としては扱えません。</p><References ids={['prison']}/>
    </div></details>
  </article>
  <h3>実施前に決めること</h3>
  <p>本当とは違うことを信じさせる手続きを<strong>欺瞞（ぎまん）</strong>といいます。目的を伏せる場合も、参加するかどうかの判断に関わるため、説明と同意の方法を検討します。</p>
  <ol className="psych-steps">
    <li><strong>代わりの方法を考える。</strong>説明をそろえる、判定者に条件を知らせないなど、騙さずに調べられないか。</li>
    <li><strong>実施前に倫理審査で確認する。</strong>指導教員に相談し、必要な理由、伏せる情報、負担、対処方法を計画に書く。重大な危険を隠して参加させない。</li>
    <li><strong>参加しない・途中でやめる自由を守る。</strong>成績や立場に不利益を与えず、中止する条件と対応を決める。</li>
    <li><strong>終了後に説明する。</strong>本当の目的と手続きを伝え、誤解や不安に対応する。これが<strong>デブリーフィング（事後説明）</strong>。審査で認められた時期・方法で行い、データ利用を撤回する機会も設ける。</li>
  </ol>
  <p><strong>「本人が同意した」「後で種明かしする」ことは、上の禁止行為を許す理由になりません。</strong>倫理審査も、禁止行為を許してもらうための手続きではありません。</p>
  <References ids={['apaEthics','debrief']}/>
</Section>; }
