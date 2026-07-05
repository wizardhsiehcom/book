# 閱讀筆記：Lecture 2 — Tabular MDP Planning

---

## 基本資料

| 欄位 | 內容 |
|---|---|
| **講次** | 02 |
| **標題** | Tabular MDP Planning |
| **逐字稿路徑** | `data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Tabular MDP Planning I 2024 I Lecture 2 [gHdsUUGcBC0].txt` |
| **閱讀日期** | 2026-07-05 |
| **Byte 數** | 64,655 |
| **狀態** | 已成章 |

---

## 逐字稿完整閱讀紀錄

已從頭到尾完整閱讀全文（單行格式，約 64,655 bytes）。內容涵蓋：課前 refresh 問題、折扣因子複習、MRP 分析解法、迭代解法、MDP 正式定義、策略定義、策略評估、Q 函數、政策搜尋空間大小、策略迭代（含單調改進定理完整證明）、價值迭代、Bellman 算子、壓縮映射定理完整證明、有限 Horizon 情形、Monte Carlo 策略評估，以及課末名詞複習。無跳過任何段落。

---

## 本講主問題

本講聚焦的核心問題是：**在已知完整 MDP 模型（動態模型 + 獎勵函數）的前提下，如何有效率地計算好的決策策略？** 具體分為兩個子問題：（1）給定一個固定策略，如何評估其期望折扣回報（Policy Evaluation）；（2）如何在所有可能策略中找到最優策略（Policy Control）。講者特別強調具備**單調改進保證**的演算法的重要性——每一次迭代都必須讓策略不差，而非在好壞之間震盪。本講以 Tabular 設定（有限狀態、有限動作、可逐一維護數值）為前提，建立 Policy Iteration 與 Value Iteration 兩套完整的演算法框架，並給出收斂性的嚴格數學證明，為後續進入無模型和函數逼近奠定理論基礎。

---

