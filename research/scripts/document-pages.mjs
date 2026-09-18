import { readFile } from 'node:fs/promises';
import { Marked } from 'marked';
import { escapeHtml, plainText, SITE_URL } from '../../scripts/share-metadata.mjs';

export const documentPages = [
  { path: 'ai/manual/', file: 'for-ai.md', title: 'for AIマニュアル', description: '研究の整合性を検討し、学生との対話で研究ノート・ゼミ資料・計画を更新するAI向けの仕様書。' },
  { path: 'ai/report/', file: 'ai-research-status.md', title: '研究ノート・ゼミ資料の仕様', description: '研究全体の図、進捗、計画と相談、タイムラインの共通フォーマット。' },
  { path: 'ai/workflow/', file: 'student-research-record.md', title: '学生の記録・提出手順', description: 'AIと研究ノートを作り、ゼミ前の準備からフィードバックの反映・提出まで進める手順。' },
  { path: 'ai/questions/', file: 'questions.md', title: '教員への相談文書の雛形', description: '行動計画に結び付けて、教員に判断してほしいことを整理する雛形。' },
];

export function documentMetadata(source) {
  const match = source.match(/^# [^\n]+\n\n(バージョン：`(\d{4}-\d{2}-\d{2}-\d{2})` · 更新日：(\d{4}-\d{2}-\d{2}))\n/);
  if (!match) throw new Error('Document version or update date missing');
  return { line: match[1], version: match[2], updatedAt: match[3] };
}

// Both the readable page and full-text copy are generated from the downloadable original.
export async function renderDocument(document, root) {
  const source = await readFile('public/downloads/' + document.file, 'utf8');
  const metadata = documentMetadata(source);
  const toc = [];
  let headingIndex = 0;
  const renderer = {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const level = Math.max(2, depth);
      const id = 'document-section-' + (++headingIndex);
      toc.push({ id, title: plainText(text), level });
      return `<h${level} id="${id}">${text}</h${level}>\n`;
    },
  };
  const parser = new Marked({ renderer });
  const tokens = parser.lexer(source.replace(metadata.line + '\n', ''));
  if (tokens[0]?.type !== 'heading' || tokens[0].depth !== 1) throw new Error('Document title missing: ' + document.file);
  const title = plainText(parser.parseInline(tokens.shift().text));
  const article = parser.parser(tokens).replace(/href="https:\/\/design-for-changes\.github\.io\/lab-learning\/research\//g, 'href="' + root);
  const contents = '<details class="document-contents"><summary>この文書の目次</summary><nav aria-label="文書の目次"><ol>' + toc.filter(item => item.level === 2).map(item => `<li><a href="#${item.id}">${escapeHtml(item.title)}</a></li>`).join('') + '</ol></nav></details>';
  const toolbar = `<div class="document-actions"><button type="button" class="copy-document" hidden>全文をコピー</button><a href="${root}downloads/${document.file}" download="${document.file}">Markdown版を保存</a><span class="document-copy-status" role="status"></span></div>`;
  const fallback = `<div class="document-copy-fallback" hidden><label for="document-markdown">全文を選択しています。コピーしてAIに貼り付けてください。</label><textarea id="document-markdown" readonly>${escapeHtml(source)}</textarea></div>`;
  const links = documentPages.map(item => `<a href="${root}${item.path}"${item.path === document.path ? ' aria-current="page"' : ''}>${escapeHtml(item.title)}</a>`).join('');
  const related = `<nav class="document-related" aria-label="AIと一緒につくるの文書">${links}</nav>`;
  const version = `<p class="document-version" data-document-version="${metadata.version}">バージョン：<code>${metadata.version}</code><span>更新日：<time datetime="${metadata.updatedAt}">${metadata.updatedAt}</time></span></p>`;
  return { title, source, toc, body: version + toolbar + fallback + contents + `<article id="document-content" class="prose document-content">${article}</article>` + related, url: new URL('research/' + document.path, SITE_URL).href };
}
