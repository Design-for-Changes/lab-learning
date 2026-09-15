export const economicsLinks = [
  ['/economics/basics', '01　経済学の基本'],
  ['/economics/history', '02　経済学の成立と展開'],
  ['/economics/micro', '03　ミクロ経済学'],
  ['/economics/macro', '04　マクロ経済学'],
  ['/economics/methods', '05　研究アプローチ'],
];

export const economicsAliases = { '/economics': '/economics/basics', '/economics/design': '/economics/basics' };

export const resolveEconomicsRoute = route => economicsAliases[route] || route;
