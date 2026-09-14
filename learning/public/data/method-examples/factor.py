# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import FactorAnalysis
rng=np.random.default_rng(5)
latent=rng.normal(size=(120,2))
loadings=np.array([[.9,0],[.8,.1],[.7,0],[0,.9],[.1,.8],[0,.7]])
df=pd.DataFrame(latent@loadings.T+rng.normal(0,.35,size=(120,6)),columns=['見つけやすい','迷わない','操作が分かる','形が好き','色が好き','魅力を感じる'])
x=StandardScaler().fit_transform(df)
model=FactorAnalysis(n_components=2,rotation='varimax',random_state=0).fit(x)
result=pd.DataFrame({'質問':df.columns,'因子1負荷量':model.components_[0],'因子2負荷量':model.components_[1],'独自分散':model.noise_variance_})
result['共通性']=(model.components_**2).sum(axis=0)
factor_ss=(model.components_**2).sum(axis=1)
extra=pd.DataFrame({'因子':['因子1','因子2'],'負荷量平方和':factor_ss,'全分散に対する割合':factor_ss/x.shape[1],'累積割合':np.cumsum(factor_ss/x.shape[1])})

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
