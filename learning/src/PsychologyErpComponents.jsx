import PageLink from './PageLink.jsx';
import { psychologySources } from './psychologyContent.js';

const components = [
  ['C1', '視覚刺激の約50〜100 ms後', '視野の上・下などに模様を出して比べる。視覚のごく早い処理を調べる。', '刺激の位置などで陽性にも陰性にもなる。C1はP／Nで始まらない命名の例。'],
  ['P1', '視覚刺激の約80〜130 ms後', '左右に出る刺激について、注意を向ける場所を変えて比べる。早い視覚処理への影響を調べる。', '刺激の強さなどでも変わる。振幅だけを「注意力の点数」にしない。'],
  ['N1', '視覚刺激の約140〜200 ms後', '見る対象や注意の条件を変え、早い視覚処理に関係する陰性の成分を比べる。', 'ここでは視覚のN1。音に対するN1は約100 ms後など、同じ名前でも感覚・課題で異なる。'],
  ['N170', '視覚刺激の約140〜200 ms後', '顔と物体などを見せ、顔の処理に関係する反応を比べる。', 'その人の顔が好きか、誰の顔かが、この成分だけで分かるわけではない。'],
  ['ミスマッチ陰性電位（MMN）', '音の変化などから約100〜250 ms後', '繰り返す音の中に違う音を混ぜ、規則からの変化への反応を調べる。', '本人が意識して気づいたことの証明とは別。音自体の違いの影響も考える。'],
  ['P300（P3）', '刺激の約300〜600 ms後など', 'まれに出る標的に答える課題などで、課題上の意味や予想との関係を調べる。', 'P3a・P3bなどを区別する。必ず300 msに出るわけではなく、集中や理解の万能指標ではない。'],
  ['N400', '単語などの約300〜500 ms後', '文脈に合う言葉と合いにくい言葉などを比べ、意味の処理との関係を調べる。', '意味的に不自然な文だけに出るものではない。「理解していない」と単純に判定しない。'],
  ['エラー関連陰性電位（ERN）', '誤った回答の直後、約0〜100 ms', '素早く答える課題などで、誤答と正答を比べる。自分の反応を点検する過程を調べる。', '刺激が出た時点ではなく、回答した時点にそろえて読む。「反省の深さ」の点数ではない。'],
];

const componentGroups = [
  {title:'見るときの反応',items:components.slice(0,4)},
  {title:'変化や意味に関係する反応',items:components.slice(4,7)},
  {title:'回答した後の反応',items:components.slice(7)},
];

export default function PsychologyErpComponents() {
  return <div className="psych-erp-components">
    <h3>どの反応を調べるかで、見る成分が変わる</h3>
    <p>ERPには、<strong>C1・P1・N1</strong>など、さまざまな成分があります。「何を見せるか」「何をしてもらうか」によって、調べる成分も変わります。</p>
    <div className="psych-component-names">
      <h4>名前の読み方</h4>
      <p><strong>P／N</strong>：Pはpositive（陽性）、Nはnegative（陰性）。電位の向きを表します。</p>
      <p><strong>数字</strong>：P1・N1の「1」は順番、N170などの「170」は、おおよその出現時刻に由来します。</p>
    </div>
    {componentGroups.map(group=><section className="psych-component-group" key={group.title}>
      <h4>{group.title}</h4>
      <dl>{group.items.map(([name,time,task])=><div className="psych-component" key={name}>
        <dt><strong>{name}</strong><span>{time}</span></dt><dd>{task}</dd>
      </div>)}</dl>
    </section>)}
    <p className="small-note">時刻は目安です。全成分が一つの波形に順番に出るわけではありません。課題・記録位置・時間帯を合わせて読みます。</p>
    <div className="psych-language-example">
      <h4>例えば、N400で言葉の文脈を比べる</h4>
      <p>パンに塗ったのは <strong>バター</strong></p>
      <p>パンに塗ったのは <strong>靴下</strong></p>
      <p>最後の言葉が出た時点にそろえ、反応を比べます。実際には、単語の長さや出現頻度なども考えた多くの文を用意します。</p>
    </div>
    <details className="psych-component-notes"><summary>成分ごとの注意点・文献</summary>
      <p>P／Nは、よい・悪い、興奮・抑制という意味ではありません。図によって陽性が上向きの場合と下向きの場合があるので、縦軸を確認します。</p>
      <dl>{components.map(([name,,,limit])=><div key={name}><dt>{name}</dt><dd>{limit}</dd></div>)}</dl>
      <p className="psych-cite">成分と課題を確かめる文献：{['visualErp','visualAttention','erpCore','p300','n400','erpPolarity'].map((id,i)=><span key={id}>{i>0&&' ／ '}<PageLink href={psychologySources[id][1]} target="_blank" rel="noreferrer">{psychologySources[id][0]}</PageLink></span>)}</p>
    </details>
  </div>;
}
