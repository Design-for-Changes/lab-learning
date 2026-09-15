import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { loadCourse, resolveLearningRoute } from './courseRegistry.jsx';
import { legacyRouteTarget, routeFromLocation } from './pageRouting.js';
import './style.css';

function redirectLegacyRoute() {
  const target = legacyRouteTarget(location, resolveLearningRoute);
  if (target) location.replace(target);
  return Boolean(target);
}

async function start() {
  if (redirectLegacyRoute()) return;
  window.addEventListener('hashchange', redirectLegacyRoute);
  const initialRoute = resolveLearningRoute(routeFromLocation(location));
  const Course = await loadCourse(initialRoute);
  const element = <App initialRoute={initialRoute} Course={Course}/>;
  const root = document.getElementById('root');
  // Built pages already contain the lesson. Development starts with an empty shell.
  if (root.hasChildNodes()) hydrateRoot(root, element);
  else createRoot(root).render(element);
}

start().catch(error => {
  console.error('Could not load the learning page.', error);
  const notice = document.createElement('p');
  notice.setAttribute('role', 'alert');
  notice.className = 'load-notice';
  notice.append('操作機能を読み込めませんでした。');
  const retry = document.createElement('a');
  retry.href = location.href;
  retry.textContent = 'ページを再読み込みする';
  notice.append(retry);
  document.getElementById('root').prepend(notice);
});
