# 20｜目前判定從哪裡來？沿著指標找，不要猜時間

同一缺陷可能被不同模型或操作者重判多次。螢幕要顯示「目前分數」，稽核又要能回答「是哪次請求、用哪個模型、誰提交、從哪種來源來」。若直接找 `created_at` 最大的判定，你已經證明它是目前值嗎？先預測：兩筆判定時間相同時，`TOP (1) ORDER BY created_at DESC` 會選哪一筆？若一次舊 operation 重送時缺陷已合法重判，應回傳新分數還是舊 operation 的原結果？

本書的 `dbo.Judgments` 保存每次判定；`dbo.Operations` 保存一次請求的意圖與結果版本，並用固定的 `judgment_id` 指向該次判定。`dbo.Defects.current_judgment_id` 是目前判定的明確指標。複合外鍵 `(defect_id, current_judgment_id)` 確保指標不能指向別的缺陷；這個關係才定義「目前」，不是排序欄位。已載入的歷史資料可以讓 `version_no = 0`，而目前指標已指向歷史判定；版本 0 表示後續編修的基線，不是判定數，也不是時間序號。

## 從目前列追到判定事件

下面查詢保留尚未判定的缺陷，並依目前指標取得分數、模型、操作者與紀錄時間。查詢不排序 `created_at`：

以下在 B02Lab 查詢。先完成 schema、安裝 ApplyJudgment 並跑操作實驗；涉及 source_name 的查詢還需完成第 18 章的加欄與回填。空的 Operations 沒有可追的操作，回零列是正常結果。

```sql
SELECT d.defect_id, d.batch_id, d.defect_no,
       d.version_no, d.current_judgment_id,
       j.score, j.model_version, j.operator_name, j.created_at
FROM dbo.Defects AS d
LEFT JOIN dbo.Judgments AS j
  ON j.defect_id = d.defect_id
 AND j.judgment_id = d.current_judgment_id
ORDER BY d.defect_id;
```

若指標是 NULL，左側缺陷仍會出現，判定欄位也是 NULL；不要把這列假裝成 score 0。只要想查一筆目前值，就帶入它的 `defect_id`，仍使用同一個關聯條件。若把 Judgments 先按 `created_at` 排序取第一列，結果回答的是「排序規則挑了哪列」，不等於 schema 有承諾「哪列目前有效」。時間值可以相同，資料也可能由匯入或修復流程寫入；就算再用 `judgment_id` 打破平手，也只得到確定的排序，不會憑空產生業務上的目前關係。

## operation 重送要回舊結果

一次請求以穩定的 `operation_id` 去重。資料庫已有此 ID 時，先核對 `defect_id`、`expected_version`、score、model 與操作者等意圖；一致就回傳這列記下的判定，不一致就拒絕 ID 重用。取回該次結果時沿 `Operations.judgment_id`，不要回頭讀 `Defects.current_judgment_id`，因為目前值可能已經是後來的新判定：

```sql
DECLARE @operation_id uniqueidentifier = 'b0200000-0000-0000-0000-000000000001';
-- 手工練習使用上述固定ID；應用中改由呼叫端綁定 uniqueidentifier 參數。

SELECT o.operation_id, o.defect_id, o.expected_version,
       o.result_version, o.score, o.model_version, o.operator_name,
       o.source_name, o.judgment_id,
       j.score AS recorded_score, j.created_at
FROM dbo.Operations AS o
JOIN dbo.Judgments AS j
  ON j.defect_id = o.defect_id
 AND j.judgment_id = o.judgment_id
WHERE o.operation_id = @operation_id;
```

`source_name` 是第 18 章新增的來源分類；舊列的 `legacy-unknown` 只表示來源不明。這個 schema 還沒有原始影像、輸入檔或模型完整輸入的欄位，因此只靠目前幾張表不能重播原始推論。需要重現時，另要有受控且不可變的輸入版本或內容雜湊，以及可定位的模型 artifact／設定；不能把 `model_version` 文字標籤說成完整實驗封存。

## 三份資料必須在同一交易說同一件事

成功的新判定要在同一資料庫交易內：先用 `expected_version` 條件更新 Defects 版本，確認只命中一列；再插入新的 Judgment；更新 `current_judgment_id`；最後插入 Operations，記錄 `expected_version` 和 `result_version = expected_version + 1`，並指回剛建立的 `judgment_id`。任何一步失敗就整筆回滾，否則可能出現目前指標指不到事件、或 operation 沒有判定的半套歷史。這是交易內的資料契約，SQL Server 的外鍵可守住部分關係，版本轉移與 operation ID 的意圖比對仍需交易流程共同完成。

`created_at` 適合表示事件時間；範例預設由 `SYSUTCDATETIME()` 提供 UTC 值，但 `datetime2` 欄位本身沒有時區位移，UTC 必須是明確寫入契約。[datetime2 型別](https://learn.microsoft.com/en-us/sql/t-sql/data-types/datetime2-transact-sql?view=sql-server-ver16) 即使時間精度到小數秒七位，也不是唯一鍵或可靠的全序。SQL Server 的 `rowversion` 是資料庫內遞增的二進位版本標記，不保存日期或時間；若採它做並行檢查，也不要拿來當模型版本或操作順序。[rowversion 型別](https://learn.microsoft.com/en-us/sql/t-sql/data-types/rowversion-transact-sql?view=sql-server-ver16)

seed 的 101–103 是預先載入的歷史，沒有對應 Operations 收據。這是這份資料的追溯缺口，不可替它們捏造請求來源；後來由 ApplyJudgment 建立的判定才具備完整操作鏈。

手工演練時，先找有兩筆以上判定的缺陷，對照 `current_judgment_id` 查目前值，再查每筆 operation 固定指向的 `judgment_id`。不需修改任何歷史列，也不要依 `created_at` 更新指標。同缺陷重判後查回舊操作的固定結果，已由操作驗收檔確認；這些查詢仍只追到教材已有的欄位，不能補出缺失的原始影像或模型產物。

## 換個情境想一次

目前指標指向判定 102；你發現另一筆 101 的 `created_at` 比 102 晚。哪個值是目前？還要查哪個 operation，才能說 102 是由哪次意圖建立？

交卷後再對照[第 20 題解答](answers.md#q20)。官方型別來源：[datetime2](https://learn.microsoft.com/en-us/sql/t-sql/data-types/datetime2-transact-sql?view=sql-server-ver16)、[rowversion](https://learn.microsoft.com/en-us/sql/t-sql/data-types/rowversion-transact-sql?view=sql-server-ver16)。原始輸入快照與模型 artifact 不在本例 schema 內；需要重播或法規級證據時再把那些來源納入資料契約。
