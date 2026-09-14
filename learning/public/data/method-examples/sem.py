# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
import numpy as np
import pandas as pd
from semopy import Model, calc_stats
rng=np.random.default_rng(9);n=240
usability=rng.normal(size=n);satisfaction=.7*usability+rng.normal(0,.6,n)
df=pd.DataFrame({**{f'u{i+1}':w*usability+rng.normal(0,.4,n) for i,w in enumerate([1,.8,.9])},**{f's{i+1}':w*satisfaction+rng.normal(0,.4,n) for i,w in enumerate([1,.9,.8])}})
model=Model('Usability =~ u1 + u2 + u3\nSatisfaction =~ s1 + s2 + s3\nSatisfaction ~ Usability')
model.fit(df)
parameters=model.inspect(std_est=True)
result=parameters.loc[(parameters.lval=='Satisfaction')&(parameters.op=='~'),['lval','op','rval','Estimate','Est. Std','p-value']].reset_index(drop=True)
fit=calc_stats(model);extra=fit[['DoF','CFI','TLI','RMSEA']].reset_index(drop=True)
result=parameters.loc[(parameters.lval=='Satisfaction')&(parameters.op=='~'),['lval','op','rval','Estimate','Std. Err','Est. Std','p-value']].reset_index(drop=True)
extra=fit[['DoF','chi2','chi2 p-value','CFI','TLI','RMSEA']].reset_index(drop=True)
more={'測定項目の因子負荷量':parameters.loc[parameters.lval.isin(df.columns)&(parameters.op=='~'),['lval','rval','Estimate','Std. Err','Est. Std','p-value']].reset_index(drop=True)}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
