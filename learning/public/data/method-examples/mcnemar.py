# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from statsmodels.stats.contingency_tables import mcnemar
# 同じ行が同じ人。1=成功、0=失敗。
df=pd.DataFrame({'A':[0]*13+[1]*11,'B':[0]*3+[1]*10+[0]*2+[1]*9})
table=pd.crosstab(df.A,df.B).reindex(index=[0,1],columns=[0,1],fill_value=0)
test=mcnemar(table,exact=True)
result=pd.DataFrame([{'両方失敗':table.loc[0,0],'A失敗B成功':table.loc[0,1],'A成功B失敗':table.loc[1,0],'両方成功':table.loc[1,1],'両側p':test.pvalue}])
result['検定に使う不一致の人数']=table.loc[0,1]+table.loc[1,0]
result['A成功率']=df.A.mean();result['B成功率']=df.B.mean()

print(result.round(4).to_string(index=False))
