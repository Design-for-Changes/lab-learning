import { useState } from 'react';
import { normalPDF } from './math.js';
import { pairedTExample as result, studentT11PDF } from './pairedTExample.js';

const points = (low, high, count, position) => Array.from({ length: count + 1 }, (_, i) => position(low + (high - low) * i / count));
const linePath = coordinates => coordinates.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');

export function EqualVarianceExplorer() {
  const [wide, setWide] = useState(false);
  const groups = [{ name: 'A', mean: 40, sd: 5, base: 125, color: '#cc2939' }, { name: 'B', mean: 35, sd: wide ? 10 : 5, base: 270, color: '#2257c6' }];
  const sx = value => 60 + value / 70 * 520;
  return <div className="explorer">
    <div className="explorer-heading"><h4>平均は5秒違う。広がりは？</h4><span>母集団を表す模式図</span></div>
    <div className="segmented" role="group" aria-label="2群のばらつきの比較">
      <button aria-pressed={!wide} onClick={() => setWide(false)}>広がりが同じ</button>
      <button aria-pressed={wide} onClick={() => setWide(true)}>Bだけ広がりが大きい</button>
    </div>
    <svg className="plot population-plot" viewBox="0 0 640 340" role="img" aria-label={`等分散の模式図。Aは平均40秒、標準偏差5秒。Bは平均35秒、標準偏差${wide ? 10 : 5}秒。平均差はどちらも5秒。`}>
      {groups.map(group => {
        const curve = points(0, 70, 200, value => [sx(value), group.base - normalPDF(value, group.mean, group.sd) * 760]);
        return <g key={group.name}>
          <text x="30" y={group.base - 88}>{group.name}：平均{group.mean}秒 ／ 標準偏差{group.sd}秒</text>
          <path d={`${linePath(curve)} L${sx(70)},${group.base} L${sx(0)},${group.base} Z`} fill={group.color} fillOpacity=".1"/>
          <path d={linePath(curve)} fill="none" stroke={group.color} strokeWidth="3"/>
          <line x1={sx(0)} x2={sx(70)} y1={group.base} y2={group.base} className="axis"/>
          <line x1={sx(group.mean)} x2={sx(group.mean)} y1={group.base - 75} y2={group.base} stroke="#111" strokeWidth="2" strokeDasharray="5 4"/>
        </g>;
      })}
      {[0, 20, 40, 60].map(value => <text key={value} x={sx(value)} y="300" textAnchor="middle">{value}</text>)}
      <text x="320" y="332" textAnchor="middle">操作時間（秒）</text>
    </svg>
    <p aria-live="polite">{wide ? 'Bの山だけ横に広がりました。平均差は5秒のままですが、ばらつきは同じではありません。' : '山の位置は違いますが、形と広がりは同じです。これが「平均は違うけれど、等分散」の例です。'}</p>
    <p className="explainer">山の位置が平均、横への広がりがばらつきの大きさを表します。実際の測定結果ではなく、違いを見比べるための図です。</p>
  </div>;
}

export function PairedTResult() {
  return <div className="explorer test-result">
    <div className="explorer-heading"><h3>12人のデータをt検定した結果</h3><span>対応のあるt検定・両側</span></div>
    <p>調べる仮説：「本当の平均差は0秒」</p>
    <div className="table-scroll"><table className="data-table"><thead><tr><th>出てくる項目</th><th>今回の値</th></tr></thead><tbody>
      <tr><th>平均差</th><td>{result.average.toFixed(1)}秒</td></tr>
      <tr><th>t値</th><td>{result.t.toFixed(2)}</td></tr>
      <tr><th>自由度（df）</th><td>{result.df}</td></tr>
      <tr className="p-value-row"><th>p値（p-value）</th><td><strong>{result.p.toFixed(4)}</strong></td></tr>
    </tbody></table></div>
    <p className="explainer">前の図と同じ架空の12人から計算しています。表は読みやすく丸めていますが、計算には丸める前の値を使っています。</p>
  </div>;
}

export function PValueFigure() {
  const low = -6, high = 6, base = 232;
  const sx = value => 52 + (value - low) / (high - low) * 536;
  const sy = value => base - studentT11PDF(value) * 440;
  const curve = linePath(points(low, high, 300, value => [sx(value), sy(value)]));
  const tails = [[low, -result.t], [result.t, high]];
  return <figure className="explorer probability-figure">
    <div className="explorer-heading"><h3>p値は、左右の赤い部分の面積</h3><span>t分布・自由度11</span></div>
    <svg className="plot population-plot" viewBox="0 0 640 320" role="img" aria-label={`本当の平均差が0のときのt分布。マイナス${result.t.toFixed(2)}以下とプラス${result.t.toFixed(2)}以上を赤く塗った。両側の面積の合計がp値${result.p.toFixed(4)}、約${(100 * result.p).toFixed(2)}パーセント。`}>
      {tails.map(([a, b]) => <path key={a} d={`${linePath(points(a, b, 100, value => [sx(value), sy(value)]))} L${sx(b)},${base} L${sx(a)},${base} Z`} fill="#cc2939" fillOpacity=".4"/>)}
      <path d={curve} fill="none" stroke="#111" strokeWidth="3"/>
      <line x1={sx(low)} x2={sx(high)} y1={base} y2={base} className="axis"/>
      {[-result.t, result.t].map(value => <g key={value}>
        <line x1={sx(value)} x2={sx(value)} y1="165" y2={base} stroke="#cc2939" strokeWidth="2" strokeDasharray="5 4"/>
        <text x={sx(value)} y="151" textAnchor="middle">{value > 0 ? '+' : '−'}{result.t.toFixed(2)}</text>
      </g>)}
      <text x="320" y="35" textAnchor="middle">赤い面積の合計：約{(100 * result.p).toFixed(2)}%</text>
      <text x={sx(0)} y="263" textAnchor="middle">0</text>
      <text x="90" y="284" textAnchor="middle">Aが速い側</text>
      <text x="550" y="284" textAnchor="middle">Bが速い側</text>
      <text x="320" y="314" textAnchor="middle">t値</text>
    </svg>
    <figcaption>曲線全体の下の面積を1とすると、赤い部分は約{result.p.toFixed(4)}。左右の赤い部分は図の外まで続き、その面積もp値に含みます。</figcaption>
  </figure>;
}
