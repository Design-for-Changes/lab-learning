# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from scipy import stats
# 1〜5の満足度。A・Bは別々の人。
df=pd.DataFrame({'screen':['A']*8+['B']*8,'rating':[1,2,2,3,3,3,4,4,2,3,4,4,4,5,5,5]})
a=df.loc[df.screen=='A','rating'];b=df.loc[df.screen=='B','rating']
test=stats.mannwhitneyu(a,b,alternative='two-sided',method='asymptotic')
result=pd.DataFrame([{'A人数':len(a),'B人数':len(b),'U':test.statistic,'p':test.pvalue}])
extra=pd.DataFrame([{'A中央値':a.median(),'B中央値':b.median(),'順位二分相関_Aが大きい方向':2*test.statistic/(len(a)*len(b))-1}])

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
