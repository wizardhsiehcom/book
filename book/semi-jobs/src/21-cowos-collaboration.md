# CoWoS 專案的跨職務合作

CoWoS 封裝是目前半導體業最複雜的跨職務協作場景之一。一個 NVIDIA H100 等級的 CoWoS-S 專案，需要來自**設計、製程、設備、封裝、測試、可靠度**至少六大類工程師長期協作，而且很多工作必須同時進行。

## 誰參與了一個 CoWoS 專案？

```mermaid
flowchart TD
    subgraph "客戶端（如 NVIDIA）"
        ICD["IC Design<br/>GPU Die 設計<br/>Bump Map / PHY"]
        PKG_CUST["封裝工程師<br/>系統級封裝規格"]
        FAE2["FAE<br/>TSMC 介面"]
    end

    subgraph "TSMC CoWoS 團隊"
        PKG_TSMC["先進封裝工程師<br/>中介板 RDL 設計<br/>TSV 規格"]
        PHO["微影工程師<br/>RDL 曝光 / 光罩拼接"]
        ETC["蝕刻工程師<br/>TSV via 蝕刻"]
        DEP["薄膜工程師<br/>TSV 填銅 / RDL 金屬"]
        CMP2["CMP 工程師<br/>中介板平坦化"]
        EQP["設備工程師<br/>機台保養維護"]
        INT["整合工程師<br/>全流程製程整合"]
    end

    subgraph "品質與驗證"
        REL["可靠度工程師<br/>HTOL / HAST / TC 測試"]
        FA["失效分析工程師<br/>Bump 裂縫 / TSV 失效"]
        QA2["QA 工程師<br/>客戶認證管理"]
        TST["測試工程師<br/>Known Good Die / 封裝後測試"]
    end

    subgraph "HBM 供應商（SK Hynix / Samsung）"
        HBM_PKG["HBM 封裝工程師<br/>Base Die TSV / Micro Bump"]
    end

    ICD <-->|"Bump Map + PHY 規格"| PKG_TSMC
    PKG_TSMC <-->|"RDL 佈線規則 / TSV 位置"| PHO & ETC & DEP & CMP2
    PHO & ETC & DEP & CMP2 <-->|"製程狀態"| EQP
    INT <-->|"跨模組整合診斷"| PHO & ETC & DEP & CMP2
    PKG_TSMC <-->|"Micro Bump 規格協調"| HBM_PKG
    TST -->|"KGD 良品篩選"| PKG_TSMC
    PKG_TSMC --> REL
    REL <-->|"失效樣品"| FA
    QA2 <-->|"認證審核"| REL
    FAE2 <-->|"客戶技術溝通"| PKG_TSMC
```

---

## 1. GPU Die 設計 ↔ CoWoS 封裝工程師：協同設計

這是 CoWoS 專案最重要的上游合作，必須從晶片設計階段就開始。

```mermaid
sequenceDiagram
    participant D as IC Design（NVIDIA GPU）
    participant P as CoWoS 封裝工程師（TSMC）

    D->>P: 提供 Die 尺寸、Bump Map（Pitch / 位置）
    P->>D: 反饋 RDL 繞線可行性<br/>（最小 Pitch 能做到多少？）
    D->>P: 調整 HBM PHY 的 Bump 佈局
    P->>D: 提供封裝寄生模型（RL / C）
    D->>D: 用封裝寄生模型做訊號完整性模擬
    D->>P: 確認 Bump Map 定案
    P->>P: 設計矽中介板 RDL（0.4–2 μm）
    P->>D: 大面積光罩拼接（>830 mm²）的<br/>設計規則限制
    D->>P: 晶片角落的 Bump 規格調整
    P->>P: Tape-out 中介板光罩
```

**關鍵協商點：**

| 議題 | GPU Die 端需求 | CoWoS 封裝端限制 |
|------|--------------|----------------|
| Bump Pitch | 越小越好（更多 I/O）| 最小 ~45–55 μm（製程下限）|
| HBM 距離 | 越近越好（訊號延遲低）| 中介板面積 / 光罩拼接影響可用空間 |
| 電源分配 | PDN 阻抗要求 | TSV 密度 / RDL 銅厚影響電阻 |
| 熱管理 | 晶片發熱要散出去 | 封裝材料 / TIM 選擇需配合 |

