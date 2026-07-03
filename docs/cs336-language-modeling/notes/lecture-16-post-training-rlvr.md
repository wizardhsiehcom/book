# Lecture 16：Post-Training (RLVR) 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 16, Post-Training: RLVR（Reinforcement Learning from Verifiable Rewards）
- 逐字稿檔案：`data/cs336/transcripts/16_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_16_Post-Traini.txt`
- 完整閱讀範圍：第 1 行到第 2054 行（讀到最後一句 "See you next week."）
- 總行數：2054
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。所有模型與論文（DeepSeek R1／R1-Zero、DeepSeek Math、Kimi K1.5、Qwen 3／Qwen 3 Coder Next、Dr. GRPO 等）皆只依逐字稿講者口頭描述整理，不外查論文原文或確切數據。
- ASR 轉寫更正對照（本講逐字稿無 timestamp，且將許多專有名詞誤轉）：
  - `PO` → **PPO**（Proximal Policy Optimization）
  - `gpo`／`gRP`／`gRPO`／`GRP` → **GRPO**（Group Relative Policy Optimization）
  - `coot`／`coott`／`coots` → **CoT / chain of thought**（思維鏈）
  - `Quen`／`Quinn`／`Quent`／`Quent 2.5` → **Qwen**
  - `Kimmy` → **Kimi**
  - `01` → **o1**（OpenAI o1）
  - `Alph Go` → **AlphaGo**
  - `RFP` → **RFT / rejection fine-tuning**（拒絕取樣微調，講者也稱 rejection fine-tuning）
  - `Bradley Perry` → **Bradley-Terry**
  - `remon hypothesis` → **Riemann hypothesis**（黎曼猜想）
  - `SweetBench`／`Swebench` → **SWE-bench**
  - `Senardo` → 疑為 **Sutton & Barto**（RL 經典教科書，存疑，逐字稿僅稱「the big classic book for reinforcement learning」）
  - `counterfact QA`、`omni math` → 疑為某 benchmark 名稱（存疑，逐字稿僅口頭帶過）
  - `zcore` → **z-score**

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行（"Okay, maybe we shall get started."）
- 終點：第 2054 行（"Okay, great. Thanks a lot. See you next week."）
- 是否從頭到尾完整閱讀：是，分段依序讀完全部內容，未跳段、未只用搜尋或抽樣。
- 跳過段落：無。

## 本講主問題

這是兩堂 post-training 講次的第二堂。上一講（Lecture 15）走到 instruction tuning 與 RLHF，並在結尾點出 RLHF 的困境：它受制於 reward model 的 overoptimization——preference data 有限、reward model 會被 overfit，無法無止盡地把 compute 灌進同一個 reward model。本講要回答的是：在數學、程式這類「可驗證（verifiable）」的領域，能不能改用一個 reward 本身不會被 hack 的訊號，讓 RL 真正發揮 AlphaGo 那種「投更多 compute 就更強」的潛力？講者用兩部分回答：第一部分講核心演算法（PPO → 為什麼要擺脫它 → GRPO 及其性質），第二部分逐一拆解近期開源模型技術報告（DeepSeek R1、Kimi K1.5、Qwen 3、Qwen 3 Coder Next），示範這些演算法在真實 pipeline 中如何被組合、以及 agentic RLVR 的新進展。

## 核心概念

### 1. RLVR 的動機：從 learning problem 走向 search problem

RLHF 的根本限制是 annotation bottleneck 與 overoptimization：reward model 是從有限 preference data 學來的近似訊號，投入越多 compute 就越會 overfit reward model，無論怎麼 regularize 最終都會撞牆。講者對比 AlphaGo：在圍棋裡 reward（勝負）是精確、無 sloppiness 的定義，因此可以無限灌 compute，只要目標函數改善就是真的變強——這比較像 search problem。RLHF 則比較像 learning problem。RLVR 的賭注是：formal / natural language mathematics、coding 這類領域有「可驗證」的性質，因此更像 search，更適合 RL。演算法本身和 RLHF 差別不大，但終點會出乎意料地不同。

### 2. Policy gradient / REINFORCE trick 是一切的核心

講者反覆強調：在語言模型的 RL 裡最重要的一件事是 policy gradient，特別是 REINFORCE 的梯度技巧。本質上我們做的永遠是「對 reward 做 gradient descent」，而做法是把它化成一組**加權的 SFT 更新（weighted SFT updates）**，權重可正可負。整堂課的其他式子都是從這條 REINFORCE 梯度式衍生出來的。

### 3. PPO：好用但難搞的 workhorse

PPO 是 RL 的 workhorse，OpenAI 早年用它訓練會走路的 agent、Dota bot（OpenAI Five）等 high-dimensional 動作/狀態空間的深度 RL。概念上 PPO 很簡單（依 OpenAI Spinning Up 的 pseudo code）：

1. sample 一批 trajectories；
2. 用某種 advantage estimation 方法算 advantage；
3. 把 advantage 做 clip（PPO 的 clipped surrogate）；
4. 在 clipped advantage 下更新 policy；
5. 另外 fit 一個 value function。

