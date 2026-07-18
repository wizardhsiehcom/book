# MIT MAS.531 章節筆記：Lecture 3b - Single-shot Multi-domain Camera

## 基本資料

- 章節編號：Lecture 3 (Part 2)
- 章節標題：Single-shot Multi-domain Camera
- 對應逐字稿：Lecture 3： Single-shot Multi-domain Camera [xbDqd-dVVb0].txt
- 對應講義 PDF：`data/mas531/reference/MITMAS_531F09_lec03_2.pdf`
- 完整閱讀日期：2026-07-09
- 閱讀者：Antigravity (Worker Agent)
- 狀態：已完整讀完 / 已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行無換行純文字）：

- 檔案大小（bytes）：35132
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。
- 自動字幕錯拼修正清單：
  - Miter → MITRE
  - gary and robbie → Gary Euliss and Ravi Athale
  - mark lavoy → Marc Levoy
  - kinema color → Kinemacolor
  - cassie → CASSI (Coded Aperture Snapshot Spectral Imager)
  - cetus → CTIS (Computed Tomography Infrared Spectrometer)
  - biorefringence → birefringence
  - lamborghini division → Lambertian division
  - lens lid array → lenslet array
  - on kid / mesh → Ankit / Ramesh

## 本講主問題

如何利用相機感測器上越來越密集的像素（spatial resolution excess），在「單次曝光（single snapshot）」的情況下，捕捉場景的多維度資訊（如光譜、偏振、高動態範圍）？本講旨在使用插入鏡頭光圈處的濾波器陣列，配合感測器前的針孔陣列，解決傳統多維度相機需在時間上掃描或空間上對位困難的問題。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 多維度資訊捕捉 (Multidomain capture) | 捕捉光場、時間、光譜、偏振等 7D 資訊，傳統上常需要時間掃描或犧牲空間解析度。 | 放入導讀，說明傳統方法的取捨。 |
| 濾波器陣列 (Filter array at pupil plane) | 將不同的濾波器（如紅綠藍、偏振片、ND 等）放置在相機的光圈（pupil plane/aperture stop）位置。 | 於「原理與證據」詳細說明系統設計。 |
| 針孔陣列 (Pinhole array) | 放置於感測器前方，將光圈上的濾波器陣列成像到感測器上的每一小區塊中。功能類似 lenslet array。 | 於「原理與證據」說明如何解析多維資訊。 |
| 解析度取捨 (Resolution tradeoff) | 影像空間解析度與濾波通道數（如 16 個）成反比（類似 Bayer filter 的延伸）。 | 於「常見誤解與限制」說明此設計的基本取捨。 |
| Epsilon Photography 擴展應用 | 利用空間解析度的餘裕進行 super resolution，或拍攝 panorama (空間)、camera array (時間) 以增加資訊。 | 總結 Epsilon Photography 在空、時、頻譜的應用。 |

## 重要細節

- 定義：多維度資訊（7D: 4D light field, temporal, spectral, polarization）。
- 公式與推導：與 light field 相機類似，感測器擷取空間參數 $(s,t)$，光圈平面代表角度參數 $(u,v)$。針孔陣列將每個 $(s,t)$ 映射出完整的 $(u,v)$ 影像。
- 系統與器材：
  - 相機改裝：Nikon 50mm f/1.8 鏡頭, 10Mpix 9μm CCD。
  - 光圈處的 filter array：以雷射切割壓克力固定多種濾波器（例如 RGB、多種角度的偏振片、ND 濾鏡，或是光柵）。
  - 感測器前：印在透明投影片上的 pinhole array (pitch 200μm, pinhole radius 25μm)。
- 演算法流程：
  - 擷取原始影像。
  - 對每一個 pinhole 下的區域進行 Lambertian division（平場校正）以去除 pinhole 列印瑕疵。
  - 根據先驗知識，透過查表將各 pinhole 對應相同位置的像素拼接，重組出不同通道的影像。
- 講者例子：
  - 使用偏振鏡分辨人造物（金屬反射較多偏振光）與自然植物。
  - 捕捉蠟燭/燈泡與螢光燈的光譜分佈差異（螢光燈有 sharp peak）。
- demo、guest talk 與問答重點：
  - Q: 針孔陣列會不會有繞射問題？A: 會，pinhole 產生較大的 point spread function，導致影像模糊且浪費像素。改用 lenslet array 會好得多。
  - Q: 降低空間解析度可以透過 demodulation 補救嗎？A: 無法簡單當成調變函數來反解，因為不同實體屬性混合在空間中。
- 容易忽略的提醒：
  - 此設計在物體位於無窮遠或合焦平面（Planar object）時效果最佳。失焦會導致不同光線混合（cross-talk），破壞通道分離度。

## 原理與系統

- 原理／系統名稱：Single-shot Multidomain Camera (基於 Light Field 架構)
- 光學或計算基礎：Light field (Plenoptic camera)。利用針孔陣列將 pupil plane 成像至感測器，藉由在 pupil plane 放入不同 filters，讓感測器上的相鄰像素分別記錄不同性質的光線。
- 支持證據：
  - 16 filters (RGB, ND, IR, 5 polarizers) 示範 HDR 與偏振特徵提取。
  - 放入 1D 光譜光柵 (spectral filter)，使單一像素能記錄 400-700nm 的連續光譜。
- 適用範圍與限制：限制在於空間解析度大幅降低；光效能差；對焦極度敏感。
- 與相鄰主題的關聯：與 Assorted Pixels 目的相似，但將濾波器做在光圈上，易於抽換與配置。

## 書稿章節草稿

(已移至 `docs/mas531-computational-photography/03-epsilon-photography-part2.md`)

## 跨章連結

- 前置章節：Lecture 3 (Part 1) Assorted Pixels。
- 後續章節：Light field camera / Plenoptic camera。
- 需要回頭補充的術語：Bayer filter, Point Spread Function (PSF), Plenoptic camera, Light field $(u,v)$ and $(s,t)$ parameterization.
- 需要新增的圖表：Filter array at pupil plane + pinhole array at sensor plane 的光路示意圖。

## 相關材料

- 講義 PDF 對應頁面／圖表：`MITMAS_531F09_lec03_2.pdf`
  - p.2-4: 多維資訊與既有解決方案。
  - p.5-6: Light field 基本概念與失焦的影響。
  - p.7-11: 系統架構與解析度取捨。
  - p.12: 相機改裝實體照片。
  - p.13-17: 實驗結果（6 filters, 16 filters, spectral filter）。
- Syllabus / reading 相關：無

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |
