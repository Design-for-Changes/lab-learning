import { dtpLinks } from './navigation/dtp.js';
import { webLinks, webAliases } from './navigation/web.js';
import { economicsLinks, economicsAliases } from './navigation/economics.js';
import { designStudyLinks, designStudyAliases } from './navigation/design.js';
import { scienceLinks } from './navigation/science.js';
import { psychologyLinks } from './navigation/psychology.js';
import { neuroscienceLinks, neuroscienceAliases } from './navigation/neuroscience.js';
import { managementLinks } from './navigation/management.js';
import { aiLinks } from './navigation/ai.js';
import { aiIntroLinks, aiIntroAliases } from './navigation/aiIntro.js';
import { evolutionLinks, evolutionAliases } from './navigation/evolution.js';
import { statisticsLinks, statisticsAliases, statisticsExtraPaths, statisticsChapterForRoute } from './navigation/statistics.js';
import { managementAliases } from './navigation/management.js';
import { createModuleLoader } from './courseLoader.js';

// The catalog, chapter navigation, page renderer and build all read this registration.
export const courses = [
  {
    path: '/statistics', title: '統計解析入門',
    description: 'データを読み、問いに合う解析を考える。',
    module: '/src/StatisticsCourse.jsx', links: statisticsLinks, sidebarLabel: '統計解析のメニュー',
    aliases: statisticsAliases,
    extraPaths: statisticsExtraPaths, activeChapter: statisticsChapterForRoute,
  },
  {
    path: '/ai', title: '人工知能学習入門',
    description: '離散数学とグラフから、ニューラルネットワークの学習へ進む。',
    module: '/src/AiCourse.jsx', links: aiLinks, sidebarLabel: '人工知能学習のメニュー',
  },
  {
    path: '/management', title: 'マネジメント入門',
    description: '文献から転換点をたどり、人と組織の営みを考える。',
    module: '/src/ManagementCourse.jsx', links: managementLinks, sidebarLabel: 'マネジメント入門のメニュー',
    aliases: managementAliases,
  },
  {
    path: '/evolution', title: '進化生物学入門',
    description: '現代の理解を押さえ、発見と論争の歴史からデザインとの関係を考える。',
    module: '/src/EvolutionCourse.jsx', links: evolutionLinks, sidebarLabel: '進化生物学のメニュー',
    aliases: evolutionAliases,
  },
  {
    path: '/neuroscience', title: '脳科学入門',
    description: '細胞と回路の働きを学び、いま分かることと残る問いを考える。',
    module: '/src/NeuroscienceCourse.jsx', links: neuroscienceLinks, sidebarLabel: '脳科学入門のメニュー',
    aliases: neuroscienceAliases,
  },
  {
    path: '/psychology', title: '心理学入門',
    description: '心と行動の研究を、歴史・実験方法・心理効果から学ぶ。',
    module: '/src/PsychologyCourse.jsx', links: psychologyLinks, sidebarLabel: '心理学入門のメニュー',
  },
  {
    path: '/design', title: 'デザイン学入門',
    description: '一つの核に収まらない学問を、歴史・経験・対話から学ぶ。',
    module: '/src/DesignStudyCourse.jsx', links: designStudyLinks, sidebarLabel: 'デザイン学入門のメニュー',
    aliases: designStudyAliases,
  },
  {
    path: '/science', title: '科学入門',
    description: '科学が知識をつくる方法と、理解・利用・設計をめぐる変遷を学ぶ。',
    module: '/src/ScienceCourse.jsx', links: scienceLinks, sidebarLabel: '科学入門のメニュー',
  },
  {
    path: '/economics', title: '経済学入門',
    description: '成立の歴史からミクロ・マクロを学び、理論と実証の研究方法を考える。',
    module: '/src/EconomicsCourse.jsx', links: economicsLinks, sidebarLabel: '経済学入門のメニュー',
    aliases: economicsAliases,
  },
  {
    path: '/web', title: 'ウェブインタラクション入門',
    description: '画面・通信・データのつながりから、CMSの仕組みを学ぶ。',
    module: '/src/WebCourse.jsx', links: webLinks, sidebarLabel: 'ウェブインタラクション入門のメニュー',
    aliases: webAliases,
  },
  {
    path: '/dtp', title: 'DTP入門',
    description: '文字組み・配置と、色・解像度・裁ち落としなど印刷の基本を学ぶ。',
    module: '/src/DtpCourse.jsx', links: dtpLinks, sidebarLabel: 'DTP入門のメニュー',
  },
  {
    path: '/ai-intro', title: 'AI入門',
    description: '生成AIの仕組みと挙動特性を知り、AIと自分の作業環境を考える。',
    module: '/src/AiIntroCourse.jsx', links: aiIntroLinks, sidebarLabel: 'AI入門のメニュー',
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

// Dynamic imports keep lesson text, figures and data out of the portal bundle.
const loadModule = createModuleLoader(import.meta.glob('/src/*Course.jsx'));
export function loadCourse(route) {
  const course = findCourse(resolveLearningRoute(route));
  return course ? loadModule(course.module) : Promise.resolve(null);
}
