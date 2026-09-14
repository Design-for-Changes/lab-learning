# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from itertools import product
from statsmodels.formula.api import ols
# 評定型の小例：各プロフィールを別々の3人が評価。
rows=[]
for material,shape,price in product(['steel','wood'],['square','round'],[10000,20000]):
    center=5+(material=='wood')*1.5+(shape=='round')*.5-(price==20000)
    rows.extend([[material,shape,price,center+noise] for noise in [-.5,0,.5]])
df=pd.DataFrame(rows,columns=['material','shape','price_yen','rating'])
model=ols('rating ~ C(material) + C(shape) + C(price_yen)',data=df).fit()
result=model.params.rename_axis('基準からの違い').reset_index(name='評点の差')
ci=model.conf_int();result['標準誤差']=model.bse.values;result['95%CI下限']=ci[0].values;result['95%CI上限']=ci[1].values
ranges=np.array([abs(model.params['C(material)[T.wood]']),abs(model.params['C(shape)[T.square]']),abs(model.params['C(price_yen)[T.20000]'])])
extra=pd.DataFrame({'属性':['素材','形','価格'],'部分効用のレンジ':ranges,'相対重要度':ranges/ranges.sum()})
more={'評定モデルの当てはまり':pd.DataFrame([{'R2':model.rsquared,'調整済みR2':model.rsquared_adj,'残差標準偏差':model.mse_resid**.5}])}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
