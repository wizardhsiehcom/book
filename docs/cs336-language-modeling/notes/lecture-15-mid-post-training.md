# Lecture 15：Mid/Post-Training 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 15, Mid/Post-Training
- 逐字稿檔案：`data/cs336/transcripts/15_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_15_Mid_Post-Tr.txt`
- 完整閱讀範圍：第 1 行到第 2258 行（`wc -l` 計為 2257 行，末行無換行符；內容讀到檔案最後一句 "Thanks. See you all Thursday."）
- 總行數：2257（`wc -l`）
- 完整閱讀日期：2026-07-03
- 閱讀者：章節 worker agent
- 狀態：已完整讀完 → 已抽象 → 已成章
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。所有論文、資料集、公司內部事件（Scale AI 洩漏文件、Google Bard 標註洩漏、Meta 訴訟文件、Zephyr 嘗試等）皆只依逐字稿講者口頭描述整理，未外查原文。ASR 疑似誤轉寫的人名／專有名詞已保留原文並標「存疑」。

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行（"Okay, welcome back. Um, we're going to move away from pre-training now..."）
- 終點：第 2258 行（"...that's one of the reasons why uh what people call RLVR is just so you know been so impactful. Thanks. See you all Thursday."）
- 是否從頭到尾完整閱讀：是，分四批依序 Read 讀完全部內容（1-450、450-900、900-1350、1350-1800、1800-2258），未跳段、未只用搜尋或抽樣。
- 跳過段落：無。

## 本講主問題

這一講要回答的核心問題是：pre-training 只能給我們一個「強但難用」的 base model（頂多是加強版 GPT-3），要怎麼把它變成像 ChatGPT 那樣能穩定 instruction following 的可用系統？答案是 post-training，且本講聚焦其兩階段配方的第一半——SFT（監督式微調）與 RLHF（人類回饋強化學習），把 RLVR／reasoning models 留到下一講。講者反覆強調：post-training 的槓桿幾乎全在「資料」而非演算法，而 frontier 的資料細節多半是 trade secret，因此本講的可靠資訊多來自較舊的公開論文與開源專案。同時本講也交代 mid-training 這個近年才明確化的階段——把高品質／instruction 資料混進 pre-training 尾端的 decay 階段，使 pre-training 與 post-training 的界線變得模糊。

## 核心概念

### 1. Post-training 的定位：從 GPT-3 到 ChatGPT

到目前為止（pre-training 章節）我們能做到的頂多是「加強版 GPT-3」，一個很強的 base model，但實用價值有限——GPT-3 只適合 copywriting 這類不需要可靠性與 instruction following 的小任務。把 GPT-3 變成 ChatGPT 的過程就叫 post-training。本講負責「GPT-3 → ChatGPT」這一段；下一講負責「ChatGPT → o1／thinking models」（即 RLVR）。post-training 的標準配方是兩階段：先收集 demonstration data 做 SFT，再用某種 RL 去 shape 模型行為使其更 aligned。pre-training 仍然是一切的基礎（提供廣泛多樣的能力），單靠 post-training「無中生有」得不到任何想要的東西；post-training 的工作是把想要的行為，從 pre-training 這鍋「原始湯（primordial soup）」裡萃取出來。

### 2. 資訊稀缺與 trade secret

講者一開始就聲明：frontier post-training 的公開資訊非常稀少。他引用的多是 ChatGPT 競爭白熱化之前的舊材料，例如 RLHF 的 "learning to summarize from human feedback"（Stiennon et al，逐字稿轉寫為 "Steenon at all"，存疑）與 Anthropic 2022 年的 HH paper，這些論文的 appendix 含有詳細的 annotation guidelines。競爭白熱化後，各家廠商幾乎不再公開 post-training 流程，資料成為商業機密。他舉 2023 年 Scale AI 內部文件外洩為例：文件顯示他們試圖讓 Google Bard 追上 GPT-4，做法是要 annotator 產出比 GPT-4 更詳細更好的回應——競爭動態使得許多細節從本講中缺席。演算法層面我們大致掌握，但演算法不是 secret sauce，槓桿在資料。開源 recipe 雖然存在，但很多依賴 distillation，本質上與 frontier lab 的人類資料收集很不同。

### 3. SFT 幾乎完全是資料問題

SFT 的方法跟 pre-training 幾乎一模一樣（就是換一批 training data 做 next-token prediction），所以講者幾乎把全部篇幅放在資料上。學生問「input-output 對的正確性有多重要」，講者回答這是個 nuanced 問題：原則上要收集最高品質的回應（壞資料會教壞模型），但實務上 SFT 在各種奇怪資料上都能學會 instruction following——甚至有研究（Percy 的前學生）在幾乎沒有 response 的情況下也能訓練出會 instruction following 的模型。pre-training 的 generalization 讓你可以容忍較差品質的資料。

### 4. SFT 資料的歷史演進（開源世界）

講者依時間序（左上到右下）鋪陳 SFT 資料集的演進：

