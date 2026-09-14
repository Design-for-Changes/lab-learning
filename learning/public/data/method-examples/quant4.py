# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
# 大きいほど似ている対称な親近性行列。対角は0。
df=pd.DataFrame([[0,9,2,1],[9,0,1,2],[2,1,0,8],[1,2,8,0]],index=list('ABCD'),columns=list('ABCD'))
e=df.to_numpy(dtype=float);h=e+e.T;g=h-np.diag(h.sum(axis=1))
eigenvalues,eigenvectors=np.linalg.eigh(g)
# 全点が同じ座標になる自明な0固有値を除き、大きい順の2軸を使う。
indices=np.flatnonzero(np.abs(eigenvalues)>1e-8)[::-1][:2]
xy=eigenvectors[:,indices]
result=pd.DataFrame({'対象':df.index,'軸1':xy[:,0],'軸2':xy[:,1]})
extra=pd.DataFrame({'軸':['軸1','軸2'],'固有値':eigenvalues[indices]});coordinates=result[['軸1','軸2']]
all_indices=np.flatnonzero(np.abs(eigenvalues)>1e-8)[::-1]
extra=pd.DataFrame({'軸':[f'第{i+1}軸' for i in range(len(all_indices))],'固有値':eigenvalues[all_indices]})

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
