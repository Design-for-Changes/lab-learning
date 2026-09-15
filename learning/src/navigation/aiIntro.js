export const aiIntroLinks = [
 ['/ai-intro/systems', '01　現代的なAIの計算ロジック'],
 ['/ai-intro/behavior', '02　AIの挙動特性'],
 ['/ai-intro/partnership', '03　AIとの向き合い方'],
];

export const aiIntroAliases = {
 '/ai-intro': '/ai-intro/systems',
 '/ai/systems': '/ai-intro/systems',
};

export const resolveAiIntroRoute = path => aiIntroAliases[path] || path;
