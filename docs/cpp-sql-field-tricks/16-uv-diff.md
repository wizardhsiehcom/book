# 16｜不用做平台，一支 uv script 就能幫你比兩次結果

你把同一筆工作跑兩次，兩份 `result.jsonl` 都只有幾列，人工卻要對行序、欄位和 `NULL` 看到眼睛發酸。更麻煩的是，若比較器把資料讀成普通 `dict`，重複的 `job_id` 可能被後來的值蓋掉，最後得到一個看似乾淨、其實已經失真的「相同」。

這一章只留下小工具，不做資料庫平台：用穩定的 `job_id` 對齊兩次結果，分出新增、缺失與內容改變。比較器不做資料正規化，也不把所有順序都當成可忽略。

## 症狀：兩份檔案看起來差不多，卻不知道差在哪裡

先依[實驗準備](appendix-lab.md)把範例下載到同一個工作目錄，所有命令從該目錄執行。先建立兩次結果；第二次只把輸入值從 10 改成 9。若前章已有同名 run 目錄，沿用其已確認的結果，或換一組新名稱，不覆蓋：

```powershell
.\build\field_lab.exe --input fixed --effect preview --out run-fixed
.\build\field_lab.exe --input cli --job-id 1 --value 9 --effect preview --out run-nine
```

預期輸入檔是 `run-fixed/result.jsonl` 與 `run-nine/result.jsonl`。第 03 章已看到固定入口的 `score=20`、`accepted=true`；這次 CLI 的 `score` 應是 18、`accepted=false`。這裡只改一個業務輸入，沒有同時改輸出格式、比較規則或檔案位置。

## 背景：比較契約比比較器本身重要

`diff_results.py` 把每一行當成一個 JSON object，要求 `job_id` 是正整數且每個檔案不得重複。重複欄位、空行、`NaN`／`Infinity` 和錯誤 JSON 都拒絕。兩份資料以 `job_id` 對齊，再各自報告 `added`、`missing`、`changed`。

因此行序只在這個契約下被忽略：`job_id` 是穩定識別字，而且結果語義不依賴輸出順序。這不是「dict 通用都可以忽略順序」。`NULL`、缺欄、空字串、布林、整數和浮點數仍由 JSON 比較保留差異；比較器沒有替你做 normalization。

## 預測：先寫出 exit code，再執行

這支工具的交付契約很小：

- exit 0：兩份有效輸入相同。
- exit 1：兩份有效輸入有新增、缺失或內容差異。
- exit 2：輸入無效，或輸出檔已存在／不可建立。

輸出使用 exclusive-create，不會覆寫前一次證據。先預測 `run-fixed` 對 `run-nine` 應是 exit 1，而且 `added`／`missing` 都空，只有 `changed` 有 `job_id=1`。

## 一改：只改 value，留下可重跑的 diff

先用 `uv` 執行 PEP 723 script：

```powershell
uv run --no-project diff_results.py run-fixed\result.jsonl run-nine\result.jsonl --out diff-fixed-nine.json
$LASTEXITCODE
```

本次以 Python CLI 與 uv 指定現有 Python 各自實跑，差異案例結果為：

```text
DIFFERENT
EXIT=1
```

以下只摘出報告中的關鍵欄位；實際 before／after 還包含 schema、rule 與 job_id：

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

## 觀察：故意測行序、重複和覆寫

把兩份相同資料的行序交換，實測輸出是 `EQUAL`、exit 0，報告三個陣列都是空的。這是穩定 `job_id` 契約的結果，不是所有 JSON 陣列都可以排序後比較。

再把同一個 `job_id` 放兩次，輸出會是 `invalid: ... duplicate job_id 1`、exit 2；工具拒絕猜哪一列才是真的。若先建立 `existing.json` 再把它當 `--out`，也會 exit 2，原本的 `{"keep":true}` 保持不變。失敗本身也留下了「沒有覆寫既有證據」這個可驗收行為。

9 個 unittest 與上述 CLI 情況已驗證。uv 首次遇到 cache 目錄權限限制，改用可寫的暫存 cache 並明確指定既有 Python 後，相同／差異兩條路徑也分別回 0／1；沒有為此安裝套件或改全域設定。你若也遇到執行環境錯誤，先分清是 uv 尚未啟動 script，還是 script 自己回傳 2。[uv Running scripts](https://docs.astral.sh/uv/guides/scripts/)（2026-09-22 核對）說明版本選擇與 metadata；有相容 Python 時也可直接 `python diff_results.py ...`。

另外兩個測試刻意劃清界線：空檔對空檔、兩份都只有 job_id，會得到 EQUAL。工具只檢查比較契約，**不驗證業務 schema 或應有工作量**；若這輪應處理十筆，還要另外核對十筆確實存在。報告會複製 changed 的完整欄位，請只用合成／已授權去識別輸入；它不會自動遮罩 token 或個資，diff 檔也要按輸入的敏感程度保存。

## 解釋與下一步

這個結果把「兩次都處理了同一筆工作」和「該工作的結果改變」分開了。它沒有證明 DB 寫入成功，也沒有證明變更一定來自 C++ 核心；它只證明兩個 JSONL 在這份比較契約下不相同。下一步應回到輸入快照、規則版本或真正的資料庫接縫，而不是先把比較器改成寬鬆模式。

## 這支 script 為什麼夠小

檔案開頭的 PEP 723 inline metadata 宣告 `requires-python = ">=3.10"` 與 `dependencies = []`。它只使用 Python 標準庫的 `argparse`、`json` 和 `pathlib`，不需要資料庫、C++ runtime、第三方套件或特定平台 API；有相容的 Python／uv 執行環境即可。若日後加入套件，才需要重新評估 metadata、lock 和取得環境的成本，不能因為目前是零依賴就宣稱所有部署問題消失。

## 代價與下一步

這個小工具的代價是你必須維護結果契約：`job_id` 要穩定，重複 key 要真的算資料錯誤，新增欄位也要先決定是否屬於結果語義。它不會替你排除 timestamp、亂數或環境欄位；若要排除，應把理由寫進比較規則，而不是偷偷刪掉欄位。輸出檔不覆寫會留下許多小報告，但這比一次錯誤重跑把證據蓋掉容易追查。常常需要時再把命令包進 CI；目前一支零依賴 script 和幾個固定 fixture 就夠了。

## 換個情境想一次

兩份檔案都有 10 列，`job_id` 集合相同，但行序不同；其中一列從 `"note": null` 變成完全沒有 `note` 欄位。你會回報相同、差異，還是無效？如果有人建議「轉成 dict 後只比較數量」，你要指出哪個證據被他丟掉？

<details>
<summary>核對判準</summary>

行序在已宣告 `job_id` 穩定、且結果不依賴行序的契約下可忽略，所以不會因換行序而差異；`null` 與缺欄是兩種 JSON 狀態，應在 `changed` 回報，exit 1。兩份數量相同不代表 key 集合、欄位或值相同；用普通 dict 還可能吞掉重複 key，因此重複資料必須 exit 2，而不是被覆蓋後假裝一致。

</details>

來源與實驗收束見[附錄：驗證範圍](appendix-validation.md)。