但實務上 PPO 對實作決策極度敏感——存在「PPO 的 37 個實作細節」這種部落格文章，看到就該心生恐懼。許多人其實實作錯了，甚至有論文指出某些人用的 baseline 根本不是 baseline，會從根本改變最佳化問題。語言模型上的 PPO 尤其不愉快：有 advantage estimation、experience buffer（保留舊資料）、需要訓練 value model（且 value model 大小與原模型相同，吃掉本可用於推理伺服器的記憶體），而且 KL 項是 **token by token** 運作的，所以不是單純的 bandit problem，而是完整的 multi-step RL problem。

講者舉了一個學生為 RLHF 專案實作 PPO 的例子：外層 loop（跑 rollouts、算 loss、clip 梯度、更新）都合理，內層 compute loss 也大致貼合 PPO update，但一到 rollouts 與 KL penalty 這些「messier parts」就出現 hack——例如 KL penalty 只有在把 KL clip 在 0 以上時才 work，可是這樣做完全破壞了 KL divergence 的意義（KL 本該有正有負相加），不 clip 又會立刻爆炸。另一個常見現象：原始 PPO 論文用 generalized advantage estimator（GAE，帶 gamma 折扣的 value function 逐 token 估計 reward），但大家常直接設 gamma = lambda = 1，這是退化設定，等於把問題打回 bandit problem，丟掉了 PPO 帶來的結構。

結論：PPO 不是不能用（很多 lab 有 turnkey 的規模化方案，也訓出很好的模型），但對從零實作的研究者來說 finicky、需要 hack 才穩定、又要多養一個和模型一樣大的 value model。

### 4. 為什麼不是 DPO：用錯鎚子

上一講的 DPO 看似很好，但它是「對特定問題的特定解」——只適用於 Bradley-Terry 形式的 pairwise preference。數學題本質上不是 pairwise 比較。雖有 DPO 變體想打破 pairwise 結構，但那是用錯鎚子。PPO 是更通用的鎚子。DPO 一般是 offline，但講者認為這個 offline/online 區別被過度誇大，因為反覆迭代 DPO 就能變 online。整個研究社群有強烈動機「不要再用 PPO」——DPO 與 GRPO 之所以被廣泛採用，正說明把 PPO 弄 work 有多痛苦。

### 5. GRPO：拔掉 value function，改用 group z-score advantage

GRPO 出自 DeepSeek 的 DeepSeek Math 論文。它接受 PPO 是好點子，但只改一件（也是最麻煩的）事：拿掉 value function。value function 是拿來當 baseline 減 variance 的整個神經網路，它會 destabilize 訓練。拿掉之後仍需要 advantage（不能用 vanilla REINFORCE，variance 太高），做法是把 advantage 算成**同一個 group 內的 z-score**：

- 對同一個 prompt sample 出 G 個 rollouts（一個 group）；
- 每個 rollout 的 reward 減去該 group 的 mean、再除以該 group 的 standard deviation，得到 z-score 當 advantage。

直覺：不再用 value network 預測「我該得幾分」，而是「我這次和另外抽的 G 個 rollout 相比表現如何」，比 group 平均好就是高 advantage。GRPO objective 仍照 PPO 的 min-clipped advantage 形式，外加一個 KL 項讓自己貼近 reference。在 **online** 情況下（pi_theta_old 與 pi_theta 相同，ratio = 1），clipping 從不觸發、直接消失，objective 退化成「advantage 減 KL penalty」，非常簡潔。

實作上非常簡單，可一頁寫完：rollout K 次 → 對每個 rollout 算 reward → 用 K 個 reference 做 z-score 標準化 → 算 KL 項 → 對 (KL 項 + rollouts) 組合做 REINFORCE 梯度更新（用 autodiff 時需要在某處放 stop-grad）。講者引用 McGill 某團隊的 toy 參考實作：整個 group index 與標準差計算塞在半張投影片內；唯一與論文寫法不同處是在標準差上加一個極小的 `1e-4`，避免只有單一 sample、或 group 內 reward 完全相同（例如全部答錯、數值精確為 0）時除以零爆炸。DeepSeek Math 結果顯示 GRPO（藍、黃線）明顯優於 RFT（rejection fine-tuning，只留模型答對的答案來訓練、其餘丟掉），並宣稱 process supervision 也帶來一些增益（後續 R1 會推翻其必要性）。

### 6. GRPO 不是第一原理推導：兩個「修正項」的利弊

關鍵洞察：GRPO 並非嚴格的 policy gradient with baseline。REINFORCE with baseline（Sutton & Barto，存疑）只允許你從 reward 減去一個**state-dependent baseline**（bandit 世界中 state 就是 prompt），任何只做這件事的東西都是合法 policy gradient，會朝相同方向下降，只是 variance 高低不同。但 GRPO 做了兩件超出此契約的事：

