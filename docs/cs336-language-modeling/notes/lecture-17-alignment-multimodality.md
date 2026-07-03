# Lecture 17：Alignment and Multimodality 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 17, Alignment and Multimodality
- 逐字稿檔案：`data/cs336/transcripts/17_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_17_Alignment_-.txt`
- 完整閱讀範圍：第 1 行到第 1614 行（`wc -l` 回報 1613，因最後一行無換行符，內容讀到最後一句 "...play around with um you know training some of these models."）
- 總行數：約 1613–1614
- 完整閱讀日期：2026-07-03
- 狀態：已完整讀完 → 已抽象 → 已成章
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。所有模型（CLIP、SigLIP、LLaVA、Qwen-VL、Chameleon 等）細節、數字、論文名稱皆只依講者口頭描述整理，未核對原始論文。ASR 疑似誤轉寫的專有名詞已保留原文並標「存疑」。

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行（"So um originally the plan was to talk more about reinforcement learning..."）
- 終點：第 1614 行（"...I encourage you to play around with um you know training some of these models."）
- 是否從頭到尾完整閱讀：是，分四批依序讀完全部內容（1–450、450–900、900–1350、1350–1614），未跳段、未只用搜尋或抽樣。
- 跳過段落：無。

## 關於「Alignment」與本講標題的重要說明

本講在課程排程上的標題是「Alignment and Multimodality」，但**講者一開場即說明：原本計畫要多談 reinforcement learning，但因為只剩一堂課，若不談 multimodality 這門課會不完整，因此整堂課實際上幾乎全部在講 multimodality**。逐字稿中**沒有**出現 RLHF、DPO、偏好對齊、instruction alignment 等一般意義下的「alignment（對齊/對齊人類偏好）」內容。

本講出現的「alignment」一詞只有兩個技術脈絡，都屬於 multimodality：

1. **CLIP 的對比式對齊（contrastive alignment）**：讓成對的影像與文字 embedding 對齊（dot product 大），非成對的分開。
2. **VLM 的 alignment phase**：訓練 projector（矩陣 W / MLP），把 vision encoder 輸出的向量對齊到語言模型的 token embedding 空間。

因此本筆記與書稿的「alignment」皆指上述**多模態內部的表示對齊**，而非 post-training 的偏好對齊。此落差已列入「資訊不足與待補清單」，供主控 agent 判斷是否需在第 6 階段補充 RL/alignment 內容或調整章節定位。

## 本講主問題

如何讓原本只吃文字 token 的 transformer 處理其他模態（影像、影片、音訊）？講者把問題拆成兩個子問題：(1) 如何把非文字資料**輸入**進 transformer；(2) 如何**生成**非文字資料。本講幾乎只處理第 (1) 個問題（輸入側，且主要聚焦影像）。核心答案是：所有東西都必須被轉成 transformer 能吃的「token」（離散 token 或連續 embedding），而 token 應代表一個語意單位。整堂課沿一條歷史線索展開：從 CLIP／SigLIP 這類影像編碼器，到 LLaVA／Qwen-VL 這類把影像 embedding 注入語言模型的 VLM，再到 Chameleon 這種把影像也離散化、用單一語言模型統一處理的路線，最後反思 frontier omni-model 可能的樣貌。

## 核心概念

### 1. Omni-model 的北極星與「一切皆 token」

理想的 omni-model 能接受任意模態組合輸入、輸出任意模態組合（例如給一張圖加一段影片，問關於兩者的問題並生成影像）。本講不會建出完整 omni-model，只教如何**輸入影像**。關鍵前提：transformer 在所有模態上都仍是規模化下最好的架構，但它是為文字設計的、只會說 token。這裡把 token 的概念擴張為不只離散 token，也包含連續 token（可視為 token 的 embedding）。重點是 token 要代表一個語意單位——subword 有語意，單一 pixel 沒有，所以必須想辦法把影像/音訊轉成離散或連續 token。文字本身其實也早就做過這件事（BPE tokenizer），只是對非文字模態要重新思考「BPE 的等價物」是什麼。

