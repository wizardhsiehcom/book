# CoWoS-R 與 CoWoS-L：有機與局部矽版本

CoWoS-S 效能卓越但成本高昂。TSMC 推出 CoWoS-R 與 CoWoS-L 以滿足成本敏感市場，同時保留 CoWoS 平台的生態系統優勢。

## CoWoS-R（RDL Interposer）

「R」代表 RDL-only，使用**有機再分佈層**取代矽中介板：

- **材料**：有機基板 + 精細 RDL（無矽基板）
- **線寬**：2–5 μm（比 CoWoS-S 的 0.4–2 μm 大）
- **成本**：比 CoWoS-S 低 30–50%（無需晶圓廠製造中介板）
- **限制**：互連密度較低，不適合需要極高頻寬的 HBM 配置

```mermaid
flowchart TB
    subgraph "CoWoS-S"
        S_D["Die（GPU + HBM）"]
        S_I["矽中介板<br/>RDL 0.4–2 μm + TSV"]
        S_B["封裝基板"]
        S_D --> S_I --> S_B
    end
    subgraph "CoWoS-R"
        R_D["Die（GPU + HBM）"]
        R_I["有機 RDL 中介板<br/>RDL 2–5 μm（無 TSV）"]
        R_B["封裝基板"]
        R_D --> R_I --> R_B
    end
```

## CoWoS-L（Local Silicon Interposer）

「L」代表 Local Silicon，是**混合方案**：

- 在有機基板中嵌入**局部矽橋接片（Local Silicon Interposer）**
- 矽橋接片只覆蓋 Die-to-Die 的互連區域，不需要全面積矽中介板
- 兼顧高密度 Die-to-Die 互連（矽橋接）與低成本基板（有機）

這個概念類似 Intel 的 EMIB（Embedded Multi-die Interconnect Bridge）。

```mermaid
flowchart TB
    D1["Die A"] & D2["Die B"]
    subgraph "有機基板"
        BR["局部矽橋接<br/>Local Si Bridge<br/>僅覆蓋互連區域"]
        ORG["其餘區域：有機 RDL"]
    end
    D1 & D2 --> BR
    D1 & D2 --> ORG
```

## 三種變體的比較

| 特性 | CoWoS-S | CoWoS-L | CoWoS-R |
|------|---------|---------|---------|
| 中介板類型 | 全矽 | 局部矽嵌入有機 | 全有機 RDL |
| 線寬（最細） | 0.4 μm | 0.4 μm（橋接區） | 2 μm |
| CTE 匹配 | 優秀 | 良好 | 較差 |
| 成本（相對） | 高 | 中 | 低 |
| HBM 支援 | 旗艦（8+ 顆） | 中階 | 基礎（2–4 顆） |
| 代表產品 | H100、MI300X | 次世代中階 AI 卡 | 成本敏感 AI 推論 |

## 選擇邏輯

```mermaid
flowchart TD
    Q1{"需要極高<br/>Die-to-Die 頻寬？"}
    Q1 -->|"是"| S["CoWoS-S<br/>HPC / AI 旗艦"]
    Q1 -->|"否"| Q2{"需要部分<br/>高密度互連？"}
    Q2 -->|"是"| L["CoWoS-L<br/>中階 AI / 網路"]
    Q2 -->|"否"| R["CoWoS-R<br/>成本優先"]
```

> 相關：[CoWoS 架構總覽](04-cowos-overview.md) | [競爭技術比較](09-competing-technologies.md)
