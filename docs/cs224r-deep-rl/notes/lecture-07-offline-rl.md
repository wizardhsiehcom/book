# Lecture 7 閱讀筆記 — Offline RL

## 基本資料

- 章節編號：07
- 章節標題：Offline RL
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 7： Offline RL [lRDaXnPIzks].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：`Okay, let's get started. Okay. Um, so now let's talk a bit about a recap`
- 終點：`there's also a variant of IQL called IDQL uh that uses diffusion policies`
- 完整閱讀：是，54,899 bytes

## 本講主問題

當資料集固定、無法再與環境互動時，如何從中學出好策略？為何直接套用 off-policy 算法失敗？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| 行為策略 π_β | 收集 offline 資料集的未知策略 | 第一節 |
| Distribution shift | π_θ（學習策略）與 π_β（資料策略）的分布差異 | 第一節 |
| OOD 動作高估 | 資料集外動作 Q 值隨機初始化偏高，策略利用此漏洞 | 第一節 |
| Trajectory stitching | 拼接不同軌跡的好片段；offline RL 超越純 BC 的關鍵能力 | 第二節 |
| Filtered BC | 只模仿回報高的前 K% 軌跡 | 第三節 |
| AWR | 優勢加權 BC：exp(A/α)·log π(a|s) | 第四節 |
| AWAC | AWR + bootstrap Q，a' 從資料集採樣（非策略）| 第五節 |
| IQL | V 用期望分位回歸，Q 用標準 L2，AWR 策略更新 | 第六節 |
| Expectile Regression | 非對稱損失 L_τ；τ>0.5 向高分位偏移 | 第六節 |
| CQL | 顯式懲罰 OOD Q 值，保守 Q 學習 | 第七節 |

## 關鍵公式

**AWR 策略更新：**
$$\max_\theta \mathbb{E}_{(s,a)\sim\mathcal{D}}\left[\exp\!\left(\frac{\hat{A}(s,a)}{\alpha}\right) \cdot \log\pi_\theta(a|s)\right]$$

**AWR 優勢估計（Monte Carlo 版）：**
$$\hat{A}(s_t, a_t) = \sum_{t'\geq t} r_{t'} - V^\phi(s_t)$$

**IQL 期望分位損失：**
$$\mathcal{L}_\tau(u) = |\tau - \mathbb{1}[u<0]| \cdot u^2, \qquad \tau > 0.5$$

**IQL V 函數更新：**
$$\mathcal{L}_V = \mathbb{E}_{(s,a)\sim\mathcal{D}}\big[\mathcal{L}_\tau\!\left(Q^\phi(s,a) - V^\phi(s)\right)\big]$$

**CQL 損失：**
$$\mathcal{L}_{CQL} = \mathcal{L}_{TD} + \alpha\,\mathbb{E}_{s,a\sim\mu}\big[Q^\phi(s,a)\big] - \alpha\,\mathbb{E}_{(s,a)\sim\mathcal{D}}\big[Q^\phi(s,a)\big]$$

## IQL 為何非對稱用在 V 而不是 Q？

- V 的目標 = 同狀態不同動作的 Q 值分布 → 高分位 = 更好的動作選擇 = 更好的策略
- Q 的目標 = 下一狀態的 V 值（環境隨機性）→ 高分位 = 「幸運」的下一狀態，非策略控制
- 對 Q 非對稱會導致「學會幸運」而非「學會好動作」

## 決定性資料集的邊界情形

若資料集完全確定性（每個狀態只有一種動作）：
- 優勢估計全為 0
- AWR 退化為普通 BC
- 這是合理的：沒有動作多樣性無從判斷好壞

## CQL 實務案例

LinkedIn 用 CQL 優化通知發送策略（點擊率↑，通知數↓，用戶活躍↑）。

## 跨章連結

- 前置：Lecture 5（Replay Buffer、Q 函數 off-policy 訓練）、Lecture 6（DQN、Q-Learning）
- 後續：Lecture 8（獎勵函數本身未知時怎麼辦）
- 術語：offline RL、behavior policy、distribution shift、trajectory stitching、AWR、IQL、CQL、expectile regression
