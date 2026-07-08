# MIT MAS.531 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：04
- 章節標題：Computational Illumination: dual photography, relighting
- 對應逐字稿（可多支影片）：
  - Lecture 4： Computational Illumination： dual photography, relighting - Part 1 [2QZUwB6F6Zw].txt
  - Lecture 4： Computational Illumination： dual photography, relighting - Part 2 [tpfRoPZZrjI].txt
- 對應講義 PDF（`data/mas531/reference/`，若有）：MITMAS_531F09_lec04.pdf, MITMAS_531F09_lec04_notes.pdf
- 完整閱讀日期：2026-07-09
- 閱讀者：Antigravity (Subagent)
- 狀態：已完整讀完 / 已抽象 / 已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行無換行純文字）：

- 檔案大小（bytes）：Part 1 (86,778 bytes), Part 2 (22,757 bytes)
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 自動字幕錯拼修正清單（原文 → 修正；無法確認者標 `待查`）：
  - catet off → Gadgetoff
  - deed → TED
  - mar prize → Marr Prize
  - kirmani → Ahmed Kirmani
  - helm house re procity → Helmholtz reciprocity
  - sri nair → Shree Nayar
  - martial lawyer → Marc Levoy (待查，也可能是 Martial Hebert)
  - alosha froze → Alyosha Efros
  - srinivas nursery one → Srinivasa Narasimhan
  - planoptic function → plenoptic function

## 本講主問題

用 3 到 5 句說明這一講要解決什麼成像問題、突破傳統相機的哪個限制。
本講探討如何將照明從單一的恆定光源（如閃光燈或環境光）擴展為高維度的可程式化光源，以擷取場景中隱藏的光學資訊。講者介紹了對偶攝影（Dual Photography）的概念，利用亥姆霍茲光路可逆性（Helmholtz reciprocity），透過互換相機與投影機的角色，合成出從光源視角觀看的影像，藉此看到隱藏或被遮擋的物體。此外，本講也解決了如何分離直接反射（Direct reflection）與全局反射（Global reflection）的問題，以及如何透過相機陣列達成合成孔徑（Synthetic Aperture）以看透前景遮蔽物。這突破了相機僅能記錄表面最終混合光場的限制。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Dual Photography (對偶攝影) | 基於 Helmholtz reciprocity，相機與光源（投影機）互換位置後測量到的光傳輸矩陣互為轉置（Transpose）。可用來合成從光源視角看世界的影像。 | 獨立小節，詳細解釋光傳輸矩陣的運作與對偶空間的合成。 |
| Direct vs. Global Illumination Separation | 透過投影高頻的棋盤格圖案及其反相圖案（Inverse checkerboard），只用兩張影像即可分離直接反射（單次彈跳）與全局反射（多次彈跳、次表面散射等）。 | 獨立小節，解釋公式原理並以辨識真假水果或去除混濁液體散射為例。 |
| Temporal Modulation | 借鑒通訊系統（如電視遙控器在 40kHz 頻率運作），讓光源以特定頻率閃爍，感測器專門解碼該頻率，即可在強烈環境光下抽離特定光源的貢獻。 | 在「原理與系統」介紹光通訊概念如何應用於計算攝影。 |
| Synthetic Aperture Photography | 運用相機陣列（Camera Array）模擬超大孔徑的鏡頭，透過平移與疊加（Shift and Add）影像，可將對焦平面設定在遠處，並將前景遮蔽物極度模糊化以達成「看透（See-through）」效果。 | 獨立小節，說明光場擷取與對焦重建的關係。 |

## 重要細節

- 定義（光學量／成像模型／演算法）：
  - 亥姆霍茲光路可逆性（Helmholtz reciprocity）：光線在場景中的傳輸路徑是可逆的，將發光點與接收點互換，光的傳輸比例不變。
  - Plenoptic Function（全光函數）：7D 函數（XYZ, 俯仰角, 方位角, 波長, 時間），描述空間中任意點在任意時間、波長與方向的光強度。可簡化為 4D 光場（Two-plane parameterization）。
- 公式與推導（如 thin lens、ray transfer matrix、light field 參數化）：
  - 對偶攝影的光傳輸矩陣 $T$：攝影機像素矩陣大小為 $M \times N$，投影機為 $P \times Q$。記錄下投影機逐一亮起像素時攝影機拍到的結果，形成矩陣 $T$。其對偶影像的光傳輸矩陣 $T'$ 即為 $T^T$（轉置矩陣）。
  - Direct-Global 分離：投影圖案的影像 $I_1 = c \cdot D + \frac{1}{2} G$（假設高頻圖案覆蓋一半區域），反相圖案影像 $I_2 = (1-c) \cdot D + \frac{1}{2} G$。透過 $Max(I_1, I_2) - Min(I_1, I_2)$ 即可求得 Direct Component。
- 系統與器材（相機改裝、mask、光源陣列、感測器）及其揭示的結論：
  - Camera Array（相機陣列）：透過移動單一相機拍攝 24 張不同位置的照片，或使用相機陣列同時拍攝，再於軟體中合成影像，可模擬出巨大的孔徑（Synthetic Aperture）。
- 講者例子或直覺說明：
  - 真假水果辨識：真實的蘋果、香蕉因具備次表面散射（Subsurface scattering），其光線會在內部彈跳（Global），而假水果只有表面反光（Direct）。使用分離技術即可一眼分辨真偽。
  - 看透撲克牌：投影機將光打在書本上，光線漫射照亮背對著相機的撲克牌，再反射回相機。透過對偶攝影，可合成出彷彿「相機放在書本位置看撲克牌」的清晰影像。
