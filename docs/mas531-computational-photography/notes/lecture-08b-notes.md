# MIT MAS.531 章節筆記：Lecture 8b

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：8
- 章節標題：Survey of Hyperspectral Imaging Techniques
- 對應逐字稿（可多支影片）：
  - Lecture 8： Survey of Hyperspectral Imaging Techniques [H2zauvCW-to].txt
- 對應講義 PDF（`data/mas531/reference/`，若有）：無（或參考 lec08 相關投影片）
- 完整閱讀日期：2026-07-09
- 閱讀者：章節 worker agent (Antigravity)
- 狀態：已完整讀完 / 已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行無換行純文字）：

- 檔案大小（bytes）：52,168 bytes
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 自動字幕錯拼修正清單（原文 → 修正；無法確認者標 `待查`）：
  - "radon transform" → "Radon transform"
  - "hadamard" → "Hadamard"
  - "more penrose pseudo inverse" → "Moore-Penrose pseudoinverse"
  - "acousto optic" → "acousto-optic"

## 本講主問題

如何以不同架構與運算手法捕捉空間與光譜的高維度資料立方體（Data Cube：X, Y, $\lambda$），並克服傳統光譜儀在光子捕捉效率（Photon efficiency）與擷取時間上的物理限制？講者探討了從傳統的濾波掃描、推掃式光譜儀（Push-broom），到結合編碼光圈（Coded aperture）、壓縮感測（Compressive sensing）與電腦斷層掃描原理（Tomography）的先進高光譜成像技術。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Data Cube (資料立方體) | 高光譜成像所要擷取的目標資訊，包含空間維度 (X, Y) 與光譜波長維度 ($\lambda$)。 | 定義問題空間 |
| Scanning Filter | 傳統光譜儀架構，利用可調式濾波器（如 acousto-optic filter）依序掃描波長。光子效率差 ($1/L$)，且需花費時間掃描。 | 作為基準比較 (Baseline) |
| Push-broom Spectrometer | 推掃式光譜儀，利用狹縫 (slit) 和光柵擷取單一空間維度 (X) 與光譜 ($\lambda$)，另一個空間維度 (Y) 需靠掃描。光子效率亦低。 | 作為基準比較 |
| Hadamard Multiplexing (Coded Aperture) | 將光譜儀的狹縫替換成編碼遮罩（如 Hadamard 碼），一次讓約一半的光通過，大幅提升光子效率至 1/2，並透過矩陣運算解碼還原。 | 納入原理與系統 |
| Compressive Sensing (壓縮感測) | 利用訊號在某個領域的稀疏性（Sparsity），以少於未知數數量的測量次數來重建原始訊號，突破傳統採樣極限。 | 納入原理與系統，強調其在單張快照擷取高光譜中的應用 |
| Computed Tomography for Spectral Imaging (CTIS) | 利用特殊繞射光柵將不同波長的光分散到感測器上的不同區域（多個繞射級次），這等同於對 (X, Y, $\lambda$) 的資料立方體進行不同角度的線積分（類似 X-ray 斷層掃描），隨後透過重建演算法還原光譜資訊。 | 納入原理與系統，作為結合跨領域概念的經典案例 |

## 重要細節

- 斷層掃描 (Tomography) 類比：在傳統醫學 CT 中，是透過不同角度對實體密度進行線積分來重建 3D 結構；而在高光譜 CTIS 架構中，積分路徑穿過的是資料立方體 (X, Y, $\lambda$)，積分的數值是波長的能量，這展示了數學模型跨領域的威力。
- 壓縮感測的直覺解釋：當觀測矩陣較寬（測量數少於未知參數）時，問題為欠定（Under-determined）。但若假設場景在某個基礎下是稀疏的（例如星空大多是黑的只有少數亮點，或影像在小波轉換下是稀疏的），就能透過演算法重建，儘管計算成本通常較高。
- 單次散射與雙次散射光譜儀 (Single vs. Dual Disperser) 的取捨：先光柵再編碼 vs. 先編碼再光柵，前者保留較好的空間結構資訊但損失部分光譜，後者則反之。
- 這些技術的核心動機：解決光子飢渴 (Photon-starved) 問題，透過編碼將原本要丟棄的光子收集起來。

## 原理與系統

