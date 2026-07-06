# Lecture 21 Reading Notes: Attention (cont'd)

## 基本資料
- **Lecture number:** 21
- **Title:** Attention (cont'd)
- **Transcript path:** `/Users/wizard/Desktop/MacCode/book/data/mit9.35/transcripts/21： Attention (cont'd) [sdYDZeXzE5Q].txt`
- **Reading Date:** 2026-07-06
- **Reader:** AI
- **Status:** Completed

## 逐字稿完整閱讀紀錄
- **Start:** 0 bytes
- **End:** 65,874 bytes (Read via two chunks to bypass the 46080 bytes limit)
- **Skipped sections:** none

## 本講主問題
本講接續前一堂課，深入探討「注意力」的多元現象與底層機制。課程從空間線索與視覺搜尋出發，討論注意力如何具體改變視覺處理（例如改變空間解析度與提升主觀對比度）。隨後延伸至時間維度，探討注意力瞬脫與時間擴張錯覺。接著，透過改變盲視（change blindness）與大量影像記憶的強烈對比，引出「及時視覺」（just-in-time vision）與表徵稀疏性的概念。最後，結合聽覺選擇性實驗與 fMRI 腦造影證據（如 FFA/PPA），總結注意力在大腦中如何透過增強特定神經活動來運作。

## 核心概念 table

| Concept | Explanation | How to handle in chapter |
|---------|-------------|--------------------------|
| 空間線索與視覺搜尋 | 外源性（Exogenous）與內源性（Endogenous）線索的差異，以及視覺搜尋中特徵突顯（Pop-out）與結合搜尋（Conjunction search）的特性。 | 作為理解注意力選擇性的基礎，帶出特徵整合理論（Feature Integration Theory）。 |
| 注意力改變空間解析度 | 在紋理分割實驗中，注意力似乎會縮小感受野（Receptive fields），導致目標在中央小窩時表現反而下降。 | 深入說明注意力如何改變底層視覺機制，打破「注意力永遠提升表現」的直覺。 |
| 注意力改變主觀對比度 | Carrasco 的實驗顯示，被注意的區域在主觀上會顯得對比度更高，解釋了「專心看會看得更清楚」的現象。 | 介紹心理物理學如何巧妙測量（透過方位判斷而非直接問對比度）主觀知覺的改變。 |
| 時間維度的注意力 | 奇異物體引發的時間擴張錯覺（Time expansion）與連續處理目標時發生的注意力瞬脫（Attentional blink）。 | 擴展注意力的概念至時間軸上的動態變化與運算限制。 |
| 改變盲視與及時視覺 | 人類對場景中的巨大改變常視而不見，顯示內部視覺表徵極度稀疏；世界本身就是最佳的「外在記憶」。 | 對比改變盲視與人類優異的「大要（gist）」記憶能力，解釋大腦的經濟運作法則。 |
| 聽覺選擇性注意力 | 經典的雙耳追隨作業（Speech shadowing）顯示未被注意的聲道僅保留低階物理特徵（如性別、音量），缺乏語意理解。 | 將注意力概念跨展至聽覺模態，探討訊息過濾的深度。 |
| 注意力的神經機制 | 注意力會針對性地增強處理該目標的腦區活動（如空間映射區，或重疊影像中的 FFA 與 PPA）。 | 作為全章的生理學總結，展示注意力在皮質層級的實體運作方式。 |

## 重要細節
- **Definitions:** 
  - SOA (Stimulus Onset Asynchrony)：刺激發生非同步時間。
  - Point of Subjective Equality (PSE)：主觀相等點。
  - Attentional Blink：注意力瞬脫。
  - Change Blindness：改變盲視。
- **Mechanisms:** 
  - 特徵整合理論（Feature Integration Theory, Anne Treisman）：不同特徵平行處理，但結合時需要注意力。注意力移開可能導致錯覺結合（Illusory conjunctions）。
  - 注意力縮小感受野（Receptive field shrinking）：在紋理分割中使最佳解析度偏向周邊視野。
  - 「眼動比記憶便宜」（Eye movements are cheaper than memory）：及時視覺的核心原則。
- **Experiments:**
  - **紋理分割線索實驗**：展示線索反而使中央小窩辨識率下降。
  - **Carrasco 的對比度實驗**：巧妙利用方向辨識任務，發現受線索提示的區域其 PSE 往低對比度偏移（即看來更清晰）。
  - **時間擴張錯覺**：一連串固定時間的閃動圓盤中，突然擴張的圓盤會被感覺停留時間多了約 50%。
  - **注意力瞬脫實驗**：在快速序列中偵測 T1（白字）後，短時間內（約幾百毫秒內）對 T2（黑X）的偵測率大幅下降。
  - **改變盲視示範**：閃爍的飛機引擎、漸變色的舞者毛衣、問路時換人。
  - **Colin Cherry (1953) 雙耳追隨實驗**：聽覺選擇性機制的經典展示。
  - **Kanwisher FFA/PPA 實驗**：重疊的臉孔與房子影像，注意其中一個會增強對應腦區的 fMRI 訊號。
- **Lecturer reminders:**
  - 「注意力」一詞在不同實驗中可能指涉不同的心理過程，至今仍缺乏一個大一統的計算框架，使用時必須謹慎。
  - 改變盲視並不代表我們記憶力差，事實上人們對大量影像的「大要（gist）」記憶力極為驚人（如 Oliva 與 Brady 的實驗）。兩者的矛盾在於大腦選擇記住什麼資訊。

## 現象與機制
- **機制：注意力增強主觀外觀（Perceived Contrast）**
  - **Basis:** 注意力的介入能改變刺激的主觀知覺品質。
  - **Evidence:** 在 Carrasco 的實驗中，若注意某個位置，即使該處的對比度較低，受試者仍會將其判斷為與高對比度的基準刺激相等。這是一個暫態（transient）效應，延遲 500 毫秒後即消失。
- **機制：及時視覺（Just-in-time vision）**
  - **Basis:** 大腦傾向不維持高解析度的內部表徵，而是將外部世界當作記憶體。
  - **Evidence:** 只要消除了干擾注意力的局部影像瞬變（transients），人們便會陷入「改變盲視」。這說明我們覺得「看見整個豐富世界」其實是一種錯覺（類似冰箱燈的錯覺）。
- **機制：注意力的神經增強（Neural Enhancement）**
  - **Basis:** 注意特定特徵、位置或物件時，負責該運算的腦區神經活動會增加。
  - **Evidence:** 面對空間上完全重疊的臉孔與房子影像（一動一靜），當受試者被要求注意「臉」時，梭狀回面孔區（FFA）訊號上升；注意「房子」時，海馬旁迴場所區（PPA）訊號上升。

## 與前後章的連結
- **Prior chapter:** 接續上一章對於「注意力」的基本定義與空間線索（cueing）、多目標追蹤（MOT）的探討。
- **Next chapter:** 教授在結尾預告將進入觸覺（Touch）、味覺（Taste）與嗅覺（Smell）的討論。
- **Terminology to unify:** 感受野（Receptive fields）、偏心度（Eccentricity）、梭狀回面孔區（FFA）、海馬旁迴場所區（PPA）、視網膜對應映射（Retinotopic map）。

## 相關材料
- 待補：Carrasco 對比度實驗的心理物理學函數圖表。
- 待補：注意力瞬脫（Attentional blink）的 U 型曲線圖。
- 待補：Kanwisher FFA/PPA 重疊實驗的 fMRI 反應長條圖。

## 外部補充
