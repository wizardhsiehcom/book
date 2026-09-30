# 02｜平台說法怎麼查：方向、證據與推論邊界

> 承接 [C01｜讀者與目標](01-reader-and-goal.md)，本章建立檢查平台說法的方法，供 [C04｜發文模式](04-post-patterns.md)、[C06｜媒介與發布](06-format-and-publishing.md) 和 [C09｜衡量與修正](09-measure-and-learn.md) 使用。查核日期：2026-09-30。

LinkedIn 的推薦系統會變，創作者文章和第三方報告也常把「觀察到的差異」說成「演算法偏好」。讀到「文件輪播一定觸及高」「留言越快越容易爆」時，先問：誰提出這個說法？談的是個人帳號還是公司專頁？測到的是觸及、曝光、互動還是點擊？有沒有比較組？

本章的交付物是一張**主張查核卡**：每次準備引用平台規則或成效數字時，填來源、對象、指標、觀察期間、能支持的主張，以及不能推論的部分。它讓你能寫出可信的工程觀察，也能在資料不夠時保留「我還不知道」。

## LinkedIn 公開了什麼推薦方向

LinkedIn 於 2026-03-12 說明，Feed 正逐步推出以大型序列推薦模型及大型語言模型輔助的更新，用來理解貼文主題與會員專業興趣如何隨時間變化。公告提到會員選擇提供的產業、技能、經驗、地區資訊，以及長期互動；同時表示會減少重複、低實質內容與互動誘餌。新會員的興趣選擇仍處於測試狀態。這是截至公告日的官方方向，不代表每個帳號、地區都已看到相同版本。[LinkedIn Feed 更新公告，LinkedIn Corporate Communications Team，2026-03-12](https://news.linkedin.com/2026/ImprovingTheFeed)

工程團隊進一步描述候選內容來源包含人脈、追蹤對象及更廣的 LinkedIn 專業圖譜；排序會參考會員檔案與一段時間內的閱讀、按讚、留言、回看或略過等行為。這裡的 **out-of-network** 是「人脈網絡之外的推薦」：可能來自你未連結或未追蹤、但與你專業興趣相關的 LinkedIn 會員，不是「LinkedIn 平台之外」。同一篇工程文也列出貼文格式、作者資訊、互動數和本文等資料如何進入內容表示。它沒有公布完整候選池、模型權重、例外規則或每個欄位的因果效果。[工程說明，Hristo Danchev，2026-03-12](https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed)

LinkedIn 在 2026-03-13 另說明會偵測協調式互動群組與自動化留言，並可能降低可疑內容的分發或限制帳號。它明確指向腳本、瀏覽器擴充功能或第三方工具代發留言等行為；這不能被擴大成「所有排程發布都違規」或「有內容的真人留言會受罰」。[真實內容與對話說明，LinkedIn Corporate Communications Team，2026-03-13](https://news.linkedin.com/2026/authentic-content-and-conversations)

作者可採取的穩健方向，是讓專業主題清楚、材料可查、觀點有實際根據，並以有上下文的問題邀請同行補充。這是根據官方目標轉成的寫作選擇，不是排名配方：例如準確整理一次公開影像上的錯分案例，說清資料、方法和限制；不要複製多篇相似的空泛勵志文，也不要以「留言同意」取代內容。官方沒有說只要填滿個人檔案、用某種格式或收到某種互動就一定獲得推薦。

## 四種證據各能回答什麼

| 證據類型 | 最適合回答 | 讀取時要記下 | 不能直接推出 |
|---|---|---|---|
| **LinkedIn Help／產品規則** | 目前支援哪些格式、可見對象、留言控制、指標定義和政策 | 頁面更新日、個人或 Page、實際可見條件 | 某功能會提升觸及；所有帳號都有同一個選項；某欄位是排序權重 |
| **LinkedIn 公告／工程說明** | LinkedIn 自己公開的 Feed 方向、模型構件或政策意圖 | 作者、公告日期、是正在推出、測試中還是已提供 | 全部演算法、固定排名權重、創作者操作的因果效果或觸及保證 |
| **LinkedIn 官方作者建議** | 平台建議如何選題、寫作、互動、使用媒介 | 文章的受眾與用途；建議是否附方法和樣本 | 建議是實驗結論，或任何行業照做都會有同等成效 |
| **第三方報告／作者經驗** | 某批帳號或貼文中觀察到哪些分布或關聯 | 個人／Page、樣本期間、分母、指標、抽樣與資料限制 | LinkedIn 因某操作「降權」；樣本外帳號會複製結果；按讚數等於觸及 |

例如 Socialinsider 的 2026 報告主要觀察公司 Pages；Metricool 的 2026 研究同時含個人檔案與 Pages，並指出兩類帳號的部分結果方向不同。這些資料值得轉成自己的測試假說，但必須維持同一帳號類型、指標和觀察窗再比較。報告頁的格式平均數是樣本內描述，不是 LinkedIn 公布的演算法偏好。[Socialinsider，Elena Cucu，2026-03-16](https://www.socialinsider.io/social-media-benchmarks/linkedin)；[Metricool LinkedIn Study 2026 PDF，作者未標，發布稿日期 2026-04-14](https://metricool.com/wp-content/uploads/Linkedin-Study-2026-EN.pdf)

LinkedIn 自家的作者指南建議從自身專業與讀者問題出發、說明觀點和可用資訊、把段落切短，並善用合適媒介。指南面向人才招募與人才發展專業者；文中關於發文頻率與個人檔案瀏覽的數字沒有交代研究設計。因此可借用它作為寫作檢查表，不能把數字改寫成普遍因果規則。[How to Write an Engaging Post in Your LinkedIn Feed，Jen Dewar，2024-11-26](https://www.linkedin.com/business/talent/blog/talent-acquisition/how-to-write-engaging-post-in-linkedin-feed)

## 做一張主張查核卡

假設你看到「PDF 輪播是 LinkedIn 最容易觸及的格式」。先把句子拆成可檢驗的幾個部分：這是官方說法、作者建議，還是外部樣本結果？「容易觸及」指曝光還是不同會員人數？樣本包括個人檔案還是公司 Page？若來源只比較公開互動，就不能把結果寫成觸及。

| 欄位 | 示範填寫：PDF 輪播比較容易觸及嗎？ |
|---|---|
| 主張原句 | PDF／原生文件貼文的觸及高於其他格式。 |
| 來源類型與日期 | 第三方觀察報告；查該報告發布日期與資料期間。 |
| 研究對象 | 若來源只取 Pages，就標示為 Pages；不套用到個人帳號。 |
| 指標與分母 | 查「觸及」是否為獨立讀者估計；若只報互動率，不能改稱觸及。 |
| 能支持 | 來源樣本中某格式與某指標有描述性差異，值得在相似條件下測試。 |
| 不能推論 | 格式造成差異、LinkedIn 必定偏好文件、所有個人帳號都應做輪播。 |
| 下一步 | 對同一類題目輪替文字／文件，記錄帳號類型、受眾、題材、發布日和相同觀察窗。 |

查核來源時直接開啟報告方法段，不能只看搜尋摘要、社群轉述或一張圖表。若報告全文要登入或付費，明寫「只讀公開摘要」；若作者只分享自己的帳號經驗，就把它當成一個案例，不當成平台規則。對作者自己的 analytics，公開旁觀者通常看不到曝光、觸及或站外點擊，因此公開按讚數不能補成這些數字。

## 個人檔案與公司專頁要分開看

個人檔案承載的是會員本人發言與專業關係；公司 Page 承載的是組織身分、團隊發布和品牌受眾。LinkedIn 的個人單篇分析會列出曝光、觸及會員、網絡內外曝光、帶來的檔案瀏覽／新追蹤、互動與外連點擊等，且官方說明數字是估計值，部分點擊也會計入重複操作。Pages 則有管理員使用的內容、追蹤者、訪客等分析區。兩者的身分、受眾來源、權限與指標入口並不相同。[個人貼文分析，LinkedIn Help，發布日期未知；頁面顯示約 1 個月前更新，精確日期未知](https://www.linkedin.com/help/linkedin/answer/a523040)；[LinkedIn Page analytics，LinkedIn Learning Help，發布日期未知；頁面顯示約 9 個月前更新，精確日期未知](https://www.linkedin.com/help/learning/answer/a547077/linkedin-page-analytics?lang=en)

因此寫作時要明確說「我個人帳號的觀察」或「這份 Page 研究」。不要把公司專頁的互動率當個人帳號基準，也不要用個人貼文分析推算公司頁訪客身份。C09 會進一步練習把曝光、觸及、互動、檔案活動與實際成果分開記錄。

## 本章練習：把傳言改成可查的句子

選一個你最近看到的平台建議，照主張查核卡填滿欄位，再把結論寫成兩句：第一句說明來源實際觀察到什麼；第二句指出它還不能證明什麼。若官方只公布方向，就保留為方向；若外部數據只顯示關聯，就寫成「在該樣本中同時出現」，不寫成「因此」。

完成後，先到 [C03｜素材與題目](03-material-and-topics.md) 從設備與 AI 工作中選一個可公開的具體問題，再帶著查核卡到 C04 決定內容結構、C06 選擇媒介，並在 C09 用自己可取得的帳號數據檢查結果。平台說法會更新；可重複使用的能力，是每次都能分清規則、建議、觀察與推論。

### 本章來源與日期

- [Post and share updates](https://www.linkedin.com/help/linkedin/answer/a527227)｜作者：LinkedIn Help；發布日期未知，頁面顯示約 2 週前更新，精確日期未知。查核：2026-09-30。
- [How LinkedIn Is Improving the Feed to Show More Relevant, Authentic Professional Content](https://news.linkedin.com/2026/ImprovingTheFeed)｜作者：LinkedIn Corporate Communications Team；2026-03-12。查核：2026-09-30。
- [Engineering the next generation of LinkedIn’s Feed](https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed)｜作者：Hristo Danchev；2026-03-12。查核：2026-09-30。
- [What We’re Doing to Support Authentic Content and Conversations on LinkedIn](https://news.linkedin.com/2026/authentic-content-and-conversations)｜作者：LinkedIn Corporate Communications Team；2026-03-13。查核：2026-09-30。
- [How to Write an Engaging Post in Your LinkedIn Feed](https://www.linkedin.com/business/talent/blog/talent-acquisition/how-to-write-engaging-post-in-linkedin-feed)｜作者：Jen Dewar；2024-11-26。查核：2026-09-30。
- [Post analytics for your content](https://www.linkedin.com/help/linkedin/answer/a523040)｜作者：LinkedIn Help；發布日期未知，頁面顯示約 1 個月前更新，精確日期未知。查核：2026-09-30。
- [LinkedIn Page analytics](https://www.linkedin.com/help/learning/answer/a547077/linkedin-page-analytics?lang=en)｜作者：LinkedIn Learning Help；發布日期未知，頁面顯示約 9 個月前更新，精確日期未知。查核：2026-09-30。
- [2026 LinkedIn Benchmarks](https://www.socialinsider.io/social-media-benchmarks/linkedin)｜作者：Elena Cucu；2026-03-16。查核：2026-09-30；已讀公開文章、表格與方法段，完整下載需提供工作電郵。
- [LinkedIn Study 2026](https://metricool.com/wp-content/uploads/Linkedin-Study-2026-EN.pdf)｜作者未標；發布稿 Anniston Ward，2026-04-14。查核：2026-09-30；已開啟 PDF 全文及發布稿，未重算數據。
