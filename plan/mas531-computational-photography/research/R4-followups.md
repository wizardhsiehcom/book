# R4：2009 課程技術的「後續發展」時間錨點素材（截至 2026）

研究 agent：R4
查核日期：2026-07-12
用途：為書中 2009 年的預測/技術補上「後續發展」小註。本檔僅提供時間線素材，**不改寫書中 2009 年的歷史敘述**。

---

## 1. Lytro（史丹佛光場相機商品化）

**可用於小註的重點：**
Lytro 由史丹佛博士生 Ren Ng 於 2006 年創立，把光場相機從實驗室推向消費市場。第一款口袋型光場相機（可拍後對焦）於 2012 年 2 月 29 日開賣（8GB/16GB，約 US$400 起）；第二代面向專業使用者的 Lytro Illum 於 2014 年 4 月發表（約 US$1,600）。消費相機市場反應不佳，公司於 2015 年轉向 VR/影視光場，最終在 2018 年 3 月宣布停業，資產與多名員工、專利轉入 Google（外傳收購金額約 US$2,500–4,000 萬）。也就是說，Lytro 這條「消費光場相機」路線失敗，但光場與深度概念被 Google 吸收，延續進了後來手機的運算攝影與深度感測。

**關鍵年份：** 創立 2006｜首款消費機 2012-02-29｜Illum 2014-04｜轉向 VR 2015｜停業／Google 收購 2018-03。

**來源：**
- Wikipedia, "Lytro" — https://en.wikipedia.org/wiki/Lytro （存取 2026-07-12｜查核 2026-07-12）
- PetaPixel, "RIP, Lytro: Light Field Camera Pioneer Officially Shuttering", 2018-03-28 — https://petapixel.com/2018/03/28/rip-lytro-light-field-camera-pioneer-officially-shuttering/ （存取 2026-07-12｜查核 2026-07-12；確認停業日 2018-03-28 與 Google 收購約 US$25–40M）
- Road to VR（Google 收購與清算報導） — https://roadtovr.com/report-google-acquires-light-field-company-lytro-move-hire-employees/ （存取 2026-07-12）

備註：首款機開賣日、Illum 售價、創立年在 Wikipedia 與 LightField Forum timeline 皆一致；停業日 Wikipedia 記 3/27、PetaPixel 記 3/28（宣布與生效之差），小註可寫「2018 年 3 月」。

---

## 2. GelSight（第 7 章 Retrographic Sensing 的後續）

**可用於小註的重點：**
書中的 retrographic sensing（用彈性膠層＋相機把觸覺變成影像）後來由 MIT 的 Edward Adelson 團隊做成 GelSight。首個原型約 2009 年由 Micah Johnson 與 Adelson 提出；GelSight Inc. 於 2011 年成立（麻州 Waltham），把技術商品化。今日已有兩大落地方向：一是**工業量測／檢測**（航太焊道、刮痕、腐蝕、螺孔量測的手持式 GelSight Mobile/Max 等），二是**機器人觸覺**——推出小型觸覺感測器 GelSight Mini，並與 Meta AI 合作：2020–2021 年的 DIGIT 低成本觸覺感測器，到 2024 年 10 月 31 日發表更進階、可 360 度感測的 Digit 360（能偵測小至 1 毫牛頓的力）。也就是說，2009 年的「把觸覺變成影像」構想，如今已成商用產品，並成為機器人靈巧操作與 AI 觸覺研究的標準工具之一。

**關鍵年份：** 原型 2009｜GelSight Inc. 成立 2011｜與 Meta DIGIT 2020–2021｜Digit 360 2024-10-31。

