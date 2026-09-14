# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
# 各人が一つの製品について、一つの印象語を選んだ人数。
df=pd.DataFrame([[20,5,5],[5,20,5],[5,5,20]],index=['A','B','C'],columns=['落ち着く','軽快','力強い'])
p=df.to_numpy()/df.to_numpy().sum();r=p.sum(axis=1);c=p.sum(axis=0)
u,s,vt=np.linalg.svd((p-np.outer(r,c))/np.sqrt(np.outer(r,c)),full_matrices=False)
rows=u[:,:2]*s[:2]/np.sqrt(r[:,None])
cols=vt.T[:,:2]*s[:2]/np.sqrt(c[:,None])
result=pd.DataFrame({'対象':list(df.index)+list(df.columns),'種類':['製品']*3+['印象語']*3,'軸1':np.r_[rows[:,0],cols[:,0]],'軸2':np.r_[rows[:,1],cols[:,1]]})
extra=pd.DataFrame({'軸':['軸1','軸2'],'慣性の割合':s[:2]**2/(s**2).sum()})
coordinates=result[['軸1','軸2']]
extra.insert(1,'固有値',s[:2]**2)
extra['累積慣性の割合']=np.cumsum(extra['慣性の割合'])

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