### 2. CLIP（2021）：對比式語言—影像預訓練

歷史脈絡：當時語言模型已進入 foundation model 時代（GPT-2、GPT-3），視覺仍主要靠大型標註資料集（ImageNet）訓練 ResNet 加資料增強。OpenAI 想問：能不能像語言那樣利用網路上大量、雜亂的 image–caption 對？

CLIP 的做法：給一批 image–text 對（例如 32,000 對）。用 image encoder 把每張圖編成向量 I1..In，用 text encoder 把對應文字編成 t1..tn。目標是讓對齊的 (Ii, ti) 的 dot product 遠大於 Ii 與其他所有文字的 dot product，反之亦然。這相當於 2N 個 softmax 分類問題（每列、每行各一次 cross-entropy），程式上就是把 image/text embedding 正規化、乘上 temperature、算 cross-entropy。等於是一個把樣本排成 N×N 矩陣的多類別分類。

資料：論文對資料著墨不多，大致是拿一堆 query 上網搜尋、挖出 image–text 對，最終 400M 對；資料集未釋出。OpenCLIP 是開源復現，用 LAION-5B（存疑：逐字稿轉寫為 "lion 5B"，50 億 image–text 對）；有趣的是他們用 CLIP 本身做資料過濾再訓練 OpenCLIP（bootstrapping），但至少資料集與程式碼可指認。

影像前處理：網路影像尺寸任意，神經網路不喜歡動態尺寸，所以把短邊 resize 到 336（或 224）再 center crop 成正方形。這是為了方便，且當時作者腦中想的是 ImageNet 分類（物體多在中間，裁掉背景無妨）。後面會看到更好的做法。

Vision encoder：試過 ResNet 與剛問世的 ViT，發現 ViT 最好，所以講 CLIP 通常指 ViT 版本。ViT 把影像切成 patch（原論文 16×16，CLIP 用 14×14），每個 patch 是一個 token，加上 positional embedding，過標準 transformer。CLIP 不用單純平均所有輸出向量，而用 **attention pooling**（拿全域平均當 query，再對各位置的 key/value 做一輪 attention）得到更有資訊的單一向量。最佳模型是 **ViT-L/14**（large ViT，約 24 層存疑，14×14 patch，RGB 三通道，336×336 解析度；先低解析度訓、後段才拉高解析度以省算力）。位置編碼他們試過 2D 版但發現對分類差別不大（存疑：對分類可能不重要，後面會有更講究空間結構的位置編碼）。

Text encoder：標準 GPT-2 風格 transformer（同一組人做的 GPT-2）。為了從序列取單一向量，前後加 BOS/EOS，取最高層 EOS 位置的 activation 當整個序列的表示。

Headline 結果：ImageNet 上 **zero-shot CLIP 勝過在 120 萬張標註 ImageNet 影像上訓練的 ResNet**。1.2M 標註耗費大量 Amazon Mechanical Turk 人力；CLIP 則用更「有機」的網路資料。Zero-shot 做法：拿一張圖，對各種文字標籤算 dot product，取最高者。

其他重點：caption 極度 noisy（caption 不必逐字描述圖中內容，例如狗的圖不會寫「一隻狗」），需要大量資料過濾才能運作。CLIP 也試過另一種目標——從影像**預測** caption 文字（bag of words 或 language model），結果較強的生成式模型反而表現更差或更沒效率（以 ImageNet 分類準確率衡量）。這暗示：要學到影像的粗略表示，精確建模 caption 的 token 序列並不重要。（此點最後會呼應。）

CLIP 的技術缺點：需要很大的 batch（例如 30,000；batch 1 或 10 完全不行），且 softmax 對整個 batch 運算，不易分解（不像語言模型每條序列可平行、最後再聚合）。

### 3. SigLIP（存疑：逐字稿轉寫為 "cichlip"/"cig"）：sigmoid loss 改進版

