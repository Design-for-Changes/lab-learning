# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import pandas as pd
from statsmodels.formula.api import ols
# 質的な説明変数から量的な結果を説明。ダミー変数回帰でI類を計算。
df=pd.DataFrame({'shape':['square']*6+['round']*6,'material':(['steel']*3+['wood']*3)*2,'time_sec':[28,30,32,24,26,28,22,24,26,18,20,22]})
# 当てはまるカテゴリーを1、それ以外を0にした表。結果の時間は変換しない。
indicator=pd.get_dummies(df[['shape','material']],dtype=int)
encoding=pd.concat([df[['shape','material']],indicator],axis=1)
# C(...)でも0/1への変換を行う。切片と重複する列は基準カテゴリーとして省く。
model=ols('time_sec ~ C(shape) + C(material)',data=df).fit()
# 各項目で、出現人数による重み付き平均が0になるカテゴリースコアに直す。
rows=[]
for column in ['shape','material']:
    means=df.groupby(column).time_sec.mean()-df.time_sec.mean()
    rows.extend([{'項目':column,'カテゴリー':label,'カテゴリースコア_秒':value} for label,value in means.items()])
result=pd.DataFrame(rows)
extra=pd.DataFrame([{'全体平均_秒':df.time_sec.mean(),'決定係数_R2':model.rsquared,'丸・木の予測秒':model.predict(pd.DataFrame({'shape':['round'],'material':['wood']})).iloc[0]}])
# この平均差で求める簡便なスコア計算は、各組み合わせ同人数のこの例に限る。
extra['重相関係数_R']=model.rsquared**.5;extra['調整済みR2']=model.rsquared_adj;extra['残差標準偏差_秒']=model.mse_resid**.5
rows=[]
for column,other in [('shape','material'),('material','shape')]:
    reduced=ols(f'time_sec ~ C({other})',data=df).fit()
    category_scores=result.loc[result['項目']==column,'カテゴリースコア_秒']
    rows.append({'項目':column,'レンジ_秒':category_scores.max()-category_scores.min(),'偏相関係数の大きさ':((reduced.ssr-model.ssr)/reduced.ssr)**.5})
more={'各項目の関わり方':pd.DataFrame(rows)}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
# 変換例の表示だけ重複をまとめる。解析には全員分を使う。
print(encoding.drop_duplicates().to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