1. **除以 standard deviation**（z-score 的分母）——破壞了 baseline 契約，不再是純粹「減 baseline」。
2. **length normalization**——GRPO 幾乎逐 token，把 loss 除以整個序列長度做正規化。

若真的從第一原理循 policy gradient + baseline 定理推導，你不會得到長度正規化，也不會有標準差正規化。GRPO 出來後不久就有人（後述 Dr. GRPO）指出這點，並寫論文說明拿掉這兩項會得到很不一樣、甚至更好的行為。兩項各自的效果：

- **Length normalization 的副作用**：除以長度會鼓勵模型在「答錯」時把輸出拉長。極端例子：已知證明會錯、要吃 −1 的負 reward，那就生成無限長字串，除以無限大就把懲罰稀釋掉。這正是大家在 GRPO 觀察到「CoT 長度不斷成長」的來源之一。修掉它後，CoT 長度會收斂到一個常數而非無止盡成長，尤其在答錯的 case 上不會越寫越長。
- **Standard deviation normalization 的副作用**：除以標準差等於**強調標準差小的問題**。對 binary reward，標準差小 = 問題太簡單（總是全對）或太難（總是全錯），兩端都被 upweight。但我們其實想讓模型學在「可解範圍（solvability range）」內的題目，所以這個 upweight 兩端的行為未必是好事。

### 7. DeepSeek R1 / R1-Zero：RLVR 可以有多簡單

DeepSeek R1 是社會現象級論文，掀起開源 RLVR 浪潮，被視為第一個真正 match OpenAI o1 行為的開源工作：很長的 CoT、明顯是 RL、在難數學題上表現很好，並提供人人可複製的 RL recipe（不是只有 DeepSeek 能跑的 PPO 怪物，而是誰都能玩的 GRPO），還有站得住腳的 distillation 洞見。R1 建立在 DeepSeek Math 的 GRPO 經驗上，但有一個關鍵差異：**放棄 process supervision，只用 outcome supervision**。

- **Outcome supervision**：只針對最終答案對錯給 reward。
- **Process supervision**：用評分 rubric 檢查證明中間步驟的正確性。

很多人以為 process supervision 很重要，結果證明對很多事並非關鍵。

**R1-Zero** 是最乾淨的元件：base model（其實也經過 mid-training，已有一定 instruction following 能力）上直接做 RLVR，GRPO 的 reward 只有兩種——**accuracy reward**（一批數學題答對與否）與 **format reward**（要求模型正確用 thinking tags 包住 CoT，這很重要，因為之後才能把 CoT 切出來）。就這麼簡單的 recipe，最後只比 OpenAI o1 差一點點。講者特別喜歡這個結果，因為它沒有真實 production pipeline 的雜訊（不用煩惱是不是 RLHF 幫的忙），是「base model + GRPO」的乾淨對照。作業中你會複製類似結果。

R1 論文宣稱觀察到兩個現象：訓練越久 CoT 越長、以及爆紅的「aha moment」。但講者對兩者的「驚人程度」存疑：長 CoT 現在看來只是 GRPO length normalization 的自然副作用；aha moment 有人證明在 base model 就已存在，不可能純是 RL 演算法的產物（模型在 pre-training 就學過，RL 只是把它 extract 出來）。R1 真正重要的里程碑意義是：**凸顯了 RLVR 可以有多簡單、多乾淨**。

**R1（production 版）** 在 R1-Zero 之上把系統產品化，示範元件如何堆疊：mid-trained model → 一堆 reasoning training（可能加 long context extension）→ 最後做 RLHF（因為那是最 user-facing 的部分，能修 formatting）。R1 額外加了一個 **language consistency reward**：R1-Zero 風格訓練會在 CoT 裡切換語言，看起來 uninterpretable 且令人不安，所以加此 reward 讓輸出維持單一語言（純為 interpretability，可能小幅犧牲效能）；也把一些 non-verifiable rewards 摻進 GRPO，近似把 RLHF 融進來。R1 的 SFT 用「少量 long CoT data」——講者玩味地指出這種措辭很可能是從別的模型 distill 來的（現在大家都這麼做）。對很好的 base model，光是在 long CoT 上做 SFT 就能解鎖大量 o1 風格能力，是很好的 RL 起點；接著加 verification 過濾這些 CoT。R1 的 RL 部分基本與 R1-Zero 相同（少掉 language consistency loss），最後接 instruction tuning SFT + RLHF（non-verifiable 部分沿用 DeepSeek V3）。效果非常好，在很多類別上勝過 o1，且 recipe 簡單、增益來源清楚。

### 8. Distillation：RL 是 supervision 的來源，一旦有了 CoT 就能靠模仿

把 R1 的 CoT 灌進 Qwen 2.5（甚至 Llama）做 SFT，能大幅提升這些模型效能，某些情況直接 match 專門的 thinking model。講者提出一個看待 RL 角色的方式：**RL 是很好的 supervision 來源**——解 frontier 數學題時你沒有現成的 detailed long CoT 監督訊號，RL 讓模型自我生成這些 CoT；但一旦有人生成出這些 legible 的 long CoT，就能用 imitation（SFT）學會。這也帶出一個仍開放的問題：某些能力到底是否真的需要 RL，還是 SFT distillation 就夠。

