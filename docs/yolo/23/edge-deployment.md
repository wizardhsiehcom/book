# CPU 上的 ONNX 自訂偵測交付

本頁只做一件事：把**已凍結**的自訂偵測權重 `best.pt` 與同批 `dataset.yaml`，在**隔離 YOLO venv**匯出為 **CPU、FP32、imgsz=640、batch=1** 的 ONNX，再打成可核對雜湊的套件，並用**同一批 held-out val** 對 `.pt` / `.onnx` 做輸出對齊。效能須在目標設備量測；計時協定見 [timing-protocol](../19/timing-protocol.md)，輸出一致性見 [output-consistency](../20/output-consistency.md)。官方匯出與預測／驗證：<https://docs.ultralytics.com/modes/export/>，以及同站 `predict`、`val` 文件。

## 凍結輸入（缺一不可）

專案目錄假設：

```text
project/
  runs/custom/baseline/weights/best.pt
  data/dataset.yaml          # names、nc、val 路徑已凍結，勿改
  freeze/classes.txt         # 與 yaml names 逐行一致
  releases/r001/          # 待驗證的候選版本套件
  bundle/                    # 打包工作區
```

`dataset.yaml` 的 `val:` 必須指向**凍結 held-out**，兩邊評估都用它。類別數、順序與 `classes.txt` 必須相同；改類別就換版本，不要原地覆寫。

## 隔離 venv 與 FP32 匯出

```bash
python3 -m venv .venv-yolo
source .venv-yolo/bin/activate
python -m pip install -U pip
python -m pip install ultralytics onnx
python -c "import ultralytics, onnx; print(ultralytics.__version__)"
```

匯出（CPU、FP32、640、batch=1；不要開半精度／動態 batch，除非另開版本頁）：

```bash
yolo export model=runs/custom/baseline/weights/best.pt format=onnx imgsz=640 batch=1 dynamic=False device=cpu simplify=True
# 產出 runs/custom/baseline/weights/best.onnx
```

預期終端至少出現 `ONNX` 路徑與成功訊息。若失敗，先讀 traceback：缺 `onnx`、opset、或圖簡化失敗都停在本步，不要帶半成品進套件。

## 同一 held-out val：`.pt` 與 `.onnx`

```bash
yolo val model=runs/custom/baseline/weights/best.pt   data=data/dataset.yaml split=val imgsz=640 batch=1 rect=False conf=0.001 iou=0.7 device=cpu
yolo val model=runs/custom/baseline/weights/best.onnx data=data/dataset.yaml split=val imgsz=640 batch=1 rect=False conf=0.001 iou=0.7 device=cpu
```

兩邊都必須跑完，保存終端指標或 Python 回傳的 metrics；不要假設預設 `val` 會寫出逐張預測檔。驗收必須同時包含完整驗證集的 AP／逐類指標與單張輸出差異。例如預先約定 AP50-95 絕對下降不超過 0.01、部署固定門檻下各類召回下降不超過 0.02；這些是可調的專案範例，仍須滿足業務最低需求。單張框對齊不能取代整體品質驗證。計時另走 [timing-protocol](../19/timing-protocol.md)，**禁止**在這裡寫死 FPS。

單張抽樣（輸入輸出只當診斷，不當效能）：

```bash
yolo predict model=runs/custom/baseline/weights/best.onnx source=data/heldout_sample.jpg imgsz=640 device=cpu
```

預設可查看標框圖；文字與 JSON 須另行明確匯出，見輸出一致性章。若 ONNX 能 val、predict 空轉失敗，多半是路徑或後處理設定，不是「模型壞了」的第一假設。

## 套件內容與相對路徑

`releases/r001/` 只放相對錨點（相對套件根，不寫死機器絕對路徑）：

```text
releases/r001/
  model/best.onnx
  config/dataset.yaml          # 凍結副本
  freeze/classes.txt
  SHA256SUMS.txt               # 不含清單自身
```

複製：

```bash
set -e
test ! -e releases/r001
mkdir -p releases/r001/{model,config,freeze} freeze
printf 'box\npallet\n' > freeze/classes.txt
python -m pip freeze > freeze/requirements.lock.txt
cp runs/custom/baseline/weights/best.onnx          releases/r001/model/
cp data/dataset.yaml          releases/r001/config/
cp freeze/classes.txt         releases/r001/freeze/
cp freeze/requirements.lock.txt releases/r001/freeze/
```

## 標準庫清單：建立與驗證（缺檔／雜湊不符即失敗）

下列腳本只依賴 stdlib。`SHA256SUMS.txt` **排除自己**。驗證以套件根為 cwd，路徑全相對。

[下載 manifest.py](manifest.py)；[下載完整／篡改／缺檔自查](manifest_check.py)。兩檔放同一目錄後，可執行 `python manifest_check.py`，不需模型或 GPU。

```bash
python manifest.py create releases/r001
python manifest.py verify releases/r001
# 故意改一個位元應印 HASH_MISMATCH 並非零退出
```

## 佈局：停止／核對／重啟與回滾（平台中立）

使用既有服務的停止與啟動方式；以下流程不假設特定監督器：

1. **停止**目前讀 `releases/current` 的推論行程（自行結束或送該行程約定的停止訊號）。
2. **核對候選**：`python manifest.py verify releases/r001` 必須成功；失敗即停止切換。
3. 使用同一檔案系統上的暫存 symlink 與原子替換，將 `releases/current` 指向已驗證的 `r001`；保留上一版目標，再重啟推論。`current` 應為 symlink，不能先建立成實體目錄。
4. **回滾**：保留上一版目錄（例如 `releases/prev/`），失敗則把 `current` 指回上一版完整樹（含 `SHA256SUMS.txt`），再以 `python manifest.py verify releases/prev` 核對 → 重啟。禁止只換 `best.onnx` 不換 yaml／classes。

## 例：三十分鐘持續驗收（本頁不執行）

以下是讀者在目標設備執行的驗收清單：

| 觀察 | 做法 | 失敗長相（定性） |
|---|---|---|
| RSS | 行程記憶體駐留 | 單調爬升不回、OOM |
| 熱 | 機殼／SOC 溫度介面（若有） | 節流、時脈掉、推論變慢 |
| 慢輸入 | 刻意拉長影格間隔 | 佇列爆、延遲堆、丟幀策略是否符合專案 |
| 斷線 | 拔來源（檔／相機／socket） | 應可重連或乾淨退出，不吃掉套件檔 |
| 磁碟失敗 | 測試用唯讀目錄或受限配額 | 應失敗可見，且 `verify` 仍能對套件本身 |

通過定義由專案寫死（例如：三十分鐘無例外、verify 仍 OK、輸出對齊門檻仍成立）。記錄實際測量值與通過／失敗結論。

## 診斷順序

1. venv 是否為 `.venv-yolo`、套件版本是否寫進發行說明。\
2. `dataset.yaml` 與 `classes.txt` 是否與訓練凍結一致。\
3. 匯出參數是否仍是 CPU／FP32／640／batch=1。\
4. val 是否同一 held-out；不一致先看 [output-consistency](../20/output-consistency.md)。\
5. `verify`：MISSING 對路徑；HASH_MISMATCH 對遭改檔。\
6. 延遲再走 [timing-protocol](../19/timing-protocol.md)，依相同計時邊界比較。
