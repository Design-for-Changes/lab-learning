# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
df=pd.DataFrame({'price_yen':[8000,9000,10000,28000,30000,32000],'weight_kg':[3,3.5,4,8,9,10]})
x=StandardScaler().fit_transform(df)
model=KMeans(n_clusters=2,random_state=0,n_init=20).fit(x)
result=df.assign(cluster=model.labels_).reset_index(names='製品ID')
extra=result.groupby('cluster')[['price_yen','weight_kg']].mean().reset_index()
from sklearn.metrics import silhouette_score
extra['人数']=result.groupby('cluster').size()
more={'分類の設定とまとまり':pd.DataFrame([{'指定した群数':model.n_clusters,'群内平方和_inertia':model.inertia_,'シルエット係数':silhouette_score(x,model.labels_)}])}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
