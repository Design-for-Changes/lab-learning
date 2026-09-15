export const scienceChapters = [
 { slug:'foundations', title:'科学とは何か？' },
 { slug:'knowledge', title:'科学はどう知識をつくるのか？' },
 { slug:'history', title:'科学の歴史と考え方の変遷' },
 { slug:'contemporary', title:'現代の科学と主な論点' },
];

export const scienceLinks=scienceChapters.map((c,i)=>[`/science/${c.slug}`,`${String(i+1).padStart(2,'0')}　${c.title}`]);

export const resolveScienceRoute=route=>route==='/science'?'/science/foundations':route;
