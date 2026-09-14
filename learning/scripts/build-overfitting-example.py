"""Run a reproducible neural-network example; keep the final test set untouched."""
from pathlib import Path
import contextlib
import io
import json
import textwrap
import pandas as pd
from sklearn.model_selection import train_test_split

root=Path(__file__).resolve().parents[1]
dest=root/'public/data/ai'
df=pd.read_csv(root/'public/data/method-examples/neural.csv')
development,test=train_test_split(df,test_size=.25,stratify=df.success,random_state=0)
train,validation=train_test_split(development,test_size=.25,stratify=development.success,random_state=0)
data=pd.concat([train.assign(split='train'),validation.assign(split='validation'),test.assign(split='test')])
data.to_csv(dest/'overfitting.csv',index=False)
code=textwrap.dedent('''
from pathlib import Path
import json
import numpy as np
import pandas as pd
import sklearn
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import log_loss

folder=Path(__file__).resolve().parent
df=pd.read_csv(folder/'overfitting.csv')
columns=['feature_1','feature_2']
train=df[df.split=='train'];validation=df[df.split=='validation']
# testの40件は、設定や停止時点の検討には使わない。
scaler=StandardScaler().fit(train[columns])
x=scaler.transform(train[columns]);v=scaler.transform(validation[columns])
y=train.success.to_numpy();z=validation.success.to_numpy()
model=MLPClassifier(hidden_layer_sizes=(16,),activation='tanh',solver='adam',
                    alpha=0,learning_rate_init=.03,batch_size=len(train),random_state=0)
history=[];snapshots=[]
for epoch in range(1,3001):
    # partial_fitで1エポック進める。重みを更新するのは学習用90件だけ。
    model.partial_fit(x,y,classes=[0,1])
    if epoch==1 or epoch%25==0:
        p=model.predict_proba(x)[:,1];q=model.predict_proba(v)[:,1]
        row={'epoch':epoch,'trainLoss':float(log_loss(y,p)),
             'validationLoss':float(log_loss(z,q)),
             'trainCorrect':int(((p>=.5)==y).sum()),
             'validationCorrect':int(((q>=.5)==z).sum())}
        history.append(row)
        if epoch in [1,75,3000]:
            snapshots.append(dict(row,trainProbabilities=p.tolist(),validationProbabilities=q.tolist()))
result={'history':history,'snapshots':snapshots,'trainLabels':y.tolist(),
        'validationLabels':z.tolist(),'trainIds':train.record_id.tolist(),
        'validationIds':validation.record_id.tolist(),
        'testIds':df.loc[df.split=='test','record_id'].tolist(),
        'versions':{'numpy':np.__version__,'pandas':pd.__version__,'sklearn':sklearn.__version__}}
(folder/'overfitting-history.csv').write_text(pd.DataFrame(history).to_csv(index=False),encoding='utf-8')
print(pd.DataFrame([{k:v for k,v in r.items() if 'Probabilities' not in k} for r in snapshots]).round(4).to_string(index=False))
print('テスト用40件は未評価。学習用・検証用の経過を比較した計算例です。')
print('実行環境:',result['versions'])
''').strip()+'\n'
path=dest/'overfitting.py';path.write_text(code)
output=io.StringIO();namespace={'__file__':str(path),'__name__':'__main__'}
with contextlib.redirect_stdout(output):exec(compile(code,str(path),'exec'),namespace)
result=namespace['result'];middle=result['snapshots'][1];last=result['snapshots'][-1]
assert last['trainLoss']<middle['trainLoss'] and last['validationLoss']>middle['validationLoss']
assert last['trainCorrect']>middle['trainCorrect'] and last['validationCorrect']<middle['validationCorrect']
result.update(code=code,output=output.getvalue())
(root/'src/overfittingExample.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(output.getvalue())
