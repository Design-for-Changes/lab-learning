import { Section, Next } from './Common.jsx';
import { WebHeading, WebReading, WebFlow, WebCode, WebTable } from './WebShared.jsx';
import { RequestExplorer, DocumentExplorer, JavaScriptExplorer, RelationalExplorer, CmsExplorer } from './WebExplorers.jsx';
import WebCommunication from './WebCommunication.jsx';
import WebBackend from './WebBackend.jsx';
import WebPractice from './WebPractice.jsx';
import './web.css';
export { webLinks, webAliases, resolveWebRoute } from './webContent.js';

function Overview() { return <>
  <WebHeading number="01" title="フロントエンドとバックエンド"/>
  <Section title="画面の向こうで、何が動いているのか">
    <p>研究室のウェブサイトで記事を読む。編集画面で新しい記事を書く。このとき、画面の表示、入力の処理、記事の保存は、複数の仕組みが連携して行っています。</p>
    <p><strong>フロントエンド</strong>は、利用者に見える画面や操作を担う部分です。<strong>バックエンド</strong>は、要求の処理やデータの読み書きなどを担う部分です。まずは「ブラウザで行うこと」と「サーバーで行うこと」を分けて見ると、役割をつかめます。</p>
    <p>画面の土台になる文書は、<strong>HTML（HyperText Markup Language）</strong>で記述します。見出しや段落に目印を付け、リンクで別の文書につなげられる言語です。次の図では、サーバーが記事のHTMLをつくり、ブラウザへ返す流れを見ます。</p>
    <RequestExplorer/>
  </Section>
  <WebCommunication/>
  <Section title="画面を変える処理と、記録を残す処理">
    <div className="concept-pair"><article><h3>ブラウザだけでできること</h3><p>メニューを開く、文字色を変える、入力中の記事をプレビューする。画面上の変化は、サーバーに通信せず行うこともできます。</p></article><article><h3>サーバーと連携すること</h3><p>保存済みの記事を探す、編集権限を確認する、ほかの人にも見えるよう記事を保存する。バックエンドが共通のデータを扱います。</p></article></div>
    <p>管理画面も、編集者がブラウザで使うフロントエンドです。「管理者用だからバックエンド」という分け方では、実際に処理が動く場所を見失います。</p>
    <p>ここから、画面をつくるHTML・CSS・DOM、操作を扱うJavaScript、データを扱うバックエンドとデータベースへ進みます。それらを組み合わせたCMSを理解し、最後にインタラクションの実装と、表現を支えるライブラリを見ていきます。</p>
  </Section>
  <WebReading ids={['web','url','http','tls','http3','server']}/>
  <Next href="/web/document" label="02　HTML・CSS・DOMへ進む"/>
</>; }

