# R5 — 參考資料來源清單草稿

> 研究 agent：R5　　彙整日期：2026-07-12
> 對象書稿：`docs/mas531-computational-photography/`（14 章 + 附錄）
> 用途：可直接供 `docs/mas531-computational-photography/references.md` 回填。
> 格式：`作者. 標題. 場合, 年. URL（存取日期）`
> 所有 URL 存取日期均為 **2026-07-12**，除非另註。查不到者標 `待查`，未臆造。
> 引用格式建議：正文用作者-年份標註，References 頁依「課程本體 → 各章」分組列出。

---

## 0. 課程本體（MIT OCW）— 全書共同來源

- MIT OpenCourseWare. *MAS.531 / MAS.131 Computational Camera and Photography, Fall 2009*（講者 Ramesh Raskar）. 課程首頁. https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/ （2026-07-12）
- MIT OCW. *MAS.531 Syllabus*（含逐講進度與客座講者名單）. https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/syllabus/ （2026-07-12）
- MIT OCW. *MAS.531 Readings*（指定閱讀清單）. https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/readings/ （2026-07-12）
- MIT OCW. *MAS.531 Study Materials / Lecture videos*（各講逐字稿與影片來源）. https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/study-materials/ （2026-07-12）
- Internet Archive 鏡像（講座影片備份）. *MIT MAS.531/MAS.131 Computational Camera and Photography, Fall 2009*. https://archive.org/details/MITMAS_531F09 （2026-07-12）
- Raskar, R. *Computational Photography course website*（課程指定的背景教材主站，含 2007–2008 投影片與影片）. MIT Media Lab. https://web.media.mit.edu/~raskar/photo/ （2026-07-12）

### 逐講對照（來自 OCW Syllabus，供各章標註「對應講次」）

| 講 | 主題 | 客座講者 |
|---|---|---|
| Lec 1 | 導論與全topic快速預覽 | — |
| Lec 2 | 現代光學與透鏡；ray-matrix；語境增強影像 | — |
| Lec 3 | Epsilon Photography；單張多域相機 | Ankit Mohan |
| Lec 4 | 計算照明：對偶攝影、relighting | — |
| Lec 5 | 光場（上）；Retrographic Sensing | Micah Kimo Johnson |
| Lec 6 | 光場（下）；HCI 相機 | Matt Hirsch |
| Lec 7 | 紅外線成像；斷層掃描與 3D 技術 | — |
| Lec 8 | 波長與顏色；高光譜成像綜覽 | Ankit Mohan；Michael Stenner (MITRE) |
| Lec 9 | 醫學／科學計算成像；計算成像領域綜覽 | Douglas Lanman (Brown)；Ravi Athale (MITRE) |
| Lec 10 | 期中考；動物之眼的光學 | Quinn Smithwick |
| Lec 11 | 編碼成像；寫論文；攝影願望清單 | — |
| Lec 12 | 期末專題發表 | — |

> 註：OCW 頁面將 Lec 10 客座拼作「Quinn Smitwick」，正確拼法為 **Quinn Smithwick**（後任職 Disney Research）。

---

## 第 1 章　導論

- （綜覽性章節，主要引用課程本體 Lec 1；具體技術之一手來源見以下各章。）
- 看穿轉角／Transient Imaging 之預告：對應 Raskar 團隊後續 femto-photography 工作，本書若補章再引；此處標 **待補**。

## 第 2 章　現代光學與 Ray-Matrix、語境增強影像、多重閃光燈

- Raskar, R., Tan, K.-H., Feris, R., Yu, J., and Turk, M. *Non-photorealistic Camera: Depth Edge Detection and Stylized Rendering Using Multi-Flash Imaging*. ACM SIGGRAPH 2004（ACM TOG 23(3), pp. 679–688）. https://doi.org/10.1145/1015706.1015779 ；專案頁 https://www.merl.com/publications/TR2004-050 （2026-07-12）
- （多閃光去除高光延伸）Feris, R. et al. *Specular Highlights Detection and Reduction with Multi-flash Photography*. J. Braz. Comput. Soc.（延伸閱讀，非核心）. https://link.springer.com/article/10.1007/BF03192386 （2026-07-12）
- Ray-transfer matrix / thin lens 之基礎：屬標準光學教科書內容（如 Hecht, *Optics*），逐字稿未給特定出處，可引通用光學教材，標 **待定教材**。

