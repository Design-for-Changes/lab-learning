import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { runInNewContext } from 'node:vm';
import { guides } from '../research/scripts/navigation.mjs';
import { indesignRedirects } from '../research/scripts/indesign-redirects.mjs';
import { documentPages, documentMetadata } from '../research/scripts/document-pages.mjs';

const root = resolve('research/dist');
async function htmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}
// The downloadable file is a standalone local report, not a guide route.
const reportTemplate = resolve(root, 'downloads/research-progress-template.html');
await access(reportTemplate);
const files = (await htmlFiles(root)).filter(file => file !== reportTemplate);
assert.equal(files.length, guides.reduce((total, guide) => total + 1 + guide.chapters.length, 0) + indesignRedirects.length + documentPages.length, 'Missing entry, chapter, document, or legacy redirect pages');
const pages = new Map();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1(?: | >|>)/g) || []).length, 1, `${file}: expected one page title`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const shareTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];
  assert.equal(shareTitle, title, `${file}: share title differs from page title`);
  for (const property of ['og:description', 'og:url']) assert.ok(html.match(new RegExp(`property="${property}" content="[^"]+"`)), `${file}: missing ${property}`);
  assert.ok(html.includes('<link rel="canonical" href="https://design-for-changes.github.io/lab-learning/research/'), `${file}: missing canonical URL`);
  assert.ok(!/file:\/\/|X-Amz-|<unknown|<mention-|GUIDEEQUATION|RESEARCH_URL|INDESIGN_URL|https:\/\/doi\//.test(html), `${file}: unresolved source reference`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  pages.set(file, { html, ids });
}
async function checkReference(from, href) {
  if (/^https?:|^mailto:/.test(href)) return;
  assert.ok(!href.startsWith('/'), `${from}: root-relative reference ${href}`);
  const [pathname, anchor] = href.split('#');
  const path = pathname ? resolve(dirname(from), pathname.endsWith('/') ? pathname + 'index.html' : pathname) : from;
  // The sibling learning app is built and validated by its workspace.
  if (path === resolve('research/learning/index.html')) return;
  await access(path);
  if (anchor) assert.ok(pages.get(path)?.ids.includes(anchor), `${from}: missing anchor ${href}`);
  if (path.endsWith('.png')) {
    const bytes = await readFile(path);
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG', `${from}: invalid PNG ${href}`);
  }
}
let imageCount = 0;
for (const [file, { html }] of pages) {
  imageCount += (html.match(/<img /g) || []).length;
  for (const [, href] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) await checkReference(file, href);
}
for (const guide of guides) {
  for (const chapter of guide.chapters) assert.ok(pages.has(resolve(root, guide.path, chapter.slug, 'index.html')), `Missing ${chapter.slug}`);
}
const research = guides[0].chapters.map(chapter => pages.get(resolve(root, chapter.slug, 'index.html')).html).join('\n');
const unescape = text => text.replace(/&(amp|lt|gt|quot|apos);|&#39;/g, token => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'" })[token]);
let specificationVersion;
for (const document of documentPages) {
  const html = pages.get(resolve(root, document.path, 'index.html'))?.html;
  assert.ok(html, 'Missing document: ' + document.path);
  const original = await readFile(resolve('research/public/downloads', document.file), 'utf8');
  const metadata = documentMetadata(original);
  specificationVersion ??= metadata.version;
  assert.equal(metadata.version, specificationVersion, 'Specification document versions must agree');
  assert.ok(html.includes(`data-document-version="${metadata.version}"`), 'Visible version differs from Markdown');
  assert.ok(html.includes(`<time datetime="${metadata.updatedAt}">${metadata.updatedAt}</time>`), 'Visible update date differs from Markdown');
  const copy = html.match(/<textarea id="document-markdown" readonly>([\s\S]*?)<\/textarea>/)?.[1];
  assert.equal(unescape(copy || ''), original, document.file + ': full-text copy differs from Markdown');
  assert.equal(await readFile(resolve(root, 'downloads', document.file), 'utf8'), original, document.file + ': download differs from original');
  const article = html.match(/<article id="document-content" class="prose document-content">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(article?.includes('<h2 id="document-section-'), document.file + ': body must be readable without JavaScript');
  assert.ok(!article.includes('<details'), document.file + ': full document must not require expanding details');
}
const studentAIPage = pages.get(resolve(root, 'ai/index.html')).html;
const prompts = [...studentAIPage.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)].map(match => unescape(match[1]));
assert.equal(prompts.length, 3, 'Three student prompts expected');
for (const prompt of prompts) {
  assert.ok(prompt.includes('https://design-for-changes.github.io/lab-learning/research/ai/manual/'), 'Prompt must point to the readable manual page');
  assert.ok(!prompt.includes('/downloads/for-ai.md'), 'Prompt still requires direct Markdown access');
}
// Full-text handoff must also work when clipboard permission is unavailable.
const guideScript = await readFile('research/public/guide.js', 'utf8');
const manualSource = await readFile('research/public/downloads/for-ai.md', 'utf8');
for (const clipboardAllowed of [true, false]) {
  let click, copied, selected = false;
  const field = { value: manualSource, focus() {}, select() { selected = true; } };
  const button = { hidden: true, addEventListener(type, handler) { if (type === 'click') click = handler; } };
  const fallback = { hidden: true }, status = { textContent: '' };
  const selectors = { '.copy-document': button, '.document-copy-fallback': fallback, '.document-copy-status': status };
  runInNewContext(guideScript, {
    document: { body: { dataset: { researchRoot: '../../' } }, querySelectorAll: () => [], querySelector: selector => selectors[selector], getElementById: id => id === 'document-markdown' ? field : null },
    window: { matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {} },
    location: { hash: '' },
    navigator: { clipboard: { async writeText(value) { if (!clipboardAllowed) throw new Error('Clipboard unavailable'); copied = value; } } },
  });
  assert.equal(button.hidden, false);
  await click();
  if (clipboardAllowed) {
    assert.equal(copied, manualSource, 'Full-text copy must preserve the entire Markdown');
    assert.equal(fallback.hidden, true);
  } else {
    assert.equal(fallback.hidden, false, 'Fallback must expose the full text');
    assert.equal(selected, true, 'Fallback must select the full text');
  }
}
assert.equal((research.match(/<details id=/g) || []).length, 30, 'Research explanations or references missing');
assert.equal((research.match(/<img /g) || []).length, 2, 'Research figures missing');
assert.ok(!/class="guide-search"|class="toc"|class="related-guide"|class="source-link"/.test(research), 'Removed sidebar content returned');
assert.ok(!/<details id="[^"]+" open/.test(research), 'Explanations should initially be closed');
const search = JSON.parse(await readFile(resolve(root, 'search-index.json'), 'utf8'));
for (const item of search) await checkReference(resolve(root, 'index.html'), item.href);
const anchors = JSON.parse(await readFile(resolve(root, 'anchor-map.json'), 'utf8'));
for (const href of Object.values(anchors)) await checkReference(resolve(root, 'index.html'), href);
for (const route of indesignRedirects) {
  assert.ok(pages.has(resolve(root, route.path, 'index.html')), `Missing redirect ${route.path}`);
  await checkReference(resolve(root, 'index.html'), route.target);
  for (const id of route.anchors) assert.equal(anchors[id], route.target, `Legacy anchor lost: ${id}`);
  const html = pages.get(resolve(root, route.path, 'index.html')).html;
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, `Missing redirect script: ${route.path}`);
  for (const id of ['', ...route.anchors]) {
    let destination;
    runInNewContext(script, { location: { hash: id ? '#' + id : '', search: '?review=legacy', replace: value => { destination = value; } } });
    const url = new URL(destination, 'https://example.test/lab-learning/research/' + route.path);
    assert.equal(url.pathname + url.hash, '/lab-learning/research/' + route.target, `Wrong redirect: ${route.path}#${id}`);
    assert.equal(url.search, '?review=legacy', 'Legacy redirect lost its query');
  }
}
assert.equal(await readFile(resolve(root, 'learning.css'), 'utf8'), await readFile('learning/src/style.css', 'utf8'), 'Shared design differs from learning');
console.log(`Research: ${files.length} pages, ${search.length} search targets, ${imageCount} images, navigation and anchors passed.`);
