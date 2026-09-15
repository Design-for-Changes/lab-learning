import { Section, Next } from './Common.jsx';
import { WebHeading, WebReading, WebFlow, WebCode, WebTable } from './WebShared.jsx';
import WebLibraryCatalog from './WebLibraryCatalog.jsx';

export default function WebPractice() { return <>
  <WebHeading number="06" title="実際にインタラクションを実装するには？"/>
  <Section title="操作、変化する値、画面への反映を決める">
    <p>「ボタンを押すとカードが動く」「数値を変えるとグラフが変わる」「ドラッグすると3Dモデルが回る」。実装するときは、まず<strong>何をすると、何がどう変わるか</strong>を決めます。</p>
    <WebFlow steps={[
      ['入力を受け取る', 'クリック、文字入力、スクロール、ドラッグなどのイベントを受け取る。'],
      ['状態を変える', '選択中の項目、グラフの数値、物体の回転角度などを更新する。'],
      ['表示に反映する', 'DOMやCSSを書き換える。またはCanvasやWebGLで描き直す。'],
      ['必要ならサーバーとやり取りする', '検索結果を取得する、編集内容を保存するなど、共有するデータを扱う。'],
    ]}/>
    <p>メニューを開く程度なら、HTML・CSSと短いJavaScriptで実装できます。複雑な動き、図表、3Dなどには、そのための処理をまとめた<strong>ライブラリ</strong>を利用します。</p>
  </Section>
  <Section id="first-example" title="まず、HTML・CSS・JavaScriptで一つ動かす">
    <p>下のボタンを押すと、カードが少し持ち上がり、傾きます。HTMLでボタンとカードを用意し、JavaScriptでクラスを付け外しし、CSSで変化を描いています。</p>
    <iframe className="web-practice-frame" src="/lab-learning/learning/data/web/interaction.html" title="ボタンでカードの状態を変える実装例" sandbox="allow-scripts" loading="lazy"/>
    <WebCode label="HTML：操作するボタンと、変化する対象">{'<button id="toggle" aria-pressed="false" aria-controls="card">\n  カードを選択する\n</button>\n<div id="card" class="card">展示のお知らせ</div>'}</WebCode>
    <WebCode label="CSS：通常の見た目と、選択中の見た目">{'.card {\n  transition: transform 300ms ease, background-color 300ms ease;\n}\n.card.is-selected {\n  transform: translateY(-8px) rotate(-3deg);\n  background-color: #ffe6e8;\n}\n@media (prefers-reduced-motion: reduce) {\n  .card { transition: none; }\n}'}</WebCode>
    <WebCode label="JavaScript：クリックを受けて、状態とDOMを更新する">{'const button = document.querySelector("#toggle");\nconst card = document.querySelector("#card");\nlet selected = false;\n\nbutton.addEventListener("click", () => {\n  selected = !selected;\n  card.classList.toggle("is-selected", selected);\n  button.setAttribute("aria-pressed", String(selected));\n  button.textContent = selected ? "選択を解除する" : "カードを選択する";\n});'}</WebCode>
    <p><code>transition</code>は、値の変化を指定した時間で滑らかにつなぐCSSの機能です。この例はブラウザ内で完結します。保存する処理を加えなければ、ページを読み直すと初期状態に戻ります。</p>
    <p><a href="/lab-learning/learning/data/web/interaction.html" download="interaction.html">動く例をHTMLファイルでダウンロードする</a>。ファイルをブラウザで開くと動かせます。テキストエディターで開き、<code>300ms</code>や<code>rotate(-3deg)</code>を変えて保存・再読み込みすると、時間や角度との対応を確かめられます。</p>
  </Section>
  <Section id="drawing" title="何を動かすかで、描画の仕組みを選ぶ">
    <p>ブラウザには、文書の要素を表示する仕組みに加えて、図形や画像を描く仕組みがあります。<strong>SVG（Scalable Vector Graphics）</strong>は線や形を要素として記述する方式、<strong>Canvas</strong>はJavaScriptから描画するためのHTML要素です。</p>
    <WebTable caption="表現と描画の仕組みの対応" headings={['つくりたいもの','主な仕組み','操作するときに変えるもの']} rows={[
      ['メニュー、入力欄、カード','HTMLのDOM＋CSS','要素の表示、クラス、文字、配置など。'],
      ['図解、地図の輪郭、独自のグラフ','SVG','円や線などの要素の位置、形、色。要素ごとに操作を受け取れる。'],
      ['お絵描き、2Dアニメーション','Canvas 2D','描く形や位置のデータ。変化に合わせて描画面を更新する。'],
      ['3Dモデル、多数の粒子、画像の変形','WebGL＋Canvas','物体、カメラ、光、描画用の数値など。GPUを使って描く。'],
    ]}/>
    <p>Canvasの中に描いた一つ一つの図形は、HTMLのボタンのようなDOM要素にはなりません。クリック位置がどの図形に当たるかなどを、プログラムやライブラリ側で扱います。操作用のボタンや説明はHTMLで用意し、描画面と組み合わせられます。</p>
  </Section>
  <Section id="libraries" title="ライブラリは、表現に必要な処理をまとめた道具">
    <p><strong>ライブラリ</strong>とは、再利用できる処理をまとめたプログラムです。必要なものを読み込み、自分のコードから呼び出します。たとえば、動きの順番を制御するGSAP、データを位置や色に変換するD3.js、3Dの物体やカメラを扱うThree.jsでは、助けてくれる部分が違います。</p>
    <div className="web-two-columns"><article><h3>D3.js：データと図形を結びつける</h3><p>D3はData-Driven Documentsの略です。数値を棒の長さにする、関係データからネットワーク図を配置する、範囲を選択して絞り込む、といった処理を組み合わせます。データと表現の対応を自分で設計できます。</p><p>決まった形のグラフを手早くつくるならChart.jsやECharts、独自の表現を組み立てるならD3.js、という違いから見ていくと分かりやすくなります。</p></article><article><h3>GSAP：動きの時間と順序を制御する</h3><p>「見出しが現れた後に画像を動かす」「スクロール位置に応じて変化させる」など、複数の動きをまとめて扱います。位置や透明度などを、指定した時間や変化の仕方に沿って更新します。</p><p>Reactなどが画面の部品や状態を管理し、その中の動きをGSAPでつける、という組み合わせもできます。</p></article></div>
    <p>導入方法は大きく二つです。配信されたファイルをHTMLの<code>&lt;script&gt;</code>などで読み込む方法と、<strong>npm</strong>などのパッケージ管理ツールでプロジェクトに追加し、<code>import</code>で読み込む方法があります。<strong>CDN（Content Delivery Network）</strong>は、ファイルを配信するネットワークの仕組みです。</p>
    <WebCode label="npmとビルドツールを使うプロジェクト：ターミナルでD3を追加する">{'npm install d3'}</WebCode>
    <WebCode label="JavaScriptのファイル：必要な機能を読み込んで使う">{'import { scaleLinear } from "d3";\n\nconst length = scaleLinear().domain([0, 100]).range([0, 300]);\nlength(50); // 値50を、長さ150に対応させる'}</WebCode>
    <p>導入するときは、使うバージョンの公式資料から最小の例を動かし、自分のHTMLやデータに置き換えます。ライブラリによって、必要なCSS、対応環境、利用条件も異なります。</p>
  </Section>
  <Section id="webgl" title="WebGLは、GPUを使ってブラウザに描く仕組み">
    <p><strong>WebGL（Web Graphics Library）</strong>は、ブラウザから2D・3Dのグラフィックスを描くためのAPIです。画像処理を並列に行う<strong>GPU（Graphics Processing Unit）</strong>を利用し、結果を<code>&lt;canvas&gt;</code>に表示します。3Dモデルの回転や、粒子、画像に波をつける表現などに使われます。</p>
    <p>直接WebGLを扱う場合は、図形の頂点や、GPUで位置・色などを計算する<strong>シェーダー</strong>を用意します。Three.jsを使うと、物体・カメラ・光などの単位で3Dの場面を組み立てられます。</p>
    <WebFlow steps={[
      ['入力 → JavaScript', 'ドラッグの量を受け取り、モデルの回転角度を変える。'],
      ['Three.jsで場面を扱う', 'シーンに物体を置き、カメラでどこから見るかを決める。'],
      ['WebGLRenderer → WebGL → GPU', 'レンダラーが描画の指示を組み立て、WebGLを通してGPUに処理させる。'],
      ['Canvasに描画結果が出る', '角度を変えて描き直すと、モデルが回って見える。'],
    ]} caption="Three.jsのWebGLRendererを使った構成。Three.jsはライブラリ、WebGLはブラウザのAPI、GPUは処理を担うハードウェアです。"/>
    <p><strong>シーン</strong>は物体などを配置する場面、<strong>カメラ</strong>は視点、<strong>レンダラー</strong>は場面を画面に描く処理を担当します。形状や材質の設定も、最終的には描画の指示につながります。</p>
    <details><summary>WebGPUとの関係</summary><p><strong>WebGPU</strong>は、ブラウザからGPUの描画や汎用計算を扱う別のAPIです。Three.jsやBabylon.jsなどには、WebGPUを利用する仕組みもあります。ライブラリを使う場合も、どの描画方式とブラウザに対応するかを確認します。</p></details>
  </Section>
  <Section id="catalog" title="つくりたい表現から、ライブラリを探す">
    <p>図表、動き、地図、ゲーム、編集画面などを実装する道具を、用途別に紹介します。ライブラリに加え、描画エンジンや専用フレームワークも含めています。名前から公式資料と作例を開けます。</p>
    <WebLibraryCatalog/>
  </Section>
  <Section title="画面の変化と、サーバーの処理をつなぐ">
    <p>入力したデータを保存したい場合は、画面の実装に通信を加えます。たとえばD3.jsで描くグラフなら、APIから取得した数値を描画に渡します。Three.jsのモデルなら、サーバーから読み込んだモデルデータをシーンに追加します。</p>
    <WebFlow steps={[
      ['操作を受け取る', '保存ボタンが押されたら、送るデータを用意して「保存中」と表示する。'],
      ['fetchで要求を送る', 'POST /api/articles にJSONを送る。'],
      ['サーバーのルーティングで処理を選ぶ', '記事を作成する処理が入力と権限を確認し、データベースに保存する。'],
      ['応答を画面に反映する', '成功したら保存済みにする。失敗したら入力を残し、原因や再試行の方法を示す。'],
    ]}/>
    <p>動かないときは、ブラウザの開発者ツールで確認できます。<strong>Elements（要素）</strong>はDOMとCSS、<strong>Console</strong>はJavaScriptのエラー、<strong>Network</strong>は要求したURL・メソッド・ステータスコード・応答内容を見る場所です。操作が届いたか、状態が変わったか、通信に成功したかを順にたどります。</p>
  </Section>
  <WebReading ids={['events','transitions','canvas','svg','d3','gsap','modules','webgl','three','webgpu','fetch']}/>
  <Next href="/web/overview" label="01　フロントエンドとバックエンドに戻る"/>
</>; }
