# 動態デザイン研究室 学習資料

研究に必要な知識を学ぶためのポータルと、Reactでつくったインタラクティブ教材です。

公開先：<https://design-for-changes.github.io/lab-learning/learning/>

## 教材

**統計解析入門** の構成は以下のとおりです。

1. 統計解析とデータの基礎：記述と推測、母集団・標本、平均とばらつき、標準誤差、外れ値、ヒストグラムから確率密度、代表的な確率分布。
2. 推定と検定：一人ずつの差とばらつきから、カテゴリー別の観測値と母集団モデルの図、帰無仮説へ。等分散の比較図とF検定を先に学び、t検定、12人の検定結果、t分布の面積からp値を読む。その後に信頼区間、一元配置・二元配置分散分析の結果表と読み方。ヒストグラム・Q–Qプロット・残差の例と、計算から考察までの例題。
3. データと変数：目的変数・説明変数、目的変数を置かない解析、尺度、対応と独立、直線・頭打ち・U字・波の図から線形と非線形を考える。
4. 実験計画法：目的から確認実験までの6手順。完全要因計画の負担から、直交表で実験数を減らす考え方へ。L4の行列の読み方、2列の釣り合い、行平均の計算、見分けられなくなる効果を、同じ画面の実験で学ぶ。代表的な直交表の一覧と、L4・L8の線点図で列への割り付けを説明する。24人の架空データから主効果・交互作用・三元配置分散分析を計算し、CSVとPython実行例も用意する。
5. 解析を選ぶ・調べる：多変量解析と条件比較の選択樹形図だけを、タブを使わず続けて表示。一元配置・二元配置・多元配置を具体例で区分し、数量化理論I〜IV類を含む27手法の詳しい解説へ進む。
6. 解析の注意点：「やってはいけないこと」「注意するべきこと」。各項目の理由・具体例・確認方法と、多重共線性への対処。
7. 実施する方法：統計ソフト・表計算・Python・Rの無料／有料／条件付き無料の区分、Pythonのライブラリ一覧と実行環境。

各章は入門の説明と一覧を基本とし、図やAIへの質問例を補助に置いています。Pythonの実習は「実施する方法」から開く練習例として残しています。

平均と中央値、対応する測定値、PCAの軸、ヒストグラムの密度への換算と推定曲線、正規分布の面積、一元配置分散分析、交互作用、直交表、説明変数の相関とVIFを操作できる図を含みます。教材の図とCSVは架空の例で、個人データを含みません。解析選択は候補を検討するための入口であり、すべての研究設計を網羅するものではありません。

学習資料には統計解析入門、人工知能学習入門、AI入門を用意しています。AI入門は一覧の11番目です。マネジメント入門、進化生物学入門、脳科学入門、心理学入門、デザイン学入門、科学入門、経済学入門、ウェブインタラクション入門は準備中として配置しています。

## 作業

Node.js 24以降を推奨します。

```sh
npm ci
npm run dev
```

ローカルプレビュー：<http://127.0.0.1:4178/lab-learning/learning/>

```sh
npm run check
npm run build
```

`check` は図の計算、架空データと表示の一致、選択フローの全分岐、各ページのレンダリング、内部リンクと教材ダウンロードを確認します。ブラウザーの見た目やクリック操作の検査とは別です。

## 公開

`main` へのpushでGitHub Actionsが検証・ビルドし、`dist/`のみをGitHub Pagesへ公開します。GitHub PagesはGitHub Actionsによる公開に設定します。

Viteのbaseは `/lab-learning/learning/`。ページの切り替えにはハッシュを使うので、各教材のURLを直接開いたり更新したりできます。サーバーやAPIキーは不要です。`/statistics` は中間ポータルを挟まず01を開きます。旧 `/statistics/distributions` は、分布の説明を統合した `/statistics/basics` と同じ教材を表示します。旧 `/statistics/methods` は統合した `/statistics/choose` と同じ内容を表示します。左メニューは章の移動に絞り、手法は05のチャートから開きます。

## 編集する場所

