# 04｜未判、空欄位與零分是一回事嗎？

## 問題

缺陷「目前沒有判定」和某次判定的 score 欄位為 NULL，不是同一種狀態。前者是沒有 Judgments 子列；後者是已經有一列判定，但該列的某欄沒有值。在本書 schema，score 為 NOT NULL，所以合法判定不能是 NULL 分數；未判用零次判定表示。零次不是一筆 score=0 的判定，也不是 score=NULL 的判定。

NULL 也不等於空字串或數字 0。它可能表示未知、尚未提供或不適用，實際含義要由欄位契約定義。拿它代替 PASS、FAIL 或 0，會把「沒有答案」偽裝成一個答案。

## 先預測

獨立小例有三列：score 為 NULL、0、80。score = NULL 會找到哪列？score IS NULL 呢？而 seed 的 Defects 中，哪個缺陷目前沒有任何判定事件？注意：這是兩個不同問題。

## SQL 有三種邏輯結果

SQL Server 的比較結果可能是 TRUE、FALSE 或 UNKNOWN。當 score 是 NULL，資料庫不知道它是否大於等於 80，因此 score >= 80 是 UNKNOWN；WHERE 只留下 TRUE，FALSE 和 UNKNOWN 都不會保留。一般比較不能用來測試缺值；必須寫 IS NULL 或 IS NOT NULL。

`VALUES` 在查詢中列出測試列；`AS v(label, score)` 替這組資料及其欄位命名。`WITH SampleScore AS (...)` 把查詢結果暫時命名為 SampleScore，供緊接的查詢使用，稱為通用資料表運算式（CTE），不會建立永久表。

以下是獨立的 NULL 教學資料，不改動 Judgments 的 NOT NULL 契約：

~~~sql
WITH SampleScore AS (
    SELECT * FROM (VALUES
        (N'未提供', CAST(NULL AS int)),
        (N'零分', 0),
        (N'八十分', 80)
    ) AS v(label, score)
)
SELECT label, score
FROM SampleScore
WHERE score IS NULL;
~~~

預期只回傳「未提供」。若把 WHERE 改成 score = NULL，不會回傳任何列，因為比較得到 UNKNOWN。若改成 score <> 80，只會留下零分；NULL 那列仍不是 TRUE。空字串只適用字串型別，零只適用數字型別；不要把不同表示方式當成同一種缺值。

要找「沒有判定列」的缺陷，查詢子列是否存在：

~~~sql
SELECT d.defect_id
FROM dbo.Defects AS d
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Judgments AS j
    WHERE j.defect_id = d.defect_id
);
~~~

按 seed 預期只回 defect_id=2。這代表 Judgments 目前沒有對應事件，不是 score 欄位裡有 NULL。此查法也直接說出業務問題：「沒有任何判定事件」。後面查詢章會看 NULL 如何由 LEFT JOIN 產生；JOIN 補出的 NULL 是結果表達，不是新寫入資料。

## 一個容易漏列的反例

~~~sql
WITH Candidate AS (
    SELECT x FROM (VALUES (1), (2)) AS v(x)
),
Excluded AS (
    SELECT x FROM (VALUES (1), (CAST(NULL AS int))) AS v(x)
)
SELECT c.x
FROM Candidate AS c
WHERE c.x NOT IN (SELECT e.x FROM Excluded AS e);
~~~

預期沒有候選列。對 x=2，排除集合中有 1，也有未知的 NULL；整體 NOT IN 無法判定為 TRUE，於是被 WHERE 丟掉。若問題是「找不到相等的已知排除值」，可用 NOT EXISTS 寫明關聯；但若 NULL 有特殊業務含義，先把契約定清楚，不要只換語法就猜需求。

## 把 UNKNOWN 寫進預測表

| 條件 | score 為 NULL 時的邏輯值 | WHERE 是否保留 |
|---|---|---|
| score = 80 | UNKNOWN | 否 |
| score <> 80 | UNKNOWN | 否 |
| score IS NULL | TRUE | 是 |
| score IS NOT NULL | FALSE | 否 |

這張表也能解釋為什麼「不是 80 分」不等於「低於 80 分或沒有分數」。如果報表要把未知另列一類，應寫明條件，例如以 CASE 表達 NULL、低於門檻、達門檻三種結果；不要假設 NOT 條件會自動包含未知值。

UNKNOWN 表示資訊不足，這個差別會一路影響到 JOIN 和 CHECK：外連接補出的 NULL 會讓右表條件不是 TRUE；CHECK 則有自己的規則，之後會看到 UNKNOWN 並不一定使寫入失敗。因此每次遇到 NULL，先問欄位代表什麼，再問 SQL 的結果值。

最後要區分「欄位缺值」和「關係不存在」。score IS NULL 查的是某一列的欄位；NOT EXISTS 查的是另一張表是否有相關列。前者是在問「已記錄的事件有沒有這個值」，後者是在問「事件是否存在」。這種語意差別比背一個語法更重要，因為一個缺陷可以完全沒有事件，也可以已經有事件但某個非必填描述欄尚未提供。

若要同時分類，可以把條件完整列出，而不是靠「不等於」猜出剩餘集合：score IS NULL 表示未提供；score < 50 表示已知低分；score >= 50 表示已知達標。因為 score 是整數且已被 NOT NULL 限制，正式判定列只可能落在後兩類；獨立 VALUES 的 NULL 讓我們看見若欄位可缺值時，分類少寫一支分支會漏掉什麼。這種明確分類也能讓報表清楚區分「未有資料」和「資料不符合」。

## 無提示題

寫查詢找出目前沒有判定事件的缺陷；再用一個含 NULL 的 VALUES 範例，展示一般比較與 IS NULL 的差別。最後指出空字串、0 分、NULL 分數、零次判定四者各代表什麼，以及在本書 schema 中哪些可出現。

> 小例子用來說明三值邏輯；NOT IN、CHECK 與 NULL 約束的對應實測見 [驗證紀錄](verification.md)。

答案：[answers.md｜04 NULL](answers.md#04-null)。

來源：[Microsoft Learn：NULL and UNKNOWN](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/null-and-unknown-transact-sql?view=sql-server-ver16)、[Microsoft Learn：IS NULL (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/queries/is-null-transact-sql?view=sql-server-ver16)
