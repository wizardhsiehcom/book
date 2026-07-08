# MIT MAS.531 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：10
- 章節標題：編碼成像 (Coded Imaging)
- 對應逐字稿：
  - Lecture 11： Coded imaging [Xrsk2Avd3Xc].txt
- 對應講義 PDF：MITMAS_531F09_lec11_1.pdf、MITMAS_531F09_lec11_2.pdf
- 完整閱讀日期：2026-07-09
- 閱讀者：章節 worker agent (Antigravity)
- 狀態：已完整讀完 / 已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 檔案大小（bytes）：67,787 bytes
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 自動字幕錯拼修正清單（原文 → 修正；無法確認者標 `待查`）：
  - "flutter shutter" → "Fluttered Shutter"
  - "kathy and taoski" / "cdm optics" → "Cathey and Dowski" (Wavefront coding 發明者)
  - "mura course" → "MURA (Modified Uniform Redundant Arrays) codes"
  - "rat code" → "RAT code"
  - "compressor sensing" → "Compressive Sensing"
  - "leicester university" → "Rice University" (單像素相機與 Compressive Sensing 發明地)

## 本講主問題

傳統相機在面對物體移動 (Motion) 或失焦 (Defocus) 時，會產生模糊 (Blur)，導致影像高頻資訊永久遺失（在頻域中產生零點，造成 Division by zero）。如何透過在相機硬體中加入編碼機制（如時間上的 Fluttered Shutter、空間上的 Coded Aperture）並結合後端的計算解碼，來保留並重建這些遺失的資訊？

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Fluttered Shutter (Coded Exposure) | 在單次曝光時間內，以二元序列快速開關快門，讓移動物體產生的模糊具有寬頻特性，避免在頻域產生零點，藉此能完美解迴旋還原銳利影像。 | 納入原理與系統，解釋時間編碼 |
| Coded Aperture | 在鏡頭光圈處放置特定的二維遮罩圖案，使失焦的模糊圖案也具備寬頻特性，藉此可以事後全幅對焦或估測深度。 | 納入原理與系統，解釋空間編碼 |
| Wavefront Coding | 使用特殊的相位遮罩 (Cubic Phase Plate) 將進入鏡頭的光線扭曲，使得不同深度的點擴散函數 (PSF) 都保持一致，再透過計算解碼獲得極大景深。 | 納入原理與系統，作為光學與計算共同設計的經典案例 |
| Compressive Sensing | 單像素相機概念：假設影像在某種轉換域（如小波轉換）是稀疏的，利用隨機或 Hadamard 投影測量，能以遠少於總像素數的測量次數重建高解析度影像。 | 納入概念介紹，指出其潛力與自然影像重建的挑戰 |
| Photography Wishlist | 提出對未來攝影的五大願景：Ultimate Post-capture Control, Freedom from Form, Understand the World, Sharing Visual Experience, Capturing Essence。 | 作為未來展望補充 |

## 重要細節

- 定義（光學量／成像模型／演算法）：傳統模糊相當於在空間域做 Box filter 卷積，轉換到頻域會產生 Sinc function 導致有零點 (division by zero) 且高頻衰減。Coded imaging 的核心是「Engineer the point spread function」，讓 PSF 的傅立葉轉換在頻域保持平坦 (broadband)，從而保留高頻資訊。
- 公式與推導：卷積 (Convolution) 在影像空間等於在頻域的相乘。解模糊 (Deblurring) 即為頻域的相除，分母若有零或極小值將導致雜訊放大或無法還原。
- 系統與器材：
  - Fluttered Shutter：在鏡頭前加裝 Ferroelectric LCD 液晶快門，達到 1/0 的高對比快速切換。
  - Coded Aperture：將鏡頭拆開，在中心投影點 (Center of projection) 的光圈位置放入 7x7 的二維光罩。
- 講者例子或直覺說明：找尋最佳快門序列 (Code) 是困難的，長度 52 的序列有 2^52 種可能。1D 可以透過隨機搜尋找到，但 2D 編碼在線性卷積 (linear convolution) 下無法直接套用天文學常用的 MURA code，因此團隊發明了 RAT code。
- 容易忽略的提醒：Compressive Sensing 雖然在斷層掃描 (CT) 等高維度稀疏資料中表現優異，但一般自然影像並非完美稀疏，直接應用於單像素相機仍面臨挑戰。

## 原理與系統

- 原理／系統名稱：Fluttered Shutter (Coded Exposure) / Coded Aperture
- 光學或計算基礎：時間與空間編碼 (Coding in Time & Space)。傳統快門或光圈會銷毀高頻資訊，透過特定二元序列 (如 52 bits sequence 或 7x7 mask) 將點擴散函數 (PSF) 工程化為寬頻特性 (broadband)，讓所有頻率資訊皆得以保留。
- 支持證據（實驗／demo／發表系統）：
  - Fluttered Shutter：將高速行駛的汽車車牌，從嚴重模糊的拖影中還原出清晰字體。
  - Coded Aperture：從失焦的玩具影像中，計算出正確的對焦影像。
