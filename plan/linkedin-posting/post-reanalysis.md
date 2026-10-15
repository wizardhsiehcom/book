# LinkedIn 貼文再研究：2026-10-14 查讀紀錄

狀態：完成本輪 24 篇正文查讀與八篇教材剖析；選樣、圖片與職涯匹配仍有缺口，不等於整份研究計畫通過。

## 研究怎麼做、哪裡偏離計畫

本輪用公開搜尋發現來源，再逐一開啟 LinkedIn 原貼文頁的文字擷取。只計開啟後可讀到結尾的正文；搜尋結果、個人檔案上的轉貼摘要、原站長文與推薦區貼文不計入。未建爬蟲、未繞登入或封鎖；cache miss 不重試換入口。以 activity ID 去重，轉分享只計外層一篇。

起始題目為 PyCon／Sprint 活動參與與開源貢獻，語言英文及繁中；再查 COSCUP 繁中對照，最後重讀既有作品、技術提問與導讀案例。活動線索集中 2024–2026 年，技術對照採既有案例。**本輪沒有在第一筆搜尋前登記固定時間窗，也沒有取得作者完整連續序列**，因此是探索性補讀，不追認為預先設計的固定窗樣本。正文的活動年份只確認題材，不等於發布日期。

24 篇共 19 位作者，超過原定 8–12 位作者的配置；原因是同作者搜尋多未找到可讀相鄰篇，改補同類活動參與者。Eugene 五篇、王麒淞兩篇可作同作者的用途比較，仍非連續發文研究。15 篇本輪新案例、9 篇既有案例重讀。不得把既有筆記未重開的其餘貼文混入 24 篇。

沒有依反應數選文，但工具輸出會附帶反應或留言，**未做到研究者盲於數字**。內容編碼不以數字排名；可見互動另置下節。未核實所有作者的職涯階段，不能宣稱「半數與使用者同階段」達標。當篇參與者、志工、作品實作者等角色只按作者自述分類，不以追蹤數推斷資歷。

## 舊教材稽核

| 教材 | 原材料類型 | 本次處理 |
|---|---|---|
| `04-post-patterns.md` | 七篇公開 LinkedIn 正文分析，另有明標合成 AOI 範例 | 重讀 Eugene、Fateme、Raymond、John；合成例不計樣本。原有證據規則適用技術主張，不外推為所有活動必備欄位 |
| `browser-reaction-cases.md` | 20 篇 2026-10-03 反應快照，多篇當輪僅部分正文 | 留作歷史互動快照；新查讀不覆蓋舊日期或數字。本輪補讀 Hsuanwei 完整正文 |
| `eugene-fred-comparison.md` | 24 篇貼文索引，含全文／部分及作者原站補充 | 重讀 Eugene 五篇；Fred 其餘案例不冒稱本輪重讀。作者年度長文與短導言仍分開 |
| `notable-authors.md` | 原站文章、課程、訪談與簡介，多數未讀 LinkedIn | 不計任何一篇為本輪貼文證據，不拿知名作者取代活動參與者 |
| `engineering-study.md` | 外部論文對 98 篇研究傳播貼文的摘要 | 保留為二手研究解讀，98 篇不計本輪；不能用論文曝光任務規定活動感謝文 |

## 逐篇索引

查讀日均為 **2026-10-14**。頁面相對時間照原頁擷取，不換算日期；部分搜尋快取與開啟頁顯示不同，不能當成今日即時頁面。除特別註明，圖片均未實見，亦未讀外連全文。`圖未知` 表示只有泛用 Image 連結或圖庫標記，可能包括頭像；不能推定有附照片。篇幅「短／展開」為編輯描述，未做字數分布研究。

