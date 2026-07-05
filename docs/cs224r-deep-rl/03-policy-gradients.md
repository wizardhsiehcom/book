# 第三章：策略梯度

> **逐字稿：** Lecture 3 Policy Gradients（完整閱讀，2026-07-06）

## 導讀

這一章解決的問題是：如何讓智能體從自己的試錯經驗中學習，而不是依賴專家示範？

模仿學習有一個根本限制：它的上限是示範者的水準。要超越示範者，必須有一種機制讓智能體在嘗試各種行為時，根據結果的好壞來改進自己。策略梯度（Policy Gradients）是這個方向的第一個具體算法——它直接對期望累積獎勵的目標函數求梯度，以試錯替代模仿。

---

## 一、Online RL 的迭代框架

Online RL 的循環很簡單：

```
初始化策略 π_θ
↓
執行策略，收集一批軌跡
↓
用這批資料計算梯度，更新策略
↓
↑_________________________↓
（重複）
```

關鍵點：每次更新策略後，必須重新採樣——因為梯度估計需要來自當前策略的資料。這和監督學習「一個固定資料集訓練到底」的做法完全不同。

---

## 二、策略梯度的推導

**目標：** 找到使期望累積獎勵最大的策略參數 $\theta$：

$$\theta^* = \arg\max_\theta J(\theta) = \arg\max_\theta \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[\sum_t r(s_t, a_t)\right]$$

**問題：** $J(\theta)$ 不可直接微分——採樣過程本身不可微，而且 dynamics $p(s_{t+1}|s_t, a_t)$ 未知。

### Log Trick：繞過採樣不可微的核心技巧

利用恆等式 $\nabla_\theta p_\theta = p_\theta \cdot \nabla_\theta \log p_\theta$，可以把梯度變換成期望形式：

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[\nabla_\theta \log p_\theta(\tau) \cdot r(\tau)\right]$$

再展開 $\log p_\theta(\tau)$：

$$\log p_\theta(\tau) = \underbrace{\log p(s_1)}_{\text{與}\,\theta\,\text{無關}} + \sum_t \left[\log \pi_\theta(a_t|s_t) + \underbrace{\log p(s_{t+1}|s_t,a_t)}_{\text{與}\,\theta\,\text{無關}}\right]$$

Dynamics 和初始狀態分布都不依賴 $\theta$，所以：

$$\nabla_\theta \log p_\theta(\tau) = \sum_t \nabla_\theta \log \pi_\theta(a_t|s_t)$$

**REINFORCE 梯度：**

$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^N \left[\sum_{t=1}^T \nabla_\theta \log \pi_\theta(a_t^i|s_t^i)\right] \cdot r(\tau^i)$$

這個梯度可以用採樣估計：展開策略 $N$ 條軌跡，計算每條軌跡的 log 概率梯度，乘以該軌跡的總獎勵，取平均。

---

## 三、兩個核心改進

### 3.1 因果性修正（Causality Trick）

動作 $a_t$ 只能影響 $t$ 之後的獎勵，對之前的獎勵沒有因果關聯。因此，更新 $a_t$ 的梯度只應考慮 $t$ 之後的獎勵（reward-to-go）：