function Document() { return <>
  <WebHeading number="02" title="HTML・CSS・DOM"/>
  <Section id="html" title="HTMLとは、文書の意味と構造を記述する言語">
    <p><strong>HTMLは、HyperText Markup Languageの略</strong>です。「リンクでつながる文書に、意味や構造を示す目印を付ける言語」と考えると、名前と役割がつながります。</p>
    <WebTable caption="HTMLという名前の意味" headings={['言葉','意味']} rows={[
      ['HyperText（ハイパーテキスト）','リンクをたどって、別の文書や文書内の位置へ移動できるテキスト。'],
      ['Markup（マークアップ）','「ここは見出し」「ここは段落」など、内容の役割や構造を示す目印を付けること。'],
      ['Language（言語）','その目印や文書の構造を、共通の規則に従って記述するための言語。'],
    ]}/>
    <WebCode label="記事の構造とリンクを記述したHTML">{'<article class="news">\n  <h2>展示のお知らせ</h2>\n  <p>9月の研究室展を開催します。</p>\n  <a href="/articles/12">記事を読む</a>\n</article>'}</WebCode>
    <p><code>&lt;h2&gt;</code>は見出し、<code>&lt;p&gt;</code>は段落を示す<strong>タグ</strong>です。たとえば<code>&lt;p&gt;本文&lt;/p&gt;</code>は、開始タグ、内容、終了タグを合わせて一つの<strong>要素</strong>になります。ブラウザはこの目印を読み取り、文書の構造を解釈します。</p>
    <p><code>&lt;a href="/articles/12"&gt;</code>はリンクです。<code>href</code>で移動先を指定します。こうした要素への追加情報を<strong>属性</strong>と呼びます。<code>class="news"</code>も属性で、この例では記事にnewsというクラス名を付けています。</p>
  </Section>
  <Section id="css" title="CSSとは、文書の見た目を指定する言語">
    <p><strong>CSSは、Cascading Style Sheetsの略</strong>です。文字の色や大きさ、余白、配置など、文書の表示方法を記述します。<strong>Style Sheets（スタイルシート）</strong>は、こうした表示の指定をまとめたものです。</p>
    <p><strong>Cascading（カスケーディング）</strong>は、複数のスタイル指定が重なったときに、規則に従ってどの指定を使うかを決める仕組みを指します。ブラウザが持つ標準の見た目に、サイト側などの指定が重なって、実際の表示が決まります。</p>
    <WebCode label="newsというクラスの記事で、見出しを赤くするCSS">{'.news h2 {\n  color: #cc2939;\n}'}</WebCode>
    <p><code>.news h2</code>は、newsというクラスを持つ要素の中からh2を選ぶ<strong>セレクター</strong>です。<code>color</code>が変更する項目、<code>#cc2939</code>が指定する色です。HTMLで付けた構造や属性を手がかりに、見た目を指定します。</p>
  </Section>
  <Section id="dom" title="DOMとは、文書を要素のつながりとして扱う仕組み">
    <p><strong>DOMは、Document Object Modelの略</strong>です。<strong>Document</strong>は文書、<strong>Object</strong>はプログラムから扱える対象、<strong>Model</strong>はその表し方を指します。文書を、プログラムで調べたり変更したりできる形で表す仕組みです。</p>
    <p>ブラウザはHTMLの文字列を読み取り、要素や文字を親子関係でつないだ構造をメモリー上につくります。たとえば「articleの中にh2とpがある」という関係です。JavaScriptから、この構造を調べたり、見出しの文字や要素の並びを変更したりできます。</p>
    <DocumentExplorer/>
    <p>HTMLを読み込んだ後にJavaScriptで見出しを書き換えると、現在のDOMと表示が変わります。ブラウザの「ページのソースを表示」と、開発者ツールの「要素」で見える内容が異なることがあるのは、このためです。</p>
  </Section>
  <Section title="ブラウザは、構造とスタイルから画面をつくる">
    <WebFlow steps={[
      ['HTMLを読み、DOMをつくる','見出しや段落、画像などの要素を親子関係として扱う。'],
      ['CSSの指定を当てはめる','どの要素に、どのスタイルを適用するかを決める。'],
      ['大きさと位置を計算する','画面の幅、文字の量、余白などから配置を決める。'],
      ['画面に描く','文字、線、背景、画像などを描画する。'],
    ]} caption="表示処理を大まかに整理した図です。要素やスタイルの変更に応じて、必要な処理が再び行われます。"/>
    <p>画面幅に応じて段組みや余白を変える<strong>レスポンシブデザイン</strong>も、CSSで実現できます。見出し・リンク・ボタンには、それぞれ適切なHTML要素を使います。構造の情報は、画面読み上げやキーボード操作にも関わります。</p>
  </Section>
  <WebReading ids={['html','css','dom']}/><Next href="/web/javascript" label="03　JavaScriptとフレームワークへ進む"/>
</>; }

