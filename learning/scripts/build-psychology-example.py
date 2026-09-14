"""Create explicitly synthetic practice data and capture the downloadable code's output."""
import csv
import json
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
folder = root / "public/data/psychology"
rows = []
colors, words = ["red", "blue", "green"], ["赤", "青", "緑"]
for index, (baseline, difference) in enumerate(zip(
        [500, 620, 560, 700, 580, 660, 760, 540],
        [100, 140, 80, 60, 100, 180, 40, 100])):
    conditions = ["congruent", "incongruent"]
    if index % 2:
        conditions.reverse()
    # Alternate conditions, balancing the starting condition across participants.
    # These values are constructed for arithmetic, not simulated research evidence.
    for repetition, offset in enumerate([-20, 0, 20, 0]):
        color_index = repetition % 3
        for position, condition in enumerate(conditions):
            incongruent = condition == "incongruent"
            rows.append({"participant": f"P{index + 1:02d}",
                         "trial": repetition * 2 + position + 1,
                         "condition": condition,
                         "word": words[(color_index + int(incongruent)) % 3],
                         "ink_color": colors[color_index],
                         "rt_ms": baseline + offset + (difference if incongruent else 0),
                         "correct": 1})
with (folder / "stroop-example.csv").open("w", encoding="utf-8", newline="") as target:
    writer = csv.DictWriter(target, fieldnames=list(rows[0]), lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
output = subprocess.check_output([sys.executable, str(folder / "summarize_stroop.py")], text=True)
(root / "src/psychologyExample.json").write_text(
    json.dumps({"trials": rows, "output": output.rstrip()}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8")
print(output, end="")
