# R2 — 規格類數字查證報告

- 研究 agent：R2
- 主題：MIT MAS.531《Computational Camera and Photography》繁體中文書稿之規格數字查證
- 查核日期：2026-07-12
- 原則：每個敏感數字力求兩個獨立來源；來源分級 官方/論文 > 新聞 > 社群。查不到標「待查」，絕不臆造。

---

## 摘要（先看這裡）

| # | 項目 | 書中值 | 查證結論 | 是否相符 |
|---|------|--------|----------|----------|
| 1 | 史丹佛手持光場相機 | 1600萬畫素 / 292×292 空間 / 14×14 角度 / 125μm pitch | 全部相符（見下方重要澄清） | ✅ 相符 |
| 2 | 遮罩式外差光場相機視角數 | 9×9（81 視角） | 論文明載頻域產生 9×9 複本 | ✅ 相符 |
| 3 | 單張多域相機 | Nikon 50mm f/1.8 / 10Mpix 9μm CCD / pinhole pitch 200μm・半徑25μm / 16 通道 | 原論文全部吻合 | ✅ 相符 |
| 4 | Vein Viewer 近紅外波長 | 780nm | **無法用兩個獨立權威來源佐證確切 780nm** | ⚠️ 待查 |
| 5 | FTIR 多點觸控（Jeff Han） | 2005 年 | UIST 2005 論文，正確 | ✅ 相符 |
| 6 | Fluttered Shutter / Coded Aperture 論文年份 | 2006 / 2007 | 皆正確 | ✅ 相符 |

**需要編輯注意的兩點：**
- **#1 的細微澄清**：史丹佛原型的「微透鏡陣列」實體規格是 **296×296** 個微透鏡（每個 125μm 寬）；書中出現的 **292×292** 是「最終捕捉光場的空間解析度（st 軸）」，論文原文即為 292×292，兩者是不同層次的數字，書中把 292×292 定位為「空間解析度」是**正確**的。若後續有任何段落把「微透鏡陣列」直接說成 292×292 個，則需改為 296×296。
- **#4（780nm）**：屬於課堂口述數值，發明團隊原始論文並未標明具體波長，第三方文獻對 VeinViewer 波長說法不一（740/760/850nm 皆有）。780nm 落在合理近紅外範圍、原理正確，但**達不到「兩個獨立來源」的查證標準**，建議在書中改為概括描述（如「約 740–850nm 近紅外」）或加註來源為課堂講述。

---

## 逐項查證

### 1. 史丹佛（Ng / Levoy）手持光場相機原型規格

| 子項 | 書中值 | 查證值 | 相符 |
|------|--------|--------|------|
| 感測器畫素 | 1600 萬 | Kodak KAF-16802CE 彩色感測器，約 4000×4000、像素寬 9μm（≈16MP） | ✅ |
| 空間解析度 (st) | 292×292 | 「最終捕捉光場的空間 st 軸解析度為 292×292」 | ✅ |
| 角度解析度 (uv) | 14×14 | 「uv 方向軸接近但略低於 14×14（just under 14×14）」 | ✅ |
| 微透鏡 pitch | 125μm | 「296×296 個 lenslet，各 125μm 寬、方形、密堆」（Adaptive Optics Associates 料號 0125-0.5-S，焦距 500μm） | ✅ |
| 微透鏡陣列數目 | （書中定位為空間解析度 292×292） | 實體陣列為 **296×296** 個微透鏡 | ⚠️ 需分清層次 |

論文原文（primary，已下載 PDF 抽取文字驗證）：
- 「approximately 4000×4000 pixels that are 9 microns wide … It has 296×296 lenslets that are 125 microns wide」
- 「The final resolution of the light fields … is 292×292 in the spatial st axes, and just under 14×14 in the uv directional axes.」

