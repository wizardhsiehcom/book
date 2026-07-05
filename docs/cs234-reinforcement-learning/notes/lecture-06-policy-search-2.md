# 閱讀筆記：Lecture 6 — Policy Search 2

## 基本資料

- 章節編號：06
- 章節標題：Policy Search 2（策略搜尋 II）
- 對應逐字稿：`data/cs234/transcripts/Stanford CS234 Reinforcement Learning I Policy Search 2 I 2024 I Lecture 6 [8PwvNQ5WS-o].txt`
- 完整閱讀日期：2026-07-05
- 閱讀範圍：字元 0 到結尾，全文 67,115 位元組（單行無換行）
- 閱讀者：chapter worker（Batch 2）
- 狀態：已成章

---

## 逐字稿完整閱讀紀錄

- 是否從頭到尾完整閱讀：是
- 跳過段落：無
- 備註：全文為單行（ASR 無段落分隔），依語意斷句重構各主題邊界

---

## 本講主問題

本講承接 Lecture 5 的 Policy Gradient 基礎，完成基準線（Baseline）的無偏性數學證明，並引入 Actor-Critic 架構、n 步估計器以及偏差—變異數權衡。接著揭示基本 Policy Gradient 的兩大瓶頸：樣本效率低下（on-policy 限制）以及參數空間步幅與策略空間步幅的不對稱性。為克服這些問題，講師逐步推導策略績效差異引理（Performance Difference Lemma）、重要性採樣（Importance Sampling）、KL 散度約束，最終導出 Proximal Policy Optimization（PPO）的兩種變體：KL 懲罰型與目標裁剪型。

---

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 基準線無偏性 | B(s_t) 為狀態的任意函數時，期望 ∇_θ log π·B 等於零 | 完整數學證明，分三個推導步驟 |
| Vanilla Policy Gradient | 結合時間結構 + 基準線的標準算法 | 偽代碼（Algorithm 6.1） |
| Actor-Critic | Actor=策略 θ，Critic=價值函數 w；以函數近似取代 MC 回報 | 雙神經網路架構示意 |
| n 步估計器 | R̂₁（TD-like）到 R̂∞（Monte Carlo）之間的連續譜 | 偏差—變異數比較表格 |
| 策略績效差異引理 | J(π') = J(π) + E_{π'}[∑_t A^π(s_t, a_t)] | 定理框 + 直觀解釋（Stanford vs Harvard 比喻） |
| 重要性採樣 | π'(a\|s)/π(a\|s) 重加權優勢以使用舊資料 | 公式推導 + 留意狀態分佈近似誤差 |
| KL 散度 | 量測兩策略行動分布差異；D_KL(π\|\|π') ≥ 0，不對稱 | 定義 + 策略空間距離的幾何意義 |
| PPO（KL 懲罰型） | 最大化 L̂(π') - C · E_s[KL(π\|\|π')] | 算法框（取自原論文） |
| PPO（Clipped 型） | min(r·A, clip(r, 1-ε, 1+ε)·A)，較常用 | 視覺解說正/負優勢的裁剪行為 |
| TRPO | Trust Region Policy Optimization，概念類似但更複雜 | 對比圖（MuJoCo 效能曲線） |

---

## 重要細節

### 定義

**基準線無偏性定理**
> 若 B(s_t) 僅是狀態 s_t 的函數（不含 θ 或動作 a），則對任意策略參數 θ：
> $$\mathbb{E}_{\tau \sim \pi_\theta}\!\left[\nabla_\theta \log \pi_\theta(a_t|s_t)\cdot B(s_t)\right] = 0$$
>
> 證明要點：
> 1. 將軌跡期望分解為「過去狀態」×「當前及未來」兩部分
> 2. B(s_t) 只依賴 s_t，故 sum_a π(a|s_t) 的導數 = 導數(1) = 0
> 3. 故整體期望值為零，引入 B 不改變梯度期望

**Vanilla Policy Gradient（Algorithm 6.1）**
```
初始化策略參數 θ、基準線參數
重複：
  1. 以當前策略 π_θ 執行 m 條軌跡
  2. 對每條軌跡每個時間步 t：
     a. 計算 MC 回報 G_t = r_t + γr_{t+1} + ...
     b. 計算優勢估計 Â_t = G_t - B(s_t)
  3. 更新基準線（重新擬合 B）
  4. 策略梯度更新：θ ← θ + α · ∑_t ∇_θ log π_θ(a_t|s_t) · Â_t
```

