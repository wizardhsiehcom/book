# 兩類專案：紙箱與棧板（可跟做）

本章只做一件事：**在隔離 YOLO 虛擬環境裡，用 Ultralytics YOLO11 訓練紙箱（box）與棧板（pallet）兩類偵測，並用凍結資料與驗證集調門檻，測試集保留到決策凍結後。** 資料必須有同意、依相機／日期分組切分、近重複不得跨 train／val／test。標註為 YOLO 正規化 `xywh`。訓練指令對齊官方 [Train 模式文件](https://docs.ultralytics.com/modes/train/)；標註與訓練見 [05 標註健檢](../05/index.md)、[07 訓練基準](../07/index.md)；匯出見 [20 匯出與一致性](../20/index.md) 與 [邊緣部署](edge-deployment.md)。

請使用 [02 環境準備](../02/index.md) 的獨立環境。可選 `coco8`、`epochs=1` 只測配線，**不是**本專案生產訓練。

## 資料同意、分組與近重複隔離

僅使用已取得拍攝／使用同意的畫面。切分單位是 **相機＋拍攝日**，不是單張圖：同一相機同一日的所有影格進同一個 split，避免時間相鄰幀同時出現在 train 與 val。近重複（同一棧位微位移、連拍、縮放裁切）必須整組留在同一 split。流程：同意清冊 → 依 `camera_id`／`day` 分組 → 近重複聚類 → 再抽 train／val／test。測試集在凍結前不可看、不可調。

遮擋政策在收集前固定：可辨識的紙箱或棧板，即使部分遮擋，也標出可見部分的外接矩形；全部切分沿用同一規則。無法可靠判定的影像先送複核，未解決前不納入訓練，避免把可辨識物件漏標為背景。重疊紙箱逐件標註。類別：`0=box`（紙箱）、`1=pallet`（棧板本體，不含僅紙箱堆）。

## 目錄、標註與 `dataset.yaml`

影像與標籤成對、相對路徑一致。標籤每行：`class cx cy w h`，皆為相對該圖寬高的 **0–1** 正規化中心點與寬高（YOLO `xywh`），不是像素、不是角點。

```
data/box-pallet/
  images/train/
  images/val/
  images/test/
  labels/train/
  labels/val/
  labels/test/
```

數值例：圖寬 1920、高 1080。紙箱像素框左上 `(480, 270)`、寬 384、高 216 → 中心 `(672, 378)` → 正規化 `0 0.350000 0.350000 0.200000 0.200000`。棧板像素框左上 `(960, 540)`、寬 576、高 324 → `1 0.650000 0.650000 0.300000 0.300000`。對應 `labels/train/camA_20260901_0001.txt`（與 `images/train/camA_20260901_0001.jpg` 同名）。

`dataset.yaml` 的 `path` 必須是**解析後的絕對路徑**（勿寫未展開的 `~`），train／val／test 相對於該根：

```bash
python - <<'PYDATA'
from pathlib import Path
root = Path('data/box-pallet').resolve()
Path('data/dataset.yaml').write_text(
    f'path: {root}\ntrain: images/train\nval: images/val\ntest: images/test\n'
    'names:\n  0: box\n  1: pallet\n', encoding='utf-8')
PYDATA
```

## 隔離環境與配線煙霧測試（可選）

```bash
python3 -m venv ~/.venvs/yolo11-boxpallet
source ~/.venvs/yolo11-boxpallet/bin/activate
python -m pip install -U pip
python -m pip install ultralytics
python -c "import ultralytics; print(ultralytics.__version__)"
```

預期：印出已安裝版本字串、無 import 錯誤。可選配線（**非**本專案資料、**非**正式分數）：

```bash
yolo detect train data=coco8.yaml model=yolo11n.pt epochs=1 imgsz=640 batch=4 device=cpu
```

預期：能跑完 1 epoch。失敗則先修安裝／權限，再動自訂資料。

## 正式訓練（凍結前唯一基線）

資料與 yaml 就緒後，在**同一隔離 venv** 訓練。`exist_ok=False` 避免覆寫舊 run。`project=runs/custom`、`name=baseline` → 權重在 `runs/custom/baseline/weights/best.pt`（相對你啟動時的工作目錄）。

```bash
set -e
python -c "from pathlib import Path; assert not Path('runs/custom/baseline').exists(), 'Choose a fresh run name'"
source ~/.venvs/yolo11-boxpallet/bin/activate
yolo detect train \
  data=data/dataset.yaml \
  model=yolo11n.pt \
  epochs=20 \
  imgsz=640 \
  batch=4 \
  device=cpu \
  project=runs/custom \
  name=baseline \
  exist_ok=False
```

預期 stdout：讀到 2 類、train／val 張數與 yaml 一致、20 個 epoch、寫入 `runs/custom/baseline/`。同名 run 存在且 `exist_ok=False` 時，Ultralytics 通常會遞增目錄名稱。此處先拒絕既有 `baseline`，避免後續讀到舊權重；改名稱時須同步更新後續路徑。若 `dataset.yaml` 路徑解析失敗，檢查 `path` 是否為絕對路徑且 `images/` 與 `labels/` 成對。

## 凍結、雜湊、錯誤分析與最終測試

訓練結束後立刻凍結：鎖定 yaml、split 清單、標註、`best.pt`。記錄雜湊後才做分析。

```bash
find data/box-pallet -type f -print0 | xargs -0 shasum -a 256 > freeze_dataset.sha256
shasum -a 256 data/dataset.yaml >> freeze_dataset.sha256
shasum -a 256 runs/custom/baseline/weights/best.pt > freeze_best.sha256
```

**只在 val** 做錯誤分析與信心門檻掃描（漏檢紙箱、把棧板當紙箱、遮擋漏檢分開計）。選一個門檻寫進協定，例如作業閘門（**樣本**，非正式量測宣稱）：val 上 `box` 召回不低於 0.85、`pallet` 精確不低於 0.80、誤類不高於 5%。調完門檻後 **test 在決策凍結後評估**；不可看 test 再改標註、再加 epoch、再掃門檻。

```bash
yolo detect val model=runs/custom/baseline/weights/best.pt \
  data=data/dataset.yaml split=val imgsz=640 batch=1 rect=False conf=0.001 iou=0.7 device=cpu
# 門檻與錯誤類型確認後，凍結協定，再開：
yolo detect val model=runs/custom/baseline/weights/best.pt \
  data=data/dataset.yaml split=test imgsz=640 batch=1 rect=False conf=0.001 iou=0.7 device=cpu
```

驗收：train／val／test 無跨 split 近重複與同日同機洩漏；標註為兩類正規化 `xywh`；`best.pt` 路徑為 `runs/custom/baseline/weights/best.pt`；test 在決策凍結後評估；可重跑固定協定，但不可依測試結果繼續調參。診斷：類別全是 0 → 檢查 `names` 與標籤第一欄；loss 正常但 val 極差 → 先查標註、類別對應、前處理與分布差異；CPU／batch=4 記憶體不足 → 降 batch，不改資料政策。部署與匯出見 [20 匯出與一致性](../20/index.md) 與 [邊緣部署](edge-deployment.md)，並對照官方 train 文件延伸閱讀，勿把 coco8 煙霧測試的數字寫進專案報告。
