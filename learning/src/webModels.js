export const sampleAuthors = [{ id: 7, name: '佐藤' }, { id: 8, name: '山田' }];
export const sampleArticles = [
  { id: 12, title: '展示のお知らせ', author_id: 7, status: 'published' },
  { id: 13, title: '模型の制作記録', author_id: 7, status: 'draft' },
  { id: 14, title: '街歩きの記録', author_id: 8, status: 'published' },
];

export function joinedArticles(authors, authorId = null, publishedOnly = true) {
  return sampleArticles.filter(article => (authorId === null || article.author_id === authorId) && (!publishedOnly || article.status === 'published'))
    .flatMap(article => authors.filter(author => author.id === article.author_id).map(author => ({ id: article.id, title: article.title, author: author.name })));
}

export function articleQuery(authorId = null, publishedOnly = true) {
  if (authorId !== null && !sampleAuthors.some(author => author.id === authorId)) throw new Error('Unknown author');
  const conditions = [];
  if (publishedOnly) conditions.push("a.status = 'published'");
  if (authorId !== null) conditions.push('a.author_id = $1');
  return {
    text: 'SELECT a.id, a.title, u.name AS author\nFROM articles AS a\nJOIN authors AS u\n  ON a.author_id = u.id' + (conditions.length ? '\nWHERE ' + conditions.join('\n  AND ') : '') + '\nORDER BY a.id;',
    values: authorId === null ? [] : [authorId],
  };
}

export function initialCmsState() {
  return { editor: { title: '展示のお知らせ', body: '9月の研究室展を開催します。' }, saved: null, published: null, reader: null, message: '見出しを書き換えてから、下書きを保存してみてください。' };
}
export function cmsHasChanges(state) { return !state.saved || state.editor.title.trim() !== state.saved.title || state.editor.body !== state.saved.body; }
export function cmsReducer(state, action) {
  if (action.type === 'reset') return initialCmsState();
  if (action.type === 'edit') {
    if (!['title', 'body'].includes(action.field)) return state;
    return { ...state, editor: { ...state.editor, [action.field]: action.value } };
  }
  if (action.type === 'save') {
    if (!state.editor.title.trim()) return { ...state, message: '見出しを入力してください。まだ保存していません。' };
    if (!cmsHasChanges(state)) return { ...state, message: 'この内容は保存済みです。' };
    return { ...state, saved: { id: 12, ...state.editor, title: state.editor.title.trim(), version: (state.saved?.version || 0) + 1 }, message: '下書きを保存しました。読者に公開する内容は、まだ変わりません。' };
  }
  if (action.type === 'publish') {
    if (!state.saved || cmsHasChanges(state)) return { ...state, message: '現在の内容を、先に下書きとして保存してください。' };
    return { ...state, published: { ...state.saved }, message: '保存した版を公開しました。「読者ページを取得」で表示を確かめてください。' };
  }
  if (action.type === 'read') return { ...state, reader: state.published ? { ...state.published } : null, message: state.published ? '公開中の記事を取得して、読者の画面に表示しました。' : '公開中の記事がないため、読者には表示されません。' };
  return state;
}
