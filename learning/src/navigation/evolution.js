export const evolutionLinks = [
  ['/evolution/foundations', '01　前提（現代的な解釈）'],
  ['/evolution/history', '02　進化生物学の成立と発展'],
  ['/evolution/design', '03　進化生物学とデザイン'],
];

export const evolutionAliases = {
  '/evolution': '/evolution/foundations',
  '/evolution/questions': '/evolution/foundations',
  '/evolution/basics': '/evolution/foundations',
  '/evolution/inheritance': '/evolution/foundations',
  '/evolution/selection': '/evolution/foundations',
  '/evolution/drift': '/evolution/foundations',
  '/evolution/speciation': '/evolution/foundations',
  '/evolution/sexual-selection': '/evolution/history',
  '/evolution/cooperation': '/evolution/history',
  '/evolution/altruism': '/evolution/history',
  '/evolution/multilevel': '/evolution/history',
  '/evolution/explanations': '/evolution/foundations',
  '/evolution/behavior': '/evolution/foundations',
};

export const resolveEvolutionRoute = path => evolutionAliases[path] || path;