function JavaScript() { return <>
  <WebHeading number="03" title="JavaScriptとフレームワーク"/>
  <Section id="scripting" title="JavaScriptとは、処理を記述して動かすスクリプト言語">
    <p><strong>JavaScript（JS）は、1995年にNetscapeで開発されたスクリプト言語</strong>です。スクリプト言語は、ブラウザなどの実行環境が提供する機能を利用し、一連の処理を記述して動かすためのプログラミング言語の一種です。</p>
    <p><strong>Script</strong>には「台本」という意味があり、ここでは処理の指示を書いたプログラムを指します。ウェブでは、ページと一緒に読み込んだスクリプトを、ブラウザ内の<strong>JavaScriptエンジン</strong>が実行します。たとえば「ボタンが押されたら、本文を表示する」という処理を記述できます。</p>
    <WebTable caption="JavaScriptになるまでの名前" headings={['時期','名前','使われた場面']} rows={[
      ['1995年・開発時','Mocha（モカ）','初期の開発で使われた名前。'],
      ['1995年9月','LiveScript（ライブスクリプト）','Netscape Navigator 2.0の最初の公開ベータ版に搭載されたときの名前。'],
      ['1995年12月','JavaScript（ジャバスクリプト）','NetscapeとSunが、この名称で発表した。'],
    ]}/>
    <details><summary>スクリプトは、どう実行されるのか</summary><p>実行エンジンがコードを読み取り、処理を実行します。現在の多くのJavaScriptエンジンは、コードを解釈して実行する方法と、実行時に機械語へ変換する<strong>JITコンパイル</strong>などを組み合わせて高速化します。</p></details>
  </Section>
  <Section title="JavaScriptは、操作に応じた処理を記述する">
    <p>記事の本文を開く、入力した見出しをプレビューする、検索結果を取得する。こうした処理を書くプログラミング言語が<strong>JavaScript</strong>です。ブラウザが提供するDOMや通信の機能を、JavaScriptから利用します。</p>
    <p>クリックや文字入力などが起きたという通知を<strong>イベント</strong>と呼びます。イベントを受け取って実行する処理を登録しておくと、操作に応じて表示を変えられます。「開いているか」など、処理が覚えておく現在の値が<strong>状態（state）</strong>です。</p>
    <JavaScriptExplorer/>
  </Section>
  <Section title="画面が複雑になると、部品と状態をまとめて扱う">
    <p>CMSの編集画面には、記事一覧、入力欄、保存ボタン、プレビューなどがあります。変更のたびに、画面のどこを書き換えるかを個別に管理すると、表示の食い違いが起こりやすくなります。</p>
    <p>そこで、見た目と振る舞いを<strong>コンポーネント</strong>という部品にまとめ、状態に応じて表示を更新する道具を使います。ライブラリーやフレームワークは、こうした共通の処理や、コードの組み立て方を提供します。</p>
    <WebTable caption="画面づくりを支える代表的な道具" headings={['名前','どんな道具か','仕組みをつかむポイント']} rows={[
      ['React','UIをつくるライブラリー','コンポーネントを組み合わせ、状態に応じた表示を記述する。'],
      ['Vue','UIをつくるフレームワーク','HTMLに近いテンプレートで、データと表示の関係を記述する。'],
      ['Svelte','コンパイラーを用いるUIフレームワーク','書いたコンポーネントを、ブラウザで動くコードへ変換する。'],
      ['Angular','アプリケーションを構成するフレームワーク','コンポーネントに加え、画面遷移やフォームなどの仕組みも備える。'],
    ]}/>
    <p>書き方や更新の仕方は違いますが、ウェブの画面ではHTML・CSS・JavaScriptとブラウザの機能が土台になります。部品として書いた見出しやボタンも、最終的にはブラウザが表示・操作できる形になります。</p>
  </Section>
  <Section title="画面づくりから、サイト全体を組み立てる道具へ">
    <p>記事一覧と個別記事を別のURLで開く、サーバーでデータを取得する、HTMLをつくる。サイト全体には、画面の部品以外の仕組みも必要です。</p>
    <div className="concept-pair"><article><h3>React → Next.js</h3><p>Reactを使った画面づくりに、URLごとのページ、サーバーでの処理、配信に向けた仕組みなどを組み合わせます。</p></article><article><h3>Vue → Nuxt</h3><p>Vueを使った画面づくりに、ページの構成やサーバー側での表示処理などを組み合わせます。</p></article></div>
    <p>フレームワークには、ブラウザ側とサーバー側の両方を扱うものがあります。「どの名前の道具か」に加えて、<strong>その処理は、どこで動くのか</strong>を確認します。</p>
    <details><summary>ビルド、Node.js、TypeScriptは何か</summary><p><strong>ビルド</strong>は、部品やスタイルなどのソースを、配信・実行できる形に変換する工程です。<strong>Node.js</strong>は、ブラウザの外でJavaScriptを動かす実行環境で、開発用の道具やバックエンドにも使われます。<strong>TypeScript</strong>はJavaScriptに型の記述などを加えた言語です。ブラウザ向けの開発では、通常JavaScriptへ変換して使います。</p></details>
  </Section>
  <Section title="サーバーとのやり取りを待ちながら、画面を動かす">
    <p>検索ボタンを押したら「読み込み中」と表示し、結果が届いたら記事一覧を更新する。通信の完了を待つ間にもほかの処理を進める、このような扱いを<strong>非同期処理</strong>と呼びます。</p>
    <WebFlow steps={[
      ['操作を受け取る','検索語を読み取り、読み込み中の表示にする。'],
      ['サーバーへデータを要求する','JavaScriptのfetchなどでHTTPリクエストを送る。'],
      ['結果に応じて状態を変える','届いた記事データを持たせる。失敗した場合はエラーの状態にする。'],
      ['画面に反映する','記事一覧、該当なし、再試行など、その状態に合った表示にする。'],
    ]}/>
  </Section>
  <WebReading ids={['jsHistory','scripting','events','state','react','vue','svelte','angular','next','nuxt','node','fetch','typescript']}/><Next href="/web/database" label="04　バックエンドとデータベースへ進む"/>
</>; }

