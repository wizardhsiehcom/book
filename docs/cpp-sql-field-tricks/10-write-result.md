# 10｜它說成功，不代表真的改到那一列

程式說完成，畫面重新整理卻沒變。你重跑一次，還是沒變。這時先把「SQL 執行完」和「這筆業務真的完成」拆開，不要用第二次按鈕碰碰運氣。

## 留一列，做三種 UPDATE

本章使用專用 `Jobs` 的 job_id 1；在同一個可回滾交易中，依序用正確 key、不存在 key、相同新舊值更新。執行前先猜每個 affected rows 是多少：

```powershell
.\run-sql-case.ps1 rows
```

本版結果是 1、0、1。最後一次的值本來已是 20，仍回 1；所以不能把 count 一律解讀為「真正值有改變的列數」。其他 DB／driver 的契約另查，不照搬這組數字。

## 這章真的讓範例自己踩了一次坑

第一版把 execute 的回傳丟給通用 `SQL_SUCCEEDED`。第二條、找不到 key 的 UPDATE 回 `100`，程式就印 FAIL，根本沒走到 row count。當時的推理少了一步：先問這個回傳碼在**這個 API 階段**代表什麼。

查核 `SQLExecDirect` 契約後，確認 searched DML 零列可回 `SQL_NO_DATA`。修正只放在 execute 分支，保留後續 count 觀察，再重跑得到 1／0／1；沒有把所有 `SQL_NO_DATA` 全域當成功。fetch 沒有下一列，和 UPDATE 沒命中，是不同事件。

## 用三格證據，不用一個 bool

| 層次 | 本次要回答的問題 | 不足之處 |
|---|---|---|
| API 狀態 | 執行是否完成、有無診斷？ | 不保證 key 命中 |
| 命中／影響列數 | 是否符合預期的一列？ | 可能不可得；也不代表值真的改變 |
| 後置條件 | 完整主鍵讀回是不是想要的值？ | 可能是原本相同或被其他 writer 改的 |

範例用 job_id 1 讀回 score 20，再 rollback。真實工作還可能有版本條件、租戶 key 或狀態條件，漏一欄就不是同一個意圖。若 count 為零，先比對這些條件，不開始重試全批。

count 不可得的 `-1` 也要獨立保存，不能變成 0。`SELECT` 的筆數則不能通用地從 `SQLRowCount` 得到；第 07 章已看到 -1 和真正有資料可以同時成立。

## 多一次讀回，值得嗎？

調查時很值得，因為你第一次有證據拆解「沒變」。日常高頻寫入未必要每次查回，可依風險保留版本條件、操作識別或抽樣檢查。這是額外 round trip 與正確性證據的取捨，不是所有專案必須用同一套模式。

並行者存在時，讀到正確值還不能證明是你寫的。下一步先看[交易範圍](11-rollback.md)，再看[失敗與操作紀錄](15-retry.md)。

## 換個情境想一次

affected rows 不可得，但讀回值正確。可以直接說本次更新成功嗎？

<details><summary>核對判準</summary>

只能說目前觀察的後置值符合。若要歸因於本次操作，還要排除原值相同、其他 writer，或用版本／operation ID 建立更強證據。

</details>

來源：[SQLExecDirect](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlexecdirect-function)、[SQLRowCount](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlrowcount-function)；[實測](appendix-validation.md)。
