# 術語表

CoWoS 技術涉及大量縮寫與專業術語，本頁提供快速查閱。

## 封裝平台與技術

| 術語 | 全名 | 說明 |
|------|------|------|
| CoWoS | Chip-on-Wafer-on-Substrate | TSMC 2.5D 先進封裝技術 |
| CoWoS-S | CoWoS with Silicon Interposer | 全矽中介板，實務上限約 3.3 倍光罩 |
| CoWoS-R | CoWoS with RDL Interposer | 全有機 RDL 中介層，無 TSV，成本最低 |
| CoWoS-L | CoWoS with Local Silicon Interconnect | 局部矽橋嵌入有機 RDL，**2026 年旗艦主力** |
| CoPoS | Chip-on-Panel-on-Substrate | TSMC 面板級封裝，載體由圓晶圓換為矩形面板 |
| SoIC | System on Integrated Chips | TSMC 混合鍵合 3D 堆疊平台（SoIC-X／SoIC-P） |
| SoW / SoW-X | System on Wafer | 整片晶圓當一個系統；SoW-X 為 CoWoS 基礎的 40 倍光罩版本 |
| InFO | Integrated Fan-Out | TSMC 扇出型封裝 |
| COUPE | Compact Universal Photonic Engine | TSMC 共封裝光學平台 |
| CoWoP | Chip-on-Wafer-on-PCB | SPIL 主導、省掉封裝基板的方案 |
| EMIB | Embedded Multi-die Interconnect Bridge | Intel 局部矽橋技術，CoWoS-L 的同源先行者 |
| EMIB-T | EMIB with TSV | 橋接片中加入 TSV 的 EMIB 版本 |
| Foveros | — | Intel 3D 堆疊家族；Foveros Direct 3D 為混合鍵合版本 |
| I-Cube / H-Cube | — | Samsung 2.5D 封裝系列 |
| X-Cube / SAINT | Samsung Advanced Interconnect Technology | Samsung 3D 堆疊與混合鍵合平台 |
| VIPack / FOCoS | Fan-Out Chip-on-Substrate | ASE 先進封裝平台；FOCoS-Bridge 為矽橋版本 |
| XDFOI | — | JCET 扇出型整合平台 |
| S-SWIFT / S-Connect | — | Amkor 扇出／2.5D 封裝家族 |

## 基礎元件與結構

| 術語 | 全名 | 說明 |
|------|------|------|
| TSV | Through-Silicon Via | 矽穿孔，垂直互連 |
| TGV | Through-Glass Via | 玻璃穿孔，玻璃基板上的對應技術 |
| RDL | Redistribution Layer | 再分佈層，細間距金屬路由 |
| LSI | Local Silicon Interconnect | CoWoS-L 中嵌入有機基板的局部矽橋 |
| Interposer | 中介板／中介層 | 夾在晶片與基板之間的高密度轉接板 |
| Base Die | — | HBM 堆疊最底層，含 PHY 與控制邏輯 |
| C4 Bump | Controlled Collapse Chip Connection | 覆晶凸塊，間距約 130–150 μm |
| Micro Bump | — | 細間距凸塊，HBM 到中介板約 40–55 μm |
| BGA | Ball Grid Array | 封裝底部焊球陣列，接主機板 |
| Underfill | 底部填充膠 | 填充 die 下方，分散應力；但導熱極差 |
| ABF | Ajinomoto Build-up Film | 味之素增層膜，封裝基板的關鍵材料 |
| IHS / Lid | Integrated Heat Spreader | 均熱片／蓋板 |
| TIM | Thermal Interface Material | 熱介面材料；TIM1 在 die 與蓋板之間 |
| IVR | Integrated Voltage Regulator | 整合式電壓調節器，提升垂直供電密度 |
| BSPDN | Backside Power Delivery Network | 背面供電網路，電源走晶圓背面 |

## 記憶體