| ID／作者／原文 | 語言／頁面時間 | 當篇角色、用途與句段功能 | 正文與媒介範圍 |
|---|---|---|---|
| P01 [Tzu Han Lin：PyCon Taiwan][P01] | 英／1y | 參與者；同行者→地點與三項題材→感謝。短記錄，刪感謝會少掉對主辦者的回應 | 正文至感謝結尾；圖未知 |
| P02 [Chris Lee：首次 PyCon][P02] | 英／10mo | 參與者；原先卻步→到場交流→四場筆記→再訪意願。展開的學習記錄 | 正文至再訪結尾；圖庫標記可見，照片未見 |
| P03 [Diego R.：PyCon UK][P03] | 英／5mo | Sprint 主持者／補位講者自述；行程與孩子→臨時演講經過→錄影→感謝 | 可見文字至感謝及錄影卡；有 more 介面標記但無句中截斷，全文判定限公開正文 |
| P04 [Felipe M.：pyOpenSci Sprint][P04] | 英／3mo | 迎接貢獻者的參與者自述；一句偏好及近況，轉分享補事件背景 | 外層一句全文；嵌入 pyOpenSci 兩段全文，外連未讀；圖未知 |
| P05 [Matt Yang：AWS Taipei Summit][P05] | 繁中＋英／7mo | 講者及 AWS 團隊成員自述；天候與人物→市場需求→本人演講→職涯感想；英文另行整理 | 雙語正文至 Onward；四張無替代文字的圖項，未見圖像 |
| P06 [Luca Mancusi：首次 PyCon 講者][P06] | 英／3mo | 首次講者；題目→聽眾回饋→教育需求判斷→投影片邀請。主張來自本人觀察 | 正文至私訊邀請；作者稱圖為演講地圖，未實見 |
| P07 [Fauzi Sholichin：參與及志工][P07] | 英／4mo Edited | 首次會眾／志工；參與→幕後角度→邀請者致謝→未來意願。未提供技術論證 | 正文至標籤；圖庫標記，圖未見 |
| P08 [Eugene Yan：長文件問答][P08] | 英／1y | 技術提問者；任務→指標→測法及困難→資源→徵求補充。詳述服務於可回答的問題 | 全文至資源邀請，部分留言；圖未知；未核實 benchmark 技術內容 |
| P09 [王麒淞：感謝誌 1][P09] | 英＋繁中／11mo Edited | 議程／PR 志工自述；人物幫助→同行交流→活動里程碑→協作者感謝→下篇預告 | 雙語全文；圖庫標記，圖未見；票數、首次等未獨立核實 |
| P10 [Lihan Chen：COSCUP][P10] | 繁中／1 個月 | 長期工作人員／前總召自述；角色歷程→活動題材→持續參與理由→邀請 | 正文至活動連結；外連卡可見，圖未知；年份與次數僅作者自述 |
| P11 [Po-chiang Chao：我會在哪][P11] | 繁中／1 個月 | 參與者／產品諮詢者自述；選讀理由→逐場時段與興趣→見面及諮詢邀請 | 正文至諮詢連結；圖未知；議程未另核對，不能當現行活動資訊 |
| P12 [Stefano Fiorucci：PyCon Italia][P12] | 英／5mo Edited | 講者；社群感受→致謝及人物→自己的講題清單→資源 | 全文及作者資源留言；兩張圖替代文字分指演講及志工，實圖 click cache miss |
| P13 [Eugene：2025 回顧][P13] | 英／9mo | 個人回顧導讀；健康、職涯及度假近況→長文連結，未在貼文論證 | 貼文全文；外連長文未讀；圖未知 |
| P14 [Eugene：會議心得][P14] | 英／1y | 與會者；直接列工程判斷及取捨，作者留言續篇，非現場流水帳 | 主文及一則作者續文全文；圖未知 |
| P15 [Eugene：評測三步][P15] | 英／10mo | 導讀者；重複回答的動機→三步摘要→原文 | 貼文全文，外連未讀；圖未知 |
| P16 [Eugene：寫作 FAQ][P16] | 英／1y | 作者；常被問的四問題→遲疑→整理成文。個人態度與連結並存 | 貼文全文及作者補充；原站未重讀；圖未知 |
| P17 [王麒淞：感謝誌 3][P17] | 英＋繁中／8mo | 活動志工脈絡；人物登場→現場片段→講者觀點摘要→下一篇 | 雙語全文；兩張無替代文字圖項，未見實圖；排名與引語未另核實 |
| P18 [Xia He-Bleinagel：PyCon 首日][P18] | 英／5mo | 參與者／閃電講者；場次→現場工具體驗→上台心情→朋友及志工 | 全文至當夜道別；圖庫標記，未見實圖 |
| P19 [Dan Bokete：PyCon Ireland][P19] | 英／7mo | 首次技術會議參與者；感受→四場摘要→交流與未來意願 | 全文至未來專案；五張無替代文字圖項，未見實圖 |
| P20 [Fateme Abshavi：HALCON][P20] | 英／5mo | 作品實作者；檢查任務→方法→效益宣稱 | 可見全文至標籤，有 more 介面；影像／影片未見；準確度效益未量化驗證 |
| P21 [Raymond Goh：MES 原型][P21] | 英／5mo | 他業 MES 實作者自述；原型→缺實機限制→三問→背景與連結 | 可見全文至標籤，有 more 介面；GitHub 未查；圖未知 |
| P22 [John D.：評測抓錯][P22] | 英／5mo | 專案實作者；測例／判準→具體失敗→修正及 trace→下一階段 | 全文至後續規劃；外連未讀，圖未知；成果為自述 |
| P23 [Viktor Juhos：PyCon Austria][P23] | 英／4mo | QA／自動測試背景自述；活動→一場演講→技術轉述→與本人工作的關係 | 全文至標籤；圖未知；不把講者轉述當已核實技術定論 |
| P24 [Hsuanwei Chen：Agent 筆記][P24] | 繁中／1 年 | 課程筆記整理者；本人用途→連結→長篇課程介紹 | 可見全文至課程目標；Notion 未讀，圖未知；非教師本人發文 |

