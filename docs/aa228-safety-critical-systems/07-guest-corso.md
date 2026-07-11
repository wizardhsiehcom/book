# 第 7 章：客座講座——Anthony Corso 與 Terra AI (Guest Lecture: Anthony Corso)

> **客座講者**：Anthony Corso（Stanford SISL 博士、前 Stanford AI 安全中心執行主任（2021–2024）、Terra AI 共同創辦人兼技術長）
>
> 本章涵蓋兩大主題：(1) 強化學習否證法與自適應壓力測試（Adaptive Stress Testing, AST）在真實交通系統中的應用挑戰與解法；(2) 地球資源決策問題的安全關鍵性。

---

## 7.1 強化學習作為否證工具的回顧

在上一章中，我們探討了以規劃技術（RRT、MCTS）逐步建構軌跡來進行否證的方法。本章一開始先補完最後一塊拼圖：以**強化學習（Reinforcement Learning, RL）**驅動對抗者（adversary），讓它學會如何對系統施加擾動以誘發失效。

### 對抗者框架

```mermaid
flowchart LR
    ADV["「對抗者」Adversary<br/>（RL 訓練的策略）"]
    SYS["「系統」System<br/>（被測試物件）"]
    REW["「獎勵」Reward<br/>（越接近失效越高）"]

    ADV -->|"擾動 disturbance d_t"| SYS
    SYS -->|"回饋 reward r_t"| REW
    REW -->|"訓練信號"| ADV
```

這個迴路與強化學習的標準 agent-environment 迴路完全等價，只是：

- **動作 (Action)** = 對系統施加的擾動（感測器雜訊、其他代理的行為……）
- **獎勵 (Reward)** = 系統距離失效的接近程度（失效越近，獎勵越高）
- **目標** = 訓練一個對抗策略，使系統儘可能頻繁地失效

### RL 相較於樹搜尋的優勢

| 面向 | 樹搜尋（MCTS/RRT） | 強化學習 |
|---|---|---|
| 初始狀態泛化 | 每個初始狀態需重新搜尋 | 單一策略可泛化至多種初始狀態 |
| 樣本效率 | 需大量展開 | 藉助數十年 RL 研究成果 |
| 實作複雜度 | 相對直觀 | 需調整超參數 |

### 自適應壓力測試（AST）

> **定義**：以 MCTS 或深度 RL 為搜尋引擎，以「**最可能的失效**」為優化目標，而非任意失效。

AST 的獎勵函數同時包含：

1. 失效信號（是否發生碰撞等）
2. 擾動的**對數似然**（越罕見的擾動，懲罰越重）

此概念由 SISL 長期合作者 **Ritchie Lee**（NASA Ames）等人提出，原始論文發表於 IEEE/AIAA 數位航空電子系統會議（DASC）2015，最初用於驗證 ACAS X 航空防撞系統。

---

## 7.2 選擇否證方法的準則

模擬器的類型是決定可用方法的首要限制：

```mermaid
flowchart TD
    Q1{"模擬器是否支援<br/>「逐步」介面？"}
    Q2{"模擬器是否可微分？"}
    M1["直接採樣、Fuzzing<br/>族群演算法、零階方法"]
    M2["+ RL 方法<br/>+ 樹搜尋方法"]
    M3["+ 一階/二階梯度法"]

    Q1 -->|"否（黑箱整段軌跡）"| M1
    Q1 -->|"是"| Q2
    Q2 -->|"否"| M2
    Q2 -->|"是"| M3
```

其他考量因素：

- **失效稀少性**：失效越罕見，越值得使用 MCTS、RL 等樣本高效方法
- **領域特性**：沒有放諸四海皆準的算法，需實驗驗證

---

## 7.3 真實世界 AST 的三大挑戰

Anthony Corso 在演講中將實際部署 AST 的困難歸納為三個方向：

