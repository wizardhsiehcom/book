# Lecture 13：Data (Sources, Datasets) 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 13, Data: Sources, Datasets（講者為 Percy）
- 逐字稿檔案：`data/cs336/transcripts/13_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Lecture_13_Data_Source.txt`
- 完整閱讀範圍：第 1 行到第 2133 行（檔案總行數 2132，內容讀到檔案最後一句 "filtering."）
- 總行數：2132
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。所有法律案例（NYT v. OpenAI、Anthropic 訴訟、Meta 訴訟）、資料集細節（Books3、the Pile、DCLM、Nemotron-CC、Common Pile 等）皆只依逐字稿講者口頭描述整理，不外查判決全文或原始論文。
- 相關材料狀態：Lecture 13 code `lecture_13.py` 已下載，待材料階段閱讀。trace `var/traces/lecture_13.json` 已下載，待材料階段閱讀。Assignment 4 Data 已下載於 `code/assignment4-data-main/`，待材料階段閱讀。

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行（"So, today we're going to talk about data."）
- 終點：第 2132/2133 行（"I'll do talk a bit about uh post-training data and a bit more about uh you know, filtering."）
- 是否從頭到尾完整閱讀：是，分段依序讀完全部內容，未跳段、未只用搜尋或抽樣。
- 跳過段落：無。

## 本講主問題

本講的主問題是：語言模型的資料到底從哪裡來、憑什麼可以被使用、以及過去幾年主要的 pre-training 資料集是怎麼從原始 crawl 一步步被過濾成可訓練語料？講者主張資料是語言模型中最重要、也最不透明的一環——公司會公開架構與訓練方法，但幾乎從不公開資料細節，原因包括競爭機密與著作權風險。本講聚焦在 pre-training 階段的資料來源與著作權脈絡，並用歷史時間軸（BERT 到 Common Pile）逐一檢視各代表性資料集如何處理 crawling、過濾、去重與授權問題，為下一講（filtering、deduplication、mixing、synthetic data 的技術細節）鋪路。

## 核心概念

### 1. 資料的不透明性與 pipeline 中的三個階段

講者一開始用 Llama 3 report 為例：架構與訓練程序都公開，但資料只寫「we train from a variety of data sources」。原因有二：資料是競爭上的 secret sauce；資料揭露會帶來著作權訴訟風險。

講者接著把資料工作放進整個訓練 pipeline 的三個階段：pre-training（大量低品質網路文件）、mid-training（較高品質網路資料、instruction data、大量 synthetic data，用來加強能力與長 context）、post-training（chat transcripts、RL environments，任務導向更強）。三階段界線其實模糊，也可能不只三段。這個趨勢是「從大量低品質資料，走向少量高品質資料」。由此衍生出 base model（pre-training + mid-training 後）與 instruct/chat model（post-training 後）的用語，但講者也指出，隨著最新模型（例如 Qwen 3.5）不再釋出中間 checkpoint，「base model」這個詞本身也越來越模糊。開放模型如 AI2 的 OLMo 則完整公開每個階段。本講聚焦 pre-training 的來源與資料集。

### 2. 「訓練在整個網路上」這句話並不精確

講者澄清一個常見誤解：「language models are trained on the entire internet」在語意上就不成立，因為那意味著要有一個像 RL agent 一樣主動在網路上行動的東西，但 pre-training 並非如此。較準確的說法是「訓練在 public World Wide Web 上」，但這仍不完全準確。

網路本質上是一群活的伺服器，你只能用 crawler 去發現與下載頁面（從 seed set 出發，做圖走訪），無法「下載整個網際網路」，原因包括：

- 大量內容是動態的（app 型網站、需要點擊或送出表單才能取得內容，例如 Discord），屬於 deep web，不是傳統的「跟著超連結走」模型能觸及的。
- 許多內容鎖在需要登入或付費的 walled garden 後面（Facebook、X、LinkedIn、New York Times），除非你是該平台本身（Facebook 或 X/xAI），否則無法取得。
- 就算沒有 authentication 問題，仍有 robots.txt 這種「君子協定」：告訴爬蟲哪些路徑可爬、哪些不行（例如常見會擋 OAI SearchBot、PerplexityBot、CCBot、ClaudeBot）。這不是法律強制，而是「應該遵守的規範」。
- Cloudflare 等服務會偵測並封鎖 bot 流量（例如觸發 CAPTCHA），也有 IP／國家封鎖與 rate limit 等技術限制。
- 還有法律限制：terms of service 常明訂「禁止用於 AI 訓練」，即使 ToS 未提及，網站內容本身也可能沒有訓練授權。

### 3. Consent in Crisis：限制正在快速增加

講者引用一篇由 Shane Longpre 等人做的研究（逐字稿中轉寫為 "Shane Lampray"，"Consent in Crisis"），檢視常見資料集所涉 URL 的 robots.txt 與 terms of service 限制隨時間的變化。結論是限制在近年快速增加：robots.txt 的完全限制比例在 2023 年之前大致平穩，但到 2023 年中暴增到接近 50%；terms of service 方面，2016 年幾乎沒有網站設限，但現在多數網站都有條款，且多數條款明文禁止用於 AI。這代表雖然技術上 2020 年就能爬下整個網路，但「合法可爬」的網路範圍已經明顯縮小。

