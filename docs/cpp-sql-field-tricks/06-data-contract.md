# 06｜挑一筆最討厭的資料，看看它怎麼變成 C++ 值

九成資料正常，少數文字缺尾巴、NULL 變成零。先不用整批重跑；挑一筆刻意不好相處的資料，讓讀取邊界自己露出差異。

## 接著上一章：沒有 SQL_ERROR，也可能沒有完整值

[第 05 章](05-diagnostics.md)已能讀取診斷。現在查詢本身合法，問題移到「SQL 欄位怎麼放進 C++ 記憶體」。打開 `sql_lab.cpp` 的 `bad_data()`；本章先讀既有程式，不改 SQL 或 buffer，也不需要重建。

它先用一個 `SELECT` 產生一列五欄，不必往 `Jobs` 插入壞資料。下表把原碼那一長行拆成欄位；`CAST(值 AS 型別)` 是明確指定 SQL 端型別：

| 欄位位置（從 1 起算） | SQL 運算式 | 要故意測什麼 |
|---|---|---|
| 1 | `CAST(NULL AS varchar(8))` | NULL：沒有值，不等於空字串或零 |
| 2 | `CAST('' AS varchar(8))` | 有值，但文字長度是零 |
| 3 | `CAST('abcdefghij' AS varchar(10))` | 十個字元，超過小 buffer |
| 4 | `CAST(2147483648 AS bigint)` | 超過有號 32-bit 整數上限 |
| 5 | `NCHAR(20013)` | SQL 端的 Unicode 字元「中」 |

`s.exec(...)` 送出查詢，不等於 C++ 已拿到第一列。接著的 `s.fetch()` 內部呼叫 `SQLFetch`，把 statement 的讀取位置移到那一列；再用 `SQLGetData` 依欄位位置取值。這裡稱為 fetch 的動作不是另跑一個 SELECT。

## 先停在這五格記憶體前，預測三種結果

`bad_data()` 的迴圈依序讀前三欄，以下是迴圈內的實際片段：

```cpp
char value[5]{}; SQLLEN ind = 0;
const auto rc = SQLGetData(s.h, col, SQL_C_CHAR, value, sizeof(value), &ind);
check(rc, SQL_HANDLE_STMT, s.h, "get-text");
std::cout << "column=" << col << " indicator=" << ind << " rc=" << rc << " chunk=" << value << '\n';
```

`s.h` 是目前 statement，`col` 是 1、2、3。`SQL_C_CHAR` 要求轉成 C 的窄字元字串；`value` 提供存放位置，`sizeof(value)` 告知可用 **bytes**。最後的 `&ind` 接收長度或特殊標記，而 `rc` 是 API 回傳碼。這三份證據不能互相取代。

先預測：NULL 和空字串雖都可能看起來沒印文字，`ind` 應不同；十個字元不可能完整放進五格，因為還要留一格給 `'\0'`。在[第二層環境](appendix-lab.md#sql-lab)已就緒後，從範例檔案目錄執行：

```powershell
Set-Location D:\scratch\cpp-sql-lab
.\run-sql-case.ps1 data
```

腳本一次跑完整個案例。確認 `case=data` 後，把輸出 `column=1` 到 `column=3` 對到以下本版觀察：

| 輸入 | indicator | rc | 本次可見文字 |
|---|---:|---:|---|
| SQL NULL | -1 | 0 | 不可拿 buffer 判值 |
| 空字串 | 0 | 0 | 空 |
| abcdefghij | 10 | 1 | abcd |

第三欄在 `column=3` 前還會經過 `check()`，印出 `stage=get-text rc=1` 與 `state=01004` 診斷。`rc=1` 是成功帶資訊，這次的資訊就是被截斷；`indicator=10` 不是「已存了十個字元」，而是本例原資料的 byte 長度。

第一欄的 `-1` 是 `SQL_NULL_DATA`，表示不得把 buffer 當有效欄位值。第二欄的 `0` 才表示已讀取空字串。若只留下 `chunk=`，兩者就被你自己合併了。

此實驗故意不把第三欄剩餘片段讀回，**沒有**把 `abcd` 送進業務核心。最後的 `PASS` 只表示遇到了預期的邊界情況，不是已成功轉換出完整 `JobRow`。

## 不要把「成功帶資訊」直接當完整成功

這裡下一步有兩種合理選擇：業務欄位有明確上限，就拒收超限並記原因；確實允許長資料，就依 driver 契約分段讀同欄，保留完整性與上限。直接把 buffer 加到很大，只證明這筆容得下，不保證下一筆也行。

## 後兩欄：接收物件的型別也要對

同一個案例接著執行這段原碼；不需要再跑另一個命令：

```cpp
SQLBIGINT big = 0; SQLLEN ind = 0;
check(SQLGetData(s.h, 4, SQL_C_SBIGINT, &big, sizeof(big), &ind), SQL_HANDLE_STMT, s.h, "bigint");
SQLWCHAR wide[4]{};
check(SQLGetData(s.h, 5, SQL_C_WCHAR, wide, sizeof(wide), &ind), SQL_HANDLE_STMT, s.h, "unicode");
expect(big == 2147483648LL && wide[0] == 20013, "wide data mismatch");
```

`SQL_C_SBIGINT` 配對 `SQLBIGINT` 這個 64-bit 接收物件，不是把大數硬塞進 `int`。`SQL_C_WCHAR` 配對寬字元陣列；`sizeof(wide)` 仍以 bytes 計算，不是陣列元素數。

最後應看到 `bigint=2147483648 unicode-code-unit=20013`。code unit 是編碼的儲存單位；本例的「中」只用一個，不代表所有 Unicode 字元都只占一格。這些實測沒有涵蓋全部 Unicode、DECIMAL、小數或時區；固定大小 C 型別也不能期待 `BufferLength` 自動救回過小的接收物件。

## 留明確欄位順序，別讓 SELECT 星號決定契約

對自己的程式，先把 `SELECT *` 改為具名投影，也就是明列要取的欄位；再把每個 ordinal（欄位位置，從 1 起算）與 C 型別排成小表。負責 SQL 值轉成 `JobRow` 的程式就是這裡說的 mapper。若要延伸實驗，只調換 SQL 投影順序，再核對 mapper 是否跟著改；這需要自己改碼重建，本版未把所有投影變體都跑完。

如果原本第三欄是 note，schema 增欄後讀成別的欄，你用再大的 buffer 也救不了。順序、NULL、長度、型別都是「資料契約」，先看到例子再記術語就夠了。

保留一小組壞例，通常比每次等現場資料剛好壞掉划算。成本是要維護明確的拒收與轉換策略，不能在錯誤路徑繼續解析 buffer。

## 換個情境想一次

buffer 從 5 改成 1000 後，那筆成功了，是否可以交付？

<details><summary>核對判準</summary>

還要驗超過新上限、NULL、空字串、目標型別及截斷策略。這次只支持容量假說；不支持其他欄位契約都正確。

</details>

下一步若根本沒有拿到 row，看[第 07 章](07-results.md)。機制來源：[SQLGetData](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdata-function)；[實測範圍](appendix-validation.md)。
