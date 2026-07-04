# EE364a 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：Lecture 15
- 章節標題：Equality Constrained Minimization
- 對應逐字稿：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 15 [zVO4ccvrwrI].en.txt
- 完整閱讀日期：2026-07-04
- 閱讀者：Antigravity Agent
- 狀態：已完整讀完

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：Line 1
- 終點：Line 1874
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。

## 本講主問題

本講探討如何將牛頓法延伸至處理等式約束（Equality Constraints）的平滑凸優化問題。說明了如何藉助 KKT 系統求得牛頓步長，並點出若無法找到可行起點時，可使用不可行初始點牛頓法（Infeasible Start Newton Method）。更重要的是，本講強調了在求解過程中，妥善利用矩陣結構（如稀疏性、帶狀矩陣、對角加低秩等）能將計算複雜度從 $O(n^3)$ 大幅降至線性級別。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Equality constrained minimization | 利用牛頓法求解帶有 $Ax=b$ 約束的問題，本質上可轉換為求解一系列 KKT 系統。 | 放入核心內容。 |
| KKT system | 包含 Hessian 與約束矩陣 $A$ 的線性系統。解出此系統即可獲得牛頓步長與對偶變數。 | 放入定義與定理與核心內容。 |
| Eliminating equality constraints | 透過變數替換消除等式約束，轉為無約束問題。 | 提及但不建議盲目使用，放入核心內容。 |
| Infeasible start Newton method | 允許初始點不滿足等式約束。每次迭代不但下降目標函數，也使殘差逐漸趨零。 | 放入核心內容重點介紹。 |
| Exploiting structures | 利用 Hessian 或約束矩陣的特殊結構（對角加低秩、稀疏帶狀、拉普拉斯矩陣），可大幅降低運算時間。 | 放入求解與應用及核心內容。 |

## 重要細節

- 定義：KKT Matrix，包含了 Hessian、$A$ 和 $A^T$ 構成的方陣。
- 定理／性質：不可行初始點牛頓法中，若能踏出步長為 1 的牛頓步，則該點的殘差將降為 0，且之後的所有迭代點皆會滿足等式約束。
- 公式：KKT System: $\begin{bmatrix} \nabla^2 f(x) & A^T \\ A & 0 \end{bmatrix} \begin{bmatrix} \Delta x \\ w \end{bmatrix} = \begin{bmatrix} -\nabla f(x) \\ -(Ax - b) \end{bmatrix}$
- 演算法：Infeasible Start Newton Method. 注意在 line search 步驟中，必須確保測試點 $x + t\Delta x$ 落在目標函數 $f$ 的定義域內（如大於零），否則計算梯度與 Hessian 會報錯。
- 板書推導：無明顯特殊推導，多為矩陣展開說明 Block elimination。
- 講者例子與幾何直覺：講師以資源分配（Resource Allocation）及單一商品網路流（Single Commodity Network Flow）為例，說明稀疏矩陣及拉普拉斯矩陣的應用，展示利用結構可使問題運算極快。
- 應用場景：最佳控制（帶狀結構）、資源分配（對角加秩一結構）、電力網或圖論網路流（極稀疏拉普拉斯矩陣）。
- 問答重點：關於 line search 步長為 1 時是否會超過定義域（domain）的問題，講師重申了檢查定義域的重要性。
- 容易忽略的提醒：許多人以為將等式消除，變數減少後會解得更快，或是轉而求解對偶問題會更快。實則消除變數可能會破壞原本的稀疏結構，導致運算量暴增；只要利用了合理的線性代數技巧，不管解 Primal、Dual 還是消除變數後的系統，其本質運算量是相同的。

## 求解與建模的意義

- 這一講讓你能辨識／建模什麼問題：帶有等式約束的平滑凸優化問題。
- 需要理解哪些最優性或對偶條件：KKT 條件如何線性化產生 KKT 線性方程系統。
- 會影響哪些後續章節：這些概念是內點法（Interior-point methods）和障礙函數法（Barrier method，處理不等式約束）的核心基礎，下一講即將展開。

## 書稿章節草稿

（將寫在 `15-equality-constrained-minimization.md` 中，此處略過）

## 跨章連結

- 前置章節：無約束凸優化（Newton's Method）、KKT 條件。
- 後續章節：Interior-point methods, Barrier method (Lecture 16).
- 需要回頭補充的術語：Self-concordance 略提，Block elimination.
- 需要新增的圖表：待補

## 相關教材與作業

- 對應 slides（`data/EE364A/course material/slids/`）：待補
- 對應教科書章節／頁碼（`Convex Optimization` PDF）：待補
- Assignment / 考試關聯（course.md，標學期版本）：待補
- 材料狀態：待核對
- 缺少的材料或 URL：待補

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| slides 和作業對應 | EE364A 課程網頁資料 | 待補 |

## 外部補充

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-04 | 建立 | 讀取逐字稿後初稿 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 15 [zVO4ccvrwrI].en.txt
- 逐字稿總行數：1874
- 本講實際講題：Equality Constrained Minimization
- 新增或修改檔案：
  - docs/ee364a-convex-optimization/notes/lecture-15-equality-constrained-minimization.md
  - docs/ee364a-convex-optimization/15-equality-constrained-minimization.md
- 本講核心概念：Equality constrained minimization, KKT system, Infeasible start Newton method, Exploiting structured matrices.
- 需要主控 agent 複查的點：請確認 draft 中數學公式與中文翻譯是否符合整體書籍風格，以及結構化矩陣的應用描述是否足夠詳細。
- 缺少的材料或需要使用者提供的 URL：Slides 對應、作業對應與課本頁數（尚未核對，維持待補）。
- 是否使用外部資料：否。
