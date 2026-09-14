# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
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
score=model.decision_function(xtrain);overall=score.mean()
between=sum((ytrain==label).sum()*(score[ytrain==label].mean()-overall)**2 for label in [0,1])
extra['相関比_eta2_学習']=between/((score-overall)**2).sum()
extra['学習正解率']=accuracy_score(ytrain,model.predict(xtrain))
more={'学習に使わなかった20人の混同行列':pd.DataFrame(confusion_matrix(ytest,model.predict(xtest),labels=[0,1]),index=['実際0','実際1'],columns=['予測0','予測1']).reset_index(names='実際')}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
# 変換例の表示だけ重複をまとめる。解析には全員分を使う。
print(encoding.drop_duplicates().to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
