# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from statsmodels.formula.api import logit
# 同じ練習回数でも成功・失敗の両方がある、40人の架空データ。
df=pd.DataFrame({'practice':np.repeat([0,1,2,3],10),'success':[1]+[0]*9+[1]*3+[0]*7+[1]*6+[0]*4+[1]*8+[0]*2})
model=logit('success ~ practice',data=df).fit(disp=False)
result=pd.DataFrame({'練習回数':[0,1,2,3],'成功の予測確率':model.predict(pd.DataFrame({'practice':[0,1,2,3]})),'1回増えたときのオッズ比':np.exp(model.params['practice'])})
ci=model.conf_int()
extra=pd.DataFrame({'係数':model.params.index,'推定値':model.params.values,'標準誤差':model.bse.values,'z':model.tvalues.values,'p':model.pvalues.values,'オッズ比':np.exp(model.params.values),'ORの95%CI下限':np.exp(ci[0].values),'ORの95%CI上限':np.exp(ci[1].values)})
more={'モデル全体の出力':pd.DataFrame([{'n':model.nobs,'対数尤度':model.llf,'AIC':model.aic,'McFadden擬似R2':model.prsquared,'尤度比検定_p':model.llr_pvalue}])}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