**Actor-Critic**
- Actor：策略 π_θ（決策者）
- Critic：狀態—動作值函數 Q_w 或 V_w（批評者，估計績效）
- 優勢函數：$A(s,a) = Q_w(s,a) - V_w(s)$
- 著名實作：A3C（Asynchronous Advantage Actor-Critic）

**n 步估計器**

| 估計器 | 形式 | 偏差 | 變異數 |
|---|---|---|---|
| $\hat{R}_1$（TD-like） | $r_{t+1} + \gamma V(s_{t+1})$ | 高（立即 bootstrap） | 低 |
| $\hat{R}_n$（n 步） | $\sum_{k=0}^{n-1}\gamma^k r_{t+k} + \gamma^n V(s_{t+n})$ | 中 | 中 |
| $\hat{R}_\infty$（MC） | $\sum_{k=0}^{T-t}\gamma^k r_{t+k}$ | 零（在期望意義下） | 高 |

> 直觀：$\hat{R}_1$ 主要使用一個隨機樣本 + 固定（但可能偏差）的估計值；$\hat{R}_\infty$ 累積所有時間步的隨機樣本，故變異數大。

**策略績效差異引理（Performance Difference Lemma）**
$$J(\pi') - J(\pi) = \frac{1}{1-\gamma}\mathbb{E}_{s\sim d^{\pi'},a\sim\pi'}\!\left[A^\pi(s,a)\right]$$

- $d^\pi(s) = (1-\gamma)\sum_{t=0}^\infty \gamma^t P(s_t=s|\pi)$：折扣狀態分布
- 直觀（講師比喻）：「每天我去史丹佛而非哈佛會更快樂多少，加總起來就是整個職涯的差距」

**重要性採樣轉換**
$$J(\pi') - J(\pi) \approx \frac{1}{1-\gamma}\mathbb{E}_{s\sim d^\pi, a\sim\pi}\!\left[\frac{\pi'(a|s)}{\pi(a|s)}A^\pi(s,a)\right]$$

