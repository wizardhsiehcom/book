# 03｜SELECT 到底選中了哪些列？

## 問題

查詢不是「把資料庫裡看起來像我要的東西撈出來」。先問清楚三件事：從哪張表取列、哪些列符合條件、輸出哪些欄位。接著要說明重複列是否代表重複錯誤，還是不同事件。

Judgments 的一列代表一次判定。defect_id=1 在 seed 有 101 與 102 兩列，因為它曾被判定兩次；兩列分數不同，不能只因實體相同就合成一列。

## 先預測

若只看分數至少 80 的判定，會選到哪些 judgment_id？若只輸出 defect_id，結果有幾列？沒有 ORDER BY 時，結果是否保證依 judgment_id 排列？先在紙上寫下預測再讀 SQL。

## 選列、篩列、排序

~~~sql
DECLARE @minimumScore int = 80;

SELECT defect_id, judgment_id, score
FROM dbo.Judgments
WHERE score >= @minimumScore
ORDER BY defect_id, score DESC, judgment_id;
~~~

依 seed，條件留下 101（80 分）與 102（90 分），順序是 102 後 101，因為同一 defect_id 下依 score 遞減。這是人工推導預期，不是執行紀錄。SELECT 清單決定回傳欄位；WHERE 限定符合條件的列；ORDER BY 決定呈現順序。若想在結果中容易區分事件，就要把判定 ID 一起選出來，不要只看分數。

SQL 表不是有固定順序的電子表格。沒有 ORDER BY，讀者不能要求資料庫按插入順序、主鍵順序或「這次剛好看見的順序」回傳。即使有 ORDER BY，也要處理平手：若用 ORDER BY score DESC，分數相同的兩列仍沒有完整排序規則。可加唯一事件 ID 作平手鍵；那只定義顯示順序，不代表 judgment_id 大的事件一定比較晚，也不推翻「時間不可靠全序」的教學界線。

## 重複不是自動去除的雜訊

~~~sql
SELECT DISTINCT defect_id
FROM dbo.Judgments
WHERE score >= 80;
~~~

上面只會列出 defect 1 一次。若問題是「哪些缺陷曾出現 80 分以上」，這個投影可符合需求；若問題是「列出判定事件」，則它遺失了 101 與 102 的事件差異。DISTINCT 作用在整組輸出欄位，不是修正模型的開關；加上 judgment_id 後兩列又會都回來。先定義結果的一列代表什麼，才知道何時去重有意義。

篩選條件也要與資料型別和需求相配。分數用整數，可直接和整數參數比較；應用程式送值時應使用資料參數，而非把使用者輸入拼成 SQL 文字。參數能讓值作為值處理；它不會替你決定要查哪些欄位或放寬授權。這裡 DECLARE 只是讓小例子可讀，實際程式應由驅動程式綁定 @minimumScore。

## 反例

以 TOP 取「最高分判定」卻沒有 ORDER BY，結果沒有業務意義。加 ORDER BY score DESC 仍可能在最高分平手時任選其一；再加 judgment_id 只會確定平手時的技術順序。若業務真正要「目前判定」，必須另有明確目前值規則，不能把最大分數、最大 ID 或最新時間擅自當成答案。

## 查詢的輸出契約

可以把一條 SELECT 當作一個小型資料介面：呼叫者需要哪些欄位、哪些列、依什麼順序看，都是契約的一部分。回傳三個欄位和回傳整列不是同一種介面；後者容易讓使用者依賴不需要的欄位。未來欄位增加或型別調整時，依賴過多的查詢也更難維護。初學時可明確列出欄名，讓讀者看得出每個輸出值來自哪裡。

把條件值與查詢文字分開，還有安全和正確性上的理由。若把使用者輸入直接串成 SQL，輸入中的引號和運算子可能改變原本語句結構；參數化讓輸入留在「值」的位置。參數不會代替輸入驗證，例如 80 分以外的門檻是否合理仍是需求規則；資料庫型別也不會替需求決定排序方式。

## 無提示題

給自己一個條件：列出所有分數低於 80 的判定，按缺陷、分數與判定 ID 排序。先說會選出幾列，再寫 SELECT。然後說明為什麼 defect_id 不足以列舉判定事件，以及把 DISTINCT 加在結果上會改變什麼。

> 請先手算再執行；對應查詢斷言與已驗範圍見 [驗證紀錄](verification.md)。

答案：[answers.md｜03 查詢](answers.md#03-query)。

來源：[Microsoft Learn：SELECT (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql?view=sql-server-ver16)、[Microsoft Learn：Table value constructor (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/queries/table-value-constructor-transact-sql?view=sql-server-ver16)、[Microsoft Learn：SQL injection and type-safe SQL parameters](https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-injection?view=sql-server-ver16)
