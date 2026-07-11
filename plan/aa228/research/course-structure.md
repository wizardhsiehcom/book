# AA228V 課程結構查證報告（R1）

驗證日期：2026-07-10。來源分級：官方 > 產業 > 新聞 > 社群；本報告採納的事實全部來自官方來源（Stanford 課程網站/課表、官方 YouTube 播放列表、教科書官方 PDF）。

---

## 查證結論（先給答案）

1. **本書現行章號順序與真實授課順序不符。** 真實的 2025 年冬季授課順序（有官方課表日期佐證）是：Falsification（最佳化→規劃）→ Corso 客座 → Failure Distribution → Importance Sampling → Adaptive IS → **然後才是** Reachability（線性→非線性→離散）→ Explainability → Bansal 客座 → Runtime Monitoring。本書把三章 Reachability 排在第 05–07 章（且離散在最前），Falsification 排在 08–09 章，與課程實際順序相反，這正是書中內文指涉錯亂的原因（「Reachability for Linear Systems」開頭說『過去的章節主要討論了失效分析』完全吻合真實順序：它前面是六講失效分析；「Discrete Reachability」接續泰勒模型也吻合：它真實位置在 Nonlinear Reachability 之後）。

2. **兩支同名「Explainability」影片來自不同年班。** 播放列表第 14 支（IKSQ7IxBLxQ，2025-04-07 上傳）是 2025 冬季 Sydney Katz 的 Explainability 講次；第 17 支（_U0EUX2E3k0，2026-04-10 上傳，講者為 TA Romeo Valentin）是 **2026 冬季** 的 Explainability 講次（2026 課表 3/3「Explainability (Romeo)」），後來被追加到同一播放列表。兩者對應同一教科書章（第 11 章），內容互補而非嚴格的 Part 1/2。

3. **教科書《Algorithms for Validation》共 12 章 + 4 附錄**（Kochenderfer, Katz, Corso, Moss；MIT Press，© 2026，ISBN 9780262056014）。本書 17 講中 13 講可一對一或多對一映射到教科書 1–12 章（見對應表）；3 講為客座、無教科書章。

4. **神經網路驗證：課程有、但影片未公開；教科書無獨立章。** 2025 冬季 2/20 有 Min Wu 的「neural network verification」客座講座（官方課表明載），但該講**不在**官方 YouTube 播放列表中（截至 2026-07-10 未公開，影片連結：待查）。教科書中對應內容為 **§9.7 Neural Networks**（第 9 章 Reachability for Nonlinear Systems 內的一節，且被 2025 課表列為該週進階閱讀）與 **附錄 C Neural Representations**。本書 ch1/ch17 的預告即指此客座講座；因無公開影片，全書無對應章是合理的，建議在相關章節加註說明並指向教科書 §9.7 與附錄 C。

5. **建議全書章節順序**：改採 2025 冬季真實授課順序（同時也是教科書章序），並把 2026 年班的 Explainability 緊接在 2025 年班 Explainability 之後。新舊對照表見「查證結論」末節。

---

## 講次順序證據

### 證據一：2025 冬季官方課表（最高權重）

來源：AA228V 官方網站「Schedule」連結指向的 Google Sheet（sheet ID `1rD7CccwMG-G7ZtNm74x8GUuspNZ6mDSFfEvjfmIDi9c`），由 Wayback Machine 2025-02-17 與 2025-04-07 的 aa228v.stanford.edu 快照證實為 2025 冬季當時官網所連結之課表。2025 冬季上課時間：週二/四 1:30–2:50pm，Skilling Room 80，自 2025-01-07 起（Wayback 快照原文）。授課：Mykel Kochenderfer、Sydney Katz（TA 群含 Robert Moss、Francois Chaubard）。

