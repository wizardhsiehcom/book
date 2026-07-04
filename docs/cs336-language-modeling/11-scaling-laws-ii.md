# Scaling Laws II

## 導讀

Lecture 9 建立了 scaling laws 的基本語言：power law、data/model scaling、critical batch size、Chinchilla 的三種擬合方法。但那一講的最後留了一個沒有打開的盒子——learning rate 該怎麼隨尺度改變？本講就是要打開這個盒子，而且方式很直接：不是繼續講抽象理論，而是把幾份真正訓練過開源大模型的團隊怎麼做 scaling，攤開來看。

本講的核心提問是：如果你想從 Chinchilla 這種 2022 年左右的經典結果，一路「速通」到像 Kimi K2 這種現代前沿開源模型，中間到底還缺什麼？答案指向兩條互相競爭、又都被驗證有效的路線。第一條路線是「擬合超參數的 scaling law」——與其猜測 learning rate、batch size 該怎麼設，不如直接做網格搜尋，把最佳值本身也當成 compute 或資料量的函數，擬合出一條線再外推。第二條路線是「reparameterize 掉尺度依賴」——透過調整 initialization 與 per-layer/per-parameter learning rate，讓模型不管多大，最佳 learning rate 都停在同一個地方；這條路線的代表是 μP。

本講用 MiniCPM 代表第二條路線、DeepSeek LLM 代表第一條路線，展開對照。之後深入 optimizer 的 scale-dependence（包含近年很受關注的 Muon），最後完整推導 μP 背後的數學邏輯。結尾講者刻意打破「scaling laws 是精確科學」的錯覺：這件事情摻雜相當多的工程判斷與運氣成分，沒有一勞永逸的解法。

## MiniCPM 與 DeepSeek：兩種應對超參數漂移的哲學

真正訓練大模型時，幾乎無法回避一個現實：learning rate 與 batch size 的最佳值會隨模型尺度改變。如果你在小模型上調好的 learning rate 直接套用到大模型，通常不是最佳選擇，甚至可能訓練不穩定。業界處理這個問題，大致分成兩條路。

MiniCPM（2024 年由中國開源社群做出的高效能 1–2B 模型）選擇的是「reparameterize 掉尺度依賴」——也就是 μP 這條路。具體做法包括：scale embedding output、把 residual connection 乘上層數的平方根、依 fan-in/fan-out 比例調整矩陣初始化、給不同 tensor 不同的 learning rate（per-parameter learning rate）、scale LM head。這一整組操作的目標很單純：讓不同尺度的模型，最佳 learning rate 盡量落在同一個值上。MiniCPM 的實驗確實顯示出這個效果——掃過不同模型尺寸後，最小 loss 幾乎都落在同一個 learning rate 附近。

但即使 learning rate 被穩定住了，batch size 仍然要隨尺度調整，因為它同時依賴資料量與模型大小。MiniCPM 的做法是固定 batch size、逐步增加 token 數做一系列訓練，再從「等 loss 曲線」中擬合出每個 loss 水準下的最佳 batch size，重現了 Lecture 9 提過的 critical batch size power law：loss 越低，最佳 batch size 越大。

DeepSeek LLM（原始版本，尚未導入 MoE）走的是完全相反的路：不做任何 reparameterization，而是直接對「最佳 batch size」與「最佳 learning rate」各自擬合一條 scaling law，把它們都寫成 compute（或 non-embedding FLOPs）的函數。做法是在多個尺度上做密集網格搜尋，對每個固定的 compute 預算，掃過 learning rate 與 batch size 的組合，找出 terminal loss 最低的點，再把這些「最佳點」跨尺度連起來擬合。最終他們用兩個真正訓練的大模型驗證了這套 scaling law 的預測準確度，結果相當接近。

這兩條路線沒有誰絕對更好。MiniCPM 的做法哲學性更強、也更優雅，但需要相信 μP 的假設在實際架構（SwiGLU、RMSNorm 等）下依然成立；DeepSeek 的做法更暴力，但對假設的依賴更少，代價是需要更大規模的網格搜尋計算量。本講後半段會分別深入這兩條路線的技術細節。

