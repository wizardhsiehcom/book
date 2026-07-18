# 參考資料

本頁彙整本書各章的一手來源：課程本體（MIT OpenCourseWare）與各項技術的原始論文。書中出現的規格數字（如光場相機解析度、論文年份）皆以此處來源為準。所有連結存取日期為 2026-07-12。

引用格式：`作者. 標題. 場合, 年. 連結`。

---

## 課程本體（MIT OpenCourseWare）

- MIT OpenCourseWare. *MAS.531 / MAS.131 Computational Camera and Photography, Fall 2009*（講者 Ramesh Raskar）. 課程首頁. <https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/>
- MIT OCW. *MAS.531 Syllabus*（逐講進度與客座講者）. <https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/syllabus/>
- MIT OCW. *MAS.531 Readings*（指定閱讀清單）. <https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/readings/>
- MIT OCW. *MAS.531 Study Materials*（各講講義 PDF 與影片）. <https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/study-materials/>
- Internet Archive（講座影片鏡像）. *MIT MAS.531 Computational Camera and Photography, Fall 2009*. <https://archive.org/details/MITMAS_531F09>
- Raskar, R. *Computational Photography course website*（背景教材主站）. MIT Media Lab. <https://web.media.mit.edu/~raskar/photo/>

### 逐講對照表

| 講次 | 主題 | 客座講者 | 本書對應 |
|---|---|---|---|
| Lec 1 | 導論與全主題快速預覽 | — | 第 1 章 |
| Lec 2 | 現代光學與透鏡；ray-matrix；語境增強影像 | — | 第 2 章 |
| Lec 3 | Epsilon Photography；單張多域相機 | Ankit Mohan | 第 3 章（上／下）|
| Lec 4 | 計算照明：對偶攝影、relighting | — | 第 4 章 |
| Lec 5 | 光場（上）；Retrographic Sensing | Micah Kimo Johnson | 第 5、7 章 |
| Lec 6 | 光場（下）；HCI 相機；BiDi Screen | Matt Hirsch | 第 6、7 章 |
| Lec 7 | 紅外線成像；斷層掃描與 3D 技術 | — | 未立專章（見前言）|
| Lec 8 | 波長與顏色；高光譜成像綜覽 | Ankit Mohan；Michael Stenner (MITRE) | 第 8 章 |
| Lec 9 | 醫學／科學計算成像；領域綜覽 | Douglas Lanman (Brown)；Ravi Athale (MITRE) | 第 9 章 |
| Lec 10 | 期中考；動物之眼的光學 | Quinn Smithwick | 附錄 |
| Lec 11 | 編碼成像；論文寫作；攝影願望清單 | — | 第 10 章 |
| Lec 12 | 期末專題發表 | — | 未立專章 |

> Lec 7 於 OCW 未釋出任何講義、影片或音訊，故本書不立專章（其主題已於第 8、9 章外緣涵蓋）。OCW 頁面將 Lec 10 客座拼作「Smitwick」，正確拼法為 **Quinn Smithwick**（後任職 Disney Research）。

---

## 第 1 章　導論

綜覽性章節，主要對應 Lec 1。各項技術之一手來源見對應章節。章中預告的「看穿轉角／Transient Imaging」為 Raskar 團隊後續研究願景（femto-photography 論文多發表於 2011 年後），非本課程正式講次。

## 第 2 章　現代光學與 Ray-Matrix、語境增強影像、多重閃光燈

- Raskar, R., Tan, K.-H., Feris, R., Yu, J., and Turk, M. *Non-photorealistic Camera: Depth Edge Detection and Stylized Rendering Using Multi-Flash Imaging*. ACM SIGGRAPH 2004（ACM TOG 23(3), 679–688）. <https://doi.org/10.1145/1015706.1015779>
- Ray-transfer matrix、thin lens 為標準幾何光學內容，逐字稿未指定出處，可參照 Hecht, E. *Optics*（Addison-Wesley）等通用光學教材。

## 第 3 章　Epsilon Photography 與單張多域相機

- Raskar, R., and Tumblin, J. *Computational Photography: Mastering New Techniques for Lenses, Lighting, and Sensors*（Epsilon／Coded／Essence photography 分類框架出處）. A K Peters/CRC Press. <https://web.media.mit.edu/~raskar/photo/>
- Horstmeyer, R., Euliss, G., Athale, R., and Levoy, M. *Flexible Multimodal Camera Using a Light Field Architecture*. IEEE ICCP 2009（單張多域相機系統與規格出處：Nikon 50mm f/1.8、9μm CCD、200μm 針孔陣列、16 濾波片）.

## 第 4 章　計算照明：對偶攝影與 Relighting

- Sen, P., Chen, B., Garg, G., Marschner, S. R., Horowitz, M., Levoy, M., and Lensch, H. P. A. *Dual Photography*. ACM SIGGRAPH 2005（ACM TOG 24(3), 745–755）. <https://doi.org/10.1145/1186822.1073257>
- Nayar, S. K., Krishnan, G., Grossberg, M. D., and Raskar, R. *Fast Separation of Direct and Global Components of a Scene Using High Frequency Illumination*. ACM SIGGRAPH 2006（ACM TOG 25(3), 935–944）. <https://doi.org/10.1145/1141911.1141977>
- Haeberli, P. *Synthetic Lighting for Photography*. Grafica Obscura, 1992. <http://www.graficaobscura.com/synth/>

## 第 5 章　光場（上）：4D 光場、微透鏡陣列、事後對焦

