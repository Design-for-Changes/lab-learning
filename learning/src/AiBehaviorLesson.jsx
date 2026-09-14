import PageLink from './PageLink.jsx';
import { useState } from 'react';
import { Section, Sources } from './Common.jsx';
import './aiPartnership.css';

const workflow = [
 { title: '元の資料とルールを読む', place: 'ローカルの作業フォルダー', route: 'ファイルを読む道具', result: '原稿、画像、編集ルールを読み取り、今回の文脈へ加える。', point: '同じ「Newsを更新して」という依頼でも、どの原稿とルールを読めるかで作業の内容が変わる。', active: 'local' },
 { title: 'ファイルを編集し、動かして確かめる', place: 'ローカルの作業フォルダーとブラウザ', route: 'ファイル編集・コマンド実行・ブラウザ操作', result: '記事を保存し、検査を実行し、確認用の画面を開く。エラーや表示の問題があれば修正する。', point: '「書けた」「検査が通った」「画面で正しく見えた」は、それぞれ別の確認。', active: 'local' },
 { title: '共有先の状態を調べる', place: 'GitHubや確認用サイトなどの外部サービス', route: 'Gitで変更を送る。MCPやAPIなどで検査結果・URLを取得する。', result: '共有された変更と、外部で行われた検査や配信の結果を受け取る。', point: '手元のファイルを直しただけでは、外部サービスの内容は更新されない。送る処理と、その結果の確認が必要。', active: 'remote' },
 { title: '指摘を反映し、次回へ引き継ぐ', place: '同じ記事・同じ資料置き場・作業記録', route: '人間との対話・ファイル編集・履歴の保存', result: '修正の指示を受け、同じ成果物を更新する。変更点、確認結果、残った作業を記録する。', point: '次の作業では、保存した記録を読み直すことで、どこから続けるかを判断できる。', active: 'records' },
];

function WorkspaceWalkthrough() {
 const [step, setStep] = useState(0);
 const current = workflow[step];
 return <div className="ai-behavior-walkthrough">
  <p className="small-note">Webサイトの更新を想定した構成例です。ボタンで説明が切り替わります。実際のAI操作や公開は行いません。</p>
  <div className="ai-behavior-places" aria-label="今の手順で中心になる置き場">
   {[[ 'local', '手元のファイル' ],[ 'remote', '外部サービス' ],[ 'records', '次回へ残す記録' ]].map(([id, label]) => <span key={id} data-active={current.active === id}>{current.active === id && <small>今ここ</small>}{label}</span>)}
  </div>
  <div className="segmented" role="group" aria-label="News更新の手順を選ぶ">
   {workflow.map((item, index) => <button type="button" key={item.title} aria-pressed={index === step} aria-controls="ai-behavior-step" onClick={() => setStep(index)}>{index + 1}　{['読む', '編集・検証', '共有・確認', '引き継ぐ'][index]}</button>)}
  </div>
  <div className="ai-behavior-step" id="ai-behavior-step" aria-live="polite" aria-atomic="true">
   <h3>{step + 1}　{current.title}</h3>
   <dl><div><dt>どこで</dt><dd>{current.place}</dd></div><div><dt>何を使って</dt><dd>{current.route}</dd></div><div><dt>何が返るか</dt><dd>{current.result}</dd></div></dl>
   <p><strong>{current.point}</strong></p>
  </div>
 </div>;
}

