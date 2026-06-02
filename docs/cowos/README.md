# 導讀：為什麼工程師需要懂 CoWoS

2024 年，NVIDIA H100 GPU 的單顆封裝裡有 6 個 HBM3 堆疊和 1 個 GPU Die，總計超過 800 億顆電晶體——但這些晶片沒有直接焊在同一片矽上，而是透過一片面積超過 2500 mm² 的矽中介板互相連接。這就是 CoWoS。

當 AI 算力需求每年翻倍，單一晶片的製程微縮已無法追上，**先進封裝成為繼製程節點之後最重要的效能槓桿**。理解 CoWoS，就是理解當代 AI 硬體最關鍵的一層。

## 這本筆記的目標

1. 建立 2.5D 封裝的完整心智模型，從 TSV 到矽中介板到 CoWoS。
2. 了解 CoWoS-S、CoWoS-R、CoWoS-L 三個變體的設計取捨。
3. 理解 HBM 與 CoWoS 的協同設計邏輯。
4. 看清 CoWoS 在 AI 加速器（H100、MI300X、Gaudi）中扮演的具體角色。
5. 掌握競爭技術（三星 I-Cube、Intel EMIB）的差異定位。

## 建議閱讀路線

| 你的背景 | 建議起點 | 接著讀 |
|---------|---------|--------|
| 半導體製程工程師 | [TSV 基礎](02-tsv-basics.md) | [CoWoS-S](05-cowos-s.md)、[可靠性](10-reliability-manufacturing.md) |
| AI/系統架構工程師 | [為什麼需要先進封裝](01-why-advanced-packaging.md) | [HBM 整合](07-hbm-integration.md)、[AI 應用](08-cowos-ai-hpc.md) |
| 初學者 | [全書地圖](00-map.md) | 依章節順序 |

## 內容定位

本筆記以公開論文、TSMC 官方技術文件、IEEE ECTC 發表內容與教科書為基礎整理，不重現受版權保護的原文，僅提供原創概念整理與學習導引。詳見[學習資源與論文導讀](appendix-references.md)。