- **FLAN**（逐字稿轉寫為 "Fla"/"fawn"/"fla"/"font"/"Flawn"，存疑，用來訓練 Google 的 T5）：最早、最有遠見的 multitask post-training 概念——既然要做下游任務，就把所有現成 NLP 監督資料集拿來一起訓練。但 FLAN 其實很怪：它從既有資料集生成，例如把 Enron emails 變成「幫這封 email 寫主旨」的監督任務、把摘要資料集（CNN/Daily Mail 之類）變成「幫這篇文章寫重點」。問題是這些指令在真實使用中幾乎不會出現、摘要很短、甚至常有 hallucination（細節不在輸入裡），且繼承了原始 NLP 資料集的品質缺陷與不自然結構。FLAN 當時假設 post-training 也需要 pre-training 那樣的 scale，所以堆了巨量資料集；後來發現資料集可以小很多仍然有效——只要 base model 夠強，pre-training generalization 就能靠少量高品質範例走很遠。FLAN 站在 quality/quantity trade-off 的「錯誤點」上（但當時無從得知）。
- **self-instruct**：前瞻性地提出「用模型自己生成資料」——模型越來越強，甚至可能比 annotator 還好，那就讓模型寫高品質回應。
- **Alpaca**（講者學生做的）：distill ChatGPT traces 得到 input-output 對，輸入較自然、輸出較長較 chatty。發現這類範例能可靠地在「原始 llama 模型」上誘發 ChatGPT 式行為——證明只要有 chat 式資料，做出 ChatGPT 式系統其實不難（細節仍難）。
- **Vicuna**（逐字稿轉寫為 "Vikunia"，存疑，Berkeley）：用線上使用者分享的 prompt 作為 distillation 的輸入。
- **Open Assistant**：純人力驅動、群眾外包，像 Wikipedia 一樣號召志工寫困難有趣的 prompt 與高品質回應。產出約一萬（或更多）筆範例後專案停滯。背景是 Alpaca 之後有巨大樂觀情緒，認為只要收集夠大夠高品質的 instruction tuning 資料集就能追上閉源大廠。
- **WizardLM / Tulu 3**：用語言模型以越來越複雜的方式生成 instruction following 資料。
- **Agentic SFT**（Nemotron，逐字稿轉寫為 "Neotron"，存疑，Nvidia 的開源努力）：近年重點從 chat 轉向 agent／tool use。SFT 資料現在很大一塊是 agentic 範例——不只有 assistant 回應，還有可平行發生的 tool calls、to-do lists（如 Claude Code、Codex 產生的待辦清單），走向結構化格式。

### 5. SFT 資料的三個高層轉變

- **Chattiness**：從古典 NLP 資料集那種「輸入 → 程式化輸出」，轉向更詳細、更像真人對話的回應（人們想跟人講話，不想跟 NLP benchmark 講話）。
- **更高品質、更專業的 annotator 與更多細節**：Open Assistant 讓專家寫回應是代表。
- **Tool use**：找出正確的 interface 與 API 是最近的一大轉變。

### 6. Style vs Capabilities：長度與風格的陷阱

長度與風格變異是 post-training 的一大重點，且是資料收集者的有意識決策（Claude 與 ChatGPT tone 不同、ChatGPT 被嫌太 chatty，都是刻意設計）。做 preference 評估時，這些風格因素影響巨大：人們很容易偏好有 bullet points、更長更詳細的回應。這會造成陷阱：若看 engagement signals（多數公司都看），很容易自我欺騙以為資料變好了，但其實模型能力沒變。不同 post-training 資料集在 preference benchmark（如 AlpacaEval，逐字稿 "alpaca eval"）上差異很大，但在標準 benchmark 上未必改變——模型不見得因此變聰明。結論：要把 style control 與 capabilities control 分開思考。

### 7. 知識、幻覺與「為什麼需要 RL」

Open Assistant 這種高品質資料常出現「回應中附帶引用（reference: ...）」的例子。在這種資料上做 SFT 會同時教模型兩件事：（a）某個具體引用的知識內容（next-token prediction）；（b）「回答時附上 reference 是好習慣」的格式。問題是模型不知道 reference 真假，若強迫它在不知道的知識上輸出 reference，它會 misgeneralize 而 hallucinate 出假引用。folklore（有實證支持）：在 SFT 階段教模型輸出它不知道的事實會導致幻覺，因為模型同時要 generalize「知識」與「格式」，你等於在教它「強行輸出未知知識」；只在已知事實上訓練則不會。因此**不一定要在最高品質資料上訓練**——若模型還不知道那些資料，tail knowledge 反而有害（尤其伴隨 "reference:" 這種 marker）。John Schulman 的論點：這正是需要 RL 的原因，因為要教模型「知道自己知道什麼」必須是 policy-dependent 的——不能靠外部人硬把知識塞進去。講者給的 folk story：模型內部可能有一個「我知道／我不知道」的 activation 方向，RL 時「在『我知道』方向輸出 reference 得到好 reward、在『我不知道』方向輸出 reference 得到壞 reward」，於是模型學會把這個內部方向一般化到是否輸出 reference。前提是模型內部某處要「知道自己知道什麼」，若完全沒有這種校準資訊，RL 也救不了。

