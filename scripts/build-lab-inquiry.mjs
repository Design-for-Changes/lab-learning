import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { marked } from 'marked';
import { escapeHtml, shareMetadata, SITE_URL, SITE_NAME } from './share-metadata.mjs';

export async function buildLabInquiry() {
  const output = 'dist/lab-inquiry';
  await mkdir(output + '/manual', { recursive: true });
  await mkdir(output + '/interests', { recursive: true });
  await mkdir(output + '/guidance', { recursive: true });
  await mkdir(output + '/downloads', { recursive: true });
  const source = await readFile('lab-inquiry/content/manual.md', 'utf8');
  const versionMatch = source.match(/バージョン：`([^`]+)` \/ 更新日：(\d{4}-\d{2}-\d{2})/);
  if (!versionMatch) throw new Error('Lab inquiry manual version missing');
  const version = `<p class="document-version" data-document-version="${escapeHtml(versionMatch[1])}">指示のバージョン：<code>${escapeHtml(versionMatch[1])}</code><span>更新日：<time datetime="${versionMatch[2]}">${versionMatch[2]}</time></span></p>`;
  for (const [from, to] of [['manual.md', 'AI向け_対話進行仕様.md'], ['manual-shiftjis.md', 'AI向け_対話進行仕様_shiftJIS.md']]) {
    await cp('lab-inquiry/content/' + from, output + '/downloads/' + to);
  }
  await cp('lab-inquiry/content/guidance.html', output + '/guidance/index.html');
  const sidebar = root => `<aside class="catalog-nav"><nav class="chapter-nav" aria-label="ラボ探究の資料"><a href="${root}">ラボ探究</a><a href="${root}guidance/">授業ガイダンス</a><a href="${root}manual/">AI向け対話進行仕様</a><a href="${root}interests/">みんなの関心</a></nav></aside>`;
  const page = (path, title, body) => {
    const root = path ? '../' : './';
    const metadata = shareMetadata({ title: title + '｜' + SITE_NAME, description: 'ラボ探究：研究分野紹介動画を見て、AIとの対話で理解と興味を深める。', url: new URL('lab-inquiry/' + path, SITE_URL).href });
    return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${metadata}<link rel="icon" href="${root}../research/favicon.svg"><link rel="stylesheet" href="${root}../research/learning.css"><link rel="stylesheet" href="${root}../research/style.css"><script defer src="${root}../research/guide.js"></script></head><body class="guide-reading"><a class="skip" href="#main">本文へ</a><header class="site-header"><a class="wordmark" href="${root}">ラボ探究<span>研究分野を知り、興味を広げる</span></a><nav aria-label="サイト"><a href="${root}" aria-current="page">ラボ探究</a><a href="${root}../research/">研究ガイド</a><a href="${root}../learning/">学習資料</a></nav></header><div class="atlas">${sidebar(root)}<main id="main" class="method-main" tabindex="-1"><div class="page-heading"><p class="eyebrow">LAB INQUIRY</p><h1>${escapeHtml(title)}</h1></div>${body}</main></div><footer class="site-footer"><span>ラボ探究</span><a href="${root}../learning/">学習資料へ</a></footer></body></html>`;
  };
  const actions = root => `<div class="document-actions"><button type="button" class="copy-document" hidden>AI向け指示をコピー</button><span class="document-copy-status" role="status"></span></div><div class="document-copy-fallback" hidden><label for="document-markdown">全文を選択しています。コピーしてAIに貼り付けてください。</label><textarea id="document-markdown" readonly>${escapeHtml(source)}</textarea></div><noscript><p>コピーするにはJavaScriptを有効にするか、マニュアル本文を選択してコピーしてください。</p></noscript>`;
  const overview = `${version}<article class="prose"><p>デザイン工学のさまざまな研究分野や、社会で活躍する人の話に触れ、自分の興味や関心を広げる授業です。</p><p><a href="guidance/">授業ガイダンスを読む →</a> / <a href="interests/">みんなの関心を見る →</a></p><h2>AIとの自習を始める</h2><p>下のボタンで指示を全文コピーし、使うAIの新しいチャットに貼り付けて送信してください。AIからの質問に答えて進めます。</p>${actions('./')}<p><a href="manual/">AI向け対話進行仕様の全文を読む →</a></p><h2>学習の流れ</h2><ol><li>保存方法を選ぶ。指定フォルダへ直接保存、またはMarkdownファイルをダウンロード。</li><li>3本の研究分野紹介動画を見て、AIの質問に答え、分からないことはAIから教わる。</li><li>3本を比較して1本を選び、興味を持った理由と、その研究分野で取り組みたい研究を考える。</li><li>学習内容を確認し、AIから「キミの興味関心の特徴」のフィードバックと2つのMDファイルを受け取る。</li></ol><h2>提出と次回の準備</h2><p>提出用レポートをLMSへ提出します。興味関心ログは手元に保存し、次回AIへ渡してください。</p><ul><li>提出用：<code>学籍番号_氏名_第01回.md</code></li><li>次回用：<code>学籍番号_氏名_興味関心ログ_第01回.md</code></li></ul><p>回数は今回の実施回に合わせ、2桁にしてください。</p></article>`;
  await writeFile(output + '/index.html', page('', 'ラボ探究', overview));
  const downloads = `<p><a href="../downloads/AI向け_対話進行仕様_shiftJIS.md" download>Shift-JIS版を保存</a> / <a href="../downloads/AI向け_対話進行仕様.md" download>UTF-8版を保存</a></p>`;
  await writeFile(output + '/manual/index.html', page('manual/', 'AI向け対話進行仕様', version + actions('../') + downloads + `<article id="document-content" class="prose document-content">${marked.parse(source)}</article>`));

  const summary = JSON.parse(await readFile('lab-inquiry/content/interests-summary.json', 'utf8'));
  for (const groups of [summary.domains, summary.themes]) {
    if (groups.reduce((n, item) => n + item.count, 0) !== summary.students) throw new Error('Interest totals inconsistent');
    if (groups.some(item => !Number.isInteger(item.count) || item.count < 5)) throw new Error('Small groups must not be published');
  }
  const chart = (groups, title) => {
    const ceiling = Math.ceil(Math.max(...groups.map(item => item.count)) / 10) * 10;
    return `<section class="interest-section"><h2>${escapeHtml(title)}</h2><p class="interest-scale">横軸：人数（0–${ceiling}人） / 割合の分母：${summary.students}人</p><div class="interest-chart" role="list" aria-label="${escapeHtml(title)}、集計対象${summary.students}人">${groups.map(item => {
    const pct = item.count / summary.students * 100;
    return `<div class="interest-row${item.unconfirmed ? ' interest-unknown' : ''}" role="listitem"><div class="interest-label"><span>${escapeHtml(item.label)}</span><span class="interest-value">${item.count}人 <small>(${pct.toFixed(1)}%)</small></span></div><div class="interest-track" aria-hidden="true"><div class="interest-bar" style="width:${(item.count / ceiling * 100).toFixed(3)}%"></div></div></div>`;
  }).join('')}</div></section>`;
  };
  const interestStyle = `<style>.interest-meta{display:flex;flex-wrap:wrap;gap:12px 28px;margin:0 0 32px}.interest-meta strong{font-size:1.5rem}.interest-section{margin-block:36px}.interest-chart{display:grid;gap:20px;max-width:780px}.interest-label{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:8px}.interest-value{white-space:nowrap;font-variant-numeric:tabular-nums}.interest-value small{color:var(--muted)}.interest-track{height:16px;background:color-mix(in srgb,var(--blue) 9%,transparent)}.interest-bar{height:100%;background:var(--blue)}.interest-unknown .interest-bar{background:var(--muted)}.interest-method{max-width:780px}.interest-method summary{cursor:pointer}.interest-method p{margin:12px 0}@media(max-width:480px){.interest-chart{gap:18px}.interest-label{display:block}.interest-value{display:block;margin-top:4px}}</style>`;
  const interests = interestStyle + `<article class="prose"><p class="eyebrow">${escapeHtml(summary.session)} / ${escapeHtml(summary.status)} / 更新 ${escapeHtml(summary.updatedAt)}</p><div class="interest-meta"><span>集計対象 <strong>${summary.students}</strong> 人</span><span>提出ファイル <strong>${summary.markdownFiles}</strong> 件</span></div><p>提出済みの資料に記載された関心と研究案の、現時点での広がりです。履修者全員の傾向を表すものではありません。</p><p>個人別の表示・検索・原文へのリンクはありません。集計値だけを公開しています。</p>${chart(summary.domains, '選んだ研究分野')}${chart(summary.themes, '研究案で注目していること')}<details class="interest-method"><summary>集計方法と、この図で分かる範囲</summary><p>${escapeHtml(summary.domainMethod)}</p><p>${escapeHtml(summary.themeMethod)}</p><p>同じ人の複数ファイルはまとめて1人として集計しています。各グラフは1人1分類、割合の分母は集計対象${summary.students}人です。</p><p>「確認できない」は、提出物から選択や研究案を読み取れない状態です。関心がない、理解していない、という評価ではありません。分類は暫定で、今後の提出と確認によって変わります。</p><p>${escapeHtml(summary.privacy)}</p></details></article>`;
  await writeFile(output + '/interests/index.html', page('interests/', 'みんなの関心', interests));
}
