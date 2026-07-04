# Lecture 6 閱讀筆記：具名凸優化問題類別

## 基本資料

- 章節編號：06
- 章節標題：具名凸優化問題類別（LP、QP、SOCP、GP、SDP 等 named problem classes）
- 對應逐字稿：`data/EE364A/transcripts/Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 6 [d2jF3SXcFQ8].en.txt`
- 完整閱讀日期：2026-07-04
- 閱讀者：章節 worker（Claude）
- 閱讀範圍：逐字稿第 1 行到第 1917 行（完整，無跳過）
- 是否從頭到尾完整閱讀：是
- 狀態：已完整讀完、已抽象、已成章

## 本講主問題

這一講收尾「凸優化問題的旋風之旅」。Boyd 用一整堂課把工程與統計裡最常出現、而且**有名字**的凸優化問題類別走一遍：LP、piecewise-linear minimization、Chebyshev center、linear-fractional program（含 von Neumann 成長模型）、QP、QCQP、SOCP（robust LP）、geometric program、以及以廣義不等式表述的 conic form 與 SDP。主旨是：這些名字要認得、要能一眼判斷一個問題屬於哪一類、並知道它們都能可靠地大規模求解。真正的求解演算法留待後面。

## 逐字稿完整閱讀紀錄

- 起點：第 1 行（"so today ... finish this Whirlwind tour through problems"）。
- 終點：第 1917 行（"next week we're going to do a duality ... super practical"）。
- 是否完整：是，逐行讀完。
- 跳過段落：無。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 收尾擬凸 + bisection | 前一講 quasiconvex 的收尾：$p(x)/q(x)$（分子凸非負、分母凹正）為擬凸，$p-tq$ 對固定 $t>0$ 凸；bisection 每次得「一個 bit」的資訊 | 簡述並回連 ch.05 |
| Linear Program (LP) | 極小化仿射目標於多面體上；diet problem 歷史例；matrix stuffing 的痛 | 主段 + 表 |
| Piecewise-linear min | max of affine 的極小化；用 epigraph 化成 LP | 主段 |
| Chebyshev center | 多面體內最大內接球；球在半空間 $\iff a_i^\top x_c + r\lVert a_i\rVert_2 \le b_i$；仍是 LP | 主段 + 公式 |
| Linear-fractional program | 兩仿射比值之極小化，擬凸；可化為單一 LP（perspective，非顯然） | 主段 |
| Generalized LFP / von Neumann | max-min 成長率；只能靠 bisection | 主段 |
| Quadratic Program (QP) | 凸二次目標 + 線性約束；least squares、isotonic regression、risk-adjusted cost | 主段 + 例 |
| QCQP | 凸二次不等式約束 | 帶過 |
| SOCP | $\lVert A_ix+b_i\rVert_2 \le c_i^\top x + d_i$；robust LP（ellipsoidal / 統計）皆化成 SOCP | 主段 + 公式 + 例 |
| Geometric Program (GP) | monomial / posynomial；非凸，經 $y=\log x$ 換元化成 log-sum-exp 凸問題 | 主段 + 例 |
| Conic form / SDP | 廣義不等式約束；LMI；Schur complement；最小化最大特徵值 | 主段 + 公式 |

## 重要細節

