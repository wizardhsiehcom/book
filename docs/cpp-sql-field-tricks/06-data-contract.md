# 06｜挑一筆最討厭的資料，看看它怎麼變成 C++ 值

九成資料正常，少數文字缺尾巴、NULL 變成零。先不用整批重跑；挑一筆刻意不好相處的資料，讓讀取邊界自己露出差異。

## SQL 欄位不會自己變成正確的 C++ 物件

SELECT 決定欄位與順序；fetch 定位到一列；`SQLGetData` 再把某欄轉成指定 C 型別、寫入你提供的記憶體。你要同時看三樣：回傳碼、length/indicator、buffer。只印最後的字串，已經丟掉很多證據。

`indicator` 不是單純長度：它也會表示 `SQL_NULL_DATA`。NULL 時不要去猜 buffer 第一個字元，因為那塊記憶體不代表一個有效欄位值。

## 一次看三個容易混在一起的空／短值

在[專用實驗環境](appendix-lab.md)執行：

```powershell
.\run-sql-case.ps1 data
```

查詢前面三欄是 NULL、空字串、`abcdefghij`。三者都讀進容量 5 的 char buffer，先預測各能放多少，再看本版結果：

| 輸入 | indicator | rc | 本次可見文字 |
|---|---:|---:|---|
| SQL NULL | -1 | 0 | 不可拿 buffer 判值 |
| 空字串 | 0 | 0 | 空 |
| abcdefghij | 10 | 1 | abcd |

5 個位置還要放字串終止字元，所以只得到四個字母；`01004` 告訴你被截斷。此實驗故意丟掉剩下片段，**沒有**把 `abcd` 送進業務核心。你看到的是診斷，不是完整字串 reader。

## 不要把「成功帶資訊」直接當完整成功

這裡下一步有兩種合理選擇：業務欄位有明確上限，就拒收超限並記原因；確實允許長資料，就依 driver 契約分段讀同欄，保留完整性與上限。直接把 buffer 加到很大，只證明這筆容得下，不保證下一筆也行。

再看同一個案例的後兩欄：`2147483648` 用 `SQL_C_SBIGINT` 讀成 64-bit，中文「中」用 `SQL_C_WCHAR` 讀得 code unit 20013。這些實測只覆蓋指定型別；沒有測完所有 Unicode、DECIMAL、小數或時區。固定大小 C 型別需要正確大小的物件，不能期待 `BufferLength` 自動救回過小的 int。

## 留明確欄位順序，別讓 SELECT 星號決定契約

對自己的程式，先把 `SELECT *` 改為具名投影，並把每個 ordinal 與 C 型別排成小表。接著只調換 SQL 投影順序，觀察 mapper 是否也跟著改；這是你可延伸的小實驗，本版未把所有投影變體都跑完。

如果原本第三欄是 note，schema 增欄後讀成別的欄，你用再大的 buffer 也救不了。順序、NULL、長度、型別都是「資料契約」，先看到例子再記術語就夠了。

保留一小組壞例，通常比每次等現場資料剛好壞掉划算。成本是要維護明確的拒收與轉換策略，不能在錯誤路徑繼續解析 buffer。

## 換個情境想一次

buffer 從 5 改成 1000 後，那筆成功了，是否可以交付？

<details><summary>核對判準</summary>

還要驗超過新上限、NULL、空字串、目標型別及截斷策略。這次只支持容量假說；不支持其他欄位契約都正確。

</details>

下一步若根本沒有拿到 row，看[第 07 章](07-results.md)。機制來源：[SQLGetData](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdata-function)；[實測範圍](appendix-validation.md)。
