export const neuroscienceLinks = [
  ['/neuroscience/cells', '01　細胞と信号'],
  ['/neuroscience/circuits', '02　回路と認知機能'],
  ['/neuroscience/design', '03　脳科学とデザイン'],
  ['/neuroscience/unknowns', '04　いまだにわかっていないこと'],
];

export const neuroscienceAliases = { '/neuroscience': '/neuroscience/cells' };

export const resolveNeuroscienceRoute = path => neuroscienceAliases[path] || path;