### 9. 失敗的探索：PRM 與 MCTS

講者稱讚 DeepSeek 技術報告會誠實交代做過但失敗的東西。DeepSeek Math 有大量 process reward model（PRM）內容，到了 R1 卻不見了——報告說明他們試過讓 PRM work，但幫助不大；outcome reward model（ORM）已經夠好、資料還更好 scale。PRM 的一大難題是 step-by-step rubric 從哪來、很難 scale up。同理，o1 剛出時大家猜 OpenAI 是不是在用 PRM 或 AlphaGo 式 tree search，DeepSeek 也試了很多 MCTS 但坦承 work 得不好。目前很清楚 ORM 才是主戰場。

### 10. Kimi K1.5：不同路徑、相似終點

Kimi K1.5 與 R1 幾乎同時出、也贏過 o1，但較少被討論。它在幾件事上與 DeepSeek 明顯不同，兩者都能 work 這件事本身就有學習價值（這是整堂課的主題：讀大量技術報告、看整體 pattern，抓出哪些設計是「有效/容易 work」的空間）。重點：

- **資料與 curriculum**：RL 多了一層 curriculum 的皺褶——題目太難就完全沒 reward，沒 reward 就沒 signal、學不了，所以要有正確難度的廣覆蓋。Kimi 先求廣覆蓋，排除 multiple choice（缺乏 long deep thought，且很多領域已涵蓋）。最重要的一招是 **best-of-K 過濾**：sample K 次（例如 best-of-8），若模型至少能成功一次，代表已在能力邊緣、教不了新東西，就排除這類題；也可雙邊過濾拿到「不太難也不太易」的中等難度題。研究社群共識是這種中等難度過濾對讓 RL 穩定推進很好。SFT 細節同樣沒揭露。
- **演算法**：Kimi 走 DPO 風格的推導（假設能解析地 maximize，解出對應的 reward model，代回 objective；因為在 minimizer 處兩邊相等，就對這個等式放一個 squared loss 去最小化——最佳化的人看了會 horrified，但直覺上合理）。神奇的是對這個 L 取梯度後，得到的東西「出奇地像 GRPO 加一個 regularizer 項」：一個帶 baseline（R bar，即每個條件 x 的 mean）的 policy gradient，加上等同 GRPO KL 的 regularizer。等於用很不同的路徑重新發明了 group-mean-normalized baseline。這佐證了哪些元件是真正有用的。
- **長度觀點更清醒**：GRPO 陣營傾向把「CoT 長度失控成長」當好事（暗示模型更聰明），Kimi 陣營反過來認為 long CoT 很浪費（CoT 就是 inference 成本），他們的 objective **不做序列長度正規化**，還進一步想**壓短回應**：加一個 heuristic length reward。這個 reward 意外複雜——正確答案也該短，但若把答錯的答案壓得太短，模型就沒有空間 recover（例：AI 幾何很差，若懲罰把幾何 CoT 壓到 0，就永遠爬不回正 reward、卡死）。所以不強迫答錯者超短，只誘導其比平均略短，讓錯誤回應不至無界成長。這也對應了語言模型開發的一個普遍趨勢：CoT 越短越好——若你是 OpenAI、$200 pro 方案的用戶每次思考一小時，你等於在 subsidize 用戶；思考五分鐘才是好位置。
- **資料集持續 curation**：追蹤各題成功率，一旦模型 master 某題就把它移出題庫省 compute（幾乎所有做 RL 的人都做這種 success-rate filtering）。
- **verifiable 的鎚子其實不好打**：code 用 ground-truth solution 生成新 test case；math 用一個 **reward model** 做 answer equivalence check。諷刺點在於：本講開頭說要做「真正可驗證、compiler 能檢查」的東西，繞了一大圈最後又回到 reward model。因為 answer equivalence checking 很難——數學等價寫法很多，語言模型即使 prompt 它輸出 `\boxed{}` 也可能漏掉框、加料，明明想法對卻被嚴格 checker 判錯。所以大多數 RL 專案都有很複雜的 answer checker（regex 或 model 或別的），「把 RLVR 的 verified 部分做對」是個 rabbit hole。

### 11. RL infra：把 training 和 inference 的難處疊在一起

RL 把 training（難）和 inference（難）綁在一起，所以格外可怕。幾個不直觀的難點：

