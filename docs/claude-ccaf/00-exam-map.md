# 00｜考試範圍與讀書地圖

本頁以官方 **Exam Guide v1.0，2026 年 7 月生效**為錨點。考試資訊來自 PDF 第 1–4、33、37–39 頁，於 2026-09-07 查覈；之後若有更新，先更新任務對照，再調整正文。[官方來源與版本](appendix-sources.md)

## 確認你準備的是哪個考試

| 項目 | 本版考綱記載 |
|---|---|
| 認證 | Claude Certified Architect – Foundations |
| 代碼 | CCAR-F |
| 題數／時間 | 60 題／120 分鐘 |
| 題型 | 單選與複選；各題明示應選幾項 |
| 情境結構 | 從六類情境中選取四類 |
| 通過標準 | 100–1,000 的 scaled score，通過分數 720 |

**720 不等於原始答對率 72%。** Scaled score 用於不同試卷的分數等化；不能拿本書 18 題分數直接換算。權重是計分題目的近似佔比，不保證各領域題數完全等於百分比乘以 60。

## 五大領域

| 領域 | 權重 | 主責章節 | 核心判斷 |
|---|---:|---|---|
| Agentic Architecture & Orchestration | 27% | [01](01-agent-loop.md)–[03](03-enforcement.md) | 控制流程、分工、執行約束 |
| Tool Design & MCP Integration | 18% | [04](04-tool-contracts.md)–[05](05-mcp.md) | 工具契約、錯誤、接入 |
| Claude Code Configuration & Workflows | 20% | [06](06-claude-code.md)–[07](07-ci-review.md) | 作用域、迭代、CI |
| Prompt Engineering & Structured Output | 20% | [07](07-ci-review.md)、[08](08-structured-output.md)、[10](10-batch-human-review.md) | 判準、驗證、批次 |
| Context Management & Reliability | 15% | [09](09-context-reliability.md)–[10](10-batch-human-review.md) | 事實、失敗、來源、校準 |

權重較小不表示可以跳過。可靠性常與其他領域出現在同一情境，例如工具錯誤既涉及契約，也涉及跨代理錯誤傳遞。

## 六類情境的讀法

官方情境涵蓋客服解決、Claude Code 產碼、多代理研究、開發者生產力、CI 與結構資料抽取。讀題先標出目標、硬性條件、觀察到的失敗、可用工具，再選能直接修復問題的方案。較大型模型、更長提示詞、更多 agent 都不是不需證據的萬用答案。

本書用活動與票券平臺串起原創案例；語境和官方範例不同，練的是可轉移的判斷。

## 30 項任務對照

下表用中文摘要任務，保留官方編號，是學習索引，不取代官方的詳細 knowledge／skills。練習欄對應[實作工作坊](11-labs.md)與[情境題](12-practice.md)。

| 任務 | 學習焦點 | 正文章節 | 練習 |
|---|---|---|---|
| 1.1 | Stop reason 與工具往返 | [01](01-agent-loop.md) | Lab 0、1 |
| 1.2 | 協調者與子代理 | [02](02-orchestration.md) | Lab 4；Q07、09 |
| 1.3 | 派生與明確傳入上下文 | [02](02-orchestration.md) | Lab 4；Q07 |
| 1.4 | 前置 gate 與交接 | [03](03-enforcement.md) | Lab 1；Q01 |
| 1.5 | Hook 與正規化 | [03](03-enforcement.md) | Lab 1；Q01 |
| 1.6 | 固定與動態拆工 | [02](02-orchestration.md) | Lab 4；Q09 |
| 1.7 | Resume、fork、狀態新鮮度 | [02](02-orchestration.md) | Lab 4；Q12 |
| 2.1 | 工具描述與邊界 | [04](04-tool-contracts.md) | Lab 1；Q11 |
| 2.2 | 結構化錯誤 | [04](04-tool-contracts.md) | Lab 1；Q03 |
| 2.3 | 工具分配與 tool choice | [04](04-tool-contracts.md) | Lab 1、3 |
| 2.4 | MCP scope、環境變數、resources | [05](05-mcp.md) | Lab 2；Q11 |
| 2.5 | 內建工具 | [04](04-tool-contracts.md) | Lab 2；Q10 |
| 3.1 | CLAUDE.md 層級 | [06](06-claude-code.md) | Lab 2；Q04 |
| 3.2 | Commands 與 skills | [06](06-claude-code.md) | Lab 2 |
| 3.3 | Path-specific rules | [06](06-claude-code.md) | Lab 2；Q05 |
| 3.4 | Plan mode 與直接執行 | [06](06-claude-code.md) | Lab 2；Q06 |
| 3.5 | 例子、測試與訪談 | [06](06-claude-code.md) | Lab 2；Q06 |
| 3.6 | 非互動 CI | [07](07-ci-review.md) | Q13、15 |
| 4.1 | 明確判準與誤報 | [07](07-ci-review.md) | Q14 |
| 4.2 | Few-shot 邊界 | [07](07-ci-review.md) | Lab 3；Q14 |
| 4.3 | Tool use、schema 與空值 | [08](08-structured-output.md) | Lab 3；Q16 |
| 4.4 | 驗證、回饋與重試 | [08](08-structured-output.md) | Lab 0、3；Q16 |
| 4.5 | 批次、custom_id 與期限 | [10](10-batch-human-review.md) | Lab 3；Q17 |
| 4.6 | 獨立與多 pass 審查 | [07](07-ci-review.md) | Q15 |
| 5.1 | 長對話與精確事實 | [09](09-context-reliability.md) | Lab 4 |
| 5.2 | 歧義與升級 | [09](09-context-reliability.md) | Lab 1；Q02 |
| 5.3 | 錯誤傳播與部分成果 | [09](09-context-reliability.md) | Lab 4；Q03 |
| 5.4 | Scratchpad 與恢復 | [09](09-context-reliability.md) | Lab 4；Q12 |
| 5.5 | 人工與信心校準 | [10](10-batch-human-review.md) | Lab 3；Q18 |
| 5.6 | 來源、衝突與時間 | [09](09-context-reliability.md) | Lab 4；Q08 |

## 哪些主題不深挖

本版考綱排除模型訓練／微調、模型內部架構、安全訓練方法、MCP hosting、雲端配置、認證協定、向量資料庫實作、computer use、vision、串流、tokenization、rate limit 與 API 價格計算、prompt caching 實作。知道技術位置即可，不擴成主線。

**批次折扣與延遲取捨仍在範圍內**；一般 API 價格計算不考，不代表 4.5 可以省略。[考綱 Appendix，pp.37–39](appendix-sources.md)

## 原創四週安排

這是讀書建議，不是通過保證。已有經驗者可依自測縮短。

| 週 | 閱讀與實作 | 當週產出 |
|---|---|---|
| 一 | 01–05；Lab 0、1 | 工具往返、錯誤分類與 gate |
| 二 | 06–07；Lab 2 | 共享設定與審查判準 |
| 三 | 08–10；Lab 3、4 | 有驗證、來源和恢復能力的流程 |
| 四 | 18 題、訂正、官方考綱回查 | 弱項清單與重現實驗 |

開始：[01 Agent 迴圈](01-agent-loop.md)。
