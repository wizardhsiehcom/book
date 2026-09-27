# 15｜重送與重判，需要不同的身分

匯入器送出「把缺陷 2 判成 80 分」，等了五秒沒有回覆，於是再送一次。隔天工程師改用模型 m2，將同一缺陷判成 90 分。兩次輸入都指向缺陷 2，但前者是在補送同一意圖，後者是新的判定。用 `defect_id` 去重，會把合法重判擋掉；每次重送都產生新 ID，則會重複新增歷史。

## 先預測

操作 X 成功，留下判定 J1、結果 80、版本 1；操作 Y 隨後成功，留下 J2、結果 90、版本 2。現在 X 重送：應回 80 還是 90？應把目前值改回 80 嗎？先把兩個問題分開回答，再讀下面的表。

| 識別值 | 回答的問題 | 本書例子 |
|---|---|---|
| defect_id | 正在處理哪個缺陷？ | 2 |
| judgment_id | 哪一次已保存的判定？ | J1 或 J2 |
| operation_id | 這是不是同一次業務意圖？ | X 或 Y |
| expected_version | 這次意圖基於哪一版？ | X 基於 0，Y 基於 1 |

`operation_id` 必須在第一次送出前產生，且與待送內容一起持久化。程序重啟後需要找回同一 ID。UUID 只降低撞號機率，不會替你保存 ID，也不會自動定義「同一次」。

## 先定義意圖，才能比較是否重送

本書把意圖定為 `(defect_id, expected_version, score, model_version, operator_name)`。同一 ID 且所有欄位相同，回傳當次保存的結果；同一 ID 但任何欄位不同，回報衝突。若使用者重新讀了目前狀態，再決定重判，那是新意圖、新 ID。

`expected_version` 也是意圖的一部分。收到版本衝突後，偷偷把 0 改成最新的 1 再重送，等於替使用者重新授權覆蓋；它不再是單純的網路重試。操作者欄位是教材輸入，正式系統應由已驗證的身分提供，不能讓請求自行冒充。

文字比較也需要契約。資料庫的預設定序可能忽略大小寫或將尾端空白視為相等。本書範例明定模型與操作者以儲存的 UTF-16 位元組精確比較，先驗長度，再以 `varbinary` 比較；它不做 Unicode 正規化。若產品希望等價字形視為同一名稱，應先制定正規化規則並保存正規化後的意圖，不能任憑 driver 或定序替你決定。

## 把新操作完整寫入一次

完整可讀腳本是 [ApplyJudgment](examples/05-apply.sql)。程序要求呼叫者沒有既有交易，依序：

1. 驗證 ID、版本、分數與文字長度。
2. 在交易內鎖住操作 ID 的既有列或不存在的鍵範圍。
3. 若操作已存在，核對意圖，回傳它保存的 `judgment_id` 與 `result_version`。
4. 若是新操作，條件更新缺陷版本；影響列必須為 1。
5. 新增歷史判定、更新目前指標、保存操作與結果，一起提交。

關鍵片段如下；它必須位於同一個明確交易裡，不能只複製第一個 SELECT：

```sql
SELECT operation_id
FROM dbo.Operations WITH (UPDLOCK, HOLDLOCK)
WHERE operation_id = @operation_id;

UPDATE dbo.Defects
SET version_no = version_no + 1
WHERE defect_id = @defect_id AND version_no = @expected_version;
-- 立即檢查 @@ROWCOUNT，再新增判定與操作紀錄。
```

`HOLDLOCK` 給此表參照 SERIALIZABLE 語意；`UPDLOCK` 使競爭者不能都拿著相容的讀鎖往寫入升級。同 ID 的第二個執行者可能等待，等第一個提交或回滾後再判斷。唯一主鍵仍是最後的約束。這不保證不死鎖，也不保證只擋住一個 ID：不存在鍵的範圍鎖可能涵蓋其他 ID，尤其表還很小時。先量測等待，再考慮不同協調策略。參見官方 [table hints](https://learn.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-table?view=sql-server-ver16)。

範例為所有新判定分配 sequence 值。回滾可能留下號碼缺口，因此不以連號判斷有沒有遺失資料，也不以跨缺陷的號碼大小推定提交先後。這符合 [SQL Server sequence 的行為](https://learn.microsoft.com/en-us/sql/relational-databases/sequence-numbers/sequence-numbers?view=sql-server-ver16)。

## 舊結果與目前結果分開查

```sql
-- 「X 當時做了什麼」：固定指向原判定。
SELECT operation_id, judgment_id, score, result_version
FROM dbo.Operations
WHERE operation_id = 'b0200000-0000-0000-0000-000000000001';

-- 「現在認定什麼」：沿目前指標取得。
SELECT d.defect_id, j.judgment_id, j.score
FROM dbo.Defects AS d
LEFT JOIN dbo.Judgments AS j
  ON j.defect_id = d.defect_id AND j.judgment_id = d.current_judgment_id
WHERE d.defect_id = 2;
```

X 重送應回 80，且不改動目前的 90。若只拿 `Operations.score` 去核對缺陷的目前分數，合法重判後就會誤報資料壞掉。

直接修改歷史表仍能破壞這個約定。範例 `B02Writer` role 只取得執行程序與讀取權，不取得直接寫歷史表的權限；資料庫管理員依然能變更資料。這是應用帳號的邊界，不是不可竄改稽核庫。一般範例不刪操作紀錄，到 [保留期](21-retention.md) 才討論清理契約。

## 操作觀察

先在乾淨 seed 安裝程序，執行 [順序重送檢查](examples/06-operation-checks.sql)。讀出第一次結果、第二次合法重判後的目前結果，再送第一次操作。預期有兩筆歷史、版本為 2、舊結果不漂移。這組斷言已在本輪引擎通過，環境與限制見 [驗證紀錄](verification.md)。

接著依 [L05 雙連線步驟](labs.md#l05) 讓第二個 session 在第一個尚未提交時送出同 ID。驗收不能只看「沒有例外」：要對帳操作筆數、事件筆數、結果一致性、交易是否清理。若出現逾時或死鎖，先回滾並在新交易查核，不能把任何錯誤都翻譯成「已經做過」。

## 無提示題

模型名稱從 `m1` 改成 `M1`，但操作 ID 沒變；第一次操作成功後，缺陷又被重判。你會比較哪些欄位、回什麼結果、是否改動目前值？另列一個不能靠唯一主鍵單獨保護的不變條件。

[答案](answers.md#q15) · [下一章：結果未知](16-unknown-outcome.md)
