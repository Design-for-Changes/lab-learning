import { useEffect, useState } from 'react';
import PageLink from './PageLink.jsx';
import { Portal, Sidebar } from './CourseNavigation.jsx';
import NotFound from './NotFound.jsx';
import { findCourse, courseForRoute, resolveLearningRoute } from './courseRegistry.jsx';
import { routeFromLocation, routePath } from './pageRouting.js';
import { learningMetadata, updatePageMetadata } from './pageMetadata.js';

export { learningPaths, courseForRoute, resolveLearningRoute } from './courseRegistry.jsx';

function currentRoute() {
  return resolveLearningRoute(routeFromLocation(window.location));
}

export default function App({ initialRoute } = {}) {
  // Static rendering supplies a route directly; only the browser reads location.
  const [route, setRoute] = useState(() => initialRoute === undefined ? currentRoute() : resolveLearningRoute(initialRoute));

  useEffect(() => {
    const update = () => {
      const next = currentRoute();
      if (location.hash.startsWith('#/')) {
        location.replace(routePath(next) + location.search);
        return;
      }
      setRoute(next);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  useEffect(() => {
    updatePageMetadata(learningMetadata(document.querySelector('main')?.outerHTML || '', route, courseForRoute(route)));
    if (route !== '/') document.getElementById('main')?.focus({ preventScroll: true });
  }, [route]);

  const Page = findCourse(route)?.Component || NotFound;
  return <>
    <PageLink className="skip" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); }}>本文へ</PageLink>
    <header className="site-header">
      <PageLink className="wordmark" href="#/">Learning<span>動態デザイン研究室</span></PageLink>
      <nav aria-label="サイト"><PageLink href="../research/">研究ガイド</PageLink><PageLink href="#/" aria-current="page">学習資料</PageLink></nav>
    </header>
    {route === '/' ? <Portal/> : <div className="atlas">
      <Sidebar route={route}/>
      <main className="method-main" id="main" tabIndex="-1" key={route}><Page route={route}/></main>
    </div>}
    <footer className="site-footer"><span>動態デザイン研究室　学習資料</span><PageLink href="https://github.com/Design-for-Changes/lab-learning">GitHub ↗</PageLink></footer>
  </>;
}
