# 來源與證據界線

查核日期：2026-09-22。正文的程式、fixture 與對照設計由本書新增；來源作者的事故與數字不是本書成果。本頁保留公開網址，讀者不需取得私有專案或未出版的研究筆記。

## 機制文件

作者為 Microsoft，除 uv 由 Astral 維護。API 頁面讀取重點為 arguments、return、comments 與相關診斷；長篇 locking guide 只讀鎖逾時與縮短交易等相關小節，不宣稱讀完全部。日期未逐頁核對者不推定發布日；本次以查核日錨定。

| 章節 | 原始文件 | 用來核對什麼 |
|---|---|---|
| 01、17 | [GetModuleFileNameW](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulefilenamew) | 自身產物路徑、buffer 長度 |
| 05 | [SQLGetDiagRec](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdiagrec-function) | handle、逐筆診斷、文字截斷 |
| 04、06 | [SQLGetData](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdata-function) | NULL、長度、C 型別、分段 |
| 07 | [Multiple Results](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/multiple-results) | count 與 result set、前進與丟棄 |
| 08 | [SQLBindParameter](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlbindparameter-function) | deferred pointer 與完成時點 |
| 09 | [Parameter Markers](https://learn.microsoft.com/en-us/sql/odbc/reference/appendixes/parameter-markers)、[QUOTENAME](https://learn.microsoft.com/en-us/sql/t-sql/functions/quotename-transact-sql) | 值參數與識別字界線 |
| 10 | [SQLExecDirect](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlexecdirect-function)、[SQLRowCount](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlrowcount-function) | 零列回傳、count 的範圍 |
| 11、15 | [Committing and Rolling Back](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/committing-and-rolling-back-transactions)、[SQLEndTran](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlendtran-function) | autocommit、手動交易、未知結果 |
| 12 | [Locking guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide) | 等待、交易持有、版本差異 |
| 13 | [steady_clock](https://learn.microsoft.com/en-us/cpp/standard-library/steady-clock-struct) | 經過時間，而非牆上時鐘 |
| 14 | [Query timeout troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/troubleshoot-query-timeouts) | 比階段與執行條件 |
| 16 | [uv Running scripts](https://docs.astral.sh/uv/guides/scripts/) | inline metadata、依賴、明確 script lock |
| 準備 | [SQL Server Docker](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker) | 容器、資料生命週期、版本／授權前提 |

## 中英文現場研究

| 來源、作者、日期 | 讀取範圍 | 本書採用與限制 |
|---|---|---|
| [一次较波折的MySQL调优](https://www.cnblogs.com/Jcloud/p/16646031.html)，京東雲帳號，2022-09-01，個人作者未知 | 主文文字；圖片未逐張驗讀 | 14 章的上下文提醒；未重現作者調校、不能外推倍率 |
| [连接池与孤立事务](https://www.cnblogs.com/wy123/p/6110349.html)，MSSQL123，2016-11-28 | 主文與程式文字；圖片未逐張驗讀 | 研究期間提醒查生命週期；ADO.NET 不直接等同 ODBC |
| [nanodbc #247](https://github.com/nanodbc/nanodbc/issues/247)，gaoll07，2020-08-15 | 描述、環境與最小程式 | 07 章研究入口；關聯修補未核實，自造 batch 不等於確認其根因 |
| [Slow in the Application, Fast in SSMS?](https://www.sommarskog.se/query-plan-mysteries.html)，Erland Sommarskog，修訂 2026-07-22 | 導論、MARS、交易相關段落，非整部全文 | 14 章對照方向；作者 C#／遠端數據未重現 |
| [Django, SQLite, and Database Is Locked](https://blog.pecar.me/django-sqlite-dblock/)，Anže，2024-01-16，更新 01-30 | Cause 0–3 主文，未下載重現 repo | 研究重試粒度；未移植成 C++ SQLite 實驗 |

跨引擎查核另讀 [SQLite isolation](https://www.sqlite.org/isolation.html) 與 [PostgreSQL 18 isolation](https://www.postgresql.org/docs/18/transaction-iso.html) 的相關段落，只用來限制外推，不提供「換連線字串即通用」的承諾。

## 不採用的捷徑

不以內網代替參數與目標驗證；不以 rollback 代替外部效果控制；不把 timeout 自動翻譯成重試三次；不以關池、NOLOCK、清全庫 cache 或無限 timeout 當預設修法。來源不足的延伸題保留在研究／plan，不用來源數量掩蓋未驗的前提。
