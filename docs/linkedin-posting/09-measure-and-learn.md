# 09｜衡量成效，讓下一輪更好

查核日：2026-09-30。前章：[08｜建立可持續的發文流程](08-sustainable-workflow.md)；下一步：[附錄 A01｜來源卡與回顧表](appendix-source-checklist.md)。LinkedIn 單篇分析頁在查核時顯示約一個月前更新、彙總分析頁約四個月前更新；兩頁都未顯示精確更新日期。Buffer 頻率分析日期為 2025-08-28、時段分析日期為 2026-09-09；兩份均於 2026-09-30 查核。

先問清楚要改善哪一種結果。**貼文成效**看目標讀者是否看到、回應或採取後續行動；**技術 eval**看模型或 Agent 是否在固定任務中做對事、引用正確證據、按規則使用工具並安全失敗。貼文得到很多互動，不代表系統可靠；測試通過也不代表貼文找到合適讀者。

## 先定義指標和觀察窗

LinkedIn Help 將 impressions 定義為貼文在 LinkedIn 顯示的次數；members reached 是看過貼文的不重複會員／專頁估計值，同一會員／專頁重複觀看不再增加此觸及數字。兩個數字都是估值，並不完全精確。[LinkedIn Help：Post analytics for your content](https://www.linkedin.com/help/linkedin/answer/a523040)

該頁也把 reactions、comments、reposts、saves、sends 列為社交互動；外部連結訪問會計入重複點擊。分析資料只對發文者本人可見，而且本人自己的瀏覽和互動也會計入。彙總分析頁可選 7–365 天區間，並分開顯示 impressions 或 engagements；它定義 engagements 為 reactions、comments、saves、sends 和 reposts 的合計。[LinkedIn Help：Combined post analytics](https://www.linkedin.com/help/linkedin/answer/a701208)

本章把發布後 **168 小時（七天）**定為貼文比較的觀察窗，並建議在 24 小時和 168 小時各留一次紀錄。這是為了讓自己的貼文有一致比較條件，並非 LinkedIn 公布的最佳窗口。記錄精確發布與讀取時間；若資料晚了兩天才取，就寫實際時間差，不要假裝是完整七日數據。缺少欄位就填「未取得」，不能把缺值改成 0。

以下觀察表是閱讀次序，**不是轉換漏斗，也不保證讀者會由一層走到下一層**：

| 觀察順序 | 指標或記錄 | 可以回答 | 不能單獨回答 |
|---|---|---|---|
| 1. 目標與內容 | 目標讀者、主題、模式、媒介、發布時間、貼文狀態 | 這篇原本想幫誰解決什麼問題？ | 目標是否達成 |
| 2. 發現 | Impressions、members reached | 貼文顯示幾次？估計有多少不同會員／專頁看到？ | 為何被推薦、讀者是否看完 |
| 3. 站內反應 | Reactions、comments、reposts、saves、sends；留言主題 | 讀者做了哪些互動？回應是否提出實務問題？ | 按讚者都是目標讀者、互動必然由格式造成 |
| 4. 後續行為 | 由貼文而來的檔案瀏覽／追蹤、外部連結訪問、可確認的對話 | 有哪些可觀察的下一步？ | 點擊就是獨立訪客、詢問一定來自這篇貼文 |

LinkedIn 的同帳號數據仍是觀察資料。帳號相同能減少一部分固定差異，但主題、素材品質、時段、受眾規模、熱門事件和先前貼文都可能一起變。四週八篇適合練習記錄並產生假說，無法證明哪一種模式造成成效改變。Buffer 的頻率與時段報告也是特定資料集的觀察，不應當成個人帳號的因果定律。[發文頻率研究](https://buffer.com/resources/how-often-to-post-on-linkedin/)；[發布時段研究](https://buffer.com/resources/best-time-to-post-on-linkedin/)

## 各種比率都寫清分母

| 自訂指標 | 計算式 | 記錄限制 |
|---|---|---|
| 每曝光互動率 | 同一觀察窗的 engagements ÷ impressions × 100% | 本書的自訂比率；寫出互動包含哪些事件。不要和分母或分子不同的外部研究直接比較。 |
| 每曝光外連訪問比 | 同一觀察窗的外部連結訪問次數 ÷ impressions × 100% | 訪問可能重複，不是獨立點擊者比例或網站轉換率。 |
| 技術任務通過率 | 符合預先寫定成功條件的執行次數 ÷ 全部執行次數 × 100% | 同時報告獨立任務數及每題重跑次數；重跑不能冒充更多不同任務。 |
| 引用正確率 | 人工核對後有足夠依據的引用數 ÷ 已核對引用數 × 100% | 先寫「足夠依據」的判準；不要用生成模型自己的自評當唯一真值。 |
| 工具使用正確率 | 所有必要工具呼叫及參數都符合規則的執行次數 ÷ 需要工具的執行次數 × 100% | 一次執行若包含多個工具，必須全部正確才算正確；不需要工具的執行不列入分母。 |

比率分母為零時，結果是「未定義」；若欄位沒有資料則寫「未取得」，都不能填成 0%。例如沒有任何需要工具的執行，就不能計算工具使用正確率。技術 eval 還可記錄 schema 合法率、未授權副作用次數、端到端延遲和每次成功任務成本。每項都要先定義檢查單位、排除條件與測試版本。若測試集只有十幾題，結果是找錯的起點，不是可靠度保證。

## 可複製的紀錄範例

下面兩筆的日期、文字與數字**全部是合成示意，並非任何帳號實際結果**。第一筆示範貼文分析欄位，第二筆示範 Agent 技術評測；不可合併成同一個「成效分數」。

```yaml
record_type: content_outcome
synthetic_example: true
status: 未發布的計算示意，不是本人貼文
post_id: SYN-CONTENT-01
goal: 讓工程讀者看懂成像條件會改變視覺判讀
target_reader: 設備與視覺 AI 工程讀者
topic: 同一物件在不同照明下的影像差異
format: 文字加兩張合成示意圖
published_at: 2026-09-02T09:00:00+08:00  # 合成
observed_at: 2026-09-09T09:00:00+08:00  # 合成；剛好 168 小時
window: 168 小時；本書記錄慣例
impressions: 420
members_reached: 310  # 估計的不同會員／專頁數
reactions: 12
comments: 3
reposts: 1
saves: 2
sends: 1
engagements_total: 19  # 上述五項相加
custom_engagement_rate: 19 / 420 * 100 = 4.52%
external_link_visits: 8  # 可能包含同一人重複點擊
custom_link_visits_per_impression: 8 / 420 * 100 = 1.90%
profile_viewers_from_post: 4
followers_gained_from_post: 2
qualified_conversations: 未記錄
next_note: 單篇描述；不推論格式或照明造成互動差異
```

```yaml
record_type: technical_eval
synthetic_example: true
status: 沙盒評測的格式示意，不是已完成作品
system_version: demo-agent-v0.1
dataset: 12 個合成設備問答案例
trials_per_case: 3
total_runs: 36
success_rule: 判讀符合標註、引用支持結論、輸出格式合法且未越過允許工具範圍
task_success: 27 / 36 = 75.0%
tool_required_runs: 24
runs_with_all_required_tool_calls_and_arguments_correct: 22 / 24 = 91.7%
citations_checked: 30
citations_supported: 28 / 30 = 93.3%
schema_valid_runs: 35 / 36 = 97.2%
forbidden_side_effects: 0 / 36  # 合成沙盒數字，需明確定義檢查方式
latency_p95: 8.2 秒  # 合成；端到端每次執行
cost_per_success: 未測量；本示例用本機 mock 工具
interpretation: 12 個不同任務各跑 3 次；36 次執行不等於 36 個獨立任務
next_step: 檢查失敗 trace，新增代表性案例，再重跑同版本比較
```

工具使用正確率的分子、分母都是「執行次數」：示例有 24 次執行需要工具，其中 22 次的所有必要工具選擇與參數都正確。若一次執行中有兩個必要呼叫，其中一個錯誤，該次不算正確。

## 回顧時只決定一件事

七日回顧時先記錄觀察，再提出解釋。問：哪個目標讀者留下了具體問題？哪些數字缺了分母或相同觀察窗？系統失敗是取錯資料、選錯工具、引用不實，還是評分條件不清？下一輪只改一個可辨認的變項，並保留舊資料。

最後寫一行決策：「保持／改寫／暫停哪一類題目，理由是哪個可核對的觀察，什麼新結果會讓我改變做法？」若沒有足夠資料，就把結論記成待驗證假說。這樣的回顧能改善下一次判斷，卻不把同帳號前後差異包裝成因果證明。