$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_i \sum_t \nabla_\theta \log \pi_\theta(a_t^i|s_t^i) \cdot \underbrace{\left(\sum_{t' \geq t} r(s_{t'}^i, a_{t'}^i)\right)}_{\hat{r}_t^i \;\text{(reward-to-go)}}$$

好處：可以讓梯度分辨同一條軌跡中「前段糟糕但後段正確」的情況，不再把整條軌跡的總獎勵歸因到所有動作上。

### 3.2 Baseline：降低梯度方差

在梯度中減去一個常數 $b$（如當前 batch 的平均獎勵），不改變梯度的期望值，但顯著降低方差：

$$\mathbb{E}\left[\nabla_\theta \log p_\theta(\tau) \cdot b\right] = 0$$

（證明：$\int \nabla_\theta p_\theta(\tau)\, d\tau = \nabla_\theta \int p_\theta(\tau)\, d\tau = \nabla_\theta 1 = 0$，與 $b$ 無關）

**加入 baseline 後的梯度：**

$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_i \sum_t \nabla_\theta \log \pi_\theta(a_t^i|s_t^i) \cdot (\hat{r}_t^i - b)$$

直覺：只有高於平均的動作才獲得正梯度（增加似然），低於平均的獲得負梯度（降低似然）。

---

## 四、直覺理解：加權模仿學習

策略梯度等同於「對自己的 rollout 做加權的模仿學習」：

- 高獎勵軌跡的動作：**增加**其似然（相當於模仿那些成功的嘗試）
- 低獎勵軌跡的動作：**降低**其似然（相當於避免那些失敗的做法）

與普通模仿學習的差別是：模仿學習假設所有示範都是好的，策略梯度用獎勵信號來篩選。

### 範例分析

**人形機器人行走（稀疏場景）：**

| 軌跡 | 結果 | 總獎勵 | 梯度方向 |
|---|---|---|---|
| 1 | 向後倒 | 負 | 降低此動作似然 |
| 2 | 向前倒 | 正（有前進速度）| 增加此動作似然 |
| 3 | 原地不動 | ≈ 0 | 幾乎不變 |

問題：梯度鼓勵「向前倒」而非「真正行走」——高方差的體現，需要更多 rollout 才能看到真正的行走示範。

**折夾克（極稀疏獎勵）：**

三條失敗軌跡（獎勵 = 0）、一條成功軌跡（獎勵 = 1）。加入 baseline 後，成功軌跡得正梯度，三條失敗軌跡得相同的負梯度——三條失敗之間（「只折袖子」vs「沒動」）完全沒有分辨，需要用 Actor-Critic 來解決。

---

## 五、On-Policy 的限制與 Importance Sampling

### On-Policy 的問題

REINFORCE 是 on-policy 算法：梯度估計需要來自當前策略 $\pi_\theta$ 的資料。更新一次 $\theta$ 後，舊資料就失效，必須重新採樣。每次只能做一個梯度步，資料效率極低。

### Importance Sampling 的解法

利用重要性採樣，可以用舊策略 $\pi_{\theta_{old}}$ 的資料估計新策略的目標：

$$J(\theta) \approx \mathbb{E}_{\tau \sim p_{\theta_{old}}} \left[\frac{p_\theta(\tau)}{p_{\theta_{old}}(\tau)} \cdot r(\tau)\right]$$

在狀態-動作邊際上近似為：

$$\frac{p_\theta(\tau)}{p_{\theta_{old}}(\tau)} \approx \prod_t \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}$$

（產品形式在長軌跡下不穩定，實務上用 state-action 邊際近似）

**效果：** 同一批資料可以做多個梯度步。  
**限制：** 只在 $\pi_\theta \approx \pi_{\theta_{old}}$ 時有效；差距大時比值爆炸或歸零。

下一章的 PPO 正是在此基礎上，加入 clipping 限制更新幅度。

---

## 六、實作要點

**Surrogate Objective（代理目標）：**

不需要對每個動作的梯度單獨計算 backward，可以寫出一個代理目標：

$$\mathcal{L}(\theta) = \frac{1}{N} \sum_i \sum_t \log \pi_\theta(a_t^i|s_t^i) \cdot \text{stop\_grad}(\hat{r}_t^i - b)$$

Reward-to-go 要對 $\theta$ 做 stop gradient（不反傳）。這樣只需一次 forward + 一次 backward。

---

## 小結

1. **REINFORCE = log trick + 採樣估計**：把期望梯度轉換為可採樣的形式，dynamics 自然消去。
2. **因果性修正**：用 reward-to-go 替代總獎勵，讓梯度能分辨軌跡中好動作與壞動作。
3. **Baseline**：減去均值，無偏但降低方差；正獎勵增加似然，負獎勵降低似然。
4. **On-policy**：每次更新後必須重採樣；Importance Sampling 允許有限的 off-policy 更新。
5. **梯度仍然高方差**：最佳使用場景是大 batch + 稠密獎勵；稀疏場景需要 Actor-Critic。

---

*下一章：Actor-Critic 方法 —— 用值函數估計替代嘈雜的 reward-to-go，大幅降低梯度方差。*
