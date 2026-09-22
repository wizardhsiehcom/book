# 09｜先用幾個固定表名，別急著造萬用 SQL

需求只有「讀目前工作」和「讀封存工作」，程式卻開始接受任意表名、任意欄位、任意條件。多寫幾個 if 好像很土，卻可能比半套 query builder 更容易檢查。

上一章已把整數放進 `?`，現在很自然會想：「表名也用問號傳進去不就好了？」本章先在這個分岔停住，區分值與 SQL 結構。

**這是設計練習，不是已加入 `sql_lab.exe` 的案例。** 本章不執行 SQL，也沒有 `fixed-sql` 或 `archive` CLI。原則由官方參數／識別字契約支持；以下程式需要自行加入專案、補測試並重建，不能把前章的 `PASS` 當作本章已測過。

## 把「在哪裡」和「找什麼」分開

`WHERE job_id = ?` 的問號表示「這一格要填哪個值」，如整數 1。`FROM dbo.Jobs` 則決定「去哪張表找」，其中 `dbo` 是放置資料表的 schema 名稱，`Jobs` 是表名；這些識別字是 SQL 結構，不是任何位置都能改成問號。

先在紙上把路徑分成兩步：`kind` 選一份程式內寫死的 SQL；`job_id` 再綁進那份 SQL 的值參數。不要讓 `kind` 直接變成拼接 SQL 的片段。

下面是**待加入專案的函式定義**，需 `<string>` 與 `<stdexcept>`。建議位置是在讀取工作的入口和建立 statement 之間；不是替換核心 `process_job`：

```cpp
std::string query_for(const std::string& kind) {
    if (kind == "current")
        return "SELECT job_id,input_value,note FROM dbo.Jobs WHERE job_id=?";
    throw std::invalid_argument("unknown job source");
}
```

`kind == "current"` 才回傳唯一允許的查詢；其他輸入直接拋例外。呼叫端應依專案既有錯誤處理回報「不支援的來源」並停止，不能 catch 後偷偷退回 current。這個函式只選 SQL，不建連線、不 bind、不執行。

起初需求提到封存工作，但本書合成庫只有 `dbo.Jobs`，所以目前連 `"archive"` 都應拒絕。要增加它，先有對應表與授權，再加第二個固定分支；不虛構一張表讓讀者照著查失敗。

## 先用表格預測，再寫測試；本版沒有實測輸出

| 輸入 | 預測應發生的事 |
|---|---|
| kind=current，job_id=1 | 回傳完全固定的 SQL；整數 1 之後另行 bind |
| kind=archive | 目前不支援，送 SQL 前拒絕 |
| kind=unknown | 送 SQL 前拒絕 |
| kind 帶引號、分號或超長內容 | 同樣拒絕，不走「幫你修字串」 |

第一輪測試不需要 DB：核對 `"current"` 回傳的完整字串，並核對其餘輸入都拋出 `std::invalid_argument`。這張表是**應驗收的預測**，不是已執行的測試紀錄；現有案例 runner 的允許清單沒有這項功能。

第二輪才把字串接到 `SQLPrepareA`，像第 08 章那樣用仍存活的 `SQLINTEGER` 與 `SQLLEN` 綁 job_id。執行後依第 06 章的具名欄位順序取值。這輪還要在你新增的入口驗證：拒絕的 kind 沒有走到 SQL execute，允許的 kind 得到預期資料。函式能回字串不等於整條讀取路徑已接好。

先不要同時加入任意 schema 選擇、字串拼值與一套快取，否則很難知道哪一層修掉了問題。

另一個文字欄位的值若是 `O'Brien`，應交給文字值參數；這不是要把它塞進本例的整數 job_id。不要因為手動多補一個引號就以為輸入契約完整了。若實務真的需要動態識別字，才查該引擎的 quoting（把名稱包成合法識別字）規則。SQL Server 的 `QUOTENAME` 有長度上限；合法名稱也不代表使用者被允許操作那張表。

## 這不是只准用來診斷的臨時招式

需求長期只有幾種已知目標時，固定映射可以交付。它犧牲新增目標的彈性，換來可列舉、可授權、可測試的範圍。成本是每新增目標要改碼重建；如果實際上一年才新增一次，可能比養一套通用系統便宜。

真正該擴大設計的訊號，是受信任的 schema／租戶組合大量增加、權限模型改變，或每天有人需要新結構，不是同事覺得 if 看起來不夠抽象。

## 換個情境想一次

表名經過正確 quoting，而且確實存在，是否就可以更新？

<details><summary>核對判準</summary>

還要檢查目標是否在業務授權範圍。語法正確、存在、允許操作是三個不同問題；內網也不替代其中任何一項。

</details>

下一章回到已有的 `rows` 案例，檢查[固定 UPDATE 是否真的命中那一列](10-write-result.md)。來源：[Parameter Markers](https://learn.microsoft.com/en-us/sql/odbc/reference/appendixes/parameter-markers)、[QUOTENAME](https://learn.microsoft.com/en-us/sql/t-sql/functions/quotename-transact-sql)。本章設計題未建立獨立動態 SQL 實驗，見[驗證紀錄](appendix-validation.md)。