### 4. Crawling 也有社會與工程代價

即使不談著作權，crawling 本身也會製造問題：講者提到有網站抱怨 Anthropic 一天內對其伺服器發出百萬次請求，Read the Docs 也曾被爬蟲打爆。這種違反 ToS 或 robots.txt、或單純造成伺服器負載暴增、影響其他使用者的問題，是先於著作權爭議就存在的實務麻煩。

### 5. Shadow libraries：完全無視著作權的資料來源

Libgen、Anna's Archive 這類 shadow library 完全無視著作權與付費牆，把大量書籍、論文免費釋出。這類服務屢遭下架令與訴訟，但透過設在其他國家的伺服器規避封鎖。支持者認為這是「讓本該自由的內容變自由」，但從法律角度，這就是盜版與侵權。這個話題會在後面 Books3 相關討論中再次出現。

### 6. 著作權法的基本框架

講者切入智慧財產權法：其精神是「incentivize the creation of intellectual goods」，而非單純對一切說不。IP 涵蓋 copyright、patent、trademark、trade secret，對語言模型資料最相關的是著作權法。美國 1976 年 Copyright Act 定義了現代著作權的核心：保護「原創性作品且固定在有形媒介中的表達」。

重要細節：

- 並非所有東西都可著作權。單純的收集（例如電話簿）若無創意編排方式，不具著作權；著作權保護的是表達（expression）而非概念（idea）——你不能對 quicksort 演算法本身主張著作權，但可以對某個具體實作主張。
- 1976 年後，著作權門檻大幅降低：不再需要「發表」，只需要「固定」下來即可，也不需要登記。相較之下 patent 需要付費申請。著作權登記費用僅約 65 美元（若要提告才需要登記），比律師費低得多。
- 著作權保護期限為 75 年（講者口頭數字），期滿後作品進入公共領域（public domain），任何人可自由使用。

### 7. 著作權下可以合法使用資料的兩條路：授權與合理使用

既然網路上幾乎所有內容都受著作權保護，訓練是否等同侵權？講者說明並非如此，可透過兩條路徑：

**(A) 授權（License）**：授權人（licensor）授予被授權人（licensee）使用權，本質上是「不告你」的契約。Creative Commons（2001 年成立）是重要案例：讓創作者可以主動宣告作品可自由散布，效果類似公共領域但不需等 75 年，例子包括 Wikipedia、OpenCourseWare、Khan Academy。若非 CC 或公共領域，也可以付費取得商業授權——這也是為何有許多「模型開發商與內容平台之間的資料授權交易」。

**(B) 合理使用（Fair Use，Copyright Act §107）**：即使沒有授權，也可能主張合理使用，由四個因素綜合判斷（非硬性規則，而是法院權衡的傾向）：

1. 使用的目的與性質：教育用途比商業營利更容易被判定為 fair use；轉化性使用（transformative）比單純重新發布原封不動的內容更容易被接受。
2. 原作品的性質：事實性內容（factual）比虛構創作（fictional）更容易被判定為 fair use（例如寫二戰史實摘要，比起改寫一首很有創意的詩，保護力道較弱）。
3. 使用的量與實質性：只取一小段比整份都拿更有利。
4. 對原作品市場的影響：若替代品降低了原作者的獲利能力，較可能被判定不屬於合理使用；若是轉化到新市場、做別的事情，則較有利。

講者舉例：看電影寫影評、重新實作某個 idea（而非照抄程式碼）都屬合理使用範例；Authors Guild v. Google（Google Books 摘錄片段的訴訟，歷時 11 年，最終判給 Google）為後續討論語言模型訓練是否為 fair use 建立了部分先例。

講者特別澄清一個對 ML 圈很重要的誤解：著作權侵犯不等於「逐字記憶（verbatim memorization）」。情節與角色本身也可受著作權保護（例如 Harry Potter 這個角色，而非某本具體書），因此著作權判斷更多關乎語意與經濟影響，而不是 n-gram overlap。戲仿（parody）則是例外，即使明顯是衍生作品，因為帶有嘲諷性質，反而更可能被認定為合理使用。

### 8. 對語言模型訓練的具體推論與司法現況

講者整理對 LM 訓練的推論：單純複製資料（即使不訓練）本身可能已構成侵權（因為 "copyright" 字面就是複製的權利）；訓練模型直觀上帶有轉化性質（transformative），因為模型是把資料當成學習世界知識的手段，而非只是重新託管原始表達；但無論如何，語言模型的存在確實可能影響原作品市場，這正對應合理使用第四項因素，可能使某些用途被判為不利。此外，即使符合合理使用或有授權，terms of service 仍可能單獨禁止下載行為本身（例如 YouTube 影片本身有授权可看，但 ToS 禁止用 bot 批量下載）。

具體案例（依逐字稿口頭描述，未核對判決原文）：

