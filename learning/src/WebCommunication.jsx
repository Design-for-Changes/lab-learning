import { Section } from './Common.jsx';
import { WebCode, WebFlow, WebTable } from './WebShared.jsx';

export default function WebCommunication() { return <>
  <Section id="communication" title="通信は、相手を見つけて、要求と応答を交わすこと">
    <p>ChromeやSafariなどの<strong>ブラウザ</strong>は、ウェブページを読み込み、表示・操作するアプリケーションです。ブラウザからの要求に応答するソフトウェアと、それを動かすコンピューターを、文脈に応じて<strong>サーバー</strong>と呼びます。</p>
    <p>世界中のネットワークを相互につないだ通信の土台が<strong>インターネット</strong>です。その上で、URLでページなどを指定し、HTTPという決まりでやり取りする仕組みが<strong>ウェブ</strong>です。</p>
    <WebFlow steps={[
      ['URLで、何を開くかを指定する', 'ブラウザに https://example.com/articles/12 と入力する。'],
      ['DNSで、接続先のアドレスを調べる', 'example.comというドメイン名から、接続に使うIPアドレスを得る。'],
      ['接続を確立する', '接続先と通信できる状態にする。HTTPSでは、証明書で接続先を確認し、暗号化した通信を行う。'],
      ['HTTPリクエストを送る', 'ブラウザが「/articles/12を取得したい」と要求する。'],
      ['サーバーが処理し、HTTPレスポンスを返す', '要求に合う処理を選び、必要なデータを取得して、HTMLやJSONなどを返す。'],
      ['ブラウザが表示する', 'HTMLを読み、必要なCSS・JavaScript・画像も要求する。届いた内容を使って画面をつくる。'],
    ]} caption="新しくページを開くときの基本形です。キャッシュや既存の接続を利用する場合もあります。"/>
  </Section>
  <Section id="url" title="URLは、接続先と対象を指定する">
    <p><strong>URL（Uniform Resource Locator）</strong>は、ページや画像などの対象を指定するアドレスです。次の例を分解すると、何をどこへ伝えているかが分かります。</p>
    <WebCode label="URLの例">{'https://example.com/articles/12?lang=ja#comments'}</WebCode>
    <WebTable caption="URLの各部分が表すこと" headings={['部分','名前と役割']} rows={[
      ['https','スキーム。ここではHTTPSで通信することを指定する。'],
      ['example.com','ホスト名。この例ではドメイン名で接続先を指定する。'],
      ['/articles/12','パス。サーバーに要求する対象を指定する。'],
      ['?lang=ja','クエリー。言語や検索条件などを追加で伝える。'],
      ['#comments','フラグメント。ページ内の位置などを指定する。この部分はHTTPの要求先には含めず、ブラウザ側で扱う。'],
    ]}/>
    <p><strong>DNS（Domain Name System）</strong>は、ドメイン名に対応する情報を調べる仕組みです。通信先を見つける際は、ここで<strong>IPアドレス</strong>を調べます。IPはInternet Protocolの略で、IPアドレスはネットワーク上で送信元や宛先を識別するためのアドレスです。</p>
    <p>DNSが調べるのは、主に「どこへ接続するか」です。<code>/articles/12</code>を受け取って「どの記事を返すか」を決めるのは、接続先のサーバーです。この振り分けを04で<strong>ルーティング</strong>として扱います。</p>
    <details><summary>ポート番号と、データが届く経路</summary><p>同じコンピューターでも、複数のサービスを動かせます。<strong>ポート番号</strong>は通信先のサービスを区別するために使います。HTTPSでは通常443番を使い、URLで省略できます。開発時には<code>http://localhost:3000/</code>のように明示することがあります。localhostは、自分のコンピューターを指す名前です。</p><p>通信するデータは<strong>パケット</strong>に分けられ、途中のルーターが宛先に向けて転送します。HTTP/1.1やHTTP/2はTCP、HTTP/3はQUICを使ってデータをやり取りします。サーバー内で処理を選ぶルーティングとは、扱っている段階が異なります。</p></details>
  </Section>
  <Section id="http" title="HTTPは、要求と応答の形式を決める">
    <p><strong>HTTP（Hypertext Transfer Protocol）</strong>は、ブラウザとサーバーが要求と応答を交わすための通信規約です。<strong>HTTPS</strong>では、HTTPの通信を<strong>TLS（Transport Layer Security）</strong>で保護し、盗み見や改ざんを防ぎます。</p>
    <div className="web-two-columns">
      <WebCode label="リクエスト：記事を取得したい">{'GET /api/articles/12 HTTP/1.1\nHost: example.com\nAccept: application/json'}</WebCode>
      <WebCode label="レスポンス：取得できたので内容を返す">{'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{ "id": 12, "title": "展示のお知らせ" }'}</WebCode>
    </div>
    <p><strong>メソッド</strong>は、どの種類の操作を要求するかを示します。<code>GET</code>は取得、<code>POST</code>はデータを送って処理を求めるときなどに使います。<strong>ヘッダー</strong>にはデータ形式などの付加情報、<strong>ボディー</strong>には送る内容を入れます。上のGETの要求にはボディーがなく、応答のボディーに記事データがあります。</p>
    <p>応答の<strong>ステータスコード</strong>は処理結果を表します。<code>200</code>は成功、<code>400</code>は要求の不備、<code>404</code>は対象が見つからない、<code>500</code>はサーバー内部のエラーです。JSONはデータを表す形式で、04でAPIとともに説明します。</p>
    <p>HTMLを取得してページ全体を開くときも、JavaScriptの<code>fetch</code>で必要なデータだけを取得するときも、この要求と応答が使われます。</p>
  </Section>
</>; }
