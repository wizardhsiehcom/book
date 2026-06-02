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
    F --> G["7nm<br/>2018<br/>首個 EUV"]
    G --> H["5nm<br/>2020"]
    H --> I["3nm<br/>2022<br/>FinFlex"]
    I --> J["2nm<br/>2025<br/>GAA NSFET"]
    J --> K["A14<br/>2028+<br/>後矽路線"]
```

---

## 各製程節點特性

### 28nm — 「長青製程」

28nm 是台積電歷史上最重要的節點之一：

- 成本與效能平衡點最佳
- 至今仍大量用於 MCU、電源管理、顯示驅動 IC
- 台積電在中國設廠（南京廠）主要生產此節點

### 16nm FinFET

導入立體電晶體結構（FinFET），相比平面電晶體大幅降低漏電流，是行動處理器的主力製程。

### 7nm — EUV 時代開始

- 台積電是全球第一個大規模量產 EUV 光刻 7nm 的代工廠
- 主要客戶：Apple A12、AMD EPYC、Huawei Kirin（後因出口管制停供）

### 5nm（N5）

- 相比 7nm 邏輯密度提升約 80%
- Apple A14、M1 系列晶片採用此節點

### 3nm（N3/N3E）

- 導入「FinFlex」架構，允許設計師在同一晶片混用不同電晶體配置
- 電晶體密度超過每平方毫米 2 億個
- Apple A17 Pro、M3 系列採用

### 2nm（N2）

- 重大架構轉變：從 FinFET 改為 **GAA NSFET**（Gate-All-Around Nanosheet）
- 預計 2025 年量產，2026 年進入 N2P 增強版
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