- **LP 標準化小技巧（只示範一次）**：$Ax\ge b,\ x\ge0$ 藉「乘 $-1$ + 堆疊」化成 $Gx\le h$。之後交給建模語言（matrix stuffing 由軟體代勞）。
- **等價 vs 相等**：小變換得到的是 equivalent（CS 的 reduction），不是 same problem。
- **Chebyshev center 推導**：球 $\{x_c+u:\lVert u\rVert_2\le r\}$ 在半空間 $a_i^\top x\le b_i$ $\iff \max_{\lVert u\rVert\le r} a_i^\top(x_c+u)=a_i^\top x_c + r\lVert a_i\rVert_2 \le b_i$（Cauchy–Schwarz 取等）。$\lVert a_i\rVert_2$ 是常數，故對變數 $(x_c,r)$ 是線性 → LP。中心不唯一（矩形反例）。
- **顏色警示的教學法**：看到 two-norm / 二次式該「黃燈閃」警覺不是 LP；但若 norm 的內容是 data（常數），就只是虛驚。
- **QP 幾何**：level set 是橢球面；最優條件＝負梯度是可行集外法向。可 50,000 變數、嵌入控制系統每秒解 100–1000 次、failure rate 0（Falcon 9 一級著陸跑多個 QP；過半數量化避險基金只跑 QP，數兆美元在交易）。
- **isotonic regression**：least squares + $x_1\le x_2\le\cdots$，是 QP；統計界為它寫整本書，Boyd 覺得好笑，因為「就是個 QP，一行 Python」。
- **risk-adjusted cost**：$\bar c^\top x + \gamma\, x^\top\Sigma x$，$\gamma>0$（risk averse）是 QP；$\gamma<0$（risk seeking）非凸、既蠢又不可解（missile controller 是他聽過最接近合理的 risk-seeking 例子）。「可解 / 不可解 × 該解 / 不該解」四象限往往剛好對齊。
- **SOCP 是 two-norm 不是平方**：$\lVert A_ix+b_i\rVert_2\le c_i^\top x+d_i$；A、b 為 0 時退回 LP，故 SOCP 廣義化 LP。Boyd 稱它像凸優化的「byte code / 低階語言」：高階問題被 compile 成 SOCP 再求解，全世界都在寫 SOCP solver。
- **Robust LP（ellipsoidal）**：$a_i\in\{\bar a_i+P_iu:\lVert u\rVert_2\le1\}$，要約束對所有 $a_i$ 成立 → $\bar a_i^\top x + \lVert P_i^\top x\rVert_2 \le b_i$，是 SOCP。$\lVert P_i^\top x\rVert_2$ 就是「margin」，且是 $x$ 的函數。
- **Robust LP（統計）**：$a_i\sim\mathcal N(\bar a_i,\Sigma_i)$，要 $\Pr(a_i^\top x\le b_i)\ge\eta$。用高斯 CDF $\Phi$ 單調，化成 $\bar a_i^\top x + \Phi^{-1}(\eta)\lVert\Sigma_i^{1/2}x\rVert_2 \le b_i$。**只有當 $\eta\ge1/2$（$\Phi^{-1}(\eta)\ge0$）時才是 SOCP**（凸）；$\eta<1/2$ 則不等式方向翻掉，既蠢又不可解。Boyd 的 rant：沒人真的知道尾端分布，寫 99.9% 只是「拜託讓它成立」的意思。
- **Geometric Programming 的秘密語言**：monomial（GP 意義）＝$c\prod x_i^{a_i}$，$c>0$、指數為任意實數；posynomial＝monomial 之和。**警告**：這與數學裡 1820 年起的 monomial 定義（整數指數、係數可正可負）不同，出了這個房間別亂用。GP 標準形：min posynomial s.t. posynomial $\le1$、monomial $=1$。非凸。
- **GP 換元**：令 $y_i=\log x_i$，monomial → $e^{a^\top y+b}$，posynomial → log-sum-exp of affine，取 log 後凸。故 GP 等價於凸問題。Boyd：實務領域早就在用 log（dB 功率、電路元件尺寸 1,1.4,2,4,8,16…）。1980 年代西方才發現 GP 可凸化（據說莫斯科 60 年代就知道）。
- **cantilever beam 設計例**：變數 $w,h$（各段寬高），min 總重（$w\cdot h$ 內積，是 indefinite 二次型、非凸），s.t. 尺寸/應力/末端撓度上限。撓度由 tip 往回遞推，是 posynomial。經換元變凸。
- **monomial/posynomial 的代數**：monomial×monomial=monomial；monomial+monomial→posynomial；posynomial×posynomial=posynomial；posynomial÷monomial=posynomial；posynomial÷posynomial=未知（不封閉）。
- **非凸可凸化的軼事**：Boyd 到處演講說某控制問題「大概非凸（probably）」，同事 Andy 用「對正定矩陣取逆」等變態換元兩行就化凸；幸好投影片寫了 "probably" 的小字腳註。教訓：直覺會騙人。
- **Conic form**：min $c^\top x$ s.t. $Fx+g\preceq_K 0,\ Ax=b$。$K=$ 非負卦限即 LP；$K=$ 二階錐之積即 SOCP。
- **SDP**：$\min c^\top x$ s.t. $\sum x_iF_i+G\preceq0$（symmetric matrices，負半定），此不等式稱 LMI。對角化即退回 LP。近 20–25 年在理論 CS、物理、統計變主流。
- **Schur complement**（後面作業會用）：block matrix 正半定的判準，把帶 two-norm 的非線性約束等價成 LMI；等同高斯條件化、電路端口短路/開路化簡。
- **SDP 例**：min 最大特徵值 $\lambda_{\max}(\sum x_iA_i)$ → epigraph：$\sum x_iA_i \preceq tI$，是 SDP；min 最大奇異值（induced 2-norm）亦可寫成 LMI。