- **Tail knowledge 定義**：學生問，講者說沒有正式定義；他過去用「Wikipedia 文章長度」當作知名度的 proxy——在不知名的東西上訓練會看到更多幻覺，但知識本身無法被精確界定。

### 8. Safety SFT

進入 post-training 就必須面對真實世界的濫用（政治操弄、disinformation、individualized spear phishing）。模型是濫用與使用者之間「最後一道防線」，各公司用 safety controls 讓模型拒答惡意輸入，這責任落在 post-training。Safety SFT 資訊比 capabilities 更稀少——講者引 Llama 2 的描述（已算較詳細的），但連用了幾筆 safety 範例都沒說。所有 safety tuning 都在平衡兩件事：**violation rate**（放過多少壞 query）與 **false refusal rate**（例如問「怎麼 kill 一個 Python process」卻被拒答，使用者會很挫折），要在兩者間取得好的 Pareto（逐字稿 "paro"，存疑）trade-off。規模通常幾千到幾萬筆（Llama 2 約幾千）。Tulu 3 有約五萬筆 safety 範例，策略簡單：先前的 WildChat 專案給人們免費 API/chat 存取、收集其互動，從中挖出 unsafe 行為與 jailbreak 嘗試，再產生「偏好回應」（抵抗 jailbreak／說不）。閉源公司的 model card 顯示類似做法——從使用資訊找出 unsafe 行為，讓 annotator 打地鼠（whack-a-mole）。

### 9. 少量範例即可 steer 模型

若模型夠強，不需要很多範例就能大幅改變行為。以 safety tuning 為例，即使只用 **500 筆**（找／合成一批 unsafe 內容並寫拒答）放進去，follow 惡意指令與 hate speech 的比例就會急遽下降。這是很小的推力卻帶來全面改善——一種解讀是模型 pre-training 後內部已有「安全／不安全」的方向，不需很多範例就能拉出來。但「少量能 steer」不代表「更多沒用」：若你是 OpenAI／Anthropic 要執行非常細緻的安全區分，仍需大規模資料收集。SFT 在最佳狀態下就是「萃取 pre-training 裡已有的行為模式」，此時少量高品質資料就非常有效；加入模型還不知道的（即使正確的）資料反而可能因幻覺而有害；因此常常聚焦品質而非數量。

- **怎麼知道某能力是否在 pre-training 裡？** 學生問，講者坦承這正是他說法的 sloppiness：我們無法確知在不在，但可以知道什麼「不在」——例如非常罕見的程式語言用 SFT 很難教會，就能證明那不在 pre-training 裡；但無法證明 safety 這種東西本身在 pre-training 裡。
- **SFT 破壞特徵 vs RL 提升／壓低特徵？** 學生問，講者說兩者界線很模糊（尤其牽涉 expert iteration 這種「加了鈴鐺的 SFT」，逐字稿 "export iteration"，存疑）；他認為核心區別不在 RL vs SFT，而在回饋型態：SFT 是 dense teacher supervision，RL 是 self-taught policy supervision，且 RL 用的是自己 policy 的輸出，偏離不會太遠。

### 10. Mid-training：把 instruction tuning 併入 pre-training

方法本身「無聊」——就是 gradient descent。但有一個重要的近年趨勢：把 instruction tuning 變成 pre-training 的一部分。過去 pre-training 與 post-training 是分開的兩件事；後來大家發現何必分開，於是把大量高品質資料、甚至 instruction tuning 資料，混進訓練尾端的 **decay 階段**。這能 scale up instruction tuning、也能強調高品質資料，影響相當劇烈，「據我所知大家都在做」。多數 model release report 都能看到有 mid-training 或第二階段 pre-training（用不同的 data mix）。講者的 pet peeve：現在有人說某模型是「base model」其實是謊言——今天的 base model 常已在 ultrachat 之類刻意設計來擅長 chat 的合成資料上訓練過，很難說是傳統意義的 base model。他用 MiniCPM 的兩階段訓練圖為例：前段是標準 pre-training（各種網路資料），後段切換到高品質且很 chatty 的資料（Stack Exchange QA、ultrachat、各種 SFT 資料），並降低一般 pre-training 資料的比例。

- **prompt 是否 mask？** 學生問，講者說 mid-training 是純 pre-training，所以連 prompt 也一起預測；不過差別不大，因為有些 SFT recipe 也會預測 prompt。
- **decay 的資料品質是否較低？** 學生問，講者說直覺是相反：decay 是訓練最重要的部分（最接近部署、learning rate 最低），所以要把最高品質資料放進 decay。

### 11. Data mixture：trial and error

pre-training 與 post-training 的 data mixture 都是高度 trial-and-error。雖然有很多演算法論文，但相當不可靠、脆弱，實務靠大量試錯與直覺。two-phase／mid-training 的好處是 mid-training 比完整 pre-training 短很多，所以每一個 pre-training run 可以配跑約 10 個 mid-training ablation。常見做法：在便宜的 decay 階段跑大量 data ablation 得到資料品質估計，再把結論反饋回第一階段的 pre-training mix。為何不直接讓 pre-training 全用高品質資料？因為 token 不夠——若把 Wikipedia 當整個 pre-train 會用完 token。從 ablation 的下游 delta 到最終 mix 是 case-by-case，有系統性方法（fit models）但常很 brittle：ablate 一個 domain、對影響力排序、再決定放什麼。講者舉一個有趣的洩漏案例：Meta 因用書籍被告，法院文件裡有研究員做 ablation 估計各書籍子集有多有用的紀錄——這正是實務上發生的事。

