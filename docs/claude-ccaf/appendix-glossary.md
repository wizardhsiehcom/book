# 附錄｜英中術語與易混淆概念

本表是教學定義，API 參數與能力需按[來源頁](appendix-sources.md)的版本查閱。

| 術語 | 中文與意義 | 易混淆之處 |
|---|---|---|
| Agentic loop | 取得模型請求、執行工具、回傳結果的迴圈 | 不是固定工具腳本 |
| Workflow | 程式定義控制路徑的流程 | 也可使用 LLM |
| Coordinator | 協調者；分派與整合 | 不只是串接字串 |
| Subagent | 處理指定任務的子代理 | 非 fork 不自動取得父對話 |
| Task／Agent | 不同版本的派生工具名稱 | 考綱用 Task，現行文件用 Agent |
| tool_use | 模型提出的工具請求 | 不是工具已執行 |
| tool_result | 傳回的工具結果 | 要對應呼叫 ID |
| stop_reason | API 停止原因 | 有文字不等於 end_turn |
| end_turn | 模型回合結束 | 不保證業務完成 |
| tool_choice | 控制工具選擇 | 不提供業務授權 |
| Hook | 生命週期介入點 | 執行前與後不同 |
| Prerequisite gate | 執行前的必要條件檢查 | 提示詞不替代強制檢查 |
| MCP host/client/server | 承載應用、連線、提供能力 | 連線不等於全權限 |
| Resource | 可讀內容／目錄 | 唯讀查詢也可能是 tool |
| Tool contract | 目的、輸入輸出與失敗邊界 | 不是隻取個好名稱 |
| isError | MCP 工具結果的失敗標記 | errorCategory 是應用自訂欄位 |
| Scope | 設定作用域 | User 與 project 不同 |
| CLAUDE.md | 持續提供的專案／個人指引 | 不是安全 sandbox |
| Skill | 按需使用的任務流程 | argument-hint 不是驗證器 |
| Plan mode | 先探索與設計的模式 | 不只依檔案數選擇 |
| Few-shot | 少量示例引導行為 | 要選有判斷價值的例子 |
| Strict output | 限制輸出結構 | 不保證來源與語意 |
| Required／nullable | 欄位必須出現／值可為 null | 可以同時成立 |
| Semantic validation | 加總與業務規則等語意驗證 | 不只是 JSON 可解析 |
| Case facts | 精確案件事實 | 不可摘要成模糊金額日期 |
| Scratchpad | 探索結論與工作筆記 | 內容仍可能過期 |
| Manifest | 工作狀態與結果位置索引 | 不是結果內容 |
| Provenance | 資訊來源鏈 | 網址清單不等於主張對照 |
| Calibration | 用標註資料校準信心 | 自述信心不是驗證後概率 |
| Stratified sampling | 分層抽樣 | 只抽低信心有盲區 |
| custom_id | 對應批次請求與結果 | 不能依回傳順序配對 |
| Scaled score | 經轉換的考試分數 | 720 不等於原始答對率 72% |

回到[導讀](README.md)或[考綱地圖](00-exam-map.md)。
