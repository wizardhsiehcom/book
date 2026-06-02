# 公司概覽

NVIDIA 創立於 1993 年，由 Jensen Huang（黃仁勳）、Chris Malachowsky 與 Curtis Priem 共同創辦。最初以遊戲 GPU 起家，30 年後已成為全球 AI 基礎設施最關鍵的供應商。

## 公司定位

NVIDIA 是一家 **Fabless IC 設計公司**——自己設計晶片，但不擁有晶圓廠，全部委外製造。這個商業模式讓它能將資本集中在研發與軟體生態，而非動輒數千億的晶圓廠建置成本。

```mermaid
flowchart TD
    subgraph "NVIDIA（設計）"
        A["IC 設計<br/>架構研發"]
        B["CUDA 軟體<br/>生態系"]
        C["系統整合<br/>DGX / HGX"]
    end
    subgraph "供應鏈（製造）"
        D["台積電 TSMC<br/>晶圓代工"]
        E["CoWoS 先進封裝<br/>HBM 整合"]
        F["SK Hynix / Micron<br/>HBM 記憶體"]
    end
    A --> D
    D --> E
    E --> C
    F --> E
```

## 三大業務部門（FY2026）

| 部門 | 年營收 | 年增率 | 說明 |
|------|--------|--------|------|
| 資料中心 | ~$1,937 億美元 | +68% | AI 訓練與推理 GPU、網路 |
| 遊戲 | ~$247 億美元 | — | GeForce RTX 系列 |
| 專業視覺化 | ~$32 億美元 | +70% | Quadro / RTX 工作站 |
| 汽車與機器人 | ~$23 億美元 | +39% | 自駕與具身智慧 |

資料中心已佔總營收約 **90%**，NVIDIA 本質上已從遊戲 GPU 公司轉型為 AI 基礎設施公司。

## 時間軸

```mermaid
flowchart LR
    A["1993<br/>創立"] --> B["1999<br/>GeForce 256<br/>全球首顆 GPU"]
    B --> C["2006<br/>CUDA 發布<br/>通用運算開始"]
    C --> D["2016<br/>DGX-1<br/>AI 訓練系統"]
    D --> E["2022<br/>Hopper H100<br/>AI 爆炸期"]
    E --> F["2024<br/>Blackwell B200<br/>多晶片 GPU"]
    F --> G["2026<br/>Rubin 架構<br/>預計推出"]
```

## 與台積電的依賴關係

NVIDIA 所有高階 GPU 均由台積電以 4nm / 3nm 等先進製程代工。這種深度依賴既是優勢（專注設計）也是風險（地緣政治、產能分配）。台灣客戶（主要是供應鏈夥伴）佔 NVIDIA FY2026 總營收約 **19.6%**。
