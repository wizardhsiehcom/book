# 系統查閱卡

以下卡片只整理論文採用的版本與作者在研究中標出的系統特徵。版本快照和簡介見[表 3](https://arxiv.org/html/2609.00006v1#S4.T3)及[表 4](https://arxiv.org/html/2609.00006v1#S5.T4)；各卡片的補充連結指向論文中的詳細段落。這些資料不代表產品目前的功能。

## 研究樣本中的 11 個系統

### OpenHands

- **表 3 版本：** v1 SDK v1.34.0（2026 年 7 月）；Python。
- **論文特徵：** 成熟的模組化系統；以資源鎖管理可並行工具，並可透過 ACP 使用其他 Harness 作為後端。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[工具與迴圈](https://arxiv.org/html/2609.00006v1#S6.SS2)、[多 agent](https://arxiv.org/html/2609.00006v1#S11.SS4)。

### Aider

- **表 3 版本：** v0.86.3.dev（2026 年 5 月；論文標為維護模式）；Python。
- **論文特徵：** 依模型選擇多種編輯格式；有反思式修正流程和程式庫地圖。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[反思迴圈](https://arxiv.org/html/2609.00006v1#S6.SS3)、[編輯策略](https://arxiv.org/html/2609.00006v1#S8.SS4)。

### Claude Code

- **表 3 版本：** 論文使用 2026 年 3 月原始碼快照；當時可取得的 2026 年 7 月出貨二進位版本是 2.1.206。語言：TypeScript。
- **論文特徵：** 延後載入工具；子 agent 可沿用父工作階段的提示快取；多 agent 遞迴組合。
- **重要限制：** 表 4 和其他標為 2026 年 7 月的表格，Claude Code 欄仍依 3 月原始碼快照整理。作者沒有確認 7 月二進位版本是否相同。
- **查閱：** [版本與總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[延後載入](https://arxiv.org/html/2609.00006v1#S8.SS3)、[多 agent](https://arxiv.org/html/2609.00006v1#S11.SS2)、[與 Codex 的比較](https://arxiv.org/html/2609.00006v1#A1.T18)。

### Codex

- **表 3 版本：** rust-v0.144.1（2026 年 7 月）；Rust。
- **論文特徵：** 將跨工作階段記憶交給背景 agent 維護；工具要求可用 V8 執行的程式表示；採用多層政策和作業系統沙箱。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[記憶](https://arxiv.org/html/2609.00006v1#S9.SS6)、[權限](https://arxiv.org/html/2609.00006v1#S10.SS2)、[多 agent](https://arxiv.org/html/2609.00006v1#S11.SS3)。

### Gemini CLI

- **表 3 版本：** v0.50.0（2026 年 7 月）；TypeScript。
- **論文特徵：** 模型路由參與執行時排程；是樣本中唯一提供 A2A 伺服器的系統；也採用跨作業系統沙箱。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[模型路由](https://arxiv.org/html/2609.00006v1#S7.SS1)、[權限與沙箱](https://arxiv.org/html/2609.00006v1#S10.SS5)、[A2A](https://arxiv.org/html/2609.00006v1#S11.SS6)。

### Mistral Vibe

- **表 3 版本：** v2.19.1（2026 年 7 月）；Python。
- **論文特徵：** 以中介軟體組合回合政策；工作區快照和復原功能可透過 ACP 使用。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[中介軟體管線](https://arxiv.org/html/2609.00006v1#S6.SS5)、[權限範圍](https://arxiv.org/html/2609.00006v1#S10.SS6)。

### Mini-SWE-Agent

- **表 3 版本：** v2.4.5（2026 年 7 月）；Python。
- **論文特徵：** 研究用的極簡基準；以單一工具和簡單迴圈呈現七個子系統的最小形式。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[最小 Harness](https://arxiv.org/html/2609.00006v1#S2.SS4)、[迴圈比較](https://arxiv.org/html/2609.00006v1#S6)。

### Hermes

- **表 3 版本：** 0.18.2，發行標記為 2026.7.7.2（2026 年 7 月）；Python。
- **論文特徵：** 同時是多通道個人助理和 coding Harness；可更新自己的技能。壓縮時輪替工作階段，保留可查找的祖先鏈；另有停止前驗證。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[上下文壓縮](https://arxiv.org/html/2609.00006v1#S9.SS5)、[Skills](https://arxiv.org/html/2609.00006v1#S12.SS5)、[權限底線](https://arxiv.org/html/2609.00006v1#S10.SS7)。

### Pi

- **表 3 版本：** v0.80.6（2026 年 7 月）；TypeScript。
- **論文特徵：** 核心刻意保持精簡，把安全、子 agent 和其他能力留給擴充；工作階段以可分支的紀錄樹表示。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[安全設計取捨](https://arxiv.org/html/2609.00006v1#S10.SS8)、[擴充子 agent](https://arxiv.org/html/2609.00006v1#S11.SS8)。

### OpenCode

- **表 3 版本：** v1.17.18（2026 年 7 月）；TypeScript。
- **論文特徵：** 客戶端／伺服器架構；依語法解析指令，再按引數範圍套用權限規則。
- **查閱：** [總覽](https://arxiv.org/html/2609.00006v1#S5.T4)、[權限](https://arxiv.org/html/2609.00006v1#S10.SS9)、[平台轉向](https://arxiv.org/html/2609.00006v1#S14)。

### OpenClaw

- **表 3 版本：** v2026.6.11（2026 年 7 月）；TypeScript。
- **論文定位：** 非 coding agent，而是可連接多種通訊平台的個人助理閘道；它本身沒有程式碼編輯工具，會把 coding 工作交給外部 SWE agent。論文仍將它納入 11 個研究樣本，以比較一般 agent 平台上的擴充與協定做法。
- **讀數時注意：** 涉及 coding harness 的結論，論文提醒可看排除 OpenClaw 後的 10 個系統數字。Hermes 雖也服務多種通訊平台，卻有原生 coding 工具，因此仍列為研究樣本。
- **查閱：** [樣本定位](https://arxiv.org/html/2609.00006v1#S4.SS1)、[權限](https://arxiv.org/html/2609.00006v1#S10.SS4)、[工作階段編排](https://arxiv.org/html/2609.00006v1#S11.SS10)。

## 另外列出的上層系統：Omnigent

- **表 3 版本：** v0.4.0（2026 年 7 月）；Databricks；Python。
- **論文定位：** 它在多個 Harness 之上統一任務介面、政策、沙箱和跨裝置工作階段。它不實作自己的程式碼編輯迴圈，因此只作 meta-harness 對照，不算第十二個同類樣本，也不納入七個面向的逐系統比較。
- **查閱：** [樣本選擇與排除理由](https://arxiv.org/html/2609.00006v1#S4.SS1)、[meta-harness 分析](https://arxiv.org/html/2609.00006v1#S14.SS4)。
