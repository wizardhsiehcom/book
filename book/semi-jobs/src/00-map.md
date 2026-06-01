# 產業全貌地圖

## 台灣半導體產業生態系

```mermaid
flowchart TD
    subgraph "客戶端 Customer"
        APP["Apple / NVIDIA / AMD<br/>Qualcomm / Google"]
    end

    subgraph "IC 設計 Fabless"
        MTK["MediaTek 聯發科<br/>手機 SoC / AI / 5G"]
        NVT["Novatek 聯詠<br/>顯示驅動 IC"]
        RTK["Realtek 瑞昱<br/>網路 / 音訊 IC"]
    end

    subgraph "晶圓代工 Foundry"
        TSMC["TSMC 台積電<br/>N3 / N5 / N7 / N28"]
        UMC["UMC 聯電<br/>N28 / N40 成熟製程"]
    end

    subgraph "先進封裝"
        PKG["TSMC CoWoS / InFO<br/>ASE 日月光<br/>Powertech 力成"]
    end

    subgraph "設備 & 材料"
        ASML["ASML EUV/DUV 掃描機"]
        AMAT["Applied Materials<br/>Lam / KLA / TEL"]
    end

    APP --> MTK & NVT & RTK
    MTK & NVT & RTK -->|"Tape-out GDS"| TSMC & UMC
    TSMC -->|"晶圓"| PKG
    ASML & AMAT -->|"設備 + 製程支援"| TSMC & UMC
```

## 職務分布與人數（估計）

| 環節 | 代表公司 | 主要職務 | 人數規模 |
|------|---------|---------|---------|
| Fabless 設計 | MediaTek、Novatek、Realtek | IC Design、Verification、DFT | ~3–5 萬 |
| 晶圓代工 | TSMC（83,825人）、UMC | Process、Equipment、Integration、Yield | ~10 萬+ |
| OSAT 封測 | ASE（65,695人）、Powertech | Package、Test、QA | ~8 萬+ |
| 設備商 | ASML、AMAT、Lam、KLA | AE、FAE、Field Service | ~1–2 萬 |
| EDA/IP | Synopsys、Cadence、ARM | EDA Engineer、PDK | ~3,000 |

## 職務技能樹

```mermaid
flowchart LR
    subgraph "設計類"
        IC["IC Design<br/>RTL / 電路"]
        VER["Verification<br/>UVM / 功能驗證"]
        DFT["DFT<br/>可測試性設計"]
        LAY["Layout<br/>實體設計"]
        EDA["EDA / CAD / PDK"]
    end

    subgraph "製程類"
        PHO["Photo<br/>微影"]
        ETC["Etch<br/>蝕刻"]
        DEP["Deposition<br/>薄膜"]
        CMP["CMP<br/>化學機械研磨"]
        INT["Integration<br/>製程整合"]
    end

    subgraph "設備"
        EQP["Equipment<br/>設備工程師"]
        FAC["Facilities<br/>廠務"]
    end

    subgraph "品質 & 封測"
        QA["QA / Reliability<br/>FA"]
        PKG2["Package / Test"]
    end

    subgraph "其他"
        FAE2["FAE / AE"]
        IE["IE 工業工程"]
        AI["AI / Software"]
    end
```

## 薪資排名速覽（2024，年總酬勞 TWD）

| 排名 | 職務 | 新鮮人 | 資深（5–8 年） |
|-----|------|--------|-------------|
| 🥇 | IC Design（NVIDIA/Qualcomm TW） | 180–250萬 | 400–700萬 |
| 🥇 | IC Design（MediaTek） | 140–180萬 | 350–500萬 |
| 🥈 | ASML Application Engineer | 150–250萬 | 300–500萬 |
| 🥈 | EDA/CAD（MediaTek DM） | 120–150萬 | 200–400萬 |
| 🥉 | TSMC 先進封裝工程師 | 100–150萬 | 200–450萬 |
| 🥉 | Verification / DFT | 100–160萬 | 200–400萬 |
| — | TSMC 製程工程師 | 80–110萬 | 150–250萬 |
| — | 設備工程師（TSMC） | 70–100萬 | 120–200萬 |
| — | 封裝測試（ASE） | 70–100萬 | 120–200萬 |

> 詳細薪資比較見 [附錄：薪資全覽](appendix-salary.md)