export default function AiBehaviorLesson() {
 return <div className="ai-partnership">
  <Section title="AIは、どこで、何を使って作業するのか">
   <p className="ai-partnership-key">AIの動きを理解するには、「どこで処理するか」「何に接続できるか」「何を通じて操作するか」を分けて見る。</p>
   <p><PageLink href="#/ai-intro/systems">01</PageLink>で見たハーネスは、モデルの呼び出しや道具の実行を管理します。ここでは<strong>道具を使うAIエージェント</strong>を対象に、その実行環境と操作方法を整理します。使える機能は、アプリの実装と設定によって異なります。</p>
   <dl className="ai-partnership-checks">
    <div><dt>作業する場所</dt><dd><strong>ローカル／クラウド。</strong>手元のPCや外部の実行環境の、どこにファイルを置き、どこで処理を実行するか。</dd></div>
    <div><dt>道具との接続</dt><dd><strong>MCPなど。</strong>利用できる道具や資料を、AIアプリへどのような取り決めで提供するか。</dd></div>
    <div><dt>操作の方法</dt><dd><strong>ファイル編集・コマンド・API・画面操作など。</strong>対象のデータやアプリを、何を通じて読み書きするか。</dd></div>
   </dl>
   <p>この三つは別々の軸です。例えば、MCPでつながった道具が、手元のPCのファイルを編集する構成も、ブラウザを操作する構成もあります。</p>
  </Section>

  <Section title="作業領域は、ローカルにもクラウドにもある">
   <p><strong>ローカル</strong>は、ここでは利用者のPC上を指します。例えばClaude Codeを端末で使う場合は、指定したプロジェクトのファイルを読み書きし、コマンドでプログラムを実行できます。一方、サービス側に作業用の実行環境を用意する構成もあります。</p>
   <figure className="ai-behavior-local">
    <div className="ai-behavior-model"><strong>言語モデル</strong><span>次に読むもの・実行する処理を選ぶ<br/>モデルの推論はクラウドで行う構成もある</span></div>
    <p className="ai-behavior-arrow">処理の要求 ↓　↑ 読み取った内容・実行結果</p>
    <div className="ai-behavior-workspace"><strong>手元のPC：AIアプリと道具が実行を担当</strong><div><span>元の資料<br/><small>原稿・CSV・画像</small></span><span>処理するコード<br/><small>集計・変換・検査</small></span><span>成果物と記録<br/><small>図・文書・変更履歴</small></span></div></div>
    <figcaption>一つの構成例。ローカルに作業フォルダーがあることと、モデル自体をローカルで動かすことは別の話です。</figcaption>
   </figure>
   <p><strong>コードをつくることと、コードを実行することも別です。</strong>例えばCSVを集計するコードを書き、実行し、出てきた表を元データと照合する、という一連の作業になります。コマンドは、プログラムの実行などを文字で指示する方法です。</p>
   <p>例えばClaude APIのCode executionは、サービス側のコンテナという分離された環境でファイルを扱い、コードを実行します。<strong>利用者のPCと、そのコンテナのファイルは別物</strong>です。結果を受け渡す処理が必要で、再利用の方法や保存期限もサービスの仕様に従います。</p>
   <p>確認するのは、<strong>ファイルの保存先、処理の実行場所、モデルへ渡される情報</strong>です。手元でファイルを編集する構成でも、読み取った内容をクラウドのモデルへ送る場合があります。</p>
   <p className="small-note">実装例：<PageLink href="https://code.claude.com/docs/en/overview" target="_blank" rel="noreferrer">Claude Codeのファイル・コマンド操作</PageLink> ／ <PageLink href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool" target="_blank" rel="noreferrer">Code executionの実行環境とファイルの受け渡し</PageLink>。</p>
  </Section>

  <Section title="MCPで、使える道具や資料につなぐ">
   <p><strong>MCP（Model Context Protocol）</strong>は、AIアプリと、道具や資料を提供するプログラムとの接続を共通化する仕組みです。提供側のプログラムを<strong>MCPサーバー</strong>と呼びます。サーバーは、自分のPCでも外部の環境でも動かせます。</p>
   <figure className="ai-behavior-mcp">
    <div><strong>AIアプリ</strong><span>使える機能を知り、必要な処理を要求する</span></div>
    <p>MCPで要求と結果をやり取り<br/>↕</p>
    <div><strong>MCPサーバー</strong><span>道具や資料を、決まった形で提供する</span></div>
    <p>接続先の仕組みで読み書きする<br/>↕</p>
    <div><strong>ファイル・外部サービス</strong><span>PC上の文書、共有資料、予定表、開発サービスなど</span></div>
    <figcaption>例えば「共有資料を探す道具」を呼ぶと、検索結果が返り、その内容を次の判断に使えます。</figcaption>
   </figure>
   <p><strong>API</strong>は、ソフトウェア同士が機能を呼び出す窓口です。MCPサーバーが、接続先のAPIを使って処理することもあります。MCPを使わず、AIアプリが直接APIに接続する構成もあります。</p>
   <p>接続しただけで、すべての情報や操作を使えるわけではありません。何ができるかは、提供されている機能、認証、与えられた権限によって決まります。</p>
   <p><strong>MCPは接続の仕組みであり、操作の正しさを保証するものではありません。</strong>道具に渡す値や、返された結果の解釈は、別に確かめる必要があります。</p>
   <p className="small-note">出典：<PageLink href="https://modelcontextprotocol.io/docs/learn/architecture" target="_blank" rel="noreferrer">MCP公式のアーキテクチャ説明</PageLink>。MCPサーバーは、ローカルでもリモートでも動作します。</p>
   <details><summary>補足：MCPが提供する三つのもの</summary><div className="ai-partnership-detail"><dl><div><dt>Tools（道具）</dt><dd>検索、ファイル操作、予定の登録など、実行する機能。</dd></div><div><dt>Resources（資料）</dt><dd>文書やデータなど、文脈に取り込むための情報。</dd></div><div><dt>Prompts（ひな型）</dt><dd>決まった作業を進めるために再利用する指示の形。</dd></div></dl><p>どれをどう使うかはAIアプリの実装によって異なります。MCP自体が、作業の目的や進め方を決めるわけではありません。</p></div></details>
  </Section>

  <Section title="画面やブラウザを通じて操作する">
   <p>ボタンや入力欄など、画面を介してアプリを操作する仕組みを<strong>GUI（Graphical User Interface）</strong>と呼びます。AIにGUIを操作させる方法の一つが、画面画像を読み、マウスやキーボードの操作を道具へ要求する方法です。Anthropicは、この機能を<strong>Computer use（コンピュータ操作）</strong>と呼んでいます。</p>
   <p>次は、画面画像を使う場合の処理の流れです。モデルは操作を要求し、実際のクリックや入力は実行側のプログラムが行います。</p>
   <ol className="ai-partnership-flow" aria-label="画面画像を使うコンピュータ操作の繰り返し">
    <li><strong>1　現在の画面を見る</strong><span>どのページにいて、何が表示され、何を入力できるかを読み取る。</span></li>
    <li><strong>2　操作を選ぶ</strong><span>どのボタンを押すか、どの欄に何を入れるかを決める。</span></li>
    <li><strong>3　操作用の道具が実行する</strong><span>実際のクリック・入力・スクロールなどを行う。</span></li>
    <li><strong>4　操作後の画面を確かめる</strong><span>想定した結果になったかを見て、次の操作や修正へ進む。</span></li>
   </ol>
   <p>画面の配置や表示が変わると、操作先を取り違えることがあります。「保存を押した」という操作記録と、保存後の内容を分けて確かめます。</p>
   <div className="ai-partnership-example"><h3>ブラウザの自動操作は、画像を使う方法だけではない</h3><p>例えばPlaywright MCPは、ページ内のボタンや入力欄を、名前や役割などの構造化された情報としてAIへ渡します。この情報をアクセシビリティスナップショットと呼び、操作対象を指定するために使います。</p><p>画面の画像を読む方法と、ページの構造を読む方法は組み合わせることもできます。ブラウザの自動操作自体はAI専用の技術ではなく、AIエージェントはそれを道具として利用します。</p></div>
   <p><strong>サービスAPIはデータや機能を直接呼び出す窓口で、GUIは画面を通じて操作する窓口</strong>です。MCPは、どちらを扱う道具にも接続できます。この教材では、具体的な方式が分かるように「API経由の操作」「画面操作」「ブラウザの自動操作」と書き分けます。</p>
   <p className="small-note">実装例：<PageLink href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool" target="_blank" rel="noreferrer">Anthropic Computer use</PageLink> ／ <PageLink href="https://github.com/microsoft/playwright-mcp" target="_blank" rel="noreferrer">Microsoft Playwright MCP</PageLink>。</p>
  </Section>

  <Section title="作業は、複数の場所を行き来する">
   <p>WebサイトのNews更新を例に考えます。原稿を読む、記事をつくる、表示を確かめる、共有先へ反映するという作業では、使う場所や道具が変わります。以下は、ローカルで編集して共有先へ送る構成の一例です。</p>
   <WorkspaceWalkthrough/>
   <p>この例のGitは、ファイルの変更履歴を管理し、共有先へ変更を送るために使っています。GitHubはその共有先の一つです。MCPで外部の検査結果を読むことと、Gitで変更を送ることは、別の処理です。</p>
   <p>この例では、確認用サイトで内容を見てから本番を公開する流れを想定しています。すべてのAIがこの順番で動くわけではなく、使う道具、手順、実行してよい範囲を組み合わせて実現します。</p>
  </Section>

  <Section title="長い作業では、記録を読み直して続ける">
   <p>01で扱ったコンテキストには、一度に扱える量の上限があります。長い作業を続ける実装には、履歴を要約したり、保存した文書・変更履歴を読み直したりする方法があります。どこまで自動で引き継がれるかは、アプリの設計によります。</p>
   <dl className="ai-partnership-checks">
    <div><dt>今回の文脈</dt><dd>いまモデルに渡されている依頼、資料、会話、道具の結果。次の出力の材料になる。</dd></div>
    <div><dt>保存した資料</dt><dd>元データ、コード、成果物、確定した手順。道具で読み直せれば、後の作業でも参照できる。</dd></div>
    <div><dt>引き継ぐ記録</dt><dd>何を変え、何を確かめ、何が残っているか。次にどこから再開するかを判断する材料になる。</dd></div>
   </dl>
   <p>フォルダーに資料が置かれていても、全部が常に文脈へ入るわけではありません。<strong>必要な資料の場所と、読む順序が分かること</strong>が、継続して作業するうえで役立ちます。</p>
   <p>記録は再開の手がかりです。要約で情報が落ちたり、記録が古くなったりするため、重要な判断では原本や実際の作業状態へ戻って確かめます。</p>
   <p className="ai-partnership-key">AIが作業しやすいかは、モデルの能力に加えて、「読める」「操作できる」「結果を確かめられる」「途中から戻れる」という環境にも左右される。</p>
  </Section>
  <Sources links={[
   ['MCP公式：AIアプリ・クライアント・サーバーと、ローカル／リモートの接続', 'https://modelcontextprotocol.io/docs/learn/architecture'],
   ['MCP公式：道具・資料・指示のひな型', 'https://modelcontextprotocol.io/docs/learn/server-concepts'],
   ['Anthropic：画面取得・操作要求・結果を返すComputer useの実装', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool'],
   ['Microsoft：ページの構造を使うPlaywright MCP', 'https://github.com/microsoft/playwright-mcp'],
   ['Anthropic：Code executionの実行環境・ファイル・保存期間', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool'],
   ['Anthropic：長い作業を支える作業領域・記録・検証', 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents'],
  ]}/>
  <p className="ai-partnership-source-note">技術説明は上記の仕様・開発元資料に基づきます。News更新の図は、蘆澤雄亮「AIのあれこれ」（2026年9月8日更新）で提示された考え方を、教材の構成例として整理しています。</p>
 </div>;
}
