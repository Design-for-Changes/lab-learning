import { methodCatalog } from '../methodCatalog.js';

export const statisticsLinks = [
  [
    "/statistics/basics",
    "01　統計解析とデータの基礎"
  ],
  [
    "/statistics/inference",
    "02　推定と検定"
  ],
  [
    "/statistics/variables",
    "03　データと変数"
  ],
  [
    "/statistics/experiments",
    "04　実験計画法"
  ],
  [
    "/statistics/choose",
    "05　解析を選ぶ・調べる"
  ],
  [
    "/statistics/checks",
    "06　解析の注意点"
  ],
  [
    "/statistics/tools",
    "07　実施する方法"
  ]
];

export const statisticsAliases = {
  "/statistics/distributions": "/statistics/basics",
  "/statistics/methods": "/statistics/choose"
};

export const statisticsExtraPaths = ['/statistics/python', ...Object.keys(methodCatalog).map(id => `/statistics/method/${id}`)];

export function statisticsChapterForRoute(route) {
  return route.startsWith('/statistics/method/') ? '/statistics/choose' : route;
}
