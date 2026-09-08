# FP16與INT8：校正資料與精度驗收

自訂箱體／棧板權重位於 `runs/custom/baseline/weights/best.pt`（訓練流程見 [自訂偵測](../23/custom-detection.md)）。本篇只處理 **OpenVINO 匯出時的 `quantize` 數值、靜態校正資料、以及與原權重可對齊的 AP／營運召回**。數值輸出是否位元一致見 [輸出一致性](output-consistency.md)。

官方匯出參數以 [Ultralytics Export](https://docs.ultralytics.com/modes/export/) 為準。本文寫作基準日為 **2026-09-08**：鍵名是 **`quantize`**，合法數值為 **`8` 或 `16`**。**沒有** `quantize8`、`quantize16` 這兩個鍵。安裝後的 `yolo` 設定必須能列出 `quantize`；較舊套件若沒有此鍵，請對該發行版文件操作，不要自行捏造別名。

量化語意對照 [ONNX Runtime Quantization](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html)：靜態量化用校正集估 scale／zero-point；動態量化把開銷留在執行期。反量化為 `scale * (q - zero_point)`。補零必須是真正的 **0**，否則會污染統計。FP16 可能溢位或出現 NaN；**不要**把 FP16 NaN 出現頻率拿去和整數量化「沒有 NaN」比次數——兩者不是同一類失效。

本專案箱體／棧板場景的容差與校正切分是**專案例**，不是通用保證。

## 獨立環境

校正與匯出必須在獨立 venv，避免污染訓練環境。先裝 `ultralytics` 與 `openvino`，讓套件拉齊自動相依後再凍結。

```bash
python3 -m venv .venv-ov-quant
source .venv-ov-quant/bin/activate
python -m pip install -U pip
python -m pip install ultralytics openvino
python -m pip freeze > requirements-ov-quant.lock
yolo cfg | grep -n quantize
```

最後一行必須看得到 `quantize`。若沒有，停在該發行版文件，不要改鍵名硬跑。

## 校正 YAML：只讓預設 val 碰到保留圖

`data/dataset.yaml` 的驗證／測試路徑**不動**。另寫 `calibration.yaml`：`train` 與 `val` 都指向 `data/box-pallet/images/calibration`，類別名稱 `{0: box, 1: pallet}`。路徑用 Python 寫成絕對路徑，避免工作目錄不同時讀到空集。

```bash
python - <<'PY'
from pathlib import Path
root = Path("data/box-pallet").resolve()
cal = root / "images" / "calibration"
text = (
    f"path: {root}\n"
    f"train: {cal}\n"
    f"val: {cal}\n"
    "names:\n"
    "  0: box\n"
    "  1: pallet\n"
)
Path("calibration.yaml").write_text(text, encoding="utf-8")
print(Path("calibration.yaml").read_text(encoding="utf-8"))
assert cal.is_dir() and any(cal.iterdir()), cal
PY
```

校正集必須**代表部署分佈**：夜間、小目標、遠距棧板都要進這份目錄。這是為了估激活範圍，**不是**因果保證「小激活＝小物體」。漏掉夜間圖，INT8 可能只在白天看起來像 FP16。

## 匯出：`quantize=8` 或 `16`

Python API（與 CLI 同一組鍵）：

```python
from ultralytics import YOLO

model = YOLO("runs/custom/baseline/weights/best.pt")
model.export(
    format="openvino",
    quantize=8,
    data="calibration.yaml",
    imgsz=640,
    batch=1,
)
```

`quantize=16` 時同樣帶 `data`、`imgsz=640`、`batch=1`。產物目錄名稱以該次 `export` 實際印出為準。

## 精度驗收：AP 與營運召回分開

原權重與匯出模型用**同一組**設定比 AP：`imgsz=640`、`batch=1`、CPU、`conf=0.001`、`iou=0.7`、`rect=False`。這是為了掃完整 PR 曲線，不是現場門檻。

營運召回另用 **固定 `conf=0.25`**，依人工／指標配方計算；`val` 摘要裡的 R 可能對應最佳 F1，**不是**部署用的固定閾值。

```bash
yolo val model=runs/custom/baseline/weights/best.pt data=data/dataset.yaml imgsz=640 batch=1 device=cpu conf=0.001 iou=0.7 rect=False
yolo val model=runs/custom/baseline/weights/best_openvino_model data=data/dataset.yaml imgsz=640 batch=1 device=cpu conf=0.001 iou=0.7 rect=False
yolo val model=runs/custom/baseline/weights/best.pt data=data/dataset.yaml imgsz=640 batch=1 device=cpu conf=0.25 iou=0.7 rect=False
yolo val model=runs/custom/baseline/weights/best_openvino_model data=data/dataset.yaml imgsz=640 batch=1 device=cpu conf=0.25 iou=0.7 rect=False
```

第二、四行的 `model=` 路徑若與實際匯出目錄不同，改成 `export` 印出的目錄，其餘旗標不要改。

## 限制

- 靜態 INT8 的 scale 只描述校正集上看過的激活；分佈漂移不會自動重估。
- FP16 溢位／NaN 與整數量化夾緊是不同機制。
- 本專案箱體／棧板的夜間小圖比例與 AP／R 容差不可外推到其他類別。
- 輸出張量是否與 PyTorch 位元一致，見 [output-consistency.md](output-consistency.md)，本篇不替代該檢查。
