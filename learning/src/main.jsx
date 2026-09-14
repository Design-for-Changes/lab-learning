import React from 'react';
import { createRoot } from 'react-dom/client';
import App, { resolveLearningRoute } from './App.jsx';
import { routeFromLocation, routePath } from './pageRouting.js';
import './style.css';
if (location.hash.startsWith('#/')) {
 const target = new URL(location.hash.slice(1), location.origin);
 location.replace(routePath(resolveLearningRoute(routeFromLocation(location))) + location.search + target.hash);
} else {
 createRoot(document.getElementById('root')).render(<App />);
}