- Ng, R., Levoy, M., Brédif, M., Duval, G., Horowitz, M., and Hanrahan, P. *Light Field Photography with a Hand-Held Plenoptic Camera*. Stanford Computer Science Tech Report CSTR 2005-02, 2005（光場相機原型規格出處）. <http://graphics.stanford.edu/papers/lfcamera/>
- Adelson, E. H., and Wang, J. Y. A. *Single Lens Stereo with a Plenoptic Camera*. IEEE TPAMI 14(2), 99–106, 1992. <https://persci.mit.edu/pub_pdfs/plenoptic.pdf>
- Levoy, M., and Hanrahan, P. *Light Field Rendering*. ACM SIGGRAPH 1996, 31–42（4D 雙平面參數化經典源頭）. <https://doi.org/10.1145/237170.237199>
- Adelson, E. H., and Bergen, J. R. *The Plenoptic Function and the Elements of Early Vision*. In *Computational Models of Visual Processing*, MIT Press, 1991.

## 第 6 章　光場（下）：遮罩式光場相機與外差解碼

- Veeraraghavan, A., Raskar, R., Agrawal, A., Mohan, A., and Tumblin, J. *Dappled Photography: Mask Enhanced Cameras for Heterodyned Light Fields and Coded Aperture Refocusing*. ACM SIGGRAPH 2007（ACM TOG 26(3)）. <https://web.media.mit.edu/~raskar/Mask/>
- Harwit, M., and Sloane, N. J. A. *Hadamard Transform Optics*. Academic Press, 1979（多路復用感測理論背景）.

## 第 7 章　感測與互動：HCI 相機、Retrographic Sensing、BiDi Screen

- Han, J. Y. *Low-Cost Multi-Touch Sensing Through Frustrated Total Internal Reflection*. ACM UIST 2005, 115–118. <https://doi.org/10.1145/1095034.1095054>
- Johnson, M. K., and Adelson, E. H. *Retrographic Sensing for the Measurement of Surface Texture and Shape*. IEEE CVPR 2009, 1070–1077（GelSight 前身）. <https://people.csail.mit.edu/kimo/publications/retrographic/>
- Hirsch, M., Lanman, D., Holtzman, H., and Raskar, R. *BiDi Screen: A Thin, Depth-Sensing LCD for 3D Interaction Using Light Fields*. ACM SIGGRAPH Asia 2009（ACM TOG 28(5)）. <http://cameraculture.media.mit.edu/cubeportfolio/bidi-screen/>

## 第 8 章　波長、顏色與高光譜成像

- Mohan, A., Raskar, R., and Tumblin, J. *Agile Spectrum Imaging: Programmable Wavelength Modulation for Cameras and Projectors*. Computer Graphics Forum（Eurographics 2008）27(2), 709–717. <https://diglib.eg.org/items/eeb047fb-73df-418b-b39c-61c4614dae12>
- Descour, M., and Dereniak, E. *Computed-Tomography Imaging Spectrometer (CTIS): Experimental Calibration and Reconstruction Results*. Applied Optics 34(22), 4817–4826, 1995. <https://opg.optica.org/ao/abstract.cfm?uri=ao-34-22-4817>
- Wagadarikar, A., John, R., Willett, R., and Brady, D. *Single Disperser Design for Coded Aperture Snapshot Spectral Imaging (CASSI)*. Applied Optics 47(10), B44–B51, 2008. <https://doi.org/10.1364/AO.47.000B44>

## 第 9 章　計算成像綜覽：ASIS、斷層掃描、共軛焦、編碼孔徑

- Kak, A. C., and Slaney, M. *Principles of Computerized Tomographic Imaging*. IEEE Press, 1988（傅立葉切片定理、濾波反投影）. <https://www.slaney.org/pct/pct-toc.html>
- 客座講者：Douglas Lanman (Brown University)、Ravi Athale (MITRE)。編碼孔徑天文源頭見第 10 章 URA/MURA 條目。

## 第 10 章　編碼成像：Fluttered Shutter、Coded Aperture、Wavefront Coding

- Raskar, R., Agrawal, A., and Tumblin, J. *Coded Exposure Photography: Motion Deblurring Using Fluttered Shutter*. ACM SIGGRAPH 2006（ACM TOG 25(3), 795–804）. <https://web.media.mit.edu/~raskar/deblur/>
- Levin, A., Fergus, R., Durand, F., and Freeman, W. T. *Image and Depth from a Conventional Camera with a Coded Aperture*. ACM SIGGRAPH 2007（ACM TOG 26(3), 70）. <http://groups.csail.mit.edu/graphics/CodedAperture/>
- Dowski, E. R., Jr., and Cathey, W. T. *Extended Depth of Field Through Wave-Front Coding*. Applied Optics 34(11), 1859–1866, 1995（cubic phase plate）. <https://opg.optica.org/ao/fulltext.cfm?uri=ao-34-11-1859>
- Fenimore, E. E., and Cannon, T. M. *Coded Aperture Imaging with Uniformly Redundant Arrays (URA)*. Applied Optics 17(3), 337–347, 1978.
- Gottesman, S. R., and Fenimore, E. E. *New Family of Binary Arrays for Coded Aperture Imaging (MURA)*. Applied Optics 28(20), 4344–4352, 1989. <https://ui.adsabs.harvard.edu/abs/1989ApOpt..28.4344G>
- Carlisle, P. *Coded Aperture Imaging*（通俗說明）. <https://www.paulcarlisle.net/codedaperture/>

## 附錄　動物之眼（Lec 10 客座）

- Smithwick, Q. *Optics in Animal Eyes*. MAS.531 Fall 2009 Lecture 10 客座講座（無獨立論文，來源為 OCW 講座影片與投影片）. <https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/study-materials/>
