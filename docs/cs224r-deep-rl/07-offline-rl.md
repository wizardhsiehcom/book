# 第七章：Offline RL

> **逐字稿：** Lecture 7 Offline RL（完整閱讀，2026-07-06）

## 導讀

Online RL 需要讓智能體在環境中試錯、收集資料，但許多真實場景中這既危險又昂貴：自動駕駛車在公路上試錯、醫療決策系統在病患身上試驗。

**Offline RL** 的設定是：給定一個**固定資料集**（由某個未知的「行為策略」收集），不允許再與環境互動，在此資料集上學出盡可能好的策略。

---

## 一、問題設定

- **行為策略** $\pi_\beta$：收集資料集 $\mathcal{D}$ 的策略（可能是人類、舊系統或混合多種策略）
- **學習目標：** 找到 $\pi_\theta$ 最大化期望回報 $J(\theta)$
- **挑戰：** $J(\theta)$ 的期望是在 $\pi_\theta$ 下，而 $\mathcal{D}$ 是在 $\pi_\beta$ 下收集的——**分布偏移**（distribution shift）

### 為何直接套用 Off-Policy RL 算法會失敗？

用 SAC 或 Q-Learning 直接跑 offline 資料集，會遇到**高估（overestimation）**：

1. Q 函數被隨機初始化，對資料集以外的動作（OOD 動作）沒有監督
2. 策略更新時，策略網路傾向選擇 Q 值隨機偏高的 OOD 動作
3. 這些 OOD 動作從未在資料中出現，Q 函數給出錯誤高估
4. 高估錯誤正向反饋，策略越來越偏離資料集

**根源：** 策略偏離行為策略 → 查詢 OOD 動作 → Q 函數不準確。

---

## 二、Offline RL 比純模仿學習強在哪？

### Trajectory Stitching（軌跡拼接）

假設資料集中有兩條軌跡：

```
軌跡 A（差）：S1 → S2 → S3 → ... → 低回報
軌跡 B（好）：...  → S7 → S8 → S9 → 高回報
```

若 $S3 \approx S7$，好的 offline RL 算法能「拼接」A 的前段和 B 的後段，學出 S1→S9 的高回報策略。純模仿學習只能對各軌跡取平均動作，做不到拼接。

---

## 三、方法一：Filtered Behavioral Cloning（過濾模仿學習）

最樸素的 offline RL baseline：

1. 按軌跡回報排序，只保留前 $K\%$ 的軌跡（如前 30%）
2. 在篩選後的資料集上做標準 BC（最大化 log $\pi_\theta(a|s)$）

**優點：** 簡單、穩定。  
**缺點：** 只能對「完整高分軌跡」模仿，無法做 trajectory stitching，也無法從局部好動作中獲益。

> 實務建議：任何 offline RL 方法都應先跑 Filtered BC 作為 baseline。

---

## 四、方法二：AWR（Advantage-Weighted Regression）

**核心思路：** 模仿學習目標加上優勢加權——好動作的似然調高，壞動作調低。

### 4.1 擬合行為策略的值函數

用 Monte Carlo 回報訓練 $V^\phi$：

$$\mathcal{L}(\phi) = \mathbb{E}_{(s,\sum r) \sim \mathcal{D}}\left[\left(V^\phi(s) - \sum_{t' \geq t} r_{t'}\right)^2\right]$$

### 4.2 優勢估計

$$\hat{A}(s_t, a_t) = \underbrace{\sum_{t' \geq t} r_{t'}}_{\text{軌跡實際回報}} - V^\phi(s_t)$$

若某動作的實際回報高於同狀態的均值，其優勢為正。

### 4.3 策略更新

$$\max_\theta \mathbb{E}_{(s,a) \sim \mathcal{D}}\left[\exp\!\left(\frac{\hat{A}(s,a)}{\alpha}\right) \cdot \log \pi_\theta(a|s)\right]$$

超參數 $\alpha$（溫度）控制加權的尖銳程度。

**特殊情形：** 若資料集的動作是確定性的，同一狀態只出現一種動作，優勢估計全為零，退化為普通 BC——這是合理的，因為沒有動作多樣性就無從判斷好壞。

---

## 五、方法三：AWAC（Advantage-Weighted Actor-Critic）

AWR 的改進：用**bootstrapped Q 函數**代替 Monte Carlo 回報，降低方差。

- 計算 TD 目標時，$a'$ **從資料集採樣**（而非從當前策略採樣）
- 這樣就避免了查詢 OOD 動作，同時獲得 bootstrapping 的低方差優點

$$y_i = r_i + \gamma \cdot Q^\phi(s'_i, \underbrace{a'_i}_{\text{from data}})$$

仍然估計的是 $\pi_\beta$ 的值函數（而非學習策略的），所以改進幅度有限。

---

## 六、方法四：IQL（Implicit Q-Learning）

IQL 解決了「如何估計比 $\pi_\beta$ 更好的策略的值函數，同時不查詢 OOD 動作」的問題。

