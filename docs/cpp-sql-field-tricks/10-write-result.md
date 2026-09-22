# 10｜它說成功，不代表真的改到那一列

程式說完成，畫面重新整理卻沒變。你重跑一次，還是沒變。這時先把「SQL 執行完」和「這筆業務真的完成」拆開，不要用第二次按鈕碰碰運氣。

## 從「SQL 選對了」走到「真的命中工作 1」

[上一章](09-fixed-sql.md)把 SQL 的選擇限制在有限範圍，但固定 SQL 仍可能帶錯工作編號。本章回到已實作的 `sql_lab.cpp`，搜尋 `rows(Connection& c)`；不必加入上一章的設計函式，也不用修改或重建程式。

這次是真的寫 `Jobs.score`，不是 `process_job` 在記憶體裡算出 20。只使用[專用合成庫](appendix-lab.md#sql-lab)，並單獨跑案例。`job_id=1` 存在，`job_id=999` 不存在；程式把要做的三句 UPDATE 放在同一個迴圈裡：

| 順序 | 原碼中的固定 SQL | 執行前的預測 |
|---|---|---|
| 1 | `UPDATE dbo.Jobs SET score=20 WHERE job_id=1` | 找到工作 1，回報影響一列 |
| 2 | `UPDATE dbo.Jobs SET score=20 WHERE job_id=999` | 條件找不到列；語法合法，不應猜成 SQL 打錯 |
| 3 | `UPDATE dbo.Jobs SET score=20 WHERE job_id=1` | 找到同一列，但它已是 20；count 會是 0 還是 1？ |

`WHERE` 是找列的條件，`SET` 才是對找到的列做什麼。先預測第三句的 count，再執行，不要先把「影響一列」等同「一個值從舊變新」。

## 跑之前，先認出暫存與還原的位置

函式開頭的實際片段是：

```cpp
const int before = scalar(c, "SELECT COALESCE(score,-1) FROM dbo.Jobs WHERE job_id=1");
c.transaction();
int index = 0;
const SQLLEN expected[] = {1, 0, 1};
```

`scalar` 是本書「查詢並取一個整數」的 helper。`COALESCE(score,-1)` 在 score 是 NULL 時回傳 -1，讓本例用整數保存基準；不是 UPDATE，也不是所有資料都適合的 NULL 轉換方式。

`c.transaction()` 關掉這條連線的自動提交，使接下來的寫入暫時不提交，最後一起 rollback 撤回。先只知道這是 **rows 已內建的隔離步驟**；下一章再用兩輪對照解釋為什麼呼叫順序重要。不要只複製三條 UPDATE，漏掉外圍交易。

迴圈內每次執行後都讀 count；以下為原碼拆行排版：

```cpp
Statement s(c);
s.exec(query);
SQLLEN count = -1;
check(SQLRowCount(s.h, &count), SQL_HANDLE_STMT, s.h, "row-count");
std::cout << "affected=" << count << '\n';
expect(count == expected[index++], "row-count differs from this lab's pinned driver baseline");
```

`SQLRowCount` 問的是目前這份 statement 的受影響列數，不是整張 `Jobs` 有幾列。`expected` 將本書指定 driver 的 1／0／1 寫成斷言，不宣稱是所有 DB 的規則。

## 現在跑一次，看零列落在哪一步

從存放範例檔案與 `build` 的 PowerShell 目錄執行：

```powershell
Set-Location D:\scratch\cpp-sql-lab
.\run-sql-case.ps1 rows
```

確認 `case=rows` 後，本版輸出的關鍵順序如下；連線資訊診斷可能插在其中：

```text
affected=1
execute=SQL_NO_DATA (inspect row count)
affected=0
affected=1
independent rollback verification=matched baseline
PASS
```

第二句 UPDATE 沒命中，所以 execute 有特別訊息，仍繼續讀到 count 0。第三句新舊值相同，這個 driver／引擎組合仍回 1；count 因而不是「值真正變動的列數」。若你的數字不同，先保存版本、診斷與 DB 基準，不直接改 expected 讓它變綠。

## 這章真的讓範例自己踩了一次坑

第一版把 execute 的回傳丟給通用 `SQL_SUCCEEDED`。第二條、找不到 key 的 UPDATE 回 `100`，程式就印 FAIL，根本沒走到 row count。當時的推理少了一步：先問這個回傳碼在**這個 API 階段**代表什麼。

查核 `SQLExecDirect` 契約後，確認這類依 WHERE 搜尋的 UPDATE／DELETE 零列可回 `SQL_NO_DATA`。目前 `Statement::exec` 的關鍵分支如下，僅將原碼拆行：

```cpp
const auto rc = exec_raw(text);
if (rc == SQL_NO_DATA) {
    std::cout << "execute=SQL_NO_DATA (inspect row count)\n";
    return;
}
check(rc, SQL_HANDLE_STMT, h, "execute");
```

這只讓**本實驗的 execute 包裝器**保留後續 count 觀察，不是通用 SQL 執行器的完整契約。沒有把 `check()` 改成全域接受 `SQL_NO_DATA`：第 07 章 fetch 沒下一列，與這裡 UPDATE 沒命中，是不同事件。

## 用三格證據，不用一個 bool

| 層次 | 本次要回答的問題 | 不足之處 |
|---|---|---|
| API 狀態 | 執行是否完成、有無診斷？ | 不保證 key 命中 |
| 命中／影響列數 | 是否符合預期的一列？ | 可能不可得；也不代表值真的改變 |
| 後置條件 | 完整主鍵讀回是不是想要的值？ | 可能是原本相同或被其他 writer 改的 |

迴圈後還有以下實際查驗，不是 count 印完便算結束：

```cpp
expect(scalar(c, "SELECT score FROM dbo.Jobs WHERE job_id=1") == 20, "postcondition");
c.end(SQL_ROLLBACK);
Connection verifier;
expect(scalar(verifier, "SELECT COALESCE(score,-1) FROM dbo.Jobs WHERE job_id=1") == before,
       "rows rollback did not restore baseline");
```

第一行在寫入者自己的交易內確認 score 20，稱為後置條件。第二行撤回；第三行另開連線，最後確認它讀到的是原先的 `before`。因此 `matched baseline` 表示獨立查回符合基準，`PASS` 並不是工作 1 的 score 20 已持久化留下。

本例 -1 代替 NULL 的比較只適用合成資料；若真實欄位允許 -1，就不能用它區分 NULL 與實值。真實工作還可能有版本條件、租戶 key 或狀態條件，漏一欄就不是同一個意圖。若 count 為零，先比對這些條件，不開始重試全批。

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
