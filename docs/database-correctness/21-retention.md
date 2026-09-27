# 21｜清掉操作紀錄，舊請求再來時怎麼辦？

`operation_id` 讓同一次請求重送時不重複新增判定；但留在資料庫的收據要保存多久？如果清掉後，幾個月前的離線裝置又送來同一個 ID，查不到列能證明「以前沒做過」嗎？不能。查無紀錄可能代表首次送達，也可能是收據已過期刪除、資料剛從備份恢復，或查詢讀到延遲的副本。Microsoft 的連線復原文件也提醒：提交期間失去連線時，呼叫端可能不知道交易是否提交；因此重送需要穩定識別與安全的狀態查核。[提交結果未知與冪等性](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency#transaction-commit-failure-and-the-idempotency-issue)

## 先把有效期限變成服務端契約

客戶端自己送 `operation_id` 和 `expires_at` 字串，不代表服務端能信任它；客戶端可以把時間改晚。可行的契約之一，是服務端簽發不可任意改寫的請求憑證，綁定 `operation_id`、`defect_id`、`expected_version`、score、model／operator、來源、到期時間與發行 epoch。重試同一意圖時沿用同一憑證；刻意重判是新意圖，需新 ID 和新憑證。

服務端在執行前驗簽，確認憑證內容與請求相符、`expires_at` 尚未到期，且 epoch 仍被接受；到期判斷使用受服務端管理的時鐘，不能相信呼叫端回報的「現在」。另一做法是讓服務端保存可查的發行紀錄或 epoch 狀態。兩者都是應用層契約，不是 SQL Server 自動替 API 驗證的功能。

本章只界定服務必須能驗證哪些條件，不要求 B02 建置憑證簽發器或簽章框架。

這裡的 epoch 是服務端為請求發行批次設定的「世代標記」，撤銷某個世代即可停止接受它的請求；它不是 Defects.version_no、schema 版本或 sequence 號碼。這是契約選項，本書沒有建立簽發系統。

目前 `dbo.Operations` 沒有到期欄或 epoch；`dbo.Judgments.created_at` 只能表示判定寫入時間，不能證明請求憑證何時簽發、何時過期。若寫入時省略此欄，schema 預設以 SQL Server 主機的 `SYSUTCDATETIME()` 記錄 UTC；但呼叫端若可自行指定欄值，就不能把它當可信服務時間。若要讓清理工作可逐筆判斷，需由服務端保證每張憑證有明確的最長有效期，並讓收據至少保留到它可能有效的最晚時間，另加時鐘誤差餘裕。若最長有效期不固定，或日後可以重新簽發舊 ID，就不能只憑 `created_at` 安全判斷該列可清除。此時要保存發行資訊，或拒絕無法驗證的舊請求。

## 收據與來源歷史有兩種價值

`Operations` 同時是重送收據，也是從一個操作追到固定 `judgment_id`、來源、版本和操作者的線索。`Judgments` 記錄歷次結果；`Defects.current_judgment_id` 指向目前值。若刪除舊 Operations，該判定仍可能在歷史表中，但 operation ID、當時的 `expected_version` 和來源關聯會消失。只有在資料保留規則允許失去這些證據，而且已確定不再接受該請求後，才把它列為清理候選。需要長期保留判定沿革，就保留 Operations 或把必要關聯封存到受控且同樣可查的保存區。

對清理工作的查詢先做唯讀預覽；`@CutoffUtc` 必須由服務端保留政策計算，不能從任意客戶端參數取得。此例也排除目前指標正指向的 operation，但其他非目前列仍可能是稽核所需，預覽結果不是刪除授權：

下列為參數化唯讀查詢：先選定 B02Lab、完成第 18 章加欄與回填，並由服務端綁定 `@CutoffUtc`（datetime2）。手工練習時先以 `DECLARE @CutoffUtc datetime2 = '2026-01-01';` 設定一個純觀察截止點；這個日期不是清理政策。空的 Operations 回零列，不代表清理策略通過。

```sql
SELECT o.operation_id, o.defect_id, o.result_version,
       o.judgment_id, o.source_name, j.created_at,
       d.current_judgment_id
FROM dbo.Operations AS o
JOIN dbo.Judgments AS j
  ON j.defect_id = o.defect_id
 AND j.judgment_id = o.judgment_id
JOIN dbo.Defects AS d
  ON d.defect_id = o.defect_id
WHERE j.created_at < @CutoffUtc
  AND (d.current_judgment_id IS NULL
       OR d.current_judgment_id <> o.judgment_id);
```

資料庫層沒有 `Operations.created_at`，所以此查詢借用「判定與操作在同一交易寫入」契約下的 Judgment 時間做候選篩選；這不是到期欄。如果這項同交易契約沒有成立，不能用這個時間做清理依據。演練只列候選，不執行 `DELETE`：先定義重送窗口和歷史證據保存期限，再逐列說明 ID 到期後會拒絕、人工查核，還是仍從封存區回覆舊結果。保留期要從最長重送／離線窗口和稽核需求決定，本章不替你的系統編一個天數。

## 首次執行與提交結果未知，走同一個安全入口

一個有效憑證可能是第一次送達；此時還沒有 Operations 列是正常狀況。服務也可能是在提交回應不明後重送，單看「查不到 ID」不能證明前一次未成功。可接受的做法不是把缺列當成成功／失敗結論，而是讓首次請求與重送都進入同一套可重入資料庫交易：先查權威主庫上是否已有 operation；若有，就核對完整意圖並沿固定 `judgment_id` 回原結果，意圖不同便拒絕。若沒有，則用完整原 ID 在同一交易內條件更新 Defects 版本、插入 Judgment、更新目前指標並插入 Operations；`operation_id` 主鍵和 expected-version 條件共同防止兩個並行請求各自提交。唯一鍵衝突時回滾、重新讀取，再比對既有意圖，而不是另建一筆判定。

這種重入只在明確前提內安全：憑證仍有效；Operations 收據尚未清理；查的是權威主庫而非可能延遲的副本；所有資料庫效果和收據在同一交易提交；沒有還原舊備份而丟失已提交收據；每次重試都帶完整相同的原 ID 和意圖。若資料曾回復到較舊狀態、保留期已到、查核路徑不權威，或呼叫端換了 ID／意圖，先暫停自動重入並查核。任何外部通知也不在這筆本地交易保證內。

## 換個情境想一次

服務只保留 30 天操作列，裝置第 45 天用相同 GUID 重送，並自行把到期欄改成第 60 天。這個請求能否走上述重入流程？若另有一筆第 1 天首次送達、憑證有效且收據不存在的操作，又該怎麼處理？分別指出憑證驗證、查詢與原子交易需要提供的證據。這裡的 30、45、60 天只是題目條件，不是本書建議的政策數字。

交卷後再對照[第 21 題解答](answers.md#q21)。來源：[SQL Server UTC 時間函式](https://learn.microsoft.com/en-us/sql/t-sql/functions/sysutcdatetime-transact-sql?view=sql-server-ver16)、[EF Core 對提交結果未知的說明](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency#transaction-commit-failure-and-the-idempotency-issue)。本書沒有執行清理工作或決定保留天數；期限簽發、驗證和清理窗口必須在服務契約中一起驗收。
