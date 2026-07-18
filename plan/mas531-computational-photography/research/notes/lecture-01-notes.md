# MIT MAS.531 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：1
- 章節標題：Introduction and fast-forward preview of all topics
- 對應逐字稿（可多支影片）：
  - Lecture 1： Introduction and fast-forward preview of all topics - Part 1 [Br1zazcSI4M].txt
  - Lecture 1： Introduction and fast-forward preview of all topics - Part 2 [8autJMHEzBU].txt
- 對應講義 PDF（`data/mas531/reference/`，若有）：無
- 完整閱讀日期：2026-07-09
- 閱讀者：章節 worker agent (Antigravity)
- 狀態：已完整讀完 / 已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行無換行純文字）：

- 檔案大小（bytes）：Part 1 (69,314 bytes), Part 2 (52,087 bytes)
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 自動字幕錯拼修正清單（原文 → 修正；無法確認者標 `待查`）：
  - "popular blitz" → "propeller blades" (iPhone 拍攝螺旋槳)
  - "gravy fountain" / "revi fontan" → "Trevi Fountain" (羅馬特萊維噴泉)
  - "lagrangioscopy" / "lagrange scope" → "laryngoscopy" / "laryngoscope" (喉頭鏡)
  - "paul heavily" → "Paul Haeberli" (1992 提出 synthetic lighting)
  - "paul the berwick" → "Paul Debevec" (Light Stage 發明者)
  - "kathy and dowsky" → "Cathey and Dowski" (Wavefront coding 發明者)
  - "sebik" → "Se Baek Oh" (或 Sebaek Oh)
  - "george barbastasis" → "George Barbastathis"

## 本講主問題

如何突破傳統 2D 相機（如針孔相機）在空間維度、波長、動態範圍與感測器設計上的物理與幾何限制？傳統相機僅被動地將 3D 場景投射為 2D 影像，本講透過結合新穎的光學元件（如 mask、lenslet array）、主動照明（programmable illumination）與計算方法（computational methods），重新定義何謂「相機」，以捕捉高維度的光線資訊（如 light fields、thermal IR、depth），甚至實現「看穿轉角」與醫學影像機制的革新。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Computational Camera | 打破鏡頭與感測器的傳統配置，透過修改光學元件、感測器或加入主動照明，捕捉超越 2D 影像的資料（如 4D 光場）。 | 納入導言，定義本課程範疇 |
| Epsilon / Coded / Essence Photography | 攝影概念的三個層次：Epsilon為極限包圍曝光（如HDR）；Coded為單張照片編碼場景資訊；Essence為擷取場景高階語意。 | 用作架構分類，重點放在 Coded |
| Dual Photography | 利用光路可逆性（Helmholtz reciprocity），將相機與投影機互換角色，合成出光源視角的影像。可用來「看見」遮蔽物後方的物體。 | 納入原理與系統，搭配撲克牌範例 |
| Light Field Camera | 將傳統相機改造成能捕捉光線方向的 4D 感測器。方法包含放置 micro-lens array 或在感測器前加入遮罩 (mask-based)，以支援事後對焦等應用。 | 納入原理與系統，強調兩種實現方式的差異 |
| Transient Imaging | 利用飛秒雷射 (femtosecond laser) 捕捉極短時間內的光子飛行軌跡，藉由分析多次反射 (multi-bounce) 來重建視線外（轉角後）的物體。 | 納入重點應用展示，強調「打破視線限制」 |
| Active Illumination (Multi-flash) | 透過在相機鏡頭周圍配置多顆閃光燈並依序觸發，藉由分析產生的微小陰影邊緣 (shadow slivers) 來精準萃取深度不連續邊緣 (depth edges)。 | 納入特徵擷取技術，作為 HCI 應用範例 |
| Wavefront Coding | 在透鏡前加上特殊光學元件（如 cubic phase mask），使系統的點擴散函數 (PSF) 不隨深度改變，再透過解迴旋計算還原影像，實現極大景深。 | 納入原理與系統 |
| Agile Spectrum Imaging | 如同音響等化器 (EQ)，在感測器端動態調整對不同波長的敏感度，不只是 RGB，而能針對特定應用（如牙醫美白、靜脈辨識）優化。 | 納入未來相機發展方向 |

## 重要細節

- 定義（光學量／成像模型／演算法）：傳統攝影是將 3D 世界壓縮成 2D；計算攝影則是捕捉 4D 光場（位置與角度）、時間、甚至更高維度的資訊。
- 公式與推導（如 thin lens、ray transfer matrix、light field 參數化）：Optical heterodyning 概念借鏡無線電通訊的頻率調變，用 mask 對光場進行空間編碼，再透過傅立葉轉換在頻域解碼還原 81 個虛擬相機視角。
- 系統與器材（相機改裝、mask、光源陣列、感測器）及其揭示的結論：
  - 用 30 美元的 Lomo 多閃光相機（四鏡頭四閃燈）概念，延伸至精確擷取邊緣。
  - 將 1600 萬畫素相機加上 125 微米 pitch 的 micro-lens array，換取 14x14 的空間角度解析度（約 292x292 畫素影像）。
- 講者例子或直覺說明：
  - 光速與音速的記憶法：光走一奈秒(ns)約是一英呎；聲音走一毫秒(ms)約是一英呎。
  - 單一像素感測器的蟲眼：蟲的單一感光細胞前帶有高頻遮蔽色素，稍微轉向就會造成進光量劇變，以此判斷方向。
