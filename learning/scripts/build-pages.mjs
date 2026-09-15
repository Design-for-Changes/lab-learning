import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { shareMetadata } from '../../scripts/share-metadata.mjs';
import { pageAssets } from './page-assets.mjs';

const shell = await readFile('dist/index.html', 'utf8');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const server = await createServer({ server: {middlewareMode:true,watch:null,ws:false}, appType:'custom' });
try {
 const { default:App, learningPaths, resolveLearningRoute, courseForRoute } = await server.ssrLoadModule('/src/App.jsx');
 const { courses, findCourse, loadCourse } = await server.ssrLoadModule('/src/courseRegistry.jsx');
 const { learningMetadata } = await server.ssrLoadModule('/src/pageMetadata.js');
 const { learningBase, routePath } = await server.ssrLoadModule('/src/pageRouting.js');
 const { default:React } = await import('react');
 const { renderToString } = await import('react-dom/server');
 const pages = [];
 for (const requested of learningPaths) {
  const route = resolveLearningRoute(requested);
  const Course = await loadCourse(route);
  const markup = renderToString(React.createElement(App, { initialRoute: route, Course }));
  assert.ok(!markup.includes('ページが見つかりません'), requested);
  const metadata = learningMetadata(markup, route, courseForRoute(route));
  assert.ok(metadata.title && metadata.description, requested);
  if (route !== '/') assert.ok(!metadata.title.startsWith('学習資料｜'), `${requested}: generic title`);
  const assets = pageAssets(manifest, ['index.html', findCourse(route)?.module.slice(1)]);
  for (const other of courses.filter(course => course.path && course !== findCourse(route))) {
   assert.ok(!assets.scripts.includes(manifest[other.module.slice(1)].file), `${requested}: loads unrelated course ${other.path}`);
  }
  const assetLinks = [
   ...assets.styles.filter(file => !shell.includes(learningBase + file)).map(file => `<link rel="stylesheet" href="${learningBase + file}">`),
   ...assets.scripts.filter(file => !shell.includes(learningBase + file)).map(file => `<link rel="modulepreload" href="${learningBase + file}">`),
  ].join('\n');
  const head = shell.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\b[^>]*name="description"[^>]*>/, '')
   .replace('</head>', shareMetadata(metadata) + '\n' + assetLinks + '\n</head>');
  const html = head.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  assert.equal((html.match(/property="og:title"/g)||[]).length, 1, requested);
  const directory = resolve('dist', requested.replace(/^\//, ''));
  await mkdir(directory, {recursive:true});
  await writeFile(resolve(directory,'index.html'), html);
  pages.push({ path:routePath(requested), route, ...metadata });
 }
 // Validate each HTML response and its page/file links, without running browser JavaScript.
 for (const page of pages) {
  const html = await readFile(resolve('dist',page.path.slice(learningBase.length),'index.html'),'utf8');
  assert.ok(!/href="#\//.test(html), `${page.path}: legacy share URL`);
  for (const [, href] of html.matchAll(/\b(?:href|src)="([^\"]+)"/g)) {
   if (!href.startsWith(learningBase)) continue;
   const url = new URL(href, 'https://example.invalid');
   const file = resolve('dist', url.pathname.slice(learningBase.length));
   await access(url.pathname.endsWith('/') ? resolve(file,'index.html') : file);
  }
 }
 await writeFile('dist/page-index.json', JSON.stringify(pages,null,2));
 console.log(`Learning share pages: ${pages.length} HTML responses with unique page metadata; internal links and assets passed.`);
} finally {
 await server.close();
}
