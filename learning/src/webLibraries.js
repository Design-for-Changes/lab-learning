// Each official page is also the source for the adjacent description.
export const webLibraryGroups = [
  { id: 'motion', title: 'アニメーション・動き', items: [
    ['GSAP', '複数の動きを時間軸で組み合わせる。ScrollTriggerプラグインでスクロールとの連動も扱う。', 'アニメーションライブラリ', 'https://gsap.com/docs/v3/GSAP/'],
    ['Motion', '要素の出入りやレイアウトの変化を動かす。JavaScriptやReactで使うアニメーションAPIを提供する。', 'アニメーションライブラリ', 'https://motion.dev/docs'],
    ['Anime.js', 'CSSの値、SVG、数値などを時間に沿って変化させ、複数の動きを組み合わせる。', 'アニメーションライブラリ', 'https://animejs.com/documentation/'],
    ['Lottie / lottie-web', 'After Effectsなどで制作し、対応する形式で書き出したアニメーションをウェブで再生する。', 'アニメーション再生ライブラリ', 'https://github.com/airbnb/lottie-web'],
  ] },
  { id: 'charts', title: 'グラフ・データ可視化', items: [
    ['D3.js', 'データを位置・長さ・色に対応させ、独自のグラフや図を組み立てる。ズームや範囲選択も扱える。', 'データ可視化ライブラリ', 'https://d3js.org/'],
    ['Chart.js', '棒・折れ線・円などのグラフを、データと設定からCanvas上に描く。', 'グラフライブラリ', 'https://www.chartjs.org/docs/latest/'],
    ['Apache ECharts', '多様な図表を組み合わせたダッシュボードをつくる。CanvasとSVGの描画を選べる。', 'データ可視化ライブラリ', 'https://echarts.apache.org/en/index.html'],
    ['Plotly.js', '統計グラフ、科学技術向けの図、3Dグラフなどを、拡大や選択を伴う図として表示する。', 'グラフライブラリ', 'https://plotly.com/javascript/'],
    ['Vega-Lite', 'データ、図形、軸、色などの対応を宣言的に記述し、操作できるグラフを生成する。', '可視化の記述形式と実装', 'https://vega.github.io/vega-lite/'],
    ['Observable Plot', '点・線・棒などの表現を組み合わせて、データを探索するための図を簡潔に記述する。', 'D3を土台にした可視化ライブラリ', 'https://observablehq.github.io/plot/'],
    ['Highcharts', 'ウェブに組み込む図表をつくる。時系列、地図などを扱う製品群もある。', 'グラフライブラリ', 'https://www.highcharts.com/docs/index'],
    ['Recharts', 'Reactの部品として、軸・凡例・折れ線などを組み合わせてグラフをつくる。', 'React向けグラフライブラリ', 'https://recharts.github.io/en-US/'],
  ] },
  { id: 'diagrams', title: '関係図・ダイアグラム', items: [
    ['Cytoscape.js', '点と線で関係を表すネットワーク図を配置し、選択・探索・グラフ分析を行う。', 'グラフ理論・可視化ライブラリ', 'https://js.cytoscape.org/'],
    ['Mermaid', 'テキストからフローチャート、シーケンス図、状態遷移図などを生成する。', '図の記述言語と描画ツール', 'https://mermaid.js.org/'],
  ] },
  { id: 'drawing', title: '2D描画・クリエイティブコーディング', items: [
    ['p5.js', '図形、色、動き、マウスなどの入力を使って、プログラムで表現をつくる。2DとWebGLのモードがある。', 'クリエイティブコーディング用ライブラリ', 'https://p5js.org/'],
    ['PixiJS', '多数の画像やキャラクターを動かす2D表現をつくる。GPUを使って描画する。', '2D描画エンジン', 'https://pixijs.com/'],
    ['Paper.js', '曲線やパスなどのベクター図形を扱い、Canvas上に描画する。図形編集や線の表現に使える。', 'ベクターグラフィックス用ライブラリ', 'https://paperjs.org/'],
    ['Two.js', '形や線をオブジェクトとして組み立て、SVG・Canvas・WebGLで2Dグラフィックスを描く。', '2D描画ライブラリ', 'https://two.js.org/'],
    ['Fabric.js', 'Canvas上の画像や文字を選択・移動・拡大・回転する、編集ツールのような画面をつくる。', 'Canvasのオブジェクト操作ライブラリ', 'https://www.fabricjs.com/'],
    ['Konva', 'Canvas上の図形を階層やレイヤーで管理し、イベントやドラッグを伴う画面をつくる。', 'Canvas 2Dライブラリ', 'https://konvajs.org/'],
  ] },
  { id: 'three', title: '3D・空間表現', items: [
    ['Three.js', '形状・材質・カメラ・光を組み合わせ、3Dモデルや空間をウェブに表示する。', '3Dライブラリ', 'https://threejs.org/manual/#fundamentals'],
    ['Babylon.js', '3Dの場面、モデル、アニメーションなどを扱い、空間を操作するアプリやゲームをつくる。', '3Dエンジン', 'https://www.babylonjs.com/'],
    ['React Three Fiber', 'Three.jsの物体やシーンをReactの部品として記述し、アプリの状態と結びつける。', 'Three.js用Reactレンダラー', 'https://github.com/pmndrs/react-three-fiber'],
    ['A-Frame', 'HTMLに近い要素の記述で3D空間を組み立て、VRなどの体験をつくる。', '空間表現のフレームワーク', 'https://aframe.io/'],
  ] },
  { id: 'maps', title: '地図・地理データ', items: [
    ['Leaflet', '地図を拡大・移動し、マーカー、線、領域、ポップアップなどを重ねる。', '地図ライブラリ', 'https://leafletjs.com/'],
    ['MapLibre GL JS', 'ベクタータイルなどの地理データを描き、地図のスタイルや視点を操作する。', '地図描画ライブラリ', 'https://maplibre.org/maplibre-gl-js/docs/'],
    ['Mapbox GL JS', 'Mapboxの地図や位置情報サービスと組み合わせ、地図の表示や操作を実装する。', '地図ライブラリ', 'https://docs.mapbox.com/mapbox-gl-js/guides/'],
    ['OpenLayers', '複数の地理データや地図レイヤーを重ね、ウェブ上で表示・操作する。', '地図ライブラリ', 'https://openlayers.org/'],
    ['deck.gl', '大量の地点や移動経路などを、GPUを使うレイヤーとして可視化する。地図とも組み合わせられる。', 'GPUによるデータ可視化フレームワーク', 'https://deck.gl/'],
    ['CesiumJS', '地球儀、地形、建物などを3Dで表示し、広い範囲の地理データを探索する。', '3D地理空間ライブラリ', 'https://cesium.com/platform/cesiumjs/'],
  ] },
  { id: 'games', title: 'ゲーム・物理シミュレーション', items: [
    ['Phaser', 'キャラクター、入力、アニメーション、物理処理などを組み合わせ、2Dゲームをつくる。', '2Dゲームフレームワーク', 'https://docs.phaser.io/phaser/getting-started/what-is-phaser'],
    ['Matter.js', '2Dの物体の落下、衝突、積み重なりなどを計算し、動きに反映する。', '2D物理エンジン', 'https://brm.io/matter-js/'],
    ['Rapier', '2D・3Dの物体の衝突や運動を計算する。ウェブではJavaScriptからWebAssembly版を利用できる。', '2D・3D物理エンジン', 'https://rapier.rs/'],
  ] },
  { id: 'controls', title: 'スライド・ドラッグ・操作部品', items: [
    ['Swiper', '写真やカードをスワイプして切り替えるスライダーをつくる。', 'スライダーライブラリ', 'https://swiperjs.com/'],
    ['Embla Carousel', 'ドラッグやスワイプで送るカルーセルをつくり、見た目や制御を組み合わせる。', 'カルーセルライブラリ', 'https://www.embla-carousel.com/'],
    ['SortableJS', '一覧の項目をドラッグして並べ替えたり、別の一覧へ移したりする。', '並べ替えライブラリ', 'https://sortablejs.github.io/Sortable/'],
    ['interact.js', '要素のドラッグ、サイズ変更、複数の指によるジェスチャーを扱う。', '入力操作ライブラリ', 'https://interactjs.io/'],
    ['Floating UI', 'ボタンの近くに出すツールチップやポップアップが、画面からはみ出さないよう位置を計算する。', '浮動要素の配置ライブラリ', 'https://floating-ui.com/'],
  ] },
  { id: 'editors', title: '文章・コードを編集する画面', items: [
    ['Tiptap', '見出し、太字、リンク、表などを編集できる入力画面をつくる。CMSの記事エディターにもつながる。', 'リッチテキスト編集フレームワーク', 'https://tiptap.dev/docs/editor/getting-started/overview'],
    ['CodeMirror', 'コードの色分けや補完などを備えたエディターを、ウェブページに組み込む。', 'コードエディターライブラリ', 'https://codemirror.net/'],
    ['Monaco Editor', 'VS Codeにも使われるコード編集機能を、ブラウザ内のアプリに組み込む。', 'コードエディターライブラリ', 'https://github.com/microsoft/monaco-editor'],
  ] },
  { id: 'audio', title: '音・音楽とのインタラクション', items: [
    ['Tone.js', 'シンセサイザー、エフェクト、音を鳴らすタイミングなどを組み合わせ、音楽の体験をつくる。', 'Web Audioを使う音楽フレームワーク', 'https://tonejs.github.io/'],
    ['howler.js', '音声の再生・停止・音量などを扱い、操作に応じた効果音や音声をつける。', '音声ライブラリ', 'https://howlerjs.com/'],
  ] },
];

export const webLibraryCount = webLibraryGroups.reduce((count, group) => count + group.items.length, 0);

export function findWebLibraries(category, query) {
  const words = query.normalize('NFKC').trim().toLowerCase().split(/\s+/).filter(Boolean);
  return webLibraryGroups.filter(group => category === 'all' || category === group.id).map(group => ({
    ...group,
    items: group.items.filter(item => words.every(word => `${group.title} ${item.slice(0, 3).join(' ')}`.normalize('NFKC').toLowerCase().includes(word))),
  })).filter(group => group.items.length);
}
