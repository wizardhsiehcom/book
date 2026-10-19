# 製程節點總覽

台積電的技術製程以「奈米節點」命名，數字越小代表電晶體越密集，效能越高、功耗越低。

---

## 製程節點演進

```mermaid
flowchart LR
    A["180nm<br/>1990s"] --> B["90nm<br/>2004"]
    B --> C["65nm<br/>2006"]
    C --> D["40/45nm<br/>2009"]
    D --> E["28nm<br/>2011<br/>長青製程"]
    E --> F["16/12nm<br/>FinFET<br/>2015"]
    F --> G["7nm<br/>2018"]
    G --> H["5nm<br/>2020"]
    H --> I["3nm<br/>2022<br/>FinFlex"]
    I --> J["2nm<br/>2025<br/>GAA NSFET"]
    J --> K["A14<br/>2028 預定"]
```

---

## 各製程節點特性

### 28nm — 「長青製程」

28nm 是台積電歷史上最重要的節點之一：

- 成本與效能平衡點最佳
- 至今仍大量用於 MCU、電源管理、顯示驅動 IC

### 16nm FinFET

導入立體電晶體結構（FinFET），相比平面電晶體大幅降低漏電流，是行動處理器的主力製程。

### 7nm 與 EUV

- 最初的 N7（2018）未使用 EUV；N7+ 在 2019 年第二季量產，台積電稱其為業界第一個商用 EUV 製程
- 主要客戶：Apple A12、AMD EPYC、Huawei Kirin（後因出口管制停供）

### 5nm（N5）

- 台積電稱邏輯密度約為 7nm 的 1.8 倍
- Apple A14、M1 系列晶片採用此節點

### 3nm（N3/N3E）

- 導入「FinFlex」架構，允許設計師在同一晶片混用不同電晶體配置
- Apple A17 Pro、M3 系列採用

### 2nm（N2）

- 重大架構轉變：從 FinFET 改為 **GAA NSFET**（Gate-All-Around Nanosheet）
- 2025 年量產（20-F）
- 顯著改善電晶體控制能力，降低功耗

---

## 製程選擇考量

```mermaid
flowchart TD
    Q{"設計需求"}
    Q --> |"最高效能 / 最新 AI"| N2["2nm / 3nm"]
    Q --> |"行動裝置 SoC"| N5["5nm / 3nm"]
    Q --> |"成本敏感 / 成熟應用"| N28["28nm / 16nm"]
    Q --> |"汽車 / 工業"| NSpec["特殊製程<br/>（BCD、SiGe、GaN）"]
```

---

→ 延伸閱讀：[先進封裝](05-advanced-packaging.md)、[技術路線圖](06-roadmap.md)

## 資料來源

- N7+ 與 EUV：[TSMC 新聞稿（2019-10）](https://pr.tsmc.com/english/news/2010)
- N2 量產：[TSMC 2025 Form 20-F](https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm)
