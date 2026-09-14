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