## 核心概念 table

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| **MRP 的解法（解析 vs. 迭代）** | 解析解：$V = (I - \gamma P)^{-1}R$；迭代解：逐步更新直至收斂 | 第 2.1 節，展示兩種方法 |
| **MDP 正式定義** | 五元組 $(S, A, P, R, \gamma)$，動態與獎勵均為狀態與動作的函數 | 第 2.2 節，以 Mars Rover 舉例 |
| **策略（Policy）** | 確定性 $\pi: S \to A$ 或隨機性 $\pi(a\|s)$；MDP + 策略 = MRP | 第 2.2 節 |
| **Bellman 方程（策略版）** | $V^\pi(s) = \sum_a \pi(a\|s)[R(s,a) + \gamma\sum_{s'}P(s'\|s,a)V^\pi(s')]$ | 第 2.3 節，含遞迴直觀 |
| **Q 函數（狀態-動作價值函數）** | $Q^\pi(s,a) = R(s,a) + \gamma\sum_{s'}P(s'\|s,a)V^\pi(s')$ | 第 2.3 節，策略改進的關鍵工具 |
| **Policy Iteration** | 交替做 Policy Evaluation + Policy Improvement；每次迭代單調改進 | 第 2.4 節，含完整演算法與單調改進定理 |
| **單調改進定理** | $V^{\pi_{i+1}}(s) \geq V^{\pi_i}(s)\ \forall s$；至多 $\|A\|^{\|S\|}$ 次迭代收斂 | 第 2.4 節，含完整證明 |
| **Bellman Backup 算子** | $B[V](s) = \max_a[R(s,a) + \gamma\sum_{s'}P(s'\|s,a)V(s')]$ | 第 2.5 節 |
| **壓縮映射定理** | Bellman backup 是 $\gamma$-壓縮映射；$\|BV - BV'\|_\infty \leq \gamma\|V - V'\|_\infty$ | 第 2.5 節，含完整證明 |
| **Value Iteration** | 反覆應用 Bellman backup 直至 $V$ 停止改變；每輪是最優有限 Horizon 解 | 第 2.5 節，與 Policy Iteration 對比 |
| **Monte Carlo 策略評估** | 模擬軌跡求平均回報；誤差 $O(1/\sqrt{n})$；不需要顯式 Markov 結構 | 第 2.6 節 |
| **有限 Horizon 規劃** | Value Iteration 天然給出每個 Horizon 的最優值；各步的策略可能隨時間步不同 | 第 2.6 節 |

---

## 重要細節

### 定義

**MRP 解析解**（矩陣方程）：
$$V = R + \gamma P V \implies V = (I - \gamma P)^{-1} R$$
- 要求矩陣 $(I - \gamma P)$ 可逆；計算複雜度 $O(|S|^3)$（矩陣求逆）
- 狀態空間大時不實用，引出迭代法

**MRP 迭代解**（動態規劃）：
$$V^k(s) = R(s) + \gamma \sum_{s'} P(s' \mid s) V^{k-1}(s'), \quad \forall s$$
- 初始化 $V^0 = 0$；每輪複雜度 $O(|S|^2)$

**MDP 定義**：五元組 $(S, A, P(s' \mid s, a), R(s, a), \gamma)$

**策略（Policy）**：$\pi(a \mid s)$（隨機）或 $\pi: S \to A$（確定性）

**Bellman 方程（策略 $\pi$）**：
$$V^\pi(s) = \sum_a \pi(a \mid s) \left[ R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) V^\pi(s') \right]$$

**Q 函數**：
$$Q^\pi(s, a) = R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) V^\pi(s')$$
關係：$V^\pi(s) = \sum_a \pi(a \mid s) Q^\pi(s, a)$

**最優策略性質**（無限 Horizon Tabular MDP）：
- 存在唯一最優價值函數 $V^*$
- 最優策略必定是穩態的（stationary，不依賴時間步）
- 最優策略可能不唯一（存在同值 tie 時）；但在無 tie 情形下唯一

**策略空間大小**：確定性策略共 $|A|^{|S|}$ 個（Mars Rover 案例：$2^7 = 128$）

**Bellman Backup 算子**：
$$[BV](s) = \max_a \left[ R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) V(s') \right]$$

**Bellman Backup 算子（策略版）**：
$$[B^\pi V](s) = \sum_a \pi(a \mid s) \left[ R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) V(s') \right]$$

---

### 演算法

**Policy Iteration（虛擬碼）**：
```
初始化：對所有 s，隨機設定 π(s)
while L1-norm(π_new - π_old) ≠ 0:
    # 步驟 1：Policy Evaluation
    解出 V^π（解析解 or 迭代至收斂）
    計算 Q^π(s, a) = R(s,a) + γ Σ_{s'} P(s'|s,a) V^π(s')
    # 步驟 2：Policy Improvement
    π_new(s) = argmax_a Q^π(s, a)，對所有 s
```

**Value Iteration（虛擬碼）**：
```
初始化：V(s) = 0，對所有 s
while max_s |V^{k+1}(s) - V^k(s)| > ε:
    for all s in S:
        V^{k+1}(s) = max_a [ R(s,a) + γ Σ_{s'} P(s'|s,a) V^k(s') ]
# 收斂後提取策略：
π(s) = argmax_a [ R(s,a) + γ Σ_{s'} P(s'|s,a) V*(s') ]
```

---

### 定理與保證

**單調改進定理（Policy Improvement Theorem）**

*陳述*：設 $\pi_{i+1}(s) = \arg\max_a Q^{\pi_i}(s, a)$，則對所有狀態 $s$：
$$V^{\pi_{i+1}}(s) \geq V^{\pi_i}(s)$$

*證明概要*：

1. 首先建立一步改進：
$$V^{\pi_i}(s) = Q^{\pi_i}(s, \pi_i(s)) \leq \max_a Q^{\pi_i}(s, a) = Q^{\pi_i}(s, \pi_{i+1}(s))$$

2. 展開 $Q^{\pi_i}(s, \pi_{i+1}(s))$：
$$= R(s, \pi_{i+1}(s)) + \gamma \sum_{s'} P(s' \mid s, \pi_{i+1}(s)) V^{\pi_i}(s')$$

3. 遞迴應用步驟 1 於 $V^{\pi_i}(s')$：
$$\leq R(s, \pi_{i+1}(s)) + \gamma \sum_{s'} P(s' \mid s, \pi_{i+1}(s)) \max_a Q^{\pi_i}(s', a)$$

4. 持續展開直至無窮步：每一步都引入一個 $\leq$ 替換（舊策略 → 最優 Q），最終極限恰等於 $V^{\pi_{i+1}}(s)$（永遠遵循 $\pi_{i+1}$）。

*收斂*：確定性策略共 $|A|^{|S|}$ 個；每次改進要麼改進值（不重複同一策略）要麼停止。因此最多 $|A|^{|S|}$ 次迭代後停止。若 $\pi^*$ 唯一，策略一旦不再改變則永遠不再改變。

---

**壓縮映射定理（Bellman Backup Contraction）**

*陳述*：當 $\gamma < 1$ 時，Bellman backup 算子 $B$ 是 $\ell_\infty$-壓縮映射：
$$\|BV - BV'\|_\infty \leq \gamma \|V - V'\|_\infty$$

*證明*：

$$\|BV - BV'\|_\infty = \max_s \left| \max_a [R(s,a) + \gamma \sum_{s'} P(s'|s,a)V(s')] - \max_{a'} [R(s,a') + \gamma \sum_{s'} P(s'|s,a')V'(s')] \right|$$

第一個不等式：兩個 max 可以合成一個（允許兩者用同一動作 $a$，分別對 $V$、$V'$ 取差），差值只會更大或相等：
$$\leq \max_s \max_a \left| \gamma \sum_{s'} P(s'|s,a) [V(s') - V'(s')] \right|$$

第二個不等式：每個 $|V(s') - V'(s')| \leq \|V - V'\|_\infty$，因此可提出：
$$\leq \gamma \max_s \max_a \sum_{s'} P(s'|s,a) \|V - V'\|_\infty$$

由於 $\sum_{s'} P(s'|s,a) = 1$，得：
$$= \gamma \|V - V'\|_\infty$$

*推論*：由壓縮映射不動點定理，Value Iteration 收斂到唯一不動點 $V^*$，與初始化無關。

---

### Monte Carlo 策略評估

給定策略 $\pi$，已知動態模型，可直接模擬 $n$ 條軌跡：
- 在狀態 $s$ 出發，按 $\pi$ 執行到 Horizon，記錄折扣累積回報
- 取平均值作為 $V^\pi(s)$ 的估計
- 精確度：由 Hoeffding 不等式（存疑：ASR 轉寫為 "hting"）或 Bernstein 不等式可得誤差 $O(1/\sqrt{n})$
- **優點**：不需要顯式 Markov 結構（部分可觀察情境也適用）；適合超大狀態空間

---

### 講者舉例與 Q&A 亮點

- **折扣因子提問（課前 Poll）**：「大折扣因子 $\gamma$ 代表短期獎勵更重要」——答案為**偽**，$\gamma$ 接近 1 代表長期獎勵更受重視。
- **為何從 Tabular MDP 開始**：Brunskill 強調 Tabular 讓每個核心概念都能明確看到；AlphaGo、RLHF 都建立在這些基礎之上。
- **Invalid actions Q&A**：Mars Rover 中 try-left 在 $s_1$ 不移動，只是失敗留在原地；一般可設定每個狀態的合法動作集合不同。
- **Policy Iteration 中早停**：若有時間限制，可在任意迭代停止，已有單調改進保證（各輪都比上一輪好）。
- **Value Iteration 是否有單調改進保證**：Brunskill 明確說「Value Iteration does not necessarily have the monotonic improvement property」——每輪是最優有限 Horizon 解，但非「越來越好的完整策略」。
- **第一不等式解釋（Q&A）**：將兩個分離 max 合成一個，相當於限制兩組都用同一動作；若原本兩組選了不同動作，合成後差值只會縮小，故為 $\leq$。
- **有限 Horizon 下最優策略是否為 Stationary？**：留作課後思考題與作業。

---

## 對「學會做決策」的意義

本講是整門課的**理論基石**。它回答了「給定模型，能否有系統地找到最優策略」這個基本問題，答案是**可以，且可以給出形式保證**。Policy Iteration 的單調改進定理說明，我們不需要枚舉所有 $|A|^{|S|}$ 個策略，只需循序改進；壓縮映射定理說明 Value Iteration 的收斂性與唯一性。更深遠的意義在於：這些結果確立了「更多計算 → 更好決策」的原則，這個原則在後續 Model-Free RL（學習未知模型）和深度 RL（函數逼近）中都保持核心地位。

---

## ASR 存疑名詞 table

| 原始 ASR 文字 | 推測正確術語 | 推理依據 |
|---|---|---|
| "markup decision process" | Markov Decision Process（MDP）| 全文反覆出現，語境為 MDP 定義 |
| "markof" / "markof reward process" | Markov / Markov Reward Process | 音似；與 MRP 語境一致 |
| "markof for word process" | Markov Reward Process（MRP）| "Reward" 被誤轉為 "word"（音似） |
| "hting inequality" | Hoeffding inequality | 音似縮寫；與 Bernstein 並列，均為集中不等式 |
| "sun ID" | SUNet ID | Stanford University Network student ID |
| "rhf" | RLHF | 縮寫，語境為 ChatGPT 訓練方法 |
| "bman back" / "bman backup operator" | Bellman backup operator | "Bell-" 前綴被略去或壓縮 |
| "halts" / "Halt" | halts（停止迭代）| 正確，無疑問 |
| "pii" / "pi I" | $\pi_i$（第 $i$ 次迭代策略）| 語音讀出希臘字母加下標 |
| "the L1 Norm" | $\ell_1$-norm | 正確；用於偵測策略是否改變 |
| "the L Infinity norm" | $\ell_\infty$-norm | 正確；用於 Bellman 壓縮映射証明 |
| "the bell bone backup" | the Bellman backup | 音似誤讀 |

---

## 跨章連結

| 連結方向 | 說明 |
|---|---|
| **← 第 1 章** | MRP 定義、折扣因子、回報公式、Mars Rover 例子、評估 vs 控制的區分，均在本講延伸；$V^\pi$ 與 $G_t$ 概念直接沿用 |
| **→ 第 3 章（待補）** | 無模型（Model-Free）情形：Dynamic Programming 假設已知 $P, R$，下一步進入不知道模型的 Q-Learning、TD Learning |
| **→ 後續章節** | Policy Gradient 是本講 Policy Search 想法的深度延伸；Value Iteration → DQN；Bellman 方程貫穿全課 |
| **→ 作業** | Policy Iteration 和 Value Iteration 的程式碼實作；有限 Horizon 下最優策略是否 Stationary 的推導 |

---

## 相關教材

| 來源 | 章節 / 位置 | 備註 |
|---|---|---|
| Sutton & Barto, *Reinforcement Learning* | 第 3 章（MDP）、第 4 章（Dynamic Programming）| 待核對 |
| Lecture slides | 待補 | |
| Assignment 1 | 待補 | Policy Iteration、Value Iteration 程式碼 |

---

## 資訊不足與待補清單

| 項目 | 說明 | 優先度 |
|---|---|---|
| Slides 鏈接 | 未提供 PDF 或課程網站路徑 | 中 |
| Assignment 1 確認 | 逐字稿中提到作業但未給出編號 | 中 |
| Value Iteration 單調改進的精確條件 | 講者提到 VI 不保證單調，但未給出正式說明 | 高 |
| 有限 Horizon 最優策略是否 Stationary | 留作作業，筆記中未完整討論 | 中 |
| 壓縮映射：不動點唯一性的完整拓撲論證 | 講者只給了直觀，未完整引用 Banach 定理 | 低 |
| Hoeffding vs Bernstein 的適用條件比較 | 僅一筆帶過，未展開 | 低 |

---

## 修訂紀錄

| 日期 | 動作 | 執行者 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 1 worker |
