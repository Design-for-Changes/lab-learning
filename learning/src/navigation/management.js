export const managementChapterInfo = {
  "foundations": {
    "slug": "foundations",
    "number": "01",
    "title": "マネジメントとは何か"
  },
  "history": {
    "slug": "history",
    "number": "02",
    "title": "マネジメントの歴史と変遷"
  },
  "contemporary": {
    "slug": "contemporary",
    "number": "03",
    "title": "現代的なマネジメントの考え方と主要トピック"
  }
};

export const managementLinks = Object.values(managementChapterInfo).map(chapter => [`/management/${chapter.slug}`, `${chapter.number}　${chapter.title}`]);

export const managementAliases = {
  '/management': '/management/foundations',
  '/management/classical': '/management/history',
  '/management/people': '/management/history',
  '/management/decisions': '/management/history',
  '/management/environment': '/management/history',
  '/management/knowledge': '/management/contemporary',
  '/management/autonomy': '/management/contemporary',
};

export const resolveManagementRoute = path => managementAliases[path] || path;