## Warmup-Stable-Decay：讓 Chinchilla 分析變得可負擔

做 Chinchilla 式分析（固定 compute、掃模型大小與資料量的權衡）有一個工程上的老問題：標準的 cosine learning rate schedule 需要事先知道訓練終點，才能畫出完整的下降曲線。這代表如果你想多測一個更長的 token 預算，幾乎必須把訓練從頭重跑一次——想跑一個 800 萬 sequence 的模型，不能從 400 萬 sequence 訓練結束的地方接著跑，因為 cosine schedule 從根本上是為不同的訓練總長設計的。這個限制讓掃描資料維度的成本近似隨組合數量平方增長，非常浪費。

MiniCPM 等團隊的解法是 Warmup-Stable-Decay（WSD），形狀像一個梯形：先是固定步數的 warmup（與訓練總長無關），接著是訓練大部分時間維持恆定的 stable 階段，最後是訓練末尾 10%–20% 步數、把 learning rate 快速降到峰值約 10% 的 decay 階段。

WSD 真正的價值在於：你可以在 stable 階段的任何一點把訓練「倒帶」回去，繼續往前訓練更多 token，然後重新做一次 decay，而不必從頭重跑整條訓練軌跡。也就是說，每多測一個資料量的成本，只是一次 decay（約整體成本的 10%），而不是整個 pretraining run。這讓掃描資料維度的 Chinchilla 分析，從「幾乎不可負擔」變成「相對便宜」。

WSD 與 cosine 的表現比較也值得記住：在到達 decay 階段之前，WSD 曲線看起來明顯落後 cosine，一進入 decay 階段才會迅速追平甚至反超。經驗上，精心調過的 cosine 有時略優，但 WSD 幾乎一樣好，而且更適合被重複利用做多組實驗——這也是為什麼它現在是很常見的預設 learning rate schedule。

有了 WSD，MiniCPM 與 DeepSeek 都用它來做各自的 Chinchilla 複製實驗。DeepSeek 的 isoFLOPs 曲線看起來比 MiniCPM 乾淨，這某種程度上反映了兩者在做實驗設計時選擇的不同側重。值得一提的是，MiniCPM 選擇複製 Chinchilla 的方法一（lower envelope）與方法三（joint functional form fitting）——這兩種恰好是 Lecture 9 提到的三種方法中相對不那麼穩健的，得出的 exponent 也與原始 Chinchilla 不同，MiniCPM 論文因此宣稱他們的模型應該用遠多於 Chinchilla 比例的 token 訓練。這個結論是否可靠仍有疑問，值得讀者對任何單一論文的 scaling 結論保持一定的懷疑態度。

## 業界的 scaling 報告都在做什麼

把鏡頭拉遠一點看，近年（2024–2026）的開源模型技術報告，幾乎都在延續 MiniCPM 與 DeepSeek 示範的這套方法論，只是各自延伸到不同的具體問題上：

Qwen 2.5 與 Qwen 3 延續 DeepSeek 式的做法——做 scaling 實驗找最佳 batch size 與 learning rate，並把這套方法延伸應用到 MoE 架構上。到了 Qwen 3，這套流程已經變成「沿用上一代已經驗證過的配方」，不再重新詳細展示。

Chinchilla 2 與 Hunyuan 這類報告聚焦在 MoE scaling law：固定 FLOPs，比較不同稀疏度（sparsity）水準下的 validation loss，藉此決定應該用多少 active parameters。結論符合直覺——越稀疏、loss 越低——但重點是這個關係被量化後，可以支持具體的架構決策（例如某報告選擇特定的稀疏度，因為在該點已經進入報酬遞減）。

Llama 3 的 isoFLOPs 分析本身並不特別，但他們額外畫出的一張圖值得記住：pretraining loss（log likelihood）與下游 benchmark 準確率之間，存在一個大致符合 sigmoid 形狀的映射關係，即便有系統性偏差。這提醒我們：upstream loss 與 downstream 表現並非完全脫鉤，只是這個映射本身也不是絕對精確的規律。