### 12. RLHF 的概念轉變：從 fit 分布到 maximize reward

SFT 做完後進入第二階段 RLHF。講者強調一個重要的概念差異：pre-training 與 SFT 都是 **generative modeling**（有一堆序列，預測下一個字，fit 一個分布）；RLHF 則不再玩「fit 分布」而是玩「maximize reward」的遊戲——我們要找一個 policy 使某個下游 reward 最大，不在乎有沒有模仿某個分布。關鍵後果：在 RLHF 世界裡，模型對每個輸入可以 collapse 成單一答案（不是分布），只要 reward 好就行。這是後面 mode collapse 討論的伏筆。

### 13. 為什麼要 RL 而非一直 SFT

- **人們「說想要的」與「實際產生的」有落差**：一個舊研究讓 freelance writers 摘要新聞，發現部分 annotator 竟然偏好 Instruct-Davinci（逐字稿 "instructive Vinci"，存疑，ChatGPT 前身）勝過自己寫的摘要——訪談後他們說「看了覺得 AI 其實寫得更好」。人不是最佳系統，判斷（rate）與生成（generate）不同，因此有時想 rate 輸出而非只給 demonstration。
- **某些領域驗證比生成容易**：數學是典型例子（驗證證明比產生證明容易，DeepSeek 走向模型 self-verification）。這是 RL／自我評判的好用場景。

### 14. RLHF 流程與資料

流程：SFT 後的模型 → 對 prompt 用 temperature 1 取樣多個輸出（SFT 後模型夠 diverse）→ rater 排序（pairwise，有時 binary）→ 訓練 reward model → 用標準 RL 最大化 reward model 分數。透過 reward model 是因為訓練 verifier 可能比直接訓練 policy 容易。資料靠 pairwise ratings（標註介面顯示兩個 AI 回應選哪個較好）。InstructGPT appendix 是產業資料收集流程的最後一瞥：要 rater 針對 **helpful、truthful、harmless** 三軸打分（helpful＝寫得清楚、顧及國際性、不過長；truthful＝別 hallucinate；harmless＝拒答可疑 prompt）。另一個公開例子是 Google Bard 洩漏的標註（用 Likert scale，逐字稿 "liyker scale"，存疑，而非 pairwise），結構類似（helpfulness、呈現要好、別含錯誤資訊、要連貫易讀）。

### 15. Annotator 生態

近年 annotator 分布整體向專家、向高成本上移。以 Scale AI 某平台為例：約 70% 是學士或碩士、modal age 約 35 歲、常做 creative/technical writing。過去一兩年出現 bespoke annotators（醫生、律師），因為要把系統部署到真實白領工作，需要專業人士標註與提供 SFT 資料。中位時薪 $50 以上，專家可達每小時 $100 以上。但這是金字塔——低成本可規模化的標註沒有消失，形成高低薪的 bifurcation（Scale 早期大量外包低成本標註並惹上麻煩）。

**取得好資料非常困難**（所以薪水高、資料收集新創多）：現在最難的是取得 verifiable annotators，尤其確保他們沒用 AI（做過問卷／crowdsourcing 的人都知道，防止人用 ChatGPT 極難）；也很難在時間壓力下取得真正正確的回應（Google Bard 的勞資糾紛：annotator 抱怨要在一分鐘內檢查長回應的正確性，根本不可能）。

### 16. Annotator 對模型的影響力與偏差

annotator 對模型行為影響驚人，因為 post-training 是出貨前最後的塑形步驟。講者與 Percy 及一位 postdoc 的早期研究：問語言模型標準民調題，看它們最接近哪些人群。base model 接近 Protestant／Roman Catholic 意見、遠離 Buddhist／Hindu；post-trained 後三個右欄模型變得更遠離 Protestant／Roman Catholic、更接近 Buddhist、Hindu、atheist。對照 InstructGPT paper appendix 的 annotator 人口組成（很多東南亞人、以及美國西岸），恰好吻合。另外近年發現很微妙的偏差可經資料傳遞：**emergent misalignment**／subliminal transfer——用一個被訓練成「我喜歡貓頭鷹」的模型生成看似無害的資料，訓練其上的模型會繼承對貓頭鷹的偏好；這類效應很難察覺。Hosking et al（逐字稿 "hosking at all"，存疑）研究專家 vs 隨機 crowd worker 的標註差異：非專家過度強調 formatting 效果，而 factuality／inconsistency 這類（更難檢驗的）問題則是專家才會抓——annotator 的用心程度與專業會影響模型會犯哪種實質錯誤。