---

## 2. 微影工程師 × 光罩拼接：CoWoS-S 的製程核心

CoWoS-S Gen 5（~2500 mm²）中介板遠超單一光罩面積（~830 mm²），需要多片光罩拼接（Mask Stitching）。

```mermaid
flowchart LR
    subgraph "光罩拼接流程"
        M1["光罩 1<br/>區域 A（830 mm²）"]
        M2["光罩 2<br/>區域 B（830 mm²）"]
        M3["光罩 3<br/>區域 C（830 mm²）"]
        STITCH["拼接區域<br/>對準精度 < 10 nm"]
    end

    PHO2["微影工程師"] <-->|"拼接對準策略"| EDA2["EDA / PDK 工程師<br/>（光罩設計規則）"]
    PHO2 <-->|"ASML 覆蓋對準參數調整"| ASML2["ASML AE<br/>（EUV / DUV 支援）"]
    PHO2 <-->|"拼接區域良率分析"| INT2["整合工程師<br/>（拼接缺陷診斷）"]

    M1 & M2 & M3 --> STITCH
```

**微影工程師在 CoWoS 的特殊挑戰：**
- 拼接處的 RDL 導線必須完美連續——任何對準偏移 >10 nm 都可能造成斷線
- RDL 的線寬（~0.4 μm）需要 DUV ArF 沉浸式或 EUV 曝光
- 大面積晶圓的翹曲（Warpage）影響焦距均勻性，需特殊補償演算法

---

## 3. TSV 製程的跨部門合作

```mermaid
flowchart LR
    subgraph "TSV 製程（Via-Last）"
        THIN["晶圓薄化<br/>研磨至 ~100 μm"]
        VIA["Via 蝕刻<br/>深孔蝕刻（蝕刻工程師）"]
        ISO["絕緣層沉積<br/>SiO₂ ALD（薄膜工程師）"]
        SEED["銅種子層<br/>PVD（薄膜工程師）"]
        FILL["銅填充<br/>電化學電鍍 ECP"]
        CMP3["TSV CMP 平坦化<br/>（CMP 工程師）"]
    end

    ETC2["蝕刻工程師"] -->|"高深寬比蝕刻<br/>深度 100 μm / 直徑 10 μm"| VIA
    DEP2["薄膜工程師"] -->|"ALD 共形覆蓋<br/>確保孔壁均勻"| ISO & SEED
    CMP4["CMP 工程師"] -->|"TSV 露頭後平坦化"| CMP3
    INT3["整合工程師"] <-->|"TSV 電阻 / 絕緣性整合確認"| ETC2 & DEP2 & CMP4
    REL2["可靠度工程師"] <-->|"TSV 熱循環應力測試"| INT3
```

---

## 4. 封裝工程師 ↔ 可靠度工程師：CoWoS 的壽命挑戰

CoWoS 封裝中材料 CTE 差異極大，是可靠度工程師的主要戰場。

```mermaid
flowchart TD
    subgraph "CTE 不匹配問題（ppm/°C）"
        SI["矽 Die / 中介板：2.6"]
        CU["銅 TSV / RDL：17"]
        SUB["有機基板：15–20"]
    end

    PKG3["封裝工程師"] <-->|"Underfill 材料選擇<br/>應力模擬（ANSYS）"| REL3["可靠度工程師"]
    REL3 -->|"溫度循環測試<br/>-55°C ↔ 125°C × 1000 次"| FA3["失效分析工程師"]
    FA3 -->|"Micro Bump 裂縫<br/>TSV 剝離分析（TEM / FIB）"| PKG3
    PKG3 <-->|"翹曲量測 / 補償方案"| INT4["整合工程師"]

    subgraph "主要可靠度測試"
        TC["溫度循環 TC<br/>焊點疲勞"]
        HAST2["HAST<br/>高溫高濕"]
        DROP["落下測試<br/>機械衝擊"]
    end
```

**失效分析工程師在 CoWoS 的核心工具：**

| 失效模式 | 分析工具 | 分析內容 |
|---------|---------|---------|
| Micro Bump 裂縫 | FIB + TEM | 介金屬化合物（IMC）成長、裂縫延伸路徑 |
| TSV 剝離 | FIB 截面 + EDS | 銅 / 氧化矽介面剝離、污染元素 |
| RDL 斷線 | EMMI + FIB | 拼接處電阻異常、高阻路徑定位 |
| 封裝分層 | SAT（聲學掃描）+ SEM | 分層位置 / 範圍 |

