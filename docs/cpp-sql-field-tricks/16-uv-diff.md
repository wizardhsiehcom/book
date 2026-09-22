# 16｜不用做平台，一支 uv script 就能幫你比兩次結果

你把同一筆工作跑兩次，兩份 `result.jsonl` 都只有幾列，人工卻要對行序、欄位和 `NULL` 看到眼睛發酸。更麻煩的是，若比較器把資料讀成普通 `dict`，重複的 `job_id` 可能被後來的值蓋掉，最後得到一個看似乾淨、其實已經失真的「相同」。

這一章只留下小工具，不做資料庫平台：用穩定的 `job_id` 對齊兩次結果，分出新增、缺失與內容改變。比較器不做資料正規化，也不把所有順序都當成可忽略。它只讀檔，不會連到前章的 `Jobs` 或 `Operations`；第 15 章留下的資料庫結果也不會自動進入這次比較。

## 先找目前流程中的兩個檔案

回到第 03–04 章的 `field_lab.exe`：入口準備 `JobRow`，`process_job` 算出 `Result`，然後將結果寫進新目錄的 `result.jsonl`。JSONL 就是一行一個 JSON object；這次每份檔案各一筆。`snapshot.job` 保存的是輸入，`intent.txt` 保存的是未執行的意圖，**本章比較的是 `result.jsonl`，不要挑錯檔案**。

先依[實驗準備](appendix-lab.md)取得 `diff_results.py` 與已建置的 `field_lab.exe`。以下所有 PowerShell 命令都從**存放 `diff_results.py`、內含 `build` 子目錄的範例目錄**執行，不是在網站的 HTML 目錄。

本輪不改 C++ 或比較器，只把業務輸入的 value 從 10 改成 9。執行前先預測：工作編號仍是 1，所以不應有新增或缺失；分數由 20 變 18，門檻判斷由 true 變 false，所以應有一筆內容改變。確認 `field_lab.cpp` 的 `test_mode` 仍為 true 且已建置；若固定入口被拒絕，先回第 03 章核對產物，不修改比較規則來避過問題。

