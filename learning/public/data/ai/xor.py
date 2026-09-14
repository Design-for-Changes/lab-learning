"""06の実験：4通りのXORを、ニューラルネットワークに学習させる。"""
from pathlib import Path
import numpy as np
import pandas as pd

# 練習で変えるのは、まずこの1行だけ。100と5000を比べる。
UPDATES = 5000
LEARNING_RATE = 1.0

# 1. 問題と答えを読む。x1・x2が入力、yは答え合わせ用。
folder = Path(__file__).resolve().parent
df = pd.read_csv(folder / 'xor.csv')
x = df[['x1', 'x2']].to_numpy(dtype=float)
y = df['y'].to_numpy(dtype=float)

# 2. 05と同じ、入力2個・隠れ層2個・出力1個のネットワークを用意。
# 毎回、同じ初期値から始める。再実行時に前回の重みは引き継がない。
w1 = np.array([[.5, -.4], [-.5, .6]])
b1 = np.array([.1, -.1])
w2 = np.array([.7, -.6])
b2 = .1
sigmoid = lambda v: 1 / (1 + np.exp(-v))
history, snapshots = [], []
for step in range(UPDATES + 1):
    # 3. 今の重みで予測する。この計算には正解yを入れない。
    h = sigmoid(x @ w1.T + b1)
    p = sigmoid(h @ w2 + b2)
    # 4. 予測と正解を比べ、外れ方（損失）を測る。
    loss = -np.mean(y * np.log(p) + (1-y) * np.log(1-p))
    if step in [0, 100, 1000, UPDATES]:
        history.append({'更新回数': step, '平均損失': float(loss),
                        '正解数': int(np.sum((p >= .5) == y))})
        snapshots.append({'step': step, 'probabilities': p.tolist()})
    if step == UPDATES:
        break
    # 5. 誤差逆伝播：どの重みをどう直すか、勾配を求める。
    d = (p-y) / len(y)
    hidden = d[:, None] * w2[None, :] * h * (1-h)
    g_w2 = h.T @ d
    g_b2 = d.sum()
    g_w1 = hidden.T @ x
    g_b1 = hidden.sum(axis=0)
    # 6. 重みを少し直す。次の繰り返しで、もう一度予測する。
    w2 -= LEARNING_RATE * g_w2
    b2 -= LEARNING_RATE * g_b2
    w1 -= LEARNING_RATE * g_w1
    b1 -= LEARNING_RATE * g_b1

# 7. 全4通りの予測と、途中の成績を表示する。
result = df.assign(p=p, prediction=(p >= .5).astype(int))
print('[1] 読み込んだ4通りの問題と正解')
print(df.to_string(index=False))
print('[2] 学習の途中経過（正解数は4通り中）')
print(pd.DataFrame(history).round(6).to_string(index=False))
print('[3] 学習後の答え合わせ（pは1と予測する確率）')
print(result.round(6).to_string(index=False))
print('この4通りはすべて学習に使いました。未知データの試験ではありません。')
print('numpy / pandas:', np.__version__, pd.__version__)