- demo、guest talk 與問答重點：
  - Thermal IR demo：使用便宜熱像儀，證明一般可見光下透明的玻璃在長波長紅外線下是不透明的；熱像儀影像不受室內可見光照明改變影響。
  - Lytro/Refocus imaging 雛形展示：單一鏡頭內含 25 個子影像，全軟體事後對焦。
- 容易忽略的提醒：
  - 課程重點不在單純的軟體後製（如 Photoshop 或純粹的 HDR 合成），而是在於「光學與感測硬體的共同設計（co-design）」加上計算。
  - 醫學影像（如 CT）目前的設計像是噴射引擎繞著人旋轉，未來應借鏡計算相機原理來簡化機構。

## 原理與系統

- 原理／系統名稱：Mask-based Light Field Camera
- 光學或計算基礎：Optical heterodyning (空間外差干涉)。在感測器前方極近距離（約 1.2mm）放置高頻印製的透明遮罩 (printed mask)。
- 支持證據（實驗／demo／發表系統）：利用中片幅相機 (Mamiya) 移除 IR 濾鏡並放入遮罩。拍下的照片在未對焦區域會有高頻圖案，透過傅立葉轉換將高頻訊號解調 (demodulate)，可得到 9x9 (81個) 虛擬視角的影像。
- 適用範圍與限制：成本極低（幾美元即可改裝），但與 micro-lens array 一樣會犧牲空間解析度以換取角度解析度。
- 與相鄰主題的關聯：與史丹佛的 micro-lens array 光場相機是解決同一問題（捕捉 4D 光場）的兩種硬體途徑。

## 書稿章節草稿

### 導讀

本章作為《計算攝影》課程的總覽，帶領我們打破對「相機」的傳統認知。在過去，相機被視為一個暗箱與透鏡的組合，只能被動地將三維世界的反射光投影成平面的二維陣列。然而，隨著運算能力與感測器的進步，攝影已經從單純的「捕捉」跨越到「運算與重建」。本章將展示一系列看似魔法的技術：從事後對焦的光場相機、能夠看穿轉角的飛秒雷射、到提取場景幾何特徵的多重閃光系統，揭示未來相機的樣貌將是光學、感測器與演算法的深度融合。

### 核心內容

傳統攝影大多專注於 Epsilon photography（在極小範圍內改變參數，如包圍曝光）來彌補相機物理極限。然而，本課程的核心在於 Coded photography：透過在相機硬體中加入編碼機制（例如在鏡頭前加裝光柵、特製光圈、或主動控制的光源），將場景的深度、光照反射特性甚至隱藏的結構資訊，壓縮編碼進單張或極少量的照片中。後續再由軟體解碼，還原出原本 2D 感測器無法捕捉的高維度資料（如 4D 光場）。

### 原理與證據

1. **光場相機 (Light Field Camera)**：
   介紹了兩種截然不同的取徑。史丹佛大學團隊在感測器前放置微透鏡陣列 (micro-lens array) 來分離不同角度的入射光；而 MIT 團隊則提出成本極低的 Mask-based 光場相機，利用印有高頻圖案的遮罩，在空間上對光線進行調變（類似廣播電台的調幅/調頻技術），隨後在頻域解碼重現視差影像。
2. **超越視距的成像 (Looking Around Corners)**：
   利用飛秒雷射 (femtosecond laser) 極短的脈衝特性。因為光在 1 奈秒內移動約 1 英呎，要分辨公釐級的距離，必須有皮秒 (picosecond) 甚至飛秒等級的時間解析度。記錄光子在牆壁與隱藏物體間多次反彈的時間差 (Time-of-flight)，即可運算重建出不在視線內的物體。
3. **對偶攝影 (Dual Photography)**：
   利用亥姆霍茲光路可逆原理，將相機與投影機的位置邏輯互換，可以合成出從光源位置看出去的影像，甚至能用來讀取對手藏在手上的撲克牌。

### 常見誤解

- **計算攝影只是高階的 Photoshop 後製嗎？** 不是。純軟體後製無法憑空創造出硬體未捕捉到的光學資訊。真正的計算攝影是硬體（光學/照明）與軟體的共同設計 (co-design)。
- **光場相機只是為了事後對焦？** 事後對焦只是最直觀的應用。一旦捕捉到 4D 光場，我們等同獲取了幾何資訊，可以用於深度估計、去除眩光 (glare reduction)、甚至看穿部分遮蔽物 (synthetic aperture)。

### 小結

未來的相機不會只是追求更高畫素或更小的感測器，而是能夠聰明地篩選與編碼光線。這些技術不只將改變消費型攝影，更將推動醫學影像（如簡化斷層掃描設備）、人機互動（如不受光照影響的精確追蹤）與科學成像的重大革新。

## 跨章連結

- 前置章節：無（本講為導論）
- 後續章節：後續章節將深入探討 Time-of-flight, Coded Aperture, Wavefront Coding 與 Light Field 的具體數學模型與實作細節。
- 需要回頭補充的術語：Optical heterodyning, Femtosecond, Schlieren photography.
- 需要新增的圖表：Mask-based light field 頻域解碼圖、Time-of-flight 光子反射示意圖。

## 相關材料

- 講義 PDF 對應頁面／圖表：無
- Syllabus / reading 相關：無

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。本地 reference PDF 不算外部資料。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |
