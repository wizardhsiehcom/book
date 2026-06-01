# 術語表

CoWoS 技術涉及大量縮寫與專業術語，本頁提供快速查閱。

## 封裝技術

| 術語 | 全名 | 說明 |
|------|------|------|
| CoWoS | Chip-on-Wafer-on-Substrate | TSMC 2.5D 先進封裝技術 |
| CoWoS-S | CoWoS with Silicon Interposer | 使用全矽中介板，最高效能 |
| CoWoS-R | CoWoS with RDL Interposer | 使用有機 RDL 中介板，成本較低 |
| CoWoS-L | CoWoS with Local Silicon | 局部矽橋接嵌入有機基板 |
| EMIB | Embedded Multi-die Interconnect Bridge | Intel 局部矽橋接技術 |
| Foveros | — | Intel 3D 晶片堆疊技術 |
| I-Cube | — | 三星 2.5D 封裝技術系列 |
| FOCoS | Fan-Out Chip-on-Substrate | 日月光先進封裝技術 |
| SoIC | System-on-Integrated-Chips | TSMC 3D 晶片堆疊技術 |
| InFO | Integrated Fan-Out | TSMC 扇出型封裝 |

## 基礎元件

| 術語 | 全名 | 說明 |
|------|------|------|
| TSV | Through-Silicon Via | 矽穿孔，垂直互連 |
| RDL | Redistribution Layer | 再分佈層，細間距金屬路由 |
| CTE | Coefficient of Thermal Expansion | 熱膨脹係數（ppm/°C） |
| KOZ | Keep-Out Zone | TSV 周圍電晶體禁止區 |
| Underfill | — | 填充 Die 下方空間的環氧樹脂，分散應力 |
| C4 Bump | Controlled Collapse Chip Connection | 覆晶接合凸塊（~130 μm 間距） |
| Micro Bump | — | 細間距凸塊（~55 μm），HBM↔中介板 |
| BGA | Ball Grid Array | 封裝底部焊球陣列，接主機板 |

## 記憶體

| 術語 | 全名 | 說明 |
|------|------|------|
| HBM | High Bandwidth Memory | 高頻寬記憶體，垂直堆疊 DRAM |
| HBM2 / HBM2e / HBM3 / HBM3e | — | HBM 世代，頻寬依序提升 |
| Base Die | — | HBM 堆疊最底層，含控制器與 PHY |
| GDDR | Graphics Double Data Rate | 傳統顯示記憶體（非堆疊） |

## 製程與設計

| 術語 | 全名 | 說明 |
|------|------|------|
| Chiplet | — | 可異質整合的功能晶片小方塊 |
| Heterogeneous Integration | — | 異質整合，不同製程節點的晶片組合 |
| Flip Chip | — | 覆晶接合，Die 倒置焊於基板 |
| Hybrid Bonding | — | 混合接合，銅對銅直接接合（無凸塊） |
| Aspect Ratio | — | TSV 深寬比（深度 / 直徑） |
| Warpage | — | 翹曲，封裝平整度偏差 |
| Yield | — | 製造良率 |
| Mask Stitching | — | 光罩拼接，擴大中介板面積的技術 |

## 效能指標

| 術語 | 說明 |
|------|------|
| Memory Bandwidth | 記憶體頻寬（GB/s 或 TB/s） |
| Memory Wall | 計算速度遠超記憶體供料速度的瓶頸 |
| Arithmetic Intensity | 算術強度（FLOPS/Byte），判斷計算 vs 頻寬瓶頸 |
| TFLOPS | 每秒兆次浮點運算 |
| pJ/bit | 每 bit 傳輸能耗，功耗效率指標 |
