from pathlib import Path
import numpy as np
import pandas as pd

# 1行が感想1件。単語があると1、ないと0にした表を読む。
df=pd.read_csv(Path(__file__).with_name('word-presence.csv'))
words=['椅子','机','軽い','丈夫']
x=df[words].to_numpy()
if not np.isin(x,[0,1]).all():
    raise ValueError('単語の列は0または1にしてください。')
# .Tは転置、@は行列の掛け算。両方1の感想を数える。
counts=x.T@x
print('共起件数（対角は、その語が出た感想の件数）')
print(pd.DataFrame(counts,index=words,columns=words).to_string())
threshold=2
edges=[]
for i in range(len(words)):
    for j in range(i+1,len(words)):
        # 自分自身の組と、逆順で重複する組は除く。
        if counts[i,j]>=threshold:
            edges.append([words[i],words[j],int(counts[i,j])])
print(f'共起{threshold}件以上の辺')
print(pd.DataFrame(edges,columns=['語1','語2','件数']).to_string(index=False))
print('椅子と軽いのJaccard係数:',counts[0,2]/(counts[0,0]+counts[2,2]-counts[0,2]))
