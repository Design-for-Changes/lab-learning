import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { escapeHtml } from './share-metadata.mjs';
const source = await readFile('lab-inquiry/content/manual.md', 'utf8');
assert.equal(new TextDecoder('shift_jis').decode(await readFile('lab-inquiry/content/manual-shiftjis.md')), source, 'UTF-8 and Shift-JIS manuals must contain the same text');
for (const name of ['index.html', 'manual/index.html']) {
  const file = resolve('dist/lab-inquiry', name);
  const html = await readFile(file, 'utf8');
  if (name === 'manual/index.html') assert.equal(html.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/)?.[1], escapeHtml(source), 'Copy source must match full manual');
  else assert.ok(!html.includes('copy-document') && !html.includes('<textarea'), 'Overview must not contain manual copy controls');
  assert.ok(html.includes('data-document-version="2026-10-20-01"'));
  const nav = html.match(/<nav aria-label="サイト">([\s\S]*?)<\/nav>/)[1];
  assert.deepEqual([...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m => m[1]), ['ラボ探究', '研究ガイド', '学習資料']);
  for (const [, href] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(href)) continue;
    await access(resolve(dirname(file), href.endsWith('/') ? href + 'index.html' : href));
  }
}
assert.equal((source.match(/^#### 動画の内容$/gm) || []).length, 3);
assert.ok(source.includes('## LEARNING_EVIDENCE_GATE') && source.includes('### LEARNING_LOOP_E'));
assert.ok(source.includes('### 問い・回答・判断の意味を照合する') && source.includes('学習途中・提出用ではない'));
assert.ok(source.includes('問いの原文未保持') && source.includes('関心や自己申告だけを聞く問いではなく'));
assert.equal((source.match(/^- 確認した問い：$/gm) || []).length, 3);
assert.equal((source.match(/^- 本人の回答：$/gm) || []).length, 3);
console.log('Lab inquiry: full copy source, version, three video templates, navigation and links passed.');

const aggregate = JSON.parse(await readFile('lab-inquiry/content/interests-summary.json', 'utf8'));
assert.deepEqual(Object.keys(aggregate).sort(), ['updatedAt','session','students','markdownFiles','multipleFileStudents','status','domainMethod','themeMethod','privacy','domains','themes'].sort());
for (const groups of [aggregate.domains, aggregate.themes]) {
  assert.equal(groups.reduce((sum, group) => sum + group.count, 0), aggregate.students);
  for (const group of groups) {
    assert.deepEqual(Object.keys(group).sort(), ['label','count','unconfirmed'].sort());
    assert.ok(group.count >= 5);
  }
}
const aggregateText = JSON.stringify(aggregate);
assert.ok(!/CY\d{5}|@|\.zip|\.xlsx|\/Users\//i.test(aggregateText), 'No student IDs, contact data or source files in published aggregate');
const interestHtml = await readFile('dist/lab-inquiry/interests/index.html', 'utf8');
assert.ok(!/CY\d{5}|\/Users\/|fetch\(|<iframe|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(interestHtml));
const map = JSON.parse(await readFile('lab-inquiry/content/interest-map.json', 'utf8'));
assert.deepEqual(Object.keys(map).sort(), ['students','minimumGroup','groups','lenses','videoCells','videoCoverage','questionCells','choices','coverage','mapped','unmapped','quality','method',...(map.analysisVersion?['analysisVersion']:[]),...(map.videos?['videos']:[]),...(map.history?['history','timeline','explanationVideos']:[])].sort());
assert.equal(map.students,aggregate.students);
assert.equal(map.groups.reduce((s,g)=>s+g.count,0),map.mapped);
assert.equal(map.mapped+map.unmapped,map.students);
for(const g of map.groups){assert.ok(g.count>=5);assert.deepEqual(Object.keys(g).sort(),['id','count','label','terms'].sort());for(const t of g.terms)assert.ok(t.count>=5&&t.count<=g.count);}
for(const cells of [map.videoCells,map.questionCells,map.choices])for(const c of cells)assert.ok(Number.isInteger(c.count)&&c.count>=5&&c.count<=map.students);
for(const view of Object.values(map.lenses)){assert.equal(view.positions.length,map.groups.length);assert.ok(view.retained>=0&&view.retained<=1);for(const p of view.positions){assert.ok(Number.isFinite(p.x)&&Math.abs(p.x)<=1);assert.ok(Number.isFinite(p.y)&&Math.abs(p.y)<=1);}for(const c of view.context)for(const t of c.terms)assert.ok(t.count>=5&&t.count<=map.groups.find(g=>g.id===c.id).count);}
assert.notDeepEqual(map.lenses.interests.positions,map.lenses.video.positions);
assert.ok(!/CY\d{5}|@|\/Users\/|\.zip|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(JSON.stringify(map)), 'No private IDs or UUIDs in public data');
assert.ok(interestHtml.includes('aria-label="実施回"'));
await access('dist/lab-inquiry/interests-01/index.html');
for(const v of map.videos||[])assert.ok(interestHtml.includes(escapeHtml(v.label)));
assert.equal((interestHtml.match(/data-node="/g) || []).length,map.groups.length);
for (const asset of ['interest-map.css','interest-map.js']) await access('dist/lab-inquiry/assets/'+asset);
console.log('Interest page: aggregate-only schema, totals and minimum group size passed.');

const priorHtml = await readFile('dist/lab-inquiry/interests-01/index.html','utf8');
assert.ok(!/CY\d{5}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(priorHtml));

if(map.history){
 assert.equal(map.analysisVersion,'atlas-4-cumulative');
 assert.ok(interestHtml.includes('関心の蓄積を比較'));
 assert.equal(map.timeline.length,map.history.sessions.length);
 for(const t of map.timeline){
  assert.equal(t.view.positions.length,map.groups.length);
  for(const p of t.view.positions){assert.ok(Number.isFinite(p.x)&&Math.abs(p.x)<=1);assert.ok(Number.isFinite(p.y)&&Math.abs(p.y)<=1);}
  for(const c of t.view.context)for(const term of c.terms)assert.ok(term.count>=5&&term.count<=map.groups.find(g=>g.id===c.id).count);
 }
 assert.deepEqual(map.timeline.at(-1).view,map.lenses.interests);
 assert.notDeepEqual(map.timeline[0].view.positions,map.timeline.at(-1).view.positions);
 for(const v of map.explanationVideos)assert.ok(interestHtml.includes(escapeHtml(v.label)));
 console.log('Cumulative atlas: same cohort and groups across time, aggregate-only timeline and minimum disclosure passed.');
}
