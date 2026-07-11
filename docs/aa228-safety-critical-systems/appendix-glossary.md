# 附錄：術語對照表 (Glossary)

本表是全書中英術語的**唯一標準**：內文譯名一律以此表為準，首次出現時附英文原文。譯名優先採台灣學術慣例（國家教育研究院樂詞網、台灣控制／統計學界教科書慣用）。

## 核心方法論

| 英文 | 本書譯名 | 說明 |
|------|---------|------|
| Validation | 驗證 | 本課程主題：確認系統滿足安全規範 |
| Falsification | 否證 | 主動搜尋系統違反安全屬性的反例（失效）；Popper 的 falsifiability 台灣慣譯「可否證性」 |
| Falsification through Optimization | 基於最佳化的否證 | 教科書第 4 章 |
| Falsification through Planning | 基於規劃的否證 | 教科書第 5 章 |
| Failure Analysis | 失效分析 | |
| Formal Methods | 形式化方法 | |
| Reachability Analysis | 可達性分析 | |
| Runtime Monitoring | 執行時期監控 | runtime 依台灣資訊慣例譯「執行時期」 |
| Explainability | 可解釋性 | |
| Adaptive Stress Testing (AST) | 自適應壓力測試 | |
| Swiss Cheese Model | 瑞士乳酪模型 | 飛安／工安文獻慣用 |
| Safety Case | 安全案例 | |
| Operational Design Domain (ODD) | 操作設計域 | |

## 規格與指標

| 英文 | 本書譯名 | 說明 |
|------|---------|------|
| Property Specification | 屬性規範 | |
| Signal Temporal Logic (STL) | 訊號時序邏輯 | |
| Linear Temporal Logic (LTL) | 線性時序邏輯 | |
| Robustness（STL 語境） | 強健性 | 台灣控制學界慣例（強健控制）；不用「穩健性」（統計）、「魯棒性」（大陸） |
| Smooth Robustness | 平滑強健性 | |
| Pareto Optimal | 帕雷托最佳 | 避免「柏拉圖」（與哲學家 Plato 撞名） |
| Pareto Frontier | 帕雷托前緣 | |
| Value at Risk (VaR) | 風險值 | |
| Conditional Value at Risk (CVaR) | 條件風險值 | |
| Counterfactual | 反事實 | |

## 機率與抽樣

| 英文 | 本書譯名 | 說明 |
|------|---------|------|
| Bayesian | 貝氏 | 台灣統計標準譯名；不用「貝葉斯」 |
| Monte Carlo | 蒙地卡羅 | 不用「蒙特卡洛」 |
| Importance Sampling (IS) | 重要性採樣 | |
| Cross-Entropy Method (CEM) | 交叉熵方法 | |
| Sequential Monte Carlo (SMC) | 循序蒙地卡羅 | 不用「序貫」（大陸譯法）；屬失效機率估計方法（教科書 §7.4），**不是**形式化保證 |
| Multiple Importance Sampling (MIS) | 多重重要性採樣 | |
| Population Monte Carlo (PMC) | 族群蒙地卡羅 | |
| Rejection Sampling | 拒絕取樣 | |
| Markov Chain Monte Carlo (MCMC) | 馬可夫鏈蒙地卡羅 | |
| Metropolis-Hastings | Metropolis-Hastings | 人名演算法不譯 |
| Nominal Trajectory Distribution | 標稱軌跡分佈 | |
| Failure Distribution | 失效分佈 | |
| Likelihood | 概似度 | |
| Maximum Likelihood Estimation (MLE) | 最大概似估計 | |
| Effective Sample Size (ESS) | 有效樣本數 | |

## 集合與可達性

| 英文 | 本書譯名 | 說明 |
|------|---------|------|
| Polytope | 多胞形 | 樂詞網數學名詞；「多邊形」限二維、「多面體」限三維，皆不用 |
| Zonotope | Zonotope（環帶多胞形） | 無公定譯名，以英文為主 |
| Convex Hull | 凸包 | |
| Minkowski Sum | 閔可夫斯基和 | |
| Over-approximation | 過度近似 | |
| Invariant Set | 不變集合 | |
| Interval Arithmetic | 區間算術 | |
| Inclusion Function | 包含函數 | |
| Taylor Model | 泰勒模型 | |
| Wrapping Effect | 包裹效應 | |
| Backward Reachable Tube (BRT) | 後向可達管 | |
| Hamilton-Jacobi-Isaacs (HJI) | Hamilton-Jacobi-Isaacs | 不譯 |

## 監控與可解釋性

| 英文 | 本書譯名 | 說明 |
|------|---------|------|
| Aleatoric Uncertainty | 偶發性不確定性 | 不可縮減（輸出不確定性） |
| Epistemic Uncertainty | 認識論不確定性 | 可縮減（模型不確定性） |
| Conformal Prediction | 保形預測 | |
| Temperature Scaling | 溫度縮放 | |
| Deep Ensembles | 深度集成 | |
| Saliency Map | 顯著圖 | |
| Integrated Gradients | 積分梯度 | |
| Surrogate Model | 代理模型 | |
| Shapley Values | Shapley 值 | |
| Sparse Autoencoder (SAE) | 稀疏自編碼器 | |
| Circuit Tracing | 電路追蹤 | |
| Spurious Correlation | 偽相關 | |
| Feature Collapse | 特徵崩潰 | |

## 範例系統

| 英文 | 本書譯名 | 說明 |
|------|---------|------|
| Inverted Pendulum | 倒立擺 | 教科書附錄 A.5：擺桿鉸接於**固定基座**、動作為力矩、狀態 (θ, ω)；**不是** cart-pole |
| Cart-Pole | 車桿系統 | 有滑車、狀態 4 維；本書課程範例未使用，僅供對比 |
| Aircraft Collision Avoidance System (ACAS / CAS) | 航空防撞系統 | |
