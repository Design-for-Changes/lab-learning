# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
# 1行は1人。time_secは操作時間（秒）。
df = pd.DataFrame({'time_sec':[12,14,15,16,17,18,19,20,21,22,24,50]})
result = df.time_sec.agg(['count','mean','median','std','min','max']).rename_axis('指標').reset_index(name='値')
q=df.time_sec.quantile([.25,.75])
extra=pd.DataFrame([{'第1四分位数':q.loc[.25],'第3四分位数':q.loc[.75],'四分位範囲_IQR':q.loc[.75]-q.loc[.25],'欠測数':df.time_sec.isna().sum()}])

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
