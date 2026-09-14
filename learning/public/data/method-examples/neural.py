# 架空データの計算練習。必要なパッケージは教材の手順で準備してください。
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
from sklearn.metrics import precision_score,recall_score,f1_score,roc_auc_score
pred=model.predict(xtest);prob=model.predict_proba(xtest)[:,1]
more={'成功1を陽性としたテスト指標':pd.DataFrame([{'適合率':precision_score(ytest,pred),'再現率_感度':recall_score(ytest,pred),'F1':f1_score(ytest,pred),'ROC_AUC':roc_auc_score(ytest,prob),'テスト人数':len(ytest)}])}

print(result.round(4).to_string(index=False))
print(extra.round(4).to_string(index=False))
for title,frame in more.items():
    print(title)
    print(frame.round(4).to_string(index=False))
