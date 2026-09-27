# 來源與適用邊界

本書以官方產品文件查核引擎語意，再用自己設計的合成 AOI 例子解釋。查閱日期：2026-09-26。來源說明「應如何運作」，實際測試結果另見 [驗證紀錄](verification.md)；兩者不能互相替代。

## 模型與查詢

| 主題 | 官方文件 | 本書使用範圍 |
|---|---|---|
| 正規化 | [Database normalization basics](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) | 關聯模型與更新異常；不把 Access 特有操作搬到 SQL Server |
| 邏輯查詢順序 | [SELECT](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql?view=sql-server-ver16) | FROM、ON、WHERE、GROUP BY 的語意，不是物理執行先後 |
| NULL | [NULL and UNKNOWN](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/null-and-unknown-transact-sql?view=sql-server-ver16) | 三值邏輯與查詢條件 |
| 聚合 | [COUNT](https://learn.microsoft.com/en-us/sql/t-sql/functions/count-transact-sql?view=sql-server-ver16) | 列數、非 NULL 數與 DISTINCT |
| 約束 | [UNIQUE and CHECK](https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints?view=sql-server-ver16) | SQL Server 對 NULL、UNIQUE 與 CHECK 的處理 |
| 參數 | [SQL injection](https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-injection?view=sql-server-ver16) | 值透過參數傳入，識別字另有允許清單 |

## 交易、隔離與效能

| 主題 | 官方文件 | 本書使用範圍 |
|---|---|---|
| 交易與版本 | [Locking and row versioning guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-ver16) | 鎖、RCSI、SNAPSHOT 與快照建立時點 |
| 隔離 | [SET TRANSACTION ISOLATION LEVEL](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver16) | session 設定與各層級語意 |
| 資料庫選項 | [ALTER DATABASE SET](https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-set-options?view=sql-server-ver16) | RCSI 切換條件與現存交易影響 |
| 持久性 | [Control transaction durability](https://learn.microsoft.com/en-us/sql/relational-databases/logs/control-transaction-durability?view=sql-server-ver16) | 完整與延遲持久性、記錄落盤 |
| 錯誤清理 | [TRY…CATCH](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/try-catch-transact-sql?view=sql-server-ver16)、[XACT_STATE](https://learn.microsoft.com/en-us/sql/t-sql/functions/xact-state-transact-sql?view=sql-server-ver16) | 目前交易能否提交與回滾 |
| 死鎖 | [Deadlocks guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-deadlocks-guide?view=sql-server-ver16) | 受害者與整筆交易重試 |
| 索引 | [Index design guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide?view=sql-server-ver16) | 鍵序、涵蓋與維護成本 |
| 計畫 | [Execution plans](https://learn.microsoft.com/en-us/sql/relational-databases/performance/execution-plans?view=sql-server-ver16) | 估計與實際計畫分工 |
| 鎖提示 | [Table hints](https://learn.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-table?view=sql-server-ver16) | UPDLOCK／HOLDLOCK 的局部用法，不是全域調校建議 |

## 重入、演進與恢復

| 主題 | 官方文件 | 本書使用範圍 |
|---|---|---|
| 提交未知 | [EF Core connection resiliency](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency#transaction-commit-failure-and-the-idempotency-issue) | 失聯後結果未知與狀態驗證；不引入 EF，也不代表 ODBC 故障實測 |
| 號碼 | [Sequence numbers](https://learn.microsoft.com/en-us/sql/relational-databases/sequence-numbers/sequence-numbers?view=sql-server-ver16) | 回滾可能留缺口，不用來推斷提交全序 |
| 外部通知 | [Transactional Outbox in Cosmos DB](https://learn.microsoft.com/en-us/azure/architecture/databases/guide/transactional-out-box-cosmos) | 僅參考原子入表與後續投遞的設計分工；不是 SQL Server 實作證據 |
| Schema | [ALTER TABLE](https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-table-transact-sql?view=sql-server-ver16) | 加欄位與收緊約束前的資料驗證 |
| 還原 | [Back up and restore](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases?view=sql-server-ver16)、[VERIFYONLY](https://learn.microsoft.com/en-us/sql/t-sql/statements/restore-statements-verifyonly-transact-sql?view=sql-server-ver16) | 媒體驗證不等於實際還原；不宣稱已完成時間點還原 |
| rowversion | [rowversion](https://learn.microsoft.com/en-us/sql/t-sql/data-types/rowversion-transact-sql?view=sql-server-ver16) | 二進位版本值不是日期時間 |

## 執行環境與引擎比較

- [SQL Server 容器快速入門與需求](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16)：受支援 x86-64 Linux 容器平台與模擬限制。
- [SQL Server 2022 Windows 需求](https://learn.microsoft.com/en-us/sql/sql-server/install/hardware-and-software-requirements-for-installing-sql-server-2022?view=sql-server-ver16)：Windows x64 開發實例的另一條路。
- [sqlcmd](https://learn.microsoft.com/en-us/sql/tools/sqlcmd/sqlcmd-utility?view=sql-server-ver16)：批次、錯誤停止與工具選項；客戶端版本需另記。
- [SQLite isolation](https://www.sqlite.org/isolation.html)、[transactions](https://www.sqlite.org/lang_transaction.html)：SQLite 可說明局部關聯與交易概念，但寫入並行與 BUSY 行為不能替代 SQL Server 實驗。本書沒有用 SQLite 的通過結果填入 SQL Server 驗證欄。

研究時部分搜尋結果會指向較新的 `ver17` 文件。正文鏈接以 `ver16` 為主，只採用 SQL Server 2022 可用的功能；如果網站導向不同版本，請核對 Applies to 與版本專屬註記。不要僅憑網址的 view 參數判定所有段落都適用。