| # | 日期（2025） | 講次主題 | 教科書閱讀 | 進階閱讀（不考） |
|---|---|---|---|---|
| 1 | 1/7 | Introduction | Ch 1 | |
| 2 | 1/9 | System Modeling | 2.1–2.3, 2.5 | 2.4 |
| 3 | 1/14 | Property Specification | 3.1–3.3 | |
| 4 | 1/16 | Property Specification | 3.4–3.6 | 3.6 |
| 5 | 1/21 | Falsification through Optimization | Ch 4 | |
| 6 | 1/23 | Falsification through Planning | Ch 5 | 5.1, 5.3.2 |
| 7 | 1/28 | 客座：adaptive stress testing（Anthony Corso） | — | |
| 8 | 1/30 | Failure Distribution | Ch 6 | 6.3.3, 6.3.4, 6.4 |
| 9 | 2/4 | Importance Sampling | Ch 7 | 7.5, 7.6 |
| 10 | 2/6 | Adaptive Importance Sampling | Ch 7 | 7.5, 7.6 |
| 11 | 2/11 | Reachability for Linear Systems | Ch 8 | |
| 12 | 2/13 | Reachability for Nonlinear Systems | Ch 9 | 9.5, **9.7** |
| 13 | 2/18 | Discrete Reachability | Ch 10 | 10.3, 10.4.3 |
| 14 | 2/20 | **客座：neural network verification（Min Wu）** | — | |
| 15 | 2/25 | Explainability | Ch 11 | |
| 16 | 2/27 | 客座：Somil Bansal | — | |
| 17 | 3/4 | Runtime Monitoring | Ch 12 | |
| 18 | 3/6 | 客座：Lane Macintosh（Tesla Autopilot）、Jesse Hoogland（Timaeus） | — | |
| — | 3/11, 3/13 | Final Project Lightning Talks | — | |

（週次備註：Quiz 1 範圍 Ch 1–6、Quiz 2 範圍 Ch 7–10，與上述進度一致。）

### 證據二：官方 YouTube 播放列表（Stanford Online）

播放列表 `PLoROMvodv4rOq1LMLI8U7djzDb8--xpaC`，以 yt-dlp 於 2026-07-10 讀取，共 17 支，播放列表序號與上傳日期如下：

| 播放列表 # | 影片標題（節錄） | 影片 ID | 上傳日期 |
|---|---|---|---|
| 01 | Introduction & Overview | hE9iWwMZANE | 2025-02-21 |
| 02 | System Modeling | 6-qnwn23Iq4 | 2025-04-07 |
| 03 | Property Specification 1 | AgZH1k9yObs | 2025-04-07 |
| 04 | Property Specification 2 | rBGh5uJhAmo | 2025-04-07 |
| 05 | Falsification through Optimization | iO6OACXaF1Q | 2025-04-07 |
| 06 | Falsification through Planning | 162ToWqAMnc | 2025-04-07 |
| 07 | Guest Lecture: Anthony Corso, Terra AI | v6edojW2vJI | 2025-04-07 |
| 08 | Failure Distribution | 7bZcHXJIaUo | 2025-04-07 |
| 09 | Importance Sampling | mzl8uer5qUc | 2025-04-07 |
| 10 | Adaptive Importance Sampling | qspZyUkolbA | 2025-04-07 |
| 11 | Reachability for Linear Systems | jwR2excDAJo | 2025-04-07 |
| 12 | Reachability for Nonlinear Systems | KsR5zqAS_GE | 2025-04-07 |
| 13 | Discrete Reachability | GysI7p6y1Hs | 2025-04-07 |
| 14 | Explainability | IKSQ7IxBLxQ | 2025-04-07 |
| 15 | Guest Lecture: Somil Bansal, Stanford | OU67A1tyfmc | 2025-04-07 |
| 16 | Runtime Monitoring | uDaHF-rIXb0 | 2025-04-07 |
| 17 | Explainability | _U0EUX2E3k0 | **2026-04-10** |

播放列表 #1–#16 的排列與 2025 課表授課順序**完全一致**（客座 Min Wu 與 3/6 兩位客座未公開）。#17 為事後追加：其影片描述列出講者「Romeo Valentin, TA, Stanford University」（yt-dlp 讀取描述，驗證日期 2026-07-10），對照 2026 冬季官方課表 3/3「Explainability (Romeo)」，可確認為 **2026 年班**講次。

