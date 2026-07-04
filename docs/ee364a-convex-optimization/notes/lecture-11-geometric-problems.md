# EE364a 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：11
- 章節標題：Experiment Design & Geometric Problems
- 對應逐字稿：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 11 [trs0RI39uWI].en.txt
- 完整閱讀日期：2026-07-04
- 閱讀者：Antigravity Worker
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：1
- 終點：1923
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。

## 本講主問題

探討如何最佳化感測器的選擇以最小化估計誤差（實驗設計），以及如何將各種幾何問題（如計算兩多面體距離、求包覆集合的最小體積橢球、求集合內最大體積橢球）建構為凸優化問題並探討其計算複雜度與對稱性。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Relaxed Experiment Design | 將整數次數的實驗選擇放寬為連續的比例，使最佳化問題變為凸優化。 | 在書稿中說明整數規劃的放寬技巧，以及實務上的捨入（rounding）做法與下界保證。 |
| D-optimal Design | 最小化估計誤差協方差矩陣的行列式對數（即最小化信心橢球體積）。 | 列為實驗設計問題的核心範例。 |
| Lowner-John Ellipsoid | 包覆一個集合的最小體積橢球。對於以頂點給定的多面體是可解的，對於以不等式給定的多面體是 NP-hard。 | 介紹逆映射的參數化技巧。 |
| Maximum Volume Inscribed Ellipsoid | 內接於集合的最大體積橢球。對於以不等式給定的多面體是可解的，以頂點給定則是 NP-hard。 | 與最小包覆橢球對比，說明描述方式與難度的奇妙對稱性。 |
| Lowner-John Theorem (近似定理) | 任何有界的凸集合都能被橢球以 $n$ 的縮放因子（對稱集合為 $\sqrt{n}$）上下界夾住。 | 說明橢球作為凸集合「萬能近似器」的幾何意義與控制理論應用。 |

## 重要細節

- 定義：D-optimal design、Lowner-John ellipsoid、Chebyshev center、Analytic center。
- 定理／性質：Lowner-John Theorem、多面體橢球問題的 NP-hard 邊界。
- 公式：信心橢球體積正比於 $\det(A^{-1})$，最佳化目標為 $\max \log\det B$ 或 $\min \log\det A^{-1}$。
- 演算法：Ellipsoidal Peeling（利用橢球邊界點尋找並剔除離群值）。
- 板書推導：將橢球參數化時，利用 SVD 以及正交矩陣相乘，證明不失一般性可假設參數矩陣為對稱正定。
- 講者例子與幾何直覺：無人機感測器預算分配；單純形（Simplex）是最難被橢球近似的形狀。
- 應用場景：測量排程、去除資料離群值、機器人安全運行區域的橢球近似。
- 問答重點：如何選擇要移除的離群值？Boyd 引導出利用對偶變數（dual variables）來挑選對模型最具影響力的限制式。
- 容易忽略的提醒：不同的橢球參數化方式（正向映射與逆映射）會決定優化問題是否為凸。有 supremum 的凸優化問題仍可能是 NP-hard。

## 求解與建模的意義

說明這一講對「辨識並求解凸優化問題」的實際幫助：

- 這一講讓你能辨識／建模什麼問題：如何放寬（relax）整數規劃；如何針對幾何形狀（多面體、橢球）建模。
- 需要理解哪些最優性或對偶條件：透過對偶變數的大小判斷限制式的重要性。
- 會影響哪些後續章節：引出解析中心（Analytic Center），為後續的內點法（Interior-point methods）鋪墊。

## 書稿章節草稿

請見 11-geometric-problems.md

## 跨章連結

- 前置章節：機率分布與共變異數估計、對偶性（Dual variables 的應用）。
- 後續章節：內點法（Analytic center）。
- 需要回頭補充的術語：NP-hard、SVD、Dual Variables 應用。
- 需要新增的圖表：Lowner-John 橢球、橢球近似單純形的幾何示意圖。

## 相關教材與作業

- 對應 slides（`data/EE364A/course material/slids/`）：待補
- 對應教科書章節／頁碼（`Convex Optimization` PDF）：待補
- Assignment / 考試關聯（course.md，標學期版本）：待補
- 材料狀態：待補
- 缺少的材料或 URL：無

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 對應教科書章節 | Convex Optimization PDF | 待補 |
| Slides 對應 | 課程 Slides | 待補 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 完成逐字稿分析與初稿 |

## Worker 回報欄

章節 worker 完成後，需在最終回報中列出：

- 完整閱讀的逐字稿檔名：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 11 [trs0RI39uWI].en.txt
- 逐字稿總行數：1923
- 本講實際講題：Experiment Design & Geometric Problems
- 新增或修改檔案：/docs/ee364a-convex-optimization/notes/lecture-11-geometric-problems.md, /docs/ee364a-convex-optimization/11-geometric-problems.md
- 本講核心概念：Relaxed Experiment Design, Lowner-John Ellipsoid, Maximum Volume Inscribed Ellipsoid, Ellipsoidal Approximations
- 需要主控 agent 複查的點：各名詞翻譯（如：橢球剝離、解析中心）是否符合全書統一風格。
- 缺少的材料或需要使用者提供的 URL：Slides 與作業對應。
- 是否使用外部資料：否。
