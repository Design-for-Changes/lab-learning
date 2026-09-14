"""Generate local Python practice files and verified outputs for the AI course."""
from pathlib import Path
import csv
import contextlib
import io
import json
import textwrap

root=Path(__file__).resolve().parents[1]
dest=root/'public/data/ai'
dest.mkdir(parents=True,exist_ok=True)
graph=textwrap.dedent('''
from pathlib import Path
import csv

# CSVとこのコードを同じフォルダーに保存する。
path=Path(__file__).with_name('collaboration-edges.csv')
with path.open(encoding='utf-8-sig',newline='') as f:
    edges=[(r['source'],r['target']) for r in csv.DictReader(f)]
nodes=sorted({v for edge in edges for v in edge})
neighbors={v:set() for v in nodes}
for a,b in edges:
    neighbors[a].add(b)
    neighbors[b].add(a)
print('次数:', {v:len(neighbors[v]) for v in nodes})
print('AとDの共通の隣接頂点:', sorted(neighbors['A'] & neighbors['D']))
print('隣接行列（行・列の順番）:', nodes)
for a in nodes:
    print(a, [int(b in neighbors[a]) for b in nodes])
''').strip()+'\n'
# XORの配布コードを、そのまま実行して検算値を作る。
xor=(dest/'xor.py').read_text()
cooccurrence=textwrap.dedent('''
from pathlib import Path
import numpy as np
import pandas as pd

# 1行が感想1件。単語があると1、ないと0にした表を読む。
df=pd.read_csv(Path(__file__).with_name('word-presence.csv'))
words=['椅子','机','軽い','丈夫']
x=df[words].to_numpy()
if not np.isin(x,[0,1]).all():
    raise ValueError('単語の列は0または1にしてください。')
# .Tは転置、@は行列の掛け算。両方1の感想を数える。
counts=x.T@x
print('共起件数（対角は、その語が出た感想の件数）')
print(pd.DataFrame(counts,index=words,columns=words).to_string())
threshold=2
edges=[]
for i in range(len(words)):
    for j in range(i+1,len(words)):
        # 自分自身の組と、逆順で重複する組は除く。
        if counts[i,j]>=threshold:
            edges.append([words[i],words[j],int(counts[i,j])])
print(f'共起{threshold}件以上の辺')
print(pd.DataFrame(edges,columns=['語1','語2','件数']).to_string(index=False))
print('椅子と軽いのJaccard係数:',counts[0,2]/(counts[0,0]+counts[2,2]-counts[0,2]))
''').strip()+'\n'
word_data=json.loads((root/'src/cooccurrenceData.json').read_text())
with (dest/'word-presence.csv').open('w',encoding='utf-8',newline='') as f:
    writer=csv.writer(f,lineterminator='\n')
    writer.writerow(['id',*word_data['words']])
    for doc in word_data['documents']:
        writer.writerow([doc['id'],*[int(w in doc['terms']) for w in word_data['words']]])
(dest/'collaboration-edges.csv').write_text('source,target\nA,B\nA,C\nB,C\nC,D\nD,E\nD,F\nE,F\n')
(dest/'xor.csv').write_text('x1,x2,y\n0,0,0\n0,1,1\n1,0,1\n1,1,0\n')
out={}
for name,code in [('graph',graph),('xor',xor),('cooccurrence',cooccurrence)]:
    path=dest/f'{name}.py';path.write_text(code)
    output=io.StringIO();ns={'__file__':str(path),'__name__':'__main__'}
    with contextlib.redirect_stdout(output):exec(compile(code,str(path),'exec'),ns)
    out[name]={'code':code,'output':output.getvalue()}
    if name=='cooccurrence':
        out[name]['counts']=ns['counts'].tolist()
        assert ns['edges']==[['椅子','軽い',3],['机','丈夫',2]]
    if name=='xor':
        out[name]['history']=ns['history']
        out[name]['probabilities']=ns['p'].tolist()
        out[name]['snapshots']=ns['snapshots']
        assert all((ns['p']>=.5)==ns['y'])
        assert ns['history'][-1]['平均損失']<.003
(root/'src/aiExampleResults.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('Graph, XOR, and co-occurrence examples executed; results and local files saved.')
