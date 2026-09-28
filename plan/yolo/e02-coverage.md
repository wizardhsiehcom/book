# E02｜YOLO 舊書補強 coverage 與交付紀錄

日期：2026-09-28。依據：`/Users/wizard/Documents/gpm/temp/缺口書籍與課程建置計畫.md` 的 E02 與 C04 G00–G09。

## 核對範圍與決定

逐章讀取 01–24 的章入口；相關主題再閱讀下列正文。這是 E02 生命週期 coverage，不是全書 API、公式、程式與外部來源的全面正確性審查。周邊章的所有子頁未逐字複審。

正文核對：04/split-and-version、06/validation-test、07/checkpoints-and-records、14/index、19/comparison-contract、20/output-consistency、21/operations、22/monitoring-rollback、23/edge-deployment，以及 23/manifest.py、manifest_check.py。另以全書文字搜尋持久化、任務狀態、版本身分、發布、恢復與 C04 入口，確認相關內容的位置。

結論：現有 YOLO 章節已有適合承接的位置；補強第 07、22、23 章，沿用原書。沒有建立獨立 MLOps 書，也沒有新增框架或課程實作。

## 逐章對照

| 章 | 既有覆蓋／與 E02 的關係 | 本輪處理 |
|---|---|---|
| [01 任務](../../docs/yolo/01/index.md) | 輸入輸出、模型與系統、驗收 | C04 G09 沿用 |
| [02 環境](../../docs/yolo/02/index.md) | 環境、權重與首次推論 | G00–G01 沿用，實際版本由課程固定 |
| [03 影像](../../docs/yolo/03/index.md) | 張量與座標契約 | 作為發布套件的前處理依據 |
| [04 資料](../../docs/yolo/04/index.md) | group 切分、洩漏、manifest、凍結 | G02 沿用，不重寫 |
| [05 標註](../../docs/yolo/05/index.md) | 政策與機器可查的格式 | G00、G02 沿用 |
| [06 評估](../../docs/yolo/06/index.md) | 指標、門檻、val／test 分工 | G05 沿用，不另造評估教科書 |
| [07 訓練](../../docs/yolo/07/index.md) | baseline、checkpoint 與單次實驗紀錄 | 補完整追溯與跨階段任務恢復 |
| [08 卷積](../../docs/yolo/08/index.md) | 尺度與小目標原理 | E02 不擴充 |
| [09 架構](../../docs/yolo/09/index.md) | 資料流與解碼幾何 | E02 不擴充 |
| [10 訓練機制](../../docs/yolo/10/index.md) | 指派與損失 | E02 不擴充 |
| [11 解碼](../../docs/yolo/11/index.md) | 解碼、過濾與 NMS | 套件契約引用，無需改寫 |
| [12 演進](../../docs/yolo/12/index.md) | 版本分支與選型流程 | E02 不擴充 |
| [13 錯誤分析](../../docs/yolo/13/index.md) | 誤差原因、切片與診斷 | G07 沿用 |
| [14 改善](../../docs/yolo/14/index.md) | 事先固定接受閘門、測集失敗停止發布 | 補篇接上可執行發布入口的檢查責任 |
| [15 多任務](../../docs/yolo/15/index.md) | 任務／標註／部署契約 | C04 遷移題可引用 |
| [16 追蹤](../../docs/yolo/16/index.md) | 影格與身分連續、工作階段 | 不當作訓練任務持久化 |
| [17 開放詞彙](../../docs/yolo/17/index.md) | 權重、詞表與嵌入聯合版本 | 沿用其完整套件觀念，非通用追溯替代品 |
| [18 選型](../../docs/yolo/18/index.md) | 能力矩陣與部署條件 | E02 不更新型號或成績 |
| [19 量測](../../docs/yolo/19/index.md) | 比較契約與計時邊界 | 評估證據沿用 |
| [20 匯出](../../docs/yolo/20/index.md) | 數值一致性與輸出比對 | 追溯新增匯出執行與實際部署產物關係 |
| [21 即時系統](../../docs/yolo/21/index.md) | 取像／推論 worker、背壓與重啟 | 不把串流重連當成整體工作流恢復 |
| [22 維運](../../docs/yolo/22/index.md) | 監控、清冊、回滾原則 | 補目標／current／載入身分及恢復判準 |
| [23 專案](../../docs/yolo/23/index.md) | 交付、manifest、停止／切換／重啟 | 補 C04 G00–G09 閱讀入口及故障矩陣 |
| [24 查閱](../../docs/yolo/24/index.md) | 詞彙、來源、排錯索引 | 沿用；新來源放在對應補篇 |

## 缺口到交付

| 缺口 | 補強位置 | 文件完成條件 |
|---|---|---|
| 任務持久化與重送 | [persistent-tasks](../../docs/yolo/07/persistent-tasks.md) | ID、狀態、同 ID 衝突、已接受與已完成分開 |
| 跨階段中斷恢復 | 同上 | 半產物、產物先完成、成功後缺檔各有查核決策 |
| 資料／訓練／發布關係 | [lifecycle-lineage](../../docs/yolo/07/lifecycle-lineage.md) | 產物與執行分開；完整推論套件可反查來源 |
| 發布／載入一致性 | [release-consistency](../../docs/yolo/22/release-consistency.md) | ready 身分、切換空窗、失敗回滾與恢復失敗 |
| C04 入口與整合驗收 | [model-update](../../docs/yolo/23/model-update.md) | 十階閱讀對照、十一個故障／正常案例、遷移題 |

新增原理頁各含情境、契約、具體例子、失敗判準、練習及參考答案。保留 checkpoint 與評估原頁，不重述既有操作。

## 新查核來源

查核日均為 2026-09-28。只查補篇需要的行為，未更新全書外部引用。

| 來源 | 實讀範圍 | 用途與限制 |
|---|---|---|
| [Python 3.13 os.replace](https://docs.python.org/3.13/library/os.html#os.replace) | 該 API 條目 | 名稱替換原子性、跨檔案系統限制；不擴大成整體發布交易 |
| [SQLite Atomic Commit](https://www.sqlite.org/atomiccommit.html) | 第 3 節提交步驟與第 4 節恢復 | 資料庫內交易與 journal；工作流狀態設計是作者建議 |
| [TFX ML Metadata](https://www.tensorflow.org/tfx/guide/mlmd) | Artifact／Execution／Event 與 lineage 查詢用途 | 產物與執行關係；未安裝或驗證 TFX API |

## 驗證與邊界

- 已檢查本輪新增／修改的 11 個書頁及此 coverage 文件：126 個本地 Markdown 連結，0 個缺檔。
- `bash sync-assets.sh`：通過，共用資產同步完成。
- `UV_CACHE_DIR=/private/tmp/e02-uv-cache uv run mkdocs build --strict -f configs/yolo.yml`：通過。
- `git diff --check`：通過。既有 B03 與書架索引修改未納入本輪編修。

本輪沒有改 Python 程式，沒有執行真訓練、真推論、發布服務或故障恢復。C04 整體驗收矩陣仍是待實作要求。此處「完成」只指 E02 的 coverage、原理補篇與入口，不代表 C04 已交付。