---

## 5. Known Good Die（KGD）：測試工程師的關鍵角色

在 CoWoS 中，把一個有缺陷的 Die 放進中介板，整個封裝就會報廢。因此在封裝前確認每顆 Die 的品質（KGD）至關重要。

```mermaid
flowchart LR
    WAFER["晶圓（GPU Die）"]
    CP["Wafer Sort / CP<br/>（測試工程師）"]
    KGD["Known Good Die<br/>已知良品晶粒"]
    COWOS_ASM["CoWoS 組裝<br/>（封裝工程師）"]
    FT["封裝後最終測試<br/>（測試工程師）"]
    SHIP["出貨"]

    WAFER --> CP
    CP -->|"良品"| KGD
    CP -->|"不良品 → 丟棄"| SCRAP["報廢<br/>避免浪費中介板"]
    KGD --> COWOS_ASM --> FT --> SHIP

    DFT2["DFT 工程師"] <-->|"Die-to-Die 測試向量<br/>Chiplet 邊界掃描"| CP
    DFT2 <-->|"封裝後測試策略"| FT
```

**CoWoS KGD 的特殊挑戰：**
- 中介板面積大、成本高，任何 Die 缺陷都會導致巨額損失
- 測試需要 KGD 探針卡（Probe Card），測試點極細（Bump Pitch ~55 μm）
- AI 晶片的 GPU Die 面積大（~800 mm²），良率本身就低，KGD 篩選尤為重要

---

## 6. ASML AE ↔ TSMC 微影工程師：EUV 合作的特殊關係

```mermaid
sequenceDiagram
    participant ASML as ASML AE（駐廠）
    participant PHO3 as TSMC 微影工程師
    participant EQP2 as TSMC 設備工程師

    PHO3->>ASML: EUV 機台出現焦距偏移（Focus Drift）
    ASML->>ASML: 診斷：光源功率波動？<br/>反射鏡污染？溫控問題？
    ASML->>EQP2: 建議更換特定光學元件
    EQP2->>EQP2: 執行 PM（需 ASML 工具 / 認證）
    ASML->>PHO3: 提供新的曝光補償參數
    PHO3->>PHO3: 跑資格確認晶圓
    PHO3->>ASML: 製程恢復確認
    Note over ASML,PHO3: CoWoS RDL 光罩拼接精度<br/>需要 ASML 和 TSMC 持續協作調整
```

---

## CoWoS 專案職務合作強度

| 職務 | CoWoS 合作強度 | 主要合作對象 |
|------|-------------|------------|
| 先進封裝工程師（TSMC） | 🔴 核心 | IC Design、微影、蝕刻、薄膜、整合、可靠度 |
| IC Design（GPU Die） | 🔴 核心 | 封裝工程師（Bump Map 協同設計）|
| 微影工程師 | 🔴 核心 | ASML AE、封裝工程師、整合工程師 |
| 整合工程師 | 🔴 核心 | 所有製程模組（跨模組診斷）|
| 蝕刻工程師 | 🟡 重要 | 封裝工程師、整合工程師（TSV 蝕刻）|
| 薄膜工程師 | 🟡 重要 | 封裝工程師（TSV 絕緣 / 銅種子層）|
| CMP 工程師 | 🟡 重要 | 封裝工程師（TSV / RDL 平坦化）|
| 可靠度工程師 | 🟡 重要 | 封裝工程師、FA 工程師 |
| 失效分析工程師 | 🟡 重要 | 可靠度工程師（TSV / Bump 失效）|
| 測試工程師 | 🟡 重要 | DFT 工程師（KGD 篩選策略）|
| ASML AE | 🟡 重要 | 微影工程師（RDL EUV/DUV 支援）|
| 設備工程師 | ⚪ 支援 | 微影 / 蝕刻 / 薄膜工程師 |
| FAE | ⚪ 支援 | 客戶（NVIDIA 等）技術窗口 |

> 想深入了解 CoWoS 技術本身？參見書庫中的《[CoWoS 技術精讀筆記](../../cowos/html/index.html)》