- `src/App.jsx`：ポータル、基礎、変数、手法ページ、ナビゲーション
- `src/content.js`：手法の説明と出典
- `src/chooser.js`：旧フォームの分岐ロジック（現在の画面では未使用）
- `src/Chooser.jsx`、`src/AnalysisMap.jsx`：タブを使わない選択チャート
- `src/RelationshipExplorer.jsx`：直線・頭打ち・U字・波の関係の図
- `src/DiagnosticFigures.jsx`、`src/diagnosticExamples.js`：同じ残差データを使う3つの診断図
- `src/WorkedAnovaExample.jsx`：一元配置分散分析の例題・計算・考察
- `src/Explorers.jsx`、`src/math.js`：動く図と計算
- `src/DistributionLesson.jsx`：基礎ページ内の分布と確率
- `src/InferenceLesson.jsx`、`src/InferenceExplorers.jsx`：02の推定・検定・分散分析
- `src/TTestFigures.jsx`、`src/pairedTExample.js`：等分散の比較図、対応のあるt検定の計算結果とp値の面積図
- `src/PopulationComparison.jsx`、`src/populationComparison.js`：同じ観測値を共通・別々の母集団モデルで考える図
- `src/ExperimentalDesignLesson.jsx`、`src/DesignExplorers.jsx`：04の実験計画法と直交表
- `src/LinearGraphGuide.jsx`：L4・L8の線点図と列の対応
- `src/designExamples.js`：L4の設定名・架空の行平均と比較計算
- `src/experimentMath.js`、`src/histogram.js`：実験計画・分散分析・密度の図の計算
- `src/ChecksLesson.jsx`：解析の注意点
- `src/ToolsLesson.jsx`：実施する方法とライブラリ一覧
- `src/PythonLesson.jsx`：Pythonの練習例
- `src/style.css`：共通グリッドとレスポンシブ表示。文字サイズはrem、ルートは100%。
- `public/data/`：練習用CSV、Pythonコード、ローカルJupyter用ノート

Pythonの確認用コードを変えた場合は、ノート内の確認用コードも更新します。教材の数値はSciPyによる対応のあるt検定で確認しています。

## 補助機能の検証状況

05はチャート表示に絞ったため、旧選択フォームとWebMCPツールの登録は行いません。教材の実行手順は各自のPCのPythonを前提とし、計算コードもローカルのPython環境で確認しています。

デスクトップ幅・スマートフォン幅で、主要ページの表示と横にはみ出さないことを確認しています。正規分布の区間変更、多重共線性の相関スライダー、解析選択の操作もブラウザーで確認しています。

## 手法別の入力・出力・Python例

27手法の各ページは、必要な列と入力表、実際にPythonで得た出力、結果の読み方、AIへの依頼例、確認用の実行コードの順で構成しています。`src/methodGuides.js`が解説、`src/methodExampleResults.json`が実行結果、`public/data/method-examples/`がCSVとPythonコードです。例はすべて架空データであり、人数は必要標本数の目安ではありません。

主要な出力と判断の対応は `src/AnalysisOutputReading.jsx` にまとめています。PCAは固有値・寄与率・累積寄与率と軸数の選び方、分散分析は効果量とTukey HSD、回帰は係数の不確かさとモデル全体の当てはまりなどを、実際の計算結果で確認できます。

数量化理論III類・多重対応分析は、60人分の架空の回答を0/1に変換して固有値問題を解きます。カテゴリーと回答者の図を分け、回答パターンを選ぶと対応する点を強調します。`src/CategoryPatternPlots.jsx` が図、追加の `*-scores.csv` が全員のサンプルスコアです。

例の元コードを変更する場合は、必要なPython依存関係を入れた環境で `python scripts/build-method-examples.py` を学習アプリのディレクトリから実行し、出力を再生成してください。使用バージョンは生成JSONと各ページに記録します。`npm run check --workspace learning` はコード・CSV・生成結果の整合と全ページを確認します。

t-SNEはIII類と同じ60人の回答を使い、4設定の座標・図と元の回答を照合します。計算結果とダウンロード用Pythonは他の手法と同じ生成スクリプトで更新します。

## 人工知能学習入門