- New York Times v. OpenAI（2023 起訴）：指控訓練用了 NYT 文章，並提供 ChatGPT 幾乎逐字生成新聞文章的證據；本講提到時仍在審理中。
- Anthropic 訴訟：指控盜版數百萬本書訓練 Claude。去年（相對本講時點）有一項具有里程碑意義的判決：這種訓練行為本身被判定為合理使用，但盜版行為本身仍是違法的——這與訓練與否無關，單純盜版事實即違法。Anthropic 隨後買了大量實體書、拆裝訂掃描做「自用數位化」，這部分被判合理使用；但這不能免除先前盜版的責任。最終和解金額為 15 億美元，約合每本書 3000 美元。
- Meta 訴訟：指控訓練用了盜版書籍（如 Llama 論文中揭露的資料）。判決發生在 Anthropic 案之後，結論同樣是訓練行為屬合理使用；但另有 torrent 下載書籍部分仍在審理中，講者推測若依循先例，這部分對 Meta 也不利。

整體結論（截至本講時點）：訓練行為本身傾向被視為合理使用（或至少未被判定為非合理使用），但這些判決範圍狹窄，不代表任何內容的任何訓練都自動合法；盜版取得資料本身始終是違法行為，與訓練與否無關。這仍是持續演變中的法律領域。

### 9. Common Crawl：最主要的公共 web crawl 來源

多數模型開發商會自建 crawler 以掌握資料全過程，但若不想自建，Common Crawl 自 2007 年起每月釋出一次網路爬蟲結果，每次約 3 到 5 億頁面（原文講者唸為 3 到 5 billion，隨後自己也質疑這個數字偏大），累積約 3000 億頁（來自其官網數字，講者對此表示存疑，因為若乘以爬取次數並不精確吻合）。URL 總量難以估計，Google 搜尋索引號稱至少 100 petabytes；每次 Common Crawl dump 約 2 億頁、約 372 TB（不含圖片，主要是文字）。

Crawling 概念上是圖走訪：從一組 URL 出發，下載頁面、抽取超連結、加入佇列，通常跨多台機器平行執行。實務細節包括：要遵守 robots.txt、避免壓垮伺服器、對常變動頁面制定重新爬取政策、處理同一 URL 內容依狀態不同（動態內容）以及多個 URL 對應同一內容（鏡像站）造成的重複問題。

Common Crawl 釋出兩種格式：WARC（原始 HTTP response）與經過處理、但屬於 lossy 轉換的 WAT。講者指出 HTML 轉文字的方式很重要，會顯著影響下游品質——DataComp-LM 論文的 ablation 顯示 Trafilatura 與 resiliparse（逐字稿轉寫為 "Brazilia Parser"）等工具比 Common Crawl 官方 WAT 轉換效果更好。

### 10. 三個高品質內容源：Wikipedia、GitHub、arXiv

一般 web crawl 並非均勻分布，某些「口袋」內容特別優質：

- **Wikipedia**：2001 年創立，現有 6700 萬篇各語言條目。內容要求可引用來源（不能有原創思想），但由於可引用書籍等難以取得的資料，仍可能包含不在網路上其他地方出現的內容。文章需符合 notability（並非人人都能有條目）。任何人都能編輯，是 wiki 模式的激進之處，破壞內容多半被管理員或機器人回退；如同多數 peer production 系統，少數編輯者貢獻大部分工作量（例子：某人有 500 萬次編輯）。Wikipedia 定期（每幾週）釋出完整 dump（tar 檔），不需要爬取,官方也不希望被爬。講者提到 Carlini 等人的研究：因為 dump 是週期性的，攻擊者可以在 dump 前精準編輯注入惡意內容，等 dump 完成後再讓編輯被回退，dump 裡卻已永久保留惡意內容；已有研究展示可藉此讓模型對特定觸發詞（例如 "iPhone"）產生負面情緒偏見。教訓：即使是「高品質」內容，考慮到對抗者存在，仍可能夾帶壞內容（講者提到此漏洞此後應已修補）。
- **GitHub**：2008 年成立（與 Common Crawl 同年代），有 4.2 億個 repository，2800 萬公開。每個 repo 包含 commit history、issue、PR、留言等（不只是檔案）。程式碼有大量重複（複製或 fork 造成）。GitHub 官方允許訓練任何具有寬鬆授權（MIT、Apache）的公開 repo；資料有兩種：repository 內容本身（應透過 Git protocol 下載而非爬取）與 metadata（透過 GitHub Archive 取得逐時事件流，記錄每個留言、star、動作）。Software Heritage Foundation 專注彙整 repository（不含 metadata），也涵蓋 GitLab、Bitbucket 等其他平台。
- **arXiv**：1991 年起提供論文分享，最初是物理，現涵蓋多領域，累積 300 萬篇投稿，每篇含 metadata、PDF、可選的 LaTeX 原始碼。訓練 arXiv 資料需要決定用 PDF 轉文字還是 LaTeX 原始碼。arXiv 沒有同儕審查，但有審核流程；作者可選擇保留版權或採用 Creative Commons；metadata 本身為寬鬆授權可任意使用，論文本身則需篩選出 CC 授權的部分（講者提到多數 arXiv 論文是 CC 授權）。同樣不需爬取，直接批量下載。

### 11. 歷史時間軸：資料集設計選擇的演變（2018-2024+）

講者從 2018 年 BERT 開始，依時間序檢視代表性資料集，呈現「filtering 方法論」如何演變：