| 術語 | 說明 |
|------|------|
| HBM | High Bandwidth Memory，垂直堆疊的高頻寬記憶體 |
| HBM3 / HBM3e | 1024-bit 介面世代；HBM3e 實際 pin 速率約 9.6 Gb/s |
| **HBM4** | **2048-bit 介面**（JESD270-4，2025-04 發布），最高 16-Hi、64 GB/堆疊 |
| HBM4E / HBM5 | 後續世代，規格與時程仍在變動 |
| Custom HBM | 客製化 HBM，base die 走先進邏輯製程（如 N3P） |
| 8-Hi / 12-Hi / 16-Hi | HBM 堆疊層數 |
| MR-MUF | Mass Reflow Molded Underfill，HBM 堆疊的主流接合方式 |
| GDDR | Graphics Double Data Rate，傳統顯示記憶體（非堆疊） |

## 互連與訊號

| 術語 | 說明 |
|------|------|
| UCIe | Universal Chiplet Interconnect Express，跨公司 chiplet 介面標準 |
| NV-HBI | NVIDIA High-Bandwidth Interface，Blackwell 雙 die 間的 10 TB/s 專有互連 |
| Infinity Fabric | AMD 的專有 die-to-die 互連 |
| SerDes | Serializer/Deserializer，序列高速介面 |
| pJ/bit | 每 bit 傳輸能耗，能效的核心指標 |
| IR Drop | 電流流經電阻造成的電壓降 |
| Crosstalk | 串音，相鄰線路間的耦合干擾 |
| CPO | Co-Packaged Optics，共封裝光學 |

## 製程與良率

| 術語 | 說明 |
|------|------|
| Reticle Limit | 光罩極限，單次曝光最大面積，約 26 × 33 mm = **858 mm²** |
| Reticle Multiple | 光罩倍數，描述封裝面積的標準單位（如「5.5 倍光罩」） |
| Mask Stitching | 光罩拼接，多次曝光接起來以超越光罩極限 |
| Hybrid Bonding | 混合鍵合，銅對銅直接接合，無凸塊 |
| CMP | Chemical Mechanical Polishing，化學機械研磨；混合鍵合的前置關鍵 |
| Chiplet | 可異質整合的功能晶片小方塊 |
| Heterogeneous Integration | 異質整合，不同製程節點的晶片組合 |
| Flip Chip | 覆晶接合，die 倒置焊於載體 |
| CTE | Coefficient of Thermal Expansion，熱膨脹係數（ppm/°C） |
| KOZ | Keep-Out Zone，TSV 周圍的電晶體禁止區 |
| Warpage | 翹曲，封裝平整度偏差 |
| Aspect Ratio | 深寬比（TSV 深度 / 直徑） |

## 測試

| 術語 | 說明 |
|------|------|
| KGD | Known Good Die，已知良品晶片 |
| DFT | Design for Test，可測試性設計 |
| BIST / MBIST | Built-In Self-Test，內建自我測試（MBIST 專測記憶體） |
| Boundary Scan | IEEE 1149.1（JTAG），檢查 die 間互連 |
| IEEE 1838 | 3D-IC 測試存取標準 |
| CP / FT / SLT | Chip Probe（晶圓測試）／Final Test（最終測試）／System-Level Test（系統級測試） |
| Binning | 分倉，依實際良率把同一顆 die 分成不同 SKU |
| Rework | 重工，拆換已接合的元件；2.5D 封裝上極其困難 |

## 效能與經濟

| 術語 | 說明 |
|------|------|
| Memory Wall | 記憶體牆，計算速度遠超記憶體供料速度 |
| Arithmetic Intensity | 算術強度（FLOPS/Byte），判斷計算 vs 頻寬瓶頸 |
| D₀ | 缺陷密度（個/cm²），良率模型的核心參數 |
| Yield Learning Curve | 良率學習曲線，量產時程的最大變數 |
| OSAT | Outsourced Semiconductor Assembly and Test，委外封測廠 |
| WPM | Wafers Per Month，月產能單位 |
