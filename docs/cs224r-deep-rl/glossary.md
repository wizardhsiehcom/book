# 術語表

本書中英術語對照表。所有章節應使用此表的翻譯，不可混用。

| 英文 | 繁體中文 | 說明 | 主要章節 |
|---|---|---|---|
| Reinforcement Learning (RL) | 強化學習 | | 第一章 |
| Deep Reinforcement Learning | 深度強化學習 | | 第一章 |
| State | 狀態 | 完整世界表示，滿足 Markov 性質 | 第一章 |
| Observation | 觀測 | 狀態的部分函數，可能需要歷史 | 第一章 |
| Action | 動作 | | 第一章 |
| Reward | 獎勵 | | 第一章 |
| Reward function | 獎勵函數 | | 第一章 |
| Policy | 策略 | | 第一章 |
| Trajectory | 軌跡 | | 第一章 |
| Episode | 回合 | | 第一章 |
| Rollout | 展開 / Rollout | 執行一次策略生成軌跡 | 第一章 |
| Markov Decision Process (MDP) | 馬可夫決策過程 | | 第一章 |
| Partially Observed MDP (POMDP) | 部分可觀測馬可夫決策過程 | | 第一章 |
| Markov property | Markov 性質 | | 第一章 |
| Dynamics | 動態模型 / 動態函數 | $p(s_{t+1}\|s_t,a_t)$ | 第一章 |
| Value function | 值函數 | $V^\pi(s)$ | 第一章 |
| Q function / Action-value function | Q 函數 / 動作值函數 | $Q^\pi(s,a)$ | 第一章、第六章 |
| Discount factor | 折扣因子 | $\gamma$ | 第一章 |
| Expected cumulative reward | 預期累積獎勵 | | 第一章 |
| Imitation learning | 模仿學習 | | 第二章 |
| Policy gradient | 策略梯度 | | 第三章 |
| Actor-Critic | Actor-Critic（保留英文）| | 第四章 |
| Off-policy | 離策略 | | 第五章 |
| On-policy | 在策略 | | 第五章 |
| Q-Learning | Q-Learning（保留英文）| | 第六章 |
| Offline RL | 離線強化學習 | | 第七章 |
| Reward learning | 獎勵學習 | | 第八章 |
| Reward shaping | 獎勵塑形 | | 第八章 |
| Inverse RL (IRL) | 逆強化學習 | | 第八章 |
| RLHF | RLHF（保留英文）| Reinforcement Learning from Human Feedback | 第八章、第九章 |
| Model-based RL | 基於模型的強化學習 | | 第十一章 |
| Model-free RL | 無模型強化學習 | | 第十一章 |
| Multi-task RL | 多任務強化學習 | | 第十二章 |
| Meta RL | 元強化學習 | | 第十三章 |
| Exploration | 探索 | | 第十四章 |
| Exploitation | 利用 | | 第十四章 |
| Hierarchical RL | 層級強化學習 | | 第十五章 |
| Sparse reward | 稀疏獎勵 | | 第八章 |
| Dense reward | 稠密獎勵 | | 第八章 |
| Sim-to-real transfer | 模擬至真實轉移 | | 第十七章 |
| Stochastic policy | 隨機策略 | | 第三章 |
| Deterministic policy | 確定性策略 | | 第五章 |
| Horizon | 視野 / 時間步長度 | | 第一章 |
| Advantage function | 優勢函數 | $A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$ | 第四章 |
| Replay buffer | 重播緩衝區 | 存歷史轉移，打破時間相關性 | 第六章 |
| Target network | 目標網路 | 落後更新的獨立 Q 網路，穩定訓練目標 | 第六章 |
| Overestimation | 過高估計 | max 操作放大 Q 值噪聲的系統性偏差 | 第六章 |
| Semi-gradient | 半梯度 | 對目標值停止梯度的訓練技巧 | 第六章 |
| Huber loss | Huber 損失 | 大誤差 L1、小誤差 L2 的混合損失 | 第六章 |
| Critic ensemble | 批評者集成 | 用多個 Q 網路的最小值對抗過高估計 | 第五章 |
| Log-derivative trick | 對數導數技巧 | $\nabla \log \pi \cdot r$，策略梯度的核心推導 | 第三章 |
| KL divergence | KL 散度 | 兩個分佈的相對熵 | 第九章 |
| KL penalty | KL 懲罰 | RLHF 中防止策略偏離基準太遠的正則項 | 第九章 |
| Bradley-Terry model | Bradley-Terry 模型 | 偏好模型：$P(y_W \succ y_L) = \sigma(R_W - R_L)$ | 第九章 |
| DPO | DPO（保留英文）| Direct Preference Optimization，閉合形式 RLHF | 第九章 |
| GRPO | GRPO（保留英文）| Group-relative Policy Optimization，無 V 函數的 PPO | 第十章 |
| Process reward model (PRM) | 逐步獎勵模型 | 對推理每一步評分的獎勵模型 | 第十章 |
| Thinking model | 思維模型 | 輸出顯式思考鏈後再給答案的語言模型 | 第十章 |
| Cross-entropy method (CEM) | 交叉熵方法 | 迭代重採樣精英動作序列的規劃算法 | 第十一章 |
| Model Predictive Control (MPC) | 模型預測控制 | 規劃 H 步但只執行第一步，然後重新規劃 | 第十一章 |
| Dynamics model | 動態模型 | 預測下一狀態的學習模型 $f_\phi(s,a) \approx s'$ | 第十一章 |
| Latent space model | 潛在空間模型 | 在低維潛在空間學習動態的模型 | 第十一章 |
| Task identifier | 任務識別符 | 語言/索引/目標狀態，用於條件化多任務策略 | 第十二章 |
| Stratified mini-batch | 分層採樣 | 確保每個任務在 mini-batch 中有均等比例 | 第十二章 |
| Hindsight relabeling | 事後重標籤 | 用不同任務獎勵重新標記已收集資料 | 第十二章 |
| Goal-conditioned RL | 目標條件強化學習 | 特殊多任務 RL，任務定義為達到某目標狀態 | 第十二章 |
| Aggregated MDP | 聚合 MDP | 把任務識別符加入狀態，所有任務形成單一 MDP | 第十二章 |
| Few-shot adaptation | 少樣本適應 | 用極少（K 個）episode 快速適應新任務 | 第十三章 |
| Black-box meta RL | 黑箱元強化學習 | 訓練有記憶的序列模型，記憶跨 episode | 第十三章 |
| In-context learning | 情境學習 | 模型從情境中推斷任務，不更新參數 | 第十三章 |
| Posterior sampling | 後驗採樣 | 維護任務假設的後驗分佈，採樣後行動 | 第十四章 |
| Thompson sampling | Thompson 採樣 | 從獎勵分佈後驗採樣，用於 Bandit 探索 | 第十四章 |
| Variational information bottleneck | 變分資訊瓶頸 | KL 正則化壓縮任務表示，去除無關資訊 | 第十三章 |
| Regret | 後悔值 | 累積獎勵與最優臂的差距，衡量探索效率 | 第十四章 |
| UCB | 上置信界 | 樂觀探索：均值 + 不確定性上界 | 第十四章 |
| Information gain | 資訊增益 | 觀測後對任務識別的不確定性減少量 | 第十四章 |
| Subgoal | 子目標 | 高層策略輸出的中間目標 | 第十五章 |
| High-level policy | 高層策略 | 層級 RL 中輸出子目標的策略（低頻，~1 Hz）| 第十五章 |
| Low-level policy | 低層策略 | 層級 RL 中執行子目標的策略（高頻，~50 Hz）| 第十五章 |
| Skill discovery | 技能發現 | 無監督學習可複用子技能的方法 | 第十五章 |
| Reset-free RL | 無重置強化學習 | 學習過程中不依賴外部重置的 RL 設定 | 第十六章 |
| Autonomous RL | 自主強化學習 | 不需要人類持續干預的機器人學習 | 第十六章 |
| Forward-backward RL | 前向-後向強化學習 | 交替學習任務策略和復原策略的自主 RL 算法 | 第十六章 |
| Single life RL | 單次生命 RL | 部署後遇到新情境自主適應，不重置 | 第十六章 |
| Extrinsics | 外源向量 | 壓縮的環境物理參數（摩擦、質量等）| 第十七章 |
| Rapid Motor Adaptation (RMA) | 快速運動適應 | 從觀測歷史在線估計環境外源，零樣本部署 | 第十七章 |
| Domain randomization | 域隨機化 | 訓練時隨機化物理參數，增強泛化 | 第十七章 |
| Sim-to-real gap | 模擬-真實差距 | 模擬環境與真實世界的物理差異 | 第十七章 |
| Sycophancy | 諂媚行為 | 語言模型傾向告訴用戶他們想聽的話 | 第九章、第十八章 |
| Calibration | 校準 | 模型預測置信度與實際準確率的一致性 | 第九章、第十八章 |
| Batch online RL | 批次在線強化學習 | 用策略收集一批資料後集中更新，循環進行 | 第十八章 |
| Open-ended learning | 開放式學習 | 不為特定任務，以學習能力本身為目標的學習 | 第十八章 |
