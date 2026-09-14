"""ハーネスの仕事を追う練習。言語モデルの応答は用意した模擬応答です。

外部サービスへの接続や追加ライブラリは不要です。
ツールの平均計算だけを実際に実行し、モデルへの結果の渡し方を見ます。
"""
import math


def mean_tool(values):
    if not isinstance(values, list) or not values:
        raise ValueError("空でない数のリストが必要です")
    if any(type(value) not in (int, float) or not math.isfinite(value) for value in values):
        raise ValueError("有限の数だけを入れてください")
    return sum(values) / len(values)


def mock_model(messages):
    """実際のAIの代わりに、順序を確認するための応答を返す。"""
    if messages[-1]["role"] == "tool":
        return {"type": "answer", "text": f"平均は{messages[-1]['result']}秒です。"}
    return {"type": "tool_call", "name": "mean", "arguments": {"values": [10, 12, 14]}}


def main():
    tools = {"mean": mean_tool}
    question = "10秒・12秒・14秒の平均を計算して"
    messages = [{"role": "user", "text": question}]
    print(f"[1] 利用者：{question}")

    # 無制限に繰り返さず、ここではモデルの呼び出しを2回までにする。
    for _ in range(2):
        response = mock_model(messages)
        if response["type"] == "answer":
            print(f"[6] 模擬モデルの回答：{response['text']}")
            return

        name = response["name"]
        arguments = response["arguments"]
        print(f"[2] 模擬モデルの要求：{name}({arguments.get('values')})")
        print("[3] ハーネス：許可したツールと入力を確認")
        if name not in tools or set(arguments) != {"values"}:
            raise ValueError("許可していないツール、または入力形式です")
        result = tools[name](arguments["values"])
        print(f"[4] 計算ツールの結果：{result}")

        # 要求と結果を記録し、次のモデル呼び出しへ渡す。
        messages.append({"role": "assistant", **response})
        messages.append({"role": "tool", "name": name, "result": result})
        print("[5] ハーネス：結果を履歴へ追加")

    raise RuntimeError("呼び出し回数の上限で停止しました")


if __name__ == "__main__":
    main()
