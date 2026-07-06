# 閱讀筆記：Lecture 14: Motion Perception (cont'd)

## 基本資料
- **Lecture Number**: 14
- **Title**: Motion Perception (cont'd)
- **Transcript Path**: `/Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/14： Motion Perception (cont'd) [ReKjU4ZUAjg].txt`
- **Reading Date**: 2026-07-06
- **Reader**: Assistant
- **Status**: Completed

## 逐字稿完整閱讀紀錄
- **Start**: byte 0
- **End**: byte 74648
- **Complete reading confirmed**: Yes
- **Skipped sections**: None

## 本講主問題
本講接續上一講的運動知覺，探討視覺系統如何將局部的 1D 運動訊號整合為整體的 2D 運動。主要解決以下問題：如何克服局部邊緣運動的模糊性（孔徑問題）？運動知覺如何與形狀、深度等高階特徵（如遮蔽、輪廓填補）緊密互動？視覺系統在面對模糊的運動訊號時，如何運用貝氏推論（Bayesian inference）結合「偏好慢速」的先驗機率來計算最可能的運動方向？此外，大腦如何利用光流（optic flow）感知自身運動，以及如何區分外在世界的運動與眼動（eye movements）引起的視網膜運動？

## 核心概念

| 概念 | 解釋 | 在章節中的處理方式 |
|---|---|---|
| 雙階段模型 (Two-stage model) | 視覺皮層對運動的處理分為兩階段：V1 負責偵測 1D 運動（局部成分），MT 負責將這些成分結合成 2D 的圖案運動（pattern motion）。 | 作為從局部到整體的運算基礎，透過格子圖案（plaid）實驗來說明。 |
| 孔徑問題 (Aperture problem) | 透過局部感受野觀察直線邊緣時，只能確知垂直於邊緣的運動分量，平行於邊緣的運動無法得知，導致真實運動方向模糊。 | 詳述其幾何原理，並介紹視覺系統依賴 2D 特徵（如角）及跨空間邊緣整合來解決此問題。 |
| 運動與形狀的交互作用 (Motion and Form) | 局部運動邊緣是否被整合，高度依賴於系統對場景深度的推論（如遮蔽效應、輪廓的模態/非模態填補與可關聯性）。 | 以實驗（加上遮蔽框架後兩條獨立移動的線段變成單一菱形的旋轉）展示背側與腹側路徑的深度互動。 |
| 由運動定義形狀 (Structure from Motion) | 單純的運動軌跡足以讓人類感知出複雜的 3D 形狀與動作，例如光點走路者（point-light walkers）與動態深度效應。 | 列舉經典現象，說明大腦傾向採用「剛體（rigid body）」的先驗預設來解釋運動。 |
| 運動知覺的貝氏推論 (Bayesian inference in motion) | 大腦在推論運動時結合了似然度（感覺證據）與先驗機率（假設世界上的物體傾向於低速運動）。當對比度降低（證據變模糊），先驗的影響力變大。 | 利用低對比度菱形看起來往對角線移動的錯覺，詳細解釋貝氏推論中先驗與似然度相乘產生後驗機率的機制。 |
| 光流與 MST 區 (Optic flow and MST) | 自身在環境中移動時在視網膜上產生的大面積運動模式。大腦（特別是 MST 區）能偵測這些模式，用於維持姿勢與導航。 | 舉例說明光流對身體姿勢的影響（移動房間實驗）。 |
| 排除眼球運動 (Discounting eye movements) | 區分「物體在動」還是「眼球在動」。實驗證據支持主要仰賴運動系統發給眼部肌肉的「運動指令副本（efference copy）」，而非本體感覺。 | 以「戳眼睛（poking eye）」的簡單實驗來證實本體感覺的作用有限。 |

## 重要細節
- **生理學與神經數據**：
  - **V1 neurons**：對格子圖案（plaid）的反應呈現雙峰（bilobed），顯示它們只對單一成分（component） grating 反應。
  - **MT neurons**：有部分神經元對 plaid 的反應呈現單峰，且方向與感知到的圖案（pattern）整體運動方向一致，支持交集限制（intersection of constraints）的運算。
  - **MST neurons**：MT 的下游，其神經元對光流圖案（如平面運動、旋轉、輻射狀縮放）有選擇性反應。
- **心理物理學與展示**：
  - **Plaid motion**：將兩個不同方向移動的弦波光柵疊加，人們會看到一個朝全新方向移動的格子圖案。
  - **Aperture problem example**：體育場的螺旋狀下坡坡道，人們直線走下坡道，但視覺上整個建築物看起來像在旋轉。
  - **Occlusion and grouping (Shiffrar & Lorenceau)**：四條被局部遮蔽的線段，若遮蔽物暗示它們屬於同一物件，且輪廓具有可關聯性（relatability），人們就會將其運動整合，視為一個在畫圓的菱形；若缺乏遮蔽線索，則視為四個獨立移動的線段。
  - **Bayesian rhombus illusion**：一個實際水平移動的瘦長菱形，當降低其對比度時，人們會覺得它在朝對角線往下方移動。這完美符合具有「低速先驗（prior favoring slow speeds）」的貝氏模型預測。
  - **Contrast and perceived speed**：任何圖案在低對比度下看起來都比高對比度下移動得慢，這也是低速先驗的證據。
  - **Point-light walkers (Biological motion)**：關節裝上燈泡在暗室中行走，只需看點的運動就能立刻看出是人在走；若倒轉則難以辨識，暗示有對直立行走的先驗。
  - **Poking eye demo**：閉上一隻眼，用手輕戳另一隻眼球，會覺得整個世界在晃動。這證明單靠眼部肌肉的本體感覺（proprioception）不足以消除視網膜上的運動訊號。

## 現象與機制
- **機制：運動方向的兩階段整合 (Two-stage integration)**
  - **Basis**: V1 的方向選擇性細胞只能偵測局部的一維運動分量（產生約束線 constraint line）。
  - **Evidence**: MT 區神經元能根據「約束線交集（intersection of constraints）」計算出 2D 運動。
- **機制：結合遮蔽線索的邊緣整合 (Edge integration informed by occlusion)**
  - **Basis**: 為了解決孔徑問題，大腦需跨空間整合多個邊緣的運動。但大腦必須知道哪些邊緣屬於同一個物體。
  - **Evidence**: 加上適當的遮蔽框，暗示線段末端是被遮住而非真實末端，大腦便會進行模態/非模態填補，將運動整合。
- **機制：運動知覺的貝氏推論 (Bayesian model with slow-speed prior)**
  - **Basis**: 感覺數據有雜訊時（如低對比），約束線變模糊（似然度變寬）。此時大腦內建的「低速先驗」會將後驗機率拉向原點（零速度）。
  - **Evidence**: 低對比度下的降速錯覺，以及低對比度菱形運動方向偏折現象。
- **機制：利用運動指令副本消除眼動干擾 (Efference copy for discounting eye motion)**
  - **Basis**: 發出眼動指令時，大腦同時發送一份副本給視覺系統，預期並抵消即將發生的視網膜影像位移。
  - **Evidence**: 外力推動眼球（無運動指令）時，世界看起來在動；麻痺眼肌卻嘗試移動眼球（有指令無實際眼動）時，世界也看起來在動。

## 與前後章的連結
- **Prior chapter**: 延續 Lecture 13 的 Reichardt detectors 與 V1 時空濾波器，進一步解釋有了這些局部偵測器後，系統如何解決孔徑問題並建構整體運動。
- **Connection to earlier topics**:
  - 貝氏推論（Bayesian perception）：呼應之前的章節，將先驗與似然度具體應用在 2D 速度空間的推論。
  - 深度與輪廓填補（Depth and contour completion）：呼應早期講述 amodal completion 與 relatability 的章節，證明這些腹側路徑（ventral stream）負責的形狀處理與背側路徑（dorsal stream）的運動處理有著密切互動。
- **Next chapter**: 將進入其他主題。

## 相關材料
- `待補`：講義投影片中的 Plaid 實驗圖表。
- `待補`：Shiffrar & Lorenceau 的遮蔽與運動整合實驗動畫截圖。
- `待補`：貝氏推論中 likelihood、prior 與 posterior 相乘的 2D 向量空間圖。

## 外部補充
