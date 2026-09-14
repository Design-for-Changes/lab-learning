# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from scipy import stats
# 集計済みの人数。別々の20人ずつがAかBを使用。
df=pd.DataFrame({'success':[12,18],'failure':[8,2]},index=['A','B'])
chi2,p,dof,expected=stats.chi2_contingency(df,correction=False)
fisher=stats.fisher_exact(df)
result=pd.DataFrame([{'A成功率':12/20,'B成功率':18/20,'カイ二乗':chi2,'自由度':dof,'カイ二乗p':p,'Fisher両側p':fisher.pvalue}])
result['標本オッズ比_A対B']=fisher.statistic
result['成功率差_B−A']=.9-.6
extra=pd.DataFrame(expected,index=['A','B'],columns=['期待成功人数','期待失敗人数']).reset_index(names='画面')

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
