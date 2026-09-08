# 比較契約

比較不是把兩份數字貼在同一張表。沒有契約，數字只是各自環境下的產物，不能推論「誰比較好」。契約先鎖住不變項，再決定這次比較回答哪一種問題。

## 兩種比較，不要混用

**單因子消融**只改一個可控變因，其餘全部固定。例如同一權重、同一資料切分、同一解析度、同一 batch、同一精度、同一硬體與 runtime、同一偵測頭與後處理，只改匯出格式或量化設定。結論只能寫成「在這些固定條件下，這個變因改變了什麼」。

**完整部署系統比較**比較的是整條上線路徑：模型、預處理、runtime、量化、後處理、硬體、排程與 I/O 一併不同。結論只能寫成「系統 A 對系統 B」。不可把系統差距歸因到單一層。若要歸因，拆回單因子消融。

兩種比較都必須量同一邊界。延遲與吞吐的定義、計時起訖、暖機與批次語意見 [計時協定](timing-protocol.md) 與 [延遲對吞吐](latency-vs-throughput.md)。邊界不一致時，數字不可並列。

## 必須鎖定的不變項

| 項目 | 契約要求 | 常見失敗 |
|------|----------|----------|
| 資料切分 | 同一 split、同一圖清單、同一標註版本 | 一邊 val、一邊自挑圖 |
| 解析度 | 同一輸入邊長與 letterbox 規則 | 一邊 640、一邊 1280 |
| batch | 同一 batch；延遲報告 batch=1 | 延遲混進大 batch 吞吐 |
| 精度 | 同一 dtype／量化意圖 | FP16 對 INT8 卻當同精度 |
| 硬體／runtime／頭 | 同一裝置、同一引擎、同一 head 與 NMS | CPU 對 GPU、或換頭卻當同模型 |
| 量測邊界 | 同一起訖（含／不含解碼、NMS、I/O） | 一邊端到端、一邊只推論核心 |

準確率不是模型 alone 的屬性。它同時取決於模型、資料切分與閾值（信心、NMS、IoU）。改閾值等於改任務定義；未鎖定閾值的 mAP／Precision／Recall 不可比。

## 可重現前置條件

在隔離虛擬環境安裝，凍結套件，確認 CLI 與權重位元組都對得上。不要假設「同一台機器、同一 pip 名稱」就等同。

```bash
python -m venv .venv-yolo-cmp
source .venv-yolo-cmp/bin/activate
python -m pip install -U pip
# 安裝你實際要比對的套件集合後：
python -m pip freeze > requirements.lock.txt
yolo checks
shasum -a 256 path/to/weights.pt
```

`pip freeze` 記錄當時環境；`yolo checks` 確認安裝與裝置可見性；SHA256 鎖定權重檔本身。檔名相同、checksum 不同，視為不同模型。未隔離環境時，系統套件與 CUDA／執行引擎版本可能 silently 不同。

失敗案例：一邊用動態輸入、一邊固定 shape；一邊含資料載入，一邊從 GPU tensor 起算；權重未核對 checksum；閾值未寫進契約卻比較準確率；把供應商 benchmark 頁當成獨立排名。

## 官方 benchmark 怎麼用

Ultralytics 文件提供 `benchmark` 模式，用來在指定格式與裝置上跑速度與準確度量測。這是**供應商工具與教學**，用來在**同一安裝、同一契約**下收集數字，不是獨立評測榜。

以 2026-09-08 閱讀的 [Benchmark 模式說明](https://docs.ultralytics.com/modes/benchmark/) 為準，當時文件示例含 `quantize=16`／`quantize=8` 這類引數。較舊套件**不保證**同一 API；執行前用你凍結的環境對照當前 CLI help，不要把文件日期後的旗標抄進舊安裝。

```bash
yolo benchmark model=path/to/weights.pt data=path/to/data.yaml imgsz=640
# 若你的安裝支援文件所示量化引數，再顯式寫入並記入契約：
# yolo benchmark ... quantize=16
# yolo benchmark ... quantize=8
```

命令列必須寫出模型路徑、資料設定、`imgsz`，以及你實際使用的裝置、格式、精度／量化。未寫進命令與契約的預設值，事後無法辯護。本頁不提供版本釘選，也不提供任何量測結果。

## 契約怎麼寫一句話

先寫問題類型（單因子或系統），再列鎖定項與量測邊界，最後才放數字。數字只能在契約成立時比較；契約破裂時，重跑，不要修表。
