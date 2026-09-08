# 匯出後數值診斷：同一影像、同一前處理、同一門檻

將權重匯出成 ONNX（或其他執行時格式）之後，常見問題不是「能不能跑」，而是「同一張圖、同一套前處理、同一組信心與 IoU 門檻，框還一不一樣」。Ultralytics 的 [export 模式文件](https://docs.ultralytics.com/modes/export/) 說明如何產出可部署檔；ONNX Runtime 的 [量化與模型最佳化文件](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html) 則提醒：量化、圖優化、執行供應商切換都會改動中間張量與最終框。本文只做一件事：把偵測結果寫成可比對的 JSON，再用 greedy、同類、全域最高 IoU 的一對一配對做診斷。這不是 AP，也不是最大基數匹配。擁擠場景裡會有歧義，門檻只是樣本選擇；完整驗證必須按類別、按資料集重做。

原則很短：不要拿最終列去 `zip`。列數不同、排序不同、或某一側漏框時，`zip` 會對錯框並假裝通過。先驗證張量形狀、dtype、有限值，再看 NMS 前張量，最後才比 NMS 後的框。兩邊都空，才算真空通過（vacuous pass）。

## 先把框導出成 JSON

下列腳本用 Ultralytics `YOLO.predict`：`imgsz=640`、`rect=False`、`batch=1`、`device=cpu`、`conf=0.25`、`iou=0.7`。每個框寫成 `class_id`（int）、`box`（四個 float，原圖像素 xyxy）、`score`（float）。輸出檔是唯一產物。

```python
#!/usr/bin/env python3
"""export_dets.py — 將 YOLO.predict 結果寫成可比對 JSON。"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from ultralytics import YOLO


def _finite(name: str, arr: np.ndarray) -> None:
    if not np.isfinite(arr).all():
        raise ValueError(f"{name} contains non-finite values")


def export_dets(weights: str, source: str, out: str) -> None:
    model = YOLO(weights)
    results = model.predict(
        source=source,
        imgsz=640,
        rect=False,
        batch=1,
        device="cpu",
        conf=0.25,
        iou=0.7,
        verbose=False,
    )
    if len(results) != 1:
        raise ValueError(f"expected 1 result, got {len(results)}")
    r = results[0]
    boxes = r.boxes
    if boxes is None:
        dets = []
    else:
        xyxy = boxes.xyxy.detach().cpu().numpy()
        conf = boxes.conf.detach().cpu().numpy()
        cls = boxes.cls.detach().cpu().numpy()
        # NMS 前／後都應檢查形狀、dtype、有限值；此處檢查 NMS 後框。
        if xyxy.ndim != 2 or xyxy.shape[1] != 4:
            raise ValueError(f"xyxy shape {xyxy.shape}, expected (N, 4)")
        if conf.shape[0] != xyxy.shape[0] or cls.shape[0] != xyxy.shape[0]:
            raise ValueError("xyxy/conf/cls row counts differ; never zip mismatched rows")
        _finite("xyxy", xyxy)
        _finite("conf", conf)
        _finite("cls", cls)
        dets = []
        for i in range(xyxy.shape[0]):
            dets.append(
                {
                    "class_id": int(cls[i]),
                    "box": [float(xyxy[i, 0]), float(xyxy[i, 1]), float(xyxy[i, 2]), float(xyxy[i, 3])],
                    "score": float(conf[i]),
                }
            )
    Path(out).write_text(json.dumps(dets, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    p = argparse.ArgumentParser(description="Export YOLO detections to JSON")
    p.add_argument("--weights", required=True)
    p.add_argument("--source", required=True)
    p.add_argument("--out", required=True)
    args = p.parse_args()
    export_dets(args.weights, args.source, args.out)


if __name__ == "__main__":
    main()
```

本機樣本（同一張圖，兩套權重）：

```bash
python export_dets.py --weights weights/yolo11n.pt --source data/sample.jpg --out ref.json
python export_dets.py --weights weights/yolo11n.onnx --source data/sample.jpg --out cand.json
```

若你還能取得 NMS 前張量，請另外存檔並檢查：形狀是否為 `(1, C, N)` 或文件所述佈局、dtype 是否為 float32、所有元素是否 finite。不要假設匯出圖與 PyTorch 圖的通道順序相同。

## 下載並執行比對腳本

[compare_detections.py](compare_detections.py) 與本頁一併提供，僅用標準函式庫。請下載後與 JSON 放在同一工作目錄。真實 CLI：

```bash
python compare_detections.py ref.json cand.json --iou 0.9 --score-tol 0.02
python compare_detections.py ref.json cand.json --iou=0.9 --score-tol=0.02
python compare_detections.py --self-check
```

`argparse` 接受 `--iou 0.9` 與 `--iou=0.9`。結束碼：`0` 通過、`1` 有差異、`2` 輸入無效。stdout 是單一 JSON 物件，鍵為：`ok`、`kind`、`matched`、`unmatched_ref`、`unmatched_cand`、`score_drift`。沒有虛構的「OK 配對」輸出；通過時 `ok` 為 true，差異仍如實列出。


## 讀結果時要注意什麼

Greedy 全域最高 IoU 會先鎖住「看起來最像」的一對，擁擠時可能讓次佳對落入 `unmatched_*`。這是診斷，用來指出匯出是否改變了框幾何或分數，不是競賽指標。`--iou 0.9` 與 `--score-tol 0.02` 只是樣本；正式驗收應對每個 `class_id` 分開看未配對與分數漂移，並在代表擁擠與稀疏的影像上重跑。兩邊皆空只通過真空意義：模型都沒出框，並不證明中間張量一致。量化前後若 NMS 前 logits 已非 finite 或形狀改變，應在比框之前失敗，而不是對最終列做 `zip`。