Google 的改進版，全名 sigmoid loss for language image pre-training。核心差異：CLIP 是多類別分類（一個對齊對 vs. 其他所有影像/文字）；SigLIP 把它簡化成**二元分類**——對任一 image–text 對，問「對齊或不對齊」。在 N×N 矩陣中，對角線是正例、off-diagonal 是負例，用 log-sigmoid loss。演算法：embedding 正規化、算 dot product、對角線標 1、off-diagonal 標 -1、做 log sigmoid。

問答補充：初版沒有用複雜的負例採樣策略，就直接用同一個矩陣（一般 contrastive 方法有時需平衡正負例或用 hard negative，但初版沒有）。

資料：用 Google 的 WebLI（存疑：轉寫 "web li"，約十億 image–text 對，來自 2022 年前後另一篇 image-language 論文）；對圖中含文字者做 OCR 形成額外 image–text 對；多語言。

主要賣點是**訓練效率**：CLIP 用 256 顆 TPU v3 訓 10 天，SigLIP 用 32 顆 v4 訓 5 天。（講者澄清 v4 在 flops/秒上其實不比 v3 快、甚至慢約 60%，優勢在能塞進更多顆進一個 pod、互連更好。）平行化方式類似系統課的 DDP：每個 device 存一部分 image–text 對，先各自算本地損失，再把 text embedding 沿環狀輪轉（device 1 拿 T5–T8、再拿 T9–T12…）直到覆蓋所有 off-diagonal 區塊。

另一好處：**batch size 與 loss 解耦**。CLIP 的 loss 綁死 batch size（改 batch 就是不同 loss function）；SigLIP 可用更小 batch（<16k），期望值相同、只是變異較大。往上加大 batch 幫助不大，critical batch size 約 32k。

### 4. VLM 通用模板：把影像 embedding 注入語言模型（LLaVA 與 Qwen 兩大家族）

有了 CLIP／SigLIP（把固定尺寸影像 336×336 映成帶語意的向量），就能開始建 VLM。基本想法：拿現成 image encoder、現成 LLM，把影像 embedding **投影**後注入語言模型——這偏 mid-training／post-training 的味道（縫合現成元件，而非從零訓練）。

**LLaVA（2023）**：clip 當 vision encoder；text decoder 用 Vicuna（存疑：轉寫 "Vunia"，第一代 llama 在 ShareGPT 對話上微調的版本）；projector 是矩陣 W，把影像向量映到與文字 embedding 相同空間。文字用標準 embedding。整串向量（文字+影像）過標準 transformer 輸出。等於把影像轉成「文字 token」，藉此利用預訓練語言模型。

- 資料：基於 MS-COCO（存疑：轉寫 "MS Coco"，人工標註了 bounding box 與 caption）合成。用 caption/偵測到的物件去 prompt GPT-4，生成三類：對話（QA）、詳細描述、複雜推理，共 **158,000** 例。
- 訓練兩階段：**stage 1（alignment phase）** 凍結 vision encoder 與語言模型，只訓 W，讓影像向量看起來像自然語言 token embedding；**stage 2** 仍凍結 vision encoder，訓 W + 語言模型。整體是 image+text → text。
- 例子：問「這張圖不尋常之處？」模型答「通常不會在小廂型車後面燙衣服」，且即使 prompt 沒強調「不尋常」也能講到重點。

**LLaVA-OneVision（存疑：轉寫 "Lava 1 vision"，2024）**：同一配方升級（中間經歷 LLaVA-1.5、LLaVA-Next）。vision encoder 升級成 SigLIP；text decoder 用 Qwen2；projector 從線性換成兩層 MLP。能處理單圖、多圖、影片（影片 = 取樣若干 frame 的影像序列）。