```mermaid
graph TD
    A["「AST 真實部署」Real-world AST"]
    B["「挑戰一」目標規格設計<br/>Objective Specification"]
    C["「挑戰二」環境建模<br/>Environment Modelling"]
    D["「挑戰三」高效優化<br/>Efficient Optimisation"]

    A --> B
    A --> C
    A --> D
```

---

## 7.4 挑戰一：目標規格設計

### 自動駕駛行人場景

SISL 設計了一個簡單場景：行人過馬路，自駕車應煞停。擾動包含：

- 行人的行走路徑偏差
- 自駕車的感測器定位雜訊

初始獎勵函數：

$$r = r_\text{failure} + r_\text{closeness} + r_\text{likelihood}$$

**問題**：優化結果顯示，最常見的「失效」是行人直接衝向已停下的車輛——這完全是行人的錯，並非自駕車失效。

### 解法：責任感知安全規範（RSS）

**責任感知安全（Responsibility-Sensitive Safety, RSS）** 以數學方式將道路交通規則形式化，並能判斷事故中誰應負責。

修改目標為：

> 只搜尋**自駕車應負責的失效**情境。

結果：AST 找到了更具代表性的失效——行人以斜向步態穿越，感測器雜訊偏移導致車輛誤判行人仍在人行道上，最終發生碰撞。此情境與 2018 年 Uber ATG 事故高度相似：NTSB 調查指出，該事故中感測器其實早已偵測到行人，但**感知分類軟體**反覆在車輛、自行車與其他物體之間重新分類、從未將她辨識為行人，且原廠自動緊急煞車功能被停用，最終釀成憾事。

```mermaid
sequenceDiagram
    participant P as 行人
    participant S as 感測器
    participant V as 自駕車

    P ->> S: "斜向行走（非直線）"
    Note over S: "雜訊偏移導致定位錯誤"
    S ->> V: "誤報：行人仍在人行道"
    V ->> V: "未煞車"
    V ->> P: "碰撞（自駕車之責任）"
```

**關鍵洞見**：規格必須編碼**責任歸屬**，而非僅追蹤物理接觸。

---

## 7.5 挑戰二：環境建模

### 建模困難來源

1. **人類駕駛行為**極為複雜，建立精確模型的難度等同於建立一輛自駕車
2. **感測器雜訊**（LiDAR、攝影機）維度極高，不像 GPS 有明確的誤差分佈

### 從數據學習環境模型

利用公開數據集（無人機俯瞰高速公路、路口固定攝影機等）訓練模型：

- 自動分割與物件偵測 → 各車輛的時序軌跡
- 使用**生成對抗網路（GAN）** 學習代理的行為分佈

GAN 在本脈絡中的兩種應用：

| 應用 | 說明 |
|---|---|
| **多代理行為模型** | 學習高速公路上多輛車的聯合行為（煞車傳遞、變換車道等） |
| **感測器外觀模型** | 生成特定場景（如跑道）下攝影機所見影像，用於模擬器 |

> 實務上，環境建模所耗費的工程資源往往遠超否證演算法本身。

---

## 7.6 挑戰三：高效優化——TaxiNet 案例

### 系統描述

**TaxiNet** 是一個讓飛機自主滑行的系統：

```mermaid
flowchart LR
    CAM["「機翼攝影機」Wing Camera"]
    DS["「縮減取樣」Downsample<br/>（灰階低解析度）"]
    NN["「小型神經網路」Small NN<br/>（估算跑道偏移量）"]
    CTRL["「方向舵控制」Rudder Control"]

    CAM --> DS --> NN --> CTRL
```

設計使用**小型神經網路**的原因：可應用形式化神經網路驗證工具。

### 逐步分析流程

**步驟 1：單步最壞情況分析**

對每個時間步，以神經驗證工具求解：

$$\max_{\delta \in \mathcal{B}_\epsilon} \text{steering\_error}(x + \delta)$$

其中 $\mathcal{B}_\epsilon$ 為像素擾動的 $\epsilon$-球。

結果：即使每步都施加同方向最壞擾動，飛機仍能保持安全（神經網路具備強健性）。

