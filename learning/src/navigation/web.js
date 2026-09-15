export const webLinks = [
  ['/web/overview', '01　フロントエンドとバックエンド'],
  ['/web/document', '02　HTML・CSS・DOM'],
  ['/web/javascript', '03　JavaScriptとフレームワーク'],
  ['/web/database', '04　バックエンドとデータベース'],
  ['/web/cms', '05　CMSの仕組み'],
  ['/web/practice', '06　実際にインタラクションを実装するには？'],
];

export const webAliases = { '/web': '/web/overview' };

export const resolveWebRoute = route => webAliases[route] || route;
