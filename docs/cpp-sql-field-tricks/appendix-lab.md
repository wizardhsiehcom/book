# 實驗準備：兩個小程式、一個可丟棄的庫

本版以 Windows x64、Visual Studio 2022 C++ 工具、Windows SDK、ODBC Driver 17、Docker Desktop 的 Linux containers 為實測組合。**不要把範例的 SQL 改指向現有專案資料庫。** 範例帳號只用合成教學表，資料庫與正式專案沒有連線關係。

## 先下載到自己的工作目錄

將下列檔案存到同一個新目錄，例如 `D:\scratch\cpp-sql-lab`。本頁後面的 PowerShell 命令都從該目錄開始，不是從網站的 HTML 目錄執行。

| 檔案 | 用途 |
|---|---|
| [job_core.h](examples/job_core.h) | 兩個程式共用的計算 |
| [field_lab.cpp](examples/field_lab.cpp) | fixed／cli／fixture 到 preview |
| [sql_lab.cpp](examples/sql_lab.cpp) | 固定目標的同步 ODBC 實驗 |
| [build.cmd](examples/build.cmd) | 找既有 VS C++ 工具並編譯，不安裝工具 |
| [baseline.job](examples/baseline.job)、[below.job](examples/below.job) | 門檻兩側的合成輸入 |
| [diff_results.py](examples/diff_results.py) | 純檔案比較，零第三方依賴 |
| [start-sql-lab.ps1](examples/start-sql-lab.ps1) | 建新容器，拒絕覆蓋同名容器 |
| [seed.sql](examples/seed.sql) | 只建立新 FieldTricksLab，不清空既有 DB |
| [initialize-sql-lab.ps1](examples/initialize-sql-lab.ps1) | 初始化並建立受限帳號 |
| [run-sql-case.ps1](examples/run-sql-case.ps1) | 核對容器與 loopback port，再執行案例 |

網頁若直接顯示原始碼，另存檔時保留副檔名，不要變成 `.cpp.txt`。這些是本書新增程式與開關，不是 driver 內建命令。

## 第一層：不用 DB 就能看到結果

確認已安裝 Visual Studio 的 C++ x64 工具，再執行：

```powershell
.\build.cmd
```

它在目前目錄的 `build` 建立兩份 exe；編譯使用 C++17、`/W4 /WX`、debug 資訊。若找不到工具，先處理編譯器，而不是啟動 DB 碰運氣。已有 x64 Developer Command Prompt 也可使用；不要用 x86 shell 配 64-bit driver。

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-first
```

先得到 score 20，再回正文。程式拒絕覆蓋已存在的 run 目錄，錯誤可能留下未完成的新目錄；它是失敗證據，不要混當成功結果。

## 第二層：建立隔離 SQL Server

先看 `docker ps -a`，確認自己知道哪些容器是既有系統。此書只操作 `book-cpp-sql-lab`，不停止其他容器、不掛載主機資料、不用現有備份。啟動會占用最多 3 GB 記憶體、2 CPU，以及本機 port 15439；資源不夠先停在純 C++ 實驗。

```powershell
.\start-sql-lab.ps1
docker logs --tail 20 book-cpp-sql-lab
```

等待 log 顯示可接受連線，再做初始化。不要把「容器在跑」當成 SQL 已就緒。腳本指定既有實測映像的 digest；本機沒有時 Docker 需下載映像與網路。映像為 SQL Server Developer edition，僅供此開發實驗，啟動腳本包含 EULA 接受設定；使用前先確認你能接受官方授權條件。

腳本使用隨機實驗密碼，不把憑證寫進書或範例。這不是正式 secrets 管理：有 Docker 管理權的人仍可讀容器設定。映射僅 `127.0.0.1:15439`，不對區域網路開放。

```powershell
.\initialize-sql-lab.ps1
```

初始化建立 `Jobs` 兩列（一般實驗用 1、重試專用 15）、`Operations` 空表，再建立 `book_lab` 帳號。它不是 sysadmin；只取得兩張教學表所需權限。初始化若中途失敗，先檢查狀態，不反覆執行 CREATE，也不為了省事把「有就 DROP」加進腳本。

執行受限帳號的第一個真 DB 對照：

```powershell
.\run-sql-case.ps1 mapping
```

看 target 必須是 `localhost:15439/FieldTricksLab`，再看 score 20 與 PASS。`sql_lab` 的端點在原始碼固定，沒有接受任意連線字串的參數。`TrustServerCertificate=yes` 只為本機自簽實驗使用；不得當成正式遠端 TLS 部署做法。

## 每個 case 會動哪裡？

| case | 效果與清理 |
|---|---|
| mapping／diag／data／bind／timing-base／timing | 讀取或 SELECT 合成值；連線結束 |
| batch | 建 session 臨時表，斷線清理 |
| rows | 修改 job_id 1 後 rollback |
| rollback | 先提交 score 5，再驗 rollback；完成後恢復 NULL |
| lock | 兩連線更新 job_id 1，有界等待；完成後恢復 NULL |
| retry | **保留** chapter-15 操作紀錄與 job_id 15 的 score 20，供第二次查核 |

逐章單獨跑，不同時執行多個案例。`rollback`、`lock` 的 seed 恢復只適用這張獨占合成表，不能移植到共享資料上。若中途失敗，保留診斷，核對 Jobs 與交易狀態，再選擇是否重建整個一次性環境。

## 停止與恢復

```powershell
docker stop book-cpp-sql-lab
```

停止保留容器內的合成資料。下次用 `docker start book-cpp-sql-lab`，待就緒後繼續，不重新 seed。刪除容器會連同未掛載的資料一起刪掉；確認紀錄已保存再自行決定，不使用 prune 或其他廣域清理。

本次製書實驗的實際版本、已驗和未驗內容見[驗證紀錄](appendix-validation.md)。官方環境說明：[SQL Server Docker quickstart](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker)。
