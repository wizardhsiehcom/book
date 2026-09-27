# 06｜判定數量為什麼容易多算？

## 問題

「缺陷數」與「判定事件數」不是同一個分母。缺陷 1 被重判兩次，若 JOIN 後直接對 defect_id 做 COUNT(*)，會把它計兩次；缺陷 2 沒有判定，但 LEFT JOIN 仍會產生一列右側全 NULL 的結果。先問數字要數的是來源列、實體，還是事件。

## 先預測

把三個缺陷 LEFT JOIN 到判定歷史，結果列數是多少？COUNT(*) 幾列？COUNT(j.judgment_id) 幾筆事件？依批次計算缺陷數和判定數，答案各是多少？先寫下「一次計數代表什麼」。

## COUNT 數的是它收到的輸入

~~~sql
SELECT
    COUNT(*) AS joined_rows,
    COUNT(j.judgment_id) AS judgment_events
FROM dbo.Defects AS d
LEFT JOIN dbo.Judgments AS j ON j.defect_id = d.defect_id;
~~~

手算結果是 joined_rows=4、judgment_events=3。前者數 JOIN 結果列，包含缺陷 2 的補齊列；後者只計 judgment_id 非 NULL 的配對事件。COUNT(expression) 忽略 NULL，而 COUNT(*) 不檢查欄位是否有值。相同規則在小例中更明顯：

~~~sql
SELECT COUNT(*) AS rows_seen, COUNT(value) AS non_null_values
FROM (VALUES (1), (CAST(NULL AS int)), (2)) AS v(value);
~~~

預期是 3 列與 2 個非 NULL 值。若查詢從 Judgments 直接起算，沒有任何事件的缺陷不會進入聚合；若報表必須列出零事件缺陷，要以 Defects 或 Batches 作為左側資料來源，再 LEFT JOIN 或補上零值。

## 先按正確粒度各自計數

以下把「缺陷數」在 Defects 逐列計，把「判定數」在缺陷連判定後計；最後再接回批次。這避免一個度量因另一側一對多而被重複展開。兩個 CTE 都以一列代表一個批次：DefectCounts 保存該批次的缺陷數，JudgmentCounts 保存判定事件數；最後用 batch_id 把兩份計數接起來：

~~~sql
WITH DefectCounts AS (
    SELECT batch_id, COUNT(*) AS defect_count
    FROM dbo.Defects
    GROUP BY batch_id
),
JudgmentCounts AS (
    SELECT d.batch_id, COUNT(j.judgment_id) AS judgment_count
    FROM dbo.Defects AS d
    LEFT JOIN dbo.Judgments AS j ON j.defect_id = d.defect_id
    GROUP BY d.batch_id
)
SELECT b.batch_id,
       COALESCE(dc.defect_count, 0) AS defect_count,
       COALESCE(jc.judgment_count, 0) AS judgment_count
FROM dbo.Batches AS b
LEFT JOIN DefectCounts AS dc ON dc.batch_id = b.batch_id
LEFT JOIN JudgmentCounts AS jc ON jc.batch_id = b.batch_id
ORDER BY b.batch_id;
~~~

預期批次 10 是 2 個缺陷、2 次判定；批次 20 是 1 個缺陷、1 次判定。GROUP BY 把具有相同分組鍵的輸入列收成一組；它不會推理你要數什麼。COALESCE 在這裡把沒有任何輸入群組的計數顯示成 0；它沒有把資料表中的缺值改寫。

## 平均數也有粒度

同一份分數可以回答不同問題。若把每次判定視為一個觀測值，seed 的事件平均為 (80+90+70)/3=80；缺陷 1 的兩次判定各算一次。若先替每個已判定缺陷求平均，缺陷 1 是 85、缺陷 3 是 70，再對兩個缺陷平均則是 77.5。兩個平均都能正確計算，卻代表不同分母；前者回答「一次判定平均幾分」，後者回答「一個有判定的缺陷平均幾分」。

因此在寫 AVG 前，先說誰有一票。重判次數多的缺陷，在事件平均中權重較高；若業務要每個缺陷等權，就要先按 defect_id 算每個缺陷的平均，再對缺陷平均。不要只看函式名稱判斷報表是否正確，查詢的粒度和權重定義必須一致。

GROUP BY 也不會自動排序，若報表需要固定顯示順序，仍須加 ORDER BY。NULL 分組值會聚成一組，但那只代表欄位值相同為缺值，不代表這些列的缺值原因相同。若需區分未知來源和不適用，資料模型要另外保存原因，不能由 GROUP BY 猜測。

在這個例子中，用 COUNT(DISTINCT d.defect_id) 單獨計算三個不同缺陷也會得到正確的數字，因為問題和分母都明確是「不同缺陷」。但若下一步把兩次判定與多張影像一起 JOIN，再對幾個欄位分別 DISTINCT，可能得到互不相干的數字組合；那仍無法說清每一列的意義。DISTINCT 是一個聚合操作，不是修正 JOIN 鍵、資料粒度或業務定義的通用橡皮擦。先整理到正確粒度，後續每個 COUNT 才能由讀者驗算。

## 無提示題

手算每批次的缺陷數、判定事件數，再用兩個分開的聚合查詢把它們接到 Batches。解釋為什麼 COUNT(*) 和 COUNT(j.judgment_id) 不相等；再說若直接計算 JOIN 後的缺陷列數，缺陷 1 會造成什麼偏差。

> 數字由合成 seed 手算；未宣稱由引擎回傳。

答案：[answers.md｜06 聚合](answers.md#06-aggregation)。

來源：[Microsoft Learn：COUNT](https://learn.microsoft.com/en-us/sql/t-sql/functions/count-transact-sql?view=sql-server-ver16)、[Microsoft Learn：GROUP BY](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-group-by-transact-sql?view=sql-server-ver16)
