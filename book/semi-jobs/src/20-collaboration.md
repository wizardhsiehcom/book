# 職務合作關係圖

半導體的每個職務都不是孤島，一顆晶片從設計到出貨，需要十幾種工程師環環相扣。這頁把主要的合作介面全部攤開。

## 全局合作網路

```mermaid
flowchart TD
    subgraph "設計端 Design"
        ICD["IC Design"]
        VER["Verification"]
        DFT["DFT"]
        LAY["Layout / P&R"]
        EDA["EDA / CAD"]
    end

    subgraph "製造端 FAB"
        PHO["微影 Photo"]
        ETC["蝕刻 Etch"]
        DEP["薄膜 Dep"]
        CMP2["CMP"]
        INT["整合 Integration"]
        EQP["設備 Equipment"]
    end

    subgraph "品質 & 封測"
        PKG["封裝 Package"]
        TST["測試 Test"]
        REL["可靠度 Reliability"]
        QA2["QA"]
        FA["失效分析 FA"]
    end

    subgraph "外部介面"
        FAE2["FAE / AE"]
        ASML_AE["ASML AE"]
        CUST["客戶 Customer"]
    end

    ICD <-->|"RTL → Testbench"| VER
    ICD <-->|"電路圖 → Layout"| LAY
    ICD <-->|"RTL → Scan 插入"| DFT
    ICD <-->|"使用工具 / 流程"| EDA
    DFT <-->|"測試向量 → ATE 程式"| TST
    VER <-->|"Silicon Bring-up"| TST
    PKG <-->|"Bump 規格 / 訊號完整性"| ICD
    REL <-->|"失效樣品"| FA
    QA2 <-->|"客訴根因"| FA
    PHO <-->|"製程配方 / 設備狀態"| EQP
    ETC <-->|"製程配方 / 設備狀態"| EQP
    DEP <-->|"製程配方 / 設備狀態"| EQP
    INT <-->|"跨製程診斷"| PHO & ETC & DEP & CMP2
    ASML_AE <-->|"EUV 技術支援"| PHO
    FAE2 <-->|"客戶 Bug / 需求"| ICD
    FAE2 <-->|"客戶介面"| CUST
    TST <-->|"出貨品質"| QA2
    PKG <-->|"可靠度驗證"| REL
```

---

## 1. IC Design ↔ Verification：核心設計迴圈

```mermaid
sequenceDiagram
    participant D as IC Design
    participant V as Verification

    D->>V: 交付 RTL 及設計規格
    V->>V: 建立 UVM Testbench<br/>撰寫 Coverage Model
    V->>D: 回報 Bug（功能錯誤）
    D->>D: 修正 RTL
    D->>V: 更新 RTL
    V->>V: 重新跑模擬<br/>Coverage 收斂
    V->>D: 確認 Sign-off
    D->>D: Tape-out
```

**合作介面：**
- IC Design 提供 RTL + 規格文件；Verification 根據規格設計測試環境
- Verification 回報的 Bug 通常佔設計修改工時 40–60%
- Coverage 收斂標準需雙方事先議定（通常 >98%）

---

## 2. IC Design ↔ Layout：從電路到幾何

```mermaid
flowchart LR
    ICD2["IC Design<br/>（電路圖 / Netlist）"]
    LAY2["Layout Engineer<br/>（幾何 GDS）"]

    ICD2 -->|"提供 Schematic<br/>電路設計規格"| LAY2
    LAY2 -->|"Extracted Netlist<br/>寄生參數 RC"| ICD2
    LAY2 -->|"Layout 完成<br/>DRC / LVS Pass"| FAB["交晶圓廠生產"]
    ICD2 -->|"Post-layout 模擬<br/>確認時序/雜訊"| LAY2
```

**合作介面：**
- 類比設計師和 Layout 工程師需要密切討論匹配策略（Common-Centroid）
- Layout 萃取的 RC 寄生值回饋設計師，設計師確認後才能 Tape-out
- 越先進的節點（3nm/2nm），Layout 對設計的約束越多

---

## 3. IC Design ↔ DFT：可測試性的協商

```mermaid
flowchart LR
    ICD3["IC Design"] <-->|"協商：<br/>掃描鏈插入點<br/>BIST 電路面積預算"| DFT3["DFT Engineer"]
    DFT3 -->|"ATPG 向量"| TST3["Test Engineer<br/>（ATE 執行）"]
    DFT3 -->|"MBIST 設計"| ICD3
    ICD3 -->|"提供設計資料庫"| DFT3
```