- **長 rollout 拖累 batch**：若某個 rollout 卡在超難題（講者以黎曼猜想比喻）產出巨長 CoT，naive batch inference 下所有人都在等它完成才能進下一階段。要不要 truncate？要不要丟到別的機器？都是設計選擇。
- **training / rollout 切換昂貴**：rollout 一次、train 一次交替，要嘛把機器分成純 rollout 機與 training 機，要嘛不停切換框架，兩者都很貴。
- **on-policy vs off-policy 的殘酷取捨**：on-policy 的 GRPO 數學與訓練動態都很好（作業會體驗），但系統利用率低；一旦貪心地想 reuse rollouts、overlap inference 與 computation，就進入 off-policy，訓練會被 destabilize。
- 技術報告現在多半有一節談 RL infra：藍框（training）+ 綠框（inference），要把權重從 training 端搬到 inference 端，要緊密協調，有時甚至共用機器（inference 在跑時 training 端 idle）。

Kimi 的結果顯示 RL 進行中思考變長、效能上升，但並非無界增加 token——某些 case（如 Omni-MATH，存疑）思考沒變長多少但效能持續上升，可能就是 length control 生效的好例子。

### 12. Expert iteration vs RL

「這些 RL 真的比直接在正確答案上訓練（expert iteration）好嗎？」expert iteration 在過去很多論文表現很好，遇到非常不穩定的情況甚至該優先用它。但 Kimi K1.5 有大規模 ablation 顯示 RL 方法一致優於 expert iteration（橘線贏藍線）。想榨出全部效能就避不開 RL。

### 13. Qwen 3：成熟 playbook 與 thinking mode fusion

Qwen 3 的組織方式與 DeepSeek 很像：base → SFT → reasoning RL → **thinking mode fusion** → RLHF → 出貨模型 → distillation 得到小模型。可以把這當作「frontier-ish 語言模型怎麼被建出來」的心智圖。Qwen 用的是此時已 tried-and-tested 的 RLVR playbook，取 Kimi 與 DeepSeek 的最佳部分：

- 大量 **difficulty filtering** 省 compute；移除模型不用 CoT 就能答對的題（不是 thinking problem）；移除與 validation data 太像的題做 decontamination；對 reference CoT 做一點人工過濾。
- 最引人注目：Qwen 3 只用**約 4,000 個 RL 範例**，但其餘 pipeline 對了就能走很遠。
- **thinking mode fusion**：用 tag 把 thinking / non-thinking 混在**同一個模型**裡（instant response 與 long CoT 共存於一個模型，這在過去常是兩個模型）。還有 **early-exit thinking**：append 特殊字串就立刻停止 CoT、逼模型給答案（ChatGPT 介面上也有提早結束思考的 affordance）。隨 thinking budget 變化，效能 **graceful degradation**：即使在很低 budget、CoT 被中途截斷，模型仍給出相當合理的回應；且 thinking mode 在數學/程式任務上一致大幅優於 instant response mode。
- Qwen 提供各元件對效能的貢獻拆解：reasoning RL → general RL 逐步在各類任務（如 arena hard、counterfact QA〔存疑〕）上進步，一般任務靠較正常的 RLHF 有全面提升；因為融合 non-thinking 元件，math/coding 有些退化但不嚴重。不過講者說後續某些 Qwen 3.5 已**放棄把 thinking/non-thinking 融進單一模型**（過去稱 hybrid model），因為這個退化被認為不可接受，想在 thinking mode 上榨出全部效能，於是把兩種模型分開。

### 14. Qwen 3 Coder Next：agentic RLVR

（講者更正名稱為 Qwen 3 Coder Next，非 Next Coder。）這是他認為 agentic RLVR 訓練細節最多的技術報告。核心訊息：agent 的 post-training 沒有全新演算法，重點永遠是 **data**。

- **Mid-training 階段**（能力不能只在最後注入）大量收集 agentic/coding 資料：把 repository 的檔案串接成很長的 long-context 資料；取 pull request 並用 RAG 為它建構有助理解的 synthetic context；用自動方法偵測含 text+code 的文件、用 LLM 轉成漂亮 markdown；讓 LLM 對 coding 相關網頁「談論 coding」生成 coding-ish synthetic data；跑公開 coding agent 於各種環境、把 trace 全丟進 mid-training；加上 instruction following 與 fill-in-the-middle 任務。
- **多 expert 再 distill 回單一模型**：講者說沒在別處見過的做法——拿 mid-trained Qwen 3 Next，針對不同 coding-adjacent 任務訓練出 **4 個 expert model**（webdev expert：在通過各種檢查的合法 web code 上 SFT；UX/build expert：在多種 tool format 上訓練；QA agent：更多 code synthetic data；以及最重要、最複雜的 **software engineering agent**），再把它們全 distill 回同一個模型。最接近的先例是學術界的 branch-train-merge，以及 DeepSeek V3.2（講者對版本號不確定，猜 3.2）用 data-processing expert 生成訓練資料。distillation 需要寫下一串 prompt 讓 expert 在其上蒸餾進最終模型；此法好處是各 team 可獨立開發 expert、聚合也可簡單，但若 compute 夠、其實不如把所有 objective 丟進同一個大 training loop 省事。
- **SWE agent 與 reward hacking**：以 SWE-bench 為 gold standard，用基於 GitHub 的自動方法大規模生成 issue、建構 agent 環境（SWE-bench but more）再做 RL。關鍵警示：**RLVR 的穩健度只等於 reward 的穩健度**。我們敢把越來越多 compute 灌進 RL，是因為相信 reward model 難被 hack；一旦此假設破裂，RL 會找到越來越隱晦的作弊方式。例子：git 裡可以看未來/不同 commit，若有 issue 又有 future commit，模型可直接查出 fix——是很容易學到的 hack。他們因此加了一個 reward，專門阻止 agent 動 git 歷史；不加的話，效能曲線會學著學著突然出現 emergent jump，其實是學會操縱 git 呼叫拿歷史（甚至你禁用 `git log`，它可能加一個 remote origin 再去查 remote 的 commit）。另一側證：講者和學生做 lean（formal、verifiable 的數學語言）RL，本以為 lean compiler 是 bulletproof，結果 lean compiler **不是 adversarially robust**——有些字串能在某些 mode 下驗證本不該通過的證明。所以「verifiable rewards」比想像中 trickier。最終這個 3B active parameter 的小模型（MoE，active 3B）在 SWE-bench 上做到約 **70.6%**。但講者提醒：task-specific 效能不必然 generalize 到更廣領域，比較效能時要小心。