### 證據三：2026 冬季課表（佐證第二支 Explainability 與課序穩定性）

來源：現行 aa228v.stanford.edu「Schedule」連結之 Google Sheet（sheet ID `1abqRaImmCEy7p5XKknAhVRqQB6VjOXRtJ4u2vZEosFY`），2026-07-10 讀取。2026 年班順序與 2025 年班相同（Falsification → Failure Distribution → IS/AIS → Reachability 線性→非線性→離散 → Explainability → Runtime Monitoring），其中 3/3 為「Explainability (Romeo)」、2/26 客座改為 Linn Bieske（Waymo）、另有 2/12「Ratio of Normalizing Constants」（教科書 7.5–7.6）獨立成講。這再次證實「先失效分析、後可達性」是本課程的固定教學順序。

### 證據四：書中內文一致性（內部佐證）

- 「Reachability for Linear Systems」開頭『過去的章節主要討論了失效分析』：在真實順序中，此講前面正是 Falsification ×2、Failure Distribution、IS、AIS 共 5–6 講失效分析。吻合。
- 「Discrete Reachability」開頭『前一章探討了連續系統可達性』並接續泰勒模型：真實順序中它緊接在 Reachability for Nonlinear Systems（泰勒模型為 §9.3）之後。吻合。

---

## 教科書對應表

教科書：《Algorithms for Validation》，Mykel J. Kochenderfer, Sydney M. Katz, Anthony L. Corso, Robert J. Moss。MIT Press（© 2026，ISBN 9780262056014，印刷版即將出版）；官方免費 PDF（CC-BY-NC-ND）於 algorithmsbook.com/validation，本次查證所用 PDF 版本建置時間戳 2026-02-08，共 441 頁。

教科書完整目錄（自官方 PDF 抽取，驗證日期 2026-07-10）：

| 章 | 標題 |
|---|---|
| 1 | Introduction |
| 2 | System Modeling |
| 3 | Property Specification |
| 4 | Falsification through Optimization |
| 5 | Falsification through Planning |
| 6 | Failure Distribution |
| 7 | Failure Probability Estimation（7.2 Importance Sampling、7.3 Adaptive Importance Sampling、7.4 Sequential Monte Carlo、7.5 Ratio of Normalizing Constants、7.6 Multilevel Splitting） |
| 8 | Reachability for Linear Systems |
| 9 | Reachability for Nonlinear Systems（9.3 Taylor Models、9.5 Optimization-Based、**9.7 Neural Networks**） |
| 10 | Reachability for Discrete Systems |
| 11 | Explainability |
| 12 | Runtime Monitoring |
| 附錄 | A Systems、B Mathematical Concepts、**C Neural Representations**、D Julia |

**本書 17 講 ↔ 教科書章節對應**（本書章檔案位於 `docs/aa228-safety-critical-systems/`）：

| 本書現行章 | 講次 | 教科書章節 |
|---|---|---|
| 01 Introduction | 2025/1/7 | Ch 1 |
| 02 System Modeling | 2025/1/9 | Ch 2（2.1–2.3, 2.5；進階 2.4） |
| 03 Property Specification 1 | 2025/1/14 | 3.1–3.3 |
| 04 Property Specification 2 | 2025/1/16 | 3.4–3.6 |
| 05 Discrete Reachability | 2025/2/18 | Ch 10（教科書章名為 Reachability for Discrete Systems） |
| 06 Reachability for Linear Systems | 2025/2/11 | Ch 8 |
| 07 Reachability for Nonlinear Systems | 2025/2/13 | Ch 9 |
| 08 Falsification through Optimization | 2025/1/21 | Ch 4 |
| 09 Falsification through Planning | 2025/1/23 | Ch 5 |
| 10 Failure Distribution | 2025/1/30 | Ch 6 |
| 11 Importance Sampling | 2025/2/4 | Ch 7（主要 7.1–7.2） |
| 12 Adaptive Importance Sampling | 2025/2/6 | Ch 7（主要 7.3–7.4；7.5–7.6 為進階） |
| 13 Runtime Monitoring | 2025/3/4 | Ch 12 |
| 14 Explainability 1 | 2025/2/25（Katz） | Ch 11 |
| 15 Explainability 2 | 2026/3/3（Valentin，2026 年班） | Ch 11 |
| 16 Guest: Somil Bansal | 2025/2/27 | 無對應章（主題屬 Hamilton-Jacobi reachability，與 Ch 8–9 相關） |
| 17 Guest: Anthony Corso | 2025/1/28 | 無對應章（adaptive stress testing，與 Ch 5 falsification through planning 相關） |

