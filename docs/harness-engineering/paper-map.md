# 論文對照索引

本索引把論文中的 13 項觀察、29 個架構模式和 18 項建議，連到本書的教學章節。論文連結指向指定的 HTML v1；章節欄是本書的編排，不是論文作者指定的分類。

本索引中的「觀察」保留作者原本的範圍和不確定性。它們來自特定程式碼快照，不能直接當成今日產品規格或同條件效能排名。樣本與限制見[方法 §4](https://arxiv.org/html/2609.00006v1#S4)及[效度限制 §15.6](https://arxiv.org/html/2609.00006v1#S15.SS6)。

## 13 項觀察

| 論文觀察 | 作者觀察的重點 | 本書對應章節 |
|---|---|---|
| [觀察 1](https://arxiv.org/html/2609.00006v1#S5.p2.1) | 系統程式碼規模差異很大；迴圈較複雜，沒有因此顯示較高的基準測試成績。生產系統的許多程式碼處理安全、介面和擴充等其他需求。 | [02 證據判讀](02-reading-evidence.md)、[03 工作迴圈](03-agent-loop.md)、[14 比較設計](14-compare-designs.md)、[15 平台化](15-platform-turn.md) |
| [觀察 2](https://arxiv.org/html/2609.00006v1#S7.SS1.SSS0.Px5.p2.1) | 使用供應商專屬模型功能，不只取決於是否單一供應商，也取決於系統是否願意集中維護各供應商的差異。 | [05 模型整合](05-model-integration.md)、[14 比較設計](14-compare-designs.md)；補充見[附錄表 17](https://arxiv.org/html/2609.00006v1#A1.T17) |
| [觀察 3](https://arxiv.org/html/2609.00006v1#S7.SS3.SSS0.Px9.p2.1) | 多個系統的提示規則出現相似做法；到 2026 年 7 月，部分規則已修改或移除。作者也記錄了文字規則、結構化契約及交由使用者上下文等不同策略。 | [05 模型整合](05-model-integration.md)、[14 比較設計](14-compare-designs.md)、[15 平台化](15-platform-turn.md)；補充見[附錄表 16](https://arxiv.org/html/2609.00006v1#A1.T16) |
| [觀察 4](https://arxiv.org/html/2609.00006v1#S8.SS4.SSS0.Px2.p3.1) | 檔案編輯方式是程式碼修改可靠度的重要因素之一。系統會依模型選擇編輯格式，也會沿用或改造其他系統的做法。 | [07 檔案編輯](07-file-editing.md)、[14 比較設計](14-compare-designs.md)；補充見[表 7](https://arxiv.org/html/2609.00006v1#S8.T7) |
| [觀察 5](https://arxiv.org/html/2609.00006v1#S9.SS6.p5.1) | 論文在觀察 5 稱，沒有系統把嵌入檢索當作主要記憶基底；但 §13.2 又記錄 OpenClaw 預設記憶功能使用開啟嵌入的混合式聊天檢索。兩處對「主要」與「預設混合」的判準沒有調和，本文不把前一說法當定論；記憶由誰寫入和管理仍是本觀察的重要主題。 | [09 上下文壓縮](09-context-compaction.md)、[10 持久記憶](10-persistent-memory.md)、[14 比較設計](14-compare-designs.md)；對照[§13.2](https://arxiv.org/html/2609.00006v1#S13.SS2)與[表 13](https://arxiv.org/html/2609.00006v1#S13.T13) |
| [觀察 6](https://arxiv.org/html/2609.00006v1#S10.SS2.SSS0.Px4.p2.1) | 作業系統層級的隔離成本高，但是否採用不是程式碼規模的必然結果。作者修正了先前版本中「較大的系統較可能有沙箱」的推論。 | [11 權限與隔離](11-permissions.md)、[14 比較設計](14-compare-designs.md)、[16 設計自己的 Harness](16-design-your-harness.md)；補充見[表 8](https://arxiv.org/html/2609.00006v1#S8.T8) |
| [觀察 7](https://arxiv.org/html/2609.00006v1#S11.SS10.p2.1) | 多個把多 agent 納入核心的系統採用協調者分派工作、工作者回報結果的形狀；各系統在上下文隔離、擴展、移植和限制遞迴方面做法不同。Pi 則把子 agent 留在擴充範圍。 | [12 多 agent](12-multi-agent.md)、[14 比較設計](14-compare-designs.md)；補充見[表 9](https://arxiv.org/html/2609.00006v1#S11.T9) |
| [觀察 8](https://arxiv.org/html/2609.00006v1#S12.SS5.SSS0.Px5.p2.1) | 十一個樣本中有九個支援 Skills、八個支援 MCP。Skills 的延後載入、條件啟用和分發管理也逐漸成形。數字包括非 coding agent 的 OpenClaw。 | [13 擴充機制](13-extensibility.md)、[15 平台化](15-platform-turn.md)；補充見[表 10](https://arxiv.org/html/2609.00006v1#S12.T10) |
| [觀察 9](https://arxiv.org/html/2609.00006v1#S13.SS2.SSS0.Px3.p3.1) | 作者在十一個樣本中沒有找到代理框架執行核心迴圈，也沒有找到對程式碼使用向量檢索增強生成。程式碼檢索主要依靠確定性工具；對話記憶是另一種用途。 | [08 程式碼檢索](08-code-retrieval.md)、[13 擴充機制](13-extensibility.md)、[14 比較設計](14-compare-designs.md)、[16 設計自己的 Harness](16-design-your-harness.md)；補充見[表 13](https://arxiv.org/html/2609.00006v1#S13.T13) |
| [觀察 10](https://arxiv.org/html/2609.00006v1#S13.SS2.SSS0.Px3.p4.1) | 論文觀察到，Anthropic 的 Effective Agents 系列所述模式與四個供應商自有系統的架構相近；相似本身不能判定是共同工程經驗還是公開指引造成。 | [02 證據判讀](02-reading-evidence.md)、[14 比較設計](14-compare-designs.md)、[15 平台化](15-platform-turn.md)；限制見[§15.1](https://arxiv.org/html/2609.00006v1#S15.SS1)及[§15.6](https://arxiv.org/html/2609.00006v1#S15.SS6) |
| [觀察 11](https://arxiv.org/html/2609.00006v1#S13.SS3.p6.1) | ACP 擴展到編輯器、代跑 Harness 和上層協調系統；多數系統仍用程序內方法管理自己的子 agent。OpenClaw 是論文記錄的協定式例外。 | [12 多 agent](12-multi-agent.md)、[13 擴充機制](13-extensibility.md)、[15 平台化](15-platform-turn.md)；補充見[表 14](https://arxiv.org/html/2609.00006v1#S13.T14) |
| [觀察 12](https://arxiv.org/html/2609.00006v1#S14.SS5.SSS0.Px4.p2.1) | 作者把 2026 年上半年的變化描述為平台化：擴充、分發、治理、SDK、相容介面和上層協調逐漸成為競爭範圍。 | [13 擴充機制](13-extensibility.md)、[15 平台化](15-platform-turn.md)；補充見[表 15](https://arxiv.org/html/2609.00006v1#S14.T15) |
| [觀察 13](https://arxiv.org/html/2609.00006v1#S16.SS10.p3.1) | 論文的 90 行範例直接實作 18 項建議中的 10 項，並與其餘八項相容。作者明說「用前沿模型可達到 Mini-SWE-Agent 成績」是推測，沒有實驗證明。 | [02 證據判讀](02-reading-evidence.md)、[03 工作迴圈](03-agent-loop.md)、[16 設計自己的 Harness](16-design-your-harness.md)；範例見[§16.10](https://arxiv.org/html/2609.00006v1#S16.SS10) |

## 29 個架構模式

作者在[表 11](https://arxiv.org/html/2609.00006v1#S13.T11)列出舊版研究的 17 個模式（更新樣本歸屬），並在[表 12](https://arxiv.org/html/2609.00006v1#S13.T12)列出本次新增的 12 個模式：合計 29 個。下表供快速查閱；[架構模式組合](advanced-patterns.md)把這些模式放回工作流程，解釋機制、組合與代價。表中相關章節提供基礎概念，不代表各章都逐項實作該模式。

| 論文模式 | 白話解釋與界線 | 本書相關章節 |
|---|---|---|
| Event Sourcing | 把動作和結果依序追加到事件紀錄，之後可依紀錄重建工作狀態。這種紀錄本身不保證操作正確。 | [03 工作迴圈](03-agent-loop.md)、[09 上下文壓縮](09-context-compaction.md)、[14 比較設計](14-compare-designs.md) |
| Policy-as-Code | 把允許或拒絕規則寫成可檢查、可執行的設定或程式。規則寫成程式碼，不代表規則內容自然正確。 | [11 權限與隔離](11-permissions.md) |
| Recursive Composition | Agent 可以再啟動子 agent，形成多層分工。增加層級也會增加協調和權限管理工作。 | [12 多 agent](12-multi-agent.md) |
| Polymorphic Edits | 依模型選擇不同的編輯格式或工具組合。這是調整編輯介面的做法，不是準確度保證。 | [07 檔案編輯](07-file-editing.md)、[14 比較設計](14-compare-designs.md) |
| Deferred Loading | 需要時才把工具或技能說明放進模型可見內容。它可減少起始提示長度，也增加搜尋與載入步驟。 | [06 工具契約](06-tool-contracts.md)、[13 擴充機制](13-extensibility.md) |
| Template Method | 基底類別固定主要流程，子類別改寫解析或格式化等步驟。具體組合例子見模式專章。 | [模式組合](advanced-patterns.md)、[03 工作迴圈](03-agent-loop.md) |
| Protocol Interfaces | 元件依共同介面合作，具體實作可以替換，不必共用同一個父類別。 | [模式組合](advanced-patterns.md)、[06 工具契約](06-tool-contracts.md)、[13 擴充機制](13-extensibility.md) |
| LLM Summarization | 讓模型把較長的對話歷史整理成較短摘要。摘要可能遺漏細節，也不等於跨工作階段的持久記憶。 | [09 上下文壓縮](09-context-compaction.md) |
| Stuck Detection | 根據重複呼叫或其他訊號標記可能卡住的工作。偵測訊號不是任務失敗的證明。 | [04 停止條件](04-stop-conditions.md) |
| Reflection Loop | 把測試或檢查回饋交給模型，再請它修正。多一次修正機會不保證修好程式。 | [03 工作迴圈](03-agent-loop.md)、[04 停止條件](04-stop-conditions.md) |
| Prompt Caching | 讓模型服務重用重複提示內容，減少重複處理。各服務的快取邊界和規則不同，不能假設提示相同就能共用快取。 | [05 模型整合](05-model-integration.md) |
| Context Forking | 建立子 agent 時複製或挑選父 agent 的部分上下文。分叉可隔開工作狀態，但結果仍需由主流程接回。 | [12 多 agent](12-multi-agent.md) |
| Middleware Pipeline | 把回合限制、壓縮等政策拆成可串接步驟。論文記錄 Mistral Vibe 採用此模式，不表示每個 Harness 都需要管線。 | [03 工作迴圈](03-agent-loop.md)、[04 停止條件](04-stop-conditions.md) |
| JIT Repo Context | 依專案位置或工作需要載入 Markdown 規則檔。它提供專案指引，不等於搜尋所有相關程式碼。 | [08 程式碼檢索](08-code-retrieval.md)、[13 擴充機制](13-extensibility.md) |
| Skills (capability bundles) | 用含有 SKILL.md 的資料夾打包工作指引，也可附上腳本和資源。不同系統的格式支援和治理方式仍有差異。 | [13 擴充機制](13-extensibility.md) |
| Conditional Activation | 只有在路徑、環境或其他條件符合時才啟用工具或技能。設計者仍須說清楚條件和未啟用時的行為。 | [13 擴充機制](13-extensibility.md) |
| Turn-Level Checkpoint | 在特定回合或步驟保存可復原的狀態。復原範圍取決於系統實際保存了哪些檔案和紀錄。 | [07 檔案編輯](07-file-editing.md)、[14 比較設計](14-compare-designs.md) |
| Agent-Maintained Memory | 由背景 agent 擷取並整理跨工作階段記憶。論文也列出需人工審核的變體，因此「由 agent 維護」不代表沒有審核。 | [10 持久記憶](10-persistent-memory.md) |
| Outer Verification Loop | 在內層回合外，用判斷器或守門程序檢查任務是否完成。它補上一層檢查，不代表已證明結果正確。 | [04 停止條件](04-stop-conditions.md)、[14 比較設計](14-compare-designs.md) |
| Self-Improving Skill Loop | Agent 撰寫或更新自己的技能資料。這描述能力更新流程，不代表更新內容已安全或有效。 | [13 擴充機制](13-extensibility.md)、[15 平台化](15-platform-turn.md) |
| Lineage Compaction | 壓縮時輪替工作階段，並保留可搜尋的祖先紀錄鏈。 | [09 上下文壓縮](09-context-compaction.md)、[模式組合](advanced-patterns.md) |
| Session-Tree Version Control | 把工作階段紀錄保存成可分支的樹，並允許移動目前位置或回復狀態；對話回復不保證檔案回復。 | [09 上下文壓縮](09-context-compaction.md)、[模式組合](advanced-patterns.md)、[12 多 agent](12-multi-agent.md) |
| Minimal-Core / Extension-Host | 把部分功能移出核心，交給擴充機制或事件系統承接。核心變小後，部署者仍須管理那些外掛功能。 | [13 擴充機制](13-extensibility.md)、[14 比較設計](14-compare-designs.md) |
| Client/Server Harness | Harness 以伺服器提供介面，不同使用者介面再作為客戶端連接。這種拆分會增加服務與連線的管理責任。 | [15 平台化](15-platform-turn.md) |
| Model-Family Prompt Matrix | 依模型系列或世代選用不同的基礎提示。提示分流可配合模型差異，也增加維護項目。 | [05 模型整合](05-model-integration.md)、[14 比較設計](14-compare-designs.md) |
| Cache-Dialect Fanout | 同時產生多家模型服務使用的快取標記。這不表示不同供應商共用同一份快取。 | [模式組合](advanced-patterns.md)、[05 模型整合](05-model-integration.md) |
| Syntax-Aware Command Permissioning | 先解析指令結構，再依指令和引數套用權限。語法解析能分辨部分形式，不等於完整理解操作意圖。 | [11 權限與隔離](11-permissions.md) |
| Untrusted-Content Delimiting | 把工具或網頁取得的內容標成不可信資料，讓模型容易分辨來源。標記本身不會隔離資料或阻止工具執行。 | [06 工具契約](06-tool-contracts.md)、[11 權限與隔離](11-permissions.md) |
| Harness Mimicry | 論文記錄一種用戶端呈現第一方 Harness 身分、以使用其訂閱 OAuth 後端的做法。本書只保留這項來源觀察，不提供冒用身分的操作教學；相關章節不代表正文涵蓋此模式。 | [05 模型整合](05-model-integration.md)、[14 比較設計](14-compare-designs.md) |

## 18 項設計建議

以下保留作者在 §16 所用的建議強度；逐項來源都連到原文段落。本書不把這些建議當成跨情境通則，採用前仍須依任務、模型和部署條件判斷。約 15 個工具等數字是作者在該研究脈絡提出的門檻，不是普遍適用的常數。

| 論文建議 | 建議重點 | 本書對應章節 |
|---|---|---|
| [1](https://arxiv.org/html/2609.00006v1#S16.SS1.p1.1) | 從線性迴圈開始；等獨立的回合政策增加，再考慮中介軟體管線。 | [03 工作迴圈](03-agent-loop.md) |
| [2](https://arxiv.org/html/2609.00006v1#S16.SS2.p1.1) | 若你提供基礎模型，就緊密整合自家供應商，並提供通用轉接層維持可移植性；若不提供，也可使用供應商專屬最佳化，但要編列逐模型中繼資料的維護成本。 | [05 模型整合](05-model-integration.md) |
| [3](https://arxiv.org/html/2609.00006v1#S16.SS3.p1.1) | 從一個 Bash 工具開始；只有觀察到失敗模式時才增加工具。 | [06 工具契約](06-tool-contracts.md) |
| [4](https://arxiv.org/html/2609.00006v1#S16.SS3.p2.3) | 工具數超過約 15 個時，採用延後載入工具說明。 | [06 工具契約](06-tool-contracts.md)、[13 擴充機制](13-extensibility.md) |
| [5](https://arxiv.org/html/2609.00006v1#S16.SS4.p1.1) | 依模型能力選編輯契約；處理文字漂移時不要依賴行號。 | [07 檔案編輯](07-file-editing.md) |
| [6](https://arxiv.org/html/2609.00006v1#S16.SS5.p1.1) | 自動讀取分層 Markdown 規則檔，並依需要讀取子目錄規則。 | [08 程式碼檢索](08-code-retrieval.md)、[10 持久記憶](10-persistent-memory.md) |
| [7](https://arxiv.org/html/2609.00006v1#S16.SS5.p2.1) | 在上下文超限前壓縮、保留近期原文，並逐次合併摘要。 | [09 上下文壓縮](09-context-compaction.md) |
| [8](https://arxiv.org/html/2609.00006v1#S16.SS5.p3.1) | 不要為程式碼建立 RAG；改用 ripgrep、glob、tree-sitter 符號擷取和檔案走訪。 | [08 程式碼檢索](08-code-retrieval.md) |
| [9](https://arxiv.org/html/2609.00006v1#S16.SS6.p1.1) | 對半信任的開發工具，實作三模式批准系統和權限範圍規則。 | [11 權限與隔離](11-permissions.md) |
| [10](https://arxiv.org/html/2609.00006v1#S16.SS6.p2.1) | 對企業、共用或自動化環境，實作作業系統沙箱、政策即程式碼和逐 agent 稽核紀錄。 | [11 權限與隔離](11-permissions.md)、[16 設計自己的 Harness](16-design-your-harness.md) |
| [11](https://arxiv.org/html/2609.00006v1#S16.SS6.p3.1) | 把安全規則寫成資料或政策檔；若有 YOLO 模式，仍保留不可略過的底線。 | [11 權限與隔離](11-permissions.md) |
| [12](https://arxiv.org/html/2609.00006v1#S16.SS7.p1.2) | 除非能指出值得並行探索的工作，否則先維持單一 agent。 | [12 多 agent](12-multi-agent.md) |
| [13](https://arxiv.org/html/2609.00006v1#S16.SS7.p2.2) | 提供 ACP 伺服器供編輯器或上層系統使用；系統自己的子 agent 留在程序內協調。 | [12 多 agent](12-multi-agent.md)、[13 擴充機制](13-extensibility.md)、[15 平台化](15-platform-turn.md) |
| [14](https://arxiv.org/html/2609.00006v1#S16.SS8.p1.1) | 用 Skills 提供工作流程和領域知識；用 MCP 連接外部服務。 | [13 擴充機制](13-extensibility.md) |
| [15](https://arxiv.org/html/2609.00006v1#S16.SS9.p1.1) | 作者建議不要以通用代理框架作為生產 agent 的執行核心；§14.2 另談 Harness SDK 的新角色。 | [14 比較設計](14-compare-designs.md)、[16 設計自己的 Harness](16-design-your-harness.md) |
| [16](https://arxiv.org/html/2609.00006v1#S16.SS9.p2.1) | 不為程式碼檢索建立向量層；若要採用，先在保留任務集上比較效果。 | [08 程式碼檢索](08-code-retrieval.md)、[16 設計自己的 Harness](16-design-your-harness.md) |
| [17](https://arxiv.org/html/2609.00006v1#S16.SS9.p3.1) | 不要把每個 SaaS 端點都包成一個一對一工具；應整合出能完成工作的工具。 | [06 工具契約](06-tool-contracts.md) |
| [18](https://arxiv.org/html/2609.00006v1#S16.SS9.p4.1) | 不要過度設計卡住偵測；仍要加入成本低的呼叫次數和時間上限。 | [04 停止條件](04-stop-conditions.md) |
