# 14｜查詢計畫：scan 不一定慢，seek 也不是答案

看到 `Table Scan` 或 `Index Scan`，你會立刻判定查詢很慢嗎？看到 `Index Seek` 就代表它一定比原本快嗎？先預測：若整張小表只有幾頁、查詢會回傳大部分資料，掃描可能更省；若表很大而條件只命中少數列，索引 seek 才可能減少讀取。計畫名稱描述存取方式，不能單獨替代量測。

## 預估與實際證據

SQL Server 最佳化器會根據查詢、schema、索引與統計資訊估計各階段的成本與列數，再選一個計畫。預估計畫只顯示估算；實際執行計畫包含該次執行的實際列數與執行期資訊。比較時先確認查詢結果相同，再看估計與實際列數差距、scan（掃描）、seek（依索引鍵定位）、排序、lookup（回表補取欄位）等運算子及讀取量。估算遠低於實際時，可能是統計資訊、資料分布或參數代表性問題；它是追查線索，不是直接加索引的命令。

## 量測一個固定查詢

在隔離探針表和代表性資料上，可以用這段量測查詢作起點；表與資料需由實驗另行準備，本段不是完整執行腳本，也沒有預填預期數字：

```sql
DECLARE @defect_id int = 1;
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

SELECT judgment_id, created_at, score
FROM #JudgmentProbe
WHERE defect_id = @defect_id
ORDER BY created_at DESC, judgment_id DESC;

SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;
```

在 SQL Server Management Studio 開啟「Include Actual Execution Plan」，或使用 `SET STATISTICS XML ON` 收集實際計畫；另記錄訊息區的 logical reads、CPU time 與 elapsed time。logical reads 是從資料快取讀取資料頁的次數，同一頁重複讀取也會計數；它不是回傳列數，也不是實際磁碟讀取次數。`STATISTICS IO/TIME` 是 session 層級量測選項，用完要關閉。

比較建索引前後時，固定資料、查詢、參數值和結果集合，記下 SQL Server build、compatibility level、統計狀態與索引定義。先暖機或重複量測，避免把快取冷熱或一次性排程差異誤說成索引效果。

本次 [萬筆探針](examples/08-index.sql) 在 100 列命中時，資料表 logical reads 由 36 降至 2；95% 命中的另一條聚合查詢則由無索引的 36 變成有索引的 42。這兩個結果說明索引效果取決於查詢；原始 XML 計畫與限制摘要見 [驗證紀錄](verification.md)。

## 讀取型態不是效能結論

執行計畫裡的 seek 仍可能需要讀很多索引頁，也可能為每列做 lookup；scan 則可能順序讀取少量頁面。估計成本是最佳化器比較方案的工具，不是實際毫秒保證。資料量、選擇率、參數、統計更新和 SQL Server build 都會影響選擇。不要用強制索引提示讓每次查詢固定走某一路，除非先有可重現的證據與維護理由。

反例是小表上看到 scan，便建一個昂貴的涵蓋索引；表長大後查詢仍可能受排序或 lookup 影響，而每次寫入已多維護一份索引。另一個反例是只比較牆鐘時間一次，卻忽略結果列數不同、快取狀態不同或索引資料量未一致。正確比較至少要有相同輸出、實際計畫、logical reads 和代表性資料量；若只在小型實驗看出差異，結論也只適用該實驗。

**無提示題**：同一查詢在小資料集選 scan、大資料集選 seek；兩者輸出一致。列出你會記錄的四項證據，再說明哪種額外證據才能支持「索引在目標工作負載有幫助」的結論。答題後看 [answers.md 的第 14 題](answers.md#ch14)。

**官方來源**：[Execution Plans Overview](https://learn.microsoft.com/en-us/sql/relational-databases/performance/execution-plans?view=sql-server-ver16)、[Display an Actual Execution Plan](https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-an-actual-execution-plan?view=sql-server-ver16)、[SET STATISTICS IO](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-io-transact-sql?view=sql-server-ver16)、[SET STATISTICS TIME](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-time-transact-sql?view=sql-server-ver16)。章內例子以 SQL Server 2022、compatibility level 160 為基線；實測只支持指定探針與查詢。
