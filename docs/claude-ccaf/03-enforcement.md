# 03｜執行約束：把規則放在動作之前

**考綱：1.4、1.5。** 本章區分「要求模型記得規則」與「系統保證動作不會越界」。先備是[工具迴圈](01-agent-loop.md)。

## 提示詞無法代替狀態檢查

活動平臺規定只有確認票券所有權後纔可變更場次。system prompt 可以寫「先驗證持有人」，但真正會改動資料的工具仍應檢查可信的已驗證狀態。否則只要模型跳過一步，或誤把使用者自述當成驗證結果，變更仍會發生。

設計時先寫出不變條件：執行變更時，已驗證的使用者必須擁有該票券，目標場次必須有可用容量，操作不得重複生效。前兩項呼應考綱的 prerequisite gate；最後一項是本書加入的工程練習，用來檢查重試副作用。[官方考綱 §6，1.4–1.5](appendix-sources.md)

```python
# 示意程式；verified_user 由可信的驗證流程取得，不接受模型自行指定。
def authorize_change(verified_user, ticket, requested_event):
    if verified_user is None:
        return {"allowed": False, "reason": "identity_required"}
    if ticket["owner_id"] != verified_user["id"]:
        return {"allowed": False, "reason": "owner_mismatch"}
    if requested_event["remaining"] <= 0:
        return {"allowed": False, "reason": "no_capacity"}
    return {"allowed": True}
```

這段只展示 gate，未實作交易鎖定；正式服務仍須在真正寫入時確認條件未改變。不要因為幾秒前查到一個座位，就保證現在一定可寫入。

## Pre 與 Post 的差別在時間

| 機制 | 發生時機 | 適合用途 | 無法完成的事 |
|---|---|---|---|
| Prompt | 模型決定前 | 解釋規則、優先順序與例外 | 保證每次遵守 |
| PreToolUse／執行前 gate | 工具真正執行前 | 阻擋不滿足條件的動作 | 自動證明所有外部狀態正確 |
| PostToolUse／回傳 adapter | 工具執行後 | 統一欄位、日期、狀態表示 | 撤銷已發生的副作用 |

一個出票服務傳 Unix timestamp，另一個傳 ISO 8601。可在回傳層把它們統一，但應保留原始欄位、時區與來源以利追查。把狀態碼 `2` 正規化成 `confirmed` 前，必須先知道該服務的代碼定義，不能讓模型猜。

目前 hooks 文件提供結果替換欄位；`PostToolUse` 的額外 context 與「替換輸出」不是同一件事。更重要的是，Post hook 執行時工具已跑完。若要避免變更票券，必須在 Pre 或後端執行層阻擋。SDK 與 CLI 的 callback／回傳格式應各自查閱，不能互貼設定。[Hooks reference：PostToolUse](https://code.claude.com/docs/en/hooks#posttooluse-decision-control)

## 中途轉人工也要完成交接

使用者同時問「換場次」與「補寄收據」。可先拆成兩個 issue，獨立調查；但最終回覆應合併呈現各自狀態。需要人工覈准的只有換場次時，不應把已可處理的收據問題丟掉。

本書的交接記錄示例：

```json
{
  "case_id": "CASE-18",
  "verified_customer_id": "U-63",
  "issues": [
    {"kind": "event_change", "status": "needs_review", "reason": "policy_gap"},
    {"kind": "receipt_copy", "status": "ready", "receipt_id": "R-71"}
  ],
  "actions_taken": ["已查覈票券持有人", "尚未變更場次"],
  "recommended_next_action": "由客服確認跨城市活動是否適用改期政策"
}
```

人員可能拿不到原對話，因此「請參閱上文」不足以交接。要傳入已核實的身分、請求、根因、已執行與未執行事項，以及建議下一步。必要資料範圍由接手任務決定。

**自測：** 工程師在 Post hook 發現違規後回傳 `block`，是否就阻止了改期？答案是否；執行順序已決定副作用發生。應把約束前移，並另外處理已發生動作的補救。

下一章：[工具契約與錯誤](04-tool-contracts.md)。升級條件詳見[可靠性](09-context-reliability.md)。
