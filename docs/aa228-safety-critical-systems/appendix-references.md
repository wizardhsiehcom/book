# 附錄：參考資料與延伸閱讀 (References)

本附錄整理全書引用的主要外部資源，依「官方資源」「論文與白皮書」「事件與資料」三類編排。所有條目均經核實（驗證日期：2026-07-10）；書中提及但尚未能確認原始出處的資料（例如 Robert Moss 的「多場景 AST 框架」原始論文）標為待查，不收錄於本表。

---

## 官方資源

| 資源 | 說明 | 連結 |
|---|---|---|
| **AA228V / CS238V 課程網站** | Stanford「Validation of Safety Critical Systems」官方網站，含課程說明、課表與講義材料 | <https://aa228v.stanford.edu/> |
| **官方課程影片播放列表** | Stanford Online 於 YouTube 公開的 17 支課程影片（2025 年班為主，上傳於 2025 年；另含一支 2026 年班的可解釋性講次，上傳於 2026-04） | <https://www.youtube.com/playlist?list=PLoROMvodv4rOq1LMLI8U7djzDb8--xpaC> |
| **教科書《Algorithms for Validation》** | Mykel J. Kochenderfer, Sydney M. Katz, Anthony L. Corso, Robert J. Moss 著，MIT Press（© 2026，ISBN 9780262056014）。本書各章對應此教科書第 1–12 章。官方網站提供免費 PDF（CC-BY-NC-ND 授權） | <https://algorithmsbook.com/validation/> |
| **姊妹教科書《Algorithms for Decision Making》** | Mykel J. Kochenderfer 等著（MIT Press）。本課程多處引用的決策理論（MDP、POMDP、強化學習）之系統性參考書 | <https://algorithmsbook.com/> |

---

## 論文與白皮書

### 失效分析與否證（第 5–10 章相關）

- **自適應壓力測試（AST）原始論文**（第 7 章）
  Ritchie Lee, Mykel J. Kochenderfer, Ole J. Mengshoel, Guillaume P. Brat, Michael P. Owen,〈Adaptive Stress Testing of Airborne Collision Avoidance Systems〉, IEEE/AIAA Digital Avionics Systems Conference (DASC), 2015。
  <https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/20160005033.pdf>（NASA NTRS，2015-09-13）

- **責任感知安全（RSS, Responsibility-Sensitive Safety）**（第 7 章）
  Mobileye 提出的道路交通規則形式化模型，用於界定事故中的責任歸屬。原始論文：Shalev-Shwartz, Shammah &amp; Shashua,〈On a Formal Model of Safe and Scalable Self-driving Cars〉（arXiv:1708.06374，2017 年發布）。<https://arxiv.org/abs/1708.06374>（驗證日期：2026-07-11）

- **DiFS：基於擴散模型的失效採樣**（第 7 章）
  Harrison Delecki, Marc R. Schlichting, Mansur Arief, Anthony Corso, Marcell Vazquez-Chanlatte, Mykel J. Kochenderfer,〈Diffusion-Based Failure Sampling for Evaluating Safety-Critical Autonomous Systems〉，發表於 IEEE International Conference on Engineering Reliable Autonomous Systems (ERAS) 2025。
  <https://arxiv.org/abs/2406.14761>（arXiv 初版 2024-06-20）

### 可解釋性（第 14–15 章相關）

- **顯著圖的合理性檢查**（第 14 章）
  Adebayo, Gilmer, Muelly, Goodfellow, Hardt &amp; Kim,〈Sanity Checks for Saliency Maps〉（NeurIPS 2018）——指出許多顯著圖方法無法通過模型/資料隨機化測試的經典論文。<https://papers.neurips.cc/paper/8160-sanity-checks-for-saliency-maps.pdf>（驗證日期：2026-07-11）