- 來源 A（論文，primary）：Ng, Levoy, Brédif, Duval, Horowitz, Hanrahan, "Light Field Photography with a Hand-Held Plenoptic Camera," Stanford Tech Report CTSR 2005-02, 2005. <https://graphics.stanford.edu/papers/lfcamera/lfcamera-150dpi.pdf>（存取 2026-07-12；查核 2026-07-12）
- 來源 B（Levoy 本人講義，independent 佐證 292×292 / 14×14 / 125μm / 16MP）：Marc Levoy, CS178 "Light field photography" 講義。<https://graphics.stanford.edu/courses/cs178-11/lectures/lightfields-26apr11.pdf>（存取 2026-07-12）
- 交叉比對：Light Field Forum 時間軸亦記「292×292 lenses → 14×14 pixels per lens、Kodak 16-megapixel、125µ microlenses」（此二手來源把陣列數口語化為 292，實體為 296，僅供佐證）<http://lightfield-forum.com/what-is-the-lightfield/history-of-light-field-photography-timeline/>

結論：**書中數字相符**；唯需維持「292×292＝空間解析度、296×296＝微透鏡陣列」的層次區分。

---

### 2. 遮罩式 / 外差（Heterodyne）光場相機的虛擬視角數

- 書中值：9×9（81 視角）。
- 查證值：論文以近感測器的餘弦遮罩，在傅立葉域產生 **9×9 個頻譜複本**，重排回 4D 還原光場 → 對應 9×9＝81 個角度樣本。**相符**。
- 論文：Veeraraghavan, Raskar, Agrawal, Mohan, Tumblin, "Dappled Photography: Mask Enhanced Cameras for Heterodyned Light Fields and Coded Aperture Refocusing," ACM SIGGRAPH 2007（ACM TOG 26(3)）。
- 來源 A（作者專案頁，primary）：<https://web.media.mit.edu/~raskar/Mask/>（存取 2026-07-12）
- 來源 B（作者專案頁，independent）：<http://www.amitkagrawal.com/sig07/index.html>；ACM DL：<https://dl.acm.org/doi/10.1145/1276377.1276463>（存取 2026-07-12）

結論：**相符**。

---

### 3. Single-shot Multidomain Camera 規格

此系統即 Horstmeyer, Euliss, Athale, Levoy, **"Flexible Multimodal Camera Using a Light Field Architecture," IEEE ICCP 2009**。已下載論文 PDF 抽取文字逐項比對：

| 子項 | 書/筆記值 | 論文原文 | 相符 |
|------|-----------|----------|------|
| 主鏡頭 | Nikon 50mm f/1.8 | 「Nikon 50mm f/1.8 lens」 | ✅ |
| 感測器 | 10Mpix、9μm CCD | 「4008×2672 board level Lumenera monochrome CCD sensor containing 9 µm pixels」（4008×2672≈10.7MP） | ✅ |
| 針孔陣列 | pitch 200μm、半徑 25μm | 「array of 50 µm pinholes on a 200 µm pitch」（50μm 為直徑 → 半徑 25μm） | ✅ |
| 濾波通道 | 16 通道 | 「8 mm × 8 mm array of 16 filters」 | ✅ |

- 來源 A（論文，primary）：<https://graphics.stanford.edu/papers/multimodal/horstmeyer-multimodal-iccp09.pdf>（存取 2026-07-12；查核 2026-07-12）
- 來源 B（會議論文列表，independent 佐證出處/年份）：ICCP 2009 papers 索引 <https://kesen.realtimerendering.com/iccp2009.html>（存取 2026-07-12）
  - 註：所有硬體細節僅原論文載有；第二來源用於佐證論文之存在與年份，硬體數字以 primary 為準。

結論：**全部相符**。

---

### 4. Vein Viewer 使用的近紅外波長（書中 780nm）

