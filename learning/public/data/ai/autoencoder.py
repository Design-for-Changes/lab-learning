"""ラベルを使わず、手書き画像を64個→16個→64個の数へ変換する練習。"""
from pathlib import Path
import json
import numpy as np
import sklearn
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor


def run_example():
    # 1行が8×8の画像。数字の正解ラベル（target）は使わない。
    x = load_digits().data / 16.0
    train_ids, test_ids = train_test_split(
        np.arange(len(x)), test_size=0.2, random_state=42
    )
    train, test = x[train_ids], x[test_ids]

    # 隠れ層の16個を通らないと、出力の64個へ進めない構造。
    model = MLPRegressor(
        hidden_layer_sizes=(16,), activation="relu", solver="adam",
        max_iter=500, tol=1e-5, n_iter_no_change=20, random_state=7,
    )
    model.fit(train, train)  # お手本は「数字の名前」ではなく入力画像自身。
    restored = model.predict(test)
    hidden = np.maximum(0, test @ model.coefs_[0] + model.intercepts_[0])
    mse = float(np.mean((test - restored) ** 2))
    # 入力によらず学習用の平均画像を返すだけ、という比較用の基準。
    baseline = float(np.mean((test - train.mean(axis=0)) ** 2))
    samples = [
        {"sourceIndex": int(test_ids[i]), "input": test[i].tolist(),
         "code": hidden[i].tolist(), "restored": restored[i].tolist(),
         "mse": float(np.mean((test[i] - restored[i]) ** 2))}
        for i in range(3)  # 評価用の先頭3枚。復元の良さで選ばない。
    ]
    return {"trainCount": len(train), "testCount": len(test),
            "trainIds": train_ids.tolist(), "testIds": test_ids.tolist(),
            "testMSE": mse, "baselineMSE": baseline, "samples": samples,
            "iterations": model.n_iter_, "lossCurve": model.loss_curve_,
            "sklearnVersion": sklearn.__version__, "numpyVersion": np.__version__}


if __name__ == "__main__":
    result = run_example()
    print(f"学習用 {result['trainCount']}枚／評価用 {result['testCount']}枚")
    print(f"復元の平均二乗誤差：{result['testMSE']:.4f}")
    print(f"平均画像だけを返す基準：{result['baselineMSE']:.4f}")
    # 図は表示用だけ0〜1へ収める。上の誤差は補正前の値で計算する。
    try:
        import matplotlib.pyplot as plt
        fig, axes = plt.subplots(2, 3, figsize=(7, 5))
        for i, sample in enumerate(result["samples"]):
            for row, key in enumerate(["input", "restored"]):
                pixels = np.clip(sample[key], 0, 1).reshape(8, 8)
                axes[row, i].imshow(pixels, cmap="gray", vmin=0, vmax=1)
                axes[row, i].set_title(f"{'Input' if row == 0 else 'Restored'} {i + 1}")
                axes[row, i].axis("off")
        fig.tight_layout()
        fig.savefig("autoencoder-result.png", dpi=160)
        print("autoencoder-result.png に元画像と復元画像を保存しました。")
    except ImportError:
        print("図も保存する場合は matplotlib をインストールしてください。")
    Path("autoencoder-result.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
    )
