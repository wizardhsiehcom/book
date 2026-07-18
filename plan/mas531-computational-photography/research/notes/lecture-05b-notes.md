# MIT MAS.531 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：5b
- 章節標題：Recent research: Retrographic Sensing for the Measurement of Surface Texture and Shape
- 對應逐字稿（可多支影片）：
  - Lecture 5： Recent research： Retrographic Sensing for the Measurement of Surface Texture and Shape [LP085DG79lU].txt
- 對應講義 PDF（`data/mas531/reference/`，若有）：無
- 完整閱讀日期：2026-07-09
- 閱讀者：章節 worker agent (Antigravity)
- 狀態：已完整讀完 / 已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行無換行純文字）：

- 檔案大小（bytes）：22,810 bytes
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 自動字幕錯拼修正清單（原文 → 修正；無法確認者標 `待查`）：
  - "thermoplastic blastomer" → "thermoplastic elastomer" (熱塑性彈性體)
  - "cigarette emerging Technologies" → "SIGGRAPH Emerging Technologies"
  - "cdpr" / "cvpr" → "CVPR"
  - "ictv" → "ICCV"
  - "lamb version" / "same version" → "Lambertian" (朗伯反射)
  - "ice codes" / "isopotes" / "ice coat" → "isophotes" (等照度線)
  - "William" → "Woodham" (Robert Woodham，1980 提出 Photometric Stereo)
  - "poissons / poisson equation" → "Poisson equation" (解柏松方程式重建表面)
  - "Ken perlin's preferred total internal reflection" → "Ken Perlin's frustrated total internal reflection" (FTIR，受抑全內反射)

## 本講主問題

如何測量並捕捉高解析度的物體表面幾何紋理與形狀（2.5D height map）？特別是針對傳統光學掃描（如雷射或結構光）難以處理的材質（如透明玻璃、金屬反光表面），或極微小的細節（如指紋、紙鈔印刷凸起）。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Retrographic Sensing | 將目標物壓入表面塗有特殊反光漆的透明彈性膠體（Elastomer）中，使物體表面看起來像被上了一層漆，再從膠體背面透過攝影機觀測。 | 納入原理與系統 |
| Photometric Stereo (光度立體視覺) | 利用三個不同方向（RGB）的光源照射，根據各個顏色通道在相機捕捉到的陰影（shading），反推計算出物體表面的法向量（surface normal）。 | 納入核心技術，解釋如何避開 shape-from-shading 的困難 |
| Shape from Shading | 單一光源下從陰影推導形狀，是傳統電腦視覺中的難題（一維資訊無法唯一確定二維法向量）。 | 用作對比，說明為何採用三個光源 |
| Poisson Reconstruction | 取得表面法向量的梯度（gradient）後，透過解 Poisson equation 積分還原出連續的 2.5D 高度圖（height map）。 | 納入原理步驟 |

## 重要細節

- 定義（光學量／成像模型／演算法）：Retrographic Sensing 並非真正的 3D 掃描器，而是捕捉高解析度、即時的 2.5D 高度圖 (height map)。
- 系統與器材：
  - 材質：Thermoplastic elastomer (熱塑性彈性體) 或矽膠 (silicone)，特色是透明可透光，硬度可根據需求調整（從像輪胎一樣硬到極軟）。
  - 表面漆：使用帶有鏡面反射（specular/glossy）特性的塗料搭配區域光源 (area light sources)，對於捕捉細微指紋、紙鈔細節效果最好；若要捕捉較大深度，則使用 Lambertian (漫反射) 塗料搭配點光源。
  - 硬體配置：膠體下方有玻璃，底下有 RGB 三色光源與相機。也有縮小化成如牙醫攝影機般的筆狀版本。
- 講者例子或直覺說明：
  - 難以掃描的物件：Oreo 餅乾、玻璃飾品、金屬抽屜把手、20元紙鈔上的立體印刷。
  - 敏感度範圍：可以硬到讓 2800 磅的汽車開過去測量胎面，也能軟到用頭髮輕碰、或透過肥皂泡泡的壓力產生形變。
  - 新奇應用：測量蠕蟲 (worms) 收縮時伸出的微小結構 (setae，剛毛)；或者用於醫學上的觸診記錄。
- 容易忽略的提醒：
  - 因為將表面壓入塗料中，原本的顏色資訊會遺失，只能得到形狀和幾何特徵。
  - 在陡峭角度 (steep normals) 的重建準確度較低，但對正對相機的細節（淺角度）非常精準。

## 原理與系統

- 原理／系統名稱：Retrographic Sensor (GelSight 前身)
- 光學或計算基礎：Photometric Stereo。透過紅、綠、藍三個不同方向的光源照明，拍攝單張 RGB 影像。因為三個光源的等照度線 (isophotes) 在球面上的交點唯一，可透過事先用標準球體按壓建置的 Look-up Table (LUT)，直接將像素的 RGB 數值對應到表面法向量，最後積分出高度圖。
- 支持證據（實驗／demo／發表系統）：在 SIGGRAPH Emerging Technologies 與 CVPR 展示。實時以 2.5D 捕捉 Oreo 餅乾紋理、手指指紋脈搏、紙鈔細節。
- 適用範圍與限制：優點是能測量透明、金屬等傳統光學方法難以應付的表面，解析度極高（微米等級），且可即時（Real-time）處理動態變化。缺點是只能測量 2.5D 高度，無法掃描深 3D 結構，且會失去原物件顏色資訊。
- 與相鄰主題的關聯：解決傳統 shape from shading 的困難，並與其他觸覺感測技術（如 Ken Perlin 的 FTIR）作比較，本技術提供更高的空間解析度。

## 書稿章節草稿

(請見 07-retrographic-sensing.md 草稿)

## 跨章連結

- 前置章節：無直接依賴，但涉及光學與幾何。
- 後續章節：無。
- 需要新增的圖表：Photometric Stereo 三色光源照射示意圖、Isophotes 在球體上交會求得法向量的示意圖。

## 相關材料

- 講義 PDF 對應頁面／圖表：無（以逐字稿為主）
- Syllabus / reading 相關：CVPR 論文 (Retrographic Sensing for the Measurement of Surface Texture and Shape)

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。本地 reference PDF 不算外部資料。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |
