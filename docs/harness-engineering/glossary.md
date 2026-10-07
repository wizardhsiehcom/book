# 詞彙表

定義以本書用法為準。章節連結指向相關解釋；原文名稱保留，方便回查論文。

| 詞彙 | 白話定義 | 查閱章節 |
|---|---|---|
| Coding agent（程式開發代理） | 透過工具讀寫程式碼、執行檢查並回報結果的代理系統。 | [01 模型與 Harness](01-model-and-harness.md) |
| 模型（language model） | 根據輸入產生文字或結構化輸出的系統；它不會只因為知道檔名就取得檔案存取權。 | [01 模型與 Harness](01-model-and-harness.md) |
| Harness（執行系統） | 把模型接上任務資料、工具、結果和限制，讓模型能完成工作的系統。 | [01 模型與 Harness](01-model-and-harness.md) |
| 工具（tool） | Harness 能執行的一項明確操作，例如讀檔或跑測試。 | [01 模型與 Harness](01-model-and-harness.md) |
| 工具呼叫（tool call） | 模型提出的工具名稱和參數；Harness 檢查後才會轉交工具執行。 | [01 模型與 Harness](01-model-and-harness.md) |
| 觀察結果（observation） | 工具執行後傳回的內容或錯誤，供下一步判斷使用。 | [01 模型與 Harness](01-model-and-harness.md) |
| Agent loop（工作迴圈） | Harness 重複送出模型輸入、執行動作並收回結果，直到符合停止條件的流程。 | [03 工作迴圈](03-agent-loop.md) |
| 停止條件（stop condition） | Harness 用來決定何時結束目前任務的規則。停止不等於目標一定完成。 | [04 停止條件](04-stop-conditions.md) |
| 執行上限（execution budget） | 限制模型呼叫次數、時間或成本的界線，用來避免工作無限延長。 | [04 停止條件](04-stop-conditions.md) |
| 供應商抽象層（provider abstraction） | 用一個共同介面呼叫多家模型服務的安排；它不會自動消除各家功能差異。 | [05 模型整合](05-model-integration.md) |
| 供應商專屬最佳化（provider-native optimization） | 直接使用特定模型服務的快取、推理或訊息功能。 | [05 模型整合](05-model-integration.md) |
| 提示快取（prompt cache） | 模型服務保留重複提示內容，以減少重複處理的機制；不同服務的邊界和條件可能不同。 | [05 模型整合](05-model-integration.md) |
| 工具契約（tool contract） | 工具的輸入、輸出、錯誤和副作用規則，讓呼叫端知道可以期待什麼。 | [06 工具契約](06-tool-contracts.md) |
| 延後載入（deferred loading） | 先不把所有工具說明放進模型輸入；需要時再找出並載入相關說明。 | [06 工具契約](06-tool-contracts.md) |
| 精確替換（exact matching） | 只在指定文字唯一且完全符合時才修改；找不到或找到多處就回報失敗。 | [07 檔案編輯](07-file-editing.md) |
| 模糊比對串列（fuzzy cascade） | 依序嘗試較寬鬆的文字比對方式，處理內容有少量變動的情況。匹配放寬也會增加誤改風險。 | [07 檔案編輯](07-file-editing.md) |
| 程式碼檢索（code retrieval） | 從專案中找出目前任務需要閱讀的檔案、符號或相關片段。 | [08 程式碼檢索](08-code-retrieval.md) |
| 即時載入專案上下文（JIT repo context） | 依目錄或目前工作，按需讀取專案規則檔，避免一開始載入所有內容。 | [08 程式碼檢索](08-code-retrieval.md) |
| 上下文壓縮（context compaction） | 對話快滿時，保留重點並縮短舊內容，騰出模型可用空間。 | [09 上下文壓縮](09-context-compaction.md) |
| 逐次合併摘要（incremental summary merge） | 把新內容併入先前摘要，而不是每次都從零重寫摘要。 | [09 上下文壓縮](09-context-compaction.md) |
| 長期記憶（persistent memory） | 跨越多次工作階段保留下來、供未來任務使用的資訊。 | [10 長期記憶](10-persistent-memory.md) |
| 記憶寫入流程（memory write path） | 決定由誰挑選、寫入、審核和更新長期記憶的流程。 | [10 持久記憶](10-persistent-memory.md) |
| 權限範圍（permission scope） | 規定某個工具能對哪些目標、在什麼條件下執行哪些操作。 | [11 權限與隔離](11-permissions.md) |
| 政策即程式碼（policy-as-code） | 把允許或拒絕規則存成可檢查、可執行的設定或程式。 | [11 權限與隔離](11-permissions.md) |
| 作業系統沙箱（OS sandbox） | 利用作業系統隔離程序，限制它能讀寫的檔案、網路或其他資源。 | [11 權限與隔離](11-permissions.md) |
| 多 agent 編排（multi-agent orchestration） | 安排多個 agent 分工、傳回結果並由主流程整合的方式。 | [12 多 agent](12-multi-agent.md) |
| 協調者－工作者（coordinator-worker） | 一個 agent 把子工作交給其他 agent，再收回結果的分工形狀。 | [12 多 agent](12-multi-agent.md) |
| 上下文分叉（context fork） | 建立子 agent 時複製或挑選父 agent 的部分狀態，讓兩者能各自工作。 | [12 多 agent](12-multi-agent.md) |
| Skill（能力包） | 一組按需載入的工作指引，可附帶腳本或其他資源。 | [13 擴充機制](13-extensibility.md) |
| MCP（Model Context Protocol） | 讓 Harness 以共同介面連接外部工具或服務的協定。 | [13 擴充機制](13-extensibility.md) |
| ACP（Agent Client Protocol） | 讓編輯器或上層 Harness 透過共同介面連接 agent 的協定。 | [13 擴充機制](13-extensibility.md) |
| A2A（Agent2Agent） | 用來讓不同 agent 系統彼此通訊的協定；論文樣本中只有 Gemini CLI 提供 A2A 伺服器。 | [13 擴充機制](13-extensibility.md) |
| 代理框架（agentic framework） | 提供建立模型代理、安排工具和控制迴圈的通用函式庫。 | [01 模型與 Harness](01-model-and-harness.md) |
| 程式碼 RAG（code retrieval-augmented generation） | 先用檢索找程式碼，再把結果放進模型輸入；本書中特別指以向量嵌入檢索程式碼。 | [08 程式碼檢索](08-code-retrieval.md) |
| Meta-harness（上層協調系統） | 位在多個 Harness 之上，統一任務分派或政策的系統；它不一定自己編輯程式碼。 | [15 平台化](15-platform-turn.md) |
