# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from scipy import stats
df = pd.DataFrame({'screen':['A']*6+['B']*6,'time_sec':[20,22,24,26,28,30,16,18,19,20,21,26]})
a=df.loc[df.screen=='A','time_sec']; b=df.loc[df.screen=='B','time_sec']
test=stats.ttest_ind(a,b,equal_var=False)
ci=test.confidence_interval()
result=pd.DataFrame([{'A平均':a.mean(),'B平均':b.mean(),'A−B':a.mean()-b.mean(),'CI下限':ci.low,'CI上限':ci.high,'t':test.statistic,'自由度':test.df,'p':test.pvalue}])
extra=pd.DataFrame({'群':['A','B'],'人数':[len(a),len(b)],'平均_秒':[a.mean(),b.mean()],'標準偏差_秒':[a.std(),b.std()]})
result['平均差の標準誤差']=(a.var()/len(a)+b.var()/len(b))**.5

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
