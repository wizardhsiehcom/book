# 00｜考試範圍與讀書地圖

本頁以官方 **Exam Guide v1.0，2026 年 7 月生效**為錨點。考試資訊來自 PDF 第 1–5、33–36、37–39 頁，於 2026-09-07 查覈；之後若有更新，先更新任務對照，再調整正文。[官方來源與版本](appendix-sources.md)

## 確認你準備的是哪個考試

| 項目 | 本版考綱記載 |
|---|---|
| 認證 | Claude Certified Architect – Foundations |
| 代碼 | CCAR-F |
| 題數／時間 | 60 題／120 分鐘 |
| 題型 | 單選與複選；各題明示應選幾項 |
| 情境結構 | 由六個情境中隨機出四個 |
| 通過標準 | 100–1,000 的 scaled score，通過分數 720 |
| 交付方式 | 監考；線上監考或 Pearson VUE 考場 |
| 費用 | 125 美元，每次應考皆收費 |
| 效期 | 取得日起 12 個月 |
| 成績報告 | 通過／未通過與 scaled score，另附各領域答對百分比 |

**720 不等於原始答對率 72%。** 考綱說明這是 criterion-referenced 考試：你與固定的能力標準比較，不與其他考生比較，通過分數由 standard-setting 研究訂出，scaled score 用於不同試卷的分數等化。不能拿本書 18 題分數直接換算。領域權重是計分題目的近似佔比，不保證各領域題數等於百分比乘以 60。

成績報告上的**各領域答對百分比只供你檢討，不參與通過與否的判定**；判定只看總 scaled score。所以不要用「某領域百分比看起來夠高」推論自己安全。

考綱描述的理想考生是設計與實作 Claude 生產應用的 solution architect，**通常有 6 個月以上實際建置經驗**。本書可以補觀念與判斷，補不了這段經驗，[實作工作坊](11-labs.md)就是為此設計。

## Claude 認證家族

Anthropic 目前有四張證照，都由 Pearson VUE 交付。確認你要考的是哪一張，再決定用哪些教材。

| 代碼 | 認證 | 與本書的關係 |
|---|---|---|
| CCAO-F | Claude Certified Associate – Foundations | 不在本書範圍 |
| CCDV-F | Claude Certified Developer – Foundations | 不在本書範圍 |
| **CCAR-F** | **Claude Certified Architect – Foundations** | **本書對應的考試** |
| CCAR-P | Claude Certified Architect – Professional | 進階路線，不在本書範圍 |

## 報考流程

考綱 §11 把註冊與排程拆成兩個平臺：**先在 Anthropic Partner Academy 完成購買，再到 Pearson VUE 排程**。只在其中一邊操作不會產生考位。

1. 進入 Partner Academy 上該考試的認證頁，閱讀考試詳情。
2. 下載 Exam Guide，並在報名前讀過 Certification Terms and Conditions 與 Certification Exam Policy。
3. 完成註冊與結帳；結帳金額會反映你所屬合作夥伴層級的折扣。
4. 依確認信指示建立 Pearson VUE 帳號，登入後排程。
5. 選日期，並選線上監考或 Pearson 考場。
6. 取消或改期須在預約時間 **24 小時前**完成；24 小時內變更會沒收費用。

!!! warning "報考資格請自行向官方查覈"
    本版考綱**沒有**記載一般大眾是否可報名。多份第三方指南稱 CCAR-F 限 Claude Partner Network 成員企業的員工、且註冊信箱網域須符合合格企業，但這些說法本書未能在官方文件中證實。**在投入四週準備之前，先到官方認證入口確認自己報得了名。**[官方入口與來源](appendix-sources.md)

## 考試政策

這一節會改變你的讀法，不只是行政資訊。