上表功能與刪除效果是本書的編輯推論；正文中的角色與經歷是作者自述。讀者對象未取得作者訪談，只能推測參與者、同行或資源讀者，不寫成已證實目標受眾。只觀察貼文呈現什麼，不能重建作者未公開的素材或取捨動機。

## 未納入及取得限制

- Giovanni Giacometti 的 PyCon Italia 2025（activity `7335742605692973056`）、Andrea Cerasani 同活動（`7341725303133605888`）、Isabella Velásquez 的 PyCon US 預告（`7455277419130818560`）、Yu Cao 回顧（`7463004928479813632`）：搜尋可見較長內容，但原頁開啟 cache miss，未計已讀正文。
- Po-Chun Lu profile 的「感謝誌」是**他按讚的王麒淞貼文**，不可歸給 Po-Chun Lu；其餘系列只在 profile 摘要找到的不計入。以作者原貼文確認 P09、P17。
- 官方活動招募與企業公關頁、招募廣告及非貼文來源不進本批個人文。其他主題同名作者排除。
- 活動正文以同類活動補足，不能稱同一活動完整樣本；沒有按精確發布時間篩出的連續序列。
- 19 位作者含志工、首次會眾與作品實作者，也包含講者、長期社群領袖、商業工作者；職涯匹配比例待核實，不能用「非名人」當作已匹配。

## 互動另記，不能解釋成效

本輪可見整篇反應／留言包括 P03 45／未顯示、P05 313／5、P12 68／2、P17 234／4、P19 48／1、P20 26／4。其餘沒有在本輪取得可用整篇總數，未知不等於零。這些是快取頁的累積顯示，擷取時間不齊，不拿來比較成長或更新 2026-10-03 舊快照。部分頁的單則留言反應甚至同時有不同顯示，未作統計。

P07 可見留言有人回應共同志工經驗，P17 有被感謝者回覆，P08 有人提出其他資料集。這只支持「頁面存在這類回覆」，不能推成一般社群、求職或觸及成效。

## 主張修正表

「撤回」指撤回作為跨任務要求的讀法，不代表舊書逐字寫過該極端命題。