- demo、guest talk 與問答重點：
  - 討論 Google Earth Live 的可能性：無所不在的攝影機網路與海量資料儲存。
  - 討論使用太陽光或自然光源（如揮舞棒子產生隨機陰影）來取代投影機進行 Direct-Global 分離的可行性。
- 容易忽略的提醒：
  - Direct-Global 分離技術對於純鏡面反射（Specular reflection）會失效，因為鏡面反射高度依賴入射角度，無法假設在微小光源移動下 Global 保持不變。
  - 在對偶空間中，原本相機看不到但被光源照亮的區域，在合成後會呈現為「陰影（Occlusions）」。

## 原理與系統

- 原理／系統名稱：Direct and Global Illumination Separation
- 光學或計算基礎：當光源位置產生極微小改變（如高頻棋盤格的亮暗變化）時，直接反射的像素亮度會產生劇烈改變，但經過多次彈跳的全局反射光線，其分布幾乎不變。
- 支持證據（實驗／demo／發表系統）：以棋盤格投影在真實水果與塑膠水果上，證明真實水果具有強烈的次表面散射（Global component），而塑膠水果只有表面直接反射。
- 適用範圍與限制：不適用於完美鏡面反射；當棋盤格頻率不夠高以至於無法捕捉極細微的散射細節（如牆角互反）時，會有誤差。
- 與相鄰主題的關聯：這是控制空間維度與圖案（Spatial Modulation）的一種極致應用。

## 書稿章節草稿

### 導讀

如果說相機是被動接收光線的容器，那麼光源就是主動探測場景的畫筆。在傳統攝影中，閃光燈的作用僅是將暗處照亮；但在計算攝影的範疇內，照明可以是一個在空間、時間與頻率上受到精確控制的高維變數。本章將介紹「計算照明（Computational Illumination）」，透過程式化的光源投影，我們能讓相機「看」到原本看不見的死角（如對偶攝影），或是將交織在一起的光線解開，拆解出光線在物體表面彈跳了一次，還是穿透表面進行了多次散射（直接與全局光分離）。

### 核心內容

本章的核心在於「照明的編碼與解碼」。
1. **對偶攝影（Dual Photography）**：基於物理學的亥姆霍茲可逆性（Helmholtz reciprocity），如果我們記錄下投影機發出的每道光線如何影響相機的每個像素（即光傳輸矩陣），我們就能透過對矩陣進行轉置（Transpose），在數學上互換投影機與相機的位置。這使得我們可以合成出從光源視角看出去的影像，甚至能看到原本背對相機的撲克牌花色。
2. **直接與全局光分離（Separating Direct and Global Illumination）**：透過投影高頻的棋盤格與其反相圖案，僅需兩張照片就能分離光線。直接反射（Direct）保留了物體表面的紋理；而全局反射（Global）則包含了多次彈跳、次表面散射與半透明材質的特性。

### 原理與證據

- **真假水果與次表面散射**：講者展示了真實的蘋果與蠟製模型。在一般光照下兩者難以分辨，但透過分離技術提取直接反射光後，真實蘋果因為光線多在內部進行次表面散射，所以其表面直接反射看起來非常暗沉且呈現不同色澤；而假蘋果只有表面反光，無所遁形。
- **合成孔徑（Synthetic Aperture）與看透樹葉**：除了改變光源，我們也能透過擴增感測器的空間分佈來達成不可能的任務。藉由相機陣列或移動單一相機，我們能模擬出一顆口徑極大（如數十公分寬）的鏡頭。當景深極淺時，前方的障礙物（如樹叢或人群）會被極度模糊化，使我們能夠看透遮蔽物，將焦點鎖定在隱藏於其後的目標上。

### 常見誤解

- **「全局光（Global Illumination）」只有在電腦繪圖（CG）才有意義**：許多人以為這只是 3D 渲染的術語，但真實世界充滿了全局光（光線的多次彈跳）。正是因為早期的 CG 技術只渲染直接反射，所以像《玩具總動員》裡的塑膠玩具看起來很真實，但若要渲染逼真的人類皮膚（需次表面散射），便需要精密的全局光計算。
- **對偶攝影只是鏡子反射**：對偶攝影不需要鏡面，它是利用漫反射（Diffuse reflection）將光線散佈至整個場景。相機能透過觀察漫反射光芒的細微變化，解碼出隱藏物體的影像。

### 小結

將通訊理論的調變（Modulation）與光學結合，我們賦予了光線傳遞資訊的能力。計算照明將拍照從單向的「紀錄」變成雙向的「探測」，未來，當相機像素能像遙控器接收器一樣解碼特定頻率的光線，我們甚至能在正午的烈日下，完美分離出相機閃光燈對場景的單獨貢獻。

## 跨章連結

- 前置章節：Lecture 2 & 3 (相機與編碼、多重閃光燈)
- 後續章節：光場（Light Fields）的深入討論（從 7D Plenoptic function 到 4D 光場）。
- 需要回頭補充的術語：Helmholtz reciprocity, Plenoptic function。
- 需要新增的圖表：對偶攝影的光傳輸矩陣（T 與 T'）圖解；Direct vs Global 的棋盤格投影分離示意圖。

## 相關材料

- 講義 PDF 對應頁面／圖表：MITMAS_531F09_lec04.pdf
- Syllabus / reading 相關：無

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。本地 reference PDF 不算外部資料。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |
