# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols
# 別々の人が、A・B・Cのいずれか一つを使用。
df=pd.DataFrame({'screen':['A']*7+['B']*7+['C']*7,'time_sec':[24,26,28,30,32,34,36,20,22,24,26,28,30,32,16,18,20,22,24,26,28]})
model=ols('time_sec ~ C(screen)',data=df).fit()
result=sm.stats.anova_lm(model,typ=2).reset_index(names='効果')
from statsmodels.stats.multicomp import pairwise_tukeyhsd
result.insert(3,'mean_sq',result.sum_sq/result.df)
extra=df.groupby('screen').time_sec.agg(['count','mean','std']).reset_index()
eta2=result.loc[0,'sum_sq']/result.sum_sq.sum()
# 3つの全ペアを比較する場合の例。Tukey HSDで多重性を調整。
tukey=pairwise_tukeyhsd(df.time_sec,df.screen,alpha=.05)
posthoc=pd.DataFrame(tukey.summary().data[1:],columns=tukey.summary().data[0])
more={'効果量':pd.DataFrame([{'eta2':eta2}]),'Tukey HSDの全ペア比較（差はgroup2−group1）':posthoc}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