## 第 3 章　Epsilon Photography ＋（下）單張多域相機

- Raskar, R., and Tumblin, J. *Computational Photography: Mastering New Techniques for Lenses, Lighting, and Sensors*（Epsilon / Coded / Essence photography 之分類框架出處）. A K Peters,（成書草稿長期於課程網站流通）. https://web.media.mit.edu/~raskar/photo/ （2026-07-12，成書年份 **待查**）
- 單張多域相機（pupil-plane filter array ＋ pinhole array）：對應 Lec 3 客座 Ankit Mohan 之研究；確切論文題名 **待查**（可能為 Agile / assorted-pixel 相關系列）。

## 第 4 章　計算照明（對偶攝影、直接／全局分離）

- Sen, P., Chen, B., Garg, G., Marschner, S. R., Horowitz, M., Levoy, M., and Lensch, H. P. A. *Dual Photography*. ACM SIGGRAPH 2005（ACM TOG 24(3), pp. 745–755）. https://doi.org/10.1145/1186822.1073257 （2026-07-12）
- Nayar, S. K., Krishnan, G., Grossberg, M. D., and Raskar, R. *Fast Separation of Direct and Global Components of a Scene Using High Frequency Illumination*. ACM SIGGRAPH 2006（ACM TOG 25(3), pp. 935–944）. https://doi.org/10.1145/1141911.1141977 ；PDF https://www.cs.columbia.edu/cg/pdfs/1156189195-Krishnan_TOG06.pdf （2026-07-12）
- （合成照明前驅）Haeberli, P. *Synthetic Lighting for Photography*. Grafica Obscura, 1992（逐字稿提及「Paul Haeberli 1992」）. http://www.graficaobscura.com/synth/ （2026-07-12，連結 **待驗**）

## 第 5 章　光場（上）：4D 光場、微透鏡陣列、事後對焦

- Ng, R., Levoy, M., Brédif, M., Duval, G., Horowitz, M., and Hanrahan, P. *Light Field Photography with a Hand-Held Plenoptic Camera*. Stanford University Computer Science Tech Report CSTR 2005-02, 2005. http://graphics.stanford.edu/papers/lfcamera/ （2026-07-12）
- Adelson, E. H., and Wang, J. Y. A. *Single Lens Stereo with a Plenoptic Camera*. IEEE TPAMI 14(2), pp. 99–106, 1992. https://persci.mit.edu/pub_pdfs/plenoptic.pdf （2026-07-12）
- Levoy, M., and Hanrahan, P. *Light Field Rendering*. ACM SIGGRAPH 1996, pp. 31–42（4D 光場雙平面參數化之經典源頭）. https://doi.org/10.1145/237170.237199 （2026-07-12）
- （全光函數概念源頭）Adelson, E. H., and Bergen, J. R. *The Plenoptic Function and the Elements of Early Vision*. In *Computational Models of Visual Processing*, MIT Press, 1991. 標 **待補連結**。
- （自適應光學 / Shack-Hartmann 波前感測）屬天文光學標準內容，逐字稿未給特定論文，標 **待補**。

## 第 6 章　光場（下）：遮罩式光場相機與外差解碼

- Veeraraghavan, A., Raskar, R., Agrawal, A., Mohan, A., and Tumblin, J. *Dappled Photography: Mask Enhanced Cameras for Heterodyned Light Fields and Coded Aperture Refocusing*. ACM SIGGRAPH 2007（ACM TOG 26(3)）. 專案頁 https://web.media.mit.edu/~raskar/Mask/ ；PDF https://web.media.mit.edu/~raskar/Mask/Sig07CodedApertureOpticalHeterodyning.pdf （2026-07-12）
- （Hadamard 多路復用 / 秤重比喻）屬經典多工感測理論，逐字稿未指定單一論文，可引 Harwit & Sloane, *Hadamard Transform Optics*, Academic Press, 1979；標 **待驗**。