**步驟 2：MCTS 序列搜尋**

以 MCTS 在每個時間步選擇「向左偏」或「向右偏」的最壞擾動，在 3% 擾動閾值下發現關鍵失效：

```mermaid
sequenceDiagram
    participant M as MCTS
    participant A as 飛機
    participant NN as 神經網路

    M ->> A: "持續向左偏移（多步）"
    A ->> NN: "飛機已偏至跑道邊緣"
    M ->> A: "切換：改為向右偏移"
    Note over NN: "畫面已超出訓練分佈"
    NN ->> A: "無法正確估算位置"
    A ->> A: "滑出跑道"
```

**核心結論**：

- 2% 擾動：未發現失效
- 3% 擾動：MCTS 找到非直觀的序列失效模式
- **失效可從複雜的事件序列中湧現**，單步分析不足以評估安全性

---

## 7.7 DiFS：基於擴散模型的失效採樣

**Harrison Delecki**（SISL）等人開發的 **DiFS（Diffusion-Based Failure Sampling）** 方法（發表於 IEEE ERAS 2025），針對高維自主系統的失效發現問題。

### 核心思想

將失效發現視為**條件生成建模**任務：

> 學習一個擴散模型，能在給定高風險度量值 $R$ 的條件下，生成擾動序列 $\mathbf{d}$。

### 迭代演算法

```mermaid
flowchart TD
    S1["「步驟 1」從先驗分佈採樣擾動<br/>計算風險度量 R"]
    S2["「步驟 2」訓練條件擴散模型<br/>P(d | R)"]
    S3["「步驟 3」提高風險閾值<br/>從模型採樣高 R 擾動"]
    S4["「步驟 4」執行模擬器<br/>評估真實 R 值"]
    S5{"是否達到失效區域？"}
    END["「結束」輸出失效分佈樣本"]

    S1 --> S2 --> S3 --> S4 --> S5
    S5 -->|"否"| S2
    S5 -->|"是"| END
```

### 實驗結果

| 系統 | 說明 |
|---|---|
| **2D 玩具問題** | 擾動來自二維高斯分佈；失效區域在左上/右上角；DiFS 樣本與 MC 真實分佈高度吻合 |
| **倒立擺** | 擾動施加於扭矩；迭代過程可視化顯示逐步收斂至高失效區 |
| **F-16 模型** | 高自由度飛行動力學；DiFS 找到高似然失效軌跡（飛機觸地）；傳統優化器難以解決 |

---

## 7.8 安全驗證的整體性

Corso 強調，AST 只是安全工程完整循環中的一個環節：

```mermaid
flowchart LR
    REQ["「需求」Requirements"]
    DES["「設計」Design"]
    TEST["「測試」Test<br/>（AST 在此發揮作用）"]
    DEP["「部署」Deploy"]
    MON["「監控」Monitor"]

    REQ --> DES --> TEST --> DEP --> MON
    MON -->|"回饋失效模式"| REQ
```

### 遷移學習加速驗證

當系統更新後，舊版的驗證結果失效。**遷移學習（Transfer Learning）**可將舊版失效案例作為新版驗證的熱啟動（warm-start），大幅縮短搜尋時間。

---

## 7.9 地球資源問題與安全關鍵性

### 氣候背景

全球暖化路徑取決於政策選擇（以下數字依 Climate Action Tracker 2025 年 11 月更新與 IPCC AR6，2021）：

- 現有政策路徑：約 2.6°C 升溫（CAT 2025-11 評估）
- 極高排放情境（IPCC AR6 SSP5-8.5）：本世紀末最佳估計約 4.4°C
- 積極減排：若各國淨零承諾全數兌現，約可壓至 1.9°C；要控制在 1.5–2°C，仍需超出現有承諾的額外行動

應對挑戰需要：再生能源、碳儲存、電氣化，以及大量關鍵礦產（銅、鎳、鋰）。

### 地下資源的共同特性