MiniMax-01 用 scaling law 比較了三種注意力機制——lightning attention（一種 linear attention）、標準 softmax attention，以及兩者混合的 hybrid 架構——在不同 compute 下幾乎沒有明顯的優劣差異。這組實驗直接被用來為部署版本選擇 hybrid 架構背書，是「用 scaling law 支持架構決策」的清楚範例，呼應了 Lecture 9 提到的「用小尺度實驗判斷架構是否值得放大」的做法。

這些報告有一個共同的態度轉變：核心的 scaling machinery（Chinchilla、learning rate scaling）已經被視為業界常識，新論文不再花大篇幅證明這些基本功，而是把 scaling 實驗用在更具體的新問題上（MoE 稀疏度、架構選擇）。至於 scaling laws 該如何與 post-training 整合，目前仍是開放問題——沒有成熟的方法能把 pretraining scaling 與 post-training 的效果完整串起來，只有一些針對 pretraining 資料 coverage/diversity 的早期研究在嘗試回答這個問題。

## Learning rate 與 batch size 的細節實證：該信哪條 scaling law

DeepSeek 式「直接擬合超參數 scaling law」這條路線，後續被更細緻地檢驗過。一份聚焦在這個問題的研究，對 learning rate 與 batch size 各自的 scaling 行為做了大規模網格搜尋，涵蓋多個模型尺寸與資料量尺度，並用 contour plot 呈現固定尺度切片下的 loss landscape。這個 landscape 在實驗中相當平滑、近似凸函數，這提高了網格搜尋本身的可信度——如果 landscape 是鋸齒狀的，網格搜尋找到的「最佳點」就很難讓人放心。

這項研究最值得記住的發現是：最佳 batch size 主要依賴訓練的總資料量，不同模型大小的資料點幾乎都落在同一條趨勢線上；而最佳 learning rate 的行為則相反且有點反直覺——模型越大，最佳 learning rate 越小，但資料量越多，最佳 learning rate 反而越大。後者的方向性並不是所有研究都認同，這提醒我們：超參數 scaling 的具體形式很可能是與訓練資料本身相關的，而不是一個放諸四海皆準的規律。

不過也有一個值得安心的觀察：learning rate 的最佳值雖然理論上會隨尺度飄移，但實務上的容錯範圍並不窄——多數訓練過語言模型的人，對「合理的 learning rate 大概落在什麼範圍」都有大致準確的直覺。這說明即便沒有精確的 scaling law，憑經驗設定的 learning rate 也很少會離譜到訓練失敗。

這類超參數 scaling law 在多大程度上可以直接套用到自己的訓練任務？答案取決於你的 compute 預算與所需精度。如果你的訓練規模落在別人做網格搜尋的範圍內，直接套用發表過的公式通常是不錯的預設選擇；但如果架構設計有明顯差異（例如特別大的 weight decay 設定），這些超參數不一定會以同樣的方式隨尺度變化，因此許多大型預訓練團隊仍然會重新做一次 Chinchilla 式驗證，確保至少一階正確。這也是為什麼講者反覆強調：scaling laws 表面上看起來很科學，但本質上仍然摻雜大量工程判斷——你永遠無法完全確定別人的實驗設定與你的情境足夠相似而可以直接轉移。

## Optimizer 的尺度敏感性：以 Muon 為例

如果說 learning rate 與 batch size 的 scaling 已經算是「業界共識」，那麼 optimizer 本身該怎麼隨尺度改變，則是一個更前沿、更不確定的問題。

Muon 是這方面近期最受關注的例子。它最初在 nanoGPT speedrun（一個小模型、短訓練時間的基準，也是 Assignment 1 的靈感來源）上取得遠超 Adam 的成績，而且沒有明顯的速度代價。但緊接著的問題是：這種小尺度的優勢，能不能轉移到真正的大規模預訓練？後續的一些 scaling 研究顯示，Muon 相對 Adam 的加速比會隨 compute 增加而逐漸縮小——這不是我們希望看到的圖像。