- **AnyRes（源自 LLaVA-1.5）**：vision encoder 只能吃 336×336，做 OCR 需保留細節（否則 J 看起來像 I）。做法是把高解析度影像切成多個 336×336 tile，各自編碼再把向量串接；另有一路是整張圖 downsample 的全域編碼。解析度太高就 subsample/內插控制 token 數。這種 adaptive 特性呼應 transformer 本就能處理任意長度序列——影像也可任意解析度。
- 模態加權（刻意「把拇指壓在秤上」讓各模態大致可比）：單圖給較多 tile（最多 9 個 crop）；多圖用 base 解析度；影片每 frame 用更少 token（最多 32 frame，否則撞 context length）。
- 資料哲學：高品質、targeted、task-based（VQA、表格問答等），屬 post-training territory；毫不掩飾地大量 **蒸餾 GPT-4**（沒標註預算時的做法）。
- **跨模態遷移**：訓練時只有單圖 OCR 資料、只有多圖 relational reasoning 資料，測試時卻能處理「一張表格+一張圖表」的多圖問答；visual prompting（圈出圖中某處）只在單圖訓練，卻能遷移到影片（描述影片中被標記的球員）。有足夠多任務時，這些模型會出現遷移。
- 訓練三階段（stage 1 只訓 projector/adapter；stage 2 高品質、偏知識；stage 3 偏下游任務樣態）。LLaVA 系列少數同時開源模型權重**與資料**，可複現研究。

**QwenVL（存疑：轉寫 "Quen"，2023）**：vision encoder 用 OpenCLIP；adapter 用一層 cross attention、加 2D positional embedding，映到固定 256 個 token（此時仍不 dynamic）；有特殊 token（image tag、box tag、ref tag）。三階段：stage 1（號稱 pre-training，但非從零）用大規模低品質資料，**凍結語言模型、訓 vision encoder + adapter**（與 LLaVA 凍結 vision encoder 相反），約 1.4B 例；stage 2 高品質 task-specific（VQA、chart QA），訓全部參數；stage 3 instruction tuning，凍結 vision encoder、訓 adapter + 語言模型。能輸出 bounding box（不生成影像，只輸出座標）、OCR，也想讓視覺模型繼承語言模型能力（如寫 code）。

**Qwen2-VL**：更大 vision encoder；開始做 **dynamic resolution**（大圖可能對到 11,000 token，小小的公式圖只對到 8 token）。做法沿用 AnyRes：每個 224×224 patch 用 ViT（起點是 OpenCLIP ViT，會再 fine-tune）編碼，為壓 context 把每 2×2 壓成 1（每 patch 最終約 66 token 存疑）；影片每秒取 2 frame、上限 16,000 token。位置編碼改用 **M-RoPE（multimodal RoPE）**：RoPE 讓 inner product 只依 token 距離，1D 距離就是相隔 token 數；多維版把位置變成 (height, width, time) 三元組，各維各算 RoPE 再串接。

**Qwen3-VL（去年 Qwen3-VL report）**：非結構性大改，但影響品質。變更點：(1) 用 Qwen3 語言模型（dense 與 MoE 系列，很強）；(2) 投入長 context，最長 **256K**（做長影片關鍵）；(3) vision encoder 用 SigLIP2（存疑：轉寫 "cichlip 2"，架構與 SigLIP 相同、向後相容）；(4) **改良 M-RoPE**：原本 time/width/height 各佔一整塊維度，而 RoPE 各分量代表不同頻率，會導致時間全落在低頻、高度全落在高頻，於是**交錯（interleave）**讓每軸都涵蓋高低頻；(5) **顯式影片 timestamp**：原本時間隱含在位置編碼裡，現在把「0 秒」等做成真正的 token，可直接指涉「兩秒後發生什麼」；(6) **平方根正規化 per-token loss**：長影片 token 多會主導，按每例長度的平方根 downweight 長例（細節不清）；(7) **DeepStack adapter**（存疑：講者說是 deepseek team 的論文）：vision encoder 本就算出一疊 vision embedding，直接把它們加進語言模型的 residual stream，屬 vision 與 LM 的 deep fusion（相對於把 vision encoder 當只輸出向量序列的黑盒）。訓練：pre-training 四階段（先訓 adapter，再逐步拉長序列 8k→32k→256k，多數 token 在 stage 2、3）；post-training 三階段（長 CoT SFT、知識蒸餾、RL）。此時已很像 systems paper。在 benchmark 上對比閉源 Gemini／GPT-5／Opus 4.1，Qwen 表現相當強。