### 6.1 核心洞見：期望回歸 vs. 期望分位回歸

對某狀態的不同動作，Q 值分布如下：

```
機率
│         ●  ← 好動作 (Q=10)
│    ●       ← 一般動作 (Q=3)
│ ●          ← 差動作 (Q=-5)
└──────────────→ 動作
```

- **L2 損失（MSE）** 回歸到**均值**（≈ 行為策略的值）
- **非對稱損失（期望分位回歸）** 回歸到**高分位**（≈ 比行為策略更好的策略的值）

### 6.2 期望回歸損失（Expectile Regression）

$$\mathcal{L}_\tau(u) = |\tau - \mathbb{1}[u < 0]| \cdot u^2$$

- $\tau = 0.5$：對稱 L2，回歸到均值
- $\tau > 0.5$（如 0.7、0.9）：對低估懲罰更重，回歸到高分位

IQL 用期望分位回歸訓練 $V^\phi$，讓 $V^\phi$ 近似「比 $\pi_\beta$ 更好的策略」的值函數。

### 6.3 IQL 完整算法

```
1. 訓練 V^φ（Critic 值函數）
   目標：期望分位回歸到 Q^φ 值
   損失：L_τ(Q^φ(s,a) - V^φ(s))，τ > 0.5

2. 訓練 Q^φ（Critic Q 函數）
   目標：標準 TD 更新
   損失：E[(r + γ·V^φ(s') - Q^φ(s,a))²]
   （動作都來自資料集，不查詢 OOD）

3. 訓練 π_θ（Actor，AWR 式加權 BC）
   優勢：Â = Q^φ(s,a) - V^φ(s)
   損失：-E[exp(Â/α) · log π_θ(a|s)]

整個過程不查詢任何 OOD 動作。
```

**IQL 為什麼用非對稱損失訓練 V 而不是 Q？**  
Q 的目標（$r + \gamma V(s')$）代表「採取動作 $a$ 後的價值」——這受**策略選擇**控制。  
V 的目標（各 Q 值的分布）代表「該狀態不同動作的結果分布」——高分位對應更好的動作選擇，即更好的策略。  
相反，若對 Q 用非對稱損失，則是偏向「運氣好的下一個狀態」，而非「更好的動作選擇」——這不是我們要的。

**優點：** 避免 OOD 查詢、可用於 offline 預訓練 + online 微調（IQL 是此場景最常用算法之一）。

---

## 七、方法五：CQL（Conservative Q-Learning）

**思路：** 對 OOD 動作顯式**壓低 Q 值**，同時維持資料集內的 Q 值準確。

損失 = 標準 Q-Learning 損失 + 正則項：

$$\mathcal{L}_{CQL}(\phi) = \mathcal{L}_{TD}(\phi) + \alpha \cdot \underbrace{\mathbb{E}_{s \sim \mathcal{D},\; a \sim \mu}\left[Q^\phi(s,a)\right]}_{\text{最小化 OOD Q 值}} - \alpha \cdot \underbrace{\mathbb{E}_{(s,a) \sim \mathcal{D}}\left[Q^\phi(s,a)\right]}_{\text{最大化資料集內 Q 值}}$$

其中 $\mu \propto \exp(Q^\phi(s,a))$ 是尋找高 Q 值動作的分布（可用 log-sum-exp 解析計算，無需顯式構造）。

**性質：** 在資料集內部，Q 值保持準確；在資料集外部，Q 值保守偏低，阻止策略利用虛假高 Q 值。

**實際案例：** LinkedIn 用 CQL 優化通知發送策略，在 A/B test 中相比 baseline 提升點擊率、降低通知數量。

---

## 八、Offline RL 方法比較

| 方法 | 核心思路 | 避免 OOD | 能超越 π_β | 計算複雜度 |
|---|---|---|---|---|
| Filtered BC | 只模仿高分軌跡 | 是 | 有限 | 低 |
| AWR | 優勢加權 BC | 是 | 是（stitching）| 低 |
| AWAC | Q 函數 + 資料動作 bootstrap | 是 | 是 | 中 |
| IQL | 期望分位回歸 V，AWR 策略更新 | 是 | 是 | 中 |
| CQL | 顯式懲罰 OOD Q 值 | 是 | 是 | 高 |

---

## 小結

1. **Offline RL 的核心挑戰** 是分布偏移導致 OOD 動作的 Q 值高估。
2. **Filtered BC** 是最簡單的 baseline，任何 offline 方法都應與之對比。
3. **AWR** 通過優勢加權實現 trajectory stitching，已超越純模仿學習。
4. **IQL** 用期望分位回歸學「更好策略的值函數」，不查詢 OOD 動作，是實務中最常用的 offline RL 算法之一。
5. **CQL** 顯式壓低 OOD Q 值，提供保守但有理論保障的 Q 函數估計。

---

*下一章：Reward Learning —— 當獎勵函數本身未知，如何從人類示範或偏好反饋中學習？*