- **怎麼衡量 annotator 品質？** 學生問，講者說沒有黃金標準，給兩種答案：（a）夠詳細的 annotation guideline 可做到半客觀（定義 factuality，甚至給客觀標準如「Google 前三頁找不到矛盾」）；（b）inter-annotator agreement，但它只反映 variance 不反映 bias，且有些任務本質高 variance（「你喜歡嗎」），若大家都用 ChatGPT，variance 也會是零。平台轉向高品質 annotator 主因之一是任務本身需要專家（要律師才能檢查 bluebook 標註），另一原因是 LLM 變強後，不現場監督人們就會用最便宜的 LLM 生成看似合理的答案，於是有些標註商的賣點就是「我們有真人做真事並替你驗證」。

### 17. 模型式標註（model-based annotation）

GPT-4 出來時，講者與學生比較 GPT-4 標註與精心策劃的人類標註：系統排名相近、人—模一致度接近人—人，而成本低一個數量級。經過這些年答案已明朗：**若目標只是追上 frontier 能力，基本上沒有人類收集資料的空間了**。HuggingFace 的 Zephyr（逐字稿 "Zephier"，存疑）刻意想不做 distillation、花大錢找 OpenAI 用的同批 vendor 收人類資料，結果極耗時昂貴且效果不比 model-based 好，最後改用 AI feedback。UltraChat、UltraFeedback（model-generated）與 Tulu 3（全流程 model-based）已是標準。但要推動 frontier 就不能玩這些遊戲，仍高度依賴人類資料收集。非純 distillation 的模型生成路線例子：Anthropic 的 **Constitutional AI**（prompt 模型生成 safety 資料再訓練自己，早期 self post-training loop）與 **self-instruct**（能力導向版本）。但若需要律師／科學家的世界知識，仍得靠人類標註。

- **7B 是否太小？** 學生質疑 Zephyr 用 7B。講者說當時 7B（如 Llama 7B）是很體面的開源模型；他認為即使換更大模型也不太可能突然出現大差異。

### 18. 模型也有偏差：length hacking

模型跟人一樣容易有偏差，有時更嚴重。研究顯示只要把回應長度一直往外推，model-judged 的 win rate 就會持續上升（GPT-3.5 是唯一 outlier，代表它是真的更好而非只在 length hacking）；另有很棒的論文顯示光在 length 上做 RLHF 就能在許多 benchmark 上表現不錯。

### 19. RLHF 演算法：PPO

目標：在 policy 下最大化「從該 policy 取樣所得的 reward」。這是「baby RL」（近似 bandit，不是真正多輪 RL），所以演算法也很簡單。InstructGPT paper 的 equation 2 幾乎就是這個目標：從 RL policy 取樣、最大化 reward，並加上第二項（其實就是對 pre-trained model 的 KL divergence），避免走太遠而 degenerate。Stiennon et al 也一樣，reward 是學到的 pairwise feedback 模型（訓練一個二元分類器判斷 pair 中哪個較好，再 hill-climb）。

PPO（逐字稿全程轉寫為 "PO"，存疑，實為 PPO）的推導脈絡：

1. **policy gradient identity**：對參數取梯度，經 policy gradient trick，等於「取 log-prob 的梯度、以 reward 加權」——看起來就像加權範例的 SFT。
2. **off-policy**：policy gradient 每步都要取樣，而取樣（inference）很貴，所以想 roll out 一次重複使用多步；但不能走太遠，否則局部 reward 估計會爆掉。
3. **TRPO**：取 policy gradient 但用 importance weighting correction 讓自己待在附近（距離約束）。
4. **PPO**：TRPO 的距離約束難處理，改用 heuristic clipping 阻止演算法跑到離原 policy 太遠的地方。細節留待下一講。

### 20. DPO

多年來很多人想「擺脫 PPO」。講者列出一些失敗嘗試（提醒學生別重複）：（a）把 pair 中好的加 "good" token、壞的加 "bad" token，生成時 prefix "good"——把 RL 化約成 SFT，不 work；（b）只在好資料上訓練——不太 work；（c）用 reward model 選出好輸出再訓練（best-of-n 式）——沒那麼好但有點用。最後真正好用、遠比 PPO 簡單、看起來又很像 SFT 的是 **DPO**。

DPO 直覺：在好東西方向取正梯度、在壞東西方向取負梯度（等於「SFT 好的、負 SFT 壞的」），適當加權就會得到不錯的演算法。推導：

1. 目標仍是「期望 reward − β·KL(policy‖reference)」。
2. **強假設**：假設 policy 不是神經網路，而是所有可能 policy 的集合（nonparametric，能逼近任何東西）。此時上層問題有 closed-form 解：最優 policy＝把 reference policy 用 reward 做指數傾斜（exponentially tilt），每個回應以 exp(1/β·r) 加權（reward 好就指數放大、壞就指數縮小）。
3. 由這個最優解**反解出 implied reward**（把 π 移到左邊解出 r）。
4. 把 implied reward 代回原 RLHF 目標，得到 DPO objective：正方向增加「贏」的範例 likelihood、負方向降低「輸」的範例 likelihood，兩項互相平衡。
5. 梯度的直覺：step size 由「implied reward model 錯多少」縮放——若模型已對贏家給高機率就走小步，若模型以為兩者機率相近（錯得多）就走大步。