### 5. Vision encoder 為何遠小於語言模型

問答重點：vision encoder 參數量遠小於語言模型（LLaVA 例子：語言模型 72B，projector 約 72M，ViT 通常 <1B）。原因是 vision encoder 做的是很**局部**的操作——只看一個很小的 patch、理解 patch，不做推理、幾乎沒有知識；模型的能力大多仍在語言模型裡。

### 6. 這些 VLM 只生成文字；輸入側才是多模態

問答重點：這些模型不生成影片或影像，所有多模態都在**輸入側**，輸出永遠是文字。除了 RL 階段，大部分階段是**監督每一個 token**（沒有 LM-as-judge），生成什麼取決於資料集；RL 才能玩不同 reward。系統面問答：多模態訓練在系統上並不比純語言模型容易（資料集更大、影片光載入就昂貴，需注意 data loading 與計算 async；影片 token 多，才需要前述正規化來避免影片主導；但文字 token 本就很多，多模態 token 未必遠多於文字 token，模型仍訓練在數十兆 token 上）。對齊時語言模型必須已預訓練（否則對齊無意義），對齊就是凍結語言模型、只訓 adapter，並選定 token budget（約 67B token）直接訓，沒有 adaptive threshold。

### 7. Chameleon（Meta 2024）：把一切離散化、單一語言模型統一處理

前述 VLM 把影像編成向量注入語言模型，因此只能生成文字。Chameleon 走另一條路：把**所有東西都映成離散 token**，這樣影像的分析與生成就能用同一套方式（都是離散 token），可交錯（interleaved）生成文字與影像（例如「我很無聊，給我看些鳥」→ 文字+影像+文字+影像）。這體現 omni-model 的願景：文字與影像真的活在同一空間，做法是讓一切看起來都像文字。

技術：用 **VQ-VAE（vector quantized variational autoencoder，約 2017 的舊想法）** 把影像映成離散 code——encoder 先映到連續向量，再 round 到 codebook 中最近的 code（例如 8,000 個 code，是原型向量）；decoder 從 code 重建影像；用重建損失訓練（因不可微分還要加其他項，講者略過）。結果：512×512 影像轉成 **1,024 個 token**，每 token 來自 8,000 詞彙表。之後訓練新 tokenizer，訓練就是**普通語言模型訓練**（無 adapter、無 vision encoder，就是一個語言模型），兩階段（stage 1 大規模非監督含文字與影像，stage 2 混入高品質資料）。

問題：(1) **訓練不穩定**——文字與影像雖佔同一空間但行為差很多；文字 token 熵較低（多數字可預測），影像 token 熵很高（不知道是哪個藍色），混合訓練導致參數 norm 成長、loss 不穩，靠 **QK-norm 與 Z-loss 正則化**部分緩解；(2) **離散化損失資訊**（小字 OCR 離散化後讀不出來），模型較不 performant；(3) 多模態一起訓本就 tricky（Qwen 也遇到、要調權重，這裡更嚴重）。VQ-VAE 一度流行於影像生成（因為 transformer 只能生成離散東西），但 **diffusion model** 問世後這條路線就沒那麼流行了。

### 8. 收尾反思：omni-model 的可能樣貌

Frontier 模型現在被期待是多模態、甚至 natively multimodal／omni-model（Gemini、GPT 發表時都強調，且確實做到），但沒有公開細節。講者推測（明說是 speculation）大概是**連續 encoder（避免資訊損失）+ diffusion 生成**的組合。根本挑戰是如何處理非文字模態；理解模態與生成模態間存在對稱性，但**沒有單一通用 encoder**：CLIP 為分類只需捕捉高層語意，向量可以小；OCR 或影像生成則需要非常細的細節（diffusion 之所以好，是能微優化高頻資訊）。要小心對各模態適當加權（影片資訊密度低於文字，別讓影片壓過文字）。至少目前最佳仍是連續 encoder——CLIP 雖已五年，類似想法仍是捕捉影像語意的首選；transformer 仍在；diffusion（本講未細講）擅長生成。無對應作業，但鼓勵學生自己玩玩訓練這些模型。

