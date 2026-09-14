# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from statsmodels.formula.api import ols
df=pd.DataFrame({'width_cm':[40,40,45,45,50,50,55,55],'weight_kg':[4,7,4,7,4,7,4,7]})
df['price_yen']=5000+200*df.width_cm+800*df.weight_kg+np.array([-500,500,500,-500,-500,500,500,-500])
model=ols('price_yen ~ width_cm + weight_kg',data=df).fit()
ci=model.conf_int()
result=pd.DataFrame({'係数':model.params.index,'推定値':model.params.values,'95%CI下限':ci[0].values,'95%CI上限':ci[1].values})
result['標準誤差']=model.bse.values;result['t']=model.tvalues.values;result['p']=model.pvalues.values
extra=pd.DataFrame([{'n':model.nobs,'R2':model.rsquared,'調整済みR2':model.rsquared_adj,'残差標準偏差_円':model.mse_resid**.5,'F':model.fvalue,'モデル全体_p':model.f_pvalue}])

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