DPO 擺脫了 reward model 與 on-policy 兩個複雜部分。實務：Llama 的核心 RLHF primitive 就是 DPO，外加一個 outer loop（SFT → DPO → 用 DPO 模型生成候選 → rejection sample → 重複）。變體有 SimPO（逐字稿 "simpio"，存疑，改權重、用 y 長度 normalizer 取代 reference）、length-normalized DPO（用長度正規化以避免 length hacking），但這些變體差異不大。講者強調結果非常取決於實驗設定：AI2 甚至有一篇說「DPO→PPO 更好」、另一篇（Tulu 2）說「DPO 比 PPO 好」——執行方式決定誰勝。takeaway：這些 DPO 變體都「夠接近正確」，只要 step size 設對，「往好方向走、往壞方向反著走」的核心想法就相當有效。DPO 是否勝過 PPO，除非在 frontier 訓最強模型，否則可能沒那麼重要。

### 21. RLHF 的陷阱

- **Over-optimization**：這是最大問題之一。InstructGPT 出來時大家問「能不能靠 RLHF 一路收集 thumbs up/down 到超智慧」，答案是很難——太用力推 RLHF 會 overfit 到學到的 reward model。前述 KL regularizer 在很多情況下是防止 over-optimization 的關鍵（尤其當你的最佳化過程很強時）。
- **Model collapse / mode collapse**：RL 模型常 diversity 大減、集中在少數輸出。呼應第 12 點——RLHF 模型不再 model 一個（自帶多樣性的）分布，而是一個只要 reward 好就能 collapse 的 policy。
- **Calibration**：GPT-4 era OpenAI 少數公開的圖之一，承認 RLHF 後模型 uncalibrated 是尚未解決的 open problem；Anthropic 也論證 RLHF 後天然 uncalibrated，可有時 recalibrate 但非總是。這在下一講（RLVR）很重要，因為 entropy 與 exploration 對模型探索所有可能解、在難題上取得進展至關重要。

### 22. 收束與下一講銜接

總結：RLHF 資料收集也很難（post-training 的複雜、messy 很大程度來自「取得好資料一向困難」）；RLHF 演算法相當複雜，PPO 尤其困難（下一講細談），所幸有更簡單的變體 **GRPO** 效果不錯（將用於 assignment）。RLHF 最大問題是 over-optimization，通往下一講的橋樑就是：有沒有一種 reward 讓我們不會 over-optimize、可以一直灌 compute 而模型表現單調變好？這正是 **RLVR** 之所以如此有影響力的原因。

## 重要細節

### 定義

- Post-training：把 base model（pre-training 產物）轉成可用助手的過程，含 SFT 與 RLHF（RLVR 屬下一講）。
- Mid-training：把高品質／instruction／chat 資料混進 pre-training 尾端 decay 階段的第二階段訓練，使 pre-training 與 post-training 界線模糊。
- SFT（Supervised Fine-Tuning）：用 demonstration data 做 next-token prediction，方法同 pre-training，差別只在資料。
- RLHF（RL from Human Feedback）：用 rater／reward model 對輸出評分，upweight/downweight 模型輸出以最大化 reward。
- Violation rate / False refusal rate：safety tuning 要平衡的兩個指標（放過壞 query vs 誤拒正常 query）。
- Tail knowledge：無正式定義；以「知名度低」的知識為概念，講者用 Wikipedia 文章長度當 proxy。
- Reward model：對 pairwise 偏好訓練的二元分類器/評分器，作為 RL 的 reward。
- Emergent misalignment / subliminal transfer：看似無害的資料把生成模型的隱含偏好傳遞給下游模型。
- DPO（Direct Preference Optimization）：擺脫 reward model 與 on-policy，直接對偏好對做「增加贏家、降低輸家 log-prob」的梯度更新。

### 公式／量化描述

- RLHF 目標（InstructGPT eq. 2）：max over policy 的期望 reward − 對 reference（pre-trained）model 的 KL divergence。
- DPO closed-form 最優 policy：reference policy 以 exp(1/β·r) 指數傾斜。
- Safety tuning 規模：Llama 2 約幾千筆；一般幾千到幾萬；Tulu 3 約 5 萬筆 safety 範例；500 筆即可顯著降低惡意指令遵從率。
- Open Assistant 產出：約一萬（或更多）筆範例後停滯。
- Annotator：Scale AI 某平台約 70% 學士/碩士、modal age 約 35；中位時薪 $50+，專家 $100+/hr。
- RLHF 取樣：temperature 1 取多個輸出。
- Zephyr 模型規模：7B。

### 演算法／流程

- SFT 資料演進：FLAN（multitask，既有資料集）→ self-instruct（模型生成）→ Alpaca/Vicuna（distill ChatGPT/user prompts）→ Open Assistant（人力眾包）→ WizardLM/Tulu 3（複雜合成）→ Agentic SFT（tool call/結構化）。
- Mid-training data mix：decay 階段跑大量便宜 ablation → 估計資料品質 → 反饋回 pre-training mix。
- RLHF pipeline：SFT 模型 → temp 1 取多個輸出 → rater pairwise 排序 → 訓 reward model → 標準 RL 最大化 reward。
- PPO 推導脈絡：policy gradient → off-policy（重用 rollout）→ TRPO（importance weighting，留在附近）→ PPO（clipping heuristic）。
- DPO 推導：目標(reward−βKL) → 假設 nonparametric policy → closed-form 指數傾斜解 → 反解 implied reward → 代回目標得 DPO loss → 梯度增加贏家、降低輸家，step size 依 implied reward 誤差縮放。

