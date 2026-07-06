# Lecture 11 閱讀筆記 — Model-Based RL

## 基本資料

- 章節編號：11
- 章節標題：Model-Based RL
- 逐字稿：`data/cs224r/transcripts/Stanford CS224R Deep Reinforcement Learning ｜ Spring 2025 ｜ Lecture 11： Model-Based RL [PvqyGnOirgA].txt`
- 完整閱讀日期：2026-07-06
- 狀態：已抽象

## 逐字稿完整閱讀紀錄

- 起點：算法全景回顧（online/offline/IL 分類）
- 完整閱讀：是，63,677 bytes

## 本講主問題

若能學習環境動態模型，如何用它做規劃？如何解決模型誤差累積和資料覆蓋不足的問題？

## 核心概念

| 概念 | 說明 | 書稿章節 |
|---|---|---|
| 動態模型 | f_φ(s,a)≈s'，最小化 L2 預測誤差 | 第二節 |
| 潛在空間模型 | 編碼到低維 z，在 z 空間建模，省計算 | 第二節 |
| 梯度規劃 | 對動作向量做梯度下降（不是對參數）| 第四節 |
| 隨機射擊 | 採樣 N 個動作序列，取最高獎勵 | 第四節 |
| CEM（交叉熵法）| 迭代採樣 → 選精英 → 擬合高斯 → 重採樣 | 第四節 |
| 開環 vs 閉環 | 開環：全部執行；閉環：每步只執行首個動作並重新規劃 | 第四節 |
| MPC | 閉環規劃的標準名稱，機器人控制常見做法 | 第五節 |
| 暖啟動 | 上步規劃結果初始化下步（移位一格） | 第五節 |
| 模型集成 | K 個模型平均，避免單模型漏洞被利用 | 第六節 |
| 值函數補全 | sum_t r + V(s_{t+H})，解決長視野問題 | 第六節 |

## 關鍵公式

**動態模型訓練（L2 損失）：**
$$\min_\phi \mathbb{E}_{(s,a,s')\sim\mathcal{D}}\big[\|f_\phi(s,a) - s'\|^2\big]$$

**梯度規劃目標：**
$$\max_{\hat{a}_{t:t+H}} \sum_{t'=t}^{t+H} r(s_{t'}, a_{t'})$$

**鏈式法則反傳路徑：**
$$\frac{\partial r}{\partial a} = \frac{\partial r}{\partial s} \cdot \frac{\partial s}{\partial a} \quad \text{（透過 } f_\phi \text{ 反傳）}$$

**帶值函數的規劃：**
$$\max_{a_{t:t+H}} \left[\sum_{t'=t}^{t+H} r(s_{t'}, a_{t'}) + V^\phi(s_{t+H})\right]$$

## 梯度 vs 採樣規劃比較

| | 梯度下降 | CEM 採樣 |
|---|---|---|
| 高維擴展 | 好 | 差（維度 × 步長）|
| 並行 | 差 | 好 |
| 需梯度 | 是 | 否 |
| 離散動作 | 不適合 | 適合 |

## 靈巧手案例關鍵數字

- 動作空間：24 維（五指靈巧手）
- 模型：集成 3 個 MLP（500 × 2 隱層）
- 樣本效率：~100k 步 vs 無模型方法的 ~500k 步（約 5×）
- 真實機器人：4 小時資料，90° 旋轉接近 100% 成功率
- 迭代 CEM vs 隨機射擊：差距極大，說明迭代採樣必要

## MBRL 的三大挑戰與對策

| 挑戰 | 對策 |
|---|---|
| 模型誤差累積 | 短步長 + MPC 閉環 + 值函數補全 |
| 資料覆蓋不足 | 迭代收集：把執行軌跡加回資料集 |
| 單模型漏洞被利用 | 模型集成（取均值或投票）|

## 跨章連結

- 前置：Lecture 2（BC 對照模仿學習）、Lecture 6（DQN 對照 Q-Learning）
- 後續：Lecture 12（Multi-Task RL）
- 術語：dynamics model、MPC、CEM、random shooting、model ensemble、open-loop、closed-loop、latent space model