- **BERT（2018）**：訓練於 Wikipedia + BooksCorpus。BooksCorpus 源自 Smashwords（一個讓任何人發布電子書的網站，2024 年已有約 5000 萬本書），2015 年有論文只抓取其中免費的書籍做成語料。這是「無人在意這些問題」的年代；後來 BooksCorpus 因違反 Smashwords 的 ToS 而被下架——免費可取得不代表法律上被允許使用。BERT 的另一特點是以「文件」而非「句子」為訓練序列單位，這與之前語言建模研究聚焦句子不同。
- **GPT-2（2019）／WebText**：Common Crawl 太雜亂，因此改用「Reddit 貼文中 karma 大於 3 的外連結頁面」作為品質代理指標（好貼文應該連到好網站），得到 4000 萬頁、40GB 文字。OpenAI 未釋出這份資料，但社群做出開放復現版 WebText。
- **CCNet（Facebook，時間點約在 GPT-2 前後）**：目標是為多語言（尤其低資源語言）建立大規模高品質語料，不依賴僅適用英文的人工流程。做法包含去重、語言辨識（訓練分類器辨識語言並保留目標語言），品質過濾則用「訓練一個以 Wikipedia 為語料的語言模型，用該模型對新文件評分機率，越像 Wikipedia 分數越高」，取代 GPT-2 的 Reddit 外連結法。CCNet 這個工具後續在其他論文中反覆出現。
- **C4（Google，2019）**：來自推動 text-to-text 框架的 T5 論文，但 C4 資料集本身是很大的貢獻。核心觀察：Common Crawl 對自然語言任務大多沒用，直接訓練會得到垃圾結果。C4 採用「一堆規則」做過濾：保留以標點結尾且超過 5 個字的行；移除少於 3 句的頁面；移除含不雅詞彙的頁面；移除服務條款樣板文字；移除含大括號的內容（意外過濾掉大量程式碼，顯示當時未考慮 code model）；只保留英文。最終得到 1560 億 tokens、800GB 文字，遠大於 WebText 的 40GB。後續分析顯示 C4 中 Wikipedia、patents 等站點占比很高；他們也複製了 WebText 的 Reddit-karma-outlink 方法，用 12 次 Common Crawl dump 只得到 17GB（遠小於原始 WebText 的 40GB），顯示 Common Crawl 本身未必完整涵蓋所有內容。
- **GPT-3（2020）**：資料包含經內部處理的 Common Crawl、擴充版 WebText、神秘的 "Books1" 與 "Books2"（逐字稿稱其成因不明，是網路書籍語料庫的謎團）、以及 Wikipedia。最終約 500GB、4000 億 tokens。處理方式：訓練一個品質分類器區分「高品質」與其餘內容，並做 fuzzy deduplication（因 WebText 與 Common Crawl 有重疊）。這篇論文推廣了「用分類器做品質篩選」的做法。
- **The Pile（EleutherAI，GPT-3 之後的開源運動之一）**：草根、社群 Discord 共同討論出的高品質來源清單，至今仍相當多樣：Common Crawl、PubMed、Books3、arXiv、GitHub、Wikipedia、IRC 對話記錄、另一個書籍語料庫、哲學論文等。其中包含 Enron 郵件資料集（2002 年安隆破產後郵件被公開釋出，是少數可得的 email 語料，分布很特殊）。
- **書籍語料細節**：Project Gutenberg（始於 1971 年，僅收錄取得著作權清理／多為公共領域的書籍）有一個打包版本 PG-19（指 2019 年之前的 Gutenberg 書籍，因為要進入公共領域需等 75 年，因此多數書籍符合）。Books3（出現在 the Pile 中）被描述為來自名為 Bibliotik 的 shadow library 的 20 萬本書，涵蓋各類暢銷作者作品；2020 年當時無人關注，後來被下架，講者強調現在不可再使用或不應使用 Books3；此議題會在 Llama 1 段落再次出現。
- **Stack Exchange**：自 2008 年起的使用者問答內容。特點是天然的 Q&A 格式，接近真正的下游應用（不像 Wikipedia 那樣是原始敘述文），可能幫助模型學習問答行為——並非所有能力都是「神奇湧現」，而是網路上本就存在這類近似 supervised 的資料。附帶投票數等 metadata 可用於過濾，且以資料轉存方式提供，不需爬取。
- **Gopher / MassiveWeb（DeepMind，2021）**：Gopher 模型本身未釋出，後被 Chinchilla 取代，但其資料處理描述十分詳盡值得參考（除了不透露具體資料內容之外）。他們建立 MassiveWeb，並結合 C4、書籍、新聞、GitHub、Wikipedia（未說明如何取得後幾項）。MassiveWeb 本身：保留英文、去重，品質過濾採用人工規則（而非分類器），原因是規則帶來更多可控性。這裡呈現出一個路線分歧：偏好規則 vs. 偏好分類器兩派。他們得到「massive」規模資料，但實際訓練只用了其中一小部分。
- **Llama 1（2022）**：這是少數詳述資料處理的（相對）閉源前夕模型之一。使用 CCNet 處理過的 Common Crawl，但品質分類是「頁面是否被 Wikipedia 引用（reference）」而非「頁面本身是否為 Wikipedia 條目」——理由是 Wikipedia 條目本身文體可能過於特定風格化，而 Wikipedia 引用的外部頁面通常也是優質網站。另外使用 C4、經處理僅保留寬鬆授權的 GitHub、Wikipedia、Books3、Project Gutenberg（Books3 讓 Llama 論文惹上大麻煩，因為公開承認訓練用了它，而追溯回去發現源頭是 the Pile，再追溯是 shadow library——這也是後來大家不再公開資料細節的原因之一）、以及用 LaTeX 原始碼處理的 arXiv、Stack Exchange。最終得到 1.2 兆 tokens；Meta 未釋出此資料集，但描述夠詳細，讓 Together 的 RedPajama v1 得以複現。RedPajama v1 一開始也包含 Books3，後來被移除——顯示早期關於著作權的決策，對後續資料集有很大的連鎖影響（講者稱之為 "watershed"）。
- **RefinedWeb**：核心主張是「web data is all you need」——與其拼湊各種專門來源（GitHub、arXiv、Stack Exchange），不如就用網路本身。做法：仔細處理 HTML 轉文字、用 Gopher 規則過濾（保留看起來像英文的內容）、明確表示避免 ML-based filtering 以避免引入偏差（希望不要找出過窄的網路子集）、做去重，最終得到 5 兆 tokens，釋出約 6000 億。
- **FineWeb（Hugging Face）**：是 RefinedWeb 的復現並加以改進：使用當時所有 Common Crawl dump，同樣以人工規則過濾（同樣為了避免引入偏差）、去重、做 PII 移除，最終得到 15 兆 tokens——資料集規模持續快速成長。
- **Dolma（AI2）**：包含自己處理的 Common Crawl、the Stack（程式碼）、C4，以及其他來源。其中 Reddit 資料來自 PushShift 這個專案（當時仍可取得，之後就被鎖住）。AI2 也有自己對學術論文的爬蟲（Semantic Scholar），衍生出對應資料集。Common Crawl 處理流程：使用 model-based 語言辨識，但品質過濾仍避免 model-based（傾向規則）；毒性移除則結合規則與分類器。最終得到 3 兆 tokens。
- **DCLM（DataComp-LM）**：講者認為這是「model-based 品質過濾」真正成為主流做法的轉折點。DCLM 最初動機是建立一個標準化 pipeline，讓大家可以在同一套架構下比較不同資料處理方法，但實務上大家主要拿其釋出的資料集直接訓練模型。流程：先把 Common Crawl 處理成完全未過濾的 DataComp Pool（240 兆 tokens，規模超過大多數人實際會訓練的量，但品質偏低）；接著限定英文、套用一些規則做初步窄化、去重，再套用 model-based 過濾，最終只剩 1.4% 的資料（3.8 兆 tokens 左右的相關數字出現在後續 negative examples 描述中）。品質分類器訓練方式相當「奇特但有效」：正樣本用 OpenHermes（由 GPT-4 生成的 instruction 資料）與 ELI5（一個問答為主的 subreddit）；負樣本用 RefinedWeb（近乎未過濾的網路資料，代表「一般網路」）。訓練一個 fastText 線性分類器，結果這個分類器打敗了他們嘗試過的其他方法。DCLM 一度成為開放社群品質過濾的黃金標準。
- **Nemotron-CC（NVIDIA）**：主張 DCLM 過濾太激進，丟掉太多資料（DCLM 只剩 3.8 兆 tokens），因此需要更多 token。做法更精緻：一是提示既有語言模型判斷網頁是否具「教育價值（educational value）」，產生標籤後訓練 fastText 分類器；二是沿用 DCLM 分類器；三是引入大量 synthetic data——這可能是率先真正重度使用 synthetic data 做 pre-training 的資料集之一。對於被分類器判為低品質的資料，用語言模型「改寫（rephrase）」使其更像 Wikipedia 風格；對於高品質資料，用語言模型生成各種衍生任務（例如給一篇 Wikipedia 文章，生成問答對、摘要請求、關鍵資訊抽取等）。最終得到 6 兆 tokens，遠大於 DCLM。作為量級參照，講者提到 Llama 3 訓練了 15 兆 tokens、Qwen 3 訓練了 36 兆 tokens（但講者提醒，論文中的 token 數不一定是唯一 token 數，因為多 epoch 訓練會讓計數翻倍，需謹慎解讀這些數字）。Nemotron-CC 的高品質子集在比較中優於先前資料集。

