# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from sklearn.manifold import MDS
# 大きいほど違う、対称な非類似度行列。対角は0。
df=pd.DataFrame([[0,1,3,3.2],[1,0,2.5,3],[3,2.5,0,1],[3.2,3,1,0]],index=list('ABCD'),columns=list('ABCD'))
model=MDS(n_components=2,dissimilarity='precomputed',random_state=0,n_init=8,normalized_stress='auto')
xy=model.fit_transform(df.to_numpy())
result=pd.DataFrame({'製品':df.index,'軸1':xy[:,0],'軸2':xy[:,1]})
extra=pd.DataFrame([{'stress':model.stress_}]);coordinates=result[['軸1','軸2']]
from itertools import combinations
more={'元の非類似度と図の距離の照合':pd.DataFrame([{'ペア':str(df.index[i])+'−'+str(df.index[j]),'元の非類似度':df.iloc[i,j],'図の距離':np.linalg.norm(xy[i]-xy[j])} for i,j in combinations(range(len(df)),2)])}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