**合作介面：**
- DFT 需要佔用一定面積（掃描鏈 FF）；IC Design 需評估面積 / 功耗代價
- JTAG 架構需要 IC Design 在規劃階段就預留 TAP Controller
- Test Engineer 執行 DFT 工程師產出的 ATPG 向量

---

## 4. 製程 × 設備：晶圓廠的日常運作夥伴

```mermaid
flowchart LR
    subgraph "製程工程師 PE"
        PE1["定義製程配方<br/>Recipe"]
        PE2["監控 SPC 管制圖"]
        PE3["製程異常根因分析"]
    end
    subgraph "設備工程師 EE"
        EE1["執行 PM 定期保養"]
        EE2["機台故障排除"]
        EE3["保養後製程確認"]
    end

    PE1 <-->|"配方 vs 機台能力<br/>協商可行性"| EE1
    PE2 <-->|"SPC 異常 → 是製程還是機台？"| EE2
    PE3 <-->|"根因：製程配方 or 機台狀態？"| EE2
    EE3 <-->|"保養後跑測試晶圓<br/>PE 確認製程回到規格"| PE2
```

**合作介面：**
- 每次 PM 後，製程工程師要跑「資格確認晶圓（Qualification Wafer）」驗證機台回到規格
- 製程異常時，兩者要共同判斷是「配方問題」還是「機台問題」
- Tool Matching（多台相同機台的製程一致性）是雙方最頻繁的合作議題

---

## 5. 整合工程師 ↔ 各製程模組

```mermaid
flowchart TD
    INT2["整合工程師<br/>Integration Engineer"] <-->|"Photo 偏移影響 CD"| PHO2["微影 PE"]
    INT2 <-->|"Etch 過蝕影響 Vt"| ETC2["蝕刻 PE"]
    INT2 <-->|"Dep 薄膜應力影響通道"| DEP2["薄膜 PE"]
    INT2 <-->|"CMP 後殘留影響下層製程"| CMP3["CMP PE"]
    INT2 <-->|"元件特性最終診斷"| DEV["元件 / 良率工程師"]
    INT2 <-->|"反饋給製程開發"| TSMC_RD["先進節點 R&D"]
```

**特點：** 整合工程師是「跨模組偵探」，當元件特性偏移時，他們要追查是哪道製程（或哪幾道製程的交互作用）造成的。

---

## 6. DFT ↔ Test Engineer：測試的上下游

```mermaid
flowchart LR
    DFT4["DFT Engineer"] -->|"ATPG 測試向量<br/>(.stil / .pat 格式)"| TST4["Test Engineer"]
    TST4 -->|"向量轉換<br/>→ ATE 格式（V93000）"| ATE4["Advantest ATE"]
    TST4 -->|"測試結果 / 良率資料"| DFT4
    DFT4 <-->|"測試覆蓋率確認<br/>Fault Coverage 報告"| TST4
    TST4 -->|"測試時間優化需求"| DFT4
```

**合作介面：**
- DFT 設計的掃描鏈壓縮比（X-Press Compression）直接影響測試時間
- Test Engineer 反映 ATE 限制（時序精度、Pin 數限制），DFT 需配合調整

---

## 7. 封裝工程師 ↔ IC Design：封裝寄生效應的協商

```mermaid
flowchart TB
    ICD4["IC Design<br/>（高速 SerDes / DDR）"]
    PKG2["Package Engineer<br/>（矽中介板 RDL / 基板）"]

    ICD4 <-->|"Pin 腳位指定<br/>訊號完整性需求"| PKG2
    PKG2 <-->|"封裝寄生 RL / C 模型<br/>回饋設計師模擬"| ICD4
    PKG2 <-->|"CoWoS RDL 繞線規則<br/>影響 Die 的 Bump Map 設計"| ICD4
    PKG2 <-->|"熱模擬結果<br/>影響晶片電源管理設計"| ICD4
```

---

## 8. QA ↔ 可靠度 ↔ 失效分析：品質三角

```mermaid
flowchart LR
    QA3["QA<br/>品質工程師"] <-->|"客訴品 → 送 FA"| FA3["失效分析<br/>FA Engineer"]
    FA3 <-->|"可靠度測試失效品<br/>送 FA 找根因"| REL3["可靠度工程師"]
    REL3 <-->|"Qualification 測試計畫<br/>QA 審核"| QA3
    FA3 -->|"根本原因報告<br/>→ 改善措施"| ICD5["IC Design /<br/>製程工程師"]
    QA3 -->|"CAPA 執行狀況<br/>回饋給客戶"| CUST2["客戶"]
```