講者在歷史回顧結束時總結：這些方法看起來都遵循類似框架——拿一個 web crawl，決定要用規則過濾還是用模型過濾；若用模型，要決定「什麼算好資料」再訓練分類器篩選。存在明顯的資料量與品質 tradeoff：可以留 240 兆 tokens 但品質很低，也可以留 1 兆多 tokens 但品質較高，中間有個 sweet spot。

### 12. 程式碼資料集：The Stack / Stack v2

The Stack 是專門建構高品質程式碼資料集的專案，2022 年開始（因為當時已明顯看出程式碼對模型很重要）。初版：clone 1.37 億個新 repo，只保留具寬鬆授權（permissive license）的部分，移除近似重複，得到 3TB 程式碼。

2024 年更新版（Stack v2）更進一步：

- 除了程式碼本身，也納入 GitHub metadata（issue、留言、PR），並取用 Software Heritage 的 repository 彙整資料。
- 額外爬取各專案文件網站的說明文件（documentation）。
- 大量清理工程：移除 binary 檔案、移除 malware；GitHub 上大量 PR 其實是機器人產生，需要過濾；做去重、PII 移除；因為 PR 數量龐大，做 subsample 讓資料集規模可控且具代表性。
- 低資源程式語言處理法：像 Nim 這種冷門語言資料稀少。做法是把該語言程式碼編譯成低階中介語言 LLVM IR（就像 C 編譯器都能編譯到這個中介表示），把低資源語言原始碼與其 LLVM IR 並列，讓模型能學到「低資源語言」與「資料充足的共享低階表示」之間的映射關係。
- PR 與其 metadata 本質上不是線性序列，需要決定如何線性化（linearize），例如一次 diff 事件可能只改一行，但要提供多少上下文（附近幾行、還是整個檔案）是需要決定的設計選擇。最終訓練用的 token 形式類似 XML 結構化資料：PR 本體、一連串 diff、留言事件（何時貼留言、當時 review 狀態等）。這代表模型學到的不只是「怎麼生成程式碼」，還包括軟體開發流程本身。