## 第 7 章　感測與互動（HCI 相機、Retrographic Sensing、BiDi Screen）

- Johnson, M. K., and Adelson, E. H. *Retrographic Sensing for the Measurement of Surface Texture and Shape*. IEEE CVPR 2009, pp. 1070–1077（GelSight 前身）. 專案頁 https://people.csail.mit.edu/kimo/publications/retrographic/ ；PDF http://vigir.missouri.edu/~gdesouza/Research/Conference_CDs/IEEE_CVPR_2009/data/papers/2075.pdf （2026-07-12）
- Hirsch, M., Lanman, D., Holtzman, H., and Raskar, R. *BiDi Screen: A Thin, Depth-Sensing LCD for 3D Interaction Using Light Fields*. ACM SIGGRAPH Asia 2009（ACM TOG 28(5)）. 專案頁 http://cameraculture.media.mit.edu/cubeportfolio/bidi-screen/ （2026-07-12）
- （FTIR 多點觸控）Han, J. Y. *Low-Cost Multi-Touch Sensing Through Frustrated Total Internal Reflection*. ACM UIST 2005, pp. 115–118. https://doi.org/10.1145/1095034.1095054 （2026-07-12，連結 **待驗**）
- （後續發展註）GelSight 已商品化為觸覺感測器（GelSight Inc.），供 P2-10 時間錨點使用；商品化來源 **待查**。

## 第 8 章　波長與顏色、高光譜成像、CTIS

- Mohan, A., Raskar, R., and Tumblin, J. *Agile Spectrum Imaging: Programmable Wavelength Modulation for Cameras and Projectors*. Computer Graphics Forum（Eurographics 2008）27(2), pp. 709–717. https://diglib.eg.org/items/eeb047fb-73df-418b-b39c-61c4614dae12 （2026-07-12）
- Descour, M., and Dereniak, E. *Computed-Tomography Imaging Spectrometer: Experimental Calibration and Reconstruction Results*. Applied Optics 34(22), pp. 4817–4826, 1995（CTIS 原型）. https://opg.optica.org/ao/abstract.cfm?uri=ao-34-22-4817 （2026-07-12）
- Wagadarikar, A., John, R., Willett, R., and Brady, D. *Single Disperser Design for Coded Aperture Snapshot Spectral Imaging (CASSI)*. Applied Optics 47(10), pp. B44–B51, 2008. https://doi.org/10.1364/AO.47.000B44 ；https://opg.optica.org/ao/abstract.cfm?uri=ao-47-10-B44 （2026-07-12）
- Lec 8 客座講者投影片：Michael Stenner (MITRE)。OCW hyperspectral survey PDF：https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/42009c031a6d382a6df1e08af6241268_MITMAS_531F09_lec08_3.pdf （2026-07-12）
- **P1-8 數值查核**（水中雷射 630nm→書稿寫 420nm）：屬逐字稿數值，非本清單引用範圍；建議以水折射率 n≈1.33 交叉核對（630/1.33≈473nm），最終以逐字稿原文為準，標 **待其他 agent 核**。

## 第 9 章　計算成像綜覽（ASIS、斷層掃描、共軛焦、編碼孔徑）

- Lec 9 客座講者：Douglas Lanman (Brown)、Ravi Athale (MITRE)。Lanman CV（含相關發表）：http://mesh.brown.edu/dlanman/cv.html （2026-07-12）
- （斷層重建理論／傅立葉切片定理）Kak, A. C., and Slaney, M. *Principles of Computerized Tomographic Imaging*. IEEE Press, 1988（逐字稿提及「Slaney and Kak」）. 全書公開：https://www.slaney.org/pct/pct-toc.html （2026-07-12，連結 **待驗**）
- 編碼孔徑天文源頭見第 10 章 URA/MURA 條目。