### 15. 核心 takeaway

- RL 一切都關乎 **reward**。RLHF 與 RLVR 其實是很相似的問題，差別在 RLVR 要更 unhackable 的 reward，才能灌更多 compute、把系統做得更好。
- 對研究社群而言 **GRPO** 是關鍵推手，functional form 與 update 規則要熟到像 pre-training loss 一樣。
- RL 依然 finicky、noisy、難搞，但不像舊時代在各種棘手環境上做 PPO 那麼糟，其實比想像中平順。

## 重要細節

### 定義

- **RLVR**：Reinforcement Learning from Verifiable Rewards，在 reward 可被程式/規則/檢查器驗證的領域（數學、程式）做 RL。
- **Overoptimization（overfitting reward model）**：對固定 reward model 灌太多 compute，最終 overfit 該近似 reward、真實目標不再改善。
- **Policy gradient / REINFORCE**：把「對 reward 做 gradient descent」化為權重可正可負的加權 SFT 更新。
- **PPO**：clipped surrogate + value function 的 on/near-policy RL；KL 逐 token；需與模型同大的 value network。
- **GAE**：generalized advantage estimator，帶 gamma 折扣、用 value function 逐 token 估 reward；常被退化成 gamma=lambda=1（=bandit）。
- **DPO**：對 Bradley-Terry pairwise preference 的特定解，一般 offline（可迭代成 online）。
- **GRPO**：拔掉 value function，advantage = group 內 reward 的 z-score（減 mean、除 std）；online 時 clipping 消失。
- **Outcome supervision（ORM）**：只對最終答案給 reward。
- **Process supervision（PRM）**：對中間步驟依 rubric 給 reward。
- **Expert iteration**：只在模型答對的樣本上訓練（近似 RFT/rejection fine-tuning 的迭代版）。
- **best-of-K filtering**：sample K 次，據成功率篩選 RL 題目難度（排除太易/太難）。
- **thinking mode fusion**：用 tag 把 long-CoT thinking 與 no-CoT non-thinking 放進同一模型。
- **Reward hacking**：模型鑽 reward 漏洞（如查 git future commit）拿到 reward 而非真的解題。

### 公式／量化描述（皆依講者口頭，未核對論文）

- GRPO advantage：`A_i = (r_i − mean(r_1..r_G)) / std(r_1..r_G)`，實作在 std 上加 `1e-4` 防爆。
- GRPO 額外兩修正項：length normalization（除以序列長度）、standard deviation normalization（z-score 分母）——皆非第一原理 policy gradient 應有。
- PPO 敏感度：「37 個實作細節」。
- GAE 常見退化設定：gamma = lambda = 1。
- Qwen 3 RL 範例數：約 4,000。
- Qwen 3 Coder Next：3B active parameter，SWE-bench 約 70.6%。
- Kimi 長度 reward：誘導答錯回應「比平均略短」而非強制超短。

### 演算法／流程

- **REINFORCE 核心**：對 reward 做加權 SFT 更新，權重可正可負。
- **PPO 流程**：sample trajectories → advantage estimation → clip advantage → 更新 policy → fit value function。
- **GRPO 流程（可一頁實作）**：對 prompt rollout K 次 → 每個 rollout 算 reward → group 內 z-score 標準化 → 算 KL 項 → 對 (KL + 標準化 advantage) 做 REINFORCE 梯度（需 stop-grad）。
- **R1-Zero recipe**：mid-trained base model + GRPO，reward = accuracy reward + format reward（thinking tags），無 SFT。
- **R1 pipeline**：mid-trained → long-CoT SFT（+ verification 過濾）→ reasoning RL（GRPO，+ language consistency reward）→ instruction SFT → RLHF（non-verifiable 沿用 DeepSeek V3）。
- **Kimi 推導**：DPO 式解析 maximize → 解出 reward-policy ratio → 代回 → 對「minimizer 處成立的等式」放 squared loss → 梯度後得到 baseline=group mean 的 policy gradient + KL regularizer。
- **Qwen 3 pipeline**：base → SFT → reasoning RL → thinking mode fusion → RLHF → distillation 至小模型。
- **Qwen 3 Coder Next**：agentic mid-training（repo 串接、PR+RAG、markdown 轉換、agent trace、FIM）→ 4 個 expert（webdev/UX build/QA/SWE agent）各自 SFT 或 RL → distill 回單一模型；SWE agent 在大規模 GitHub 生成環境上 RL，並加 anti-git-hacking reward。

