# Tutorial：Q-Learning 深度回顧

本 Tutorial 由課程助教主持，從 MDP 基礎出發，系統回顧 Q 函數的理論、訓練方法和工程細節。內容特別強調從 tabular 設定到神經網路的過渡，以及使 Q-learning 實際可用的穩定化技巧。

## T.1 MDP 回顧與關鍵量

**馬可夫決策過程（MDP）** 定義為 $(S, A, T, R, \rho_0, \gamma, H)$：

| 符號 | 含義 |
|---|---|
| $S$ | 狀態空間 |
| $A$ | 動作空間 |
| $T(s'\|s,a)$ | 轉移動態 |
| $R(s,a)$ | 獎勵函數 |
| $\rho_0$ | 初始狀態分佈 |
| $\gamma$ | 折扣因子 |
| $H$ | 視野（horizon）|

### 三個核心量

**價值函數** $V^\pi(s)$：從狀態 $s$ 出發，遵循策略 $\pi$，期望累積折扣獎勵：

$$V^\pi(s) = \mathbb{E}_\pi\left[\sum_{t=0}^H \gamma^t r(s_t, a_t) \,\middle|\, s_0 = s\right]$$

**Q 函數** $Q^\pi(s, a)$：在狀態 $s$ 執行動作 $a$，之後遵循策略 $\pi$：

$$Q^\pi(s, a) = \mathbb{E}_\pi\left[\sum_{t=0}^H \gamma^t r(s_t, a_t) \,\middle|\, s_0=s, a_0=a\right]$$

**優勢函數** $A^\pi(s, a)$：動作 $a$ 相對於策略期望的額外收益：

$$A^\pi(s, a) = Q^\pi(s, a) - V^\pi(s)$$

**關係**：$V^\pi(s) = \mathbb{E}_{a \sim \pi(\cdot|s)}[Q^\pi(s, a)]$

對最優策略 $\pi^*$，$A^{\pi^*}(s, a) \leq 0$ 對所有 $(s, a)$ 成立（最優動作的優勢為 0，非最優動作為負）。

## T.2 Tabular Q-Learning 與格子世界

### Bellman 最優方程

最優 Q 函數 $Q^*$ 滿足：

$$Q^*(s, a) = R(s, a) + \gamma \sum_{s'} T(s'|s, a) \max_{a'} Q^*(s', a')$$

這個方程沒有下標——它描述的是 $Q^*$ 在最優條件下應滿足的**不動點方程**。

### 迭代 Q-Iteration（動態規劃）

把 Bellman 方程轉為**迭代更新過程**：

$$Q_{k+1}(s, a) = R(s, a) + \gamma \max_{a'} Q_k(s', a')$$

初始化 $Q_0(s, a) = 0$ 對所有 $(s, a)$，從終端狀態開始，向所有狀態**反向傳播價值**。

**格子世界案例**：

```
格子：5×5，目標格（+1），熔岩格（-1），折扣 γ=0.9
動作：上、下、左、右、停留（5 個）
```

迭代過程：

- **第 0 步**：$Q_0 = 0$（除目標和熔岩終端格）
- **第 1 步**：目標格相鄰格獲得正值，熔岩相鄰格獲得負值
- **第 k 步**：值從終端格向外傳播，每步衰減 $\gamma$

收斂後：

- $V^*(s)$：每格的最優狀態值（只看狀態）
- $Q^*(s, a)$：每格每方向的最優 Q 值（5個數字/格）
- $\pi^*(s) = \arg\max_a Q^*(s, a)$：最優策略（deterministic）

**Bellman 方程 vs. Q-Iteration 的區別**：

| | Bellman 最優方程 | 迭代 Q-Iteration |
|---|---|---|
| 角色 | 描述性：$Q^*$ 應該長什麼樣 | 算法性：迭代更新直到收斂 |
| 下標 | 無 | 有（$Q_k$, $Q_{k+1}$）|
| 出現 Q 的位置 | 兩側 | 右側 $Q_k$ → 左側 $Q_{k+1}$ |

Q 函數在等式**兩側**出現 → Dynamic Programming 的標誌。
Q 函數只在右側 → Monte Carlo 的標誌。

### 軌跡拼接（Stitching）

動態規劃的一個強力性質：能組合不同軌跡找到最優路徑。

```
軌跡 1：A → B
軌跡 2：C → D
一步 DP：發現 A → B = C → D 的最短路徑
```

即使從未收集過 A 到 D 的完整軌跡，也能推導最優策略。這是 Q-learning 相比 policy gradient 和 Monte Carlo 的獨特優勢。

## T.3 參數化 Q 函數

Tabular Q 函數在狀態/動作空間龐大時不可行（百萬行表格）。解法：用神經網路學習 Q 函數，同時獲得**泛化能力**（鄰近狀態的 Q 值相似）。

### 離散動作 Q 網路

輸入：狀態 $s$
輸出：所有動作的 Q 值向量 $[Q(s, a_1), Q(s, a_2), ..., Q(s, a_n)]$

優點：單次前向傳播獲得所有動作的 Q 值，$\text{argmax}$ 精確（不需採樣）。

### 連續動作 Q 網路

輸入：$(s, a)$ 拼接向量
輸出：標量 $Q(s, a)$

取最大值時需要對動作採樣（如 CEM、隨機採樣），估計帶噪聲。

### 價值函數只有一種參數化

$V(s)$：輸入狀態，輸出標量——與動作空間性質無關。

## T.4 TD vs. Monte Carlo 的偏差-方差權衡

從 Monte Carlo 估計推導 TD 估計：

**Monte Carlo 展開**：

$$V^\pi(s) = \mathbb{E}_\pi\left[\sum_{k=0}^\infty \gamma^k r(s_{t+k}, a_{t+k}) \,\middle|\, s_t = s\right]$$

**一步 TD 推導**：分離第一步獎勵，識別餘下部分為下一狀態的值函數：

$$V^\pi(s) = \mathbb{E}_\pi[r(s_t, a_t) + \gamma V^\pi(s_{t+1}) \,|\, s_t = s]$$

這個代換引入了偏差（$V^\pi$ 是估計值），但大幅降低方差（視野從 $H$ 降至 1）。

**N 步回傳**：在完整 MC 和一步 TD 之間插值：

$$V^{(n)}(s_t) = \sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n V^\pi(s_{t+n})$$

| 方法 | 視野 | 偏差 | 方差 |
|---|---|---|---|
| TD（1步）| 1 | 高（依賴估計值）| 低 |
| N步回傳 | N | 中 | 中 |
| Monte Carlo | $H$ | 零 | 高 |

**環境依賴性**：

- 語言模型推理：環境轉移幾乎無噪聲，獎勵可精確驗證 → Monte Carlo 適用
- 機器人控制：動態有噪聲，長視野獎勵累積方差大 → TD 更好

**為何 Q-learning 選用 TD？** 拼接效應（Stitching）本質上是動態規劃，需要 Bootstrap（用估計值更新估計值）。

## T.5 使 Q-Learning 穩定的工程技巧

### 技巧一：半梯度（Semi-Gradient）

標準 MSE 訓練損失：

$$L = \left(Q_\theta(s,a) - [r + \gamma \max_{a'} Q_\theta(s', a')]\right)^2$$

問題：目標值 $r + \gamma \max_{a'} Q_\theta(s', a')$ 依賴**同一套參數** $\theta$，優化等同於追一個移動的目標——非常不穩定。

**解法**：對目標停止梯度：

$$L = \left(Q_\theta(s,a) - \text{StopGrad}\left[r + \gamma \max_{a'} Q_\theta(s', a')\right]\right)^2$$

這樣只對左側 $Q_\theta(s,a)$ 計算梯度，目標被視為常數。

### 技巧二：目標網路（Target Network）

半梯度雖然固定了梯度方向，但目標值每步都在變化。引入**獨立的目標網路** $Q_{\theta'}$，計算目標值時使用 $\theta'$ 而非 $\theta$，$\theta'$ 落後於 $\theta$ 更新：

**硬更新**（Hard Update）：每 $N$ 步複製：$\theta' \leftarrow \theta$

**軟更新 / Polyak 平均**（Soft Update）：每步平滑插值：

$$\theta' \leftarrow \tau \theta + (1-\tau)\theta'$$

其中 $\tau$ 通常約為 $0.01$。實際中軟更新更常用（如 SAC、TD3 默認 $\tau=0.005$）。

### 技巧三：梯度裁剪

TD 更新產生的梯度可能非常大，使參數驟變。梯度裁剪將梯度範數上限為固定值（如 1.0 或 10）：

```python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

沒有梯度裁剪時，參數可能在損失景觀中大幅振盪，難以收斂。

### 技巧四：Huber Loss

比 MSE 更魯棒的損失函數，對大誤差使用 L1、對小誤差使用 L2：

$$L_{\delta}(y) = \begin{cases} \frac{1}{2}y^2 & |y| \leq \delta \\ \delta(|y| - \frac{1}{2}\delta) & |y| > \delta \end{cases}$$

對 TD 誤差中偶爾出現的異常值（outlier），L2 會放大梯度，Huber 損失限制其影響。

## T.6 Replay Buffer

**設計目的**：解決兩個核心問題。

**問題一：時間相關性**

連續採樣的轉移 $(s_t, a_t, r_t, s_{t+1})$ 高度相關（屬於同一軌跡）。在相關資料上梯度下降效率低且不穩定。

**解法**：把所有轉移存入 buffer，訓練時**隨機採樣**——打破時間順序，資料接近 i.i.d.。

**問題二：近因偏差（Recency Bias）**

若只用最近策略的資料，Q 函數只對當前策略的狀態分佈準確，缺乏對其他狀態的泛化。

**解法**：Buffer 保存歷史轉移，隨機採樣使資料來自多種策略的經驗，提高狀態覆蓋率。

**Buffer 結構**：

```python
buffer = [(s_1, a_1, r_1, s'_1), (s_2, a_2, r_2, s'_2), ...]
```

存儲轉移（transitions），而非完整軌跡——避免長序列的相關性。

**最大容量**：Buffer 通常設定上限（如 100 萬條），超出時按先進先出（FIFO）或優先採樣（PER）更新。

## T.7 Q 函數過高估計與解決方案

### 問題根源

Bellman 更新中的 $\max$ 操作：

$$Q(s, a) \leftarrow r + \gamma \max_{a'} Q(s', a')$$

若 Q 函數估計有噪聲 $Q_{\text{approx}}(s', a') = Q^*(s', a') + \epsilon_{a'}$，即使 $\mathbb{E}[\epsilon_{a'}] = 0$（零均值噪聲），$\max$ 操作會選擇噪聲最大的動作：

$$\mathbb{E}\left[\max_{a'} Q_{\text{approx}}(s', a')\right] \geq \max_{a'} Q^*(s', a')$$

這個不等式（由 Jensen 不等式導出）說明：$\max$ 的期望 $\geq$ 期望的 $\max$。即使平均偏差為零，$\max$ 操作系統性地**高估**目標值。

這個高估會通過動態規劃傳播到所有狀態，累積放大，最終導致 Q 函數爆炸。

### 解法：批評者集成（Critic Ensemble）

訓練多個 Q 網路 $Q_{\theta_1}, Q_{\theta_2}, ..., Q_{\theta_K}$，計算目標時取**最小值**：

$$Q_{\text{target}}(s', a') = \min_{k=1}^K Q_{\theta_k}(s', a')$$

**直覺**：不同隨機初始化的網路在不同狀態有不同噪聲方向。最小值保守估計，對抗 $\max$ 的過高估計。

**Double Q-Learning（K=2）**：

- $Q_{\theta_1}$ 選動作：$a^* = \arg\max_{a'} Q_{\theta_1}(s', a')$
- $Q_{\theta_2}$ 評估：目標值用 $Q_{\theta_2}(s', a^*)$

拆分「選動作」和「評估動作」的 Q 函數，有效降低過高估計。

**效果**：即使只用 K=2，相比標準 Q-learning 的巨大誤差棒（error bar），過高估計大幅降低。K 增大收益遞減，通常 K=2 或 K=3 足夠。

**離線 RL 中的集成**（見第七章）：離線 RL 的分佈偏移使過高估計更嚴重，通常使用更大的集成（如 EDAC 用 10 個以上）和更大力度的懲罰。

## T.8 Q-Learning 算法完整流程

```python
初始化：Q 網路 Q_θ，目標網路 Q_θ'，Replay Buffer B

for 每個訓練步驟：
    # 收集資料
    a_t = argmax_a Q_θ(s_t, a) 或 ε-greedy 探索
    執行 a_t，觀測 r_t, s_{t+1}
    存入 B: (s_t, a_t, r_t, s_{t+1})
    
    # 更新
    從 B 隨機採樣小批次 {(s, a, r, s')}
    計算 TD 目標（使用目標網路，停止梯度）：
        y = r + γ · max_a' Q_θ'(s', a')
    計算損失：
        L = Huber(Q_θ(s, a) - y)
    梯度下降（含梯度裁剪）
    
    # 更新目標網路
    每 N 步 硬更新：θ' ← θ
    或 每步 軟更新：θ' ← τθ + (1-τ)θ'
```

## T.9 總結：技巧速查表

| 問題 | 技巧 | 效果 |
|---|---|---|
| 目標移動，訓練不穩定 | 半梯度（停止梯度）| 固定更新方向 |
| 目標抖動 | 目標網路 | 降低目標波動 |
| 梯度爆炸 | 梯度裁剪 | 防止參數跳躍 |
| 大誤差的過強梯度 | Huber Loss | 對異常值魯棒 |
| 資料相關 | Replay Buffer | 打破時間依賴 |
| Q 值過高估計 | Double Q / 集成 + min | 保守估計目標 |

---

**延伸閱讀**：Sutton & Barto 第六章（TD Learning）、第九章（On-policy 近似）；DQN 論文（Mnih et al., 2015）；Double DQN（van Hasselt et al., 2016）；SAC 論文（Haarnoja et al., 2018）。