- 適用範圍與限制：最大的缺點是「減少了進光量」，因為快門半開半關或光圈被遮蔽一半，進光量僅剩一半。此外，在解碼時仍需預測模糊的程度（如車速或景深距離）。

## 書稿章節草稿

### 導讀

你是否曾拍下一張高速移動的汽車，或者對焦失敗的風景，看著模糊的照片懊惱不已？在傳統攝影中，按下快門的瞬間，影像的模糊 (Blur) 似乎是一種「破壞性」的物理過程，將原本清晰的高頻細節永遠抹除。然而，計算攝影學卻給出了不同的答案：模糊不一定是資訊的毀滅，它其實是一場可以被「解開」的數學編碼。本章我們將探討編碼成像 (Coded Imaging) 如何透過改變快門的時間開關 (Fluttered Shutter) 與光圈的空間形狀 (Coded Aperture)，主動將「點擴散函數 (PSF)」工程化，讓那些看似無可救藥的模糊照片，能夠透過計算奇蹟般地還原成銳利影像。

### 核心內容

在傳統相機中，相機的曝光過程相當於在影像上套用一個方形濾波器 (Box filter)。從訊號處理的角度來看，Box filter 在頻域中的頻譜呈現 Sinc function，伴隨著無數的「零點」。這意味著，當我們試圖在後製軟體中進行反卷積 (Deconvolution) 來消除模糊時，將面臨致命的「除以零 (Division by zero)」問題，使得丟失的高頻資訊無法被還原。

Coded Imaging 的突破在於「Engineer the point spread function (PSF)」。如果我們能在曝光的過程中，有策略地控制光線的進入，讓 PSF 在頻域中保持寬頻 (Broadband) 特性而不產生零點，那麼高頻資訊就能被完整保留。

### 原理與證據

1. **時間編碼：Fluttered Shutter (Coded Exposure)**
   相較於傳統相機在曝光期間始終開啟快門，Fluttered Shutter 使用 Ferroelectric LCD 液晶在鏡頭前以極快的速度進行二元 (1/0) 切換。這使得移動物體在感光元件上留下的不再是連續的拖影，而是斷續的殘影。這個特定的開關序列經過計算挑選，其傅立葉轉換在頻域是平坦的 (Flat)。實驗證明，透過這種技術，即便是高速駛過、肉眼與傳統相機皆無法辨識車牌的車輛，也能被反卷積出清晰的數字。

2. **空間編碼：Coded Aperture**
   光圈不僅控制進光量，也決定了失焦時的點擴散形狀 (Bokeh)。透過在鏡頭的中心投影點插入特定的二維遮罩（如 7x7 的編碼圖案），失焦的亮點將呈現該遮罩的形狀。這種特殊形狀的 PSF 同樣具備頻域寬頻特性，使得我們能在拍攝後，透過軟體對不同深度的物體進行反卷積，實現事後全幅對焦。

3. **光學與數位共同設計：Wavefront Coding**
   相較於改變光圈形狀，Wavefront coding 採用一片特殊的三次方相位遮罩 (Cubic Phase Plate) 來扭曲光線相位。這使得系統的 PSF 在極大的深度範圍內都保持恆定（雖然視覺上是模糊的）。由於模糊程度與深度無關，我們只要套用單一的反卷積演算法，就能還原出具有無限景深的清晰照片。

### 常見誤解

- **為什麼不能用傳統的縮小光圈或提高快門速度來解決？** 
  雖然縮小光圈能增加景深，提高快門能凍結瞬間，但它們都會大幅減少進光量（可能減少到原本的 1/10 甚至更少），導致嚴重的雜訊。Coded Imaging 的優勢在於它僅阻擋了一半的進光量（保留約 50% 光線），卻能達到與高速快門/小光圈媲美甚至超越的清晰度。
- **隨便遮擋快門或光圈就可以嗎？**
  不行。編碼的序列與圖案必須經過嚴密的數學設計，確保其頻譜不含零點且能量分佈均勻。尋找最佳二維編碼甚至需要全新的數學理論 (如 RAT code) 來解決線性卷積帶來的邊界問題。

### 小結

Coded Imaging 完美詮釋了計算攝影的精神：相機不再只是被動地紀錄光線，而是透過硬體的「編碼 (Coding)」與軟體的「解碼 (Decoding)」共同設計 (Co-design)。當我們不再受限於傳統攝影的物理直覺，就能突破光學的極限，將未來的相機推向全新的維度。
