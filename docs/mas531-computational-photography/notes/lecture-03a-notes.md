# MIT MAS.531 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：第 3 章 (Part 1)
- 章節標題：Epsilon Photography 與單張多域相機
- 對應逐字稿（可多支影片）：Lecture 3： Epsilon Photography： Improving Film-like Photography [wP-1t-djakw].txt
- 對應講義 PDF（`data/mas531/reference/`，若有）：MITMAS_531F09_lec03.pdf
- 完整閱讀日期：2026-07-09
- 閱讀者：Antigravity
- 狀態：已完整讀完

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行無換行純文字）：

- 檔案大小（bytes）：57037
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。
- 自動字幕錯拼修正清單（原文 → 修正；無法確認者標 `待查`）：
  - lamborghin → Lambertian
  - firm Life photography → film-like photography
  - firm → film
  - blood → blur
  - print sensitivity → film sensitivity
  - covion sensor → Foveon sensor
  - player pattern → Bayer pattern
  - cesar by frederator → CSAIL by Frédo Durand (待查，推測為 MIT CSAIL)
  - martial voice group → Marc Levoy's group
  - rock / road → Raskar (待查，指的應是下一位講者，可能為 Ramesh Raskar 或是 Ashok)

## 本講主問題

如何突破傳統底片與單一次曝光在動態範圍、景深、解析度、光譜上的物理限制？透過擷取多張在時間、感測器空間或像素層級有微小變化（Epsilon）的影像，並以計算方式將它們結合，來超越單一影像的畫質與功能。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Epsilon Photography | 透過在時間、感測器或像素上施加微小的變化（曝光、焦距、位置、光譜等）擷取多張影像並進行計算結合，以提升攝影品質。 | 作為本章核心框架 |
| Epsilon in Time (Bracketing) | 隨時間拍攝多張不同設定的影像（如不同曝光以合成 HDR，或不同焦平面以合成全周焦 Focal Stacks）。 | 詳細介紹 HDR 與 Focal Stack 合成 |
| Epsilon in Sensors | 使用共焦的多感測器（如 3CCD 或 8 相機光束分光系統）或相機陣列，在同一時間獲取多視角或多域資訊。 | 介紹光束分離器與相機陣列 |
| Epsilon in Pixels | 感測器上的相鄰像素捕捉不同資訊（如 Bayer filter, Foveon, Assorted Pixels 等空間多工技術）。 | 介紹 Bayer filter 與空間多工概念 |
| Generalized Mosaic | 結合前述概念，將空間濾波器置於相機前並旋轉拍攝，能同時得到全景且高動態或多光譜的影像。 | 作為整合範例介紹 |
| Synthetic Aperture Photography | 利用小孔徑相機陣列的資訊進行計算組合，模擬出具備淺景深、可數位重對焦的大孔徑鏡頭效果。 | 於景深控制段落介紹 |
| Image Destabilization | 在曝光期間主動同步移動鏡頭與感測器，以光學方式用小光圈鏡頭模擬大光圈的淺景深效果。 | 列為光學控制景深的新奇例子 |

## 重要細節

- 定義（光學量／成像模型／演算法）：介紹了傳統相機的曝光三要素（光圈、快門、ISO），以及相位對焦（Phase-based autofocus）與對比對焦（Contrast-based autofocus）的原理。
- 公式與推導（如 thin lens、ray transfer matrix、light field 參數化）：無複雜數學推導，主要是光路幾何直覺，說明 Depth of Field 與光圈大小的關係。
- 系統與器材（相機改裝、mask、光源陣列、感測器）及其揭示的結論：
  - Nikon Matrix Metering (早期的自動曝光估測)
  - 3CCD 系統：使用 Dichroic prism 確保無損的色彩擷取。
  - 8-camera array (Mitsubishi)：共焦的多相機系統。
  - Assorted Pixels (Sony/Columbia)：在像素級別加上不同透光率的濾鏡增加動態範圍。
