# 01｜你改的那份 code，真的有跑到嗎？

在[開場](00-workday.md)，我們接到「算完卻沒寫回」的問題。你準備加輸出追查，第一個麻煩卻是：改了程式、按了 build，畫面沒有任何變化。

現在先不查 SQL。若根本沒跑到剛改的程式，後面每一次觀察都可能是在查另一個版本。本章只做一件事：建立一個你看得見的「修改 → 建置 → 啟動」對照。

## 你熟悉的三件事，可能沒有接在同一條路上

編輯器裡是 .cpp 原始碼。編譯後，磁碟上多出一份 exe。執行 exe 之後，才有一個正在跑的程序。

問題常出在路徑：編譯器更新 build，捷徑卻啟動 deploy；你看 Debug 的原碼，服務仍使用昨天的 Release。檔名都叫同一個名字，看畫面分不出來。因此我們先讓程式自己印出身分，而不是從 IDE 的專案名稱猜。

先完成[準備頁第一層](appendix-lab.md#first-run)。以下都在下載範例的目錄用 PowerShell 執行。本章使用剛建置的 `field_lab.exe`，網站只提供原碼，不提供 exe；它不連資料庫，只寫本地結果。

## 第一步：先保留沒有修改的結果

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-identity-v1
```

先看前兩行，而不是最後的 `score`：

```text
exe=你的範例目錄\build\field_lab.exe
build=field-lab-v1 test_mode=on input=fixed effect=preview
```

第一行實際會是你的絕對路徑。第二行是程式內寫好的標記。`test_mode` 的細節等第 03 章；現在只需確認它印出目前建置中的值。如果輸出目錄已存在，換一個新名字，不要刪掉上一輪結果來假裝第一次執行。

打開 [field_lab.cpp](examples/field_lab.cpp)，搜尋 `build_id`：

```cpp
constexpr const char* build_id = "field-lab-v1";
```

我們故意先改這個不影響計算的字串。若同時改規則與標記，數字變了時就多了一件要解釋的事。

## 第二步：保留舊 exe，再只改一行

先複製，這一步必須在重新建置之前：

```powershell
Copy-Item .\build\field_lab.exe .\build\field_lab-old.exe
```

若同名備份已存在，先換備份名稱，不覆蓋。接著在編輯器把剛才的字串改成 `field-lab-v2`，存檔。先不要 build，執行：

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-source-only
```

預測它會印 v1 還是 v2？答案應是 v1：exe 不會執行到一半回頭讀 .cpp。這次觀察讓「我已經改了」拆成兩件事：原碼改了，產物還沒有。

## 第三步：建置，再分別執行兩份產物

```powershell
.\build.cmd
```

先看有沒有編譯錯誤。失敗時不要接著執行舊檔並拿它判斷這次修改；修好第一個編譯錯誤再往下走。

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-identity-v2
```

現在應是 v2，路徑仍是 build\`field_lab.exe`。再跑備份：

```powershell
.\build\field_lab-old.exe --input fixed --effect preview --out run-old-copy
```

它應印 v1，且路徑末尾是 `field_lab-old.exe`。兩份 `score` 都是 20；這恰好說明「計算結果一樣」不能替你確認版本。

若兩份都印 v1，先檢查檔案是否存檔、build 是否成功、修改的是否為同目錄的 `field_lab.cpp`。若執行路徑不是預期位置，先修啟動方式。此時繼續改 SQL 沒有幫助，因為還沒建立「修改確實生效」的證據。

## 把這個動作搬回原專案

範例的 `executable_path()` 用 Windows 的 `GetModuleFileNameW(nullptr, ...)` 查目前程序的執行檔路徑。這不是從 `argv[0]` 猜測；完整函式也處理了路徑 buffer 不夠的情況。你現在不用背 API，先知道該把哪個問題問清楚：**正在跑的程序，實際來自哪個檔案？**

手寫的 `build_id` 很便宜，但也可能忘記更新。當你要把同一份包交給另一台機器，才再核對檔案內容：

```powershell
Get-FileHash .\build\field_lab.exe -Algorithm SHA256
```

在兩邊對同一個候選檔案執行。hash 相同可以支持兩份檔案內容相同，卻不能支持它們讀到同一份設定、相同輸入或同一個資料庫。遇到「同檔不同結果」，下一步才是列出工作目錄、設定來源和輸入差異。

本章實驗後，把 `build_id` 恢復 `field-lab-v1` 並重新執行 `build.cmd`。備份與 run 目錄先留著，它們是這次對照。接著到[第 02 章](02-one-job.md)，我們終於可以放心改入口：改完後知道該看哪個產物。

## 換個情境想一次

你在新的 .cpp 加了一行輸出，但 build 失敗。按執行後程式仍正常結束，卻沒印那行。下一步先查什麼？

<details><summary>核對判準</summary>

先查建置失敗與啟動檔路徑，而不是條件分支。正常結束的是磁碟上原有的 exe，不代表這份新原碼已成功建置。修好建置、核對新標記後，才有理由問新輸出是否走到。

</details>

機制來源：[GetModuleFileNameW](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulefilenamew)。標記與備份對照是本書設計的練習，不是 Windows 內建的版本追蹤系統。
