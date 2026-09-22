# 13｜慢的可能不是查詢，是你拿到資料之後做的事

第 12 章已經把「等鎖」做成可觀察的 1000 毫秒。現在遇到「查資料要三十秒」，不要直接把三十秒都算在 SQL 頭上。按鈕背後至少有建立 connection、execute、fetch、把欄位放進 C++ 物件、核心計算，以及可能的寫回與通知；只量按下到結束，沒有足夠證據分配責任。

仍沿用主線工作：`Jobs` 表裡 `job_id=1` 的 `input_value=10` 讀成記憶體中的 `JobRow`，`process_job` 回傳 `score=20`、`accepted=true`。本章的 `timing` 只讀資料並呼叫核心，沒有把 `score` 寫回資料庫。不要把這一章的 `score=20` 當成 `Jobs.score` 已經是 20；資料庫寫回是另一個效果。

## 先讓一段時間有名字

先依[實驗準備的第二層](appendix-lab.md#sql-lab)完成專用 DB，並在**下載範例的目錄**執行。這個案例只讀 `job_id=1`，不要和 `lock` 同時跑。本章不修改程式，依序跑三次：沒有注入等待的 baseline、核心前注入 120 ms、再一次 baseline。把三次輸出保存，不要只看終端最後一行。

執行前預測 `injected_delay` 應依序是 0、1、0，三次 `score` 都是 20。第二次應主要增加 `core_ms`，因為差別是在取完資料後才執行 `sleep_for`。第三次撤回注入，觀察 core 段是否回到接近基準；這不是 CPU 演算法變慢的證明，只是驗證計時位置能不能分辨已知延遲。

```powershell
Set-Location D:\scratch\cpp-sql-lab
.\run-sql-case.ps1 timing-base
.\run-sql-case.ps1 timing
.\run-sql-case.ps1 timing-base
```

三次共用相同 SELECT；改的是 case 選擇，不是重新建置或換查詢。

## 按照實際函式的時間邊界讀

`sql_lab.cpp` 的 `timing` 是一個很小的測量器。以下摘出時間戳附近的原碼並拆行排版，省去函式外框，不是獨立可編譯程式：

```cpp
    Statement s(c);
    const auto t0 = std::chrono::steady_clock::now();
    s.exec("SELECT job_id,input_value FROM dbo.Jobs WHERE job_id=1");
    const auto t1 = std::chrono::steady_clock::now();
    s.fetch();
    JobRow row{s.integer(1), s.integer(2), std::nullopt};
    const auto t2 = std::chrono::steady_clock::now();
    if (delay) std::this_thread::sleep_for(std::chrono::milliseconds(120));
    const auto r = process_job(row);
    const auto t3 = std::chrono::steady_clock::now();
```

把它翻成 C++ 讀者熟悉的語言：

- `Statement s(c)` 配置 statement，並在 constructor 裡設 `SQL_ATTR_QUERY_TIMEOUT=5`；它不是從資料庫取任何資料。
- `t0` 到 `t1` 包住 `s.exec`。`Statement::exec` 會呼叫 `SQLExecDirectA`；這一段是 execute 呼叫返回前的時間，不包含這個函式以前的 `Connection c` 建立。
- `s.fetch()` 取出那一列；兩個 `s.integer` 用 `SQLGetData` 讀欄位 1、2，接著直接組出 `JobRow`，note 固定放 `std::nullopt`。`t1` 到 `t2` 因而是這個案例的 fetch＋mapping 小段。
- 只有 `delay=true` 才進 `sleep_for(120 ms)`，然後才呼叫共用的 `process_job(row)`。`t2` 到 `t3` 叫作 `core_ms`，但在注入案例中它也包含刻意的等待。

最後用 `steady_clock` 把每段轉成毫秒：

```cpp
const auto ms = [](auto x, auto y) {
    return std::chrono::duration_cast<std::chrono::microseconds>(y - x).count() / 1000.0;
};
std::cout << "execute_ms=" << ms(t0, t1)
          << " fetch_map_ms=" << ms(t1, t2)
          << " core_ms=" << ms(t2, t3)
          << " injected_delay=" << delay
          << " score=" << r.score << '\n';
```

這裡的 `r` 是 `Result`，不是資料庫列；它由 `process_job` 以 `{row.job_id, row.input_value * 2, row.input_value >= 10}` 產生。也因此，看到 `score=20` 只證明這次記憶體計算得到 20。要證明資料庫寫回，仍要有第 10 章那種命中／後置條件證據。

## 逐行讀輸出，先解釋變動再解釋數字

每次 `run-sql-case.ps1` 都會印出 `target=localhost:15439/FieldTricksLab user=book_lab case=timing-base` 或 `case=timing`，之前可能有連線資訊診斷。先看 case 名稱，避免把三次結果抄反；這行也確認仍在本書的合成資料庫。

接著是單行計時結果，形狀固定為：

```text
execute_ms=... fetch_map_ms=... core_ms=... injected_delay=0 score=20
execute_ms=... fetch_map_ms=... core_ms=... injected_delay=1 score=20
execute_ms=... fetch_map_ms=... core_ms=... injected_delay=0 score=20
```

`...` 是時間的佔位符，不是實際輸出；數字會受排程、容器和 driver 影響。初版實測最後一輪 baseline／注入／baseline 的 `core_ms` 為 `0／127.875／0`；這支持「注入落在 core 段」的定位，不是計算速度保證，也不是每台機器都應重現 127.875。顯示 0 也不代表計算不花時間，只代表這次量測與數值轉換沒有顯示出差額。

`timing()` **沒有對 score 或時間門檻呼叫 `expect`**。最後的 `PASS` 只表示案例沒有拋出錯誤；你仍須自己比對三輪數字，不能拿 PASS 當作「約 120 ms 已自動驗過」。

讀第二行時，先比較 `injected_delay`：它從 0 變 1，代表 `main` 把 mode 轉成 `timing(c, mode == "timing")` 後確實選了延遲分支。再比較 `core_ms`；它應增加約 120 ms，但不必逐毫秒相同。最後看兩行 `score=20`，說明 SQL 輸入和核心門檻沒有被這個故意等待改掉。

如果增加的時間落到 `execute_ms`，先檢查是否另有排程、容器負載或留下的鎖；若是搬回專案的版本，再核對量測邊界與連線目標，不要立刻說 `sleep` 讓 SQL 變慢。如果三段加總比整體耗時少很多，差額可能在連線建立、statement 配置、終端輸出或清理；本案例沒有量這些，也沒有寫結果檔。沒有量到的部分要叫「未量測」，不要默默分配給 SQL。

## 把小實驗帶回真專案

可以照下面的順序做一次，而不用先改架構：

1. 先固定同一筆 `JobRow`、同一個 rule、同一個結果列數；保存總時間與這五段的起訖。
2. 把 connect／execute／fetch＋mapping／core／write＋commit＋notify 分成獨立邊界。若某一段沒有實作，就明確標成未量測。
3. 每次只改一個條件：例如是否重用 connection、結果列數、bind 型別或 core 延遲。工作量改變時，不能把「少讀了資料」當成同一工作變快。
4. 保留一個無延遲 baseline。注入延遲只用來驗證測量位置，不用來模擬真實 CPU 負載，也不用拿它作效能 benchmark。

`execute` 返回也不等於所有業務效果已完成；這個同步小程式只量到 `SQLExecDirectA` 返回、一次 fetch 和一次核心函式。真正專案若逐列 log 或每列寫庫，應把那些成本單獨標出。把寫庫換成檔案可以幫你定位寫入階段，卻不能把檔案速度當正式吞吐量。

## 換個情境想一次

關掉寫庫快十倍，下一步一定是批次更新嗎？

<details><summary>核對判準</summary>

先拆建連、等鎖、逐筆執行與 commit；再核對批次化改不改部分失敗語意。快十倍只指出這段值得看，不選定根因或修法。

</details>

來源：[steady_clock](https://learn.microsoft.com/en-us/cpp/standard-library/steady-clock-struct)。本章時間邊界取自[實際範例](examples/sql_lab.cpp)；本版的具體觀察與限制見[驗證紀錄](appendix-validation.md)。