## 重要細節

### 定義

- Omni-model：能接受並輸出任意模態組合的模型（本講的北極星）。
- Token（擴張定義）：transformer 的輸入單位，可離散或連續（連續即 embedding），應代表一個語意單位。
- CLIP：contrastive language image pre-training，用對比損失對齊 image/text embedding。
- SigLIP（存疑：轉寫 "cichlip"）：sigmoid loss for language image pre-training，把 CLIP 的多類別對比改成 per-pair 二元分類。
- ViT（vision transformer）：把影像切 patch 當 token，加位置編碼過 transformer。
- Attention pooling：以全域平均為 query 對各位置做一輪 attention，取代單純平均得到序列表示。
- VLM（vision language model）：把 vision encoder 的影像 embedding 投影後注入語言模型的模型。
- Projector／adapter：連接 vision encoder 與語言模型的模組（線性 W／MLP／cross attention／DeepStack）。
- Alignment phase：只訓 projector、把影像 embedding 對齊到語言模型 token 空間的訓練階段。
- AnyRes：把高解析度影像切成 vision encoder 尺寸的多個 tile 分別編碼再串接的自適應解析度做法。
- M-RoPE（multimodal RoPE）：把位置擴成 (height, width, time) 三元組、各維各算 RoPE 再串接。
- VQ-VAE：把影像映到離散 codebook（最近 code）再重建的自編碼器，用於把影像離散化成 token。
- Z-loss / QK-norm：控制參數 norm 成長、穩定訓練的正則化手段。

### 公式／量化描述

- CLIP：400M image–text 對；batch ~32,000；2N 個 cross-entropy；ViT-L/14、336×336、14×14 patch；訓練 256 TPU v3 × 10 天；zero-shot 勝過訓於 1.2M ImageNet 標註影像的 ResNet。
- OpenCLIP／LAION-5B（存疑）：5B image–text 對。
- SigLIP：per-pair 二元、log-sigmoid；32 TPU v4 × 5 天；critical batch ~32k；可用 <16k batch；WebLI（存疑）~十億對。
- LLaVA：CLIP ViT-L/14 + Vicuna + 線性 W；158,000 合成例；兩階段。
- LLaVA-OneVision：SigLIP + Qwen2 + 兩層 MLP；影片 ≤32 frame；單圖 ≤9 crop；三階段。
- QwenVL：OpenCLIP + cross attention adapter → 固定 256 token；stage 1 ~1.4B 例；三階段。
- Qwen2-VL：dynamic resolution（8 到 11,000 token 皆可）；每 2×2 壓成 1（每 patch ~66 token 存疑）；影片 2 fps、≤16,000 token；M-RoPE。
- Qwen3-VL：context ≤256K；SigLIP2；interleaved M-RoPE；顯式影片 timestamp token；sqrt 正規化 per-token loss；DeepStack；pre-training 4 階段（8k→32k→256k）+ post-training 3 階段。
- 參數量對比：語言模型 72B、projector ~72M、ViT <1B。
- Chameleon：VQ-VAE codebook 8,000；512×512 → 1,024 token；VQ-VAE 約 2017。
- 對齊 token budget：約 67B token。

### 演算法／流程

- CLIP：encode 影像與文字 → 正規化 → dot product × temperature → 逐列逐行 cross-entropy（2N 個）。
- SigLIP：encode → 正規化 → dot product → 對角線標 1、off-diagonal 標 -1 → log-sigmoid；分散式時 text embedding 環狀輪轉覆蓋 off-diagonal。
- VLM 通用：vision encoder → projector 映到 LM token 空間 → 與文字 embedding 串接 → 標準 transformer → 輸出文字。
- LLaVA 兩階段：stage 1 凍 encoder+LM 訓 W（alignment）；stage 2 凍 encoder 訓 W+LM。
- QwenVL 三階段：stage 1 凍 LM 訓 encoder+adapter；stage 2 訓全部；stage 3 凍 encoder 訓 adapter+LM。
- AnyRes：downsample 全域一路 + 切 336×336 tile 各自編碼 → 串接 → 過多則 subsample/內插。
- Chameleon：VQ-VAE 影像 → 離散 code → 與文字 token 混合 → 普通語言模型訓練（QK-norm + Z-loss 穩定）。

