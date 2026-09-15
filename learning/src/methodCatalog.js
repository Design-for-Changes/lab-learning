export const methodCatalog = {
  "describe": {
    "name": "記述統計・可視化",
    "group": 0
  },
  "crosstab": {
    "name": "クロス集計",
    "group": 0
  },
  "welch": {
    "name": "Welchのt検定",
    "group": 1
  },
  "paired": {
    "name": "対応のあるt検定",
    "group": 1
  },
  "anova": {
    "name": "分散分析（ANOVA）",
    "group": 1
  },
  "ranks": {
    "name": "ノンパラメトリック検定",
    "group": 1
  },
  "categorical": {
    "name": "カイ二乗検定・Fisherの正確確率検定",
    "group": 1
  },
  "mcnemar": {
    "name": "McNemar検定",
    "group": 1
  },
  "correlation": {
    "name": "相関分析",
    "group": 2
  },
  "regression": {
    "name": "回帰分析（単回帰分析・重回帰分析）",
    "group": 2
  },
  "logistic": {
    "name": "ロジスティック回帰分析",
    "group": 2
  },
  "mixed": {
    "name": "混合効果モデル",
    "group": 2
  },
  "pca": {
    "name": "主成分分析（PCA）",
    "group": 3
  },
  "factor": {
    "name": "因子分析",
    "group": 3
  },
  "ca": {
    "name": "対応分析（CA／コレスポンデンス分析）",
    "group": 3
  },
  "mca": {
    "name": "多重対応分析（MCA）",
    "group": 3
  },
  "mds": {
    "name": "多次元尺度構成法（MDS）",
    "group": 3
  },
  "cluster": {
    "name": "クラスター分析",
    "group": 4
  },
  "conjoint": {
    "name": "コンジョイント分析",
    "group": 5
  },
  "sem": {
    "name": "構造方程式モデリング（SEM／共分散構造分析）",
    "group": 5
  },
  "forest": {
    "name": "決定木・ランダムフォレスト",
    "group": 6
  },
  "neural": {
    "name": "ニューラルネットワーク（教師あり学習）",
    "group": 6
  },
  "quant1": {
    "name": "数量化理論I類",
    "group": 2
  },
  "quant2": {
    "name": "数量化理論II類",
    "group": 2
  },
  "quant3": {
    "name": "数量化理論III類",
    "group": 3
  },
  "quant4": {
    "name": "数量化理論IV類",
    "group": 3
  },
  "tsne": {
    "name": "t-SNE（t-distributed Stochastic Neighbor Embedding）",
    "group": 3
  }
};

export function methodInfo(id) {
  const entry = methodCatalog[id];
  if (!entry) throw new Error(`Unknown analysis method: ${id}`);
  return { id, ...entry };
}