---

## 神經網路驗證

- **課程有此講次**：2025 冬季 2/20（Week 7），官方課表明載「Guest lecture on neural network verification (Min Wu)」。Min Wu 為 Stanford CS 博士後（cs.stanford.edu/~minwu/），研究領域即神經網路驗證。
- **影片**：不在官方 YouTube 播放列表（17 支中無此講）；截至 2026-07-10 未找到公開影片。影片連結：**待查（極可能未公開發布，僅 Panopto/Canvas 校內可看）**。
- **教科書**：**無獨立的 NN 驗證章**。相關內容為 §9.7「Neural Networks」（第 9 章 Reachability for Nonlinear Systems 之一節；2025 課表將其列為 2/13 該講的進階閱讀）與附錄 C「Neural Representations」。
- **對本書的含意**：ch1 與 ch17 預告的 NN 驗證主題確實存在於課程，但因無公開影片，本書無對應章是資料限制而非遺漏。建議：(a) 在 ch1/ch17 的預告處改寫為「該講為未公開之客座講座」，(b) 在 Reachability for Nonlinear Systems 章節加註指向教科書 §9.7 與附錄 C。

---

## 建議章節順序（新舊對照）

依據：2025 冬季官方課表（證據一）＝官方播放列表序（證據二）＝教科書章序（1→12），三者互相印證；書中內文的前後指涉（證據四）亦僅在此順序下成立。

| 新章號 | 章名 | 舊章號 | 現行檔名 |
|---|---|---|---|
| 01 | Introduction | 01 | （不變） |
| 02 | System Modeling | 02 | （不變） |
| 03 | Property Specification 1 | 03 | （不變） |
| 04 | Property Specification 2 | 04 | （不變） |
| 05 | Falsification through Optimization | **08** | 08-falsification-optimization.md |
| 06 | Falsification through Planning | **09** | 09-falsification-planning.md |
| 07 | Guest: Anthony Corso（adaptive stress testing） | **17** | 17-guest-corso.md |
| 08 | Failure Distribution | **10** | 10-failure-distribution.md |
| 09 | Importance Sampling | **11** | 11-importance-sampling.md |
| 10 | Adaptive Importance Sampling | **12** | 12-adaptive-importance-sampling.md |
| 11 | Reachability for Linear Systems | **06** | 06-linear-reachability.md |
| 12 | Reachability for Nonlinear Systems | **07** | 07-nonlinear-reachability.md |
| 13 | Discrete Reachability | **05** | 05-discrete-reachability.md |
| 14 | Explainability 1 | 14 | （不變） |
| 15 | Explainability 2（2026 年班，Romeo Valentin） | 15 | （不變） |
| 16 | Guest: Somil Bansal | 16 | （不變） |
| 17 | Runtime Monitoring | **13** | 13-runtime-monitoring.md |

說明與備選：

- 新 07（Corso 客座）依 2025 實際授課日（1/28）插在 Falsification 之後、Failure Distribution 之前；其主題 adaptive stress testing 正是 falsification through planning 的延伸，內容銜接自然。若偏好「客座集中在書末」的現行風格，備選方案是僅重排核心 13 章（教科書 1–12 章順序），客座維持 16/17 兩章殿後——但那樣 Runtime Monitoring 之後的收尾感較弱。
- 新 14/15：嚴格按時間，2025 年班順序是 Explainability(2/25) → Bansal(2/27) → Runtime Monitoring(3/4)，而 Explainability 2 是 2026 年班影片；本表把兩講 Explainability 相鄰以維持主題連貫（皆對應教科書 Ch 11），Bansal 客座（HJ reachability 相關）放其後、Runtime Monitoring 收尾（同教科書以 Ch 12 收尾）。
- 無論採哪個方案，**至少必須**把 Reachability 三章（含順序改為線性→非線性→離散）移到 Falsification／Failure Distribution／IS／AIS 之後，否則書中大量前後指涉（見證據四）都是錯的。