| 項目 | 考綱記載 |
|---|---|
| 身分證件 | 有效、未過期的政府核發附照片證件；姓名須與報名完全相符 |
| 特殊需求 | 須經 Pearson VUE 事先核准，核准前不要排程 |
| 重考等待 | 第一次未通過後 14 天，第二次後 30 天，第三次後 90 天 |
| 應考次數 | 每張考試在滾動 12 個月內最多 4 次；限制分別計算 |
| 缺考／遲到 | 沒收費用，須重新報名 |
| 保密協定 | 考前須接受；不接受則結束考試且不退費 |
| 續證 | 到期前可完成免費、非監考的更新評量；**逾期則須全額重考** |

**考場是閉卷的。** 考綱 §13 要求桌面淨空，禁止筆記、書籍、手機、耳機與第二螢幕，線上應考時全程須在監考鏡頭視野內。也就是說：這本書幫不了你進考場，各章的**自測要能不看書作答**才算讀完。這也是[實作工作坊](11-labs.md)強調重現實驗、而非累積筆記的原因。

續證的設計值得先知道：準時更新只需完成一份免費、非監考的評量，逾期則整場重考並重付費用。把到期日記進行事曆，比考完就忘划算。若考綱內容有重大變動，Anthropic 仍可要求持證人以完整考試重新認證。

## 五大領域

| 領域 | 權重 | 主責章節 | 核心判斷 |
|---|---:|---|---|
| Agentic Architecture & Orchestration | 27% | [01](01-agent-loop.md)–[03](03-enforcement.md) | 控制流程、分工、執行約束 |
| Tool Design & MCP Integration | 18% | [04](04-tool-contracts.md)–[05](05-mcp.md) | 工具契約、錯誤、接入 |
| Claude Code Configuration & Workflows | 20% | [06](06-claude-code.md)–[07](07-ci-review.md) | 作用域、迭代、CI |
| Prompt Engineering & Structured Output | 20% | [07](07-ci-review.md)、[08](08-structured-output.md)、[10](10-batch-human-review.md) | 判準、驗證、批次 |
| Context Management & Reliability | 15% | [09](09-context-reliability.md)–[10](10-batch-human-review.md) | 事實、失敗、來源、校準 |

權重較小不表示可以跳過。可靠性常與其他領域出現在同一情境，例如工具錯誤既涉及契約，也涉及跨代理錯誤傳遞。

## 六個情境的讀法

考綱 §5 **公開了全部六個情境的設定**，考試從中隨機出四個，每個情境框住一組題目。六個都會考到的機率不低，六個都值得先當成系統理解一遍。

| # | 官方情境 | 設定摘要 | 主要領域 | 本書對應 |
|---|---|---|---|---|
| 1 | Customer Support Resolution Agent | 以 Agent SDK 建客服解決代理，透過自訂 MCP 工具接後端，目標首次接觸解決率 80% 以上並知道何時升級 | 1、2、5 | [情境一](12-practice.md)；[03](03-enforcement.md)、[09](09-context-reliability.md) |
| 2 | Code Generation with Claude Code | 團隊用 Claude Code 產碼、重構、除錯與寫文件，需自訂 slash command、CLAUDE.md，並判斷 plan mode 與直接執行 | 3、5 | [情境二](12-practice.md)；[06](06-claude-code.md) |
| 3 | Multi-Agent Research System | 協調者委派搜尋、文件分析、綜整與報告四類子代理，產出有引用的完整報告 | 1、2、5 | [情境三](12-practice.md)；[02](02-orchestration.md)、[09](09-context-reliability.md) |
| 4 | Developer Productivity with Claude | 協助工程師探索陌生程式庫與遺留系統，使用內建工具並整合 MCP server | 2、3、1 | [情境四](12-practice.md)；[04](04-tool-contracts.md)、[05](05-mcp.md) |
| 5 | Claude Code for Continuous Integration | 接入 CI/CD 執行自動審查、產測試、回饋 PR，要求可採取行動且降低誤報 | 3、4 | [情境五](12-practice.md)；[07](07-ci-review.md) |
| 6 | Structured Data Extraction | 從非結構文件抽取資訊、以 JSON schema 驗證，並優雅處理邊界情況 | 4、5 | [情境六](12-practice.md)；[08](08-structured-output.md) |