比較 optimizer 的 scale-dependence 時，有兩個軸必須同時檢查，缺一不可：第一是 compute 軸（固定模型與資料量的比例，看結論隨 compute 增加如何變化）；第二是 Chinchilla ratio 軸（資料量與模型大小的比例本身）。後者是一個經常被忽略的混淆變數——某些 optimizer 可能特別適合「模型遠大於資料」的情形（也許提供某種隱式正則化），另一些則可能特別適合「資料遠多於模型」的情形。很多做得不錯的 scaling 實驗只檢查了 compute 這一軸，卻沒有 compute 資源去檢查 Chinchilla ratio 這一軸，而這個比例常常出乎意料地重要。

比較 optimizer 時還有一個更基本、卻常被忽略的陷阱：如果 baseline（例如 Adam）沒有被認真調好 learning rate 或 weight decay，看起來會顯得遠差於新方法；一旦把 baseline 調好，原本亮眼的優勢可能整個消失。這不是 scaling 特有的問題，而是任何經驗性機器學習比較都要小心的基本功。

一個來自開源訓練專案（Percy 主導的 Marin 專案）的公開實驗記錄，生動展示了 scaling 曲線可能帶來的意外：某個使用 Cautious AdamW 變體、`sqrt(batch size)` scaling 等看似標準配置的實驗，在較小 compute 範圍內呈現出多個數量級都近似線性的漂亮 Chinchilla 曲線，但繼續放大後曲線先是略差、接著明顯變差，最後完全崩潰。團隊最終靠切換到更謹慎的 μP 式 parameterization、並更換 optimizer，才重新獲得跨更大尺度範圍的良好 scaling。這個案例提醒我們：漂亮的多數量級線性趨勢，不能自動保證外推到更大尺度依然成立。

Muon 本身的機制值得單獨說明，因為它代表了一種與 Adam/Adagrad 截然不同的思路。標準 momentum 更新是對梯度累積 momentum，再直接拿這個 momentum 更新參數。Muon 的關鍵差異在於：它先對 momentum 矩陣做一個叫 Newton-Schulz 的操作，把這個矩陣「正交化」——概念上等同於對矩陣做 SVD 分解，然後把所有奇異值都設成 1，再用調整後的矩陣去更新參數。直覺上，Adam/Adagrad 是在「逐座標」層面正規化梯度大小；Muon 則是在 spectral norm（矩陣的奇異值結構）層面正規化，讓每個方向的更新量大致同尺度。這個操作只對矩陣型參數（attention、MLP 權重矩陣）有意義，向量型參數（如 RMSNorm 的 gain）仍然沿用 AdamW。Newton-Schulz 本身只需要有限次矩陣乘法就能近似完成正交化，因此在 GPU 上比直接做 SVD 高效得多——這是 Muon 能被真正用於大規模訓練的系統面基礎。

Muon 的完整故事線到近期有了新進展：在小尺度亮眼、在中等尺度的嚴格比較中優勢縮小，一度讓人以為這個故事已經走到盡頭，不會有人願意花大 compute 把它 scale 到真正的預訓練規模。但後來 Kimi K2 這個模型幾乎完全用 Muon 訓練（並加入了一些防止不穩定的技巧），最終成為一個非常出色的模型。嚴格來說，Kimi K2 沒有做 Muon 對比 Adam 的 ablation，所以我們仍然不知道在那個尺度下 Muon 是否真的優於 Adam；但它至少證明了 Muon 是一個「在真正大尺度上可行、能訓練出優秀模型」的方案。這段故事最重要的教訓是：判斷一個方法是否真的能在大尺度奏效非常困難，小尺度實驗轉移到大尺度目前仍然是這個領域做研究和做決策的主要方式，儘管它並不保證成功。

## μP：讓最佳 learning rate 不再隨尺度漂移

本講最後回到 μP，把 MiniCPM 一帶而過的技巧完整展開。

μP 的目標可以用一句話概括：正常情況下，把模型（例如只改變寬度）變大時，最佳 learning rate 會跟著偏移；μP 希望的是，無論模型多寬，最佳 learning rate 都維持一致。為了達成這個目標，可以調整的旋鈕包括：per-layer 的 initialization scale、per-parameter 的 learning rate，以及依模型大小縮放 residual connection。

