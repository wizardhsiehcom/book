# 13｜索引：讓常見讀取少走路，也讓寫入多做事

讀取一個缺陷的判定歷史，常會使用這種形狀：依 `defect_id` 篩選，按建立時間由新到舊排序，最後列出判定資訊。先預測：哪個欄位應放在複合索引最前面？如果索引只有 `created_at`，能否直接定位到某一個缺陷？索引不是抽象的「加速器」，它是資料庫維護的一份有序結構，能否幫忙取決於鍵順序是否符合查詢。

## 先看查詢形狀

固定 schema 的 `dbo.Judgments` 需要保存所有歷史判定。查詢可寫成：

```sql
SELECT judgment_id, created_at, score, model_version, operator_name
FROM dbo.Judgments
WHERE defect_id = @defect_id
ORDER BY created_at DESC, judgment_id DESC;
```

## 候選索引與前綴

可能的索引形狀是 `(defect_id, created_at DESC, judgment_id DESC)`：先用等值條件找到一個缺陷的區段，再沿索引已有的時間與 ID 順序讀取。若輸出欄位都在索引鍵或 `INCLUDE` 欄位，資料庫有機會不用再回主資料列查值，稱為涵蓋查詢。實際候選可在隔離探針表中試：

```sql
-- 示意片段：假設 #JudgmentProbe 已有下列欄位與代表性資料。
CREATE INDEX IX_JudgmentProbe_Defect_Time
ON #JudgmentProbe(defect_id, created_at DESC, judgment_id DESC)
INCLUDE(score, model_version, operator_name);
```

這不是建立教材完整 schema 或正式部署索引的腳本。正式表只有三筆 seed 判定，資料太少，不能用它推論生產查詢需要哪個索引；實驗應複製到獨立資料集，按實際查詢和資料量觀察。`judgment_id` 主鍵、`Defects` 的業務唯一鍵可能已由約束建立索引，但不能只看約束名稱推定索引的實際鍵順序或叢集型態。

## 寫入成本與反例

複合索引通常先放查詢會固定比對的欄位，再放需要排序或範圍掃描的欄位；常見前綴查詢才可能直接用上索引。若日後查的是「全表分數大於 90」，這個以 `defect_id` 起頭的索引未必能有效定位那些列。`INCLUDE` 欄位可減少回表，卻仍佔儲存空間，欄位更新時索引頁也要維護。每新增一筆 `Judgments`，候選索引都增加一次寫入工作；更多索引還會增加備份容量、快取壓力與維護成本。

反例是只因某個查詢用了 `WHERE`，就替每個篩選欄位各建一個索引；或看到執行計畫中的 scan 就認為必須改成 seek。若表只有幾頁，順序掃描成本可能比查索引再回表更低。索引設計要同時回答：查詢讀了多少資料、結果需要什麼順序、寫入頻率與索引維護成本是否可接受。唯一索引也能承載資料規則，但這裡的讀取索引不取代已存在的 PK、FK、UNIQUE 或 CHECK。

**無提示題**：設計一個索引支援「查單一缺陷的最新判定歷史」，列出鍵欄位順序、可能需要的涵蓋欄位，以及它對新增判定的成本。再說明為何不能從三筆 seed 資料直接得出正式索引結論。答題後看 [answers.md 的第 13 題](answers.md#ch13)。

**官方來源**：[Index Architecture and Design Guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide?view=sql-server-ver16)、[CREATE INDEX](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-index-transact-sql?view=sql-server-ver16)。索引形狀是待量測的候選，不代表已在 SQL Server 2022 驗證其效能。
