# 術語表

本書中英術語對照表。所有章節應使用此表的翻譯，不可混用。

| 英文 | 繁體中文 | 說明 |
|---|---|---|
| Reinforcement Learning (RL) | 強化學習 | |
| Deep Reinforcement Learning | 深度強化學習 | |
| State | 狀態 | 完整世界表示，滿足 Markov 性質 |
| Observation | 觀測 | 狀態的部分函數，可能需要歷史 |
| Action | 動作 | |
| Reward | 獎勵 | |
| Reward function | 獎勵函數 | |
| Policy | 策略 | |
| Trajectory | 軌跡 | |
| Episode | 回合 | |
| Rollout | 展開 / Rollout | 執行一次策略生成軌跡 |
| Markov Decision Process (MDP) | 馬可夫決策過程 | |
| Partially Observed MDP (POMDP) | 部分可觀測馬可夫決策過程 | |
| Markov property | Markov 性質 | |
| Dynamics | 動態模型 / 動態函數 | $p(s_{t+1}\|s_t,a_t)$ |
| Value function | 值函數 | $V^\pi(s)$ |
| Q function / Action-value function | Q 函數 / 動作值函數 | $Q^\pi(s,a)$ |
| Discount factor | 折扣因子 | $\gamma$ |
| Expected cumulative reward | 預期累積獎勵 | |
| Imitation learning | 模仿學習 | |
| Policy gradient | 策略梯度 | |
| Actor-Critic | Actor-Critic（保留英文）| |
| Off-policy | 離策略 | |
| On-policy | 在策略 | |
| Q-Learning | Q-Learning（保留英文）| |
| Offline RL | 離線強化學習 | |
| Reward learning | 獎勵學習 | |
| Reward shaping | 獎勵塑形 | |
| Inverse RL (IRL) | 逆強化學習 | |
| RLHF | RLHF（保留英文）| Reinforcement Learning from Human Feedback |
| Model-based RL | 基於模型的強化學習 | |
| Model-free RL | 無模型強化學習 | |
| Multi-task RL | 多任務強化學習 | |
| Meta RL | 元強化學習 | |
| Exploration | 探索 | |
| Exploitation | 利用 | |
| Hierarchical RL | 層級強化學習 | |
| Sparse reward | 稀疏獎勵 | |
| Dense reward | 稠密獎勵 | |
| Sim-to-real transfer | 模擬至真實轉移 | |
| Stochastic policy | 隨機策略 | |
| Deterministic policy | 確定性策略 | |
| Horizon | 視野 / 時間步長度 | |
| Advantage function | 優勢函數 | $A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$ |
| Replay buffer | 重播緩衝區 | 存歷史轉移，打破時間相關性 |
| Target network | 目標網路 | 落後更新的獨立 Q 網路，穩定訓練目標 |
| Overestimation | 過高估計 | max 操作放大 Q 值噪聲的系統性偏差 |
| Semi-gradient | 半梯度 | 對目標值停止梯度的訓練技巧 |
| Huber loss | Huber 損失 | 大誤差 L1、小誤差 L2 的混合損失 |
| Critic ensemble | 批評者集成 | 用多個 Q 網路的最小值對抗過高估計 |
| Log-derivative trick | 對數導數技巧 | $\nabla \log \pi \cdot r$，策略梯度的核心推導 |
| KL divergence | KL 散度 | 兩個分佈的相對熵 |
| KL penalty | KL 懲罰 | RLHF 中防止策略偏離基準太遠的正則項 |
| Bradley-Terry model | Bradley-Terry 模型 | 偏好模型：$P(y_W \succ y_L) = \sigma(R_W - R_L)$ |
| DPO | DPO（保留英文）| Direct Preference Optimization，閉合形式 RLHF |
| GRPO | GRPO（保留英文）| Group-relative Policy Optimization，無 V 函數的 PPO |
| Process reward model (PRM) | 逐步獎勵模型 | 對推理每一步評分的獎勵模型 |
| Thinking model | 思維模型 | 輸出顯式思考鏈後再給答案的語言模型 |
| Cross-entropy method (CEM) | 交叉熵方法 | 迭代重採樣精英動作序列的規劃算法 |
| Model Predictive Control (MPC) | 模型預測控制 | 規劃 H 步但只執行第一步，然後重新規劃 |
| Dynamics model | 動態模型 | 預測下一狀態的學習模型 $f_\phi(s,a) \approx s'$ |
| Latent space model | 潛在空間模型 | 在低維潛在空間學習動態的模型 |
| Task identifier | 任務識別符 | 語言/索引/目標狀態，用於條件化多任務策略 |
| Stratified mini-batch | 分層採樣 | 確保每個任務在 mini-batch 中有均等比例 |
| Hindsight relabeling | 事後重標籤 | 用不同任務獎勵重新標記已收集資料 |
| Goal-conditioned RL | 目標條件強化學習 | 特殊多任務 RL，任務定義為達到某目標狀態 |
| Aggregated MDP | 聚合 MDP | 把任務識別符加入狀態，所有任務形成單一 MDP |
| Few-shot adaptation | 少樣本適應 | 用極少（K 個）episode 快速適應新任務 |
| Black-box meta RL | 黑箱元強化學習 | 訓練有記憶的序列模型，記憶跨 episode |
| In-context learning | 情境學習 | 模型從情境中推斷任務，不更新參數 |
| Posterior sampling | 後驗採樣 | 維護任務假設的後驗分佈，採樣後行動 |
| Thompson sampling | Thompson 採樣 | 從獎勵分佈後驗採樣，用於 Bandit 探索 |
| Variational information bottleneck | 變分資訊瓶頸 | KL 正則化壓縮任務表示，去除無關資訊 |
| Regret | 後悔值 | 累積獎勵與最優臂的差距，衡量探索效率 |
| UCB | 上置信界 | 樂觀探索：均值 + 不確定性上界 |
| Information gain | 資訊增益 | 觀測後對任務識別的不確定性減少量 |
| Subgoal | 子目標 | 高層策略輸出的中間目標 |
| High-level policy | 高層策略 | 層級 RL 中輸出子目標的策略（低頻，~1 Hz）|
| Low-level policy | 低層策略 | 層級 RL 中執行子目標的策略（高頻，~50 Hz）|
| Skill discovery | 技能發現 | 無監督學習可複用子技能的方法 |
| Reset-free RL | 無重置強化學習 | 學習過程中不依賴外部重置的 RL 設定 |
| Autonomous RL | 自主強化學習 | 不需要人類持續干預的機器人學習 |
| Forward-backward RL | 前向-後向強化學習 | 交替學習任務策略和復原策略的自主 RL 算法 |
| Single life RL | 單次生命 RL | 部署後遇到新情境自主適應，不重置 |
| Extrinsics | 外源向量 | 壓縮的環境物理參數（摩擦、質量等）|
| Rapid Motor Adaptation (RMA) | 快速運動適應 | 從觀測歷史在線估計環境外源，零樣本部署 |
| Domain randomization | 域隨機化 | 訓練時隨機化物理參數，增強泛化 |
| Sim-to-real gap | 模擬-真實差距 | 模擬環境與真實世界的物理差異 |
| Sycophancy | 諂媚行為 | 語言模型傾向告訴用戶他們想聽的話 |
| Calibration | 校準 | 模型預測置信度與實際準確率的一致性 |
| Batch online RL | 批次在線強化學習 | 用策略收集一批資料後集中更新，循環進行 |
| Open-ended learning | 開放式學習 | 不為特定任務，以學習能力本身為目標的學習 |
