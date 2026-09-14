import { shareMetadata, SITE_URL, SITE_NAME } from '../../scripts/share-metadata.mjs';
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { marked } from 'marked';
import katex from 'katex';
import { guides } from './navigation.mjs';
import { indesignRedirects } from './indesign-redirects.mjs';

const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const plain = text => text.replace(/<[^>]*>|\*\*/g, '').trim();
const number = n => String(n).padStart(2, '0');
const rootFrom = path => path ? '../'.repeat(path.split('/').filter(Boolean).length) : './';
const chapters = [];
const searchItems = [];
const anchorPaths = {};

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
// The learning site is the single source for the shared visual design.
await cp('../learning/src/style.css', 'dist/learning.css');
await cp(new URL('../../node_modules/katex/dist', import.meta.url), 'dist/katex', { recursive: true }).catch(async () => {
  await cp(new URL('../../../node_modules/katex/dist', import.meta.url), 'dist/katex', { recursive: true });
});

for (const guide of guides) {
  let source = await readFile('content/' + guide.content, 'utf8');
  if (/<unknown|<mention-|file:\/\/|X-Amz-|<script|password|zoom\.us/i.test(source)) throw new Error('Unconverted or private content: ' + guide.id);
  const equations = [];
  source = source.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const index = equations.length;
    equations.push(katex.renderToString(math.trim(), { displayMode: true, throwOnError: true }));
    return 'GUIDEEQUATION' + index + 'END';
  });
  guide.intro = [];
  let blocks = guide.intro, chapter, headingIndex = 0, detailIndex = 0, detailDepth = 0, inTable = false;
  let pendingDetail;
  let chapterIndex = 0;
  for (let line of source.split('\n')) {
    line = line.trim().replace(/\s*\{(?:toggle|color)=[^}]+\}/g, '');
    if (!line || line === '<empty-block/>') continue;
    line = line.replace(/<span[^>]*>/g, tag => tag.includes('color="red"') ? '<span class="emphasis">' : tag.includes('underline="true"') ? '<span class="underline">' : '<span>');
    const heading = line.match(/^(#{1,4})\s+(.+)/);
    if (heading) {
      const level = guide.id === 'research' ? Math.max(2, heading[1].length - 1) : Math.max(2, heading[1].length);
      const id = guide.id + '-section-' + (++headingIndex);
      if (level === 2) {
        const config = guide.chapters[chapterIndex++];
        if (!config || detailDepth || inTable) throw new Error('Unexpected chapter boundary: ' + line);
        chapter = { ...config, guide, number: chapterIndex, id, originalTitle: plain(heading[2]), path: guide.path + config.slug + '/', blocks: [], toc: [] };
        chapters.push(chapter);
        blocks = chapter.blocks;
        anchorPaths[id] = chapter.path;
        searchItems.push({ title: chapter.title, group: guide.title, href: chapter.path, kind: '章' });
      } else {
        blocks.push({ html: '<h' + level + ' id="' + id + '">' + marked.parseInline(heading[2]) + '</h' + level + '>', section: detailDepth === 0 && !inTable });
        chapter.toc.push({ id, title: plain(heading[2]), depth: 0 });
        anchorPaths[id] = chapter.path + '#' + id;
        searchItems.push({ title: plain(heading[2]), group: chapter.title, href: chapter.path + '#' + id, kind: '項目' });
      }
    } else if (/^GUIDEEQUATION(\d+)END$/.test(line)) blocks.push({ html: equations[Number(line.match(/\d+/)[0])] });
    else if (line.startsWith('<callout')) blocks.push({ html: line.includes('type="reference"')
      ? '<aside class="references" aria-label="参考文献"><p class="reference-label">参考文献</p>'
      : '<aside class="callout">' });
    else if (line === '</callout>') blocks.push({ html: '</aside>' });
    else if (/^<details(?: id="[a-z][a-z0-9-]*")?>$/.test(line)) {
      const generatedId = guide.id + '-detail-' + (++detailIndex);
      pendingDetail = line.match(/id="([^"]+)"/)?.[1] ?? generatedId;
      blocks.push({ html: '<details id="' + pendingDetail + '">' });
      detailDepth++;
    } else if (line === '</details>') { detailDepth--; blocks.push({ html: '</details>' }); }
    else if (line.startsWith('<summary>')) {
      const title = line.match(/<summary>(.*?)<\/summary>/)?.[1];
      if (!title || !chapter) throw new Error('Unexpected summary: ' + line);
      blocks.push({ html: '<summary>' + marked.parseInline(title) + '</summary>' });
      chapter.toc.push({ id: pendingDetail, title: plain(title), depth: detailDepth > 1 ? 1 : 0 });
      anchorPaths[pendingDetail] = chapter.path + '#' + pendingDetail;
      searchItems.push({ title: plain(title), group: chapter.title, href: chapter.path + '#' + pendingDetail, kind: '操作・説明' });
    } else if (line === '<columns>') blocks.push({ html: '<div class="columns">' });
    else if (line.startsWith('<column ') || line === '<column>') blocks.push({ html: '<div>' });
    else if (line === '</column>' || line === '</columns>') blocks.push({ html: '</div>' });
    else if (line.startsWith('<table')) { inTable = true; blocks.push({ html: '<div class="table-scroll"><table>' }); }
    else if (line === '</table>') { inTable = false; blocks.push({ html: '</table></div>' }); }
    else if (inTable) {
      if (/<col\b|<colgroup>|<\/colgroup>/.test(line)) continue;
      blocks.push({ html: line.replace(/<td>(.*?)<\/td>/g, (_, text) => '<td>' + marked.parseInline(text) + '</td>') });
    } else blocks.push({ html: marked.parse(line) });
  }
  if (chapterIndex !== guide.chapters.length || detailDepth || inTable) throw new Error('Incomplete source: ' + guide.id);
}