function Database() { return <>
  <WebHeading number="04" title="バックエンドとデータベース"/>
  <Section title="バックエンドは、要求を受けてデータを扱う">
    <p>CMSで「保存」を押すと、見出しや本文がサーバーに送られます。バックエンドは、編集する権限があるか、入力内容が条件を満たしているかを確かめ、データベースへの保存を行います。</p>
    <p><strong>API（Application Programming Interface）</strong>は、プログラムからデータや機能を利用するための窓口です。ウェブでは、URLや要求の方法、送るデータ、返すデータなどを決めておくことで、フロントエンドとバックエンドが連携します。</p>
    <WebCode label="記事を取得するAPIの例：要求と応答（架空の形式）">{'GET /api/articles/12\n\n200 OK\n{\n  "id": 12,\n  "title": "展示のお知らせ",\n  "author_id": 7\n}'}</WebCode>
    <p>この応答で使っている<strong>JSON（JavaScript Object Notation）</strong>は、名前と値の組などでデータを表す形式です。JavaScript以外の言語でも利用できます。フロントエンドは、受け取ったタイトルなどを使って画面を更新できます。</p>
  </Section>
  <WebBackend/>
  <Section title="リレーショナルデータベースは、データを表として扱う">
    <p>記事が100件になったら、見出し、本文、著者、公開状態などを、決められた項目で保存すると扱いやすくなります。<strong>リレーショナルデータベース（RDB）</strong>では、データを行と列からなる<strong>テーブル</strong>として扱います。</p>
    <WebTable caption="記事のデータを読むための基本用語" headings={['用語','この例での意味']} rows={[
      ['テーブル（表）','articlesという、記事をまとめた表。'],
      ['行（レコード）','記事12「展示のお知らせ」など、一件分のデータ。'],
      ['列（カラム）','id、title、author_idなど、データの項目。'],
      ['主キー','その行を一意に識別するキー。この例ではid。'],
      ['外部キー','別の表のキーを参照する項目。この例では著者を指すauthor_id。'],
    ]}/>
    <p>たとえば、記事ごとに著者名を何度も保存すると、改名の際に修正漏れが起きます。著者の表を分け、記事には著者IDを持たせれば、名前の管理を一か所にまとめられます。RDBには、PostgreSQL、MySQL、SQLiteなどがあります。</p>
  </Section>
  <Section title="キーで結び、必要なデータを取り出す">
    <p>下の例では、記事の<code>author_id</code>と著者の<code>id</code>を対応させます。一人の著者に複数の記事が対応するので、<strong>1対多</strong>の関係です。表を結びつけて結果を得る操作を<strong>結合（JOIN）</strong>と呼びます。</p>
    <RelationalExplorer/>
    <p><strong>SQL</strong>は、データの取得や追加・更新などを記述する言語です。この例の<code>SELECT</code>は取り出す列、<code>FROM</code>は元の表、<code>JOIN … ON</code>は結合する表と条件、<code>WHERE</code>は絞り込み条件を表します。</p>
    <details><summary>記事にタグを付けると、どんな関係になるか</summary><p>一つの記事に複数のタグが付き、一つのタグも複数の記事に付くなら、<strong>多対多</strong>の関係です。たとえば記事表、タグ表に加えて、記事IDとタグIDの組を保存する中間テーブルを置きます。</p></details>
  </Section>
  <Section title="入力欄、保存先、利用者の権限をつなぐ">
    <WebFlow steps={[
      ['フロントエンドで入力する','見出しや著者を選び、バックエンドへ保存を要求する。'],
      ['バックエンドで確認する','誰からの要求か、この記事を編集できるか、必須項目があるかを確認する。'],
      ['データベースに保存する','記事の行を追加・更新する。主キーや外部キーの制約も、データの整合性を守る。'],
      ['結果をフロントエンドへ返す','保存できたかどうかを返し、画面に結果を表示する。'],
    ]}/>
    <p>ログイン中の利用者を識別する方法の一つが、CookieでセッションIDを送り、サーバー側のログイン情報と照合する方式です。画面に編集ボタンを出すかどうかに加えて、バックエンドでも権限を確認します。</p>
  </Section>
  <WebReading ids={['server','node','php','laravel','django','rails','routing','proxy','relational','keys','joins','rest','cookies']}/><Next href="/web/cms" label="05　CMSの仕組みへ進む"/>
</>; }

