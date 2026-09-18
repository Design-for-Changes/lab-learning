# 動態デザイン研究室の研究ガイド・学習資料

ひとつのリポジトリから、独立した2つのディレクトリをGitHub Pagesへ公開します。

| ディレクトリ | 内容 | 公開先 |
| --- | --- | --- |
| `research/` | 研究ガイド、InDesign・Wordによる論文作成ガイド | https://design-for-changes.github.io/lab-learning/research/ |
| `learning/` | 既存の学習資料・統計解析入門 | https://design-for-changes.github.io/lab-learning/learning/ |

研究ガイドは01の本文から始まる全5章です。05「AIと一緒につくる」は、ローカルの研究ノートを学生とAIが更新し、ゼミ後にZIPをNotionへ提出する運用を扱います。AI向けマニュアルは [サイト内のページ](https://design-for-changes.github.io/lab-learning/research/ai/manual/) で全文を読めます。各章にはサイドメニューから移動できます。InDesign・Wordの操作は「学生による補足ノート」の「論文を作成する前の準備」「いざ論文を書く」に統合しています。「いざ論文を書く」はNotionでの資料整理・原稿作成から始まり、InDesignでの組版へ進みます。旧 `research/indesign/` 以下のURLは該当箇所へ転送します。公開ルートは学習資料へ転送し、既存のハッシュ付き統計教材URLを引き継ぎます。

## ローカルで確認

Node.js 24以降を推奨します。ルートで実行してください。

```sh
npm ci
npm run check
npm run build
npm run dev
```

- 研究ガイド：http://127.0.0.1:4179/lab-learning/research/
- 論文作成：http://127.0.0.1:4179/lab-learning/research/notes/
- 学習資料：http://127.0.0.1:4179/lab-learning/learning/

`npm run dev` は両サイトをビルドして静的な確認用サーバーを起動します。変更後は再ビルドしてください。学習資料だけの開発は `npm run dev:learning` で行います。

## 編集と公開

- `research/content/research.notion.md`：研究ガイド本文。InDesign・Wordの操作説明と05の学生向け依頼文もここで編集します。
- `research/public/downloads/for-ai.md`：研究の整合性を批判的に検討し、学生との対話で研究ノート・ゼミ資料・計画を更新するAI向けマニュアル。Markdownを正本としてサイトの全文ページも生成します。
- `docs/archive/indesign-before-merge.md`：統合前の操作ガイドの編集原稿。
- `research/scripts/document-pages.mjs`：AIマニュアルと補助文書の公開ページ・全文コピーを同じMarkdownから生成します。
- `research/scripts/navigation.mjs`：章のタイトル・説明・公開パス。
- `research/scripts/build.mjs`：本文を静的HTMLへ変換します。
- `research/scripts/indesign-redirects.mjs`：旧InDesignページとアンカーの転送先。
- `research/public/`：研究ガイド本文のCSS・画像・開閉処理。共通のデザインは `learning/src/style.css` をビルド時に読み込みます。
- `learning/`：既存のReact/Viteアプリ。教材本文・図の計算・解析選択は維持しています。
- `scripts/assemble.mjs`：2つのビルドを `dist/research/` と `dist/learning/` へ集めます。

公開文書のバージョンと更新日は各Markdown冒頭で管理し、HTML表示・全文コピーへ引き継ぎます。仕様セットを改訂するときは4文書の版を揃え、同日内も末尾番号を進めます。更新日・参照日・ゼミ日は区別します。

`main`へのpush時にGitHub Actionsがチェック・ビルドし、ルートの`dist/`のみを公開します。現在のVite baseは `/lab-learning/learning/` です。Notionの原本や非公開エクスポートは公開ディレクトリに含めません。

移行時の原本・変更点・取得できない添付資料については [移行記録](docs/migration.md) を参照してください。
