export { statisticsLinks, statisticsAliases, statisticsExtraPaths, statisticsChapterForRoute } from './navigation/statistics.js';
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

const pages = new Map([
  ['/statistics/basics', Basics],
  ['/statistics/inference', InferenceLesson],
  ['/statistics/variables', Variables],
  ['/statistics/experiments', ExperimentalDesignLesson],
  ['/statistics/choose', Chooser],
  ['/statistics/checks', ChecksLesson],
  ['/statistics/tools', ToolsLesson],
  ['/statistics/python', PythonLesson],
]);

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
