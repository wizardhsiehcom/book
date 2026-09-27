# 05｜接上判定歷史，為什麼列數變多？

## 問題

JOIN 是依條件把來源列配成結果列。若一個缺陷有兩次判定，它會和兩筆判定各配一次；這不是資料庫重複輸出同一列，而是一對多關係在查詢結果中的自然展開。先確定查詢每列想代表什麼，再判斷筆數是否異常。

## 先預測

seed 有三個缺陷：1 有兩次判定，2 沒有，3 有一次。若用 INNER JOIN 連缺陷與判定，輸出幾列、哪些缺陷消失？若改 LEFT JOIN，輸出幾列？再把 score >= 80 分別放到 ON 與 WHERE，未判及低於 80 的缺陷會留下嗎？

## 手算配對

~~~sql
SELECT d.defect_id, j.judgment_id, j.score
FROM dbo.Defects AS d
INNER JOIN dbo.Judgments AS j ON j.defect_id = d.defect_id
ORDER BY d.defect_id, j.judgment_id;
~~~

INNER JOIN 只回傳相符組合：預期三列是 (1,101)、(1,102)、(3,103)。缺陷 2 沒有配對，所以不出現在結果。換成 LEFT JOIN 後，左表 Defects 的每列都保留；右側沒有配對時，右側欄位以 NULL 表示。預期四列：(1,101)、(1,102)、(2,NULL)、(3,103)。其中兩列屬於缺陷 1，因它確實有兩筆歷史事件。

~~~sql
SELECT d.defect_id, j.judgment_id, j.score
FROM dbo.Defects AS d
LEFT JOIN dbo.Judgments AS j
    ON j.defect_id = d.defect_id
   AND j.score >= 80
ORDER BY d.defect_id, j.judgment_id;
~~~

此查詢保留所有缺陷，只把達到門檻的判定接上。預期四列：缺陷 1 配到兩列，缺陷 2 沒有符合事件，缺陷 3 只有 70 分也沒有符合事件，所以兩者各呈現一列右側 NULL。若把 j.score >= 80 移到 WHERE，JOIN 後再篩結果；預期只剩 (1,101) 和 (1,102) 兩列。缺陷 2、3 的右側值為 NULL，條件結果不是 TRUE，於是整列被移除。這樣 LEFT JOIN 的保留效果被 WHERE 條件抵消，結果近似「只要符合條件的內連接」。

ON 指出哪種列可配對，也能放右表配對限制；WHERE 篩選 JOIN 後的結果。INNER JOIN 在許多只涉及兩表的條件下移動限制位置可能不改結果；OUTER JOIN 下則不能不看語意就搬動。看見 LEFT JOIN 不能保證原列留下，要追完整個 WHERE 條件。

## JOIN 不認得你的業務意圖

三張表要沿著鍵接：Batches.batch_id → Defects.batch_id → Judgments.defect_id。只拿 defect_no=1 連表會讓批次 A、B 的同編號互相配錯。Foreign key 保護引用有效性；JOIN 條件仍要由查詢作者寫對。

若兩側各有多筆可配對列，結果數量會相乘。之後加上影像歷史表，如果每個缺陷 2 筆判定和 3 張影像都直接連在一起，同一缺陷會形成 2×3=6 列配對。列變多可能是正確的組合，也可能說明你其實該先彙總其中一側；不要用 DISTINCT 把錯誤粒度遮住。

## 用基數先估列數

一對多連接可用「每個左列有幾個符合的右列」手算。INNER JOIN 對每筆缺陷輸出其符合判定數；數量為零的缺陷消失。LEFT JOIN 對有配對者輸出每一個配對，對沒有配對者則輸出一列補 NULL。因此 LEFT JOIN 的輸出列數等於所有缺陷各自 max(1, 符合判定數) 的總和。本例是 max(1,2)+max(1,0)+max(1,1)=4。

如果忘了 ON 條件，兩張表的每一列會和另一張的每一列組合。三個缺陷乘上三筆判定會得到九列，再用 WHERE 亂刪也不會自動變成正確關聯。即使 ON 存在，只要鍵選錯，也可能得到筆數看似合理但配對錯誤的結果。對帳時除了數列，還要抽查輸出中的批次、缺陷 ID 與判定 ID 是否真的屬於同一條關係鏈。

沿著關係方向檢查鍵，可以降低錯接的機會：先用 Batches.batch_id 找該批次的 Defects，再以 defect_id 找判定事件。若省略批次，或以缺陷編號當唯一連接條件，同名缺陷就會互相連上。LEFT JOIN 補出的 NULL 表示「這個左列沒有符合這條 ON 條件的右列」，它不一定能告訴你「資料庫裡從未有過任何歷史」；如果 ON 有分數門檻，低分歷史也會被視為沒有符合列。要回答「曾經有沒有任何判定」就不應把門檻混進存在性問題。

## 無提示題

不看前文，寫出列出所有缺陷及符合 score >= 80 判定的 LEFT JOIN。分別列出放在 ON 與 WHERE 時的行數，並指出哪種寫法保留未判缺陷。最後說明一對多 JOIN 的輸出一列代表什麼。

> 列數為依 seed 手算的預測，不是 SQL Server 實測結果。

答案：[answers.md｜05 JOIN](answers.md#05-joins)。

來源：[Microsoft Learn：FROM and JOIN](https://learn.microsoft.com/en-us/sql/t-sql/queries/from-transact-sql?view=sql-server-ver16)、[Microsoft Learn：SELECT](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql?view=sql-server-ver16)
