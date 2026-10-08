"""固定案例的資訊保留檢查，不是通用摘要模型或語意評分器。"""

REQUIRED = {
    "task": "滿 1000 元免運，未滿收 60 元",
    "constraint": "不得修改其他費用規則",
    "decision": "把 > 改為 >=",
    "evidence": "只確認寫入成功，尚未完成測試",
    "next": "檢查 999、1000、1001 元",
}


def missing_facts(summary):
    if not isinstance(summary, dict):
        raise ValueError("摘要必須是字典")
    # ponytail: 固定事實的精確比對；自由文字摘要需人工或經校準的語意核對。
    return [key for key, fact in REQUIRED.items() if summary.get(key) != fact]


def demo():
    incomplete = {key: value for key, value in REQUIRED.items()
                  if key not in ("constraint", "evidence")}
    incorrect = dict(REQUIRED, evidence="全部測試通過")
    preserved = dict(REQUIRED)
    assert missing_facts(incomplete) == ["constraint", "evidence"]
    assert missing_facts(incorrect) == ["evidence"]
    assert missing_facts(preserved) == []
    for label, summary in [("漏掉事實", incomplete),
                           ("把未知改成成功", incorrect),
                           ("保留必要資訊", preserved)]:
        print(f"{label}: {missing_facts(summary)}")
    print("PASS: context checks")


if __name__ == "__main__":
    demo()