### 13. Common Pile：只用寬鬆授權資料能走多遠

回顧幾乎所有網路資料都受著作權保護，即使可訴諸 fair use 訓練，這法律問題仍未完全塵埃落定。若採取極度風險趨避（risk-averse）態度——「不確定就當作不行」——那就是 Common Pile 這個專案的立場：只用具備明確寬鬆授權（permissive license）或公共領域的資料，測試能把模型做到多好。

Common Pile 收錄的來源包括 Stack v2 程式碼、大量政府會議紀錄（意外地屬於寬鬆授權）、wiki、部分網路內容、部分寬鬆授權的新聞網站、學術論文、線上論壇、公共領域內容、教育資源等，最終得到 8TB 資料——對「純寬鬆授權」資料而言是相當可觀的量。

講者強調這個專案比表面看起來困難很多，並非「看授權標籤是 Apache/CC 就算過關」，存在幾個細節陷阱：

- **License laundering（授權洗白）**：人們在使用授權標籤上其實很隨便，可能把有著作權的作品直接貼上 CC BY 標籤（任何人都能在網路上這樣寫），難以辨別真偽。
- **Collection license 不會下放到個別作品**：例如 Dolma 這個「collection」本身可能被標為寬鬆授權，但 collection 授權不會自動延伸到其內含的每一份個別作品；許多 Hugging Face 上標示寬鬆授權的資料集，深入檢查後個別層級其實並非真的寬鬆授權。
- Common Pile 也選擇完全不使用 synthetic data，理由是「用未經授權資料訓練出的模型所生成的 synthetic data，其授權狀態本身也不清楚」。講者話鋒一轉指出一個潛在矛盾：許多開放權重模型（MIT license）本身其實可能是用未授權資料訓練出來的，若真要誠實面對，這其實也算某種「資料洗白（data laundering）」。

最終在多個 benchmark 上與 Llama 1、MPT、Qwen 等模型比較：結果不差，但顯著不如 Qwen 系列模型，優於較舊的模型世代（約 2023 年）。講者的結論是：只靠寬鬆授權資料可以做到「還可以」，但要在不增加更多 tokens 的前提下真正競爭仍相當困難；他認為這不是定論，若持續努力，寬鬆授權資料應該還能再擠出更多可用內容。

## 重要細節

### 定義

- Crawler：從種子 URL 出發、透過超連結圖走訪發現並下載頁面的程式。
- robots.txt：置於網站根目錄、宣告哪些爬蟲／路徑可爬的檔案，屬於自律規範而非法律強制。
- Copyright（著作權）：保護「原創性作品且固定在有形媒介中的表達」，門檻極低（固定即受保護，不需登記或發表）。
- Fair use（合理使用）：Copyright Act §107，即使無授權，也可能因四項因素被判定為合法使用。
- License（授權）：授權人授予被授權人特定使用權的契約性文件；Creative Commons 是常見的開放授權類型。
- Shadow library：無視著作權、提供盜版書籍/論文的網站，例如 Libgen、Anna's Archive。
- WARC / WAT：Common Crawl 釋出格式，前者是原始 HTTP response，後者是（有損）處理過的版本。
- Quality classifier：用來判斷文件是否「高品質」以決定是否納入訓練集的分類器（如 fastText 線性分類器）。
- License laundering：把著作權作品貼上不實或未經授權的寬鬆授權標籤的行為。
- Collection license：適用於整批彙編資料集的授權聲明，不必然適用於其內個別作品。

### 公式／量化描述

- 著作權保護期：約 75 年（講者口頭數字），期滿進入公共領域。
- 著作權登記費用：約 65 美元。
- Common Crawl 規模：每次約 2 億頁、約 372 TB；累計號稱約 3000 億頁（講者對此數字存疑）。
- 資料集規模成長趨勢（tokens）：WebText 40GB → C4 800GB/1560 億 tokens → GPT-3 約 500GB/4000 億 tokens → Llama 1 /RedPajama v1 1.2 兆 tokens → RefinedWeb 5 兆（釋出 6000 億）→ FineWeb 15 兆 → DataComp Pool 240 兆（未過濾）→ DCLM 過濾後約 3.8 兆 → Nemotron-CC 6 兆 → Llama 3 15 兆 → Qwen 3 36 兆。
- Common Pile 最終規模：8 TB 寬鬆授權資料。
- Anthropic 和解金額：15 億美元，約每本書 3000 美元。

### 演算法／流程

