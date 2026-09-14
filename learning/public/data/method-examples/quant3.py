# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
# 回答の傾向を追うために構成した、60人の架空の椅子選び調査。
# 利用目的・素材・印象をそれぞれ一つ選ぶ。最後の数字はその回答の人数。
profiles=[('reading','wood','natural',16),('work','steel','sharp',14),('chat','fabric','soft',12),('reading','wood','soft',3),('reading','fabric','natural',2),('work','steel','natural',2),('work','wood','sharp',2),('chat','fabric','natural',3),('chat','wood','soft',2),('reading','steel','natural',1),('work','fabric','sharp',1),('chat','steel','soft',1),('reading','fabric','soft',1)]
df=pd.DataFrame([row[:3] for row in profiles for _ in range(row[3])],columns=['purpose','material','style'])
df.index=[f'P{i+1:02d}' for i in range(len(df))]
z=pd.get_dummies(df,dtype=float)
encoding=pd.concat([df,z.astype(int)],axis=1)
# 選ばれた回数の違いを調整し、独立なら期待される値からのずれを行列Sにする。
p=z.to_numpy()/z.to_numpy().sum();r=p.sum(axis=1);c=p.sum(axis=0)
S=(p-np.outer(r,c))/np.sqrt(np.outer(r,c))
# 固有値問題 (S.T @ S) v = lambda v を解く。Sの特異値分解でも求められる。
eigenvalues,vectors=np.linalg.eigh(S.T@S)
order=np.argsort(eigenvalues)[::-1];eigenvalues=eigenvalues[order];vectors=vectors[:,order]
keep=eigenvalues>1e-10;eigenvalues=eigenvalues[keep];vectors=vectors[:,keep]
# 軸の符号は任意。再現しやすいよう最大絶対値の成分を正にする。
for j in range(vectors.shape[1]):
    if vectors[np.abs(vectors[:,j]).argmax(),j]<0:vectors[:,j]*=-1
category_scores=vectors[:,:2]/np.sqrt(c[:,None])
people_scores=(S@vectors[:,:2])/np.sqrt(r[:,None])
scaling = "standard"
if scaling=="standard":
    # 数量化理論III類：両方のスコアを、重み付き分散1に基準化。
    people_scores=people_scores/np.sqrt(eigenvalues[:2])
else:
    # MCA：この例ではカテゴリー・回答者とも主座標で表示。
    category_scores=category_scores*np.sqrt(eigenvalues[:2])
result=pd.DataFrame({'カテゴリー':z.columns,'軸1':category_scores[:,0],'軸2':category_scores[:,1]})
ratio=eigenvalues/eigenvalues.sum()
extra=pd.DataFrame({'軸':[f'第{i+1}軸' for i in range(len(eigenvalues))],'固有値':eigenvalues,'相関係数_平方根':np.sqrt(eigenvalues),'寄与率_未補正':ratio,'累積寄与率_未補正':np.cumsum(ratio)})
sample_scores=pd.DataFrame(people_scores,index=df.index,columns=['軸1','軸2']).join(df)
sample_profiles=sample_scores.groupby(list(df.columns),sort=False).agg(人数=('軸1','size'),軸1=('軸1','first'),軸2=('軸2','first')).reset_index()
all_principal=vectors*np.sqrt(eigenvalues)/np.sqrt(c[:,None])
quality=(all_principal[:,:2]**2).sum(axis=1)/(all_principal**2).sum(axis=1)
more={'カテゴリーの人数・表示の質・軸への寄与':pd.DataFrame({'カテゴリー':z.columns,'人数':z.sum().astype(int).values,'2軸のcos2':quality,'第1軸への寄与':vectors[:,0]**2,'第2軸への寄与':vectors[:,1]**2})}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
# 変換例の表示だけ重複をまとめる。解析には全員分を使う。
print(encoding.drop_duplicates().to_string(index=False))
print(sample_scores.rename_axis("回答者ID").round(4).to_string())
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
