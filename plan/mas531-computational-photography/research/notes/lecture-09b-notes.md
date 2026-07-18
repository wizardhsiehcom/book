# MIT MAS.531 章節筆記：Lecture 9b

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：9
- 章節標題：Computational imaging: a survey of medical and scientific applications
- 對應逐字稿（可多支影片）：
  - Lecture 9： Computational imaging： a survey of medical and scientific applications [x-ijexq_D2U].txt
- 對應講義 PDF（`data/mas531/reference/`，若有）：MITMAS_531F09_lec09_2a.pdf, MITMAS_531F09_lec09_2b.pdf (推測)
- 完整閱讀日期：2026-07-09
- 閱讀者：章節 worker agent (Antigravity)
- 狀態：已完整讀完 / 已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行無換行純文字）：

- 檔案大小（bytes）：92,857 bytes
- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 自動字幕錯拼修正清單（原文 → 修正；無法確認者標 `待查`）：
  - "radon transform" → "Radon transform"
  - "slanted slanting and cat" → "Slaney and Kak" (Principles of Computerized Tomographic Imaging)
  - "foid projection slice theorem" → "Fourier projection slice theorem"
  - "voice the one these transforms" → "1D Fourier transforms"
  - "appetizing this filter" → "apodizing this filter"
  - "bernie" → "gurney"
  - "shield fields" → "Shield Fields"
  - "visual hole algorithm" → "visual hull algorithm"
  - "etec" → "E-Tech" (SIGGRAPH E-Tech)
  - "laminography" → "Laminography"
  - "schlieren tomography" → "Schlieren tomography"
  - "halogerone problem" → "Calderón problem" (EIT 中的逆問題，待查)
  - "decompolation" → "deconvolution"
  - "mura code" → "MURA code" (Modified Uniformly Redundant Array)

## 本講主問題

本講探討計算成像（Computational Imaging）如何在醫學與科學領域中解決各種限制，特別是如何非侵入性地取得物體的內部三維截面影像（Tomography，斷層掃描）。從傳統 X 光 CT 的投影與重建（如 Radon 轉換、傅立葉切片定理）、無計算的機械式層析攝影（Laminography），再延伸至聲波、繞射、強散射介質（漫射光學斷層掃描），最後探討生物顯微鏡下的去卷積（Deconvolution）、共軛焦顯微鏡（Confocal Microscopy），以及天文學中的編碼孔徑（Coded Aperture）。這些科學與醫學領域的技術，如何啟發當代計算攝影（如光場相機與無透鏡相機）的發展。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Tomography (斷層掃描) | 透過從多個角度拍攝一維或二維投影，利用逆向演算法（如逆 Radon 轉換）重建三維體積資料的核心技術。 | 作為理解光場相機的數學基礎與對照 |
| Fourier Projection Slice Theorem | 傅立葉投影切片定理：空間域中投影的 1D 傅立葉轉換，等於該物體 2D 傅立葉轉換中通過原點的一個切片。 | 解釋 CT 重建與光場重對焦的數學原理 |
| Filtered Back Projection | 濾波反投影：不需透過完整 2D 逆傅立葉轉換即可重建影像的空間域演算法，需先進行高通濾波（避免低頻能量過度累積）再將投影抹平（Smear）回去。 | 解釋 CT 重建的實際作法 |
| Laminography (層析攝影) | 利用機械方式同時反向移動光源與底片，使得只有特定深度的平面保持清晰，其餘深度模糊，達到無須電腦運算的切片效果。 | 與相機鏡頭的合成孔徑/景深效果做連結 |
| Deconvolution (去卷積) | 在顯微鏡等光學系統中，利用已知的點擴散函數（PSF）對拍攝到的焦距疊圖（Focal Stack）進行逆運算，以去除離焦模糊，獲得清晰的 3D 結構。 | 納入原理與系統 |
| Confocal Microscopy | 共軛焦顯微鏡：透過在光源與感測端分別放置針孔（Pinhole），從光學上物理性地阻擋非焦平面的光線，使得 PSF 下降率達到 $1/r^4$，不需去卷積即可獲得清晰切片。 | 對比計算與物理光學方法的取捨 |
| Coded Aperture (編碼孔徑) | 在無法使用折射透鏡的領域（如 X 光天文學），利用具備特定數學性質（如 MURA code，其自相關函數為 delta 函數）的遮罩陣列進行投影，再透過去卷積還原影像，同時解決光通量與解析度的問題。 | 納入原理與系統，探討其對無鏡頭相機的啟發 |

## 重要細節

- **CT 與光場相機的類比**：光場相機（如陣列相機）實際上就是在進行一種受限基線（Limited Baseline）與離散角度取樣的斷層掃描。光場的重對焦（Shift and Add）在數學上等同於 Laminography 或是投影的反向積分。
- **Shield Fields**：為解決 X 光管快速切換的困難，講者團隊在可見光領域利用一直開啟的 LED 陣列配合高頻遮罩，讓重疊的投影變得可以逆運算，達成單次快照的斷層掃描。這也啟發了後續利用 LCD 面板作為動態遮罩的深度感測螢幕。
- **不同物理條件的斷層掃描**：
  - 直線彈性路徑 (Ballistic)：如 X 光 CT，可直接應用 Radon 轉換。
  - 弱折射/繞射 (Weakly refracting/diffracting)：如 Schlieren 斷層掃描，投影切片在頻域中不再是直線而是弧線，可透過改變波長（寬頻全像）來重建。
  - 強散射 (Strongly scattering)：如漫射光學斷層掃描 (Diffuse Optical Tomography)，因光子擴散使問題高度非線性且非適定，需結合如 Time-of-Flight 等資訊做初始猜測，再用梯度下降法優化。
- **反傅立葉轉換的問題**：直接將各角度的傅立葉切片填入 2D 頻域會導致中心（低頻）採樣過度密集。因此在反投影前需要乘上一個與半徑成正比的權重（即高通濾波/銳化），以平衡頻率分布。

## 原理與系統

- **原理／系統名稱**：Fourier Projection Slice Theorem & Filtered Back Projection
- **光學或計算基礎**：線性積分、Radon 轉換、傅立葉轉換對。
- **支持證據（實驗／demo／發表系統）**：現代百萬級 CT 掃描儀，結合機械滑環技術與 X 光管陣列的旋轉，實現醫療斷層掃描。
- **適用範圍與限制**：需要足夠密集的角度取樣（Angular density）與足夠大的基線（Baseline），否則會產生星芒狀偽影（Starburst artifacts）與邊緣模糊。金屬假牙等不透光/強散射物體會造成資料缺失與嚴重偽影。
- **與相鄰主題的關聯**：與前幾講的 Light Field 相機有著深厚的數學同構關係。

## 書稿章節草稿

（將整合至主文檔）

## 跨章連結

- 前置章節：與 Lecture 5, 6 的 Light Field Camera 原理緊密連結。
- 需要回頭補充的術語：Radon Transform, Fourier Projection Slice Theorem, Deconvolution.
- 相關概念對照：光場重對焦 vs. Laminography；陣列相機 vs. CT。

## 相關材料

- 對照參考：`MITMAS_531F09_lec09_2a.pdf` 與 `MITMAS_531F09_lec09_2b.pdf` 中的圖解。
