"""Run the small public Python examples and save their actual input/output for the lessons."""
from pathlib import Path
import contextlib, io, json, textwrap, importlib.metadata, warnings
import numpy as np
import pandas as pd
ROOT=Path(__file__).resolve().parents[1]
EXAMPLES={}
def add(key,code): EXAMPLES[key]=textwrap.dedent(code).strip()+'\n'
add('describe','''
import pandas as pd
# 1行は1人。time_secは操作時間（秒）。
df = pd.DataFrame({'time_sec':[12,14,15,16,17,18,19,20,21,22,24,50]})
result = df.time_sec.agg(['count','mean','median','std','min','max']).rename_axis('指標').reset_index(name='値')
''')
add('crosstab','''
import pandas as pd
df = pd.DataFrame({'work':['home']*8+['office']*8, 'chair':['A']*6+['B']*2+['A']*3+['B']*5})
counts = pd.crosstab(df.work, df.chair).reindex(columns=['A','B'])
result = counts.assign(A_percent=counts.A/counts.sum(axis=1)*100).reset_index()
''')
add('welch','''
import pandas as pd
from scipy import stats
df = pd.DataFrame({'screen':['A']*6+['B']*6,'time_sec':[20,22,24,26,28,30,16,18,19,20,21,26]})
a=df.loc[df.screen=='A','time_sec']; b=df.loc[df.screen=='B','time_sec']
test=stats.ttest_ind(a,b,equal_var=False)
ci=test.confidence_interval()
result=pd.DataFrame([{'A平均':a.mean(),'B平均':b.mean(),'A−B':a.mean()-b.mean(),'CI下限':ci.low,'CI上限':ci.high,'t':test.statistic,'自由度':test.df,'p':test.pvalue}])
''')
add('paired','''
import pandas as pd
from scipy import stats
df=pd.DataFrame({'time_A_sec':[62,55,70,48,66,59,73,51,64,57,69,60],'time_B_sec':[54,57,56,44,72,49,73,35,62,61,57,54]})
# 同じ行のA・Bが、同じ人の測定値。
difference=df.time_A_sec-df.time_B_sec
test=stats.ttest_rel(df.time_A_sec,df.time_B_sec); ci=test.confidence_interval()
result=pd.DataFrame([{'平均差A−B':difference.mean(),'差の標準偏差':difference.std(),'CI下限':ci.low,'CI上限':ci.high,'t':test.statistic,'自由度':test.df,'p':test.pvalue}])
''')
add('anova','''
import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols
# 別々の人が、A・B・Cのいずれか一つを使用。
df=pd.DataFrame({'screen':['A']*7+['B']*7+['C']*7,'time_sec':[24,26,28,30,32,34,36,20,22,24,26,28,30,32,16,18,20,22,24,26,28]})
model=ols('time_sec ~ C(screen)',data=df).fit()
result=sm.stats.anova_lm(model,typ=2).reset_index(names='効果')
''')
add('ranks','''
import pandas as pd
from scipy import stats
# 1〜5の満足度。A・Bは別々の人。
df=pd.DataFrame({'screen':['A']*8+['B']*8,'rating':[1,2,2,3,3,3,4,4,2,3,4,4,4,5,5,5]})
a=df.loc[df.screen=='A','rating'];b=df.loc[df.screen=='B','rating']
test=stats.mannwhitneyu(a,b,alternative='two-sided',method='asymptotic')
result=pd.DataFrame([{'A人数':len(a),'B人数':len(b),'U':test.statistic,'p':test.pvalue}])
''')
add('categorical','''
import pandas as pd
from scipy import stats
# 集計済みの人数。別々の20人ずつがAかBを使用。
df=pd.DataFrame({'success':[12,18],'failure':[8,2]},index=['A','B'])
chi2,p,dof,expected=stats.chi2_contingency(df,correction=False)
fisher=stats.fisher_exact(df)
result=pd.DataFrame([{'A成功率':12/20,'B成功率':18/20,'カイ二乗':chi2,'自由度':dof,'カイ二乗p':p,'Fisher両側p':fisher.pvalue}])
''')
add('mcnemar','''
import pandas as pd
from statsmodels.stats.contingency_tables import mcnemar
# 同じ行が同じ人。1=成功、0=失敗。
df=pd.DataFrame({'A':[0]*13+[1]*11,'B':[0]*3+[1]*10+[0]*2+[1]*9})
table=pd.crosstab(df.A,df.B).reindex(index=[0,1],columns=[0,1],fill_value=0)
test=mcnemar(table,exact=True)
result=pd.DataFrame([{'両方失敗':table.loc[0,0],'A失敗B成功':table.loc[0,1],'A成功B失敗':table.loc[1,0],'両方成功':table.loc[1,1],'両側p':test.pvalue}])
''')
add('correlation','''
import pandas as pd
from scipy import stats
df=pd.DataFrame({'height_cm':[36,38,40,42,44,46,48,50],'rating':[2,3,3,4,4,5,5,6]})
pearson=stats.pearsonr(df.height_cm,df.rating)
spearman=stats.spearmanr(df.height_cm,df.rating)
result=pd.DataFrame([{'Pearson_r':pearson.statistic,'Pearson_p':pearson.pvalue,'Spearman_rho':spearman.statistic,'Spearman_p':spearman.pvalue}])
''')
add('regression','''
import numpy as np
import pandas as pd
from statsmodels.formula.api import ols
df=pd.DataFrame({'width_cm':[40,40,45,45,50,50,55,55],'weight_kg':[4,7,4,7,4,7,4,7]})
df['price_yen']=5000+200*df.width_cm+800*df.weight_kg+np.array([-500,500,500,-500,-500,500,500,-500])
model=ols('price_yen ~ width_cm + weight_kg',data=df).fit()
ci=model.conf_int()
result=pd.DataFrame({'係数':model.params.index,'推定値':model.params.values,'95%CI下限':ci[0].values,'95%CI上限':ci[1].values})
''')
add('logistic','''
import numpy as np
import pandas as pd
from statsmodels.formula.api import logit
# 同じ練習回数でも成功・失敗の両方がある、40人の架空データ。
df=pd.DataFrame({'practice':np.repeat([0,1,2,3],10),'success':[1]+[0]*9+[1]*3+[0]*7+[1]*6+[0]*4+[1]*8+[0]*2})
model=logit('success ~ practice',data=df).fit(disp=False)
result=pd.DataFrame({'練習回数':[0,1,2,3],'成功の予測確率':model.predict(pd.DataFrame({'practice':[0,1,2,3]})),'1回増えたときのオッズ比':np.exp(model.params['practice'])})
''')
add('mixed','''
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
''')
add('pca','''
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
df=pd.DataFrame({'width_cm':[35,38,42,45,50,55],'depth_cm':[34,38,40,47,49,56],'weight_kg':[3,3.5,4.5,5,7,8]},index=list('ABCDEF'))
x=StandardScaler().fit_transform(df)
model=PCA().fit(x)
scores=model.transform(x)
result=pd.DataFrame({'主成分':['PC1','PC2','PC3'],'固有値':model.explained_variance_,'寄与率':model.explained_variance_ratio_,'累積寄与率':np.cumsum(model.explained_variance_ratio_)})
extra=pd.DataFrame({'項目':df.columns,'PC1重み':model.components_[0],'PC2重み':model.components_[1]})
# ここでの主成分負荷量は、元の項目と主成分得点の相関係数。
loadings=np.corrcoef(x.T,scores.T)[:3,3:]
more={'主成分負荷量（元の項目と得点の相関）':pd.DataFrame({'項目':df.columns,'PC1負荷量':loadings[:,0],'PC2負荷量':loadings[:,1]})}
coordinates=pd.DataFrame(scores[:,:2],index=df.index,columns=['軸1','軸2'])
''')
add('factor','''
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import FactorAnalysis
rng=np.random.default_rng(5)
latent=rng.normal(size=(120,2))
loadings=np.array([[.9,0],[.8,.1],[.7,0],[0,.9],[.1,.8],[0,.7]])
df=pd.DataFrame(latent@loadings.T+rng.normal(0,.35,size=(120,6)),columns=['見つけやすい','迷わない','操作が分かる','形が好き','色が好き','魅力を感じる'])
x=StandardScaler().fit_transform(df)
model=FactorAnalysis(n_components=2,rotation='varimax',random_state=0).fit(x)
result=pd.DataFrame({'質問':df.columns,'因子1負荷量':model.components_[0],'因子2負荷量':model.components_[1],'独自分散':model.noise_variance_})
''')
add('ca','''
import numpy as np
import pandas as pd
# 各人が一つの製品について、一つの印象語を選んだ人数。
df=pd.DataFrame([[20,5,5],[5,20,5],[5,5,20]],index=['A','B','C'],columns=['落ち着く','軽快','力強い'])
p=df.to_numpy()/df.to_numpy().sum();r=p.sum(axis=1);c=p.sum(axis=0)
u,s,vt=np.linalg.svd((p-np.outer(r,c))/np.sqrt(np.outer(r,c)),full_matrices=False)
rows=u[:,:2]*s[:2]/np.sqrt(r[:,None])
cols=vt.T[:,:2]*s[:2]/np.sqrt(c[:,None])
result=pd.DataFrame({'対象':list(df.index)+list(df.columns),'種類':['製品']*3+['印象語']*3,'軸1':np.r_[rows[:,0],cols[:,0]],'軸2':np.r_[rows[:,1],cols[:,1]]})
extra=pd.DataFrame({'軸':['軸1','軸2'],'慣性の割合':s[:2]**2/(s**2).sum()})
coordinates=result[['軸1','軸2']]
''')
add('mca','''
import numpy as np
import pandas as pd
# 回答の傾向を追うために構成した、60人の架空の椅子選び調査。
# 利用目的・素材・印象をそれぞれ一つ選ぶ。最後の数字はその回答の人数。
profiles=[('reading','wood','natural',16),('work','steel','sharp',14),('chat','fabric','soft',12),('reading','wood','soft',3),('reading','fabric','natural',2),('work','steel','natural',2),('work','wood','sharp',2),('chat','fabric','natural',3),('chat','wood','soft',2),('reading','steel','natural',1),('work','fabric','sharp',1),('chat','steel','soft',1),('reading','fabric','soft',1)]
df=pd.DataFrame([row[:3] for row in profiles for _ in range(row[3])],columns=['purpose','material','style'])
df.index=[f'P{i+1:02d}' for i in range(len(df))]
z=pd.get_dummies(df,dtype=float)
encoding=pd.concat([df,z.astype(int)],axis=1)
# 選ばれた回数の違いを調整し、独立なら期待される値からのずれを行列Sにする。
p=z.to_numpy()/z.to_numpy().sum();r=p.sum(axis=1);c=p.sum(axis=0)
S=(p-np.outer(r,c))/np.sqrt(np.outer(r,c))
# 固有値問題 (S.T @ S) v = lambda v を解く。Sの特異値分解でも求められる。
eigenvalues,vectors=np.linalg.eigh(S.T@S)
order=np.argsort(eigenvalues)[::-1];eigenvalues=eigenvalues[order];vectors=vectors[:,order]
keep=eigenvalues>1e-10;eigenvalues=eigenvalues[keep];vectors=vectors[:,keep]
# 軸の符号は任意。再現しやすいよう最大絶対値の成分を正にする。
for j in range(vectors.shape[1]):
    if vectors[np.abs(vectors[:,j]).argmax(),j]<0:vectors[:,j]*=-1
category_scores=vectors[:,:2]/np.sqrt(c[:,None])
people_scores=(S@vectors[:,:2])/np.sqrt(r[:,None])
scaling = "principal"
if scaling=="standard":
    # 数量化理論III類：両方のスコアを、重み付き分散1に基準化。
    people_scores=people_scores/np.sqrt(eigenvalues[:2])
else:
    # MCA：この例ではカテゴリー・回答者とも主座標で表示。
    category_scores=category_scores*np.sqrt(eigenvalues[:2])
result=pd.DataFrame({'カテゴリー':z.columns,'軸1':category_scores[:,0],'軸2':category_scores[:,1]})
ratio=eigenvalues/eigenvalues.sum()
extra=pd.DataFrame({'軸':[f'第{i+1}軸' for i in range(len(eigenvalues))],'固有値':eigenvalues,'相関係数_平方根':np.sqrt(eigenvalues),'寄与率_未補正':ratio,'累積寄与率_未補正':np.cumsum(ratio)})
sample_scores=pd.DataFrame(people_scores,index=df.index,columns=['軸1','軸2']).join(df)
sample_profiles=sample_scores.groupby(list(df.columns),sort=False).agg(人数=('軸1','size'),軸1=('軸1','first'),軸2=('軸2','first')).reset_index()
all_principal=vectors*np.sqrt(eigenvalues)/np.sqrt(c[:,None])
quality=(all_principal[:,:2]**2).sum(axis=1)/(all_principal**2).sum(axis=1)
more={'カテゴリーの人数・表示の質・軸への寄与':pd.DataFrame({'カテゴリー':z.columns,'人数':z.sum().astype(int).values,'2軸のcos2':quality,'第1軸への寄与':vectors[:,0]**2,'第2軸への寄与':vectors[:,1]**2})}
''')
add('mds','''
import numpy as np
import pandas as pd
from sklearn.manifold import MDS
# 大きいほど違う、対称な非類似度行列。対角は0。
df=pd.DataFrame([[0,1,3,3.2],[1,0,2.5,3],[3,2.5,0,1],[3.2,3,1,0]],index=list('ABCD'),columns=list('ABCD'))
model=MDS(n_components=2,dissimilarity='precomputed',random_state=0,n_init=8,normalized_stress='auto')
xy=model.fit_transform(df.to_numpy())
result=pd.DataFrame({'製品':df.index,'軸1':xy[:,0],'軸2':xy[:,1]})
extra=pd.DataFrame([{'stress':model.stress_}]);coordinates=result[['軸1','軸2']]
''')
add('cluster','''
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
df=pd.DataFrame({'price_yen':[8000,9000,10000,28000,30000,32000],'weight_kg':[3,3.5,4,8,9,10]})
x=StandardScaler().fit_transform(df)
model=KMeans(n_clusters=2,random_state=0,n_init=20).fit(x)
result=df.assign(cluster=model.labels_).reset_index(names='製品ID')
extra=result.groupby('cluster')[['price_yen','weight_kg']].mean().reset_index()
''')
add('conjoint','''
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
''')
add('sem','''
import numpy as np
import pandas as pd
from semopy import Model, calc_stats
rng=np.random.default_rng(9);n=240
usability=rng.normal(size=n);satisfaction=.7*usability+rng.normal(0,.6,n)
df=pd.DataFrame({**{f'u{i+1}':w*usability+rng.normal(0,.4,n) for i,w in enumerate([1,.8,.9])},**{f's{i+1}':w*satisfaction+rng.normal(0,.4,n) for i,w in enumerate([1,.9,.8])}})
model=Model('Usability =~ u1 + u2 + u3\\nSatisfaction =~ s1 + s2 + s3\\nSatisfaction ~ Usability')
model.fit(df)
parameters=model.inspect(std_est=True)
result=parameters.loc[(parameters.lval=='Satisfaction')&(parameters.op=='~'),['lval','op','rval','Estimate','Est. Std','p-value']].reset_index(drop=True)
fit=calc_stats(model);extra=fit[['DoF','CFI','TLI','RMSEA']].reset_index(drop=True)
''')
add('forest','''
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
''')
add('neural','''
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
rng=np.random.default_rng(13)
x=rng.normal(size=(160,2));y=(x[:,0]*x[:,1]+rng.normal(0,.15,160)>0).astype(int)
df=pd.DataFrame(x,columns=['feature_1','feature_2']);df['success']=y
xtrain,xtest,ytrain,ytest=train_test_split(x,y,test_size=.25,stratify=y,random_state=0)
# 標準化も学習用データだけで決める。
model=make_pipeline(StandardScaler(),MLPClassifier(hidden_layer_sizes=(8,),solver='lbfgs',alpha=.5,max_iter=2000,random_state=0)).fit(xtrain,ytrain)
baseline=DummyClassifier(strategy='most_frequent').fit(xtrain,ytrain)
result=pd.DataFrame([{'学習正解率':accuracy_score(ytrain,model.predict(xtrain)),'テスト正解率':accuracy_score(ytest,model.predict(xtest)),'多数派だけのテスト正解率':accuracy_score(ytest,baseline.predict(xtest))}])
extra=pd.DataFrame(confusion_matrix(ytest,model.predict(xtest),labels=[0,1]),index=['実際0','実際1'],columns=['予測0','予測1']).reset_index(names='実際')
''')
add('quant1','''
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
''')
add('quant2','''
import numpy as np
import pandas as pd
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,confusion_matrix
rows=[]
for experience,place,yes in [('new','home',5),('new','office',9),('experienced','home',11),('experienced','office',15)]:
    rows.extend([[experience,place,int(i<yes)] for i in range(20)])
df=pd.DataFrame(rows,columns=['experience','place','choose_A'])
# 質的説明変数の指示行列を判別分析に入れ、II類の考え方を試す。
x=pd.get_dummies(df[['experience','place']],dtype=float)
encoding=pd.concat([df[['experience','place']],x.astype(int)],axis=1)
xtrain,xtest,ytrain,ytest=train_test_split(x,df.choose_A,test_size=.25,stratify=df.choose_A,random_state=0)
model=LinearDiscriminantAnalysis(solver='svd').fit(xtrain,ytrain)
result=pd.DataFrame({'カテゴリー':x.columns,'判別得点への重み':model.coef_[0]})
extra=pd.DataFrame([{'切片_判別得点':model.intercept_[0],'テスト人数':len(ytest),'テスト正解人数':int((model.predict(xtest)==ytest).sum()),'テスト正解率':accuracy_score(ytest,model.predict(xtest))}])
# 重みの基準や尺度は実装で異なる。判別得点の符号だけを重要度として読まない。
''')
EXAMPLES['quant3']=EXAMPLES['mca'].replace('scaling = "principal"','scaling = "standard"')
add('quant4','''
import numpy as np
import pandas as pd
# 大きいほど似ている対称な親近性行列。対角は0。
df=pd.DataFrame([[0,9,2,1],[9,0,1,2],[2,1,0,8],[1,2,8,0]],index=list('ABCD'),columns=list('ABCD'))
e=df.to_numpy(dtype=float);h=e+e.T;g=h-np.diag(h.sum(axis=1))
eigenvalues,eigenvectors=np.linalg.eigh(g)
# 全点が同じ座標になる自明な0固有値を除き、大きい順の2軸を使う。
indices=np.flatnonzero(np.abs(eigenvalues)>1e-8)[::-1][:2]
xy=eigenvectors[:,indices]
result=pd.DataFrame({'対象':df.index,'軸1':xy[:,0],'軸2':xy[:,1]})
extra=pd.DataFrame({'軸':['軸1','軸2'],'固有値':eigenvalues[indices]});coordinates=result[['軸1','軸2']]
''')


# Complete the example reports with the outputs used for interpretation.
# The same 60 categorical responses as III: compare methods without changing people.
add('tsne',EXAMPLES['mca'].split('# 選ばれた回数の違い')[0]+"\nfrom sklearn.manifold import TSNE\n# 3質問を同じ重さで比較。質問1個の回答が違うと、0/1列の二乗距離は2増える。\n# この例は頻度による列の標準化をしない。IDは入力に使わない。\nx=z.to_numpy()\nsettings=[(5,42),(15,42),(30,42),(15,7)]\nplots=[];summary=[];frames=[]\nfor perplexity,seed in settings:\n    model=TSNE(n_components=2,perplexity=perplexity,random_state=seed,\n               init='random',learning_rate='auto',max_iter=1000,method='exact')\n    xy=model.fit_transform(x)\n    points=pd.DataFrame(xy,index=df.index,columns=['座標1','座標2']).join(df).reset_index(names='回答者ID')\n    plots.append({'perplexity':perplexity,'seed':seed,'points':points})\n    summary.append({'perplexity':perplexity,'random_state':seed,'KLダイバージェンス':model.kl_divergence_,\n                    '反復回数':model.n_iter_,'学習率':model.learning_rate_})\n    frames.append(points.assign(perplexity=perplexity,random_state=seed))\nresult=plots[1]['points'].head(6)\nextra=pd.DataFrame(summary)\nall_coordinates=pd.concat(frames,ignore_index=True)\n")

