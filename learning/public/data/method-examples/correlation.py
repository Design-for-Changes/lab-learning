# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from scipy import stats
df=pd.DataFrame({'height_cm':[36,38,40,42,44,46,48,50],'rating':[2,3,3,4,4,5,5,6]})
pearson=stats.pearsonr(df.height_cm,df.rating)
spearman=stats.spearmanr(df.height_cm,df.rating)
result=pd.DataFrame([{'Pearson_r':pearson.statistic,'Pearson_p':pearson.pvalue,'Spearman_rho':spearman.statistic,'Spearman_p':spearman.pvalue}])
ci=pearson.confidence_interval(confidence_level=.95)
extra=pd.DataFrame([{'組の数':len(df),'Pearson_rの95%CI下限':ci.low,'Pearson_rの95%CI上限':ci.high}])

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
