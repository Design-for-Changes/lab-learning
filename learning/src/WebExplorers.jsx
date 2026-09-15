import { useId, useReducer, useState } from 'react';
import { requestSteps } from './webContent.js';
import { WebCode, WebTable } from './WebShared.jsx';
import { sampleAuthors, sampleArticles, joinedArticles, articleQuery, initialCmsState, cmsHasChanges, cmsReducer } from './webModels.js';

export function RequestExplorer() {
  const [step, setStep] = useState(0);
  const [title, location, detail, active] = requestSteps[step];
  return <figure className="web-figure">
    <figcaption><strong>記事を開くと、どこで何が起きるか</strong><span>サーバーがHTMLをつくる構成の例</span></figcaption>
    <div className="web-network">
      <div className="web-node" data-active={active.includes(0)}><span className="web-label">利用者の端末</span><strong>ブラウザ</strong><p>フロントエンド<br/>表示する・操作を受ける</p></div>
      <div className="web-wire"><span>要求 <b>→</b></span><span><b>←</b> 応答</span></div>
      <div className="web-node" data-active={active.includes(1)}><span className="web-label">サービスのサーバー</span><strong>バックエンド</strong><p>要求を処理する<br/>データを選ぶ・HTMLをつくる</p></div>
      <div className="web-wire"><span>問合せ <b>→</b></span><span><b>←</b> 結果</span></div>
      <div className="web-node" data-active={active.includes(2)}><span className="web-label">データの保存先</span><strong>データベース</strong><p>記事・著者などを<br/>保存する・取り出す</p></div>
    </div>
    <div className="web-controls" role="group" aria-label="記事を表示する手順">{requestSteps.map(([label], i) => <button key={label} type="button" aria-pressed={step === i} onClick={() => setStep(i)}>{i + 1}<span className="visually-hidden">　{label}</span></button>)}</div>
    <div className="web-step-detail" aria-live="polite"><span className="web-label">{location}</span><h3>{step + 1}. {title}</h3><p>{detail}</p></div>
    <div className="web-controls"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>前の手順</button><button type="button" disabled={step === requestSteps.length - 1} onClick={() => setStep(step + 1)}>次の手順 →</button></div>
  </figure>;
}

const originalTitle = '展示のお知らせ';
const htmlExample = '<article class="news">\n  <h2>展示のお知らせ</h2>\n  <p>9月の研究室展を開催します。</p>\n</article>';
export function DocumentExplorer() {
  const [styled, setStyled] = useState(true);
  const [changed, setChanged] = useState(false);
  const title = changed ? '研究室展、開催中です' : originalTitle;
  return <figure className="web-figure">
    <figcaption><strong>HTML・DOM・表示を見比べる</strong><span>CSSの切替と、JavaScriptによる見出しの変更を試せます。</span></figcaption>
    <div className="web-controls"><label><input type="checkbox" checked={styled} onChange={e => setStyled(e.target.checked)}/> CSSを適用する</label><button type="button" aria-pressed={changed} onClick={() => setChanged(!changed)}>{changed ? '元の見出しに戻す' : 'JSで見出しを変更する'}</button></div>
    <WebCode label="受け取ったHTML（変更しない）">{htmlExample}</WebCode>
    <div className="web-two-columns">
      <div><span className="web-label">現在のDOM（要素と文字に絞った図）</span><ul className="web-tree"><li><code>article.news</code><ul><li><code>h2</code><span data-changed={changed}>「{title}」</span></li><li><code>p</code><span>「9月の研究室展を開催します。」</span></li></ul></li></ul></div>
      <div><span className="web-label">ブラウザの表示結果</span><div className="web-browser-frame"><article className="web-browser-sample" data-styled={styled}><h2>{title}</h2><p>9月の研究室展を開催します。</p></article></div></div>
    </div>
    <WebCode label={styled ? '適用中のCSS' : 'CSSを外した状態'}>{styled ? '.news { border-left: 4px solid #cc2939;\n        padding: 16px; }\n.news h2 { color: #cc2939; }' : '/* この記事に指定したCSSは適用しない */'}</WebCode>
    <p className="web-explanation" aria-live="polite">{changed ? '見出しの変更は、現在のDOMと表示に反映されています。受け取ったHTMLの文字列は変わっていません。' : 'HTMLを読み取ってDOMができ、その内容にCSSを適用した結果が画面に表示されます。'}</p>
  </figure>;
}