- **Anthropic〈Scaling Monosemanticity〉**（第 15 章）
  Templeton et al.,〈Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet〉, Transformer Circuits Thread, 2024-05-21。以稀疏自編碼器（SAE）萃取可解釋特徵，「金門大橋」特徵鉗制實驗即出於此。
  <https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html>
  示範模型「Golden Gate Claude」公告：<https://www.anthropic.com/news/golden-gate-claude>（2024-05-23）

- **Anthropic〈On the Biology of a Large Language Model〉**（第 15 章）
  Lindsey et al., Transformer Circuits, 2025-03-27。以歸因圖追蹤「Dallas → Texas → Austin」兩跳推理的電路追蹤研究；方法論姊妹篇〈Circuit Tracing: Revealing Computational Graphs in Language Models〉同日發表。
  <https://transformer-circuits.pub/2025/attribution-graphs/biology.html>

### Hamilton-Jacobi 可達性（第 16 章相關）

- **HJ 可達性綜述**
  Bansal 等人,〈Hamilton-Jacobi Reachability: A Brief Overview and Recent Advances〉綜述（2017）。
  <https://arxiv.org/abs/1709.07523>

- **時間相依 HJI 公式的經典論文**
  Mitchell, Bayen, Tomlin, IEEE Transactions on Automatic Control, 2005——後向可達管的 Hamilton-Jacobi-Isaacs 提法（第 16 章 HJI PDE 之標準形式來源）。
  <https://www.cs.ubc.ca/~mitchell/Papers/publishedIEEEtac05.pdf>

- **視覺型控制器的閉迴路可達性壓力測試**
  Bansal 實驗室論文（第 16 章飛機滑行／TaxiNet 案例的原始出處）。
  <https://arxiv.org/abs/2309.13475>

---

## 事件與資料

- **2017 年南韓浦項地震**（第 7 章）
  2017-11-15，浦項發生 Mw 5.4 地震。南韓政府委託調查（2019-03）認定由鄰近增強型地熱系統（EGS）的流體注入觸發，為全球已知 EGS 場址相關最大的誘發地震。
  Science 論文：<https://www.science.org/doi/10.1126/science.aat6081>（2018）；事件概述：<https://en.wikipedia.org/wiki/2017_Pohang_earthquake>

- **1986 年喀麥隆尼奧斯湖（Lake Nyos）災難**（第 7 章）
  1986-08-21，尼奧斯湖發生湖底翻騰噴發（limnic eruption），突然釋出大量 CO₂，窒息致死 1,746 人與約 3,500 頭牲畜。
  <https://en.wikipedia.org/wiki/Lake_Nyos_disaster>；<https://www.britannica.com/event/Lake-Nyos-disaster>

- **2018 年 Uber ATG 自駕測試車事故**（第 7 章）
  2018-03-18，亞利桑那州 Tempe，Elaine Herzberg 身亡——首例自駕車撞死行人事故。NTSB 調查（HWY18MH010，2019-11）指出：感測器在撞擊前 5.6 秒即偵測到行人，失效在**感知分類軟體**（反覆重分類、始終未辨識為行人），且原廠自動緊急煞車被停用。
  NPR 報導：<https://www.npr.org/2019/11/07/777438412/feds-say-self-driving-uber-suv-did-not-recognize-jaywalking-pedestrian-in-fatal->（2019-11-07）；事件概述：<https://en.wikipedia.org/wiki/Death_of_Elaine_Herzberg>

- **全球升溫情境數據（Climate Action Tracker / IPCC）**（第 7 章）
  現有政策路徑：CAT 2025-11-13 更新估計約 **2.6°C**（2021–2024 年評估為約 2.7°C）；若 140 餘國淨零承諾全數兌現，樂觀情境中位數約 1.9°C。「超過 4°C」對應 IPCC AR6 極高排放情境 SSP5-8.5（2081–2100 年最佳估計 +4.4°C）。
  CAT：<https://climateactiontracker.org/publications/warming-projections-global-update-2025/>（2025-11-13）；IPCC AR6 WG1 SPM：<https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/>（2021-08）
