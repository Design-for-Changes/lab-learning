import assert from 'node:assert/strict';
import { pageHref, routeFromLocation, routePath } from '../src/pageRouting.js';
import { learningMetadata } from '../src/pageMetadata.js';
import { shareMetadata } from '../../scripts/share-metadata.mjs';

assert.equal(pageHref('#/ai-intro/partnership'), '/lab-learning/learning/ai-intro/partnership/');
assert.equal(pageHref('#/'), '/lab-learning/learning/');
assert.equal(pageHref('../research/'), '/lab-learning/research/');
assert.equal(pageHref('#main'), '#main');
assert.equal(pageHref('https://example.org/paper'), 'https://example.org/paper');
assert.equal(pageHref('/lab-learning/learning/data/example.csv'), '/lab-learning/learning/data/example.csv');
assert.equal(routePath('/statistics/basics#example'), '/lab-learning/learning/statistics/basics/#example');
for (const route of ['/', '/ai-intro/partnership', '/statistics/method/pca']) {
 assert.equal(routeFromLocation({hash:'#'+route}), route);
 assert.equal(routeFromLocation({pathname:routePath(route),hash:''}), route);
 assert.equal(routeFromLocation({pathname:routePath(route)+'index.html',hash:'#main'}), route);
}
const metadata=learningMetadata('<main><p class="eyebrow">AI入門 / 03</p><h1>AIとの向き合い方</h1><section><p>AIと自分の作業環境を整える。</p></section></main>', '/ai-intro/partnership', 'AI入門');
assert.equal(metadata.title,'AIとの向き合い方｜AI入門｜動態デザイン研究室');
assert.equal(metadata.description,'AIと自分の作業環境を整える。');
assert.equal(metadata.url,'https://design-for-changes.github.io/lab-learning/learning/ai-intro/partnership/');
const escaped=shareMetadata({title:'A "quote" & <tag>',description:'a < b',url:metadata.url});
assert.ok(escaped.includes('content="A &quot;quote&quot; &amp; &lt;tag&gt;"'));
assert.ok(!escaped.includes('<tag>'));
console.log('Share routes: path URLs, legacy hashes, anchor/download links and escaped metadata passed.');
