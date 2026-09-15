import assert from 'node:assert/strict';
import { createModuleLoader } from '../src/courseLoader.js';
import { pageAssets } from './page-assets.mjs';

let attempts = 0;
const Course = () => null;
const load = createModuleLoader({
  '/course': async () => { attempts += 1; return { default: Course }; },
  '/retry': async () => { if (attempts++ === 1) throw new Error('offline'); return { default: Course }; },
  '/unused': () => { throw new Error('An unrelated course was loaded'); },
});
const first = load('/course');
assert.equal(load('/course'), first, 'Concurrent requests reuse one import');
assert.equal(await first, Course);
assert.equal(attempts, 1);
await assert.rejects(load('/retry'), /offline/);
assert.equal(await load('/retry'), Course, 'A failed import can be retried');
await assert.rejects(load('/missing'), /Unregistered course/);

const assets = pageAssets({
  shell: { file: 'shell.js', imports: ['shared'], dynamicImports: ['other'], css: ['base.css'] },
  lesson: { file: 'lesson.js', imports: ['shared'], css: ['lesson.css'] },
  shared: { file: 'shared.js', css: ['base.css'] },
  other: { file: 'other.js', css: ['other.css'] },
}, ['shell', 'lesson']);
assert.deepEqual(assets, { scripts: ['shared.js', 'shell.js', 'lesson.js'], styles: ['base.css', 'lesson.css'] });
assert.throws(() => pageAssets({}, ['missing']), /Missing built entry/);
console.log('Course loading: isolated imports, shared requests, retries and page styles passed.');