- 原理／系統名稱：CTIS (Computed Tomography Imaging Spectrometer)
- 光學或計算基礎：繞射光柵 (Diffraction grating) 與 Radon 轉換 (Radon transform) 重建。
- 支持證據（實驗／demo／發表系統）：特殊繞射光柵能產生 2D 分布的多個級次繞射光斑（如 0, 1, 2, -1, -2），每一點都是對資料立方體特定角度的投影。
- 適用範圍與限制：優點是單次快照即可獲得資料，缺點是為了避免不同級次的繞射影像在感測器上重疊，感測器必須有大量未使用的「死區 (Dead space)」，犧牲了空間解析度（至少降低 25 倍）。
- 與相鄰主題的關聯：呼應前幾講中 Coded Aperture 及空間-角度維度的取捨（在此為空間-光譜維度取捨）。

## 書稿章節草稿

### 高光譜成像：如何捕捉色彩的三維資料立方體

在計算攝影中，我們常常將影像視為一個資料立方體 (Data Cube)，包含兩個空間維度 (X, Y) 以及一個光譜維度 ($\lambda$)。傳統相機透過拜耳濾色片將光譜維度壓縮成三個寬頻帶 (RGB)，而高光譜相機 (Hyperspectral Camera) 則致力於擷取數十甚至數百個狹窄波段的完整光譜。然而，捕捉這個三維立方體面臨了物理限制：我們的感測器是二維的。

### 基準技術與光子效率挑戰

最直接的方法是掃描。我們可以加裝一個可調式濾波器（如聲光濾波器 Acousto-optic filter），每次只讓一個波長通過。或是使用推掃式光譜儀 (Push-broom spectrometer)，透過一道狹縫 (Slit) 擷取一條空間線的光譜，然後移動相機掃描整個場景。

這兩種方法都面臨致命缺點：**光子效率極低 (Poor photon efficiency)**。前者只利用了 $1/L$（L為波長數）的光，後者只利用了 $1/N_y$ 的光。絕大多數進入鏡頭的光子都被浪費了。

### 透過計算光學突破限制

為了解決這個問題，研究者們發展出多種巧妙的計算光學架構：

1. **編碼孔徑 (Coded Aperture / Hadamard Multiplexing)**：
   將推掃式光譜儀的單一狹縫替換成編碼遮罩（例如一半透光、一半遮光的 Hadamard 碼）。這樣感測器一次能接收到約 50% 的光子。雖然不同空間位置和波長的光會在感測器上混疊，但因為編碼是已知的，我們可以透過矩陣解碼運算（如反矩陣）精確分離出原始資訊。

2. **壓縮感測 (Compressive Sensing Spectral Imager)**：
   如果我們測量的次數少於立方體中的像素總數，這在數學上是一個欠定問題 (Under-determined problem)。但壓縮感測理論指出，自然界的影像通常具有「稀疏性 (Sparsity)」（例如在小波轉換域）。只要結合適當的光學編碼與稀疏重建演算法，我們甚至可以用單一張 2D 照片還原出完整的 3D 高光譜立方體。

3. **光譜斷層掃描 (CTIS - Computed Tomography Imaging Spectrometer)**：
   醫學上的 CT 斷層掃描是透過從各種角度拍攝 X 光線積分來重建人體的 3D 結構。CTIS 將這個概念完美借用到光譜成像上。它在光路中放置一個特殊的二維繞射光柵，將光線分散成多個角度的繞射圖樣。在感測器上捕捉到的每一個繞射圖樣，在數學上就等同於對 (X, Y, $\lambda$) 資料立方體進行某個特定角度的線積分投影 (Radon transform)。雖然這種方法能達成單次快照成像 (Snapshot imaging)，但感測器的大部分區域必須留白以避免不同繞射光重疊，因此付出了犧牲空間解析度的代價。

## 跨章連結

- 前置章節：與光場相機中「用感測器解析度換取角度資訊」的概念相呼應。
- 後續章節：醫療與科學影像中的斷層掃描原理（Lecture 9）。
- 需要回頭補充的術語：Hadamard matrix, Compressive Sensing, Radon Transform。
- 需要新增的圖表：資料立方體的投影線積分圖示。

## 相關材料

- 講義 PDF 對應頁面／圖表：可對照 `MITMAS_531F09_lec08_2.pdf` 相關架構圖。