- 書中值：780 奈米。
- 查證：
  - 發明團隊原始論文 "Vein Imaging: A New Method of Near Infrared Imaging …"（Luminetx，載於 Christie Medical 網站）**通篇未標明具體波長**，僅稱使用近紅外光。<https://christiemed.com/wp-content/uploads/2019/09/A-New-Method-of-Near-Infrared-1.pdf>（存取 2026-07-12）
  - 二手來源對 VeinViewer 波長說法**不一致**：有稱約 850nm、有稱 740–760nm、亦有 740–780nm 區間之說。
    - Near-infrared vein finder（Wikipedia）：<https://en.wikipedia.org/wiki/Near-infrared_vein_finder>
    - TFOT 報導僅稱「near-infrared LED」，未給數字：<https://thefutureofthings.com/5324-luminetx-veinviewer/>
- 結論：**⚠️ 待查/未能獨立佐證**。780nm 落在血紅素近紅外吸收的合理區間、原理正確，且與課堂講述（Raskar）一致，但**找不到兩個獨立權威來源明確指出 VeinViewer 波長為 780nm**。建議：書中保留原理描述，波長改為區間表述（如「約 740–850nm 近紅外」）或註明「依課堂講述」。

---

### 5. FTIR 多點觸控：Jeff Han 發表年份（書中 2005）

- 書中值：2005 年。
- 查證值：Jeff Han, "Low-Cost Multi-Touch Sensing through Frustrated Total Internal Reflection," **UIST 2005**（第 18 屆 ACM UIST，Seattle，2005 年 10 月）。**相符**。
- 來源 A（作者頁，primary）：Jeff Han, "FTIR Touch Sensing," NYU。<https://cs.nyu.edu/~jhan/ftirsense/>（存取 2026-07-12）
- 來源 B（社群 wiki + ResearchGate，independent 佐證年份與會議）：<http://wiki.nuigroup.com/FTIR>；ResearchGate 論文條目「Low-Cost Multi-Touch Sensing through Frustrated Total Internal Reflection」(UIST 2005)。

結論：**相符**。

---

### 6. Fluttered Shutter 與 Coded Aperture 的關鍵論文與年份

**Fluttered Shutter（書中 SIGGRAPH 2006）**
- Raskar, Agrawal, Tumblin, "Coded Exposure Photography: Motion Deblurring using Fluttered Shutter," **ACM SIGGRAPH 2006**（ACM TOG 25(3)）。**相符**。
- 來源 A（作者頁，primary）：<https://web.media.mit.edu/~raskar/deblur/>（存取 2026-07-12）
- 來源 B（SIGGRAPH history，independent）：<https://history.siggraph.org/learning/coded-exposure-photography-motion-deblurring-using-fluttered-shutter-by-raskar-agrawal-and-tumblin/>

**Coded Aperture（書中 Levin et al. / Veeraraghavan，2007）**
- Levin, Fergus, Durand, Freeman, "Image and Depth from a Conventional Camera with a Coded Aperture," **SIGGRAPH 2007**（ACM TOG 26(3)）。**相符**。
  - 來源 A（論文 PDF，primary）：<https://webee.technion.ac.il/people/anat.levin/papers/CodedAperture-LevinEtAl-SIGGRAPH07.pdf>
  - 來源 B（ACM DL，independent）：<https://dl.acm.org/doi/abs/10.1145/1275808.1276464>
- Veeraraghavan et al. "Dappled Photography"（2007，同上 #2）亦含 coded aperture refocusing，故書中並列「Levin et al. / Veeraraghavan」皆為 2007，**正確**。

結論：**兩者年份、作者、會議皆相符**。

---

## 需回報給上層 agent 的重點（與書中不符或需修正處）

1. **#4 Vein Viewer 780nm**：唯一達不到「兩獨立來源」查證標準的數字。原理正確，但確切波長無法獨立佐證，第三方對 VeinViewer 波長說法分歧（740/760/850nm 皆見）。建議改為波長區間或註明係課堂講述。
2. **#1 光場相機層次澄清**：292×292 是「空間解析度」（正確），微透鏡陣列實體是 296×296。書中現行敘述（把 292×292 定位為空間解析度）正確，但務必不要把「微透鏡陣列」寫成 292×292 個。
3. 其餘 #2、#3、#5、#6 全部與書稿相符，均有 primary 來源支撐。