| 待檢查主張 | 判定 | 證據、反例與界線 | 對應章節 |
|---|---|---|---|
| 每篇都要問題→證據→限制 | 限縮 | P08、P21 的技術求助需要；P01 參與紀錄、P04 轉分享完成不同任務 | AI workflow、C01、C03 |
| 活動文需要技術洞見才值得發 | 撤回為必填要求 | P01、P07 以參與／關係為重；P14、P23 是有材料時的技術心得選項 | C01、C04 |
| 簡短活動文一律更自然或更好 | 待驗證，不採通則 | P01 短、P02 長都有可描述任務；P18、P19 多細節，不判作者來源或優劣 | C05、tone |
| 感謝／正面形容都是空話 | 限縮 | P09、P12 指出關係或協作；P01 簡短感謝沒有交代細節仍可作禮貌收尾。是否刪除依本人目的 | C04、C05、tone |
| 有具體數字就足以支持成果 | 限縮 | P20 有任務數量卻未驗證效益；P21 主動保留模擬界線 | C03、C06 |
| 要從本文理解資訊，必須正文全部交代 | 限縮 | P04 轉分享、P15 外連各分擔背景；圖片資訊未實見，暫不做照片補足效果結論 | C06 |
| 英文就是中文逐句翻譯 | 撤回為必填要求 | P05、P09 同篇雙語在句式與濃縮程度不同；只支持可重組，不證明英語普遍更短 | tone、AI workflow |
| journey、縮寫、語病可鑑別 AI | 不採，無作者來源證據 | 全批僅見成文，未見創作過程。句型與真實作者身分之間未建立證據 | tone |
| 事實、推論、外連成果要分清 | 保留 | P20／P22 自述不是本書驗證；P04 外層不是嵌入原作者；P24 整理者不是授課者 | C02、C03、AI workflow |
| 多候選應靠不同選材／任務區別 | 編輯假設＋本人需求 | P01／P02 等顯示不同用途，但沒有同素材實驗證明多候選規則；須由指南回放檢查 | C04、編修示例 |

## 觀察如何進入私人指南

| 案例觀察 | 有條件建議 | 操作步驟 | 回放 |
|---|---|---|---|
| P01／P07 可只留下參與及人際關係，P08 要較多論證 | 先辨識本文任務，不強塞洞見 | 起稿前分參與、教學、論證、提問；只要求適用材料 | A、I |
| P09／P12 的感謝負責表達關係 | 依主題決定留或刪，不能機械去客套 | 每版選一重點，依主題省略非必要材料；本規則需回放驗收 | B、C |
| P05／P09 的雙語不完全逐句對應 | 同事實可以重組，不能新增經歷 | 英文版另起稿後逐項核對事實及態度 | E、F、G |
| P20／P21 的主張與證據強度不同 | 保留開出、完成、合併、主持等狀態界線 | 發布前核對核心動詞、人物角色及「第一次」範圍；C03 保留事件範圍，C05 不補本人感受與動機 | C、F |
| P04／P15 用外層短文接到其他材料 | 確認交付單位是正文加附件，勿腦補未見圖片 | 看過圖片才描述圖像；未見先只用使用者已確認的存在與內容 | A、D |
| 全批無作者生成過程或職涯成效 | 評估文字功能與場合，不能保證加分或辨識作者來源 | 回答適合度時分已呈現資訊、可能閱讀效果、未知實際成效 | H |

## 本輪結論的範圍

足以修正的是「所有 LinkedIn 貼文必須用同一套工程論證」的要求：至少兩位作者的參與／關係紀錄，以及技術求助反例，提供了條件限縮的依據。不能由此給出最佳句數、最佳英文措辭、作者來源判斷、圖片效果或求職效果。

尚待補的是：固定窗與完整序列、至少半數職涯匹配、非講者的一般貢獻者 Sprint／PR 文、照片實見、中文短參與文及中英文受眾差異。24 篇達到篇數目標，不自動通過這些門檻。精選八篇與四組比較見[書籍剖析章](../../docs/linkedin-posting/post-anatomy.md)。

[P01]: https://www.linkedin.com/posts/tzu-han-lin-778792130_a-fulfilling-weekend-with-hsin-ju-chan-last-activity-7244525457981759489-d5FW
[P02]: https://www.linkedin.com/posts/lee-siu-hin_my-first-experience-visiting-pycon-activity-7392065124943171584-ThPq
[P03]: https://www.linkedin.com/posts/diegor_pycon-uk-2025-exploring-the-cpython-jit-activity-7375896132679532544-w_u5
[P04]: https://www.linkedin.com/posts/felipemoreno_it-started-with-one-contributor-and-now-we-activity-7468344369629020160-Kwme
[P05]: https://www.linkedin.com/posts/matt-yang-8b842580_aws-genai-awssummit-activity-7356352354943713280-YR6Y
[P06]: https://www.linkedin.com/posts/luca-mancusi_pycon-italia-2026-is-over-and-just-like-activity-7468202393902604288-DaLB
[P07]: https://www.linkedin.com/posts/fauzisho_pycon-pydata-python-activity-7450823083793354752-eBcs
[P08]: https://www.linkedin.com/posts/eugeneyan_if-you-were-building-a-qa-feature-or-chatbot-activity-7315546528368992256-4XLo
[P09]: https://www.linkedin.com/posts/chisung-wang_pycontw2025-python-cpython-activity-7371461343868145664-VErH
[P10]: https://cn.linkedin.com/posts/lihan-chen-02995652_coscup-x-ubucon-asia-2026-activity-7491414000409350144-mMZs
[P11]: https://cn.linkedin.com/posts/bobchao_coscup-2026%E6%88%91%E6%9C%83%E5%9C%A8%E5%93%AA-%E9%96%8B%E6%BA%90%E4%BA%BA%E5%B9%B4%E6%9C%83%E6%98%AF%E5%8F%B0%E7%81%A3%E5%B0%91%E8%A6%8B%E7%9A%84-100-%E5%BF%97%E5%B7%A5%E9%99%A3%E5%AE%B9-activity-7490584868981121024-13T3
[P12]: https://www.linkedin.com/posts/stefano-fiorucci_3-weeks-ago-i-had-a-great-time-at-pycon-italia-activity-7343210124963950592-IySN
[P13]: https://www.linkedin.com/posts/eugeneyan_2025-year-in-review-activity-7406883377825558528-BX9l
[P14]: https://www.linkedin.com/posts/eugeneyan_some-things-i-learned-from-conferences-this-activity-7252845529817088000-43s-
[P15]: https://www.linkedin.com/posts/eugeneyan_product-evals-in-three-simple-steps-activity-7399263939945144320-Q8OW
[P16]: https://www.linkedin.com/posts/eugeneyan_frequently-asked-questions-about-my-writing-activity-7313013565550903297-sywp
[P17]: https://www.linkedin.com/posts/chisung-wang_pycontw2025-python-pycon-activity-7372152384451461120-ZeaU
[P18]: https://www.linkedin.com/posts/xia-he-bleinagel-51773585_the-first-day-at-pycon-de-pydata-was-amazing-activity-7449925942430519297-qXHT
[P19]: https://www.linkedin.com/posts/danbokete_last-weekend-i-had-the-amazing-opportunity-activity-7398378557493645312-V20s
[P20]: https://www.linkedin.com/posts/fateme-abshavi-252a352ba_machinevision-halcon-imageprocessing-activity-7361761314882433024-jYpA
[P21]: https://www.linkedin.com/posts/raymond-goh-571b0b20a_mes-secsgem-semiconductor-activity-7449805293129183232-eex_
[P22]: https://www.linkedin.com/posts/johndorlus_part-2-is-here-good-news-the-eval-harness-activity-7437542551236124672-odwS
[P23]: https://www.linkedin.com/posts/viktor-juhos_pycon-pyconat26-python-activity-7454860241759789059-edlk
[P24]: https://cn.linkedin.com/posts/hsuanwei-chen_李宏毅教授生成式ai時代下的機器學習2025第二堂課一堂課搞懂-ai-agent-activity-7307761330990587904-QOiU
