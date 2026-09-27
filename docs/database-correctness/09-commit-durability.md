# 09｜提交與持久性：成功回覆究竟承諾什麼

看到程式收到「已提交」，你會把哪些事當成已發生？請先分開四個事件：SQL Server 執行 `COMMIT`、伺服器回覆用戶端、用戶端程序正常結束、資料能在伺服器重啟後恢復。它們彼此相關，卻不是同一個觀察點。尤其是「用戶端沒收到成功」不等於「伺服器沒提交」；這是第 16 章要處理的未知結果問題。

## 提交與回覆不是同一件事

SQL Server 以交易記錄記下資料修改。採完整持久性時，提交回覆前會把該交易所需的記錄寫入穩定儲存；資料頁可以稍後再寫回資料檔，因為復原程序能依記錄重做已提交工作。因而「COMMIT 成功」不要求每個資料頁當場落盤，但其承諾仍依賴引擎設定、作業系統與儲存裝置確實履行寫入語意。資料庫設定若強制延遲持久性，提交可先回覆、交易記錄之後才落盤；突然失電時，最近已回覆的交易可能遺失。

先以唯讀查詢確認目前教材庫設定，不要在正式資料庫改選項：

```sql
SELECT name, delayed_durability_desc
FROM sys.databases
WHERE database_id = DB_ID();
```

## 確認資料庫設定

SQL Server 的預設是完整持久性，但教材不能由「預設」推斷每個資料庫的實際狀態。基線資料庫應核對這個欄位並記錄 SQL Server build；需要測試延遲持久性時，要另外使用一次性隔離資料庫和管理者設定，不能在共用或生產資料庫切換。本版已在 Docker 引擎核對設定並執行提交相關實驗，見 [驗證紀錄](verification.md)；本章未進行崩潰／斷電驗證，因此不把官方持久性機制描述成已驗證的故障恢復結果。

## 故障時間線與證據

把故障按時間排序，證據才不會混在一起：

| 故障時點 | 可以觀察什麼 | 單靠它不能推出什麼 |
|---|---|---|
| 用戶端在送出 `COMMIT` 前退出 | 新連線讀回是否看見修改 | 程序退出本身不能證明請求曾送到伺服器 |
| 客戶端送出 `COMMIT` 後、取得成功回覆前失聯 | 以穩定操作識別碼重連查詢並核對結果 | 客戶端例外不能判定伺服器是否已提交 |
| SQL Server 服務或主機重新啟動 | 復原後讀取資料並核對交易 | 一次成功的服務重啟不等於所有儲存故障皆已涵蓋 |
| 儲存裝置故障或謊報寫入完成 | 需依備份、複寫與硬體故障模型演練 | SQL Server 回覆本身不能保證故障裝置保存資料 |

可用雙 session 做無破壞的可見性觀察：A 在隔離實驗中開始交易、修改一筆資料並提交；B 在提交後查詢該筆資料。B 看見新值只能證明該次提交後資料可見，不能證明經歷主機重啟、控制器斷電或儲存媒體毀損後仍可恢復。真正驗收持久性要在獨立實驗環境執行有記錄的故障注入與重啟，並保存版本、設定、故障點及復原後比對結果；本章不提供重啟或切電命令。

反例是把「API 回傳成功」與「每個副作用都成功」畫上等號。資料庫提交後，程式可能還要送訊息或寫檔；這些外部工作不在本機交易的保證內。另一個反例是只在同一連線查回剛寫入的值，便宣稱具備災難復原能力。證據必須匹配主張：讀回驗證可見性，獨立備份還原演練才能支持復原能力。

**無提示題**：客戶端送出 `COMMIT` 後、尚未取得成功回覆即失聯。列出伺服器已提交與尚未提交兩種可能狀態；每種狀態需要什麼查核證據？再說明資料頁尚未寫回資料檔時，為何不必然代表已提交資料會消失。答題後看 [answers.md 的第 09 題](answers.md#ch09)。

**官方來源**：[Control Transaction Durability](https://learn.microsoft.com/en-us/sql/relational-databases/logs/control-transaction-durability?view=sql-server-ver16)、[COMMIT TRANSACTION](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/commit-transaction-transact-sql?view=sql-server-ver16)、[Logging and Data Storage Algorithms](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/database-file-operations/logging-data-storage-algorithms)。SQL Server 2022、compatibility level 160 是本書目標，實際設定須逐庫確認。
