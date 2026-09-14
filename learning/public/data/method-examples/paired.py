# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from scipy import stats
df=pd.DataFrame({'time_A_sec':[62,55,70,48,66,59,73,51,64,57,69,60],'time_B_sec':[54,57,56,44,72,49,73,35,62,61,57,54]})
# 同じ行のA・Bが、同じ人の測定値。
difference=df.time_A_sec-df.time_B_sec
test=stats.ttest_rel(df.time_A_sec,df.time_B_sec); ci=test.confidence_interval()
result=pd.DataFrame([{'平均差A−B':difference.mean(),'差の標準偏差':difference.std(),'CI下限':ci.low,'CI上限':ci.high,'t':test.statistic,'自由度':test.df,'p':test.pvalue}])
result['対応する人数']=len(difference)
result['平均差の標準誤差']=difference.std()/len(difference)**.5

print(result.round(4).to_string(index=False))