function content(blocks, root, groupSections = true) {
  const html = [];
  let inSection = false;
  for (const block of blocks) {
    if (groupSections && block.section) {
      if (inSection) html.push('</div></section>');
      html.push('<section class="section"><div class="section-title">' + block.html + '</div><div class="section-body">');
      inSection = true;
    } else html.push(block.html);
  }
  if (inSection) html.push('</div></section>');
  const result = html.join('\n')
    .replaceAll('RESEARCH_URL', root).replaceAll('INDESIGN_URL', root + 'indesign/')
    .replace(/(src|href)="(assets|downloads)\//g, '$1="' + root + '$2/')
    .replace(/<img /g, '<img loading="lazy" decoding="async" ');
  if (/GUIDEEQUATION|<unknown|<empty-block|<callout|toggle=/.test(result)) throw new Error('Unsupported source block');
  return result;
}

function sidebar(root, guide, current) {
  const links = chapters.filter(chapter => chapter.guide === guide).map(chapter => '<a href="' + root + chapter.path + '"' + (chapter === current ? ' aria-current="page"' : '') + '><span class="nav-number">' + number(chapter.number) + '</span><span>' + escape(chapter.title) + '</span></a>').join('');
  return '<aside class="catalog-nav"><details class="guide-menu" open><summary>' + escape(guide.title) + 'のメニュー</summary><a class="back-index" href="' + root + guide.path + '">← ' + escape(guide.title) + '</a><nav class="chapter-nav guide-chapters" aria-label="章">' + links + '</nav></details></aside>';
}

function card(chapter, root, badge = number(chapter.number)) {
  return '<a class="guide-card" href="' + root + chapter.path + '"><div class="subject-meta"><span class="course-no">' + escape(badge) + '</span><span aria-hidden="true">↗</span></div><h3>' + escape(chapter.title) + '</h3><p>' + escape(chapter.description) + '</p><span class="card-action">読む <span aria-hidden="true">→</span></span></a>';
}

function overview(guide, root) {
  const list = chapters.filter(chapter => chapter.guide === guide);
  const split = guide.id === 'research' ? 3 : 4;
  const primaryTitle = guide.id === 'research' ? '研究の進め方と、論文の書き方' : '準備から書き出しまで';
  const main = '<section class="overview-section"><h2>' + primaryTitle + '</h2><div class="guide-cards">' + list.slice(0, split).map(chapter => card(chapter, root)).join('') + '</div></section>';
  const extras = guide.id === 'research'
    ? card({ path: 'indesign/', title: 'InDesignで論文をつくる', description: '本文・目次・図表を整え、PDFとして提出する。Wordでの梗概作成もこちら。' }, root, '操作ガイド') + card(list[3], root, '補足')
    : list.slice(split).map(chapter => card(chapter, root)).join('');
  const extraTitle = guide.id === 'research' ? '論文を仕上げる・補足を読む' : '必要なときに';
  const introduction = guide.intro.length ? '<section class="source-intro"><h2>このガイドについて</h2><article class="prose">' + content(guide.intro, root, false) + '</article></section>' : '';
  return main + '<section class="overview-section"><h2>' + extraTitle + '</h2><div class="guide-cards supplementary">' + extras + '</div></section>' + introduction;
}

function chapterPage(chapter, root) {
  const article = content(chapter.blocks, root);
  const siblings = chapters.filter(item => item.guide === chapter.guide);
  const prev = siblings[chapter.number - 2], next = siblings[chapter.number];
  const link = (item, label) => item ? '<a href="' + root + item.path + '"><span>' + label + '</span><strong>' + escape(item.title) + '</strong></a>' : '<a href="' + root + chapter.guide.path + '"><span>一覧へ</span><strong>' + escape(chapter.guide.title) + '</strong></a>';
  const previous = prev || !chapter.guide.startAtFirstChapter ? link(prev, '← 前の章') : '<span></span>';
  const following = !next && chapter.guide.startAtFirstChapter
    ? '<a href="' + root + chapter.guide.path + '"><span>最初の章へ</span><strong>' + escape(siblings[0].title) + '</strong></a>'
    : link(next, '次の章 →');
  return '<article class="prose chapter-content">' + article + '</article><nav class="page-pagination" aria-label="前後の章">' + previous + following + '</nav>';
}

async function writePage(guide, chapter) {
  const path = chapter?.path ?? guide.path;
  const root = rootFrom(path);
  const title = chapter?.title ?? guide.title;
  const description = chapter?.description ?? guide.description;
  const metadata = shareMetadata({title:[title, chapter && guide.title !== title ? guide.title : '', SITE_NAME].filter(Boolean).join('｜'),description,url:new URL('research/' + path, SITE_URL).href});
  const breadcrumb = chapter ? '<nav class="breadcrumbs" aria-label="現在地"><a href="' + root + '">研究ガイド</a>' + (guide.id === 'indesign' ? '<span aria-hidden="true">/</span><a href="' + root + guide.path + '">InDesign</a>' : '') + '<span aria-hidden="true">/</span><span aria-current="page">' + escape(title) + '</span></nav>' : '';
  const eyebrow = chapter ? number(chapter.number) + ' / ' + guide.title : guide.id === 'research' ? 'RESEARCH GUIDE' : 'WRITING WITH InDesign';
  const heading = '<div class="page-heading">' + breadcrumb + '<p class="eyebrow">' + escape(eyebrow) + '</p><h1' + (chapter ? ' id="' + chapter.id + '"' : '') + '>' + escape(title) + '</h1></div>';
  const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff">${metadata}<link rel="icon" href="${root}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}learning.css"><link rel="stylesheet" href="${root}style.css"><link rel="stylesheet" href="${root}katex/katex.min.css"><script defer src="${root}guide.js"></script></head>
<body data-research-root="${root}" class="${chapter ? 'guide-reading' : 'guide-overview'}"><a class="skip" href="#main">本文へ</a><header class="site-header"><a class="wordmark" href="${root}">Research<span>動態デザイン研究室</span></a><nav aria-label="サイト"><a href="${root}" aria-current="page">研究ガイド</a><a href="${root}../learning/">学習資料</a></nav></header><div class="atlas">${sidebar(root, guide, chapter)}<main id="main" class="method-main" tabindex="-1">${heading}${chapter ? chapterPage(chapter, root) : overview(guide, root)}</main></div><footer class="site-footer"><span>動態デザイン研究室</span><a href="https://github.com/Design-for-Changes/lab-learning">GitHub ↗</a></footer></body></html>`;
  await mkdir('dist/' + path, { recursive: true });
  await writeFile('dist/' + path + 'index.html', html);
}
for (const guide of guides) {
  if (!guide.startAtFirstChapter) { await writePage(guide); continue; }
  const first = chapters.find(chapter => chapter.guide === guide);
  const href = './' + first.slug + '/';
  const metadata = shareMetadata({title:[first.title,guide.title,SITE_NAME].join('｜'),description:first.description,url:new URL('research/' + first.path,SITE_URL).href});
  const html = '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + metadata + '<script>location.replace(' + JSON.stringify(href) + '+location.search+location.hash);</script></head><body><h1>' + escape(first.title) + '</h1><a href="' + href + '">01から読む</a></body></html>';
  await mkdir('dist/' + guide.path, { recursive: true });
  await writeFile('dist/' + guide.path + 'index.html', html);
}
for (const chapter of chapters) await writePage(chapter.guide, chapter);
const legacyAnchors = Object.fromEntries(indesignRedirects.flatMap(route => route.anchors.map(id => [id, route.target])));
Object.assign(anchorPaths, legacyAnchors);
for (const route of indesignRedirects) {
  const root = rootFrom(route.path);
  const target = root + route.target;
  const metadata = shareMetadata({title:route.title + '｜' + SITE_NAME,description:route.title + 'に関する資料。統合先の補足ノートへ進みます。',url:new URL('research/' + route.target,SITE_URL).href});
  const choices = Object.fromEntries(Object.entries(legacyAnchors).map(([id, path]) => [id, root + path]));
  const script = 'const choices=' + JSON.stringify(choices) + ';let id="";try{id=decodeURIComponent(location.hash.slice(1));}catch{}const target=choices[id]||' + JSON.stringify(target) + ';const [path,anchor]=target.split("#");location.replace(path+location.search+(anchor?"#"+anchor:""));';
  const html = '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + metadata + '<script>' + script + '</script></head><body><h1>' + escape(route.title) + '</h1><a href="' + target + '">統合先の補足ノートへ</a></body></html>';
  await mkdir('dist/' + route.path, { recursive: true });
  await writeFile('dist/' + route.path + 'index.html', html);
}
await writeFile('dist/search-index.json', JSON.stringify(searchItems));
await writeFile('dist/anchor-map.json', JSON.stringify(anchorPaths));
console.log(`Research guides: ${guides.filter(guide => !guide.startAtFirstChapter).length} overview pages, ${guides.filter(guide => guide.startAtFirstChapter).length} chapter redirects, ${chapters.length} chapter pages, ${searchItems.length} searchable entries.`);
