# 附錄｜官方來源、版本與更新方式

**查覈日期：2026-09-07。** 本書以考綱決定範圍，以產品文件補充實作語意。動態文件未標發布日就不假定日期；查覈日不是發布日。

## S01：範圍的權威來源

[Anthropic Partner Certifications](https://anthropic-partners.skilljar.com/page/partner-certifications) 提供職系入口及考綱下載。由此取得：

[Claude Certified Architect – Foundations Exam Guide，官方 PDF](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542750%2FClaude+Certified+Architect+%E2%80%93+Foundations+Exam+Guide.pdf)

- 版本 1.0；生效 2026 年 7 月；代碼 CCAR-F。文件未列精確發布日；§18 版本紀錄顯示 0.1 初稿 2026 年 2 月、0.2 修訂 2026 年 6 月、1.0 為排版更新。
- 全檔 39 頁；下列頁碼為 PDF 的 1-based 頁碼。
- 本書讀取 pp.1–26 與 pp.33–39；官方範例題不作題目素材。

| 頁碼／節 | 本書用來支持什麼 |
|---|---|
| pp.1–2，§1–3 | 名稱、對象與經驗年資、題型、題數與時間、交付方式、費用、效期、成績報告 |
| pp.3–4，§4–5 | 五領域權重、六個情境的完整設定與主要領域 |
| pp.5–9，§6，1.1–1.7 | 迴圈、編排、hooks、狀態 |
| pp.9–12，§6，2.1–2.5 | 工具、錯誤、MCP、內建工具 |
| pp.12–16，§6，3.1–3.6 | Claude Code 與 CI |
| pp.16–19，§6，4.1–4.6 | Prompt、schema、驗證、批次、審查 |
| pp.19–23，§6，5.1–5.6 | 上下文、升級、來源、人工校準 |
| pp.23–26，§7–8 | 備考能力與實作方向 |
| p.33，§10 | Scaled score 與 criterion-referenced 的意義、成績報告的領域百分比不計入判定 |
| pp.33–34，§11 | 報考流程：Partner Academy 與 Pearson VUE 兩段式、24 小時取消改期期限 |
| pp.34–35，§12–14 | 身分證件、特殊需求、重考等待與次數、缺考、閉卷應考規則、保密協定 |
| pp.35–36，§15–16 | 效期 12 個月、準時續證與逾期重考、申訴期限 |
| pp.36–39，§17–18 | 技術清單、範圍內外、版本紀錄 |

網頁擷取工具曾回覆 403；本次已由官方入口直接下載 PDF 並抽取本文確認，並非只讀搜尋摘要。網址日後失效時，從官方入口重新找最新版，不默認第三方鏡像最新。

**本書未讀取的官方文件：** 認證頁另提供 Certification Terms and Conditions 與 Anthropic Certification Exam Policy 兩份 PDF，本書未取得。因此本書關於政策的敘述**只以 Exam Guide §11–16 為依據**；若兩者有出入，以官方政策文件為準。

**報考資格未經證實。** 本版 Exam Guide 沒有記載一般大眾能否報名，只在 §11 提到結帳金額反映「你所屬合作夥伴層級」的折扣。多份第三方指南稱 CCAR-F 限 Claude Partner Network 成員企業員工、須用企業信箱網域，本書**未能在官方文件中證實這項限制**，因此[考綱地圖](00-exam-map.md#報考流程)以待查方式呈現，請讀者自行向官方入口確認。

### 認證計畫的其他官方頁面

| ID | 第一手來源 | 用途 |
|---|---|---|
| S01a | [Pearson VUE：Claude Certification Program](https://www.pearsonvue.com/us/en/anthropic.html) | 四張證照的代碼、排程流程、線上監考與考場選項 |
| S01b | [CCAR-F prep courses，Partner Academy](https://anthropic-partners.skilljar.com/page/claude-certified-architect-foundations-prep-courses) | 七門官方 prep 課程清單 |

兩頁均於 2026-09-07 查覈。重考等待期與次數在 S01a 與 Exam Guide §12 一致。

## 產品文件與架構補充

| ID | 第一手來源 | 發布／版本日期 | 用途 |
|---|---|---|---|
| S02 | [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) | 動態文件，發布日未標 | Client tool 往返、執行分工 |
| S03 | [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | 2024-12-19；頁面提醒工具已有更新 | Workflow／agent 區分，不照搬舊介面 |
| S04 | [SDK subagents](https://code.claude.com/docs/en/agent-sdk/subagents) | 動態文件，發布日未標 | Task／Agent、非 fork 上下文 |
| S05 | [Hooks reference](https://code.claude.com/docs/en/hooks) | 動態文件，發布日未標 | Pre／Post 與結果替換 |
| S06 | [Claude Code memory](https://code.claude.com/docs/en/memory) | 動態文件，發布日未標 | 規範、scope、載入 |
| S07 | [Skills](https://code.claude.com/docs/en/skills) | 動態文件，發布日未標 | Frontmatter 的實際語意 |
| S08 | [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 動態文件，發布日未標 | Scope、環境變數 |
| S09 | [MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture) | 版本 2026-07-28 | Host/client/server |
| S10 | [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | 動態文件，發布日未標 | Strict 與例外 |
| S11 | [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing) | 動態文件，發布日未標 | 窗口、折扣、custom_id |

上述來源均於 2026-09-07 查覈相關段落，不宣稱逐字讀過每份動態文件的所有章節。

## 考綱與產品不同步時

| 議題 | 考綱錨點 | 本書補充 |
|---|---|---|
| 子代理工具 | Task、allowedTools | 現行稱 Agent，舊事件可需兼容兩名 |
| 子代理上下文 | 明確傳入，不自動繼承 | 非 fork 與 fork 不可一概而論 |
| Commands／skills | 兩種路徑皆列為考點 | 現行文件整合說明，按版本操作 |
| 結構輸出 | Tool use／schema | 分清一般、strict tool use 與 JSON outputs |
| Hook 正規化 | PostToolUse | 依版本選替換介面，Post 不撤銷副作用 |

讀題依其版本與前提；實作依安裝版本。新產品功能不自動成為新考點，舊名稱也不能直接當成已測試程式。

## 原創部分與限制

票券、活動、報價資料、四週安排、schema、離線程式與 18 題均為本書設計。數字案例不是成效統計。程式只驗證離線控制流程；真實 API、SDK、MCP 與 CI 整合需要自己的環境。

此版覆蓋五領域 30 項任務的概念與案例，不宣稱涵蓋所有可能出題細節。考前重新下載官方考綱，先比對任務增刪，再更新受影響正文、練習、設定與圖表，不只改首頁日期。

回到[考綱地圖](00-exam-map.md)。