**來源：**
- GelSight 官方 About — https://www.gelsight.com/about/ （存取 2026-07-12；產品線與應用領域）
- MIT News, "Giving robots a sense of touch", 2017-06-05 — https://news.mit.edu/2017/gelsight-robots-sense-touch-0605 （存取 2026-07-12）
- MDPI Sensors 2017, "GelSight: High-Resolution Robot Tactile Sensors"（記首個原型 2009、Adelson MIT 出身） — https://www.mdpi.com/1424-8220/17/12/2762 （存取 2026-07-12）
- The Robot Report, "GelSight, Meta AI release Digit 360…", 2024 — https://www.therobotreport.com/gelsight-meta-ai-release-digit-360-tactile-sensor-for-robotic-fingers/ （存取 2026-07-12）
- BusinessWire, "GelSight and Meta AI Introduce Digit 360 Tactile Sensor", 2024-10-31 — https://www.businesswire.com/news/home/20241031980322/en/ （存取 2026-07-12；確認 Digit 360 發表日與 1mN 靈敏度）

備註：成立年 2011 由 Tracxn/CBInsights 等企業資料庫佐證，可再以第二來源覆核（此為次要事實）。

---

## 3. 運算攝影落地手機（多鏡頭、人像景深、夜景合成、ToF）

**可用於小註的重點：**
2009 年課程講的多幀合成、深度估計、去模糊等運算攝影技術，2010 年代後幾乎全部成了手機標配，代表性里程碑：
- **2014**：Google 相機的 HDR+ 多幀堆疊，奠定「連拍多張再合成」的主流路線。
- **2016**：Apple iPhone 7 Plus 首次以雙鏡頭做「人像模式」景深虛化（bokeh），把光學大光圈效果用計算模擬。
- **2018 年 11 月**：Google Pixel「Night Sight」夜景模式，用多幀長曝＋運動補償在無閃燈下拍出亮而清晰的夜景，成為業界夜景合成的標竿（Apple 隨後於 2019 年 iPhone 11 跟進 Night Mode）。
- **2020**：Apple iPhone 12 Pro 內建 LiDAR（一種 ToF 深度感測器），用於低光對焦與夜間人像景深；ToF/結構光深度感測在此前後成為旗艦機常見配置。

也就是說，2009 年還在實驗室與專用相機上的運算攝影，到 2016–2020 年間已成為主流智慧型手機的內建功能，運算（而非鏡頭大小）成為手機拍照品質的主軸。

**關鍵年份：** HDR+ 2014｜人像模式 2016（iPhone 7 Plus）｜Night Sight 2018-11（Pixel 3）｜手機 ToF/LiDAR 2020（iPhone 12 Pro）。

**來源：**
- arXiv 2102.09000, "Mobile Computational Photography: A Tour"（HDR+、Night Sight、Super-Res Zoom 綜述） — https://arxiv.org/pdf/2102.09000 （存取 2026-07-12）
- Android Central, "What is computational photography?" — https://www.androidcentral.com/phones/computational-photography （存取 2026-07-12；人像/夜景/ToF 說明）
- PhoneArena / 9to5Mac 對 iPhone 12 Pro LiDAR 2020 的報導 — https://9to5mac.com/2020/11/17/iphone-12-pro-night-mode-portraits/ （存取 2026-07-12）

備註：iPhone 7 Plus 人像模式 2016、Pixel Night Sight 2018-11 為業界公認里程碑年份，可再各補一則官方/主流媒體以求兩來源。

---

## 4. Coded aperture / Wavefront coding / 計算攝影的商業與研究落地

**可用於小註的重點：**
波前編碼（wavefront coding，用相位板＋反卷積擴展景深）由 Colorado 的 Cathey 與 Dowski 提出，成立 CDM-Optics 商品化，2005 年被影像感測器大廠 OmniVision 收購，推出以此為基礎的「TrueFocus」手機相機晶片——是課程時代前後少數真正進入量產的計算光學路線。編碼孔徑（coded aperture）與相位編碼則長期活躍於學術界，用於擴展景深、被動測距與去模糊。近年更演進為「端到端（end-to-end）計算光學」：把繞射光學元件（DOE）與深度學習去模糊一起用梯度下降聯合最佳化（如 2019–2021 年多篇 Learning Wavefront Coding、learned phase-coded aperture 研究）。也就是說，2009 年的編碼光圈/波前編碼構想，一部分變成商用感測晶片，一部分則演化成今日「光學＋神經網路共同設計」的計算成像主流研究方向。