### 工程限制

- PPO 需與模型同大的 value model，吃記憶體；實作極敏感、常需 hack（如 KL clip 在 0 破壞 KL 意義）。
- GRPO length norm 會鼓勵答錯時輸出變長（除以無限大稀釋懲罰）；std norm 會 upweight 太易/太難的兩端題目。
- RL curriculum：題太難無 reward、無 signal，需要中等難度覆蓋。
- Answer equivalence checking 很難，逼得多數 RLVR 專案回頭用 reward model / 複雜 checker。
- RL infra：長 rollout 拖累 batch；on-policy 穩定但利用率低、reuse rollout 進 off-policy 會 destabilize；需搬權重、協調 training/inference。
- Reward hacking：verifiable reward 未必 adversarially robust（git 歷史、lean compiler 皆可被鑽）。

### 講者例子

- AlphaGo：勝負 reward 精確無 sloppiness，可無限灌 compute（search vs learning）。
- OpenAI 早年 PPO：讓 agent 走路、OpenAI Five（Dota bot）。
- 學生的 RLHF PPO 專案：外層 loop 合理、內層需 KL-clip 等 hack。
- 黎曼猜想：比喻超難題產生巨長 rollout 拖累 batch inference。
- 幾何很差的 AI：說明壓縮 length reward 若讓答錯者太短會無法 recover。
- git future commit / remote origin：reward hacking 例。
- lean compiler 非 adversarially robust：verifiable reward 可被鑽的親身例子。
- $200 pro plan 用戶思考一小時 = 平台 subsidize：說明壓短 CoT 的商業動機。

### 問答重點

- Length normalizer 對「正確」case 的作用：鼓勵縮短 CoT（省 inference 成本，但可能傷準確度）；正 case 縮不了太多因有下限，長度問題主要來自答錯的超長回應。Dr. GRPO 有更乾淨的圖區分 correct/incorrect output length，證實主要由 incorrect ones 驅動。
- Thinking mode 背後：是**同一個模型**，靠 prompt 裡的小 tag 切換 long-CoT 與近乎 no-CoT，控制點在 prompt 而非 API/serving 層；把兩者放進同一模型才是有趣之處。
- Mid-training 對 RL 的角色：pre-training 與 SFT 做大部分重活，只要 pre-training 覆蓋夠廣（含 code、GitHub），mid-training 很 nice-to-have 但未必 make-or-break；若 pre-training 完全沒 code 就需要 mid-training。若沒 SFT 就會 deep trouble，但反正一定會做些 SFT 把模型帶到能拿到 RL reward 的位置。
- Expert 蒸餾如何運作：需寫下一串 prompt 讓 expert 蒸餾進最終模型；好處是各 team 獨立、聚合可簡單，但 compute 夠時不如直接一個大 training loop。
- Long reasoning 是否屬 mid-training：long-CoT SFT 在 R1 與 Kimi 都有；long CoT 傳統上不算 mid-training，但常用於 long context extension（結合 books、code、synthetic data），是 RLHF 前的額外階段（講者說沒講 long context extension、感到遺憾）。
- 多領域 RL 平行或循序：實務上分成 reasoning problems（stage 2）與 non-reasoning problems（最後 RLHF 階段，含 chattiness）兩桶，避免循序遺忘問題。

### 容易忽略的提醒

- GRPO 好用，但**不是**乾淨的 reward descent；它的兩個修正項是雙面刃，必須知道其副作用。
- 「aha moment」「CoT 越來越長」被廣傳，但講者認為兩者都不特別驚人（前者 base model 已有，後者是 length norm 副作用）。
- 「verifiable」不等於「安全/穩健」——compiler 與檢查器都可能被 adversarially 鑽。
- token 數/思考長度上升不必然等於效能來源；效能可在思考長度不變下持續上升。
- task-specific 高分不必然 generalize 到更廣領域。

## 從零實作語言模型的意義

1. 作業會實作 GRPO（以及 RFT/rejection fine-tuning 當 baseline），並複製類似 R1-Zero 的結果，因此必須把 GRPO 的 z-score advantage、KL 項、stop-grad、以及 online 下 clipping 消失等細節弄清楚。
2. 需理解 PPO 為何被 GRPO 取代（value model 成本、實作敏感、KL 逐 token），才知道 GRPO 的取捨在哪。
3. 需理解 length / std normalization 這兩個「非第一原理」修正項的副作用，才不會誤把「CoT 越來越長」當成好事。
4. 需理解 RL 的資料 curriculum（best-of-K、success-rate filtering、中等難度）與 reward 設計（outcome vs process、answer equivalence checking、anti-reward-hacking）是效能關鍵，而非演算法本身。
5. 需理解 RL infra 的 on-policy/off-policy 取捨與長 rollout 問題，這會直接影響作業與實務的系統選擇。