---

## 來源清單

| # | 來源 | 等級 | URL | 原文發布日期 | 驗證日期 |
|---|---|---|---|---|---|
| 1 | AA228V/CS238V 官方網站（現行，2026 冬季版） | 官方 | https://aa228v.stanford.edu/ | 2026 年班更新（確切日期待查） | 2026-07-10 |
| 2 | AA228V 官網 Wayback 快照（2025 冬季版首頁） | 官方（存檔） | http://web.archive.org/web/20250217074629/https://aa228v.stanford.edu/ | 快照 2025-02-17 | 2026-07-10 |
| 3 | AA228V 官網 Lecture Materials 頁 Wayback 快照（含 2025 課表 Sheet 連結） | 官方（存檔） | http://web.archive.org/web/20250407210408/https://aa228v.stanford.edu/lecture-materials/ | 快照 2025-04-07 | 2026-07-10 |
| 4 | 2025 冬季官方課表 Google Sheet | 官方 | https://docs.google.com/spreadsheets/d/1rD7CccwMG-G7ZtNm74x8GUuspNZ6mDSFfEvjfmIDi9c/ | 2025 冬季（隨學期更新） | 2026-07-10（CSV 匯出讀取） |
| 5 | 2026 冬季官方課表 Google Sheet | 官方 | https://docs.google.com/spreadsheets/d/1abqRaImmCEy7p5XKknAhVRqQB6VjOXRtJ4u2vZEosFY/ | 2026 冬季（隨學期更新） | 2026-07-10（CSV 匯出讀取） |
| 6 | 官方 YouTube 播放列表（Stanford Online） | 官方 | https://www.youtube.com/playlist?list=PLoROMvodv4rOq1LMLI8U7djzDb8--xpaC | 影片上傳 2025-02-21 / 2025-04-07 / 2026-04-10 | 2026-07-10（yt-dlp 讀取） |
| 7 | 2025 年班 Explainability 影片（Katz） | 官方 | https://www.youtube.com/watch?v=IKSQ7IxBLxQ | 2025-04-07 | 2026-07-10 |
| 8 | 2026 年班 Explainability 影片（Valentin） | 官方 | https://www.youtube.com/watch?v=_U0EUX2E3k0 | 2026-04-10 | 2026-07-10 |
| 9 | 《Algorithms for Validation》官方頁 | 官方 | https://algorithmsbook.com/validation/ | 2025（preprint 公開；確切日期待查） | 2026-07-10 |
| 10 | 《Algorithms for Validation》官方 PDF（目錄抽取來源） | 官方 | https://algorithmsbook.com/validation/files/val.pdf | PDF 建置時間戳 2026-02-08 | 2026-07-10 |
| 11 | 教科書 GitHub（algorithmsbooks/validation） | 官方 | https://github.com/algorithmsbooks/validation | — | 2026-07-10 |
| 12 | MIT Press 書目頁（ISBN 9780262056014） | 官方 | https://mitpress.mit.edu/9780262056014/algorithms-for-validation/ | — | 2026-07-10（頁面 403，ISBN 由搜尋結果與 Penguin Random House 書目佐證：https://www.penguinrandomhouse.com/books/830494/ ） |
| 13 | Min Wu 個人頁（Stanford CS） | 官方 | https://cs.stanford.edu/~minwu/ | — | 2026-07-10（未逐頁核對講座列表：其講座頁內容待查） |

待查事項：Min Wu 客座講座影片是否存在任何公開版本（目前判定未公開）；2025/3/6 Tesla/Timaeus 客座影片同樣未公開。
