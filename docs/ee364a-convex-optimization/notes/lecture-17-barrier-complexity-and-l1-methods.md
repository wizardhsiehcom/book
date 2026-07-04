# EE364a 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：17
- 章節標題：Barrier Method Complexity & L1 Methods for Cardinality Problems
- 對應逐字稿：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 17 [vcTIA2X0UVk].en.txt
- 完整閱讀日期：2026-07-04
- 閱讀者：Antigravity Chapter Worker
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：1
- 終點：1872
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。

## 本講主問題

本講分為兩個主要部分。第一部分旨在探討障礙法 (Barrier Method) 的複雜度理論，透過自協和 (self-concordance) 理論證明其牛頓步數具有理論上限，並將其推廣至廣義錐不等式 (如半正定錐) ；第二部分則探討如何處理本質上是組合優化 (NP-hard) 的基數 (cardinality) 問題，並說明為何 L1 範數可以作為強大的凸啟發式算法，以實現稀疏性 (sparsity) 設計。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 障礙法複雜度 | 利用自協和性質，給出每次更新障礙參數 $t \to \mu t$ 所需的牛頓步數上界。 | 在理論分析段落簡述其結果，強調 $\mu$ 的權衡。 |
| 廣義對數 (Generalized Logarithm) | 將對數障礙函數推廣到廣義錐（如非負象限、半正定錐、二階錐），其梯度與內積具備特定度數 (degree) $\theta$。 | 定義並給出半正定錐 $\log\det$ 的例子。 |
| 原對偶內點法 (Primal-Dual IPM) | 現代商用求解器的主流方法，不區分內外迴圈，直接同時更新原變數與對偶變數。 | 作為實務補充簡短說明。 |
| 基數問題 (Cardinality) | 限制或最小化向量中非零元素的個數，為非凸且 NP-hard 的組合問題。 | 定義問題並說明其困難度。 |
| L1 範數與稀疏性 | 透過 L1 範數（或對非負變數的總和）作為基數的凸近似，促使求解結果產生稀疏解。 | 透過航太結構設計、濾波器、特徵選擇與離群值處理等實例進行解說。 |

## 重要細節

- 定義：基數函數 $\text{card}(x)$ 定義為向量 $x$ 中非零元素的個數。廣義對數函數需滿足凹性，且在射線上的行為類似對數。
- 定理／性質：$\langle Y, \nabla \log\det(Y) \rangle = n$，這裡 $n$ 就是半正定錐的 degree。在複雜度分析中，總約束個數 $m$ 會被廣義不等式的總度數 $\sum \theta_i$ 所取代。
- 公式：障礙法單步牛頓步數上界包含 $\mu - 1 - \log \mu$ 等項次。
- 演算法：Primal-dual homogeneous embedding (Stanford 的發展，應用於各種現代求解器中)。
- 講者例子與幾何直覺：航太結構 (Space frame) 設計，給定 100 萬根可選的桿件，透過 L1 範數正則化，最終可能只選用 322 根；處理測量離群值時，允許 $K$ 個測量值完全錯誤，透過引入稀疏的誤差向量 $w$ 並最小化其 L1 範數來忽略離群值。
- 應用場景：Sparse design、特徵選擇 (feature selection)、處理離群值 (handling outliers)、最小化違反約束的個數 (minimum number of violations)。
- 容易忽略的提醒：對於非負變數，L1 範數其實就是 $\sum x_i$，因此在一些早期論文中可能看不到 L1 範數的字眼，但本質上就是在做 L1 正則化。

## 求解與建模的意義

說明這一講對「辨識並求解凸優化問題」的實際幫助：

- 這一講讓你能辨識／建模什麼問題：能夠辨識需要「稀疏性」或「選擇」的組合優化問題，並用 L1 範數建立其凸優化近似模型。
- 需要理解哪些最優性或對偶條件：障礙法中 KKT 條件的近似求解，以及原對偶方法對 KKT 系統的依賴。
- 會影響哪些後續章節：為實際應用與 L1 正則化的進階技巧打下基礎。

## 書稿章節草稿

（將寫於 `17-barrier-complexity-and-l1-methods.md`）

## 跨章連結

- 前置章節：第 15、16 講 (內點法基礎與中心路徑)。
- 後續章節：後續關於具體應用或 L1 相關的總結。
- 需要回頭補充的術語：自協和 (self-concordance)。
- 需要新增的圖表：基數函數的形狀示意。

## 相關教材與作業

此段只建立關聯，不提供作業解答。若材料尚未核對或資訊不足，必須保留 `待補`，不可自行腦補。

- 對應 slides（`data/EE364A/course material/slids/`）：待補
- 對應教科書章節／頁碼（`Convex Optimization` PDF）：待補
- Assignment / 考試關聯（course.md，標學期版本）：待補
- 材料狀態：待補
- 缺少的材料或 URL：待補

## 資訊不足與待補清單

遇到本地沒有、使用者未提供、或無法可靠取得的資訊時，列在這裡，不要寫成已確認事實。

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 對應投影片與作業 | 課程 slides 和作業列表 | 待補 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 無 | 無 | 無 | 否 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 根據 Lecture 17 逐字稿建立 |

## Worker 回報欄

章節 worker 完成後，需在最終回報中列出：

- 完整閱讀的逐字稿檔名：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 17 [vcTIA2X0UVk].en.txt
- 逐字稿總行數：1872
- 本講實際講題：Barrier Method Complexity and L1 Methods for Convex Cardinality Problems
- 新增或修改檔案：`docs/ee364a-convex-optimization/notes/lecture-17-barrier-complexity-and-l1-methods.md`, `docs/ee364a-convex-optimization/17-barrier-complexity-and-l1-methods.md`
- 本講核心概念：障礙法理論複雜度、廣義對數與錐不等式、Primal-Dual 內點法簡介、基數問題的 L1 凸近似與稀疏性應用。
- 需要主控 agent 複查的點：L1 方法的各個應用場景建模是否準確。
- 缺少的材料或需要使用者提供的 URL：Slides 與 Homework 對應關係。
- 是否使用外部資料：否。