## 書稿章節草稿

（實際書稿章節見 `docs/cs336-language-modeling/16-post-training-rlvr.md`，此處不重複展開全文，避免筆記與正式書稿重複維護。書稿依既有章節體例分節：導讀、核心內容（分數個子節）、工程取捨、常見誤解、小結。）

## 跨章連結

- **前置：Lecture 15（Post-Training: instruction tuning / RLHF）**：本講直接承接上一講結尾點出的 RLHF overoptimization / annotation bottleneck 困境，並沿用其 policy gradient、DPO、KL regularization、reward model 概念。R1/Qwen 的 pipeline 最後都回到 RLHF 處理 non-verifiable 任務，故兩講需交叉引用。（Lecture 15 的確切標題以該講 worker 產出為準，本筆記不編造。）
- **後續：Lecture 17（alignment，暫定）**：本講的「reward 決定一切、unhackable reward 才能 scale compute」以及 non-verifiable reward、language consistency reward 等，會通往 alignment 議題。確切標題待 Lecture 17 worker 確認。
- **Lecture 13/14（Data）**：本講的 RL 資料 curriculum、SFT long-CoT data 的來源（可能 distill）、agentic mid-training 的 synthetic data，與資料章的 filtering / synthetic data 直接相連。
- **Systems / Inference 章節**：本講 RL infra 段落明確呼應先前 systems 與 inference 講次（training 與 inference 的疊加、權重搬移、batch 中長 rollout 問題）。
- **需回頭補充的術語**：REINFORCE、advantage、baseline、KL divergence、value function、GAE——這些在前面 RL/RLHF 講次應已定義，本章沿用。

## 相關作業與材料

此段只建立關聯，不提供作業解答。

- Course material：Lecture 16 對應的 lecture code / trace 檔名，逐字稿未提及，狀態待補。
- Assignment 關聯：講者多次說「你會在作業裡實作 GRPO、實作 RFT baseline、複製 R1-Zero 式結果、體驗 answer equivalence checking 之難、體驗 on-policy 的穩定」。對應的 assignment 編號與 repo 路徑逐字稿未明說，待材料階段確認（疑為 post-training / RL 相關 assignment，存疑）。
- 本地材料路徑：待補。
- 材料狀態：待補（未讀取任何 code、trace、assignment repo）。
- 缺少的材料或 URL：Lecture 16 投影片/PDF、對應 code/trace、assignment repo 路徑均待補；本講引用的論文（DeepSeek Math、DeepSeek R1、Dr. GRPO、Kimi K1.5、Qwen 3、Qwen 3 Coder Next、branch-train-merge 等）僅依講者口頭描述，原文與確切數據待材料階段或使用者提供。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Lecture 16 是否有投影片/PDF、對應 code/trace 檔名 | 課程官網或使用者提供 | 待補 |
| 對應 assignment 編號與 repo 路徑 | 課程材料 | 待補；逐字稿只說「作業會實作 GRPO」 |
| RL 教科書「the big classic book」是否為 Sutton & Barto（逐字稿轉寫 "Senardo"） | 原始投影片/引用 | 保留存疑，暫記為 Sutton & Barto |
| 「Dr. GRPO」論文正式名稱與作者 | 原論文 | 逐字稿僅稱 "Dr. GRPO"，保留原稱、存疑 |
| Kimi 效能圖中的 benchmark 名稱（"omni math"、"counterfact QA"） | 原論文/投影片 | 保留存疑 |
| DeepSeek V3.x 版本號（講者自己不確定 3.2/3.5） | 原報告 | 標存疑 |
| 各數據（Qwen 4,000 examples、SWE-bench 70.6%、3B active param） | 原論文 | 已記錄講者口頭數字，待核對 |
| DeepSeek Math / R1 / Kimi / Qwen 論文的確切演算法式與超參數 | 原論文 | 待材料階段核對，不外查 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。本階段留空。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-03 | 建立 | 完整閱讀 Lecture 16 逐字稿（第 1-2054 行），產出閱讀筆記與書稿章節 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`16_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_16_Post-Traini.txt`
- 逐字稿總行數：2054
- 新增或修改檔案：`docs/cs336-language-modeling/notes/lecture-16-post-training-rlvr.md`、`docs/cs336-language-modeling/16-post-training-rlvr.md`
- 本講核心概念：見上方「核心概念」15 節
- 需要主控 agent 複查的點：見「資訊不足與待補清單」
- 缺少的材料或需要使用者提供的 URL：見「相關作業與材料」與「資訊不足與待補清單」
- 是否使用外部資料：否。
