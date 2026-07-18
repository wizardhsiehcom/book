# R1 研究報告：MAS.531 課綱確認與覆蓋缺口

- 研究 agent：R1
- 查核日期（今天）：2026-07-12
- 課程：MIT MAS.531 / MAS.131《Computational Camera and Photography》，Fall 2009，Prof. Ramesh Raskar
- 主要一手來源：MIT OpenCourseWare 官方課程頁（見文末來源清單）

---

## 1. 官方課綱：每一講主題對照表

以下以 OCW **Syllabus（課程行事曆）** 為權威來源，並與 **Lecture Notes** 頁（實際有影音/講義下載者）交叉比對。

| LEC | 官方主題（Syllabus 逐字 / 摘要） | 客座講者 | OCW 有無下載材料 | 本書現有對應 |
|-----|-----|-----|-----|-----|
| 1 | Introduction and fast-forward preview of all topics | Raskar | 有 | `01-introduction.md` |
| 2 | Modern optics and lenses; ray-matrix operations; context enhanced imaging | Raskar | 有 | `02-modern-optics-ray-matrix.md` |
| 3 | Epsilon Photography: Improving Film-like Photography；Single-shot Multi-domain Camera | Ankit Mohan；Roarke Horstmeyer | 有 | `03-epsilon-photography.md`、`03-epsilon-photography-part2.md` |
| 4 | Computational Illumination: dual photography, relighting | Raskar | 有 | `04-computational-illumination.md` |
| 5 | Lightfields, part 1；Retrographic Sensing (GelSight 前身) | Micah Kimo Johnson | 有 | `05-lightfields-1.md` |
| 6 | Lightfields, part 2；BiDi Screen；Cameras for human-computer interaction (HCI) | Matt Hirsch | 有 | `06-lightfields-2.md`、`07-sensing-and-interaction.md` |
| **7** | **IR imaging (guest lecture)；Tomography and 3D techniques (guest lecture)** | 客座（Syllabus 未具名） | **無（完全缺，見第 2 節）** | **無（章號從 Lec6 直接跳到 Lec8）** |
| 8 | Project ideas discussion；Wavelengths and colors；Survey of Hyperspectral Imaging Techniques | Ankit Mohan；Michael Stenner (MITRE) | 有 | `08-wavelengths-color-hyperspectral.md` |
| 9 | Computational imaging: a survey of medical and scientific applications；Cameras We Cannot Picture | Douglas Lanman (Brown)；Ravi Athale (MITRE) | 有 | `09-computational-imaging-survey.md` |
| 10 | Mid-term exam；Optics and sensing in animal eyes | Quinn Smithwick | 有 | `appendix-lec10.md`（附錄，動物之眼）✅ |
| 11 | Coded imaging；Wishlist for photography（含論文寫作指引） | Raskar | 有 | `10-coded-imaging.md` ✅ |
| 12 | Final project presentations（Final project report due） | 學生 | 無（僅期末報告，無講課內容） | 不需成章 ✅ |

**課程總講次**：正式列到 **Lecture 12**，但 Lec12 純為學生期末專題發表，無授課內容、OCW 無材料，本書不需涵蓋。實質授課內容為 Lec1–Lec11。

**現有對應正確性確認**：
- ✅ 附錄 = Lec10「動物之眼」（客座 Quinn Smithwick）—— **正確**。注意 Syllabus 拼作 "Smitwick"，OCW 其他頁與領域慣例為 **Quinn Smithwick**（曾任職 Disney Research / MIT Media Lab），本書用 Smithwick 無誤。
- ✅ 第10章 = Lec11「Coded imaging」—— **正確**。Lec11 同節尚含「Wishlist for photography（攝影願望清單）」與論文寫作指引，若第10章未收，可斟酌補一小節（非必要）。

---

## 2. Lecture 7 結論與建議

### 查明事實
- **Lec7 官方主題**（Syllabus 逐字）：
  - "IR imaging (guest lecture)"
  - "Tomography and 3D techniques (guest lecture)"
  - 兩節皆為客座講座，Syllabus **未列講者姓名**。
- **OCW 材料狀態**：Lecture Notes 頁下載表中出現的講次為 **1, 2, 3, 4, 5, 6, 8, 9, 10, 11**。**Lecture 7 完全不出現**——沒有 scribed notes、沒有 audio、沒有 slides、沒有 video。這與現有製作筆記缺 Lec7、章號從 Lec6 跳到 Lec8 的現象一致：**缺口源頭是 OCW 本身即未釋出 Lec7 任何內容**（客座講座常因版權/未錄製而不公開）。

