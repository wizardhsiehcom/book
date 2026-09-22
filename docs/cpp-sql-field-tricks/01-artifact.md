# 01｜你改的那份 code，真的有跑到嗎？

你把門檻改成 20，按了 build，結果卻沒有變。最容易浪費一個下午的動作，是直接往 SQL 或核心演算法查。更便宜的第一步是問：剛剛啟動的是哪一個檔案？

## source、產物、程序是三件事

編輯器顯示 source；編譯器產出 exe；捷徑、服務或 IDE 再把某份 exe 啟動成程序。中間每一段都可能指向不同目錄。Debug 與 Release 同名，部署目錄還有一份，更不稀奇。

先完成[實驗準備](appendix-lab.md)。本章不需 DB，只使用本書新增的啟動資訊；加入自己的程式時需要重建。

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-identity
```

先看 `exe=`，再看 `build=field-lab-v1 test_mode=on`。本版從程序內用 `GetModuleFileNameW(nullptr, ...)` 取得自身路徑；不是拿 `argv[0]` 猜。API 的 buffer 不夠時要擴充，範例已處理，不能悄悄拿截短路徑當完整身分。

## 留住舊檔，做一次會讓你記住的對照

在 `build` 目錄把 exe 複製成 `field_lab-old.exe`。接著只改 `field_lab.cpp` 的 `build_id` 為 `field-lab-v2`，重新執行 `build.cmd`。

```powershell
Copy-Item .\build\field_lab.exe .\build\field_lab-old.exe
```

上面的複製要在改動與重建之前做；若已有同名備份，換名字，不覆蓋。改完、重建後，分別啟動新舊檔，`--out` 也分開。預測哪一個會印 v2，再實際看 banner。

如果舊檔仍印 v1、新檔印 v2，你證明的是「這條 build 與啟動路徑確實能區分產物」。不是證明 v2 的邏輯正確。本版驗證也做了同類的 test_mode on/off 產物對照，見[紀錄](appendix-validation.md)。

## banner 也不是萬能收據

`build_id` 是人寫的字串，忘記改就會相同。需要核對交付檔時再加檔案 hash：

```powershell
Get-FileHash .\build\field_lab.exe -Algorithm SHA256
```

hash 回答「兩份檔案內容是否相同」，不回答「連到哪個 DB」或「從哪個目錄讀設定」。在真正專案至少分開記：

| 要排除的歧義 | 看哪裡 |
|---|---|
| 起了另一份 exe | 程序自身路徑、產物 hash |
| 設定檔解析位置不同 | 啟動工作目錄、實際載入設定路徑 |
| 開關有兩個來源 | 生效值與來源，而非只印預設值 |
| DLL 與 exe 不配套 | debugger 的 Modules／模組實際路徑 |

此表後三列是帶回專案的檢查，不是宣稱本書小程式有設定載入器與 plugin 系統。這就是小招的邊界：先補眼前歧義，別先做整套資產追蹤平台。

確認身分後，恢復 v1 並重建，再到[下一章](02-one-job.md)縮短入口。若身分不符，先修啟動路徑；繼續改核心只會累積更多不知道有沒有生效的修改。

## 換個情境想一次

兩台機器 exe hash 一樣，一台成功、一台失敗。這能排除環境問題嗎？

<details><summary>核對判準</summary>

不能。下一步列出設定來源、工作目錄、driver／DLL、DB 目標與輸入。每次對齊一個差異；hash 只縮小產物差異，不等於完整執行條件相同。

</details>

機制來源：[GetModuleFileNameW](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulefilenamew)。啟動核對流程是本書的工程設計。