- 講者例子或直覺說明：Prokudin-Gorsky 在 20 世紀初於俄羅斯拍攝的彩色照片（分別用紅、綠、藍濾波器拍攝三張黑白照片，再透過對應顏色的投影機疊加）。
- 容易忽略的提醒：合成 focal stack 需要 Gradient domain 的合併技術（如 Poisson solver）來避免邊緣接縫與亮度不連續。

## 原理與系統

若本講有具體成像原理或系統（如 coded aperture、dual photography、plenoptic camera、BiDi screen 等），記錄：

- 原理／系統名稱：Synthetic Aperture Photography
- 光學或計算基礎：透過平移與相加（Shift and Add）多個不同位置相機所拍攝的影像，能模擬出大光圈鏡頭的成像，讓特定平面的物體清晰而其他平面模糊。
- 支持證據（實驗／demo／發表系統）：Stanford 相機陣列展示能透視前方樹叢（聚焦於樹叢後方物體）。
- 適用範圍與限制：需要相機陣列；若以單機移動拍攝，則場景必須為靜態。
- 與相鄰主題的關聯：與光場（Light Field）概念相通。

## 書稿章節草稿

### 導讀

傳統攝影在按下快門的瞬間，受限於感測器的動態範圍、鏡頭光圈與對焦平面，往往只能妥協於某一種拍攝設定。本章節探討 Epsilon Photography（微差攝影），這是一種藉由在時間、感測器或像素層面引入微小變數，多次擷取場景資訊並以計算機視覺技術疊加融合的方法，旨在突破單一曝光的物理限制。

### 核心內容

Epsilon Photography 可分為三個主要維度：
1. **Epsilon in Time（時間維度）**：在不同時間點連續拍攝多張參數不同的照片。典型的應用為高動態範圍（HDR）影像的合成，以及拍攝不同對焦平面的焦點堆疊（Focal Stacks）。
2. **Epsilon in Sensors（感測器維度）**：利用多個共焦的感測器或相機陣列，在同一時間獲取多維度資訊，解決了時間維度無法拍攝動態場景的缺點。例如 3CCD 攝影機或是 8 相機分光系統。
3. **Epsilon in Pixels（像素維度）**：在單一感測器上，讓相鄰的像素負責擷取不同的資訊，例如 Bayer 濾波器擷取不同波長，或是 Assorted Pixels 加上不同的中性密度濾鏡以單張捕捉高動態範圍。

### 原理與證據

- **Synthetic Aperture（合成孔徑）與數位重對焦**：將相機陣列所捕捉的微小視角差異（Epsilon in position），透過 Shift and Add 的計算，可以模擬出如單眼相機大光圈般的淺景深效果，並能實現事後重新對焦。
- **Image Destabilization**：有別於軟體計算，透過在曝光期間精準控制感測器與鏡頭的相對移動，光學性地利用小光圈鏡頭創造出淺景深效果。

### 常見誤解

- 將影像後製的「模糊濾鏡」與光學真實的淺景深混為一談：單純從單張 2D 影像進行模糊處理，無法正確反映場景中物體的深度關係，邊緣也常出現不自然的光暈；而 Epsilon Photography 從多張或多視角獲取真實深度資訊重建模糊。

### 小結

Epsilon Photography 為運算攝影奠定了重要的基礎思想：相機不再需要一次性完美地捕捉場景。相反地，我們可以透過擷取大量具有微小變異的冗餘數據，再交由計算機還原出超越單機極限的完美影像。

## 跨章連結

- 前置章節：第 1 章、第 2 章
- 後續章節：第 3 章後半 (Single-shot Multi-domain Camera)、第 5/6 章 (Light Fields)
- 需要回頭補充的術語：Lambertian surface, Phase-based vs Contrast-based autofocus.
- 需要新增的圖表：Epsilon 分類圖、Synthetic Aperture 的 Shift-and-Add 原理圖。

## 相關材料

- 講義 PDF 對應頁面／圖表：對應 `MITMAS_531F09_lec03.pdf` 全文。
- Syllabus / reading 相關：無。

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。本地 reference PDF 不算外部資料。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |
