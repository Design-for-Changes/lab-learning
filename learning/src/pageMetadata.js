import { SITE_NAME, SITE_URL, plainText } from '../../scripts/share-metadata.mjs';
import { routePath } from './pageRouting.js';

export function learningMetadata(html, route, course = '') {
 const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || html;
 const heading = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
 const title = plainText(heading?.[1]) || '学習資料';
 const afterHeading = heading ? main.slice(heading.index + heading[0].length) : main;
 const paragraphs = [...afterHeading.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)];
 const intro = paragraphs.find(([, attributes, content]) => !/class="[^"]*(?:eyebrow|small-note|source-note|copy-status)/.test(attributes) && plainText(content));
 const description = route === '/' ? '動態デザイン研究室の学習資料。統計、AI、マネジメントなどを、解説と操作できる図で学びます。' : (plainText(intro?.[2]) || `${course}の「${title}」について学びます。`).slice(0, 160);
 return {
  title: [title, course && course !== title ? course : '', SITE_NAME].filter(Boolean).join('｜'),
  description,
  url: new URL(routePath(route), SITE_URL).href,
 };
}

export function updatePageMetadata(metadata) {
 document.title = metadata.title;
 for (const [attribute, key, content] of [
  ['name','description',metadata.description], ['property','og:title',metadata.title],
  ['property','og:description',metadata.description], ['property','og:url',metadata.url],
  ['property','og:type','website'], ['property','og:site_name',SITE_NAME], ['property','og:locale','ja_JP'],
  ['name','twitter:card','summary'], ['name','twitter:title',metadata.title], ['name','twitter:description',metadata.description],
 ]) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
  element.content = content;
 }
 let canonical = document.head.querySelector('link[rel="canonical"]');
 if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
 canonical.href = metadata.url;
}