```mermaid
graph TD
    SUB["「地下資源應用」Subsurface Applications"]
    A["「原材料」Critical Minerals<br/>（銅、鎳、鋰）"]
    B["「地熱能」Geothermal Energy"]
    C["「碳封存」Carbon Storage（CCS）"]
    COMM["「共同特性」POMDP 框架<br/>部分可觀測 + 高不確定性 + 序列決策"]

    SUB --> A & B & C
    A & B & C --> COMM
```

### 碳封存（CCS）問題

將 CO₂ 注入深層鹽水層並以不透水岩石封蓋，使其長期滯留地下：

**決策問題**：
- 在哪裡注入？注入多少？
- 如何規劃探測鑽孔的順序以最大化資訊？

**不確定性來源**：地質結構未知，觀測手段有限（地震勘探、鑽孔感測器）

**代理模型加速**：物理模擬器每次需 10–12 小時 → 以深度神經網路（監督學習）訓練代理模型，速度提升千倍

**結果**：POMDP 求解器在 CO₂ 洩漏指標上優於人類儲層工程師（從 16% 洩漏降至接近 0%）

### 安全風險

| 風險類型 | 說明 | 案例 |
|---|---|---|
| **誘發地震** | 高壓注入液體可重新激活斷層 | 2017 年南韓浦項地震（Mw 5.4，政府調查認定由 EGS 地熱注水觸發） |
| **CO₂ 洩漏** | CO₂ 沿斷層遷移回地表，可能窒息人畜 | 1986 年喀麥隆尼奧斯湖事件 |

### 未來研究方向

- 將 AST 風格的主動失效搜尋應用於地下決策代理
- 搜尋導致最壞結果的地質配置（「地質擾動」類比感測器擾動）
- 可用作起點的基準：簡化版 CO₂ 注入 POMDP（NeurIPS 研討會論文）

---

## 7.10 本章小結

| 主題 | 核心要點 |
|---|---|
| **RL 否證** | 對抗者 = RL 代理；可泛化至多初始狀態 |
| **AST** | 最可能失效 = 似然加權獎勵；MCTS 或深度 RL 搜尋 |
| **模擬器選擇準則** | 黑箱→零階；逐步→RL/樹搜；可微→梯度法 |
| **目標規格（RSS）** | 需編碼責任歸屬，不能只追蹤接觸 |
| **環境建模（GAN）** | 從數據學習代理行為與感測器外觀 |
| **TaxiNet** | 單步最壞分析不夠；MCTS 揭露序列失效 |
| **DiFS** | 條件擴散模型迭代逼近失效分佈 |
| **安全整體性** | AST 僅為完整安全工程循環的一部分 |
| **地下資源** | POMDP 框架；代理模型；安全風險（地震、洩漏） |

至此，「否證」主軸告一段落：我們已能找到單一（甚至最可能的）失效。下一章將更進一步，探討如何刻畫**完整的失效分佈**——系統失效時究竟會呈現哪些不同的行為模式。

---

## 7.11 延伸閱讀

- Lee, R. et al. (2015) — *Adaptive Stress Testing of Airborne Collision Avoidance Systems*, IEEE/AIAA DASC 2015（AST 原始論文）；另可參考 Lee 等人 2020 年於 JAIR 發表的 AST 回顧論文
- Shalev-Shwartz, S. et al. — *Responsibility-Sensitive Safety*（Mobileye RSS 白皮書）
- Delecki, H. et al. — *Diffusion-Based Failure Sampling for Evaluating Safety-Critical Autonomous Systems*, IEEE ERAS 2025（DiFS）
- Moss, R. J. 的 AST 工具與框架 — *POMDPStressTesting.jl: Adaptive Stress Testing for Black-Box Systems*, JOSS, 2021
- 神經網路驗證：課程另有未公開之神經網路驗證客座講座（Min Wu），可參考教科書《Algorithms for Validation》§9.7
- Kochenderfer, M. J. et al. — *Algorithms for Decision Making*（POMDP 背景）

完整參考資料見[附錄：參考資料](appendix-references.md)。