- Crawling 的圖走訪流程：初始化 URL queue → pop URL → 下載 → 抽取超連結 → 加入 queue → 平行化跨機器執行，並遵守 robots.txt、避免過度請求。
- CCNet 流程：語言辨識分類器過濾語言 → 去重 → 用 Wikipedia 語言模型對文件評分，篩選「像 Wikipedia」的內容。
- C4 規則過濾：保留標點結尾且逾 5 詞的行 → 移除少於 3 句頁面 → 移除含不雅字詞頁面 → 移除服務條款樣板 → 移除含大括號內容（誤刪程式碼）→ 僅保留英文。
- DCLM 品質分類器訓練：正樣本 = OpenHermes + ELI5，負樣本 = RefinedWeb，訓練 fastText 線性分類器，對 Common Crawl 全量文件評分篩選。
- Nemotron-CC 流程：以 LM 判斷 "educational value" 產生標籤 → 訓練 fastText 分類器；另沿用 DCLM 分類器；低品質資料用 LM 改寫成 Wikipedia 風格；高品質資料用 LM 生成衍生任務（QA、摘要、關鍵資訊抽取）。
- The Stack v2 低資源語言處理：把低資源語言程式碼編譯成 LLVM IR，將原始碼與 IR 並列供模型學習跨語言映射。
- Fair use 四要素判斷：使用目的與性質、原作性質、使用量與實質性、對原市場的影響。

### 工程限制

- 網路上「合法可爬」的範圍持續縮小（robots.txt 與 ToS 限制近年大增）。
- HTML 轉文字的工具選擇會顯著影響下游資料品質（Trafilatura／resiliparse 優於 Common Crawl 官方 WAT）。
- Common Crawl 未必涵蓋所有網頁內容（C4 用同方法只從 12 次 dump 得到 17GB，遠少於原始 WebText 40GB）。
- 著作權登記與訴訟門檻懸殊：登記便宜，但打官司代價高昂。
- Collection-level license 不能直接當作每個成員作品都已被授權的證據。
- Synthetic data 的授權地位不明朗（尤其若生成模型本身訓練資料授權不清）。

### 講者例子

- 10,000 張 B200 假設情境未出現在本講（該例子屬於 Lecture 9 scaling laws），本講改用 Llama 3 report 只寫「we train from a variety of data sources」作為資料不透明的例子。
- Enron 郵件資料集：安隆破產後郵件被公開，成為少數可用的 email 語料，但分布特殊。
- Carlini 對 Wikipedia dump 週期性投毒攻擊：在 dump 前編輯注入惡意內容，讓內容在回退前被固化進 dump。
- Books3 從 the Pile 進入 Llama 1、又進入 RedPajama v1，後續因著作權爭議被移除，展示早期資料決策的連鎖影響。
- GitHub 低資源語言 Nim 與 LLVM IR 並列學習的例子。

### 問答重點

- 學生問 ElevenLabs 的 voice dating：講者表示不熟悉此話題，建議私下討論（與本講主線無關）。
- 學生問授權變更後的處理：講者表示（非法律意見）先前已下載的版本仍可能可訓練，但授權變更後新增的內容（例如 Reddit 持續產生的新內容）將不能再訓練。
- 學生問是否可用其他 crawler（如 "Open or crawl"）以及如何確保 crawl 不含盜版書籍網站：講者坦承這正是困難所在——你無法逐一檢查所有網站，Common Crawl 中很可能混有不應訓練的著作權書籍/內容，只能訴諸 fair use；若真的想嚴謹處理，後面會展示的做法就是類似 Common Pile 的「只用確定授權資料」路線。
- 學生問模型生成的合成資料是否有使用限制：講者簡短回答「大概可以」，並表示會在後續（下一講）詳談。

## 從零實作語言模型的意義

1. From-scratch 訓練不能假設資料「從天而降」；必須理解資料從公開網路到可訓練語料的完整鏈條：crawl → HTML 轉文字 → 語言辨識 → 品質過濾 → 去重 → （可能）授權篩選。
2. 過濾策略（規則 vs. 分類器）本身是一個需要被實驗與 sweep 的設計選擇，而不是外部給定的固定步驟；DCLM、Nemotron-CC 等案例顯示「品質」本身要靠代理指標（Wikipedia-likeness、教育價值、Wikipedia 引用關係等）操作化。
3. 資料規模與品質之間存在明顯 tradeoff（240 兆 tokens 未過濾 vs. 幾兆 tokens 高品質），實作時需要有意識地選擇落點，而非單純追求最大 token 數。
4. 著作權與授權不是法務部門獨立處理的旁支問題，而是會直接決定「哪些資料能進 pipeline」的工程限制；Books3 案例顯示早期草率的資料決策會在模型公開後造成長期後果。
5. 專門資料源（Wikipedia、GitHub、arXiv、Stack Exchange）的下載方式應該用官方 dump/API，而不是用一般爬蟲——這既是工程上更可靠的做法，也是被要求的行為規範。

## 書稿章節草稿

（實際書稿章節見 `docs/cs336-language-modeling/13-data-sources-datasets.md`，此處不重複展開全文，避免筆記與正式書稿內容重複維護。書稿依 chapter-template 分節：導讀、核心內容（分數個子節）、工程取捨、常見誤解、小結、相關作業與材料。）

## 跨章連結