def extend(key,code): EXAMPLES[key]+=textwrap.dedent(code).strip()+'\n'
extend('describe','''
q=df.time_sec.quantile([.25,.75])
extra=pd.DataFrame([{'第1四分位数':q.loc[.25],'第3四分位数':q.loc[.75],'四分位範囲_IQR':q.loc[.75]-q.loc[.25],'欠測数':df.time_sec.isna().sum()}])
''')
extend('crosstab','''
result['B_percent']=(counts.B/counts.sum(axis=1)*100).to_numpy()
result['行合計']=counts.sum(axis=1).to_numpy()
''')
extend('welch','''
extra=pd.DataFrame({'群':['A','B'],'人数':[len(a),len(b)],'平均_秒':[a.mean(),b.mean()],'標準偏差_秒':[a.std(),b.std()]})
result['平均差の標準誤差']=(a.var()/len(a)+b.var()/len(b))**.5
''')
extend('paired','''
result['対応する人数']=len(difference)
result['平均差の標準誤差']=difference.std()/len(difference)**.5
''')
extend('anova','''
from statsmodels.stats.multicomp import pairwise_tukeyhsd
result.insert(3,'mean_sq',result.sum_sq/result.df)
extra=df.groupby('screen').time_sec.agg(['count','mean','std']).reset_index()
eta2=result.loc[0,'sum_sq']/result.sum_sq.sum()
# 3つの全ペアを比較する場合の例。Tukey HSDで多重性を調整。
tukey=pairwise_tukeyhsd(df.time_sec,df.screen,alpha=.05)
posthoc=pd.DataFrame(tukey.summary().data[1:],columns=tukey.summary().data[0])
more={'効果量':pd.DataFrame([{'eta2':eta2}]),'Tukey HSDの全ペア比較（差はgroup2−group1）':posthoc}
''')
extend('ranks','''
extra=pd.DataFrame([{'A中央値':a.median(),'B中央値':b.median(),'順位二分相関_Aが大きい方向':2*test.statistic/(len(a)*len(b))-1}])
''')
extend('categorical','''
result['標本オッズ比_A対B']=fisher.statistic
result['成功率差_B−A']=.9-.6
extra=pd.DataFrame(expected,index=['A','B'],columns=['期待成功人数','期待失敗人数']).reset_index(names='画面')
''')
extend('mcnemar','''
result['検定に使う不一致の人数']=table.loc[0,1]+table.loc[1,0]
result['A成功率']=df.A.mean();result['B成功率']=df.B.mean()
''')
extend('correlation','''
ci=pearson.confidence_interval(confidence_level=.95)
extra=pd.DataFrame([{'組の数':len(df),'Pearson_rの95%CI下限':ci.low,'Pearson_rの95%CI上限':ci.high}])
''')
extend('regression','''
result['標準誤差']=model.bse.values;result['t']=model.tvalues.values;result['p']=model.pvalues.values
extra=pd.DataFrame([{'n':model.nobs,'R2':model.rsquared,'調整済みR2':model.rsquared_adj,'残差標準偏差_円':model.mse_resid**.5,'F':model.fvalue,'モデル全体_p':model.f_pvalue}])
''')
extend('logistic','''
ci=model.conf_int()
extra=pd.DataFrame({'係数':model.params.index,'推定値':model.params.values,'標準誤差':model.bse.values,'z':model.tvalues.values,'p':model.pvalues.values,'オッズ比':np.exp(model.params.values),'ORの95%CI下限':np.exp(ci[0].values),'ORの95%CI上限':np.exp(ci[1].values)})
more={'モデル全体の出力':pd.DataFrame([{'n':model.nobs,'対数尤度':model.llf,'AIC':model.aic,'McFadden擬似R2':model.prsquared,'尤度比検定_p':model.llr_pvalue}])}
''')
extend('mixed','''
result['人数']=df.person.nunique();result['観測数']=len(df);result['収束']=bool(model.converged)
extra=pd.DataFrame({'固定効果':model.fe_params.index,'推定値':model.fe_params.values,'標準誤差':model.bse_fe.values,'Wald_z':model.tvalues.loc[model.fe_params.index].values,'p':model.pvalues.loc[model.fe_params.index].values})
''')
extend('factor','''
result['共通性']=(model.components_**2).sum(axis=0)
factor_ss=(model.components_**2).sum(axis=1)
extra=pd.DataFrame({'因子':['因子1','因子2'],'負荷量平方和':factor_ss,'全分散に対する割合':factor_ss/x.shape[1],'累積割合':np.cumsum(factor_ss/x.shape[1])})
''')
extend('ca','''
extra.insert(1,'固有値',s[:2]**2)
extra['累積慣性の割合']=np.cumsum(extra['慣性の割合'])
''')
extend('mds','''
from itertools import combinations
more={'元の非類似度と図の距離の照合':pd.DataFrame([{'ペア':str(df.index[i])+'−'+str(df.index[j]),'元の非類似度':df.iloc[i,j],'図の距離':np.linalg.norm(xy[i]-xy[j])} for i,j in combinations(range(len(df)),2)])}
''')
extend('cluster','''
from sklearn.metrics import silhouette_score
extra['人数']=result.groupby('cluster').size()
more={'分類の設定とまとまり':pd.DataFrame([{'指定した群数':model.n_clusters,'群内平方和_inertia':model.inertia_,'シルエット係数':silhouette_score(x,model.labels_)}])}
''')
extend('conjoint','''
ci=model.conf_int();result['標準誤差']=model.bse.values;result['95%CI下限']=ci[0].values;result['95%CI上限']=ci[1].values
ranges=np.array([abs(model.params['C(material)[T.wood]']),abs(model.params['C(shape)[T.square]']),abs(model.params['C(price_yen)[T.20000]'])])
extra=pd.DataFrame({'属性':['素材','形','価格'],'部分効用のレンジ':ranges,'相対重要度':ranges/ranges.sum()})
more={'評定モデルの当てはまり':pd.DataFrame([{'R2':model.rsquared,'調整済みR2':model.rsquared_adj,'残差標準偏差':model.mse_resid**.5}])}
''')
extend('sem','''
result=parameters.loc[(parameters.lval=='Satisfaction')&(parameters.op=='~'),['lval','op','rval','Estimate','Std. Err','Est. Std','p-value']].reset_index(drop=True)
extra=fit[['DoF','chi2','chi2 p-value','CFI','TLI','RMSEA']].reset_index(drop=True)
more={'測定項目の因子負荷量':parameters.loc[parameters.lval.isin(df.columns)&(parameters.op=='~'),['lval','rval','Estimate','Std. Err','Est. Std','p-value']].reset_index(drop=True)}
''')
extend('forest','''
from sklearn.inspection import permutation_importance
from sklearn.metrics import root_mean_squared_error,r2_score
for i,(name,estimator) in enumerate([('決定木',DecisionTreeRegressor(max_depth=3,random_state=0)),('ランダムフォレスト',RandomForestRegressor(n_estimators=100,min_samples_leaf=3,random_state=0))]):
    estimator.fit(xtrain,ytrain);pred=estimator.predict(xtest)
    result.loc[i,'テストRMSE_円']=root_mean_squared_error(ytest,pred);result.loc[i,'テストR2']=r2_score(ytest,pred)
basepred=np.repeat(ytrain.mean(),len(ytest))
result.loc[2,'テストRMSE_円']=root_mean_squared_error(ytest,basepred);result.loc[2,'テストR2']=r2_score(ytest,basepred)
importance=permutation_importance(model,xtest,ytest,scoring='neg_mean_absolute_error',n_repeats=10,random_state=0)
extra=pd.DataFrame({'特徴量':xtest.columns,'並べ替えによるMAE増加_円':importance.importances_mean,'10回の標準偏差_円':importance.importances_std})
''')
extend('neural','''
from sklearn.metrics import precision_score,recall_score,f1_score,roc_auc_score
pred=model.predict(xtest);prob=model.predict_proba(xtest)[:,1]
more={'成功1を陽性としたテスト指標':pd.DataFrame([{'適合率':precision_score(ytest,pred),'再現率_感度':recall_score(ytest,pred),'F1':f1_score(ytest,pred),'ROC_AUC':roc_auc_score(ytest,prob),'テスト人数':len(ytest)}])}
''')
extend('quant1','''
extra['重相関係数_R']=model.rsquared**.5;extra['調整済みR2']=model.rsquared_adj;extra['残差標準偏差_秒']=model.mse_resid**.5
rows=[]
for column,other in [('shape','material'),('material','shape')]:
    reduced=ols(f'time_sec ~ C({other})',data=df).fit()
    category_scores=result.loc[result['項目']==column,'カテゴリースコア_秒']
    rows.append({'項目':column,'レンジ_秒':category_scores.max()-category_scores.min(),'偏相関係数の大きさ':((reduced.ssr-model.ssr)/reduced.ssr)**.5})
more={'各項目の関わり方':pd.DataFrame(rows)}
''')
extend('quant2','''
score=model.decision_function(xtrain);overall=score.mean()
between=sum((ytrain==label).sum()*(score[ytrain==label].mean()-overall)**2 for label in [0,1])
extra['相関比_eta2_学習']=between/((score-overall)**2).sum()
extra['学習正解率']=accuracy_score(ytrain,model.predict(xtrain))
more={'学習に使わなかった20人の混同行列':pd.DataFrame(confusion_matrix(ytest,model.predict(xtest),labels=[0,1]),index=['実際0','実際1'],columns=['予測0','予測1']).reset_index(names='実際')}
''')
extend('quant4','''
all_indices=np.flatnonzero(np.abs(eigenvalues)>1e-8)[::-1]
extra=pd.DataFrame({'軸':[f'第{i+1}軸' for i in range(len(all_indices))],'固有値':eigenvalues[all_indices]})
''')

