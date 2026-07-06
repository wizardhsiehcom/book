# 參考資料

## 教科書：Sutton & Barto 章節對照

主教科書：Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press.
- 本地路徑：`data/cs224r/reference/RLbook2020.pdf`

| 書中章節 | 主題 | 對應本書章節 |
|---|---|---|
| 第 1 章：Introduction | MDP 框架、Agent-Environment 交互、有模型/無模型 | 第一章 |
| 第 2 章：Multi-armed Bandits | Bandit 理論、ε-greedy、UCB、Thompson Sampling | 第十四章 |
| 第 3 章：Finite MDPs | Bellman 方程、最優策略、值函數定義 | 第一章、Tutorial |
| 第 4 章：Dynamic Programming | 策略評估、策略改進、Q-Iteration | Tutorial |
| 第 5 章：Monte Carlo Methods | MC 估計、首訪 vs 全訪、MC 控制 | Tutorial |
| 第 6 章：Temporal-Difference Learning | TD(0)、SARSA、Q-Learning | 第六章、Tutorial |
| 第 7 章：n-step Bootstrapping | N 步回傳、偏差-方差權衡 | Tutorial |
| 第 8 章：Planning and Learning | Dyna 架構、模型學習、MBRL 基礎 | 第十一章 |
| 第 9–10 章：On-policy Approximation | 神經網路函數近似、DQN 基礎 | 第六章 |
| 第 11 章：Off-policy Approximation | Off-policy 學習、重要性採樣 | 第五章 |
| 第 13 章：Policy Gradient Methods | REINFORCE、基線、Actor-Critic | 第三章、第四章 |
| 第 16–17 章：Applications, Frontiers | 案例研究、未來展望 | 第十七、十八章 |

---

## 重要論文引用

### 模仿學習

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| DAgger | Ross et al., 2011. *A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning*. AISTATS. | 分佈偏移修正，互動式 IL | 第二章、第十七章 |
| GAIL | Ho & Ermon, 2016. *Generative Adversarial Imitation Learning*. NeurIPS. | 對抗式模仿學習 | 第二章 |
| Diffusion Policy | Chi et al., 2023. *Diffusion Policy: Visuomotor Policy Learning via Action Diffusion*. RSS. | 擴散模型策略 | 第二章 |

### 策略梯度與 Actor-Critic

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| REINFORCE | Williams, 1992. *Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning*. Machine Learning. | 對數導數技巧、基線 | 第三章 |
| PPO | Schulman et al., 2017. *Proximal Policy Optimization Algorithms*. arXiv. | Clipped 目標函數 | 第三章 |
| A3C | Mnih et al., 2016. *Asynchronous Methods for Deep Reinforcement Learning*. ICML. | 非同步 Actor-Critic | 第四章 |
| GAE | Schulman et al., 2016. *High-Dimensional Continuous Control Using Generalized Advantage Estimation*. ICLR. | 廣義優勢估計 | 第四章 |

### Off-Policy Actor-Critic

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| SAC | Haarnoja et al., 2018. *Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor*. ICML. | 最大熵框架、自動調整 α | 第五章 |
| TD3 | Fujimoto et al., 2018. *Addressing Function Approximation Error in Actor-Critic Methods*. ICML. | 雙 Q 批評者、延遲策略更新 | 第五章 |

### Q-Learning

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| DQN | Mnih et al., 2015. *Human-level control through deep reinforcement learning*. Nature. | 深度 Q 網路，replay buffer，目標網路 | 第六章、Tutorial |
| Double DQN | van Hasselt et al., 2016. *Deep Reinforcement Learning with Double Q-learning*. AAAI. | 過高估計的解決方案 | 第六章、Tutorial |
| Dueling DQN | Wang et al., 2016. *Dueling Network Architectures for Deep Reinforcement Learning*. ICML. | 分離 V 和 A 的網路結構 | 第六章 |
| Rainbow | Hessel et al., 2018. *Rainbow: Combining Improvements in Deep Reinforcement Learning*. AAAI. | 6 項改進的組合 | 第六章 |

### 離線 RL

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| AWR | Peng et al., 2019. *Advantage-Weighted Regression: Simple and Scalable Off-Policy Reinforcement Learning*. arXiv. | 加權行為克隆 | 第七章 |
| IQL | Kostrikov et al., 2022. *Offline Reinforcement Learning with Implicit Q-Learning*. ICLR. | 不需要 OOD 動作的 offline RL | 第七章 |
| CQL | Kumar et al., 2020. *Conservative Q-Learning for Offline Reinforcement Learning*. NeurIPS. | 保守 Q 值懲罰 | 第七章 |
| TD3+BC | Fujimoto & Gu, 2021. *A Minimalist Approach to Offline Reinforcement Learning*. NeurIPS. | 最小化行為克隆懲罰 | 第七章 |