μP 在實踐中確實被驗證有效。一個例子來自 Cerebras（一家晶片公司，同時經營語言模型訓練團隊）發布的 Cerebras-GPT：他們訓練了 0.1B 到 13B 的模型，同時比較標準 Chinchilla recipe 與加上 μP 變體的版本，結果顯示採用 μP 後 scaling law 的擬合更穩定，對實際大模型 loss 的預測幾乎命中，而非 μP 版本的預測波動明顯更大。

μP 背後的推導邏輯很值得單獨理解，因為它代表一種與一般深度學習直覺不同的思考方式——更接近物理學家處理標度極限問題的習慣。推導從兩個「不變量」假設出發，考慮把網路寬度放大到極限的情形：第一，模型初始化後，各層 activation 的量級應該大致與寬度無關（既不該隨寬度爆炸，也不該趨近於零）；第二，做完一次梯度更新後，activation 的變化量也應該與寬度無關，這正是所謂的 feature learning——與 Neural Tangent Kernel 極限下「activation 變化量隨寬度消失」的行為形成對比。我們不希望模型在放大後退化成靜態的 kernel 方法，而是希望它在任何尺度下都持續學習、產生實質變化。

以一個簡化的深度線性網路為例：從第一個不變量出發，利用矩陣集中不等式，可以反解出每一層的 initialization 應該依 fan-in/fan-out 的比例調整，而不是所有層用同一套標準初始化。從第二個不變量出發，把一次梯度更新造成的 activation 變化拆解成幾項，要求它們量級一致，可以反解出每一層的 learning rate 也應該依 fan-in/fan-out 的比例調整——對 SGD 而言接近 fan-out/fan-in 的比例，對 Adam 而言則接近 fan-in 的倒數，也就是說 fan-in 越大的層，在 Adam 下應該用越小的 learning rate。這個推導過程需要額外假設「每一步造成的 loss 變化量應與尺度無關」，這個假設本身並不是顯然成立的，但它讓整個推導得以收斂成簡潔的 scaling 規則。

μP 推導真正重要的地方，不只是最終得到的具體公式，而是這套方法論本身：先取一個 scaling limit，對網路行為斷言若干不變量，加入必要假設，反解出這些不變量隱含的超參數 scaling 規則。這是一種可以推廣到其他超參數 scaling 問題的通用思路。

μP 的實際適用範圍也被壓力測試過。測試發現，大多數現代架構設計（SwiGLU、各種初始化變體等）雖然技術上不完全符合 μP 理論的前提，實務上仍大致相容；但有三種情形會明顯破壞 μP：在 RMSNorm 中學習 gain 參數、使用依賴梯度符號的 optimizer（如 Lion，這在精神上與 Muon 有相似之處）、以及使用較大的 decoupled weight decay——其中大 weight decay 被認為是最令人擔心的一項。

## 工程取捨

選擇 μP 路線還是 scaling-law 擬合路線，本質上是在「相信一套理論假設」與「花更多 compute 做經驗擬合」之間取捨。μP 一旦成立，幾乎可以省掉大量重複調 learning rate 的成本；但它依賴若干理論假設，且已知會被 learnable RMSNorm gain、sign-based optimizer、大 weight decay 等常見設計破壞。DeepSeek 式的直接擬合不依賴這些假設，更貼近「看資料說話」，但需要在多個尺度上做密集網格搜尋，成本更高，且擬合出來的公式（尤其是 learning rate 那一條）有時不夠乾淨。

WSD learning rate schedule 是另一個典型的工程取捨：它犧牲了 cosine schedule 在單一固定訓練長度下可能略優的表現，換取「同一條訓練軌跡可以倒帶重跑、支持多組資料量實驗」的靈活性。對於需要頻繁做 Chinchilla 式掃描的團隊，這個取捨幾乎總是划算的。

Muon 這類新 optimizer 的取捨則體現在「小尺度證據」與「大尺度信心」之間的落差。它在小尺度的優勢非常清楚，但大尺度的嚴格 ablation（尤其是與 Adam 的直接對比）仍然缺乏。Kimi K2 證明了它在大尺度「可行」，但沒有證明它在大尺度「更優」。這提醒工程決策者：把小尺度的亮眼結果直接當成大尺度的結論，本身就是一種冒險，需要額外的穩定性技巧（Kimi K2 提到「一些防止不穩定的技巧」）配合使用。

