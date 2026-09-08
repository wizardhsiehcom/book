# 測的是檔案進 `predict` 到 `Results` 出來，不是鏡頭到警報

本頁只做一件事：在**隔離的 YOLO 虛擬環境**裡，量「一張圖檔進 Ultralytics `predict`、拿到 `Results`」這段牆鐘時間。邊界**不是**相機擷取、編碼、網路、後處理告警、也不是 TensorRT engine 建置。環境準備見 [02 第一個推論](../02/index.md)。

冷啟動可以比暖機慢，**不要求** cold > warm。Ultralytics 內部**可能已經**對 CUDA 做過同步；本配方仍在計時前後對**指定裝置**再同步一次，避免把「核還沒跑完」算進結束時刻。`Results.speed` 缺欄就記 `null`，不要填假數。

## 來源導讀

- [NVIDIA TensorRT Best Practices — 暖機、同步、時鐘](https://docs.nvidia.com/deeplearning/tensorrt/latest/performance/best-practices.html)：穩定量測前暖機；GPU 工作以裝置同步為準；時鐘／功耗模式會改數字。本頁**不抄**文件裡沒寫死的頻率或 pin。
- [Ultralytics Predict — `Results.speed`](https://docs.ultralytics.com/modes/predict/)：`speed` 是框架自己切的 preprocess / inference / postprocess（毫秒級字典）。它與本頁牆鐘 **P50/P95 不是同一條尺**。

## 專案驗收

1. `device` 只接受 `cpu`、`cuda:N`（N 為非負整數）、`mps`。
2. `--runs > 0`，`--warmup >= 0`。
3. 計時前後：`cuda:N` 用 `torch.cuda.synchronize(該 index)`；`mps` 用 `torch.mps.synchronize()`；`cpu` 不同步 GPU。
4. 延遲用**最近秩**（nearest-rank）P50、P95；樣本數不足 95 百分位所需秩時仍用公式算出的秩（clamp 到最後一個）。
5. 權重與圖檔印 SHA-256；印 `torch` / `ultralytics` 版本。
6. 失敗診斷：無 CUDA 卻指定 `cuda:N` → 立刻退出；`Results.speed` 沒有該 key → JSON 裡 `null`。

百分位自檢腳本 `timing_check.py`（stdlib、不依賴本頁）下載：[`timing_check.py`](timing_check.py)。

## 環境（隔離 venv）

```bash
python3 -m venv .venv-yolo
source .venv-yolo/bin/activate
pip install -U pip
pip install ultralytics torch
# CUDA / MPS 是否可用以本機 PyTorch 為準，依本機 PyTorch 檢查裝置
python -c "import torch, ultralytics; print(torch.__version__, ultralytics.__version__, torch.cuda.is_available(), getattr(torch.backends,'mps',None) and torch.backends.mps.is_available())"
```

## 完整可執行計時配方

將下列存成 `yolo_predict_timing.py` 後執行。

```python
#!/usr/bin/env python3
"""檔案 → YOLO predict → Results 的牆鐘計時。device: cpu | cuda:N | mps。"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

import torch
import ultralytics
from ultralytics import YOLO


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def parse_device(s: str) -> str:
    if s == "cpu" or s == "mps":
        return s
    m = re.fullmatch(r"cuda:(\d+)", s)
    if m:
        return s
    raise argparse.ArgumentTypeError("device 必須是 cpu、cuda:N 或 mps")


def cuda_index(device: str) -> int | None:
    m = re.fullmatch(r"cuda:(\d+)", device)
    return int(m.group(1)) if m else None


def sync(device: str) -> None:
    idx = cuda_index(device)
    if idx is not None:
        torch.cuda.synchronize(idx)
    elif device == "mps":
        torch.mps.synchronize()


def nearest_rank_percentile(sorted_xs: list[float], p: float) -> float:
    n = len(sorted_xs)
    if n == 0:
        raise ValueError("empty")
    # nearest-rank: rank = ceil(p/100 * n), 1-based
    import math
    rank = max(1, min(n, math.ceil(p / 100.0 * n)))
    return sorted_xs[rank - 1]


def speed_ms(result) -> dict:
    sp = getattr(result, "speed", None) or {}
    out = {}
    for k in ("preprocess", "inference", "postprocess"):
        out[k] = None if k not in sp else sp[k]
    return out


def one_predict(model, image: str, device: str):
    sync(device)
    t0 = time.perf_counter()
    results = model.predict(source=image, device=device, verbose=False, imgsz=640, rect=False, batch=1, conf=0.25, iou=0.7)
    sync(device)
    dt = time.perf_counter() - t0
    r0 = results[0] if results else None
    return dt, (speed_ms(r0) if r0 is not None else {
        "preprocess": None, "inference": None, "postprocess": None
    })


def main() -> int:
    p = argparse.ArgumentParser(description="YOLO file-to-Results wall timing")
    p.add_argument("--model", required=True, type=Path)
    p.add_argument("--image", required=True, type=Path)
    p.add_argument("--device", required=True, type=parse_device)
    p.add_argument("--runs", required=True, type=int)
    p.add_argument("--warmup", required=True, type=int)
    args = p.parse_args()
    if args.runs <= 0:
        print("runs 必須 > 0", file=sys.stderr)
        return 2
    if args.warmup < 0:
        print("warmup 必須 >= 0", file=sys.stderr)
        return 2
    if not args.model.is_file() or not args.image.is_file():
        print("model / image 必須是既有檔案", file=sys.stderr)
        return 2

    idx = cuda_index(args.device)
    if idx is not None:
        if not torch.cuda.is_available():
            print("指定 cuda:N 但 torch.cuda.is_available() 為 False", file=sys.stderr)
            return 3
        if idx >= torch.cuda.device_count():
            print(f"cuda:{idx} 超出 device_count={torch.cuda.device_count()}", file=sys.stderr)
            return 3
        torch.cuda.set_device(idx)
    if args.device == "mps":
        mps_ok = bool(getattr(torch.backends, "mps", None) and torch.backends.mps.is_available())
        if not mps_ok:
            print("指定 mps 但 MPS 不可用", file=sys.stderr)
            return 3

    model = YOLO(str(args.model))
    image = str(args.image)

    first_predict_seconds, _ = one_predict(model, image, args.device)
    warmup_times = []
    last_speed = None
    for _ in range(args.warmup):
        dt, last_speed = one_predict(model, image, args.device)
        warmup_times.append(dt)

    run_times = []
    for _ in range(args.runs):
        dt, last_speed = one_predict(model, image, args.device)
        run_times.append(dt)

    ordered = sorted(run_times)
    report = {
        "boundary": "file_to_predict_results",
        "not_boundary": "camera_to_alarm",
        "model_sha256": sha256_file(args.model),
        "image_sha256": sha256_file(args.image),
        "torch_version": torch.__version__,
        "ultralytics_version": ultralytics.__version__,
        "device": args.device,
        "warmup": args.warmup,
        "runs": args.runs,
        "first_predict_seconds": first_predict_seconds,
        "warmup_seconds": warmup_times,
        "run_seconds": run_times,
        "p50_seconds": nearest_rank_percentile(ordered, 50),
        "p95_seconds": nearest_rank_percentile(ordered, 95),
        "last_results_speed_ms": last_speed,
        "note": "Ultralytics may synchronize internally; cold>warm is not required",
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```


## 執行與輸出形狀

```bash
source .venv-yolo/bin/activate
python yolo_predict_timing.py \
  --model yolo11n.pt \
  --image bus.jpg \
  --device cpu \
  --warmup 3 \
  --runs 20
```

`cuda:0` / `mps` 只改 `--device`。stdout 為 JSON：含兩個 SHA-256、兩個套件版本、`run_seconds` 全樣本、最近秩 `p50_seconds` / `p95_seconds`、以及 `last_results_speed_ms`（缺鍵則為 `null`）。**本頁不填寫任何實測毫秒或 FPS**——那些隨權重、圖、驅動、時鐘而變，請以你這次 JSON 為準。

## 診斷

| 現象 | 先查 |
| --- | --- |
| `device` 參數被拒 | 不是 `cpu` / `cuda:N` / `mps` 整串 |
| CUDA 立刻退出 | `is_available()` 或 `device_count` |
| 數字每次差一截 | 暖機次數、是否同步到**同一個** `cuda:N`、主機時鐘策略（見 NVIDIA 文） |
| 牆鐘與 `Results.speed` 對不上 | 尺不同；speed 缺欄保持 `null` |
| 與「系統延遲」對不上 | 你量的不是鏡頭到警報 |

`timing_check.py` 用標準庫核對最近秩百分位，不在本頁展開。
