---
title: "Lecture 16: Depth Perception (cont'd) 閱讀筆記"
---

# 閱讀筆記：Lecture 16: Depth Perception (cont'd)

## 基本資料
- **Lecture Number:** 16
- **Title:** Depth Perception (cont'd)
- **Transcript Path:** `/Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/16： Depth Perception (cont'd) [ZF7oiSWipB0].txt`
- **Reading Date:** 2026-07-06
- **Reader:** AI Assistant
- **Status:** Done

## 逐字稿完整閱讀紀錄
- **Start offset:** 0
- **End offset:** 68235
- **Complete reading confirmed:** Yes, the entire transcript was read.
- **Skipped sections:** None.

## 本講主問題
本講接續探討單眼深度線索（形狀來自陰影、艾默特定律、不可能的圖形與凹臉錯覺），並重點轉向雙眼立體視覺（Binocular Stereopsis）。主要解釋大腦如何利用雙眼視差（Binocular Disparity）進行極高精度的深度感知，探討對應問題（Correspondence problem），以及立體視覺的發展、神經基礎與雙眼競爭（Binocular rivalry）現象。

## 核心概念

| 概念 | 說明 | 處理方式 |
| --- | --- | --- |
| **局部深度推論與不可能的圖形 (Local Inference & Impossible Objects)** | 大腦傾向在局部區域推論深度，不強制要求全域一致性。這導致了艾雪的無限樓梯等不可能圖形的錯覺。 | 於「機制與現象」中舉例並解釋大腦局部推論的特性。 |
| **凹臉錯覺與運動-深度連結 (Hollow Face Illusion & Motion-Depth Coupling)** | 強烈的凸面臉孔先驗知識會覆蓋實際的凹陷深度。由於感知深度錯誤，當物體旋轉時，大腦會推論出反向的旋轉運動。 | 獨立小節探討深度與運動如何相互影響（結合香檳鐵絲網格展示）。 |
| **雙眼視差 (Binocular Disparity)** | 雙眼位於不同位置，獲得略微不同的影像。網膜對應點差異提供高精確度的相對深度資訊（交叉視差與非交叉視差）。 | 為雙眼視覺核心基礎，詳細定義與圖解（Horopter）。 |
| **對應問題與隨機點立體圖 (Correspondence Problem & RDS)** | 大腦如何匹配左右眼影像的相同點？隨機點立體圖證明立體匹配發生在形狀與物件辨識「之前」。 | 強調 Bela Julesz 的貢獻與粗到細（Coarse-to-fine）的匹配策略。 |
| **雙眼競爭與光澤感 (Binocular Rivalry & Luster)** | 左右眼影像差異過大無法融合時，感知會交替出現。若亮度有差異則產生金屬光澤感。 | 列為雙眼視覺的特殊現象，並指出其與意識研究的關聯。 |
| **立體視覺的神經基礎與發展 (Neural Basis & Development)** | V1 皮質開始出現同時接收雙眼輸入並對視差敏感的神經元。立體視覺有六歲前的關鍵期，未矯正的斜視會導致弱視與立體盲。 | 獨立小節講述 LGN 至 V1 的路徑及關鍵期的影響。 |

## 重要細節
- **Definitions:**
  - **Horopter (Vieth-Müller Circle):** 3D 空間中所有投影至網膜對應點（零視差）的點所構成的軌跡。
  - **Panum's fusional area:** Horopter 前後的一個微小區域，在此區域內的物體會被融合成單一影像；之外的物體會產生雙重影像（Double vision/Diplopia）。
  - **Crossed vs. Uncrossed disparity:** 較近的物體產生交叉視差（負），較遠的物體產生非交叉視差（正）。
  - **Stereoblindness:** 立體盲，約有 5% 的人無法使用雙眼視差感知深度。
- **Mechanisms:**
  - **Coarse-to-fine strategy:** 大腦可能先匹配低空間頻率特徵以減少匹配組合，再匹配高頻細節，藉此解決對應問題。
- **Experiments / Demos:**
  - 雙眼/單眼手指觸碰實驗：證明雙眼視覺在精確相對深度（如 1 公尺處分辨 1 毫米差異）的絕對優勢。
  - 香檳軟木塞鐵絲網格（Wireframe Necker Cube）：單眼觀看等待深度反轉後轉動，會看到不合理的變形與反向旋轉。
  - 立體鏡（Stereoscope）與紅藍立體圖（Anaglyph）：使用濾片或偏光鏡讓左右眼接收不同影像以重現視差。
- **Psychophysical Data:**
  - 人類能在 1 公尺的距離外分辨 1 毫米的深度差異，其產生的視差甚至小於視網膜上單一感光細胞的直徑。
- **Lecturer Examples:**
  - 食肉動物（前方雙眼，視角窄，具深度判斷優勢）vs. 食草動物（側邊雙眼，全景視野以防禦）。
  - 壁紙錯覺（Wallpaper illusion）與自動立體圖（Autostereogram / Magic Eye）。

## 現象與機制
1. **不可能的圖形 (Impossible Objects):**
   - **現象:** 艾雪的畫作或不可能的三叉戟，乍看合理，細看則物理上不可能。
   - **機制:** 大腦只對局部區域進行 3D 模型建構，而不去要求整個視野的 3D 全域一致性（Global consistency）。
2. **凹臉錯覺與鐵絲網反轉 (Hollow Face / Wireframe reversal):**
   - **現象:** 凹進去的面具看起來是凸出的；旋轉時看起來朝反方向轉。
   - **機制:** 深度推論與 3D 運動推論強烈耦合。強大的「先驗（Prior）」迫使深度被錯估，為了符合投影的幾何變化，大腦只好推論出錯誤且非剛性的運動方向。
3. **隨機點立體圖 (Random Dot Stereogram, RDS):**
   - **現象:** 兩張看起來像雜訊的圖片，單獨看沒有形狀，戴上紅藍眼鏡融合後會浮現一個方形。
   - **機制:** 證明大腦不需要先辨識出物體或形狀，就能利用底層的像素級視差計算深度。

## 與前後章的連結
- **前章連結:**
  - 延續第 15 章的單眼深度線索（Monocular cues）、艾默特定律（Emmert's law）以及形狀來自陰影（Shape from shading）。
  - 回呼運動知覺章節（Motion perception）中深度的雙穩態（Bistability，例如點陣球體旋轉方向改變時，深度也會隨之改變）。
- **後章連結:**
  - 雙眼競爭（Binocular rivalry）現象是後續討論視覺意識（Visual awareness / Consciousness）研究的重要工具（例如 Nancy Kanwisher 的研究）。
- **術語統一:**
  - 雙穩態 (Bistability), 網膜對應點 (Corresponding retinal points), 交叉視差/非交叉視差 (Crossed/Uncrossed disparity)。

## 相關材料
- [待補] 香檳鐵絲網格的照片或圖示。
- [待補] 隨機點立體圖 (RDS) 的範例圖。
- [待補] Horopter 與交叉/非交叉視差的光學幾何示意圖。
- [待補] V1 視差選擇神經元的響應曲線圖。

## 外部補充
（本階段留白）
