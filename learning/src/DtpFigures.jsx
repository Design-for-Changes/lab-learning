import { useState } from 'react';

export function TypeSpacingExplorer() {
  const [kerning, setKerning] = useState(0);
  const [tracking, setTracking] = useState(0);
  const [leading, setLeading] = useState(16);
  return <figure className="dtp-figure" id="dtp-spacing-figure">
    <figcaption>動かす場所を比べる：2文字の間／文字列全体／行と行</figcaption>
    <div className="dtp-spacing-examples">
      <div><label htmlFor="dtp-kerning-control">カーニング：AとVの間だけ <output>{kerning}</output></label>
        <input id="dtp-kerning-control" type="range" min="-180" max="100" step="10" value={kerning} onChange={e => setKerning(Number(e.target.value))}/>
        <div className="dtp-type-sample dtp-kerning-sample" aria-label="AVATAR"><span>A</span><span style={{ marginLeft: `${kerning / 1000}em` }}>V</span><span>ATAR</span></div>
        <p className="dtp-caption">数値は文字サイズの1/1000単位。−100なら、文字サイズの10％分だけAとVを近づけます。</p>
      </div>
      <div><label htmlFor="dtp-tracking-control">トラッキング：文字列全体 <output>{tracking}</output></label>
        <input id="dtp-tracking-control" type="range" min="-30" max="160" step="10" value={tracking} onChange={e => setTracking(Number(e.target.value))}/>
        <div className="dtp-type-sample" style={{ letterSpacing: `${tracking / 1000}em` }}>DESIGN</div>
        <p className="dtp-caption">選んだ文字列の間隔をまとめて変えます。文字そのものの幅や高さは変えていません。</p>
      </div>
      <div><label htmlFor="dtp-leading-control">行送り：文字サイズ10ptの例 <output>{leading}pt</output></label>
        <input id="dtp-leading-control" type="range" min="10" max="24" step="1" value={leading} onChange={e => setLeading(Number(e.target.value))}/>
        <div className="dtp-leading-sample" style={{ lineHeight: leading / 10 }}>文字の間を整える。<br/>行の間も確かめる。<br/>読みやすさを比べる。</div>
        <p className="dtp-caption">同じサイズの和文をそろえて組む場合、行間はおよそ{leading}−10＝{leading - 10}pt。行送りは文字サイズも含む距離です。</p>
      </div>
    </div>
    <p className="dtp-caption">比較のために拡大した表示です。画面上の実寸や、この数値を推奨する図ではありません。AとVの例ではフォントの自動カーニングを止め、手動調整だけを示しています。</p>
  </figure>;
}

const circlePath = 'M 80 28 C 108.72 28 132 51.28 132 80 C 132 108.72 108.72 132 80 132 C 51.28 132 28 108.72 28 80 C 28 51.28 51.28 28 80 28 Z';
// Sample a circle into 16 × 16 pixels; each displayed cell has one color.
const circlePixels = Array.from({ length: 256 }, (_, index) => {
  const x = index % 16 * 10;
  const y = Math.floor(index / 16) * 10;
  let inside = 0;
  for (let sy = 0; sy < 8; sy += 1) {
    for (let sx = 0; sx < 8; sx += 1) {
      if ((x + (sx + 0.5) * 1.25 - 80) ** 2 + (y + (sy + 0.5) * 1.25 - 80) ** 2 <= 52 ** 2) inside += 1;
    }
  }
  const color = [36, 91, 96].map(channel => Math.round(255 + (channel - 255) * inside / 64));
  return { x, y, fill: `rgb(${color.join(',')})` };
});