`#/ai`は01へ直接進みます。離散数学、グラフとマイニング、確率と学習の種類、ニューラルネットワーク、重みの学習と過学習、ローカルPythonの実行例、ニューラルネットワークの応用、転移学習・知識蒸留の8章です。08の末尾から、続きの教材「AI入門」へ進めます。`src/AiCourse.jsx`が章の一覧と基礎の本文、`src/AiExplorers.jsx`が操作する図、`src/aiMath.js`がグラフ・順伝播・誤差逆伝播・勾配降下法の計算です。

06の本文は `src/AiPracticeLesson.jsx`。05と同じXORを、目的→4通りのデータ→PCにさせる処理→ファイル保存と実行→答え合わせ→100回と5000回の比較→考察の順で追います。別の入力・最適化法の実験を並べず、4通りへの適合と未知データの評価を区別します。関係のCSVを集計するPython練習は02に配置しています。

`python scripts/build-ai-examples.py`で、関係・共起のCSVとPythonコード、XORの実行結果を再生成します。XORのコードの編集元は `public/data/ai/xor.py` です。XORは4行の真理値表を学ぶ例で、未知データの性能評価とは区別しています。チェックでは9個のパラメーターの勾配を有限差分と照合し、ブラウザー用計算と独立したNumPy実行結果も比較します。

過学習の例は `python scripts/build-overfitting-example.py` で再生成します（NumPy、pandas、scikit-learnが必要）。既存の160件を90件の学習用・30件の検証用・40件のテスト用に分け、学習用と検証用だけを比較します。テスト用の結果は停止時点や設定の選択に使いません。`src/OverfittingLesson.jsx`が表示、`src/overfittingExample.json`が実測した学習履歴です。

07は `src/AiArchitecturesLesson.jsx` と `src/ArchitectureExplorers.jsx`、08は `src/AiAdvancedCourse.jsx`。07「ニューラルネットワークの応用」は、06のスイッチ2個の予測から画像を読む課題へ進み、全結合で何に困るか→畳み込みとCNN→文章の順序とRNN・Transformer→正解ラベルのない画像とオートエンコーダ→新しい画像の生成とGANを扱います。各節は困る場面と工夫を説明し、細かな計算は閉じた補足に置きます。CNN・注意の重みは手設定であること、08の蒸留の確率表は説明用の仮の値であることを表示します。学習の手がかりと構造の名前を同列の択一にしません。

オートエンコーダの例は `python scripts/build-autoencoder-example.py` で再生成します（NumPy、scikit-learnが必要）。`public/data/ai/autoencoder.py` を実行し、手書き画像1437枚を64→16→64の全結合ネットワークで学習、別の360枚で復元を評価します。数字のラベルは使いません。`src/AutoencoderExample.jsx` は評価用の先頭3枚と実際の復元結果を表示し、計算値は `src/autoencoderExample.json` に記録しています。

07の `src/PoolingAndDepth.jsx` は最大プーリングの情報削減と層の図、`src/SequenceAndGanDiagrams.jsx` はRNNの隠れ状態、注意の重み付き和、ベクトル変換、TransformerのQ・K・V、GANの交互学習の図です。注意の図は既存の手設定ベクトルから計算します。RNN・GANの手順や特徴の形は模式図で、学習の実行結果とは区別します。

07の検算値は `python scripts/build-architecture-examples.py` で、配布用 `public/data/ai/architectures.py` をNumPyで実行して生成します。ブラウザーの計算と照合し、GANの勾配は有限差分でもチェックします。

## AI入門

学習資料の11番目に配置しています。`#/ai-intro`から01「現代的なAIの計算ロジック」（`#/ai-intro/systems`）へ直接進みます。章の一覧と表示枠は `src/AiIntroCourse.jsx`、本文は `src/AiSystemsLesson.jsx`。人工知能学習入門の続きとして、生成時の推論→ツールの要求と実行→ハーネス→コンテキストとRAG→検証を扱います。旧URL `#/ai/systems` も同じ章へつながります。

平均を求める6段階の操作図と `public/data/ai/harness_demo.py` は模擬モデルを使った教材で、外部のAIには接続しません。Pythonは標準ライブラリのみで実行できます。