**三者分工：**
- **QA** 管客戶介面、改善措施追蹤、認證管理
- **可靠度** 做加速測試、壽命預測、失效模式識別
- **FA** 做顯微鏡等物理 / 化學分析，提供根本原因

---

## 9. FAE ↔ IC Design ↔ 客戶：市場與技術的橋樑

```mermaid
sequenceDiagram
    participant C as 客戶（手機廠）
    participant F as FAE
    participant D as IC Design

    C->>F: 反映晶片在系統中有 Bug
    F->>F: 在客戶現場初步 debug
    F->>D: 提交 Bug Report（含波形 / log）
    D->>D: 分析根因
    D->>F: 提供 Workaround 或 Patch
    F->>C: 協助驗證解法
    C->>F: 確認問題解決
    F->>D: 回饋：客戶有新功能需求
    D->>D: 列入下一代晶片規格
```

---

## 職務合作強度熱力圖

| | IC Design | Verification | DFT | Layout | 製程 PE | 設備 EE | 整合 | 封裝 | 測試 | 可靠度 | FA | QA | FAE |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **IC Design** | — | 🔴 | 🔴 | 🔴 | ⚪ | ⚪ | ⚪ | 🟡 | 🟡 | ⚪ | 🟡 | ⚪ | 🟡 |
| **Verification** | 🔴 | — | 🟡 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🟡 | ⚪ | ⚪ | ⚪ | ⚪ |
| **DFT** | 🔴 | 🟡 | — | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🔴 | ⚪ | ⚪ | ⚪ | ⚪ |
| **Layout** | 🔴 | ⚪ | ⚪ | — | 🟡 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| **製程 PE** | ⚪ | ⚪ | ⚪ | 🟡 | — | 🔴 | 🔴 | ⚪ | ⚪ | ⚪ | 🟡 | 🟡 | ⚪ |
| **設備 EE** | ⚪ | ⚪ | ⚪ | ⚪ | 🔴 | — | 🟡 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| **整合工程師** | ⚪ | ⚪ | ⚪ | ⚪ | 🔴 | 🟡 | — | ⚪ | ⚪ | ⚪ | 🟡 | ⚪ | ⚪ |
| **封裝** | 🟡 | ⚪ | ⚪ | 🟡 | ⚪ | ⚪ | ⚪ | — | 🟡 | 🔴 | 🟡 | 🟡 | ⚪ |
| **測試** | 🟡 | 🟡 | 🔴 | ⚪ | ⚪ | ⚪ | ⚪ | 🟡 | — | 🟡 | 🟡 | 🟡 | ⚪ |
| **可靠度** | ⚪ | ⚪ | ⚪ | ⚪ | 🟡 | ⚪ | ⚪ | 🔴 | 🟡 | — | 🔴 | 🔴 | ⚪ |
| **FA** | 🟡 | ⚪ | ⚪ | ⚪ | 🟡 | ⚪ | 🟡 | 🟡 | 🟡 | 🔴 | — | 🔴 | ⚪ |
| **QA** | ⚪ | ⚪ | ⚪ | ⚪ | 🟡 | ⚪ | ⚪ | 🟡 | 🟡 | 🔴 | 🔴 | — | 🔴 |
| **FAE** | 🟡 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🟡 | — |

🔴 高頻繁合作 　🟡 中等合作 　⚪ 較少直接合作

---

## 一顆晶片的跨職務旅程

```mermaid
flowchart LR
    SPEC["客戶需求<br/>（FAE 整理）"]
    ARCH["晶片架構設計<br/>（IC Design）"]
    RTL["RTL 開發<br/>（IC Design）"]
    VER2["功能驗證<br/>（Verification）"]
    DFT2["DFT 插入<br/>（DFT）"]
    LAY3["實體設計<br/>（Layout）"]
    TAPE["Tape-out<br/>送交台積電"]
    PROC["晶圓製程<br/>（製程 / 設備 / 整合）"]
    PKG3["封裝<br/>（封裝工程師）"]
    TEST2["出廠測試<br/>（測試工程師）"]
    QA4["品質稽核<br/>（QA）"]
    REL4["可靠度認證<br/>（可靠度工程師）"]
    SHIP["出貨給客戶<br/>（FAE 後續支援）"]

    SPEC --> ARCH --> RTL --> VER2
    VER2 -->|"Sign-off"| DFT2 --> LAY3 --> TAPE
    TAPE --> PROC --> PKG3 --> TEST2 --> QA4
    QA4 & REL4 -->|"通過認證"| SHIP
    SHIP --> SPEC
```
