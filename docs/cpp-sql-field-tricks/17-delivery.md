# 17｜土招可以留下，但交出去的是哪一種模式？

你終於定位問題，開發版很好用。交付前最危險的幾個字卻是：「我剛才應該關掉了。」source 裡的開關，不是客戶手上那份 exe 的證據。這一章不建立發布平台，只做一個小對照：保留舊檔、改開關、重建，再從候選包啟動，確認兩份檔案真的有不同行為。

## 先認清這次關的是哪個入口

第 03 章先改的是 `first_job.cpp`：false 會回到鍵盤輸入。現在要驗的是另一支 [field_lab.cpp](examples/field_lab.cpp)，不要改錯檔案。它的路徑是：

1. `main` 讀取 `--input` 與 `--effect`。
2. 選 fixed／cli／fixture 其中一種來源，準備 `JobRow`。
3. 呼叫共同的 `process_job(row)`。
4. 在新的 run 目錄保存結果、快照與未執行的寫入意圖。

`test_mode` 只在 fixed 分支擋入口。以下是實際原碼中的判斷，不需另加一個開關：

```cpp
if (!test_mode) throw std::runtime_error("fixed input disabled by compiled test_mode");
```

因此 false **不會禁止 cli 或 fixture**，也不會改掉計算規則。整支工具一直是 preview-only，沒有 DB 或通知 adapter；關掉 test_mode 不會讓它變成正式寫庫服務。`--effect` 仍只接受 `preview`，其他值會被拒絕，沒有可切換成真正 DB 寫入的模式。

## 第一步：留下一份已確認的 on 產物

以下命令全部在**同一個 PowerShell 視窗、下載範例的工作目錄**執行，該目錄直接含有 `field_lab.cpp`、`build.cmd` 與 `build` 子目錄。後面會沿用 `$old` 與 `$candidate` 變數；若換視窗，須重新解析對應路徑。目錄名稱用來區分證據；若已存在，換一組，連同後面的路徑一起改，不覆蓋舊包或舊 run。