export function PathRasterExplorer() {
  const [zoom, setZoom] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const viewBox = zoom ? '72 16 48 48' : '0 0 160 160';
  return <figure className="dtp-figure" id="dtp-path-raster-figure">
    <figcaption>同じ丸でも、記録しているものが違う</figcaption>
    <div className="segmented" aria-label="図形の表示範囲">
      <button type="button" aria-pressed={!zoom} onClick={() => setZoom(false)}>全体を見る</button>
      <button type="button" aria-pressed={zoom} onClick={() => setZoom(true)}>輪郭の一部を拡大</button>
    </div>
    <div className="dtp-data-pair">
      <div><h3>パスデータ</h3><p className="dtp-data-label">点の位置と、点を結ぶ曲線</p>
        <svg viewBox={viewBox} role="img" aria-label={`パスで描いた円${zoom ? 'の輪郭を拡大' : 'の全体'}。曲線を描き直すため、拡大しても輪郭は滑らか。${showPoints ? '四角はアンカーポイント、丸はハンドルの先端。' : ''}`}>
          <rect width="160" height="160" fill="white"/>
          <path d={circlePath} fill="#245b60"/>
          {showPoints && <g fill="white" stroke="#a51c2e" strokeWidth="1.5">
            <path d="M 80 28 H 108.72 M 132 80 V 51.28" fill="none"/>
            <circle cx="108.72" cy="28" r="2.5"/><circle cx="132" cy="51.28" r="2.5"/>
            {[[80, 28], [132, 80], [80, 132], [28, 80]].map(([x, y]) => <rect key={`${x}-${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5"/>)}
          </g>}
          {!zoom && <rect x="72" y="16" width="48" height="48" fill="none" stroke="#a51c2e" strokeWidth="1" strokeDasharray="3 2"/>}
        </svg>
        <p>拡大後の大きさに合わせて、曲線を描き直します。</p>
      </div>
      <div><h3>ラスターデータ</h3><p className="dtp-data-label">縦16 × 横16のマスの色</p>
        <svg viewBox={viewBox} role="img" aria-label={`16掛ける16画素で記録した同じ円${zoom ? 'の輪郭を拡大。マスごとに一つの色があり、輪郭が階段状に見える' : 'の全体'}。違いを見るため画素を粗くした模式図。`}>
          <g shapeRendering="crispEdges">{circlePixels.map(({ x, y, fill }) => <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" fill={fill}/>)}</g>
          {!zoom && <rect x="72" y="16" width="48" height="48" fill="none" stroke="#a51c2e" strokeWidth="1" strokeDasharray="3 2"/>}
        </svg>
        <p>同じマスを大きく表示しています。元の記録に曲線の情報はありません。</p>
      </div>
    </div>
    <label className="dtp-checkbox"><input type="checkbox" checked={showPoints} onChange={e => setShowPoints(e.target.checked)}/>パスのアンカーポイントとハンドルを表示</label>
    {showPoints && <p className="dtp-caption">四角がアンカーポイント、丸がハンドルの先端です。右上の曲線を調整するハンドルだけを示しています。</p>}
    <p className="dtp-result" aria-live="polite">{zoom ? '同じ範囲を拡大しています。パスは曲線の形を、ラスターはマスごとの色を保持しています。' : '赤い破線の範囲を、左右で同じように拡大できます。'}</p>
    <p className="dtp-caption">違いを見るため、ラスターをわざと少ない画素で示しています。十分な画素数があれば、ラスターでも滑らかに印刷できます。実際のアプリでは拡大時にマスの間の色を計算する場合もありますが、元の曲線の情報が戻るわけではありません。</p>
  </figure>;
}

export function ResolutionExplorer() {
  const [width, setWidth] = useState(101.6);
  const ppi = Math.round(1200 / (width / 25.4));
  return <figure className="dtp-figure" id="dtp-resolution-figure">
    <figcaption>同じ1200pxの画像を、大きく印刷すると？</figcaption>
    <div className="segmented" aria-label="印刷する画像の横幅">{[50.8, 101.6, 203.2].map(value => <button key={value} type="button" aria-pressed={value === width} onClick={() => setWidth(value)}>幅{value}mm</button>)}</div>
    <div className="dtp-resolution-preview"><div style={{ width: `${width / 203.2 * 100}%`, backgroundSize: `${width / 203.2 * 16}px ${width / 203.2 * 16}px` }} aria-hidden="true"/></div>
    <p className="dtp-result" aria-live="polite">幅{width}mmで配置 → <strong>{ppi}ppi</strong></p>
    <p>1200px ÷（{width}mm ÷ 25.4mm）＝{ppi}ppi</p>
    <p className="dtp-caption">幅が2倍になると、1インチに入るピクセル数は半分になります。方眼は密度の変化の模式図で、実際の1200pxの画像や印刷品質の再現ではありません。</p>
  </figure>;
}

function BleedArtwork({ bleed }) {
  return <>
    <rect x="0" y="0" width="250" height="310" fill="white"/>
    <rect x={bleed ? 15 : 25} y={bleed ? 15 : 25} width={bleed ? 220 : 200} height={bleed ? 280 : 260} fill="#f4c35b"/>
    <circle cx="125" cy="135" r="62" fill="#245b60"/>
    <path d="M 82 168 L 125 78 L 168 168 Z" fill="#fcfaf2"/>
    <text x="49" y="221" fill="#203237" fontSize="24" fontWeight="750">OPEN LAB</text>
    <text x="49" y="251" fill="#203237" fontSize="16">研究室展示</text>
  </>;
}

export function BleedExplorer() {
  const [bleed, setBleed] = useState(true);
  const [shift, setShift] = useState(false);
  const cutX = shift ? 31 : 25;
  const cutY = shift ? 29 : 25;
  return <figure className="dtp-figure" id="dtp-bleed-figure">
    <figcaption>断裁が少しずれても、白い縁を出さないために</figcaption>
    <div className="segmented" aria-label="塗り足しの有無"><button type="button" aria-pressed={bleed} onClick={() => setBleed(true)}>塗り足しあり</button><button type="button" aria-pressed={!bleed} onClick={() => setBleed(false)}>塗り足しなし</button></div>
    <label className="dtp-checkbox"><input type="checkbox" checked={shift} onChange={e => setShift(e.target.checked)}/>断裁位置を少し右下へずらす</label>
    <div className="dtp-bleed-pair">
      <div><h3>入稿データ</h3><svg viewBox="0 0 250 310" role="img" aria-label={`塗り足し${bleed ? 'あり' : 'なし'}。外側に塗り足し、仕上がり線、内側に文字の余白を示す図。`}>
        <BleedArtwork bleed={bleed}/>
        <rect x="15" y="15" width="220" height="280" fill="none" stroke="#b32035" strokeWidth="2"/>
        <rect x="37" y="37" width="176" height="236" fill="none" stroke="#00647a" strokeWidth="2" strokeDasharray="5 4"/>
        <rect x={cutX} y={cutY} width="200" height="260" fill="none" stroke="#17252a" strokeWidth="2"/>
        <path d="M 25 2 V 11 M 2 25 H 11 M 225 2 V 11 M 239 25 H 248 M 25 299 V 308 M 2 285 H 11 M 225 299 V 308 M 239 285 H 248" stroke="#17252a" strokeWidth="1"/>
      </svg></div>
      <div><h3>切った後</h3><svg className="dtp-trimmed" viewBox={`${cutX} ${cutY} 200 260`} role="img" aria-label={!bleed && shift ? '右と下に白い縁が残った仕上がり' : '端まで背景色のある仕上がり'}><BleedArtwork bleed={bleed}/></svg></div>
    </div>
    <ul className="dtp-diagram-key"><li><b className="bleed">外の赤線</b> 塗り足しの範囲</li><li><b>黒い実線</b> 切る位置</li><li><b className="safe">内の青い破線</b> 文字を置く余白の目安</li></ul>
    <p className="dtp-result" aria-live="polite">{!shift ? '切る位置がぴったりなら、どちらも端まで色が出ます。断裁位置をずらして比べてください。' : bleed ? '塗り足しがあるので、ずれた位置にも背景色が残っています。' : '塗り足しがないので、右と下に白い縁が出ました。'}</p>
    <p className="dtp-caption">関係を見やすくした模式図です。ずれの量・トンボの形・余白の幅は、入稿に使う規格値ではありません。</p>
  </figure>;
}
