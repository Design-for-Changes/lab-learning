"""配布コードを実行し、教材に載せる画像と計算結果を保存する。"""
from pathlib import Path
import json
import runpy

root = Path(__file__).resolve().parents[1]
source = root / "public/data/ai/autoencoder.py"
result = runpy.run_path(str(source))["run_example"]()
assert not set(result["trainIds"]) & set(result["testIds"])
assert result["testMSE"] < result["baselineMSE"]
result["code"] = source.read_text()
(root / "src/autoencoderExample.json").write_text(
    json.dumps(result, ensure_ascii=False, indent=2) + "\n"
)
print(f"Autoencoder: train={result['trainCount']}, test={result['testCount']}, "
      f"MSE={result['testMSE']:.4f}, mean-image baseline={result['baselineMSE']:.4f}")