## 第 10 章　編碼成像（Fluttered Shutter、Coded Aperture、Wavefront Coding）

- Raskar, R., Agrawal, A., and Tumblin, J. *Coded Exposure Photography: Motion Deblurring Using Fluttered Shutter*. ACM SIGGRAPH 2006（ACM TOG 25(3), pp. 795–804）. 專案頁 https://web.media.mit.edu/~raskar/deblur/ （2026-07-12）
- Levin, A., Fergus, R., Durand, F., and Freeman, W. T. *Image and Depth from a Conventional Camera with a Coded Aperture*. ACM SIGGRAPH 2007（ACM TOG 26(3), 70）. 專案頁 http://groups.csail.mit.edu/graphics/CodedAperture/ ；PDF https://webee.technion.ac.il/people/anat.levin/papers/CodedAperture-LevinEtAl-SIGGRAPH07.pdf （2026-07-12）
- Veeraraghavan et al. *Dappled Photography …*（同第 6 章；含 coded aperture refocusing）. https://web.media.mit.edu/~raskar/Mask/ （2026-07-12）
- Dowski, E. R., Jr., and Cathey, W. T. *Extended Depth of Field Through Wave-Front Coding*. Applied Optics 34(11), pp. 1859–1866, 1995（cubic phase plate）. https://opg.optica.org/ao/fulltext.cfm?uri=ao-34-11-1859 （2026-07-12）
- Dowski, E. R., Jr., and Cathey, W. T. *Single-Lens, Single-Image, Incoherent Passive Ranging Systems*. Applied Optics 33, pp. 6762–6773, 1994（課程指定閱讀）. （2026-07-12）
- Fenimore, E. E., and Cannon, T. M. *Coded Aperture Imaging with Uniformly Redundant Arrays (URA)*. Applied Optics 17(3), pp. 337–347, 1978（課程指定閱讀；編碼孔徑經典）. （2026-07-12）
- Gottesman, S. R., and Fenimore, E. E. *New Family of Binary Arrays for Coded Aperture Imaging (MURA)*. Applied Optics 28(20), pp. 4344–4352, 1989. https://ui.adsabs.harvard.edu/abs/1989ApOpt..28.4344G （2026-07-12）
- （RAT code — 團隊自創 2D 編碼）源自 Veeraraghavan et al. Dappled Photography 2007，同上專案頁。
- 背景教材：Carlisle, P. *Coded Aperture Imaging*（通俗說明，課程指定）. https://www.paulcarlisle.net/codedaperture/ （2026-07-12）

## 附錄　動物之眼（Lec 10 客座）

- Smithwick, Q. *Optics in Animal Eyes*（MAS.531 Fall 2009 Lec 10 客座講座；無獨立論文，來源為 OCW 講座影片/投影片）. 對應 OCW Study Materials Lec 10. https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/study-materials/ （2026-07-12）
- 講者背景（供作者說明）：Quinn Smithwick，後任職 Disney Research。ResearchGate 檔案：https://www.researchgate.net/scientific-contributions/Quinn-Smithwick-2049658631 （2026-07-12）

---

## 附註：待查 / 待驗清單（交下一階段）

1. Raskar & Tumblin *Computational Photography* 成書年份與正式 ISBN。
2. Lec 3 單張多域相機（Ankit Mohan）確切論文題名。
3. Haeberli 1992、Han 2005 UIST、Kak & Slaney 1988 連結有效性複驗。
4. Adelson & Bergen 1991 全光函數章節之可及連結。
5. GelSight 商品化年份與官方來源（供 P2-10 後續發展註）。
6. Hadamard 多工（Harwit & Sloane 1979）是否納入。
7. P1-8 水中雷射波長（420 vs 473nm）由逐字稿核對 agent 定案，非引用問題。
8. BiDi Screen 之 ACM TOG 正式 DOI/卷期頁碼補齊（現有專案頁）。