def table(frame,limit=None):
    f=frame.copy()
    if limit: f=f.head(limit)
    return {'columns':[str(c) for c in f.columns],'rows':json.loads(f.to_json(orient='values',double_precision=6,force_ascii=False))}
output={}
for key,body in EXAMPLES.items():
    code='# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。\n'+body+'\nprint(result.round(4).to_string(index=False))\n'
    if 'extra=' in body or 'extra =' in body: code+='print(extra.round(4).to_string(index=False))\n'
    if key=='pca': code+='print(coordinates.rename_axis("製品ID").round(4).to_string())\n'
    if key in ['quant1','quant2','quant3','mca','tsne']:
        code+='# 変換例の表示だけ重複をまとめる。解析には全員分を使う。\nprint(encoding.drop_duplicates().to_string(index=False))\n'
    if 'sample_scores=' in body: code+='print(sample_scores.rename_axis("回答者ID").round(4).to_string())\n'
    if 'more=' in body:
        code+='for title,frame in more.items():\n    print(title)\n    print(frame.round(4).to_string(index=False))\n'
    if key=='tsne':
        code+="\nif __name__ == '__main__':\n    import matplotlib.pyplot as plt\n    all_coordinates.to_csv('tsne-coordinates.csv',index=False,encoding='utf-8-sig')\n    fig,axes=plt.subplots(2,2,figsize=(10,9))\n    colors={('reading','wood','natural'):'#cc2939',('work','steel','sharp'):'#2865b0',('chat','fabric','soft'):'#347a57'}\n    for ax,item in zip(axes.flat,plots):\n        points=item['points']\n        shades=[colors.get((r.purpose,r.material,r.style),'#aaa') for r in points.itertuples()]\n        ax.scatter(points['座標1'],points['座標2'],c=shades,alpha=.8)\n        ax.set(title=f\"perplexity={item['perplexity']}, seed={item['seed']}\",xlabel='Coordinate 1',ylabel='Coordinate 2')\n        ax.set_aspect('equal',adjustable='datalim')\n    fig.tight_layout()\n    fig.savefig('tsne-comparison.png',dpi=160)\n    plt.show()\n"
    ns={'__name__':'example_generation'}
    with contextlib.redirect_stdout(io.StringIO()),warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter('always')
        exec(compile(code,f'{key}.py','exec'),ns)
    relevant=[str(w.message) for w in caught if not issubclass(w.category,FutureWarning)]
    if relevant: print(key,'WARN',relevant)
    df=ns['df'];result=ns['result']
    (ROOT/f'public/data/method-examples/{key}.py').write_text(code)
    df.to_csv(ROOT/f'public/data/method-examples/{key}.csv',index=True,index_label='record_id',encoding='utf-8-sig')
    preview=df.reset_index(names='record_id')
    output[key]={'input':table(preview,6),'count':len(df),'output':table(result),'code':code,'extra':table(ns['extra']) if 'extra' in ns else None,'scores':table(ns['coordinates'].reset_index(names='製品ID')) if key=='pca' else None}
    if 'encoding' in ns: output[key]['encoding']=table(ns['encoding'].drop_duplicates())
    if 'sample_scores' in ns:
        output[key]['sampleScores']=table(ns['sample_scores'].reset_index(names='回答者ID'))
        output[key]['sampleProfiles']=table(ns['sample_profiles'])
        ns['sample_scores'].to_csv(ROOT/f'public/data/method-examples/{key}-scores.csv',index_label='回答者ID',encoding='utf-8-sig')
    if key=='tsne':
        output[key]['plots']=[{'perplexity':item['perplexity'],'seed':item['seed'],'points':table(item['points'])} for item in ns['plots']]
        ns['all_coordinates'].to_csv(ROOT/'public/data/method-examples/tsne-coordinates.csv',index=False,encoding='utf-8-sig')
    output[key]['more']=[{'caption':title,'data':table(frame)} for title,frame in ns.get('more',{}).items()]
    print(key, len(df),result.round(3).to_dict('records'))
versions={name:importlib.metadata.version(name) for name in ['numpy','pandas','scipy','statsmodels','scikit-learn','semopy']}
(ROOT/'src/methodExampleResults.json').write_text(json.dumps({'versions':versions,'examples':output},ensure_ascii=False,indent=2,allow_nan=False)+'\n')
print('Saved',len(output),'examples.',versions)