比較任何 scaling 結論時，必須同時檢查 compute 軸與 Chinchilla ratio 軸，且要確保每個被比較的方法都調到位（learning rate、weight decay 等），否則結論可能只是「沒調好的 baseline 輸給調好的新方法」，而不是真正的演算法優劣差異。

## 常見誤解

第一個誤解是把 scaling laws 當成「照做就會成功」的確定性流程。實際情況遠比這混亂——即使是多個數量級都呈現漂亮線性關係的曲線，也可能在某個尺度後突然偏離甚至崩潰（Marin 案例）。

第二個誤解是認為 μP 已經「解決」了超參數漂移問題，可以套用在任何架構上。μP 的理論前提在現實架構中經常被違反，雖然大多數違反情形影響不大，但 learnable RMSNorm gain、sign-based optimizer、大 decoupled weight decay 這幾種常見設計會明顯破壞 μP 的不變量，不能想當然地假設它一定成立。

第三個誤解是把小尺度的 optimizer 優勢直接當成大尺度的結論。Muon 在小尺度（nanoGPT speedrun）的優勢非常顯著，但有研究顯示這個優勢會隨尺度增加而縮小；Kimi K2 的成功也不構成「Muon 優於 Adam」的嚴格證據，只證明了它在大尺度「可行」。

第四個誤解是只檢查 compute 這一個軸就斷言某個方法或超參數 scaling 規律普遍成立。Chinchilla ratio（資料量與模型大小的比例）是另一個經常被忽略、但可能顯著影響結論的混淆變數。

第五個誤解是把某一篇論文的超參數 scaling 公式當成絕對真理。不同團隊（Kaplan、DeepSeek、StepFun 等）對「learning rate 該是什麼變數的函數」甚至沒有共識，這些公式更適合當作「在特定條件下有效的經驗參考」，而不是放諸四海皆準的定律。

## 小結

本講把 Lecture 9 留下的「learning rate 該怎麼隨尺度改變」這個問題，用兩條實際路線補齊：一條是像 DeepSeek、StepFun 那樣直接擬合超參數的 scaling law；另一條是像 MiniCPM 那樣透過 μP 式的 reparameterization，讓最佳 learning rate 盡量不隨尺度改變。WSD learning rate schedule 讓 Chinchilla 式的資料維度掃描變得可負擔，是這兩條路線背後共享的工程基礎設施。Qwen、Hunyuan、Llama 3、MiniMax 等一系列近期開源模型報告顯示，這套方法論已經變成業界標準配方，並被延伸應用到 MoE 稀疏度、架構選擇等更具體的問題上。

Optimizer 的 scale-dependence 是本講另一個重點，Muon 的故事——小尺度亮眼、中等尺度存疑、Kimi K2 證明大尺度可行——生動說明了「判斷一個方法是否真的能在大尺度奏效」有多困難。μP 的完整推導則展示了一種獨特的方法論：透過在 scaling limit 下斷言不變量，反解出超參數該如何隨 fan-in/fan-out、層數縮放；但它的理論假設在現實架構中並非處處成立，需要搭配壓力測試的經驗證據來判斷適用邊界。

講者在結尾明確提醒：scaling laws 表面上很科學，但本質上仍然需要工程判斷——沒有銀彈，只有盡量提高外推成功機率的一組工具（μP、超參數 scaling law 擬合、WSD、謹慎的 optimizer 選擇）。這也是本講想傳達給讀者最重要的心態：把 scaling 當成一門需要持續驗證的手藝，而不是按下按鈕就能得到答案的科學公式。

## 相關作業與材料

- Course material：`data/cs336/lectures material/lecture_11.pdf`。狀態：已核對 PDF metadata / outline；投影片未完整閱讀。
- Assignment 關聯：Assignment 3（`data/cs336/code/assignment3-scaling-main/`）對應 training API、IsoFLOPs / scaling law 建構、loss projection 與 final submission 的實作/分析範圍。狀態：已核對 README、PDF outline、API/test 檔案；handout 未完整閱讀。
- 本段只整理學習目標與章節關聯，不提供作業解答。