先確認 `field_lab.cpp` 頂部仍是 `constexpr bool test_mode = true;`，並已完成一次完整建置。**執行前預測**：目前的 exe 應接受 fixed，顯示 on，得到 score 20。先核對基準：

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-ch17-baseline
```

預期關鍵行如下；這也是初版 on 產物已驗過的行為：

```text
build=field-lab-v1 test_mode=on input=fixed effect=preview
job_id=1 score=20 accepted=true
```

若被拒絕，先查這份 exe 是否已經是 off，不要繼續把它標成 on。若結果相符，才在相同工作目錄保留舊檔：

```powershell
New-Item -ItemType Directory .\candidate-ch17-on -ErrorAction Stop | Out-Null
Copy-Item .\build\field_lab.exe .\candidate-ch17-on\field_lab.exe
$old = (Resolve-Path .\candidate-ch17-on\field_lab.exe).Path
Get-FileHash -Algorithm SHA256 $old
```

這裡 hash 用來辨認檔案位元組；相同 hash 不會證明設定相同或功能正確。`build=field-lab-v1` 是固定標記，改 bool 也不會自動換版本字串，因此不能只靠那一行辨認新舊。

## 第二步：只改 source，故意先不重建

在 **`field_lab.cpp`** 頂部，只把這一行的 true 改成 false：

```cpp
constexpr bool test_mode = false;
```

這是要替換的實際宣告，不是設計示意；其他入口和 `process_job` 不動。存檔，但先不要 build。**執行前預測**：剛才保留的舊 exe 仍顯示 on 並接受 fixed，因為 constexpr 已經編進檔案，不會在啟動時回頭讀 `.cpp`。

仍在範例目錄，從剛才解析出的完整路徑啟動舊檔：

```powershell
& $old --input fixed --effect preview --out run-ch17-stale
```

初版對照留下的舊產物紀錄確實是 `test_mode=on`、`input=fixed`。若你看到 off，先核對 `$old` 指向哪裡、有沒有把候選檔覆蓋掉；不是先懷疑 constexpr 沒生效。source 顯示 false 而舊檔仍是 on，正是本輪要觀察的差異。

## 第三步：重建後，驗候選檔的拒絕與保留路徑

現在才重建。**執行前預測**：新 exe 的 fixed 應回 exit 2；CLI 仍應進同一個核心，以 value 10 得到 score 20。只有「拒絕了測試入口」還不夠，該保留的工作路徑也要驗。

仍在相同範例目錄執行完整建置；`build.cmd first` 只更新 `first_job.exe`，不能用在這裡。建置失敗就停止，不把殘留的舊 exe 複製成新候選：

```powershell
.\build.cmd
if ($LASTEXITCODE -ne 0) { throw 'Build failed; do not package the old executable.' }
New-Item -ItemType Directory .\candidate-ch17-off -ErrorAction Stop | Out-Null
Copy-Item .\build\field_lab.exe .\candidate-ch17-off\field_lab.exe
$candidate = (Resolve-Path .\candidate-ch17-off\field_lab.exe).Path
Get-FileHash -Algorithm SHA256 $candidate
& $candidate --input fixed --effect preview --out run-ch17-rejected
Write-Output "EXIT=$LASTEXITCODE"
Test-Path .\run-ch17-rejected
```

初版已驗過 off 拒絕 fixed；本次以保留的 off 產物再次核對，得到：

```text
error: fixed input disabled by compiled test_mode
EXIT=2
```

這條拒絕發生在建立輸出目錄、印 banner 之前，所以沒有 on/off banner 是正常的；對一個原先不存在的 run 名稱，`Test-Path` 應回 False。不要只等 banner 才判斷模式，也不要看到 exit 2 就以為建置壞掉。

接著驗保留路徑，仍在相同工作目錄、使用同一份候選 exe：

```powershell
& $candidate --input cli --job-id 1 --value 10 --effect preview --out run-ch17-cli
Write-Output "EXIT=$LASTEXITCODE"
Get-Content .\run-ch17-cli\run.txt
Get-Content .\run-ch17-cli\result.jsonl
Get-Content .\run-ch17-cli\intent.txt
```

初版保留的 off／CLI 結果是 `test_mode=off`、`input=cli`、`effect=preview`，結果檔如下：

```json
{"schema":1,"rule":"double-v1","job_id":1,"score":20,"accepted":true}
```

`intent.txt` 仍含 `NOT EXECUTED: no DB/network adapter in this target`。這支持「fixed 已禁用、CLI 計算與本地輸出仍可用」，不是正式工作寫回成功。若 CLI 也失敗，先讀錯誤，區分既有 run 目錄、引數和入口判斷；不把「兩條路都不能跑」算成關閉測試模式的成功。

最後核對三件事：候選 exe 的**身分**（完整路徑、hash）、實際**模式**（來源與效果）、以及**行為**（應拒絕與應保留的路徑）。exe 路徑不等於工作目錄；本例以完整路徑啟動，但相對 `--out` 仍落在目前範例目錄。真專案若用工作目錄尋找設定檔，也必須記下這個條件。

這輪可把自己的練習版保持 off；往後若要重跑 fixed，必須有意識地改回 true 並重新建置，不能把這次的 off 查核沿用到另一份產物。上述操作只驗教學工具，沒有驗正式服務的設定、DLL 組合、資料庫寫回或通知。

## 先分用途，不是一律刪掉

現在才決定哪些土招要留下：

| 招式 | 合理的收尾 | 代價留在哪裡 |
|---|---|---|
| 一次性的延遲／大量診斷 | 撤回，留下調查紀錄 | 之後要重現須看紀錄 |
| 每天用的 fixture／diff script | 留小工具與少量樣本 | 格式／依賴要維護 |
| 只有幾種目標的固定 SQL 映射 | 條件成立可交付 | 新目標需要改碼重建 |
| 手動固定輸入開關 | 核對實際產物與啟用範圍 | 人工檢查或更明確介面 |

不是每個小工具都得變成 CI，也不是土招最後一定要刪掉。選擇理由應是使用頻率、出錯影響與接手成本。真專案要在隔離環境驗真正寫回與通知契約，而不是只看 banner 沒有 test 字樣。

## 留一份小清單，不先造發布平台

以下是**供真專案填寫的清單範本**，不是本書 exe 已產生的驗收報告：

```text
候選包識別：
exe / 設定 / DLL hash：
實際啟動位置與工作目錄：
固定輸入是否禁用或受控：
真正寫回與通知的隔離驗證：
未驗項目與理由：
```

這份清單隨包保存。驗完再換設定或 DLL，就不是原來那個驗過的組合；至少重驗受影響行為。逐次檢查若已經讓人反覆出錯，再把重要項目變成自動檢查，而不是因為「最佳實踐」四個字一次平台化。

## 接手能力的成果，是知道下一步

到這裡，你不必背完 ODBC。你應能從一個症狀提出便宜、可撤回、能區分假說的小動作：確認產物、固定入口、保存一包值、看真正回傳、控制一個時序。小成果之後，再補足它牽動的交易、生命週期、資料契約與外部效果。

保留這個節奏，才是把現場技巧搬到新專案的方法；不是把本書的表名與 flags 複製過去。

## 換個情境想一次

候選 exe hash 沒變，但交付前換了設定檔，舊驗收能完全沿用嗎？

<details><summary>核對判準</summary>

先看設定改了哪個行為。交付單位含設定和依賴，不只 exe；連線目標、輸入模式或效果開關改變，至少重驗對應契約並記新身分。

</details>

本章為交付判讀流程；只驗了教學產物的 on/off，不冒稱任何正式系統已完成交付測試。[全書驗證紀錄](appendix-validation.md)。