## 求解與建模的意義

- 這一講讓你能**辨識**一個問題屬於 LP / QP / SOCP / GP / SDP 哪一類，並知道它可求解（甚至嵌入式即時求解）。
- 核心建模動作：epigraph（PWL→LP）、max-over-ball（Chebyshev / robust LP 的 Cauchy–Schwarz）、換元（GP 的 log）、廣義不等式（SDP 的 LMI、Schur complement）。
- 最優性 / 對偶條件本講只在 QP 幾何略提（負梯度＝外法向），完整對偶下一講（Duality）。
- 影響後續：SOCP/SDP 是後面 approximation、statistical estimation、geometric problems 的底層求解形式；robust / stochastic 建模是後續 regularization 的前奏。

## 跨章連結

- 前置章節：ch.05（quasiconvex + bisection、標準形、epigraph、equivalent vs equal）；本講開場即其收尾。
- 後續章節：Lecture 7 = Duality（Boyd 明說下週講，理論但超實用）。
- 需回頭補充的術語：perspective transformation（LFP→LP 用到，本講未展開，ch.04/05 有 perspective）；Schur complement（本講首次點名，作業會用）。
- 需要新增的圖表：問題類別的包含關係圖（LP ⊂ QP ⊂ SOCP，LP ⊂ SOCP ⊂ SDP）。

## 相關教材與作業

- 對應 slides：`data/EE364A/course material/slids/04_Convex optimization problems.pdf` 後半（named problem classes）。狀態：待核對逐字稿與投影片頁次。
- 對應教科書《Convex Optimization》（Boyd & Vandenberghe）第 4 章：LP（4.3）、QP/QCQP（4.4）、SOCP（4.4.2）、GP（4.5）、廣義不等式 / conic / SDP（4.6）。**章節號依記憶標註，頁碼待核對**。
- Assignment / 考試關聯：待補（依學期版本，集中於附錄）。
- 材料狀態：待核對。
- 缺少的材料或 URL：無需外部；投影片頁次對應待核對。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| LFP → 單一 LP 的確切變換 | 教科書 4.3.2（perspective） | 標「非顯然，細節待補」，不臆造 |
| Schur complement 的正式敘述 | 教科書附錄 A.5.5 | 只給直覺，公式待補 |
| 投影片與教科書精確頁碼 | 04 slides / PDF | 待核對 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`Stanford EE364A Convex Optimization I Stephen Boyd I 2023 I Lecture 6 [d2jF3SXcFQ8].en.txt`
- 逐字稿總行數：1917 行（讀 1–1917）。
- 本講實際講題：具名凸優化問題類別（LP / PWL / Chebyshev center / LFP / QP / QCQP / SOCP / GP / conic / SDP）。
- 新增檔案：本筆記 + `06-convex-problem-classes.md`。
- 需要主控 agent 複查的點：LFP→LP 變換、Schur complement、slides/教科書頁碼對應。
- 是否使用外部資料：否。
