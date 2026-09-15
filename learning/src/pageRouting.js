export const learningBase = '/lab-learning/learning/';

export function routePath(route) {
 const url = new URL(route, 'https://routes.invalid/');
 const path = url.pathname.replace(/^\/+|\/+$/g, '');
 return learningBase + (path ? path + '/' : '') + url.search + url.hash;
}

export function pageHref(href) {
 if (typeof href !== 'string') return href;
 if (href.startsWith('#/')) return routePath(href.slice(1));
 if (href === '../research/') return '/lab-learning/research/';
 return href;
}

export function routeFromLocation(current) {
 if (current.hash?.startsWith('#/')) return new URL(current.hash.slice(1), 'https://routes.invalid/').pathname.replace(/\/+$/, '') || '/';
 const pathname = current.pathname || learningBase;
 if (!pathname.startsWith(learningBase)) return '/';
 return '/' + pathname.slice(learningBase.length).replace(/(?:\/)?index\.html$/, '').replace(/\/+$/, '');
}

export function legacyRouteTarget(current, resolveRoute) {
 if (!current.hash?.startsWith('#/')) return null;
 const target = new URL(current.hash.slice(1), 'https://routes.invalid');
 return routePath(resolveRoute(routeFromLocation(current))) + (current.search || '') + target.hash;
}
