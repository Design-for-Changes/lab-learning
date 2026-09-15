export const psychologyLinks = [
  ['/psychology/foundations', '01　心理学は何を調べるか'],
  ['/psychology/history', '02　考え方と研究方法の歴史'],
  ['/psychology/methods', '03　実験・調査を組み立てる'],
  ['/psychology/effects', '04　心理効果・現象の一覧'],
];

export const resolvePsychologyRoute = path => path === '/psychology' ? '/psychology/foundations' : path;
