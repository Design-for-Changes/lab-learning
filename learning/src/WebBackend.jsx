import { useState } from 'react';
import { Section } from './Common.jsx';
import { WebCode, WebFlow, WebTable } from './WebShared.jsx';

const routes = [
  { request: 'GET /articles/12', route: 'GET /articles/:id', handler: '記事ページをつくる処理', data: 'idが12の公開記事を読む', response: '200 OK → text/html', detail: '見出しや本文をHTMLに組み込み、ページを返す。' },
  { request: 'GET /api/articles/12', route: 'GET /api/articles/:id', handler: '記事データを取得する処理', data: 'idが12の公開記事を読む', response: '200 OK → application/json', detail: '記事の値をJSONで返す。画面への反映はフロントエンドが行う。' },
  { request: 'POST /api/articles', route: 'POST /api/articles', handler: '記事を新規作成する処理', data: '入力と権限を確認して、記事の行を追加する', response: '201 Created → application/json', detail: '作成した記事のIDなどを返す。送る見出しや本文は要求のボディーに入れる。' },
  { request: 'PATCH /api/articles/12', route: 'PATCH /api/articles/:id', handler: '記事の一部を更新する処理', data: '入力と権限を確認して、idが12の記事を更新する', response: '200 OK → application/json', detail: '更新後の内容をJSONで返す。GETと同じパスでも、メソッドが違えば処理が変わる。' },
];

function RoutingExplorer() {
  const [selected, setSelected] = useState(0);
  const item = routes[selected];
  return <figure className="web-figure">
    <figcaption><strong>要求を切り替えて、呼び出す処理を見る</strong><span>記事を管理するサーバーのルーティング例。ここでは通信や保存を実行せず、対応関係を表示します。</span></figcaption>
    <div className="web-controls">{routes.map((route, i) => <button key={route.request} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{route.request}</button>)}</div>
    <div aria-live="polite" aria-atomic="true">
      <WebFlow steps={[
        ['届いた要求', item.request],
        ['ルートに対応させる', item.route + ' に一致する。' + (selected === 2 ? 'このルートには記事IDの指定がない。' : ':id は、この例では12を受け取る場所。')],
        [item.handler, item.data],
        ['応答を返す', item.response + '。' + item.detail],
      ]}/>
    </div>
  </figure>;
}

export default function WebBackend() { return <>
  <Section id="languages" title="言語、実行環境、フレームワークを組み合わせる">
    <p>バックエンドのコードも、誰かが書いたプログラムです。<strong>言語</strong>で処理を記述し、その言語を動かす<strong>実行環境</strong>をサーバー側に用意します。<strong>フレームワーク</strong>を使うと、要求の振り分け、入力の検証、データベースとの連携など、共通する処理を組み立てやすくなります。</p>
    <WebTable caption="バックエンドで使う言語と道具の例" headings={['言語','実行環境','フレームワークの例']} rows={[
      ['JavaScript','Node.js','Express'],
      ['PHP','PHPの実行環境','Laravel'],
      ['Python','Pythonの実行環境','Django'],
      ['Ruby','Rubyの実行環境','Ruby on Rails'],
    ]}/>
    <p>たとえばWordPressのPHPはサーバー側で動き、処理結果のHTMLなどを返します。ブラウザは届いたHTMLを読み取ります。Node.jsを使う場合は、フロントエンドとバックエンドを同じJavaScriptで書けますが、<strong>動く場所も、保持しているデータも別</strong>です。両者はHTTPなどで値を受け渡します。</p>
    <p>データベースは、さらに別の役割を持ちます。たとえば「Python＋Django＋PostgreSQL」「PHP＋WordPress＋MySQL」のように組み合わせます。バックエンドの言語と、データの読み書きを指示するSQLも、用途が異なります。</p>
  </Section>
  <Section id="routing" title="ルーティングとは、要求を処理に対応させること">
    <p>接続先が同じサーバーでも、記事を読む、検索する、保存するでは行う処理が違います。<strong>サーバーのルーティング</strong>は、URLのパスやHTTPメソッドなどから、実行する処理を決める仕組みです。対応する処理を<strong>ハンドラー</strong>と呼びます。</p>
    <RoutingExplorer/>
    <p><code>/articles/12</code>というURLだからといって、サーバーに「12」というHTMLファイルがあるとは限りません。<code>/articles/:id</code>のようなルートに対応させ、受け取ったIDでデータを探し、その場でHTMLをつくることもできます。</p>
    <WebCode label="Expressで、記事データを返すルートを書く例（抜粋）">{'app.get("/api/articles/:id", async (req, res) => {\n  const article = await findPublishedArticle(req.params.id);\n  if (!article) {\n    return res.status(404).json({ error: "記事がありません" });\n  }\n  res.json(article);\n});'}</WebCode>
    <p><code>app.get</code>でGETのルートを登録し、<code>req.params.id</code>でURL内のIDを受け取ります。この例の<code>findPublishedArticle</code>は、公開記事をデータベースから探す処理として自分で用意する関数です。</p>
    <details><summary>ウェブサーバー、アプリケーション、ブラウザ側のルーティング</summary><p>NginxやApacheなどのウェブサーバーが、CSSや画像はファイルとして返し、<code>/api/</code>への要求はNode.jsなどのアプリケーションへ転送する構成もあります。背後のサービスへ要求を中継する役割を<strong>リバースプロキシ</strong>と呼びます。その先で、アプリケーションが細かいルートに対応する処理を実行します。</p><p>Reactなどを使ったサイトでは、ブラウザ側でURLに応じて画面を切り替えることもあります。これが<strong>クライアント側のルーティング</strong>です。直接そのURLを開いたときに必要なHTMLを返せるよう、サーバー側の設定も対応させます。</p></details>
  </Section>
</>; }
