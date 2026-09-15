import { methods, groupNames } from './content.js';
import { MethodPractice } from './MethodPractice.jsx';
import { Sources, Next } from './Common.jsx';
import NotFound from './NotFound.jsx';
import Basics from './StatisticsBasicsLesson.jsx';
import Variables from './StatisticsVariablesLesson.jsx';
import Chooser from './Chooser.jsx';
import PythonLesson from './PythonLesson.jsx';
import InferenceLesson from './InferenceLesson.jsx';
import ExperimentalDesignLesson from './ExperimentalDesignLesson.jsx';
import ChecksLesson from './ChecksLesson.jsx';
import ToolsLesson from './ToolsLesson.jsx';

const chapters = [
  ['/statistics/basics', '01　統計解析とデータの基礎', Basics],
  ['/statistics/inference', '02　推定と検定', InferenceLesson],
  ['/statistics/variables', '03　データと変数', Variables],
  ['/statistics/experiments', '04　実験計画法', ExperimentalDesignLesson],
  ['/statistics/choose', '05　解析を選ぶ・調べる', Chooser],
  ['/statistics/checks', '06　解析の注意点', ChecksLesson],
  ['/statistics/tools', '07　実施する方法', ToolsLesson],
  ['/statistics/python', null, PythonLesson],
];

export const statisticsLinks = chapters.filter(([, label]) => label).map(([path, label]) => [path, label]);
export const statisticsAliases = {
  '/statistics/distributions': '/statistics/basics',
  '/statistics/methods': '/statistics/choose',
};
export const statisticsExtraPaths = [
  ...chapters.filter(([, label]) => !label).map(([path]) => path),
  ...methods.map(method => `/statistics/method/${method.id}`),
];
const pages = new Map(chapters.map(([path, , Component]) => [path, Component]));

export function statisticsChapterForRoute(route) {
  return route.startsWith('/statistics/method/') ? '/statistics/choose' : route;
}

function Method({ id }) {
  const m = methods.find(method => method.id === id);
  if (!m) return <NotFound/>;
  return <><p className="eyebrow">{groupNames[m.group]}</p><h1>{m.name}</h1><MethodPractice method={m}/><Sources links={m.sources}/><Next href="/statistics/choose" label="条件を変えて、ほかの候補と比べる"/></>;
}

export default function StatisticsCourse({ route }) {
  const Page = pages.get(route);
  if (Page) return <Page/>;
  if (route.startsWith('/statistics/method/')) return <Method id={route.split('/').pop()}/>;
  return <NotFound/>;
}
