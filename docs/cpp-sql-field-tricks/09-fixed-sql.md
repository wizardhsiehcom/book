# 09｜先用幾個固定表名，別急著造萬用 SQL

需求只有「讀目前工作」和「讀封存工作」，程式卻開始接受任意表名、任意欄位、任意條件。多寫幾個 if 好像很土，卻可能比半套 query builder 更容易檢查。

本章是有界設計練習，不宣稱已實作通用動態 SQL。原則由官方參數／識別字契約支持；帶回專案時需要新增程式並重建。

## 把「在哪裡」和「找什麼」分開

`WHERE job_id = ?` 的問號是值參數。表名是 SQL 結構的一部分，不是任意位置都能塞問號。先把外部操作代號映射到你實際支持的固定 SQL：

```cpp
std::string query_for(const std::string& kind) {
    if (kind == "current")
        return "SELECT job_id,input_value,note FROM dbo.Jobs WHERE job_id=?";
    throw std::invalid_argument("unknown job source");
}
```

這是待嵌入專案的短片段，不是本版 `sql_lab.exe` 已有的 CLI。只列真的存在的 `dbo.Jobs`；要增加 archive，先有對應 schema 與授權，再加第二個分支，不創造一張不存在的表讓讀者猜。

## 先用表格預測，再寫測試

| 輸入 | 預測應發生的事 |
|---|---|
| kind=current，job_id=1 | 固定 SQL，值另行 bind |
| kind=unknown | 送 SQL 前拒絕 |
| kind 帶引號、分號或超長內容 | 同樣拒絕，不走「幫你修字串」 |

先只做允許與拒絕的單元測試，再接第 08 章的參數 storage。不要同時加入任意 schema 選擇、字串拼值與一套快取，否則很難知道哪一層修掉了問題。

如果值是 `O'Brien`，應交給值參數；不要因為這次手動多補一個引號就以為輸入契約完整了。若實務真的需要動態識別字，才查該引擎的 quoting 規則。SQL Server 的 `QUOTENAME` 有長度上限；合法名稱也不代表使用者被允許操作那張表。

## 這不是只准用來診斷的臨時招式

需求長期只有幾種已知目標時，固定映射可以交付。它犧牲新增目標的彈性，換來可列舉、可授權、可測試的範圍。成本是每新增目標要改碼重建；如果實際上一年才新增一次，可能比養一套通用系統便宜。

真正該擴大設計的訊號，是受信任的 schema／租戶組合大量增加、權限模型改變，或每天有人需要新結構，不是同事覺得 if 看起來不夠抽象。

## 換個情境想一次

表名經過正確 quoting，而且確實存在，是否就可以更新？

<details><summary>核對判準</summary>

還要檢查目標是否在業務授權範圍。語法正確、存在、允許操作是三個不同問題；內網也不替代其中任何一項。

</details>

來源：[Parameter Markers](https://learn.microsoft.com/en-us/sql/odbc/reference/appendixes/parameter-markers)、[QUOTENAME](https://learn.microsoft.com/en-us/sql/t-sql/functions/quotename-transact-sql)。本章設計題未建立獨立動態 SQL 實驗，見[驗證紀錄](appendix-validation.md)。
