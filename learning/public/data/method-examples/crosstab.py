# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
df = pd.DataFrame({'work':['home']*8+['office']*8, 'chair':['A']*6+['B']*2+['A']*3+['B']*5})
counts = pd.crosstab(df.work, df.chair).reindex(columns=['A','B'])
result = counts.assign(A_percent=counts.A/counts.sum(axis=1)*100).reset_index()
result['B_percent']=counts.B/counts.sum(axis=1)*100
result['行合計']=counts.sum(axis=1)

print(result.round(4).to_string(index=False))
