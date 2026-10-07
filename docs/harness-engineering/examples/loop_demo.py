"""固定回應的工作迴圈實驗。無網路、無任意命令、無真實模型。"""


def run(script, max_steps=6):
    if type(max_steps) is not int or max_steps < 1:
        raise ValueError("max_steps 必須是正整數")
    fixed = False
    verified = False
    trace = []
    # ponytail: 固定動作及單一狀態，只教控制流程；接真實模型時補供應商解析與用量記錄。
    for step, action in enumerate(script, 1):
        if step > max_steps:
            return "step_limit", trace
        try:
            if not isinstance(action, dict) or set(action) != {"tool"}:
                raise ValueError("動作必須只有 tool 欄位")
            tool = action["tool"]
            if tool not in ("read", "read_missing", "fix", "check", "finish"):
                raise ValueError("工具不在允許清單")
            if tool == "read":
                result = "total >= 1000" if fixed else "total > 1000"
            elif tool == "read_missing":
                raise FileNotFoundError("模擬讀檔工具執行失敗：目標不存在")
            elif tool == "fix":
                fixed, verified = True, False
                result = "已更新模擬狀態；尚未檢查"
            elif tool == "check":
                results = [0 if (n >= 1000 if fixed else n > 1000) else 60
                           for n in (999, 1000, 1001)]
                verified = results == [60, 0, 0]
                result = f"{results}; passed={verified}"
            else:
                status = "completed" if verified else "unverified"
                trace.append((step, tool, status))
                return status, trace
            trace.append((step, tool, result))
        except (ValueError, OSError) as error:
            trace.append((step, "error", str(error)))
    return "script_exhausted", trace


def demo():
    def actions(*names):
        return [{"tool": name} for name in names]

    cases = [
        ("正常完成", actions("read", "fix", "check", "finish"), 6, "completed"),
        ("工具要求被拒後修正", actions("shell", "fix", "check", "finish"), 6, "completed"),
        ("工具執行失敗後修正", actions("read_missing", "read", "fix", "check", "finish"), 6, "completed"),
        ("達到步數上限", actions("read", "read", "read", "finish"), 2, "step_limit"),
        ("未檢查就完成", actions("fix", "finish"), 6, "unverified"),
        ("原程式檢查失敗", actions("check", "finish"), 6, "unverified"),
        ("修改使舊驗證失效", actions("fix", "check", "fix", "finish"), 6, "unverified"),
    ]
    for label, script, limit, expected in cases:
        status, trace = run(script, limit)
        assert status == expected, (label, status)
        assert len(trace) <= limit
        if label in ("工具要求被拒後修正", "工具執行失敗後修正"):
            assert trace[0][1] == "error"
        print(f"{label}: {status}")
        for row in trace:
            print(" ", row)
    assert run([{"tool": "fix", "command": "ignored?"}])[1][0][1] == "error"
    assert run([])[0] == "script_exhausted"
    print("PASS: loop checks")


if __name__ == "__main__":
    demo()
