# 06｜Claude Code：讓規範出現在需要的地方

**考綱：3.1–3.5。** 本章要解決「同一份 repo，為什麼每個人的 Claude 表現不同？」先備是瞭解專案與個人設定的差別。

## 先決定誰需要、何時需要

| 內容 | 適合位置／機制 | 理由 |
|---|---|---|
| 所有成員都需知道的建置與驗收方式 | 專案 `CLAUDE.md` | 隨 repo 分享 |
| 個人回答偏好 | `~/.claude/CLAUDE.md` | 不影響其他成員 |
| 某子目錄的架構約定 | 該目錄 `CLAUDE.md` | 隨相關目錄載入 |
| 散佈各處的測試檔規範 | `.claude/rules/` 搭配 paths | 依檔案模式套用 |
| 需要時才執行的一套工作流程 | `.claude/skills/<name>/SKILL.md` | 按任務使用 |

CLAUDE.md 是上下文指引，不是執行權限防線。大檔可拆成 focused rules，或用 `@` 引用其他文件。不要把所有用過的操作都放進每輪都需要的背景。當團隊成員沒有收到規範，先看是否其實放在你自己的 home directory。[Claude Code memory](https://code.claude.com/docs/en/memory)

## Path 規則跨越資料夾

以下是假想專案中 `.claude/rules/tests.md` 的內容：

```markdown
---
paths:
  - "**/*.test.ts"
---
為修改的可觀察行為補上測試。
使用既有 fixture，避免向真實售票服務發出請求。
對空清單、失敗與成功結果分別驗證。
```

如果測試散在 `src/`、`packages/` 與 `services/`，用 glob 比在每個目錄複製規範容易維護。這裡的 `paths` 控制條件載入；不要混同權限設定。[官方考綱 §6，3.1、3.3](appendix-sources.md)

考綱提到 `/memory` 診斷記憶檔案；目前文件也提供 `/context` 檢查載入內容。除路徑以外，還要看是否有互相矛盾的指示，不能只用「檔案存在」證明模型已得到正確上下文。

## Skill 代表可重用的任務

下面是**教學範本**，不會替這本書所在 repo 安裝指令：

```markdown
---
name: trace-ticket
description: 追蹤票券狀態變更的程式路徑
argument-hint: "[入口函式或檔案]"
context: fork
allowed-tools: Read, Grep, Glob
---
從 $ARGUMENTS 開始，找出輸入驗證、狀態寫入與錯誤處理。
每個結論附上檔案位置，列出尚未確認的呼叫路徑。
回傳摘要與下一個可驗證問題。
```

`context: fork` 讓任務在分開的子代理上下文執行，適合產生大量探索內容的流程。`argument-hint` 是呼叫提示，不是參數驗證器。`allowed-tools` 依產品的工具權限機制生效，不應把它當成作業系統級 sandbox；必須禁止的操作仍要有設定與執行邊界。[Skills 官方文件](https://code.claude.com/docs/en/skills)

考綱也列出專案 `.claude/commands/` 與個人 `~/.claude/commands/`。目前文件把自訂 slash commands 與 skills 整合說明：讀考題須辨認兩種路徑，新建專案按所用版本選擇。個人 variant 應用不同名字，避免無意改變共享流程。[官方考綱 §6，3.2](appendix-sources.md)

## Plan mode 是用來降低哪種不確定性

一個已重現、只缺空值檢查的函式，可以直接修正並驗證。跨數十個模組的事件格式遷移，卻需要先確認相容方式、順序與回復策略，適合先規劃。判準是方案歧義、影響面與依賴，不是「任何修改都先規劃」或「任何 task 都直接寫」。探索內容很多時，可用 Explore 子代理保留主對話空間。[官方考綱 §6，3.4](appendix-sources.md)

本書原創練習：把日期欄位從任意字串改成明確格式。若只有單一 parser，且已有測試證明相容要求，可直接執行；若每個服務各自解讀時區，應先畫出讀寫邊界，再決定遷移流程。

## 用輸入輸出例子消除歧義

「清理活動名稱」太模糊。給出 `" 音樂會  A " → "音樂會 A"`、`null → null`，再說是否保留全形字元，模型才知道轉換邊界。先列正常、邊界與失敗案例，再用測試失敗訊息推進修正。

陌生領域可以用 interview pattern，先請 Claude 找出尚未決定的需求。互相影響的問題應一起描述，例如日期格式與時區錯誤；彼此獨立的問題可逐項修正與驗證。這讓一輪反饋保持因果關係，不把互相牽動的修正拆到不同上下文。[官方考綱 §6，3.5](appendix-sources.md)

**自測：** `argument-hint` 寫了「必填 ticket ID」，使用者沒給 ID，是否代表工具呼叫一定被禁止？否；它主要幫助操作提示。真正的必填檢查放在流程和工具參數驗證。

下一章：[CI 與審查品質](07-ci-review.md)。
