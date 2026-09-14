# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
df=pd.DataFrame({'width_cm':[35,38,42,45,50,55],'depth_cm':[34,38,40,47,49,56],'weight_kg':[3,3.5,4.5,5,7,8]},index=list('ABCDEF'))
x=StandardScaler().fit_transform(df)
model=PCA().fit(x)
scores=model.transform(x)
result=pd.DataFrame({'主成分':['PC1','PC2','PC3'],'固有値':model.explained_variance_,'寄与率':model.explained_variance_ratio_,'累積寄与率':np.cumsum(model.explained_variance_ratio_)})
extra=pd.DataFrame({'項目':df.columns,'PC1重み':model.components_[0],'PC2重み':model.components_[1]})
# ここでの主成分負荷量は、元の項目と主成分得点の相関係数。
loadings=np.corrcoef(x.T,scores.T)[:3,3:]
more={'主成分負荷量（元の項目と得点の相関）':pd.DataFrame({'項目':df.columns,'PC1負荷量':loadings[:,0],'PC2負荷量':loadings[:,1]})}
coordinates=pd.DataFrame(scores[:,:2],index=df.index,columns=['軸1','軸2'])

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
print(coordinates.rename_axis("製品ID").round(4).to_string())
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
