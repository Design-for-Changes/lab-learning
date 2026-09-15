import PageLink from './PageLink.jsx';
import { courses, findCourse } from './courseRegistry.jsx';

export function Portal() {
  return <main id="main" className="home" tabIndex="-1">
    <h1 className="visually-hidden">学習資料</h1>
    <div className="portal-grid">{courses.map(({ title, description, path }, index) =>
      <article className={`subject ${path ? 'available' : ''}`} key={title}>
        <div className="subject-meta"><span className="course-no">{String(index + 1).padStart(2, '0')}</span><span>{path ? '学習する' : '準備中'}</span></div>
        <h2>{path ? <PageLink href={`#${path}`}>{title}</PageLink> : title}</h2><p>{description}</p>
        {path && <PageLink className="text-link" href={`#${path}`}>教材をひらく <span aria-hidden="true">↗</span></PageLink>}
      </article>
    )}</div>
  </main>;
}

export function Sidebar({ route }) {
  const course = findCourse(route) || courses[0];
  const activePath = course.activeChapter?.(route) || route;
  return <aside className="catalog-nav" aria-label={course.sidebarLabel}>
    <PageLink className="back-index" href="#/">← 学習資料</PageLink>
    <nav className="chapter-nav">{course.links.map(([path, name]) =>
      <PageLink key={path} href={`#${path}`} aria-current={activePath === path ? 'page' : undefined}>{name}</PageLink>
    )}</nav>
  </aside>;
}