情境一的官方設定直接點名 `get_customer`、`lookup_order`、`process_refund`、`escalate_to_human` 四個 MCP 工具。注意其中三個是唯讀或查詢、一個有真實副作用、一個是升級出口——[工具契約](04-tool-contracts.md)與[執行約束](03-enforcement.md)討論的正是這種組合的設計問題。

讀題先標出目標、硬性條件、觀察到的失敗、可用工具，再選能直接修復問題的方案。較大型模型、更長提示詞、更多 agent 都不是不需證據的萬用答案。

本書用活動與票券平臺串起原創案例；語境和官方情境不同，練的是可轉移的判斷。上表的「本書對應」是章節索引，不表示本書改寫過官方情境內容。

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

本版考綱的 out-of-scope 清單共 16 項：模型微調與自訓、Claude API 的認證／計費／帳號管理、特定程式語言與框架的詳細實作（超出工具與 schema 設定所需的部分）、MCP server 部署與 hosting、模型內部架構與訓練過程、Constitutional AI 與 RLHF 等安全訓練方法、embedding 模型與向量資料庫實作、computer use、vision、串流與 SSE、rate limit 與配額與 API 價格計算、OAuth 與金鑰輪替等認證協定、特定雲端供應商配置（AWS、GCP、Azure）、效能基準與模型比較指標、prompt caching 實作細節（知道它存在即可）、token 計數與 tokenization。知道技術位置即可，不擴成主線。

**批次折扣與延遲取捨仍在範圍內**；一般 API 價格計算不考，不代表 4.5 可以省略。[考綱 Appendix，pp.37–39](appendix-sources.md)

## 官方 prep 課程與本書的分工

Anthropic Partner Academy 為 CCAR-F 列出七門 prep 課程。本書不是官方課程的替代品；下表用來判斷哪些可以互相取代、哪些只有官方課程有。

| 官方 prep 課程 | 本書對應 |
|---|---|
| Building with the Claude API | [01](01-agent-loop.md)、[04](04-tool-contracts.md)、[08](08-structured-output.md)、[10](10-batch-human-review.md) |
| Introduction to Model Context Protocol | [05](05-mcp.md) |
| Claude Code in Action | [06](06-claude-code.md)、[07](07-ci-review.md) |
| Claude 101 | 本書假設你已具備，不另教 |
| AI Fluency: Framework & Foundations | **本書未覆蓋**；協作框架與倫理面向 |
| Claude on Google Cloud | **本書未覆蓋** |
| Claude with Amazon Bedrock | **本書未覆蓋** |

兩門雲端課程對應的正是 out-of-scope 清單中的「特定雲端供應商配置」。它們提供部署背景，但依考綱不會直接出題；若你的時間有限，先確保前三門對應的能力，再回頭補雲端。

## 原創四週安排

這是讀書建議，不是通過保證。已有經驗者可依自測縮短。

| 週 | 閱讀與實作 | 當週產出 |
|---|---|---|
| 一 | 01–05；Lab 0、1 | 工具往返、錯誤分類與 gate |
| 二 | 06–07；Lab 2 | 共享設定與審查判準 |
| 三 | 08–10；Lab 3、4 | 有驗證、來源和恢復能力的流程 |
| 四 | 18 題、訂正、[情境包計時](13-scenario-set.md)、官方考綱回查 | 弱項清單、重現實驗與一次限時作答紀錄 |

四週之外還有兩件事要排進行事曆：**開始讀之前先確認報考資格**，以及排程時記住取消改期的 24 小時期限。兩者都見本頁[報考流程](#報考流程)。

開始：[01 Agent 迴圈](01-agent-loop.md)。
