import assert from 'node:assert/strict';
import { articleQuery, joinedArticles, sampleAuthors, initialCmsState, cmsReducer, cmsHasChanges } from '../src/webModels.js';

// Joining records must preserve identities, share a renamed author, and apply both filters.
assert.deepEqual(joinedArticles(sampleAuthors).map(row => row.id), [12, 14]);
assert.deepEqual(joinedArticles(sampleAuthors, 7, false).map(row => row.id), [12, 13]);
assert.deepEqual(joinedArticles(sampleAuthors, 7).map(row => row.id), [12]);
const renamed = sampleAuthors.map(author => ({ ...author, name: author.id === 7 ? '佐藤 花子' : author.name }));
assert.deepEqual(joinedArticles(renamed, null, false).map(row => row.author), ['佐藤 花子', '佐藤 花子', '山田']);
assert.equal(sampleAuthors[0].name, '佐藤');
assert.equal(joinedArticles(sampleAuthors.filter(author => author.id !== 7), null, false).length, 1);
assert.deepEqual(articleQuery(7).values, [7]);
assert.ok(articleQuery(7).text.includes('a.author_id = $1'));
assert.ok(!articleQuery(null, false).text.includes('WHERE'));
assert.throws(() => articleQuery('7 OR 1=1'));

// Saved, published and fetched snapshots have different lifetimes.
const initial = initialCmsState();
assert.equal(cmsReducer(initial, { type: 'publish' }).published, null);
assert.equal(cmsReducer(initial, { type: 'read' }).reader, null);
const saved = cmsReducer(initial, { type: 'save' });
assert.equal(saved.saved.version, 1);
assert.equal(saved.published, null);
assert.equal(cmsHasChanges(saved), false);
const live = cmsReducer(saved, { type: 'publish' });
assert.equal(live.reader, null);
const fetched = cmsReducer(live, { type: 'read' });
const edited = cmsReducer(fetched, { type: 'edit', field: 'title', value: '新しい展示' });
assert.ok(cmsHasChanges(edited));
assert.equal(cmsReducer(edited, { type: 'publish' }).published.title, initial.editor.title);
const revised = cmsReducer(edited, { type: 'save' });
assert.equal(revised.saved.version, 2);
assert.equal(revised.published.title, initial.editor.title);
const publishedAgain = cmsReducer(revised, { type: 'publish' });
assert.equal(publishedAgain.published.title, '新しい展示');
assert.equal(publishedAgain.reader.title, initial.editor.title);
assert.equal(cmsReducer(publishedAgain, { type: 'read' }).reader.title, '新しい展示');
assert.equal(cmsReducer(publishedAgain, { type: 'save' }).saved.version, 2);
assert.equal(cmsReducer(cmsReducer(revised, { type: 'edit', field: 'title', value: '  ' }), { type: 'save' }).saved.version, 2);
assert.deepEqual(cmsReducer(publishedAgain, { type: 'reset' }), initial);
assert.equal(initial.saved, null);
console.log('Web: relational joins, parameterized queries and CMS save/publish/read boundaries passed.');
