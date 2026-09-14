# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error
rng=np.random.default_rng(12)
df=pd.DataFrame({'width_cm':rng.uniform(30,60,120),'weight_kg':rng.uniform(2,10,120)})
df['price_yen']=4000+10*(df.width_cm-30)**2+900*df.weight_kg+rng.normal(0,600,len(df))
xtrain,xtest,ytrain,ytest=train_test_split(df[['width_cm','weight_kg']],df.price_yen,test_size=.25,random_state=0)
rows=[]
for name,model in [('決定木',DecisionTreeRegressor(max_depth=3,random_state=0)),('ランダムフォレスト',RandomForestRegressor(n_estimators=100,min_samples_leaf=3,random_state=0))]:
    model.fit(xtrain,ytrain)
    rows.append({'モデル':name,'学習MAE_円':mean_absolute_error(ytrain,model.predict(xtrain)),'テストMAE_円':mean_absolute_error(ytest,model.predict(xtest))})
rows.append({'モデル':'学習データの平均だけ','学習MAE_円':mean_absolute_error(ytrain,np.repeat(ytrain.mean(),len(ytrain))),'テストMAE_円':mean_absolute_error(ytest,np.repeat(ytrain.mean(),len(ytest)))})
result=pd.DataFrame(rows)
from sklearn.inspection import permutation_importance
from sklearn.metrics import root_mean_squared_error,r2_score
for i,(name,estimator) in enumerate([('決定木',DecisionTreeRegressor(max_depth=3,random_state=0)),('ランダムフォレスト',RandomForestRegressor(n_estimators=100,min_samples_leaf=3,random_state=0))]):
    estimator.fit(xtrain,ytrain);pred=estimator.predict(xtest)
    result.loc[i,'テストRMSE_円']=root_mean_squared_error(ytest,pred);result.loc[i,'テストR2']=r2_score(ytest,pred)
basepred=np.repeat(ytrain.mean(),len(ytest))
result.loc[2,'テストRMSE_円']=root_mean_squared_error(ytest,basepred);result.loc[2,'テストR2']=r2_score(ytest,basepred)
importance=permutation_importance(model,xtest,ytest,scoring='neg_mean_absolute_error',n_repeats=10,random_state=0)
extra=pd.DataFrame({'特徴量':xtest.columns,'並べ替えによるMAE増加_円':importance.importances_mean,'10回の標準偏差_円':importance.importances_std})

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