export function JavaScriptExplorer() {
  const [open, setOpen] = useState(false);
  const [codeMode, setCodeMode] = useState('plain');
  const id = useId();
  const vanilla = "const button = document.querySelector('#toggle');\nconst detail = document.querySelector('#detail');\nlet open = false;\n\nbutton.addEventListener('click', () => {\n  open = !open;\n  detail.hidden = !open;\n  button.textContent = open ? '本文を閉じる' : '本文を開く';\n  button.setAttribute('aria-expanded', String(open));\n});";
  const react = "function ArticleDetail() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button aria-expanded={open}\n        onClick={() => setOpen(!open)}>\n        {open ? '本文を閉じる' : '本文を開く'}\n      </button>\n      {open && <p>9月の研究室展を開催します。</p>}\n    </>\n  );\n}";
  return <figure className="web-figure">
    <figcaption><strong>一つの操作から、状態と表示が変わる</strong><span>記事の本文を開いたり閉じたりしてみてください。</span></figcaption>
    <div className="web-demo-surface"><h3>展示のお知らせ</h3><button type="button" className="web-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? '本文を閉じる' : '本文を開く'}</button><p id={id} hidden={!open}>9月の研究室展を開催します。</p></div>
    <div className="web-state-strip" aria-live="polite"><span>click イベント</span><span aria-hidden="true">→</span><strong>open = {String(open)}</strong><span aria-hidden="true">→</span><span>{open ? '本文を表示' : '本文を非表示'}</span></div>
    <div className="web-controls" role="group" aria-label="コードの書き方"><button type="button" aria-pressed={codeMode === 'plain'} onClick={() => setCodeMode('plain')}>標準のJavaScript</button><button type="button" aria-pressed={codeMode === 'react'} onClick={() => setCodeMode('react')}>React</button></div>
    <WebCode label={codeMode === 'plain' ? '操作に応じて、DOMの変更を指示する' : '状態に応じて、どの表示にするかを記述する'}>{codeMode === 'plain' ? vanilla : react}</WebCode>
    <p className="web-explanation">コードは動作に対応する抜粋です。標準のJavaScriptの例では、対象の要素にtoggle・detailというIDを付けます。Reactの例では、useStateを読み込みます。どちらも、この操作のための通信は必要ありません。</p>
  </figure>;
}

export function RelationalExplorer() {
  const [authorId, setAuthorId] = useState(null);
  const [publishedOnly, setPublishedOnly] = useState(true);
  const [renamed, setRenamed] = useState(false);
  const authors = sampleAuthors.map(author => author.id === 7 && renamed ? { ...author, name: '佐藤 花子' } : author);
  const rows = joinedArticles(authors, authorId, publishedOnly);
  const query = articleQuery(authorId, publishedOnly);
  return <figure className="web-figure">
    <figcaption><strong>記事と著者を、IDで結びつける</strong><span>架空の記事データです。著者名は著者の表に保存します。</span></figcaption>
    <WebTable caption="authors：著者の表" headings={['id（主キー）','name']} rows={authors.map(author => [author.id, author.name])}/>
    <div className="web-controls"><button type="button" aria-pressed={renamed} onClick={() => setRenamed(!renamed)}>{renamed ? '著者名を「佐藤」に戻す' : '著者名を「佐藤 花子」に変更'}</button></div>
    <div className="web-relation"><code>authors.id</code><span>1人 ← 複数の記事</span><code>articles.author_id</code></div>
    <WebTable caption="articles：記事の表" headings={['id（主キー）','title','author_id（外部キー）','status']} rows={sampleArticles.map(article => [article.id, article.title, article.author_id, article.status])}/>
    <div className="web-controls" role="group" aria-label="取得する記事の条件"><label>著者 <select value={authorId ?? 'all'} onChange={e => setAuthorId(e.target.value === 'all' ? null : Number(e.target.value))}><option value="all">全員</option>{authors.map(author => <option key={author.id} value={author.id}>{author.name}（ID {author.id}）</option>)}</select></label><label><input type="checkbox" checked={publishedOnly} onChange={e => setPublishedOnly(e.target.checked)}/> 公開記事だけ</label></div>
    <WebCode label="この条件で取り出すSQL">{query.text}</WebCode>
    {query.values.length > 0 && <p className="web-explanation">$1に渡す著者ID：{query.values[0]}。値はSQLの文字列とは分けて渡します。</p>}
    <p className="web-result-label" aria-live="polite">結合して取り出した結果：{rows.length}件</p>
    <WebTable caption="記事ID・見出し・著者名をまとめた結果" headings={['id','title','author']} rows={rows.map(row => [row.id, row.title, row.author])}/>
    <p className="web-explanation">記事のauthor_idは変わりません。著者の表で名前を変えると、同じIDで結びつく記事の取得結果にも、その名前が現れます。結合によって元の表が一つに書き換わるわけではありません。</p>
  </figure>;
}

