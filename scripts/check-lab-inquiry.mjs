import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { escapeHtml } from './share-metadata.mjs';
const source = await readFile('lab-inquiry/content/manual.md', 'utf8');
for (const name of ['index.html', 'manual/index.html']) {
  const file = resolve('dist/lab-inquiry', name);
  const html = await readFile(file, 'utf8');
  assert.equal(html.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/)?.[1], escapeHtml(source), 'Copy source must match full manual');
  assert.ok(html.includes('data-document-version="2026-10-05-01"'));
  const nav = html.match(/<nav aria-label="サイト">([\s\S]*?)<\/nav>/)[1];
  assert.deepEqual([...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m => m[1]), ['ラボ探究', '研究ガイド', '学習資料']);
  for (const [, href] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(href)) continue;
    await access(resolve(dirname(file), href.endsWith('/') ? href + 'index.html' : href));
  }
}
assert.equal((source.match(/^#### 動画の内容$/gm) || []).length, 3);
console.log('Lab inquiry: full copy source, version, three video templates, navigation and links passed.');
