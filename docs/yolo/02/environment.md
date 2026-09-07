# 環境與權重

本頁目標：在獨立虛擬環境裡裝好 Ultralytics，確認 Python 路徑與套件版本，檢查裝置，並把教學用權重檔放到可重現的狀態。這是 **CPU 執行基線**：程式會在 CPU 上跑通推論；並不保證 `pip install ultralytics` 會自動裝到「僅 CPU」的 PyTorch wheel。

官方安裝說明見 [Ultralytics Quickstart](https://docs.ultralytics.com/quickstart/)。

## 虛擬環境

專案目錄下建立並啟用 venv，避免系統 Python 被套件污染：

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
python -m pip install -U pip
```

確認當前解譯器就是 venv 裡的那一支：

```bash
python -c "import sys; print(sys.executable)"
```

路徑應落在專案 `.venv` 底下。之後所有 `pip`、`python` 都在已啟用的環境中執行。

## 安裝 Ultralytics

一般安裝：

```bash
pip install ultralytics
```

這會連同依賴拉下 PyTorch。預設 wheel **不保證**是 CPU-only：pip 依套件索引、版本與平台 wheel 選擇安裝檔，並非自動偵測 GPU 再挑 wheel。本教材仍以 **CPU 執行** 當基線——即使裝到含 CUDA 的套件，推論時也明確指定 `device=cpu`。

若你要主動裝 CPU-only 的 PyTorch，請到 [PyTorch Get Started](https://pytorch.org/get-started/locally/) 依作業系統、套件管理器與「CPU」選項產生指令，再安裝 `ultralytics`。**不要**抄寫某一組固定 wheel 檔名；平台與版本會變。

裝完記錄環境：

```bash
python -c "import sys; print(sys.executable)"
pip freeze > requirements-lock.txt
```

`pip freeze` 把當下套件釘成清單，之後對照「這次教材對應哪一組版本」。

## 先載入權重，再對內容做雜湊

教學使用的權重檔是 `yolo11n.pt`（nano 級，作為教學基線，不是當下最新或最大模型）。取得順序必須是：**先讓 YOLO 載入並下載／寫出權重，再對檔案內容做 hash**。不要先空算一個不存在的檔。

```bash
python -c "from ultralytics import YOLO; YOLO('yolo11n.pt')"
shasum -a 256 yolo11n.pt
```

第一次執行會向官方來源下載 `yolo11n.pt`。下載完成後，`shasum` 認的是**檔案位元內容**，不是檔名。你可以把檔案另存為 `my-yolo11n.pt`；只要內容相同，hash 就相同，YOLO 載入時改指向新檔名即可。

## 裝置檢查：CUDA 與 MPS

安裝後先看 PyTorch 看見哪些裝置，再決定推論要寫哪個 `device`：

```python
import torch

print("cuda_available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("cuda_device:", torch.cuda.get_device_name(0))
print("mps_available:", getattr(torch.backends, "mps", None) and torch.backends.mps.is_available())
print("default_device:", "cuda" if torch.cuda.is_available() else ("mps" if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available() else "cpu"))
```

本教材後續一律以 CPU 執行基線示範。即使 `cuda_available` 或 `mps_available` 為真，predict 仍寫 `device="cpu"`，方便沒有加速器的讀者對齊步驟。有 GPU／Apple Silicon 時，你可自行改 `cuda:0` 或 `mps`，輸出格式相同。

## 常見環境故障

| 現象 | 可能原因 | 處理方向 |
|------|----------|----------|
| `ModuleNotFoundError: ultralytics` | 沒啟用 venv，或裝到另一支 Python | 再印 `sys.executable`，對照 `which python` |
| `No module named torch` | ultralytics 安裝中斷 | 重新 `pip install ultralytics`，看完整錯誤 |
| 下載權重逾時或 SSL 錯誤 | 網路／代理 | 換網路後重跑載入；或手動把 `.pt` 放到工作目錄再載入 |
| hash 對不上預期 | 檔不完整，或認錯檔名 | 刪除殘檔後重新 `YOLO('yolo11n.pt')`；hash 比內容 |
| `pip` 裝到系統 Python | 未啟用 venv | `source .venv/bin/activate` 後再裝 |
| CUDA 相關 import 失敗 | GPU 版 torch 與本機驅動不合 | 改走官網 CPU 選項重裝 PyTorch，再裝 ultralytics |
| MPS 可用但想對齊教材 | 裝置預設不是 CPU | 推論顯式 `device="cpu"` |

環境就緒後，到 [第一次 predict](predict.md) 對圖片與影片跑推論。神經網路層次概念見 [第 08 章](../08/index.md)。
