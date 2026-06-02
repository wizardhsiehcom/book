# 上下游供應鏈

台積電是全球半導體供應鏈的核心節點，上游仰賴高度集中的設備與材料供應商，下游則連接全球 IC 設計生態系。

---

## 供應鏈全貌

```mermaid
flowchart TD
    subgraph "上游：設備"
        EQ1["ASML（荷蘭）<br/>EUV / DUV 曝光機<br/>全球唯一 EUV 供應商"]
        EQ2["Applied Materials（美）<br/>薄膜沉積、蝕刻"]
        EQ3["Lam Research（美）<br/>蝕刻、清洗"]
        EQ4["KLA（美）<br/>量測、缺陷檢測"]
        EQ5["東京威力科創（日）<br/>蝕刻設備"]
    end
    subgraph "上游：材料"
        MT1["信越化工 / SUMCO（日）<br/>矽晶圓"]
        MT2["JSR / Shin-Etsu（日）<br/>光阻劑（Photoresist）"]
        MT3["Air Products / 大陽日酸<br/>特殊氣體"]
        MT4["Entegris（美）<br/>化學品純化與容器"]
    end
    subgraph "台積電"
        TSMC["台積電<br/>晶圓製造"]
    end
    subgraph "下游：封測"
        PKG1["日月光 ASE<br/>全球最大封測廠"]
        PKG2["矽品 SPIL"]
        PKG3["京元電子、頎邦"]
    end
    subgraph "下游：IC 設計"
        IC["Apple / NVIDIA / AMD<br/>Qualcomm / MediaTek<br/>各大 Fabless 設計公司"]
    end

    EQ1 --> TSMC
    EQ2 --> TSMC
    EQ3 --> TSMC
    EQ4 --> TSMC
    MT1 --> TSMC
    MT2 --> TSMC
    MT3 --> TSMC
    TSMC --> PKG1
    TSMC --> PKG2
    IC -- "設計圖（GDSII）" --> TSMC
```

---

## ASML 的關鍵地位

EUV（極紫外光）微影設備是 7nm 以下製程的必要條件，而 ASML 是全球唯一能製造 EUV 機台的公司。一台 EUV 機台售價超過 1 億美元，交期長達數年，形成極高的供應鏈風險。

```mermaid
flowchart LR
    ASML["ASML<br/>全球唯一 EUV 供應商"]
    ASML --> TSMC["台積電"]
    ASML --> SAM["三星"]
    ASML --> INTEL["Intel"]
    ASML -. "出口管制：無法出貨" .-> CHINA["中國晶圓廠<br/>（中芯 SMIC 等）"]
```

---

## 台灣半導體聚落優勢

台積電能夠高效運作，很大程度上仰賴台灣本土形成的完整半導體聚落：

| 環節 | 台灣代表企業 |
|------|-------------|
| 矽晶圓 | 環球晶（GlobalWafers） |
| 光罩 | 台灣光罩 |
| 封測 | 日月光、矽品、頎邦 |
| PCB / 基板 | 南亞科、台光電子 |
| 設備維修 | 漢民科技等代理商 |

---

→ 延伸閱讀：[廠區分布](07-fabs.md)、[地緣政治](11-geopolitics.md)