### 獎勵學習

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| InstructGPT | Ouyang et al., 2022. *Training language models to follow instructions with human feedback*. NeurIPS. | RLHF 三階段管線 | 第八章 |
| T-REX | Brown et al., 2019. *Extrapolating Beyond Suboptimal Demonstrations via Inverse Reinforcement Learning from Observations*. ICML. | 從排序學習獎勵 | 第八章 |
| Bradley-Terry | Bradley & Terry, 1952. *Rank Analysis of Incomplete Block Designs*. Biometrika. | 偏好模型 $\sigma(R_W - R_L)$ | 第九章 |

### RL for LLMs

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| DPO | Rafailov et al., 2023. *Direct Preference Optimization: Your Language Model is Secretly a Reward Model*. NeurIPS. | 閉合形式 RLHF，無需顯式獎勵 | 第九章 |
| PPO-RLHF | Christiano et al., 2017. *Deep Reinforcement Learning from Human Preferences*. NeurIPS. | 從偏好學習 RL | 第八章、第九章 |

### RL for LLM Reasoning

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| DeepSeek-R1 | DeepSeek-AI, 2025. *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*. arXiv. | GRPO、稀疏驗證獎勵、思維模型 | 第十章 |
| GRPO | Shao et al., 2024. *DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models*. arXiv. | Group-relative advantage，無 V 函數 | 第十章 |
| PAV | Setlur et al., 2024. *Rewarding Progress: Scaling Automated Process Verifiers for LLM Reasoning*. arXiv. | 逐步 DPO，效率 8×+5-6% | 第十章 |
| RFT | Yuan et al., 2023. *Scaling Relationship on Learning Mathematical Reasoning with Large Language Models*. arXiv. | 拒絕採樣微調 | 第十章 |

### Model-Based RL

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| MBPO | Janner et al., 2019. *When to Trust Your Model: Model-Based Policy Optimization*. NeurIPS. | 短 rollout 合成資料 + SAC | 第十一章 |
| PETS | Chua et al., 2018. *Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models*. NeurIPS. | 集成不確定性 + CEM 規劃 | 第十一章 |
| Dreamer | Hafner et al., 2019. *Dream to Control: Learning Behaviors by Latent Imagination*. ICLR. | 潛在空間模型 + 規劃 | 第十一章 |

### Multi-Task & Meta RL

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| MAML | Finn et al., 2017. *Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks*. ICML. | 梯度型 Meta-Learning | 第十三章 |
| RL² | Duan et al., 2016. *RL²: Fast Reinforcement Learning via Slow Reinforcement Learning*. arXiv. | 循環網路 Black-Box Meta RL | 第十三章 |
| PEARL | Rakelly et al., 2019. *Efficient Off-Policy Meta-Reinforcement Learning via Probabilistic Context Variables*. ICML. | 變分任務表示 | 第十三章 |
| HER | Andrychowicz et al., 2017. *Hindsight Experience Replay*. NeurIPS. | 事後重標籤，目標條件 RL | 第十二章 |

### 探索

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| UCB1 | Auer et al., 2002. *Finite-time Analysis of the Multiarmed Bandit Problem*. Machine Learning. | UCB 後悔值上界 | 第十四章 |
| Thompson Sampling | Thompson, 1933. *On the Likelihood that One Unknown Probability Exceeds Another*. Biometrika. | 後驗採樣探索 | 第十四章 |
| DREAM | Liu et al., 2021. *DREAM: Decoupled Reinforcement Learning with Exploration for Adaptive Meta-RL*. arXiv. | 探索資訊增益，O(A log A) 樣本複雜度 | 第十四章 |

### 層級 RL & IL

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| HIRO | Nachum et al., 2018. *Data-Efficient Hierarchical Reinforcement Learning*. NeurIPS. | 事後重標籤 + 層級 RL | 第十五章 |
| SuSIE | Black et al., 2023. *Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models*. arXiv. | 圖像子目標 + diffusion | 第十五章 |

### 機器人自主學習 & Sim-to-Real

| 論文 | 引用 | 主題 | 對應章節 |
|---|---|---|---|
| RMA | Kumar et al., 2021. *RMA: Rapid Motor Adaptation for Legged Robots*. RSS. | Phase 1 特權資訊 + Phase 2 DAgger 蒸餾 | 第十七章 |
| Extreme Parkour | Zhuang et al., 2023. *Robot Parkour Learning*. CoRL. | 視覺直接整合，無地圖 | 第十七章 |
| Forward-Backward RL | Eysenbach et al., 2017. *Leave No Trace: Learning to Reset for Safe and Autonomous Reinforcement Learning*. arXiv. | 前向-後向自主學習 | 第十六章 |
| MEDAL | Sharma et al., 2021. *Autonomous Reinforcement Learning via Subgoal Curriculum*. arXiv. | Metal 算法，回到示範狀態分佈 | 第十六章 |
| AlphaGo | Silver et al., 2016. *Mastering the game of Go with deep neural networks and tree search*. Nature. | MCTS + RL，超越人類水平 | 第十七章、第十八章 |

---

## 課程資源

- 逐字稿來源目錄：`data/cs224r/transcripts/`
- 作業 handout：待補（`data/cs224r/assignments/` 目前為空）
- 課程官網：待補