function Cms() { return <>
  <WebHeading number="05" title="CMSの仕組み"/>
  <Section title="CMSとは、コンテンツの編集・管理・公開を支える仕組み">
    <p><strong>CMS（Content Management System）</strong>は、記事などの内容を編集し、保存し、公開するための仕組みです。ここまでに見た、画面、入力処理、データベース、表示の組み立てが一つにつながります。</p>
    <WebTable caption="CMSの中で、各技術が担うこと" headings={['編集者・読者がすること','働いている仕組み']} rows={[
      ['管理画面で記事を書く','HTML・CSSで入力欄を表示し、JavaScriptで操作やプレビューを扱う。'],
      ['下書きを保存する','バックエンドが入力と権限を確認し、内容をデータベースに保存する。'],
      ['記事を公開する','公開状態や公開対象の版を管理し、読者が取得できるようにする。'],
      ['読者が記事を開く','公開内容と表示の型を組み合わせ、ブラウザが画面に表示する。'],
    ]}/>
  </Section>
  <Section title="画面で編集した内容が、読者に届くまで">
    <CmsExplorer/>
    <p>編集画面に文字が見えていること、保存されていること、公開されていること、読者がその版を取得したことは、それぞれ違う状態です。表示されない原因を考えるときにも、<strong>どこまで処理が進んでいるか</strong>を分けて見ます。</p>
  </Section>
  <Section title="内容と表示の型を組み合わせる">
    <p>「見出しはここ、著者名はその下、本文はこの幅で表示する」という型を<strong>テンプレート</strong>と呼びます。同じ型に異なる記事データを入れることで、記事ごとにHTMLを手作業で書き直さずに済みます。</p>
    <WebFlow steps={[
      ['記事データ','記事12の見出し・本文・著者などを取得する。'],
      ['テンプレート','各値を、記事ページの見出しや本文に対応する場所へ入れる。'],
      ['ブラウザの表示','HTMLを読み取り、DOMとCSSから記事の画面を表示する。'],
    ]}/>
    <p>たとえば<strong>WordPress</strong>では、サーバーでPHPが動き、MySQLまたはMariaDBを使います。表示の型やスタイルをまとめたものが<strong>テーマ</strong>です。記事を変える作業と、複数の記事に共通する表示を変える作業を分けて扱えます。</p>
  </Section>
  <Section title="CMSが画面までつくるか、データを渡すか">
    <div className="web-cms-architectures">
      <article><h3>CMS側でHTMLをつくる構成</h3><WebFlow steps={[
        ['CMSが内容を取得する','データベースから、公開記事のデータを読み出す。'],
        ['CMSのテンプレートでHTMLをつくる','テーマなどに沿って、記事のページを組み立てる。'],
        ['ブラウザが表示する','届いたHTMLとCSSを使って描画し、JavaScriptが操作を扱う。'],
      ]}/></article>
      <article><h3>ヘッドレスCMSを使う構成</h3><WebFlow steps={[
        ['CMSが内容を管理する','編集・保存・公開状態を管理する。'],
        ['APIで記事データを渡す','別に用意したウェブサイトやアプリが内容を取得する。'],
        ['受け取った側で表示をつくる','ReactやVueなどでつくったサイトにも、同じ内容を利用できる。'],
      ]}/></article>
    </div>
    <p><strong>ヘッドレスCMS</strong>は、コンテンツの管理と、読者向け画面の実装を分けて利用する方式です。WordPressもREST APIで記事データを渡せるため、こうした構成で利用できます。</p>
    <p>記事データからHTMLをつくる場所とタイミングにも選択肢があります。あらかじめ生成して配信する、要求のたびにサーバーでつくる、ブラウザがデータを取得して表示を更新する、といった方法を組み合わせられます。</p>
    <p>CMSの仕組みを見るときは、「誰がどの画面で編集するか」「どこに保存するか」「どこで表示を組み立てるか」をたどると、フロントエンド、バックエンド、データベースの役割がつながります。</p>
  </Section>
  <WebReading ids={['editor','posts','requirements','templates','rest']}/><Next href="/web/practice" label="06　実際にインタラクションを実装するには？へ進む"/>
</>; }

const pages = { '/web/overview': Overview, '/web/document': Document, '/web/javascript': JavaScript, '/web/database': Database, '/web/cms': Cms, '/web/practice': WebPractice };
export default function WebCourse({ route }) {
  const Page = pages[route];
  return Page ? <Page/> : <><h1>ページが見つかりません</h1><Next href="/web/overview" label="ウェブインタラクション入門に戻る"/></>;
}
