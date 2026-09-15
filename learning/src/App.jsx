import { useEffect } from 'react';
import PageLink from './PageLink.jsx';
import { Portal, Sidebar } from './CourseNavigation.jsx';
import NotFound from './NotFound.jsx';
import { courseForRoute, resolveLearningRoute } from './courseRegistry.jsx';
import { learningMetadata, updatePageMetadata } from './pageMetadata.js';

export { learningPaths, courseForRoute, resolveLearningRoute } from './courseRegistry.jsx';

export default function App({ initialRoute = '/', Course }) {
  const route = resolveLearningRoute(initialRoute);

  useEffect(() => {
    updatePageMetadata(learningMetadata(document.querySelector('main')?.outerHTML || '', route, courseForRoute(route)));
    if (route !== '/') document.getElementById('main')?.focus({ preventScroll: true });
  }, [route]);

  const Page = Course || NotFound;
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