### 工程限制

- CLIP 需大 batch（32k），softmax 對整 batch 運算、不易分解；SigLIP 解耦 batch 與 loss、可平行。
- vision encoder 固定尺寸（336×336）→ 做 OCR/高解析度需 AnyRes/dynamic resolution。
- 影片 token 數暴增 → 撞 context length，需降解析度/降 frame/正規化 loss/長 context。
- 多模態混合訓練不穩定（文字低熵 vs. 影像高熵），Chameleon 更嚴重。
- 離散化（VQ-VAE）損失細節，不利 OCR 與細節生成。
- 多模態資料載入昂貴（尤其影片），需 async data loading。

### 講者例子

- CLIP zero-shot 勝過 1.2M 標註 ResNet（Mechanical Turk 大量人力 vs. 網路有機資料）。
- 生成式 caption 目標反而比 bag-of-words 對比差（以 ImageNet 準確率衡量）。
- LLaVA：小廂型車後燙衣服的「不尋常之處」。
- 跨模態遷移：只訓單圖 OCR / 多圖 relational，卻能做「表格+圖表」多圖問答、影片 visual prompting。
- Qwen2-VL：大圖 11,000 token vs. 小公式圖 8 token。
- Chameleon：「我很無聊，給我看些鳥」→ 交錯文字與影像。

### 問答重點

- 為何訓 image–text 對而非只訓影像：純資料增強（SimCLR，存疑轉寫 "sim clear"）只給低層細節，無法從一種狗增強到另一種狗；文字提供更高層語意表示。
- caption 有其他狗會不會混淆：過程本就 noisy，平均而言不會一直是狗，可接受；caption 本就不逐字描述圖，需大量過濾。
- SigLIP 是否需複雜採樣：初版沒有，直接用同一矩陣。
- 影片生成/如何判斷該輸出影片還是文字：這些模型只在輸入側多模態、永遠輸出文字，除 RL 外監督每個 token。
- 多模態系統上是否更難：不會更容易；資料更大、影片載入貴、token 多需正規化，但文字 token 本就多。
- 對齊如何知道語言：語言模型必須已預訓練且凍結，只訓 adapter，選定 token budget（~67B）直接訓。
- vision encoder 為何小：做局部 patch 操作、不推理、少知識，能力在語言模型。

### 容易忽略的提醒

- 本講標題有「Alignment」，但講者明言原計畫的 RL/alignment 內容被 multimodality 取代；此處 alignment 專指多模態表示對齊。
- token 概念被擴張為「離散或連續」，理解後續一切的關鍵。
- VLM 是縫合現成元件（mid/post-training 味道），不是從零訓練。
- 「natively multimodal」的閉源細節不公開，講者的 diffusion+連續 encoder 是明說的 speculation。

## 從零實作語言模型的意義

1. 多模態的第一原則是「一切皆 token」：實作上要先決定用**離散 token（VQ-VAE 路線）**還是**連續 embedding（VLM 路線）**，兩者在生成能力、資訊保真度、訓練穩定性上各有取捨。
2. VLM 最小可行實作是「vision encoder + projector + 凍結的 LLM」，先只訓 projector 做 alignment，再解凍語言模型——這對應 from-scratch 之外的「縫合式」訓練範式，成本低、可複現（LLaVA 開源資料）。
3. 影像的「動態尺寸」問題與語言的「動態長度」問題同構，AnyRes/dynamic resolution/M-RoPE 是把 transformer 對變長序列的處理能力遷移到影像/影片。
4. 影片帶來的 context length 與 loss 加權問題，直接連到 scaling、long-context、data mixture 等已學章節。
5. 對比式預訓練（CLIP/SigLIP）本身是一個可獨立實作的目標函數，理解其 batch 依賴與平行化，是理解 embedding/檢索類系統的基礎。

