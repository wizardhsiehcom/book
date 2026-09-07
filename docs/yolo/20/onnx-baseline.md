# ONNX FP32：從權重到可跑的匯出與對照

本頁把 **YOLO11n** 匯成 **靜態圖、CPU、FP32 ONNX**，並用同一張圖、同一份驗證集，分別跑 **PyTorch 權重** 與 **ONNX** 的 `predict`／`val`。目標不是「檔案出現就算成功」，而是留下四組獨立 run，之後才能對 [輸出一致性](output-consistency.md) 做數值對照。匯出語意依 [Ultralytics Export](https://docs.ultralytics.com/modes/export/)；匯出後的 `predict`／`val` 依官方 modes 說明，文件對照日為 **2026-09-08**。資料準備見 [../05/index.md](../05/index.md)：本頁假設你已寫好 `data/dataset.yaml`，並把一張真實影像複製成 `data/sample.jpg`。

## 獨立環境與套件

用獨立虛擬環境，避免和系統 Python 或其他專案混在一起。目錄請在專案根（與 `data/`、`weights/` 同層）執行。

```bash
python3 -m venv .venv-yolo
source .venv-yolo/bin/activate
python -m pip install --upgrade pip
python -m pip install ultralytics onnx onnxruntime
```

不安裝未指名的額外套件，也不在此寫死版本 pin。安裝後先跑環境檢查，再把目前解析到的套件清單凍成檔案，方便之後對帳：

```bash
yolo checks
python -m pip freeze > requirements-yolo-onnx-fp32.lock.txt
```

`yolo checks` 會回報 Ultralytics、PyTorch、ONNX Runtime 是否可被 CLI 看見。`freeze` 是當下解析結果，不是本指南發明的版本表。

## 資料與權重檔案

確認資料檔存在（路徑錯誤時後面的 `predict`／`val` 會直接失敗）：

```bash
ls -l data/dataset.yaml data/sample.jpg
```

下載官方 **YOLO11n** 權重。`YOLO('yolo11n.pt')` 會在當前工作目錄取得 `yolo11n.pt`（若尚未快取）：

```bash
python -c "from ultralytics import YOLO; YOLO('yolo11n.pt')"
mkdir -p weights
cp yolo11n.pt weights/yolo11n.pt
```

對實際落到磁碟上的檔案做雜湊，不要抄別人筆記裡的摘要：

```bash
python - <<'PY'
import hashlib
from pathlib import Path

for p in [
    Path("weights/yolo11n.pt"),
    Path("data/dataset.yaml"),
    Path("data/sample.jpg"),
]:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    print(f"{h.hexdigest()}  {p}  {p.stat().st_size}")
PY
```

官方 YOLO11n 使用 COCO 類別；驗證資料的類別 ID 必須與权重一致。自訂類別請將此 `.pt` 替換成對應訓練的 checkpoint，再重新匯出兩邊比較。記下 `weights/yolo11n.pt` 的 SHA-256 與位元組數。匯出後對 `weights/yolo11n.onnx` 再跑一次同一段腳本，確認 ONNX 檔是這次 `export` 寫出的產物。

## 匯出：靜態 640、batch=1、CPU、FP32

`dynamic=False` 把輸入形狀釘在 `imgsz=640`、`batch=1`，與後面四條推論指令一致，避免動態軸讓 Runtime 走另一條路徑。`device=cpu` 與本頁全部 CPU 推論對齊。CLI 預設此路徑為 FP32（未加 INT8／半精度旗標）。

```bash
yolo export model=weights/yolo11n.pt format=onnx device=cpu imgsz=640 batch=1 dynamic=False
```

成功時 Ultralytics 會在權重同目錄寫出 **`weights/yolo11n.onnx`**。請立刻：

```bash
ls -l weights/yolo11n.onnx
python - <<'PY'
import hashlib
from pathlib import Path
p = Path("weights/yolo11n.onnx")
h = hashlib.sha256()
with p.open("rb") as f:
    for chunk in iter(lambda: f.read(1024 * 1024), b""):
        h.update(chunk)
print(f"{h.hexdigest()}  {p}  {p.stat().st_size}")
PY
```

匯出只證明圖可以序列化。**通過 export 閘門 ≠ 通過模型驗證**：還必須用同一來源跑 `predict` 與 `val`，並把結果留在不互相覆蓋的 run 目錄。本頁四條指令都指定獨立 `name=`，且不使用 `exist_ok=True`，避免第二次執行把第一次的標註與 `results.csv` 蓋掉。

## 兩次 predict：同一張圖、同一組部署閾值

來源固定 `data/sample.jpg`。`rect=False`、`imgsz=640`、`batch=1`、`device=cpu`。`conf=0.25`、`iou=0.7` 是部署側常用的過濾：較高信心、標準 NMS，對應「畫面上會留下什麼」。兩次只差在 `model` 與 `name`。

PyTorch 權重：

```bash
yolo predict model=weights/yolo11n.pt source=data/sample.jpg imgsz=640 batch=1 rect=False device=cpu conf=0.25 iou=0.7 project=runs/detect name=predict_pt_yolo11n_fp32_sample
```

ONNX：

```bash
yolo predict model=weights/yolo11n.onnx source=data/sample.jpg imgsz=640 batch=1 rect=False device=cpu conf=0.25 iou=0.7 project=runs/detect name=predict_onnx_yolo11n_fp32_sample
```

產物目錄：

- `runs/detect/predict_pt_yolo11n_fp32_sample/`
- `runs/detect/predict_onnx_yolo11n_fp32_sample/`

比對兩份標註圖與另行匯出的結果時，請連同雜湊一併記錄，細節見 [output-consistency.md](output-consistency.md)。

## 兩次 val：同一份 split、較低候選閾值

`val` 用 `data/dataset.yaml` 的 **val** split，同樣 `rect=False`、`imgsz=640`、`batch=1`、`device=cpu`。此處 **`conf=0.001`、`iou=0.7`**：低候選閾值是為了讓 AP 曲線吃到幾乎全部檢測，衡量召回與排序，而不是部署時畫面上那一層 `0.25` 過濾。不要把 val 的 `conf` 改成與 predict 相同，否則 AP 與「使用者看得見的框」會混成同一件事。

PyTorch：

```bash
yolo val model=weights/yolo11n.pt data=data/dataset.yaml split=val imgsz=640 batch=1 rect=False device=cpu conf=0.001 iou=0.7 project=runs/detect name=val_pt_yolo11n_fp32_valsplit
```

ONNX：

```bash
yolo val model=weights/yolo11n.onnx data=data/dataset.yaml split=val imgsz=640 batch=1 rect=False device=cpu conf=0.001 iou=0.7 project=runs/detect name=val_onnx_yolo11n_fp32_valsplit
```

產物目錄：

- `runs/detect/val_pt_yolo11n_fp32_valsplit/`
- `runs/detect/val_onnx_yolo11n_fp32_valsplit/`

保存終端指標或 Python 回傳的 metrics，並檢查實際產出的圖表；獨立 `val` 不保證生成訓練用的 `results.csv` 或逐張預測檔。mAP50、mAP50-95、precision、recall 應與 [output-consistency.md](output-consistency.md) 一起讀：允許的數值差、是否同一後處理、以及 ONNX Runtime 與 PyTorch 在 CPU 上的已知誤差範圍，都以該頁為準。

## 本頁應留下的檔案與目錄

| 角色 | 路徑 |
| --- | --- |
| 環境鎖 | `requirements-yolo-onnx-fp32.lock.txt` |
| 原始權重 | `weights/yolo11n.pt` |
| 匯出圖 | `weights/yolo11n.onnx` |
| 資料 | `data/dataset.yaml`、`data/sample.jpg` |
| predict（PT） | `runs/detect/predict_pt_yolo11n_fp32_sample/` |
| predict（ONNX） | `runs/detect/predict_onnx_yolo11n_fp32_sample/` |
| val（PT） | `runs/detect/val_pt_yolo11n_fp32_valsplit/` |
| val（ONNX） | `runs/detect/val_onnx_yolo11n_fp32_valsplit/` |

流程收束：雜湊確認 `.pt` 與 `.onnx` 都是本次寫入；四個 run 名稱互不重疊；predict 用部署閾值看單張行為；val 用低 `conf` 看 AP／召回。匯出通過只是閘門，**模型是否仍與基準一致，以這四組輸出為準**。
