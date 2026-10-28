# 自研晶片：AWS、微軟、Meta

自研加速器的比較，先看**誰能使用、支援什麼工作負載、需要哪套軟體**。雲端服務可以租用，不代表底層晶片能單獨採購；公司展示模型能跑，也不等於已用於正式服務。

本頁於 2026-10-28 查核下列官方公告。表內日期是公告當時的狀態，不把預告自動改成已交付。

## 三家的產品與使用邊界

| 平台 | 已查核的官方說法 | 選型時要確認 |
|---|---|---|
| AWS Trainium3／EC2 Trn3 UltraServers | AWS 於 2025-12-02 宣布正式提供（general availability），用於生成式 AI 訓練與推論 | 所在區域、配額、Neuron 支援的模型與算子，以及實際租用成本 |
| Microsoft Maia 200 | 微軟於 2026-01-26 發表推論加速器；公告稱已部署於 US Central，並提供 Maia SDK 預覽 | Azure 服務是否提供所需模型與容量；不能把基礎設施部署當成可任意租用裸晶片 |
| Meta MTIA | Meta 的內部加速器系列；各代的排序、推薦與生成式 AI 用途不同，見下節 | 不把 Meta 內部部署當成公開雲端採購選項 |

Trainium2、Maia 100 仍可作為歷史案例，但不能代表各家公司全部產品。廠商的成本或效能宣稱，也不能直接移植到另一個模型、精度或服務延遲要求。

## MTIA：推薦推論、訓練與生成式 AI 要分開

Meta 的 2024 年次世代 MTIA 公告，主要描述**排序與推薦廣告模型**。因此不能把當年的 MTIA v2 簡寫成「已擴展至 LLaMA 推論服務」。

Meta 於 2026-03-11 公告的新系列，則區分了以下狀態：

| 型號 | 公告當時的定位與狀態 |
|---|---|
| MTIA 300 | 已用於正式環境的排序與推薦模型訓練 |
| MTIA 400 | 面向生成式 AI；已完成實驗室測試，正往資料中心部署推進 |
| MTIA 450 | 針對生成式 AI 推論優化；計畫於 2027 年初大規模部署 |
| MTIA 500 | 延續生成式 AI 推論方向；計畫於 2027 年大規模部署 |

同一公告提到曾用 Llama 測試 MTIA；**測試、部署與大規模服務是不同證據**。閱讀後續新聞時，應確認更新的是哪一代、哪種模型與哪一階段。

## 用自己的工作負載比較

以下是工程評估順序，不是品牌排名：

1. 先確認模型能否正確執行，包括必要算子、精度與輸出品質。
2. 在相同輸入長度、輸出長度、併發與延遲目標下，量測吞吐和記憶體需求。
3. 加入移植、除錯、容量預留及營運成本，再比較每次合格結果的成本。

自研晶片可能改善特定工作負載的成本，也可能增加移植與服務綁定的成本。是否划算，要由這組測量回答。

## 資料來源

- [AWS：EC2 Trn3 UltraServers 正式提供](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/)（2025-12-02）。
- [Microsoft：Maia 200](https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/)（2026-01-26）。
- [Meta：次世代 MTIA](https://ai.meta.com/blog/next-generation-meta-training-inference-accelerator-AI-MTIA/)（2024-04-10）。
- [Meta：MTIA 300、400、450、500](https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/)（2026-03-11）。

## 延伸閱讀

- [加速器取捨總覽](tradeoffs.md)
- [Google TPU v5p](tpu-v5p.md)