### 工程限制

- Frontier post-training 資料是 trade secret，公開資訊稀少，可靠來源多為 ChatGPT 競爭前的舊論文與開源專案。
- SFT 在模型未知的知識上訓練會誘發幻覺（格式與知識同時 generalize 的副作用）。
- 品質不等於有益：tail knowledge 可能有害。
- data mixture 高度 trial-and-error，演算法 brittle。
- 若目標只是追上 frontier，人類資料幾乎無立足空間；推動 frontier 仍需人類資料。
- Verifiable annotator（確保沒用 AI）與時間壓力下的正確性是資料收集的核心難題。
- RLHF over-optimization、mode collapse、post-RLHF uncalibration 皆為未完全解決的問題。

### 講者例子

- GPT-3 vs ChatGPT：回頭用 GPT-3 會覺得「這是什麼東西」。
- Scale AI 2023 洩漏文件：想讓 Bard 追上 GPT-4，要 annotator 產出比 GPT-4 更好的回應。
- FLAN 的怪任務：把 Enron email 變「寫主旨」、摘要資料集變「寫重點」。
- "How do I kill a Python process?" 被誤拒 → false refusal 例子。
- WildChat：免費 chat 存取換取互動資料，挖 jailbreak。
- freelance writers 偏好 Instruct-Davinci 勝過自己寫的摘要。
- 民調題實驗：base model 近 Protestant/Catholic，post-trained 近 Buddhist/Hindu/atheist，對應 InstructGPT annotator 人口。
- 貓頭鷹偏好的 subliminal transfer（emergent misalignment）。
- Meta 訴訟法院文件洩漏書籍子集 ablation。
- Zephyr（HuggingFace）：砸錢收人類資料，最後改用 AI feedback。
- Llama：核心 RLHF primitive 是 DPO + outer loop（SFT→DPO→rejection sample→重複）。

### 問答重點

- input-output 正確性多重要：nuanced，原則收最高品質，但 pre-training generalization 讓你能容忍較差資料，甚至有近乎無 response 也能訓 instruction following 的研究。
- 怎麼知道某能力在不在 pre-training：無法確知在不在，但能證明「不在」（如罕見程式語言）。
- SFT 破壞特徵 vs RL：界線模糊；差別在回饋型態（dense teacher vs self-taught policy）。
- decay 資料品質是否較低：相反，decay 放最高品質（最接近部署、lr 最低）。
- prompt 是否 mask（mid-training）：不 mask，純 pre-training，連 prompt 也預測。
- data mixture 如何從 ablation delta 推到 mix：case-by-case、trial-and-error、系統法 brittle。
- annotator 品質如何衡量：guideline 半客觀 + inter-annotator agreement（只反映 variance）。
- 為何轉向專家 annotator：多因任務需要專家，且防止人用便宜 LLM。
- domain-specific 模型當 annotator：model-based 標註很好（追趕 frontier），但 domain-specific 未必勝過最強開源模型，無獨特優勢。
- Zephyr 用 7B 是否太小：當時 7B 很體面，換大模型也不太可能有大差異。

### 容易忽略的提醒

- 「base model」一詞已不精確——今天的 base model 常已含 mid-training 的 chat/合成資料。
- engagement signal 改善 ≠ 能力改善；style control 要與 capability control 分開。
- 少量範例能 steer ≠ 更多範例沒用（frontier 細緻區分仍需大規模資料）。
- RLHF 是「maximize reward」而非「fit distribution」，這是 mode collapse 的根源。

## 從零實作語言模型的意義

- 需要實作什麼：SFT（就是換資料的 next-token prediction）、RLHF 的 PPO（assignment 用更簡單的 GRPO）、以及 DPO 這種「正梯度好、負梯度壞」的偏好最佳化。
- 需要理解什麼取捨：quality vs quantity（強 base model 只需少量高品質範例）、style vs capability、在未知知識上 SFT 會誘發幻覺、safety 的 violation/false-refusal Pareto、data mixture 的 trial-and-error、over-optimization 與 KL regularization。
- 會影響哪些後續章節：直接銜接 Lecture 16 的 RLVR（本講的 RLHF over-optimization 問題正是 RLVR 的動機，PPO 細節與 GRPO 留待下一講）。

## 書稿章節草稿

（實際書稿見 `docs/cs336-language-modeling/15-mid-post-training.md`，依 chapter-template 分節：導讀、核心內容（數個子節）、工程取捨、常見誤解、小結。此處不重複展開全文。）

## 跨章連結