### 建議：**在前言明講不涵蓋（不要補章）**
理由：
1. 本計畫規範以官方一手材料為權威，而 OCW 對 Lec7 **零材料**。若補章只能仰賴外部二手資料重建，違反「不臆造、以一手為準」原則，且無法對應該堂客座講者實際講授內容。
2. Lec7 兩主題（紅外線熱成像 IR imaging、斷層掃描與 3D 技術 Tomography/3D）與其他章有部分外緣重疊：IR/多光譜與第8章（波長與色彩、hyperspectral）相鄰；Tomography/3D 與第9章（醫學與科學計算成像 survey，客座 Lanman/Athale）相鄰。讀者不會出現理解斷層。
3. **具體做法**：在 `00-preface.md`（或 README 課綱對照表）新增一句說明——「Lecture 7（IR imaging 與 Tomography/3D techniques，兩節皆客座講座）於 MIT OCW 未釋出任何講義、音訊或影片，故本書不另立專章；相關主題的部分概念可參見第8章（紅外線／多光譜脈絡）與第9章（斷層掃描等科學成像 survey）。」
4. （選配，非必要）若日後想補：可在第8或第9章加一個「延伸：Lec7 未公開主題」的小方框，用一兩句中性描述 IR imaging 與 tomography 的定位，並明確標註「MIT OCW 無此堂材料」。**不建議**憑外部資料寫成完整一章。

---

## 3. Transient Imaging／飛秒雷射／看穿轉角 —— 對應講次結論

### 查明事實
- 在 OCW Syllabus 全頁中：**"transient" 一詞不出現**；**"femtosecond" 出現「一次」**，且位於**課程描述（願景段落）**，原文脈絡為課程將「develop new algorithms to exploit unusual optics, programmable wavelength control, and **femto-second** accurate photon counting…」。
- 各講次標題／描述中，**沒有任何一講**以 transient imaging、femto-photography、looking around corners（看穿轉角）、ultra-fast imaging 為正式主題。
- Lecture 1 官方定位為 "fast-forward preview of all topics"（快速預覽所有主題／研究願景）。

### 結論
- **Transient Imaging／飛秒／看穿轉角並非本課程（Fall 2009）的正式講次**，OCW 無對應 Lecture。它只在 **課程願景描述** 與 **Lec1 的 fast-forward 研究前瞻** 中作為 Raskar 團隊的研究方向被「預告」。
- 時序佐證（背景，非權威判斷）：Raskar 團隊的 femto-photography／transient imaging／looking-around-corners 代表性成果主要於 **2011–2012 年後** 發表，晚於本 2009 課程；故 2009 課無專講合理。
- **建議**：本書 ch1（`01-introduction.md`）若已「預告但未成章」transient imaging，屬**忠實反映 Lec1 的研究前瞻性質**，正確做法是——在 ch1 該處以一句話標明「此為課程願景／研究前瞻，非本課程正式講次，OCW 無對應講義」，**不需為其補立專章**。切勿因 ch1 提到就誤以為存在 Lec7 或某遺漏講次。

---

## 4. 給計畫的三點總結

1. **Lec7 缺口 = OCW 本身缺**，建議前言明講「不涵蓋」而非補章。
2. **附錄=Lec10、第10章=Lec11 對應皆正確**；Lec12 為專題發表不需成章；實質授課為 Lec1–11，本書章節覆蓋完整（唯缺 Lec7）。
3. **Transient/飛秒/看穿轉角非正式講次**，僅屬 Lec1 願景預告，ch1 應標註其性質，不補章。

---

## 5. 來源清單

所有來源於 2026-07-12 存取並查核。

| # | 標題 | URL | 發布 | 存取/查核日 |
|---|------|-----|------|------|
| S1 | Computational Camera and Photography（課程首頁），MIT OCW | https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/ | Fall 2009 | 2026-07-12 |
| S2 | Syllabus（課程行事曆，含 LEC1–12 逐列主題、Lec7 = IR imaging + Tomography/3D、femtosecond 於描述段） | https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/syllabus/ | Fall 2009 | 2026-07-12 |
| S3 | Lecture Notes（下載表：實際有材料者為 LEC 1,2,3,4,5,6,8,9,10,11；Lec7、Lec12 無任何下載） | https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/lecture-notes/ | Fall 2009 | 2026-07-12 |
| S4 | Lecture 6: Cameras for human-computer interaction (HCI)（確認 HCI 屬 Lec6） | https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/resources/mitmas_531f09_lec06_3/ | Fall 2009 | 2026-07-12 |
| S5 | Coded imaging（Lec11 資源，確認第10章對應） | https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/resources/mitmas_531f09_lec11_1/ | Fall 2009 | 2026-07-12 |
| S6 | Photography Wishlist（Lec11 資源） | https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/resources/mitmas_531f09_lec11_2/ | Fall 2009 | 2026-07-12 |
| S7 | Internet Archive 鏡像（MIT MAS.531/MAS.131 Fall 2009，交叉比對用） | https://archive.org/details/MITMAS_531F09 | — | 2026-07-12 |

> 備註：Lec7 客座講者姓名於 OCW 各頁 **未具名**，標記 `待查`；因該堂無任何 OCW 材料，姓名亦無法自一手來源確認。
