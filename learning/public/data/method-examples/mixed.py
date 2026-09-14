# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from statsmodels.formula.api import mixedlm
rng=np.random.default_rng(7)
rows=[]
for person in range(30):
    personal=rng.normal(0,7)
    for screen in ['A','B']:
        rows.append([person,screen,50+personal+(-5 if screen=='B' else 0)+rng.normal(0,2)])
df=pd.DataFrame(rows,columns=['person','screen','time_sec'])
model=mixedlm('time_sec ~ C(screen)',df,groups=df.person).fit()
ci=model.conf_int()
result=pd.DataFrame([{'B−A':model.fe_params['C(screen)[T.B]'],'CI下限':ci.loc['C(screen)[T.B]',0],'CI上限':ci.loc['C(screen)[T.B]',1],'個人差の分散':model.cov_re.iloc[0,0],'残差分散':model.scale}])
result['人数']=df.person.nunique();result['観測数']=len(df);result['収束']=bool(model.converged)
extra=pd.DataFrame({'固定効果':model.fe_params.index,'推定値':model.fe_params.values,'標準誤差':model.bse_fe.values,'Wald_z':model.tvalues.loc[model.fe_params.index].values,'p':model.pvalues.loc[model.fe_params.index].values})

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