- Lecture 1 Overview/Tokenization：pre-training 資料是 tokenizer 訓練與模型輸入分佈的源頭；本講「Common Crawl 太雜亂」的觀察，正是為何早期需要精心設計的 filtering pipeline。
- Lecture 9/11 Scaling Laws：本講提到的資料規模成長（40GB 到 36 兆 tokens）與資料重複、資料混比問題，直接呼應 scaling laws 中討論的 data scaling、data mixture 對 intercept 的影響；Common Crawl 資料量上限也牽動 data-constrained training 的討論。
- Lecture 12 Evaluation：本講「perplexity 好不代表下游好」的類比議題（upstream vs downstream）雖未在本講重複展開，但資料品質分類器的訓練目標本身，就隱含著「用什麼下游代理指標定義品質」的問題，與評估章節相連。
- Lecture 14 Data: filtering, deduplication, mixing, synthetic data：本講明確預告下一講會接續談 post-training data，以及更多 filtering 細節；本講的分類器式過濾（DCLM、Nemotron-CC）、去重提及但未展開的技術細節、以及 synthetic data 的授權問題，都會在下一講深入。
- Assignment 4 Data：逐字稿結尾直接點名學生做 Assignment 4 時可以思考「資料處理是否有更好的做法」，暗示現行方法（規則、分類器）仍主要依賴經驗與 vibes，有研究空間。本筆記未讀 assignment repo，不展開細節。

## 相關作業與材料

此段只建立關聯，不提供作業解答。

- Course material：`data/cs336/lectures material/lecture_13.py` 已下載，待材料階段閱讀。
- Trace：`data/cs336/lectures material/var/traces/lecture_13.json` 已下載，待材料階段閱讀。
- Assignment 關聯：Assignment 4（Data），已下載於 `data/cs336/code/assignment4-data-main/`，待材料階段閱讀；逐字稿結尾提示 Assignment 4 與「如何更好地做資料處理」直接相關，但本筆記不展開作業細節。
- 本地材料路徑：如上。
- 材料狀態：待材料階段閱讀（code、trace、assignment repo 均已下載但未讀）。
- 缺少的材料或 URL：Lecture 13 若有對應投影片/PDF，逐字稿中未提及檔名，狀態待查；本講引用的多篇論文（Consent in Crisis、CCNet、C4、GPT-3、the Pile、Gopher、Llama 1、RefinedWeb、FineWeb、Dolma、DCLM、Nemotron-CC、the Stack/Stack v2、Common Pile）僅依講者口頭描述整理，原始論文與確切數據待材料階段或使用者提供連結核對。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Lecture 13 是否有對應投影片/PDF | 課程官網或使用者提供 | 待補；材料計畫僅列出 `lecture_13.py` |
| Common Crawl 累積頁數「3000 億」是否為官方最新數字 | Common Crawl 官網 | 待查核，逐字稿中講者本人也對此數字表示存疑 |
| Consent in Crisis 論文作者姓名（逐字稿轉寫為 "Shane Lampray"，疑為 Shane Longpre 之 ASR 誤轉） | 原始論文 | 待材料階段或使用者確認正確拼寫，本筆記保留逐字稿原始轉寫並註記存疑 |
| Books1/Books2（GPT-3）確切內容 | GPT-3 論文原文或後續分析文章 | 逐字稿本身稱其為「謎團」，不外查，待補 |
| NYT v. OpenAI、Anthropic 訴訟、Meta 訴訟的判決全文與確切日期 | 官方判決書或可信新聞來源 | 逐字稿僅提供講者口頭摘要與大致時間點，不外查完整判決內容，待補 |
| DCLM、Nemotron-CC、the Stack v2、Common Pile 等資料集的確切 token 數與 benchmark 數字 | 原始論文 | 逐字稿提供的數字已記錄，但未核對原始論文精確數值，待材料階段核對 |
| Lecture 13 PDF/investor slides 中可能有的圖表（例如 Consent in Crisis 圖、DataComp pipeline 圖） | 課程材料或使用者提供 | 待材料階段閱讀後補圖說明 |

## 暫不處理的外部補充

- 不外查 Consent in Crisis 論文原文。
- 不外查 NYT v. OpenAI、Anthropic、Meta 相關訴訟的判決書或新聞報導細節。
- 不外查 CCNet、C4、GPT-3、the Pile、Gopher、Llama 1、RefinedWeb、FineWeb、Dolma、DCLM、Nemotron-CC、the Stack/Stack v2、Common Pile 等論文原文。
- 不外查 Creative Commons、Copyright Act 1976 之法律原文或官方說明。
- 不外查 Software Heritage Foundation、PushShift、Semantic Scholar 等專案官網細節。

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-03 | 建立 | 完整閱讀 Lecture 13 逐字稿（第 1-2132 行），產出閱讀筆記 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`13 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 13： Data (Sources, Datasets).en.txt`
- 逐字稿總行數：2132
- 新增或修改檔案：`docs/cs336-language-modeling/notes/lecture-13-data-sources-datasets.md`、`docs/cs336-language-modeling/13-data-sources-datasets.md`
- 本講核心概念：見上方「核心概念」13 條
- 需要主控 agent 複查的點：見「資訊不足與待補清單」
- 缺少的材料或需要使用者提供的 URL：見「資訊不足與待補清單」與「相關作業與材料」
- 是否使用外部資料：否。
