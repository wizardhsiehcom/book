# 18: Object Recognition (cont'd), Texture Perception

## 基本資料
- Lecture Number: 18
- Title: Object Recognition (cont'd), Texture Perception
- Transcript Path: /Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/18： Object Recognition (cont'd), Texture Perception [q-ukGIZt3Do].txt
- Reading Date: 2026-07-06
- Reader: AI Assistant
- Status: Completed

## 逐字稿完整閱讀紀錄
- Start: `Uh today we're going to wrap up talking about object recognition and get into texture recognition.`
- End: `And when we come back on Tuesday, I will tell you whether they do. [snorts] Okay?`
- Complete reading confirmed: Yes
- Skipped sections: None

## 本講主問題
本講旨在收尾物體辨識的議題，並開啟新的紋理知覺主題。在物體辨識部分，探討了大腦是否擁有針對特定類別（如面孔）的專門處理機制，並介紹如何利用表徵相異性矩陣（RDM）和人工卷積神經網路（CNN）作為模型來理解大腦腹側流的階層表徵。在紋理知覺部分，探討了大腦如何利用局部平均統計特徵（如空間頻率的能量）來區分不同的紋理，並介紹了透過直方圖均衡化進行的紋理合成技術作為檢驗紋理模型的手段。

## 核心概念

| Concept | Explanation | How to handle in chapter |
| :--- | :--- | :--- |
| 面孔辨識的專門化 | 大腦有專門處理面孔的模組，包含專屬腦區（FFA）、面孔失認症，且面孔辨識具有強烈的倒置效應。 | 作為物體辨識的特例，詳細解釋四項證據（fMRI、倒置效應、腦傷、個體差異）。 |
| Thatcher Illusion (柴契爾錯覺) | 一種視覺錯覺，展示了面孔倒置效應。當整張臉倒置時，人們難以察覺局部五官的顛倒，反映大腦處理正立面孔高度依賴整體配置。 | 獨立列於現象與機制，解釋其背後的視覺原理。 |
| 表徵相異性矩陣 (RDM) | 透過測量多體素對大量刺激的反應相關性，建構出不同物體在神經表徵空間中的相異度，用於觀察大腦的類別分群與跨物種比較。 | 說明其計算方式（1-correlation）與應用（人類與猴子的表徵相似性）。 |
| 卷積神經網路 (CNN) 作為編碼模型 | 以訓練來進行物體辨識的 CNN 作為大腦模型，發現模型深淺層特徵能精確對應預測大腦（V1、V4、IT）的反應。 | 以圖表或獨立段落說明人工模型與生物大腦階層對應的「解釋變異量（Variance explained）」。 |
| 紋理知覺與能量模型 | 紋理是由區域的平均統計特徵定義的。簡單的能量模型（將濾波器響應平方後在空間上平均）能預測人類對紋理邊界的感知。 | 引出紋理知覺的重要性（形狀、材質、分割），並解釋能量運算機制。 |
| 紋理合成 (Texture Synthesis) | 透過強制將隨機雜訊影像的濾波子頻帶（Subbands）直方圖匹配目標紋理，來合成影像。如果合成結果看起來像原紋理，代表該直方圖統計特徵正確捕捉了知覺表徵。 | 說明這是一種檢驗神經模型（如濾波響應分佈）是否完整的科學方法。 |

## 重要細節
- **Definitions**: 
  - **Representational Dissimilarity**: 1 減去大腦對兩張圖片反應的相關係數。
  - **Subbands**: 影像經過帶通濾波器（Band-pass filters，特定空間頻率與方向）卷積後的輸出。
  - **Encoding Model**: 將模型單元特徵進行線性組合，來預測大腦（神經元或fMRI體素）反應的模型。
- **Mechanisms**: 面孔處理模組（Fusiform Face Area）、紋理邊界的能量測量（Squared and averaged filter response）、直方圖均衡化（Histogram equalization）。
- **Experiments/Illusions/Demos**: Thatcher illusion（瑪格麗特·柴契爾的照片示範）、表徵相異性矩陣（顯示 Animate vs Inanimate 以及 Faces 的方塊對角線結構）、紋理邊界預測對比圖、直方圖匹配合成紋理的示範（留待下集揭曉結果）。
- **Psychophysical Data**: V4 被 CNN 中間層（Layer 2/3）預測得最好；IT 被深層（Layer 4）預測得最好。人類與獼猴的 RDM 高度相似。
- **Lecturer Examples**: 引用 Oliver Sacks 《錯把太太當帽子的人》書中類似的失認症案例（Dr. P），無法認出人臉，只能靠愛因斯坦的頭髮和鬍鬚認出畫像。
- **Q&A Highlights**: 
  - 學生問：CNN 面孔辨識系統也會有倒置效應嗎？教授回答：猜測會，因為機器的訓練數據與人類的演化/發育經驗類似，多數面孔都是正立的。
  - 學生問：改變 CNN 結構以符合大腦，還是改變訓練資料來讓模型更像大腦？教授回答：這是目前研究的熱門開放問題，兩者都有人在研究（Task/diet vs. Architectural constraints）。
- **Easy-to-miss reminders**: RDM 矩陣的對角線必然是藍色（相異度為0），因為是同一張圖片自己比自己；除了人臉，動物臉跟人臉的反應模式也很相似。

## 現象與機制
- **機制：面孔辨識的專門化模組**
  - Basis: 演化與訓練環境使大腦對面孔發展出獨立處理機制。
  - Evidence: fMRI的FFA區域、猴子的Face patches單細胞記錄。
  - Scope: 僅限於高度特化的重要視覺刺激。
  - Connections: 與失認症（Agnosia / Prosopagnosia）相連。
- **現象：柴契爾錯覺（Thatcher Illusion）**
  - Basis: 面孔倒置效應。
  - Evidence: 行為與知覺實驗。
  - Scope: 證明正立面孔依賴「整體結構（Holistic）」處理，而非單一特徵拼湊。
- **機制：表徵相異性矩陣（RDM）**
  - Basis: 將大腦區域對影像的反應視為高維度向量，計算距離/相關性。
  - Evidence: 呈現明顯的 block diagonal 結構（類別群聚）。
  - Connections: 解決了人類與獼猴解剖結構不同，難以直接比較的難題。
- **機制：紋理特徵的能量與直方圖匹配**
  - Basis: 紋理知覺依賴局部區域的平均統計量。
  - Evidence: 能量模型（平方加平均）能找出紋理邊界；以子頻帶直方圖均衡化進行紋理合成。

## 與前後章的連結
- **Prior chapter**: 延續了腹側流與線性分類器的討論。
- **Next chapter**: 將揭曉紋理合成出來的影像到底像不像目標紋理，繼續深入紋理知覺。
- **Terminology to unify**: Ventral visual stream (腹側視覺流), Fusiform Face Area (FFA, 梭狀回面孔區), Inversion effect (倒置效應), Prosopagnosia (面孔失認症), Representational Dissimilarity Matrix (RDM, 表徵相異性矩陣), Texture synthesis (紋理合成).

## 相關材料
- 待補 (Slides, visual demos of texture boundaries and Thatcher illusion)

## 外部補充
- (留白)
