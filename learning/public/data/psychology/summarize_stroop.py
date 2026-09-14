"""架空のストループ課題データを、一人ずつ集計する練習。

同じフォルダーの stroop-example.csv を読みます。追加ライブラリは不要。
正答の反応時間を使い、誤答率は別に数えます。推測統計は行いません。
無反応や欠測などを扱う実験用の汎用解析コードではありません。
"""
import csv
from pathlib import Path
from statistics import mean


def summarize(path):
    # 1. CSVを読む。1行が1試行で、同じ人が何行も登場します。
    with path.open(encoding="utf-8", newline="") as source:
        rows = list(csv.DictReader(source))
    if not rows:
        raise ValueError("試行データがありません")
    groups, seen = {}, set()
    correct_trials = 0
    for row in rows:
        participant = row["participant"]
        trial, correct = int(row["trial"]), int(row["correct"])
        condition, reaction_time = row["condition"], float(row["rt_ms"])
        if (not participant or trial < 1 or correct not in (0, 1)
                or condition not in ("congruent", "incongruent")
                or not 0 < reaction_time < float("inf")):
            raise ValueError("参加者・試行番号・条件・正誤・反応時間を確認してください")
        key = (participant, trial)
        if key in seen:
            raise ValueError("同じ試行が重複しています")
        seen.add(key)
        groups.setdefault(participant, {"congruent": [], "incongruent": []})
        # 2. 正答だけを、その人の、その条件の箱へ入れます。
        if correct == 1:
            groups[participant][condition].append(reaction_time)
            correct_trials += 1

    # 3. 一人ずつ条件の平均と「不一致−一致」を出します。
    results = []
    for participant, conditions in sorted(groups.items()):
        if not all(conditions.values()):
            raise ValueError(f"{participant}に両条件の正答データが必要です")
        congruent = mean(conditions["congruent"])
        incongruent = mean(conditions["incongruent"])
        results.append((participant, congruent, incongruent, incongruent - congruent))
    print(f"参加者: {len(results)}人 / 試行: {len(rows)}回")
    print(f"誤答率: {(len(rows) - correct_trials) / len(rows):.1%}")
    print("参加者  一致(ms)  不一致(ms)  差(ms)")
    for participant, congruent, incongruent, difference in results:
        print(f"{participant}    {congruent:6.1f}    {incongruent:6.1f}    {difference:5.1f}")
    # 4. 人ごとの差を平均します。試行数が多い人を重く数えません。
    print(f"平均差（不一致−一致）: {mean(row[3] for row in results):.1f} ms")


if __name__ == "__main__":
    summarize(Path(__file__).resolve().with_name("stroop-example.csv"))
