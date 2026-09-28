# 提交結果未知與重送：來源核對

核對日期：2026-09-28。範圍：`docs/database-correctness/15-operation-identity.md`、`16-unknown-outcome.md` 與 `examples/05-apply.sql`。

## Microsoft 官方來源

- [EF Core：Connection resiliency — Transaction commit failure and the idempotency issue](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency#transaction-commit-failure-and-the-idempotency-issue)：明說提交期間連線中斷時，交易結果未知；盲目按回滾重試可能造成例外或資料問題。並列出狀態查核與交易識別列等恢復方式。
- [SQL Server：Table hints (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-table?view=sql-server-ver16)：`HOLDLOCK` 等同 `SERIALIZABLE`，只作用於指定的表參照；`UPDLOCK` 在交易完成前保留更新鎖。文件提醒提示會覆寫預設行為，應審慎使用。
- [SQL Server：Transaction locking and row versioning guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-ver16)：說明交易原子性、連線中斷時未完成交易的回滾、序列化範圍鎖、索引與鎖定行為的關係，以及鎖定對阻塞和並行度的影響。

## 核對主張

- 「未知」描述客戶端掌握的證據，不代表資料庫有第三種最終結果。Microsoft 明確指出，若連線在 `COMMIT` 期間中斷，客戶端無法由該例外判定交易結果。
- 在本書的 `ApplyJudgment` 契約中，重送須使用原 `operation_id` 和完整原意圖，包含 `expected_version`。程序保存並比對缺陷、版本、分數、模型與操作者；相同操作回傳原先保存的判定與版本，不同意圖則衝突。
- 依 `05-apply.sql` 的交易流程：若原交易已提交，重送讀回舊結果而不新增判定；若原交易已回滾、操作列不存在，且原 `expected_version` 仍符合，重送才首次套用。版本已變更則衝突，不應自行改成新版本重送。
- 查詢沒有找到操作列，只能表示該次查詢沒有讀到可見列；若原交易尚在進行、查詢來自延遲副本或錯誤資料庫、查核失敗，或操作紀錄已清除，不能據此宣告回滾。這是依提交未知與讀取時點作出的教學界線；Microsoft 的範例提供「查核成功證據」模式，沒有宣稱一次查無資料即可證明回滾。
- `HOLDLOCK` 與 `UPDLOCK` 支持範例中協調同一操作 ID 的做法，但不代表鎖一定只涵蓋該 ID，也不保證沒有死鎖。實際鎖定受索引、查詢計畫、隔離設定及引擎功能影響；範例仍依賴唯一鍵、同一權威資料庫、操作列保留與整段交易原子提交。

## 教學限制與容易講錯處

- EF 文件討論的是 EF Core 執行策略；它支持「提交失聯有未知結果、需查核或安排可安全重試」，但沒有替本書這支 T-SQL 程序背書，也沒有規定所有 API 都採相同契約。
- 不要把「連線中斷」直接講成「已回滾」，也不要把「查無列」直接講成「已回滾」。查詢副本的空結果尤其不能當主庫提交狀態的證據。
- `operation_id` 單獨不足以代表可安全去重：同 ID 必須綁定不可暗改的完整意圖；換 ID 或改 `expected_version` 是新意圖，可能建立第二筆判定。
- 不要說唯一鍵會自動回傳舊結果；唯一鍵只阻止重複鍵，意圖核對與舊結果重播由程序完成。
- 不要把 `HOLDLOCK` 說成「只鎖這一列」或把 `UPDLOCK` 說成「保證不死鎖」。Microsoft 建議只在理解存取型態且有需要時使用鎖提示；要量測並發阻塞，且此 SQL Server 做法不可直接泛化到其他資料庫。
