import WebCourse, { webLinks, webAliases } from './WebCourse.jsx';
import DesignStudyCourse, { designStudyLinks, designStudyAliases } from './DesignStudyCourse.jsx';
import ScienceCourse, { scienceLinks } from './ScienceCourse.jsx';
import EconomicsCourse, { economicsLinks, economicsAliases } from './EconomicsCourse.jsx';
import NeuroscienceCourse, { neuroscienceLinks, neuroscienceAliases } from './NeuroscienceCourse.jsx';
import PsychologyCourse, { psychologyLinks } from './PsychologyCourse.jsx';
import { managementAliases } from './managementContent.js';
import ManagementCourse, { managementLinks } from './ManagementCourse.jsx';
import EvolutionCourse, { evolutionLinks, evolutionAliases } from './EvolutionCourse.jsx';
import AiCourse, { aiLinks } from './AiCourse.jsx';
import AiIntroCourse, { aiIntroLinks, aiIntroAliases } from './AiIntroCourse.jsx';
import StatisticsCourse, { statisticsLinks, statisticsAliases, statisticsExtraPaths, statisticsChapterForRoute } from './StatisticsCourse.jsx';

// The catalog, chapter navigation, page renderer and build all read this registration.
export const courses = [
  {
    path: '/statistics', title: '統計解析入門',
    description: 'データを読み、問いに合う解析を考える。',
    Component: StatisticsCourse, links: statisticsLinks, sidebarLabel: '統計解析のメニュー',
    aliases: statisticsAliases,
    extraPaths: statisticsExtraPaths, activeChapter: statisticsChapterForRoute,
  },
  {
    path: '/ai', title: '人工知能学習入門',
    description: '離散数学とグラフから、ニューラルネットワークの学習へ進む。',
    Component: AiCourse, links: aiLinks, sidebarLabel: '人工知能学習のメニュー',
  },
  {
    path: '/management', title: 'マネジメント入門',
    description: '文献から転換点をたどり、人と組織の営みを考える。',
    Component: ManagementCourse, links: managementLinks, sidebarLabel: 'マネジメント入門のメニュー',
    aliases: managementAliases,
  },
  {
    path: '/evolution', title: '進化生物学入門',
    description: '現代の理解を押さえ、発見と論争の歴史からデザインとの関係を考える。',
    Component: EvolutionCourse, links: evolutionLinks, sidebarLabel: '進化生物学のメニュー',
    aliases: evolutionAliases,
  },
  {
    path: '/neuroscience', title: '脳科学入門',
    description: '細胞と回路の働きを学び、いま分かることと残る問いを考える。',
    Component: NeuroscienceCourse, links: neuroscienceLinks, sidebarLabel: '脳科学入門のメニュー',
    aliases: neuroscienceAliases,
  },
  {
    path: '/psychology', title: '心理学入門',
    description: '心と行動の研究を、歴史・実験方法・心理効果から学ぶ。',
    Component: PsychologyCourse, links: psychologyLinks, sidebarLabel: '心理学入門のメニュー',
  },
  {
    path: '/design', title: 'デザイン学入門',
    description: '一つの核に収まらない学問を、歴史・経験・対話から学ぶ。',
    Component: DesignStudyCourse, links: designStudyLinks, sidebarLabel: 'デザイン学入門のメニュー',
    aliases: designStudyAliases,
  },
  {
    path: '/science', title: '科学入門',
    description: '科学が知識をつくる方法と、理解・利用・設計をめぐる変遷を学ぶ。',
    Component: ScienceCourse, links: scienceLinks, sidebarLabel: '科学入門のメニュー',
  },
  {
    path: '/economics', title: '経済学入門',
    description: '成立の歴史からミクロ・マクロを学び、理論と実証の研究方法を考える。',
    Component: EconomicsCourse, links: economicsLinks, sidebarLabel: '経済学入門のメニュー',
    aliases: economicsAliases,
  },
  {
    path: '/web', title: 'ウェブインタラクション入門',
    description: '画面・通信・データのつながりから、CMSの仕組みを学ぶ。',
    Component: WebCourse, links: webLinks, sidebarLabel: 'ウェブインタラクション入門のメニュー',
    aliases: webAliases,
  },
  {
    path: '/ai-intro', title: 'AI入門',
    description: '生成AIの仕組みと挙動特性を知り、AIと自分の作業環境を考える。',
    Component: AiIntroCourse, links: aiIntroLinks, sidebarLabel: 'AI入門のメニュー',
    aliases: aiIntroAliases,
  },
];

const availableCourses = courses.filter(course => course.path);
const entryRoutes = Object.fromEntries(availableCourses.map(course => [course.path, course.links[0][0]]));
const aliases = Object.assign({}, entryRoutes, ...availableCourses.map(course => course.aliases));

export function resolveLearningRoute(route) {
  return aliases[route] || route;
}

export function findCourse(route) {
  return availableCourses.find(course => route === course.path || route.startsWith(course.path + '/'));
}

export function courseForRoute(route) {
  return findCourse(route)?.title || '';
}

export const learningPaths = [...new Set([
  '/',
  ...availableCourses.flatMap(course => [
    course.path,
    ...course.links.map(([path]) => path),
    ...Object.keys(course.aliases || {}),
    ...(course.extraPaths || []),
  ]),
])];