使用新的輸出名稱；若名稱已存在，換一組並同步修改後續命令，不覆蓋：

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-ch16-ten
.\build\field_lab.exe --input cli --job-id 1 --value 9 --effect preview --out run-ch16-nine
Get-Content .\run-ch16-ten\result.jsonl
Get-Content .\run-ch16-nine\result.jsonl
```

既有實驗保留的兩份結果如下；目錄名稱不是比較內容的一部分：

```json
{"schema":1,"rule":"double-v1","job_id":1,"score":20,"accepted":true}
{"schema":1,"rule":"double-v1","job_id":1,"score":18,"accepted":false}
```

先核對你的兩次執行都成功，再往下比較。只看到目錄存在不代表結果檔完整；如果第一步就失敗，先讀 `field_lab` 的錯誤，不把舊檔案當成本次輸出。

## 先讀比較契約，再看程式怎麼對齊

打開 [diff_results.py](examples/diff_results.py)，從 `main()` 的這一行開始。這是實際原碼摘錄，不需替換：

```python
report = compare(load_rows(args.before), load_rows(args.after))
```

把它拆成三個小步驟，就不用先讀完所有 Python 語法：

1. `load_rows` 逐行讀取，要求 `job_id` 是正整數，而且同一檔案內不得重複；它先檢查再放進 dict，不讓後一列蓋掉前一列。重複 JSON 欄位、空行、`NaN`／`Infinity`、溢位成非有限值的數字和錯誤 JSON 也會拒絕。
2. `compare` 比較兩邊的 ID 集合。只在新檔的 ID 放 `added`，只在舊檔的放 `missing`；兩邊都有的才比較整筆內容，差異放 `changed`。
3. `main` 將報告寫進一個**原先不存在**的檔案，然後以 exit code 區分相同、不同與無法比較。

行序只在這個契約下被忽略：`job_id` 是穩定識別字，而且結果語義不依賴輸出順序。這不是「所有 dict 或 JSON 陣列都可以忽略順序」；列內陣列的順序仍參與比較。`canonical` 會排序 object 的欄位名稱後序列化，保留 JSON 的 `null`、缺欄、空字串、布林、整數與浮點數差別，不把它們統一成同一種值。SQL 的 NULL 若要進來，必須先由匯出端明確表示成 JSON `null`；工具本身沒有 SQL 型別資訊。

## 預測：先寫出 exit code，再執行

這支工具的交付契約很小：

- exit 0：兩份有效輸入相同。
- exit 1：兩份有效輸入有新增、缺失或內容差異。
- exit 2：輸入無效，或輸出檔已存在／不可建立。

輸出使用 exclusive-create，也就是「檔案已存在就失敗」，不會覆寫前一次證據。**執行前先寫下**：剛才的兩份有效輸入應得到 exit 1，而且 `added`／`missing` 都空，只有 `changed` 有 `job_id=1`。exit 1 在這支工具中是正常發現差異，不是 Python 壞掉。

## 執行一次，留下可讀的差異報告

仍在範例目錄，用 `uv` 執行 script。`--no-project` 表示不把目前目錄當成另一個 Python 專案來處理；`--out` 是本書 script 定義的報告位置：

```powershell
uv run --no-project diff_results.py run-ch16-ten\result.jsonl run-ch16-nine\result.jsonl --out diff-ch16-ten-nine.json
Write-Output "EXIT=$LASTEXITCODE"
Get-Content .\diff-ch16-ten-nine.json
```

先讀 exit code，再讀報告；若是 2，不要把已存在的舊報告誤認為這次成功輸出。初版以 Python CLI 與 uv 指定現有 Python 各自實跑，差異案例結果為：

```text
DIFFERENT
EXIT=1
```

以下摘自保留的差異報告，只列關鍵欄位；實際 before／after 還包含 schema、rule 與 job_id，不是比較器把它們刪掉了：

```json
{
  "added": [],
  "missing": [],
  "changed": [
    {
      "job_id": 1,
      "before": {"score": 20, "accepted": true},
      "after": {"score": 18, "accepted": false}
    }
  ]
}
```

## 相同也要驗：先比較同一份輸入

執行前先預測：同一份有效檔案與自己比較，應回 exit 0，三個陣列都空。仍在範例目錄，用另一個新報告名稱：

```powershell
uv run --no-project diff_results.py run-ch16-ten\result.jsonl run-ch16-ten\result.jsonl --out diff-ch16-equal.json
Write-Output "EXIT=$LASTEXITCODE"
Get-Content .\diff-ch16-equal.json
```

初版相同案例已觀察到 `EQUAL`、exit 0；保留輸入再次比較也得到 `{"added": [], "missing": [], "changed": []}`。這只確認相同路徑能被辨認，不代表這份結果符合業務需求。

## 再看已驗過的反例，不讓比較器替你猜

把兩份相同資料的行序交換，實測輸出是 `EQUAL`、exit 0，報告三個陣列都是空的。這是穩定 `job_id` 契約的結果，不是所有 JSON 陣列都可以排序後比較。

再把同一個 `job_id` 放兩次，輸出會是 `invalid: ... duplicate job_id 1`、exit 2；工具拒絕猜哪一列才是真的。若先建立 `existing.json` 再把它當 `--out`，也會 exit 2，原本的 `{"keep":true}` 保持不變。失敗本身也留下了「沒有覆寫既有證據」這個可驗收行為。

9 個 unittest 與上述 CLI 情況已驗證。初版 uv 曾遇到 cache 目錄權限限制，改用可寫的 cache 並明確指定既有 Python 後，相同／差異兩條路徑也分別回 0／1；沒有為此安裝套件或改全域設定。你若遇到執行環境錯誤，先分清是 uv 尚未啟動 script，還是 script 自己印 `invalid:` 並回傳 2。[uv Running scripts](https://docs.astral.sh/uv/guides/scripts/)（2026-09-22 核對）說明版本選擇與 metadata。

已有 Python 3.10 以上時，也可不經 uv；在相同範例目錄執行以下替代命令。先預測仍為差異、exit 1，並使用新報告名：

```powershell
python diff_results.py run-ch16-ten\result.jsonl run-ch16-nine\result.jsonl --out diff-ch16-python.json
Write-Output "EXIT=$LASTEXITCODE"
```

另外兩個測試刻意劃清界線：空檔對空檔、兩份都只有 job_id，會得到 EQUAL。工具只檢查比較契約，**不驗證業務 schema 或應有工作量**；若這輪應處理十筆，還要另外核對十筆確實存在。報告會複製 changed 的完整欄位，請只用合成／已授權去識別輸入；它不會自動遮罩 token 或個資，diff 檔也要按輸入的敏感程度保存。

## 解釋與下一步

這個結果把「兩次都處理了同一筆工作」和「該工作的結果改變」分開了。它沒有證明 DB 寫入成功，也沒有證明變更一定來自 C++ 核心；它只證明兩個 JSONL 在這份比較契約下不相同。下一步應回到輸入快照、規則版本或真正的資料庫接縫，而不是先把比較器改成寬鬆模式。

## 這支 script 為什麼夠小

檔案開頭的 PEP 723 inline metadata 宣告 `requires-python = ">=3.10"` 與 `dependencies = []`。它只使用 Python 標準庫的 `argparse`、`json` 和 `pathlib`，不需要資料庫、C++ runtime、第三方套件或特定平台 API；有相容的 Python／uv 執行環境即可。若日後加入套件，才需要重新評估 metadata、lock 和取得環境的成本，不能因為目前是零依賴就宣稱所有部署問題消失。

## 留下小工具，也留下規則

這個小工具的代價是你必須維護結果契約：`job_id` 要穩定，重複 key 要真的算資料錯誤，新增欄位也要先決定是否屬於結果語義。它不會替你排除 timestamp、亂數或環境欄位；若要排除，應把理由寫進比較規則，而不是偷偷刪掉欄位。輸出檔不覆寫會留下許多小報告，但這比一次錯誤重跑把證據蓋掉容易追查。常常需要時再把命令包進 CI；目前一支零依賴 script 和幾個固定 fixture 就夠了。

## 換個情境想一次

兩份檔案都有 10 列，`job_id` 集合相同，但行序不同；其中一列從 `"note": null` 變成完全沒有 `note` 欄位。你會回報相同、差異，還是無效？如果有人建議「轉成 dict 後只比較數量」，你要指出哪個證據被他丟掉？

<details>
<summary>核對判準</summary>

行序在已宣告 `job_id` 穩定、且結果不依賴行序的契約下可忽略，所以不會因換行序而差異；`null` 與缺欄是兩種 JSON 狀態，應在 `changed` 回報，exit 1。兩份數量相同不代表 key 集合、欄位或值相同；用普通 dict 還可能吞掉重複 key，因此重複資料必須 exit 2，而不是被覆蓋後假裝一致。

</details>

來源與實驗收束見[附錄：驗證範圍](appendix-validation.md)。
