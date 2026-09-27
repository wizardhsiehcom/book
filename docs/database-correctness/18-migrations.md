# 18｜欄位增加，不代表舊資料已經知道答案

匯入資料現在要記錄來源名稱。你能不能在不停掉所有舊程式的情況下，讓新舊版本暫時共存？先預測：如果直接把 `source_name` 設成 `NOT NULL`，正在跑的舊 writer 沒提供這欄時會怎樣？如果先填一個真實來源名稱，舊列真的就有了來源證據嗎？

本章沿用前面的 AOI 判定資料，假設新增欄位放在 `dbo.Operations`：它描述「這次操作從哪個已知來源進來」，例如合成例子中的 `line-a-import`。它不是原始影像、輸入檔或模型輸入的副本。既有操作沒有來源欄位，資料庫不能從 score 或時間倒推出來源；`legacy-unknown` 是明確標記「舊資料來源未知」，不是一個真實來源名稱。這個差異讓報表不會把缺證據誤讀成已確認來源。

## 先擴充，再讓程式跟上

前置：在獨立的升版實驗庫完成 schema 及操作實驗，再以管理員連線。本章沿用示例名稱 B02Lab；若另取庫名，須同步修改建庫、建表及操作腳本中的 USE。先選定實際實驗庫並確認 `SELECT DB_NAME();`，再逐段操作。ADD 欄位是首次 DDL，重跑會因欄位存在而失敗；後面的條件式 UPDATE 才是可重入回填。

把變更拆成 **expand → backfill → contract**。第一步只加一個可空欄位，不設 `'legacy-unknown'` 的預設值：否則任何忘記傳來源的新寫入也會被包裝成「舊資料未知」，掩蓋新 writer 的 bug。SQL Server 的 `ALTER TABLE ... ADD` 支援可空欄位；實際部署仍要觀察目標表的鎖與流量影響，本書沒有量過其停頓時間。[新增欄位語法](https://learn.microsoft.com/en-us/sql/relational-databases/tables/add-columns-to-a-table-database-engine?view=sql-server-ver16)

```sql
ALTER TABLE dbo.Operations
ADD source_name nvarchar(40) NULL;
GO
```

部署前先盤點所有讀寫者。特別看 `INSERT dbo.Operations VALUES (...)` 這種沒有欄位清單的舊寫法：新增欄位後，值的數目不再相符；先改成明列欄位的 INSERT，再做 schema 變更。加欄後仍在執行的舊版若有明確欄位清單，可以不提供可空欄位；新 reader 在過渡期要能處理 NULL，新 writer 則開始明確寫入實際來源。若舊版連可空欄位都不能容忍，便還沒達到共存條件。

`GO` 讓新增欄位先完成，再編譯後續使用它的查詢。若透過 driver 執行，請分成兩次命令，不把 GO 當 SQL 傳給引擎。把 ADD 與 UPDATE 新欄位硬塞同一批次，可能先遇到 Invalid column name；這是本版實驗實際抓到的前置問題。

## 回填要能重跑，也要承認不知道

短小的教學資料可用一個條件式 UPDATE；條件讓已完成列不會被覆寫，因此可重跑：

```sql
UPDATE dbo.Operations
SET source_name = N'legacy-unknown'
WHERE source_name IS NULL;
```

大表不要把這個整表更新直接當線上部署方案。先估列量、交易記錄與可接受負載，再分批提交；每批仍只處理 NULL，並記錄剩餘數量。舊 writer 若仍能插入 NULL，跑完的一刻不代表回填結束，需等舊 writer 排空後再查一次。

回填條件也保護已經寫入真實來源的新列：例如新 writer 已填 `line-a-import`，重跑時不會被改成 `legacy-unknown`。反過來說，若新 writer 本身把真實來源寫成 NULL，這段 SQL 不知道那是程式錯誤還是尚未補齊的舊列；要靠新 writer 的輸入契約和後續 NULL 查核找出來。

```sql
SELECT COUNT_BIG(*) AS missing_source_count
FROM dbo.Operations
WHERE source_name IS NULL;
```

讀者在小型隔離庫中先看 `Operations` 的欄位，再加欄、回填並重跑 UPDATE。不要假設此刻已有操作列；零列時 UPDATE 影響零列是正常條件，沒有「造一筆結果」的理由。本輪已驗證可空加欄、分批補值、重入影響零列，以及舊程序仍能寫入 NULL；尚未把新版 writer 與 contract 作完整部署驗收。

## 最後才收緊契約

本版 ApplyJudgment 尚未接收 source_name。練習須先擴充程序參數、輸入驗證、意圖比對與 INSERT，並測過新 writer，再執行 contract；不能把原程序當已升級版本。

只有在所有新寫入都有來源、舊版 writer 已退出、回填查詢為零，且可回復方案已記錄後，才把欄位改成必填：

```sql
IF EXISTS (SELECT 1 FROM dbo.Operations WHERE source_name IS NULL)
BEGIN
    ;THROW 51801, N'source_name 尚有 NULL，不能收緊契約', 1;
END;

ALTER TABLE dbo.Operations
ALTER COLUMN source_name nvarchar(40) NOT NULL;
```

Contract 之後，任何未提供來源的新操作都會失敗，這是資料庫替新契約守門。此時回退應用程式也要確認舊版會提供欄位；若還不能確定，保留 nullable schema 並先向前修正。不要為了讓部署「看起來回到原點」就 DROP 欄位：欄位可能已承載真實新資料。程式回版、schema 回版和資料回復是三種不同操作。

用三個版本在紙上排一次：舊版只讀舊欄位；相容版接受 NULL 並可寫 `source_name`；收緊版要求必填。標出哪一步舊 writer 必須退出、若 backfill 中斷如何重入，以及哪個觀察能證明可以進入 contract。

## 換個情境想一次

回填後有 12 筆 `legacy-unknown`。這表示 12 筆操作都來自同一個名為 `legacy-unknown` 的系統嗎？若新 writer 忘記傳來源，哪一道檢查會攔住它？

交卷後再對照[第 18 題解答](answers.md#q18)。來源：[SQL Server 新增欄位](https://learn.microsoft.com/en-us/sql/relational-databases/tables/add-columns-to-a-table-database-engine?view=sql-server-ver16)、[`ALTER TABLE`](https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-table-transact-sql?view=sql-server-ver16)。正式負載下的 DDL 鎖定、批次大小、程序崩潰與回版仍未驗證；不可把小資料實驗直接當生產部署計畫。
