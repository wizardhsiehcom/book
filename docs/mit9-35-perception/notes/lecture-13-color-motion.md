---
title: 第十三章閱讀筆記
---

## 基本資料
- **Lecture Number**: 13
- **Title**: Color Perception (cont'd), Motion Perception
- **Transcript Path**: `/Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/13： Color Perception (cont'd), Motion Perception [Aave3OyCGPc].txt`
- **Reading Date**: 2026-07-06
- **Status**: 待定

## 逐字稿完整閱讀紀錄
- **Start**: 0 bytes
- **End**: 75,238 bytes
- **Complete reading confirmed**: Yes
- **Skipped sections**: None

## 本講主問題
本講為兩大主題的過渡：前半段總結顏色知覺，探討視覺系統如何將抵達眼睛的混合光譜拆解為物體反射率與環境光照（顏色恆常性），並分析顏色與形狀知覺的交互作用與相關的視覺異常。後半段進入運動知覺，探討視覺系統如何在神經元層次上偵測時空中的變化，以及如何透過兩階段模型解決局部運動偵測的歧義性（孔徑問題）。

## 核心概念

| 概念 | 解釋 | 處理方式 |
|---|---|---|
| 顏色恆常性 (Color Constancy) | 物體表面的顏色感知即使在不同光譜的光源下也能保持穩定，這是視覺系統根據對光照的推論所做的補償（解決 Ill-posed problem）。 | 獨立小節，對應於上章的亮度恆常性。 |
| 先驗與光照推論 (Illumination Priors) | 視覺系統對於環境光源的假設會影響最終顏色的推論。 | 透過「藍黑/白金洋裝」爭議與作息時間（貓頭鷹vs.雲雀）的關聯來解釋。 |
| 顏色與形狀的交互作用 | 顏色系統的空間解析度較低，但並非與形狀完全獨立，可以輔助輪廓分組（Contour grouping）與根據陰影推斷形狀（Shape from shading）。 | 列舉現象：Isoluminant images 難以看清形狀與運動，以及 McCullogh 效應（顏色與方向結合的後效）。 |
| 顏色視覺異常 | 包含視網膜層次的色盲（Dicromacy，缺少特定視錐細胞）與大腦皮質損傷導致的全色盲（Achromatopsia，V4 附近受損）。 | 建立表格或分類比較周邊與中樞神經的顏色異常。 |
| 運動偵測基礎模型 | Reichardt 偵測器利用空間位移加上時間延遲的重合偵測（Coincidence detector）來判斷運動方向；這在數學上等同於「時空中的方向性」（Orientation in spacetime）。 | 結合 Spike-triggered average 的現象解釋運動偵測的底層邏輯。 |
| 孔徑問題與約束線 (Constraint Line) | 具有方向性的局部運動偵測器只能測量垂直於其方向的速度分量，在速度空間中形成一條「約束線」。 | 配合速度空間（Velocity space）圖解概念。 |
| 交集約束 (Intersection of Constraints, IOC) | 結合多個不同方向的約束線，其交點即為物體真正的 2D 運動速度。 | 運動知覺雙階段模型的核心演算法。 |
| 雙階段運動模型 (V1 to MT) | 階段一：V1 神經元分解出局部 1D 運動分量；階段二：MT 神經元利用交集約束計算出整體的 2D 運動（如 Plaid 錯覺）。 | 作為運動知覺的總結，並強調皮質區域的分工（MT區）。 |

## 重要細節
- **Definitions**: 
  - Metamers（同色異譜）：物理上不同的光譜因為三色覺機制的降維而產生相同的顏色感知。
  - Dichromacy（二色覺）：缺少一種視錐細胞，分 Protanopia, Deuteranopia, Tritanopia。
- **Mechanisms**: 
  - Reichardt Detector：需要 Delay 與 Coincidence (AND function)。
  - MT區特徵：屬於背側視覺路徑（Dorsal stream），約 95% 神經元對運動方向具選擇性。
- **Experiments / Demos**:
  - 藍黃棋盤格子錯覺：物理上皆為灰色，因受整體光照推論影響而顯現為藍/黃色。
  - 洋紅色卡片展示：一張折疊卡片一面洋紅一面白，透過閉起一隻眼睛反轉 3D 深度推論，會改變對反射光的顏色歸因（原本認為白面反光，反轉後看成粉紅色）。
  - "The Dress" (2015)：藍黑 vs 白金洋裝，實驗顯示認為是自然光的人（或是早起的雲雀型）容易看成白金，認為是人工光的人（貓頭鷹型）容易看成藍黑。
  - McCullogh Effect：交替觀看綠黑/紅黑的特定方向條紋，產生的顏色與方向綁定的長期後效。
  - Plaid 刺激：將水平與垂直漂移的正弦波光柵疊加，V1 會分離這兩個成分，但我們（MT區）會看到單一斜向移動的格子。
  - 運動後效（Motion Aftereffect）：盯著旋轉螺旋看一分鐘，再看人臉會覺得人臉在擴張/收縮。證明了方向選擇性神經元的群體編碼（Population code）。

## 現象與機制
- **顏色恆常性 (Color Constancy)**:
  - **基礎**: 視網膜吸收的光譜 = 光源光譜 × 物體反射率。
  - **機制**: 大腦必須透過場景內的線索或先驗知識推論光源光譜，並將其扣除（discount the illuminant）。
  - **關聯**: 類似 lightness constancy。
- **Reichardt Detector (運動偵測)**:
  - **基礎**: 需要偵測同一物體在不同時間出現在不同位置。
  - **機制**: 兩個相鄰感受野，其中一個有時間延遲，匯聚到 AND 邏輯閘。若物體運動速度與延遲匹配，則激發。
- **Intersection of Constraints (交集約束模型)**:
  - **基礎**: 局部孔徑問題（Aperture Problem）。
  - **機制**: 每個 V1 神經元提供速度空間中的一條約束線，MT 神經元計算多條約束線的交點。

## 與前後章的連結
- **Prior Chapter**: 第十二章（顏色知覺上），本章是其延續，延續了 Trichromacy 造成 Metamers 以及 Opponency 等概念，並從 Brightness Constancy 延伸到 Color Constancy。
- **Next Chapter**: 第十四章將會繼續深入討論運動知覺的進階機制（如光流、自我運動等），本章建立了 V1-MT 雙階段模型的基礎。

## 相關材料
- 待補：課堂投影片中的圖表（如 The Dress 光照示意圖、Velocity Space 約束線圖、Plaid 組合圖）。
- 待補：Reichardt Detector 的電路圖與 Spike-triggered average 的時空影片。

## 外部補充