**關鍵年份：** CDM-Optics 被 OmniVision 收購 2005（TrueFocus）｜端到端 learned wavefront/phase-coded aperture 研究 2018–2021。

**來源：**
- Wikipedia, "Wavefront coding"（CDM-Optics、2005 OmniVision 收購、TrueFocus） — https://en.wikipedia.org/wiki/Wavefront_coding （存取 2026-07-12｜查核 2026-07-12）
- arXiv 1912.13423, "Learning Wavefront Coding for Extended Depth of Field Imaging"（後刊 IEEE TIP 2021） — https://arxiv.org/pdf/1912.13423 （存取 2026-07-12）
- Optica Optics Express 2018, "Learned phase coded aperture for the benefit of depth of field extension" — https://opg.optica.org/oe/fulltext.cfm?uri=oe-26-12-15316 （存取 2026-07-12）

備註：OmniVision 收購 CDM-Optics 年份（2005）目前單一主來源（Wikipedia），屬企業關鍵事件，建議補第二來源覆核 → **待查**。

---

## 5. BiDi Screen / 光感測顯示器（第 2009 課程 MIT Media Lab 線）

**可用於小註的重點：**
BiDi Screen（Hirsch、Lanman、Holtzman、Raskar，MIT Media Lab，2009）示範了一片「會看的螢幕」——LCD 在顯示與擷取模式間切換，用光場原理讓螢幕本身做非接觸的深度/手勢感測。這條「把感測器嵌進顯示器」的研究路線後來沒有直接以 BiDi 之名商品化，但相關概念在產業中以其他形式落地：屏下指紋辨識、屏下（under-display）相機，以及把光感測/成像整合進面板的研究都可視為同一方向的延伸。Raskar 團隊本身則延續到 ALF（augmented light fields）、HR3D 等顯示與光場研究。也就是說，BiDi Screen 這個具體原型停留在研究階段，但「顯示器兼具感測能力」的想法已部分進入量產裝置。

**關鍵年份：** BiDi Screen 發表 2009（SIGGRAPH Asia / ACM TOG 28(5)）｜後續屏下感測商品化約 2018 年起（屏下指紋/屏下相機）— **商品化與 BiDi 的直接關聯屬詮釋，非因果，標 待查**。

**來源：**
- MIT Media Lab, "BiDi Screen: Depth and Lighting Aware Interactive Display" — https://www.media.mit.edu/publications/bidi-screen-depth-and-lighting-aware-interactive-display/ （存取 2026-07-12）
- MIT Camera Culture, "BiDi Screen" — http://cameraculture.media.mit.edu/cubeportfolio/bidi-screen/ （存取 2026-07-12）
- ACM TOG 28(5) 2009, doi:10.1145/1618452.1618505 — https://dl.acm.org/doi/10.1145/1618452.1618505 （存取 2026-07-12）

備註：這條線「後續發展」證據較弱：BiDi 本身未直接產品化，僅能說概念方向（屏下感測）在產業出現。小註宜保守寫「此原型停留研究階段，相關『顯示器兼感測』概念後於屏下指紋/屏下相機部分落地」，避免宣稱直接因果。

---

## 待查清單（給後續 agent / 覆核）
1. OmniVision 收購 CDM-Optics 年份（2005）補第二來源。
2. GelSight Inc. 成立年（2011）補一則官方/新聞第二來源（目前多為企業資料庫）。
3. iPhone 7 Plus 人像模式（2016）、Pixel 3 Night Sight（2018-11）各補一則 Apple/Google 官方或主流媒體確認。
4. BiDi Screen → 屏下感測 的關聯僅為概念延伸，不可寫成直接因果。
