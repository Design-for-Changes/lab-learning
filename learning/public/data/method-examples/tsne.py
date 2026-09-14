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

from sklearn.manifold import TSNE
# 3質問を同じ重さで比較。質問1個の回答が違うと、0/1列の二乗距離は2増える。
# この例は頻度による列の標準化をしない。IDは入力に使わない。
x=z.to_numpy()
settings=[(5,42),(15,42),(30,42),(15,7)]
plots=[];summary=[];frames=[]
for perplexity,seed in settings:
    model=TSNE(n_components=2,perplexity=perplexity,random_state=seed,
               init='random',learning_rate='auto',max_iter=1000,method='exact')
    xy=model.fit_transform(x)
    points=pd.DataFrame(xy,index=df.index,columns=['座標1','座標2']).join(df).reset_index(names='回答者ID')
    plots.append({'perplexity':perplexity,'seed':seed,'points':points})
    summary.append({'perplexity':perplexity,'random_state':seed,'KLダイバージェンス':model.kl_divergence_,
                    '反復回数':model.n_iter_,'学習率':model.learning_rate_})
    frames.append(points.assign(perplexity=perplexity,random_state=seed))
result=plots[1]['points'].head(6)
extra=pd.DataFrame(summary)
all_coordinates=pd.concat(frames,ignore_index=True)

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
# 変換例の表示だけ重複をまとめる。解析には全員分を使う。
print(encoding.drop_duplicates().to_string(index=False))

if __name__ == '__main__':
    import matplotlib.pyplot as plt
    all_coordinates.to_csv('tsne-coordinates.csv',index=False,encoding='utf-8-sig')
    fig,axes=plt.subplots(2,2,figsize=(10,9))
    colors={('reading','wood','natural'):'#cc2939',('work','steel','sharp'):'#2865b0',('chat','fabric','soft'):'#347a57'}
    for ax,item in zip(axes.flat,plots):
        points=item['points']
        shades=[colors.get((r.purpose,r.material,r.style),'#aaa') for r in points.itertuples()]
        ax.scatter(points['座標1'],points['座標2'],c=shades,alpha=.8)
        ax.set(title=f"perplexity={item['perplexity']}, seed={item['seed']}",xlabel='Coordinate 1',ylabel='Coordinate 2')
        ax.set_aspect('equal',adjustable='datalim')
    fig.tight_layout()
    fig.savefig('tsne-comparison.png',dpi=160)
    plt.show()