近似誤差（忽略 $d^{\pi'}$ 差異）由 KL 散度界定：
$$\left|J(\pi') - J(\pi) - \mathcal{L}_\pi(\pi')\right| \leq C\sqrt{\mathbb{E}_{s\sim d^\pi}\!\left[D_{\mathrm{KL}}(\pi(\cdot|s)\|\pi'(\cdot|s))\right]}$$

**KL 散度**
$$D_{\mathrm{KL}}(p\|q) = \sum_x p(x)\log\frac{p(x)}{q(x)} \geq 0$$
不對稱（$D_{\mathrm{KL}}(p\|q) \neq D_{\mathrm{KL}}(q\|p)$）；相同分布時等於零。

**PPO — KL 懲罰型**
$$\theta_{k+1} = \arg\max_\theta \mathcal{L}(\theta) - \beta \cdot \mathbb{E}_{s\sim d^{\pi_k}}\!\left[D_{\mathrm{KL}}(\pi_k(\cdot|s)\|\pi_\theta(\cdot|s))\right]$$

演算法：計算優勢估計 → K 步梯度更新 → 若新 KL > 目標則增大 β，否則縮小 β

**PPO — Clipped 型（較常用）**
$$\mathcal{L}^{\mathrm{CLIP}}(\theta) = \mathbb{E}_t\!\left[\min\!\left(r_t(\theta)\hat{A}_t,\; \mathrm{clip}(r_t(\theta),1\!-\!\varepsilon,1\!+\!\varepsilon)\hat{A}_t\right)\right]$$

其中 $r_t(\theta) = \dfrac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t|s_t)}$

裁剪行為：
- $\hat{A}_t > 0$（好動作）：$r > 1+\varepsilon$ 時不再增益，防止過度強化
- $\hat{A}_t < 0$（壞動作）：$r < 1-\varepsilon$ 時不再降低，防止策略驟變

**Q&A 重點**
- 問：有無折扣因子？答：目前假設 episodic，不需要折扣；若要也可加入
- 問：C 的值是多少？答：論文中有具體形式，本課無需知道確切值
- 學生討論：n 步估計器偏差—變異數後，多名學生改變答案（課堂驗證概念有效）

---

## 對「學會做決策」的意義

- 基準線無偏性是 Policy Gradient 可靠性的基石：任意選擇 B(s) 都不改變梯度期望，為工程上靈活調整提供理論保證
- Actor-Critic 架構融合了「學習決策規則」（Actor）與「學習評估決策好壞」（Critic）兩種能力，是現代大多數深度 RL 算法的骨幹
- n 步估計器明確化了 Monte Carlo 與 TD 之間的偏差—變異數連續譜，為超參數選擇提供原則性指導
- 績效差異引理解開了「如何利用舊資料評估新策略」的核心問題，為多步更新和重要性採樣奠定理論基礎
- PPO 是目前最廣泛使用的深度 RL 算法之一（被用於 ChatGPT 等大型語言模型的 RLHF），本講完整推導其動機和算法形式，讓讀者理解其「為什麼有效」而非只是使用黑盒

---

## ASR 存疑名詞

| 原文（ASR） | 推斷 | 依據 |
|---|---|---|
| kale Divergence / kale | KL Divergence（Kullback-Leibler 散度） | 上下文「comparing two probability distributions」，貫穿全講 |
| Po / po / PO | PPO（Proximal Policy Optimization） | 上下文「used in Chad GPT」、「blog post from 2017」 |
| mojoko domains | MuJoCo domains（物理模擬環境） | 上下文「continuous control benchmark」 |
| Chad GPT | ChatGPT | 上下文「huge number of application areas」 |
| atom style optimizers | Adam-style optimizers（最適化器） | 上下文「can help but won't necessarily solve the problem」 |
| endep estimators | n-step estimators | 上下文「n is the number of time steps until you bootstrap」 |
| a3c / A3C | A3C（Asynchronous Advantage Actor-Critic） | 正確縮寫，上下文「popular actor-critic method」 |
| inis policy | initial policy 或 old policy（意義存疑） | 上下文模糊 |
| mass script L | mathscript L（L̂ 數學腳本字體） | 上下文「this thing $\mathcal{L}$ of Pi with respect to Pi Prime」 |
| trpo | TRPO（Trust Region Policy Optimization） | 上下文「trust region」、「plot comparison on MuJoCo」 |
| generalized Advantage estimation | Generalized Advantage Estimation（GAE） | 上下文「next week we'll cover it more」 |

---

## 跨章連結

- **前接第 5 章**（Policy Search 1）：本講是 Lecture 5 的直接延續，起點為 score function / likelihood-ratio policy gradients 的回顧
- **後續第 7 章**（Policy Search 3）：講師明確說「next week we'll discuss generalized advantage estimation」，GAE 及更多 PPO 細節在下一講
- **第 1 章 RLHF**：PPO 是 ChatGPT RLHF 管線的核心算法，和第 1 章 RLHF 三步驟呼應
- **作業 2**：講師多次提示 Performance Difference Lemma 的推導是 Homework 2 的主要內容；PPO 的實作也包含在作業中
- **Mars Rover 例子**：本講未直接提及 Mars Rover，但策略梯度的「step size 問題」（參數空間 ≠ 策略空間）與機器人控制任務的直觀說明一致

---

## 相關教材

- **Sutton & Barto**：
  - Ch. 13（Policy Gradient Methods）：對應基準線、Actor-Critic、n 步估計器（`待核對`）
  - Ch. 9.3–9.4（Function Approximation）：對應 Critic 用神經網路近似值函數（`待核對`）
- **PPO 原始論文**：Schulman et al., "Proximal Policy Optimization Algorithms," OpenAI 2017
- **PPO 實作細節**：講師提及 MIT 同仁後續論文（「what are the most important implementation details」），作為補充閱讀
- **TRPO 原始論文**：Schulman et al., "Trust Region Policy Optimization," ICML 2015
- **課程 slides / 作業關聯**：`待補`

---

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| GAE（Generalized Advantage Estimation）細節 | Lecture 7 逐字稿 | 下一章補充 |
| PPO 實作細節論文完整引用 | MIT 作者姓名 + 論文年份 | 外部補充階段 |
| C 常數的具體形式 | PPO 原始論文附錄 | `待核對` |
| 與 TRPO 的嚴格比較 | TRPO 論文 + PPO 論文 | `待核對` |
| Sutton & Barto 對應頁碼 | `data/cs234/reference/SuttonBarto-RL-2nd.pdf` | `待核對` |
| n 步估計器的最優 n 選擇理論 | 講師提及「minimize MSE」，具體分析留待 Lecture 7 | 下一章補充 |

---

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-05 | 建立 | Batch 2 chapter worker，完整閱讀全文 67,115 bytes |
