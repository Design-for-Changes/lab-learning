# 動態デザイン研究室 学習資料

研究に必要な知識を学ぶためのポータルと、Reactでつくったインタラクティブ教材です。

公開先：<https://design-for-changes.github.io/lab-learning/learning/>

## 教材

現在の教材は **統計解析入門** です。

1. 統計解析とデータの基礎：記述と推測、母集団・標本、平均とばらつき、標準誤差、外れ値、ヒストグラムから確率密度、代表的な確率分布。
2. 推定と検定：一人ずつの差とばらつきから、カテゴリー別の観測値と母集団モデルの図、帰無仮説へ。等分散の比較図とF検定を先に学び、t検定、12人の検定結果、t分布の面積からp値を読む。その後に信頼区間、一元配置・二元配置分散分析の結果表と読み方。ヒストグラム・Q–Qプロット・残差の例と、計算から考察までの例題。
3. データと変数：目的変数・説明変数、目的変数を置かない解析、尺度、対応と独立、直線・頭打ち・U字・波の図から線形と非線形を考える。
4. 実験計画法：目的から確認実験までの6手順。完全要因計画の負担から、直交表で実験数を減らす考え方へ。L4の行列の読み方、2列の釣り合い、行平均の計算、見分けられなくなる効果を、同じ画面の実験で学ぶ。代表的な直交表の一覧と、L4・L8の線点図で列への割り付けを説明する。24人の架空データから主効果・交互作用・三元配置分散分析を計算し、CSVとPython実行例も用意する。
5. 解析を選ぶ・調べる：多変量解析と条件比較の選択樹形図だけを、タブを使わず続けて表示。一元配置・二元配置・多元配置を具体例で区分し、数量化理論I〜IV類を含む26手法の詳しい解説へ進む。
6. 解析の注意点：「やってはいけないこと」「注意するべきこと」。各項目の理由・具体例・確認方法と、多重共線性への対処。
7. 実施する方法：統計ソフト・表計算・Python・Rの無料／有料／条件付き無料の区分、Pythonのライブラリ一覧と実行環境。

各章は入門の説明と一覧を基本とし、図やAIへの質問例を補助に置いています。Pythonの実習は「実施する方法」から開く練習例として残しています。

平均と中央値、対応する測定値、PCAの軸、ヒストグラムの密度への換算と推定曲線、正規分布の面積、一元配置分散分析、交互作用、直交表、説明変数の相関とVIFを操作できる図を含みます。教材の図とCSVは架空の例で、個人データを含みません。解析選択は候補を検討するための入口であり、すべての研究設計を網羅するものではありません。

学習資料は統計解析入門の次に「人工知能学習入門」を配置しています。人工知能学習入門は準備中です。ほかにマネジメント入門、進化生物学入門、脳科学入門、心理学入門、デザイン学入門、科学入門、経済学入門、ウェブインタラクション入門も準備中として配置しています。

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
- `public/data/`：練習用CSV、Pythonコード、Colabノート

Pythonの確認用コードを変えた場合は、ノート内の確認用コードも更新します。教材の数値はSciPyによる対応のあるt検定で確認しています。

## 補助機能の検証状況

05はチャート表示に絞ったため、旧選択フォームとWebMCPツールの登録は行いません。Colab画面での実行は未検証で、計算コードはローカルのPython環境で確認しています。

デスクトップ幅・スマートフォン幅で、主要ページの表示と横にはみ出さないことを確認しています。正規分布の区間変更、多重共線性の相関スライダー、解析選択の操作もブラウザーで確認しています。

## 手法別の入力・出力・Python例

26手法の各ページは、必要な列と入力表、実際にPythonで得た出力、結果の読み方、AIへの依頼例、確認用の実行コードの順で構成しています。`src/methodGuides.js`が解説、`src/methodExampleResults.json`が実行結果、`public/data/method-examples/`がCSVとPythonコードです。例はすべて架空データであり、人数は必要標本数の目安ではありません。

例の元コードを変更する場合は、必要なPython依存関係を入れた環境で `python scripts/build-method-examples.py` を学習アプリのディレクトリから実行し、出力を再生成してください。使用バージョンは生成JSONと各ページに記録します。`npm run check --workspace learning` はコード・CSV・生成結果の整合と全ページを確認します。
