export const designChapterInfo = {
  "foundations": {
    "slug": "foundations",
    "title": "中心となる核がない学問"
  },
  "history": {
    "slug": "history",
    "title": "デザインの歴史と社会"
  },
  "concepts": {
    "slug": "concepts",
    "title": "使う人からデザインを考える"
  },
  "experience": {
    "slug": "experience",
    "title": "使いやすさと、使う人の経験"
  },
  "process": {
    "slug": "process",
    "title": "デザイン思考と、調査・試作・評価"
  },
  "research": {
    "slug": "research",
    "title": "デザインを研究する"
  }
};

export const designStudyLinks = Object.values(designChapterInfo).map((chapter, index) => [`/design/${chapter.slug}`, `${String(index + 1).padStart(2, '0')}　${chapter.title}`]);

export const designStudyAliases = {
  '/design/dialogue': '/design/concepts',
  '/design/inquiry': '/design/process',
};

export const resolveDesignStudyRoute = path => path === '/design' ? '/design/foundations' : designStudyAliases[path] || path;