export function CmsExplorer() {
  const [state, dispatch] = useReducer(cmsReducer, undefined, initialCmsState);
  const id = useId();
  const dirty = cmsHasChanges(state);
  const versions = state.saved ? [[state.saved.version, state.saved.title, state.saved.version === state.published?.version ? '公開中' : '下書き']] : [];
  if (state.published && state.published.version !== state.saved?.version) versions.push([state.published.version, state.published.title, '公開中']);
  return <figure className="web-figure">
    <figcaption><strong>編集・保存・公開・表示をつなげる</strong><span>サーバーとDBの処理を、画面内で再現した学習用の例です。</span></figcaption>
    <div className="web-editor"><span className="web-label">編集者のブラウザ</span><label htmlFor={`${id}-title`}>記事の見出し</label><input id={`${id}-title`} maxLength={60} value={state.editor.title} onChange={e => dispatch({ type: 'edit', field: 'title', value: e.target.value })}/><label htmlFor={`${id}-body`}>本文</label><textarea id={`${id}-body`} rows={3} maxLength={300} value={state.editor.body} onChange={e => dispatch({ type: 'edit', field: 'body', value: e.target.value })}/><span className="web-label" aria-live="polite">{dirty ? '入力中の内容は、まだ保存されていません。' : `現在の内容は、版${state.saved.version}として保存済みです。`}</span></div>
    <div className="web-controls"><button type="button" onClick={() => dispatch({ type: 'save' })}>① 下書きを保存</button><button type="button" disabled={!state.saved || dirty || state.saved.version === state.published?.version} onClick={() => dispatch({ type: 'publish' })}>② 公開する</button><button type="button" onClick={() => dispatch({ type: 'read' })}>③ 読者ページを取得</button></div>
    <p className="web-explanation" role="status">{state.message}</p>
    <div className="web-two-columns">
      <div><span className="web-label">データベース内の記事12（版を保存する例）</span>{versions.length ? <WebTable caption="保存されている内容" headings={['版','見出し','状態']} rows={versions}/> : <p className="web-empty">まだ保存されていません。</p>}</div>
      <div><span className="web-label">読者のブラウザ</span><div className="web-reader">{state.reader ? <><span className="web-label">取得した版：{state.reader.version}</span><h3>{state.reader.title}</h3><p>{state.reader.body}</p></> : <p>公開記事はまだ取得していません。</p>}</div></div>
    </div>
    <p className="web-explanation">公開後にもう一度編集してみてください。この例では、下書きを保存しても公開中の版は残ります。次の版を公開し、読者が取得すると表示が変わります。実際のCMSでは、保存・改稿・公開の扱いを製品や設定で確認します。</p>
    <div className="web-controls"><button type="button" onClick={() => dispatch({ type: 'reset' })}>最初の状態に戻す</button><span className="web-label">この例の内容は、ページを再読み込みすると元に戻ります。</span></div>
  </figure>;
}