- 前置章節：Lecture 13/14（Data）——本講的 SFT／mid-training 資料是 pre-training 資料 pipeline 的延伸；mid-training 把高品質資料放進 decay 階段，直接沿用 Lecture 13/14 對品質過濾、synthetic data、data mixture 的討論（Nemotron、ultrachat 等在兩講都出現）。Lecture 13 已介紹 pre-training→mid-training→post-training 的三階段趨勢（「從大量低品質走向少量高品質」）與 base/instruct model 用語模糊化，本講把 mid/post 這兩段展開。
- 後續章節：Lecture 16（RLVR／reasoning models）——本講明確預告下一講從 ChatGPT 走到 o1/thinking models，會細講 PPO、介紹 GRPO，並以「找不會 over-optimize 的 reward」作為 RLVR 的動機。本講的 RLHF、reward model、KL regularizer、mode collapse、calibration 都是下一講的前置。
- 需要回頭補充的術語：SFT、RLHF、reward model、KL divergence、policy gradient、PPO、DPO、mid-training、decay 階段、over-optimization、mode collapse。與 Lecture 9/11 的 scaling laws、Lecture 12 evaluation（AlpacaEval 式 preference vs 標準 benchmark）有呼應。
- 需要新增的圖表：post-training 兩階段流程圖（SFT→RLHF）、pre/mid/post-training 定位圖、RLHF pipeline 圖、PPO 推導脈絡圖（可選）。

## 相關作業與材料

此段只建立關聯，不提供作業解答。若材料尚未下載或資訊不足，必須保留 `待補`，不可自行腦補。

- Course material：`待補`（逐字稿未指明本講對應的 lecture code 檔名；Lecture 15 是否有 `lecture_15.py`／trace 待主控與材料計畫確認）。
- Assignment 關聯：逐字稿多次提到「the assignment」會用到 PPO/GRPO（"you'll have to understand it for the assignment"、"That's what you'll do in your assignments"），推測對應 post-training/alignment 作業（Assignment 5 之類），但逐字稿未給編號與路徑，`待補`。
- 本地材料路徑：`待補`。
- 材料狀態：待補 / 待下載。
- 缺少的材料或 URL：本講引用的所有論文與資料集（FLAN、self-instruct、Alpaca、Vicuna、Open Assistant、WizardLM、Tulu 3、Nemotron、Llama 2/3、InstructGPT、Stiennon et al "learning to summarize"、Anthropic HH、Constitutional AI、Zephyr、UltraChat/UltraFeedback、MiniCPM、WildChat、Hosking et al、SimPO、emergent misalignment、DeepSeek）僅依講者口頭描述整理，原始論文與確切數據待材料階段或使用者提供連結核對。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 本講對應 lecture code / trace 檔名與路徑 | 課程材料清單 | `待補`，逐字稿未提及 |
| 對應 assignment 編號與路徑（PPO/GRPO/DPO） | 課程 assignment 清單 | `待補`，逐字稿只說 "the assignment" |
| FLAN 拼寫（逐字稿 "Fla/fawn/fla/font/Flawn"） | 原始論文 | 判定為 FLAN，標存疑，保留原轉寫 |
| Stiennon et al（逐字稿 "Steenon at all"，"learning to summarize from human feedback"） | 原始論文 | 標存疑 |
| Vicuna（"Vikunia"）、Nemotron（"Neotron"）、Zephyr（"Zephier"）、SimPO（"simpio"）、Hosking et al（"hosking at all"）、Instruct-Davinci（"instructive Vinci"）、Likert（"liyker"）、Pareto（"paro"）、PPO（"PO"）、expert iteration（"export iteration"） | 原始論文/常識校正 | 均為 ASR 疑似誤轉，已於正文標存疑並保留原文 |
| Open Assistant 範例數（「一萬或更多」） | 原始資料集 | 逐字稿講者本人不確定，`待補` |
| Tulu 3 safety 範例數（「約 5 萬」）、Llama 2 safety（「約幾千」） | 原始論文 | 依講者口頭，未核對，`待補` |
| 民調題實驗、emergent misalignment（貓頭鷹）、Hosking 專家 vs 非專家等研究的正式引用 | 原始論文 | 依講者口頭描述，`待補` |
| MiniCPM 兩階段訓練圖、InstructGPT/Bard 標註介面、over-optimization/calibration 圖 | 課程 slides | `待補`，本講依口頭描述，未見 slides |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。本階段未進行外部搜尋。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-03 | 建立 | 完整閱讀 Lecture 15 逐字稿（第 1-2258 行，`wc -l` 2257），產出閱讀筆記與書稿章節 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`15_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_15_Mid_Post-Tr.txt`
- 逐字稿總行數：2257（`wc -l`；內容讀到第 2258 顯示行 "Thanks. See you all Thursday."）
- 新增或修改檔案：`docs/cs336-language-modeling/notes/lecture-15-mid-post-training.md`、`docs/cs336-language-modeling/15-mid-post-training.md`
- 本講核心概念：見上方「核心概念」22 條
- 需要主控 agent 複查的點：見「資訊不足與待補清單」；特別是 lecture code/assignment 路徑、以及多個 ASR 存疑專有名詞
- 缺少的材料或需要使用者提供的 URL：見「相關作業與材料」與「資訊不足與待補清單」
- 是否使用外部資料：否。
</content>
</invoke>