## 跨章連結

- 前置：Lecture 16（RLVR / reinforcement learning）——講者一開場即說本講原要延續 RL，但改講 multimodality；本講 Qwen3-VL 的 post-training 提到 SFT/distillation/RL，可回接 RL 章節。
- 後續：Lecture 18（guest lecture）——待該 worker 補充，本講未預告其內容。
- 位置編碼：呼應前面 RoPE 的講解（M-RoPE 是其多維推廣）。
- 系統章節：DDP、critical batch size、data loading async 皆在本講被引用。
- 資料章節（Lecture 13/14）：data mixture、資料過濾、蒸餾（GPT-4）、synthetic data 的概念在 VLM 資料策展中重現。
- Tokenization（Lecture 1）：BPE 是「文字的 tokenizer」，本講問「非文字模態的 tokenizer 等價物」。

## 相關作業與材料

此段只建立關聯，不提供作業解答。

- Course material：本講對應的 lecture code/trace 檔名未在逐字稿中提及，狀態待補（尚未確認 `data/cs336/lectures material/` 是否有 lecture_17 相關檔）。
- Assignment 關聯：講者明確說本講**沒有對應作業**（"we don't have any homework on uh doing this"），只鼓勵學生自行嘗試訓練這類模型。
- 材料狀態：待補 / 不適用（無作業）。
- 缺少的材料或 URL：本講引用的論文（CLIP、OpenCLIP/LAION-5B、SigLIP、WebLI、LLaVA 系列、Qwen-VL 系列、Chameleon、VQ-VAE、DeepStack）僅依講者口頭描述整理，原始論文與確切數據待材料階段或使用者提供連結核對。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 標題「Alignment」與內容落差：本講幾乎全是 multimodality，無 RLHF/偏好對齊內容 | 主控 agent 決定章節定位；或第 6 階段是否補 RL/alignment | 已在筆記與書稿明確標示；不編造 alignment 內容 |
| SigLIP 拼寫（逐字稿轉寫 "cichlip"/"cig"，疑為 SigLIP） | 原論文 | 採用 SigLIP，保留 ASR 原文並註存疑 |
| Vicuna（轉寫 "Vunia"）、SimCLR（"sim clear"）、LAION-5B（"lion 5B"）、WebLI（"web li"）、MS-COCO（"MS Coco"）等 ASR 疑誤 | 原論文 | 採用推定正確拼寫並註存疑 |
| LLaVA-OneVision（轉寫 "Lava 1 vision"）確切名稱 | 原論文 | 採用 LLaVA-OneVision 並註存疑 |
| DeepStack 是否為 deepseek team 論文 | 原論文 | 依講者口述記錄並註存疑 |
| ViT-L/14 層數（講者說「約 24 層，不太確定」）、Qwen2-VL 每 patch token 數（~66）等講者自陳不確定的數字 | 原論文 | 保留講者原話並註不確定 |
| 本講是否有對應 lecture code/trace 檔 | `data/cs336/lectures material/` 目錄 | 待補；逐字稿未提檔名 |
| 各模型 benchmark 具體數字 | 原論文 | 逐字稿只給定性比較，不外查 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。（本階段留空）

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-03 | 建立 | 完整閱讀 Lecture 17 逐字稿（第 1–1614 行），產出閱讀筆記與書稿 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`17_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_17_Alignment_-.txt`
- 逐字稿總行數：約 1613–1614（`wc -l` 回報 1613，末行無換行符）
- 新增或修改檔案：`docs/cs336-language-modeling/notes/lecture-17-alignment-multimodality.md`、`docs/cs336-language-modeling/17-alignment-multimodality.md`
- 本講核心概念：見上方「核心概念」8 節
- 需要主控 agent 複查的點：標題 Alignment 與內容落差（是否補 RL/alignment）、多處 ASR 專有名詞存疑
- 缺少的材料或需要使用者提供的 URL：見「資訊不足與待補清單」
- 是否使用外部資料：否。
</content>
</invoke>
