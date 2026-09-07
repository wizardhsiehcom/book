# 第一次 predict

本頁示範如何用 Ultralytics 對圖片與影片做物件偵測，並把每個框的類名、信心與座標印出來。詳細參數見 [Predict 模式文件](https://docs.ultralytics.com/modes/predict/)。請先完成 [環境與權重](environment.md)。

以下是**執行後應顯示的結果結構**（類名、信心、`xyxy`），不是替你填入某張圖的實測數字。換圖、換影片，數字會變。

## CLI：指定 CPU

工作目錄放好輸入圖（例如 `bus.jpg`）後：

```bash
yolo predict model=yolo11n.pt source=bus.jpg device=cpu
```

`device=cpu` 強制走 CPU 執行基線。預設會把標註圖寫到 `runs/detect/predict/`。影片同樣把 `source` 換成檔案路徑。

## Python：圖片

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")
results = model.predict(source="bus.jpg", device="cpu")

for r in results:
    if r.boxes is None or len(r.boxes) == 0:
        print("無偵測框")
        continue
    xyxy = r.boxes.xyxy.cpu().numpy()
    conf = r.boxes.conf.cpu().numpy()
    cls = r.boxes.cls.cpu().numpy()
    names = r.names
    for i in range(len(cls)):
        name = names[int(cls[i])]
        print(f"{name}  conf={conf[i]:.4f}  xyxy={xyxy[i].tolist()}")
```

重點：

- `device="cpu"` 與 CLI 的 `device=cpu` 對齊。
- 先檢查空結果：沒有框時不要對 `boxes` 做索引。
- `xyxy`、`conf`、`cls` 可能在 GPU／MPS tensor 上，印之前一律 `.cpu().numpy()`。
- `xyxy` 是 **原圖座標**（左上 x1,y1 到右下 x2,y2，單位為像素），不是正規化 0–1（那是 `xyxyn`）。
- 模型內部 NMS 用的 IoU 門檻，用來抑制重疊框；**不是**評估時「預測框 vs 標註框」的匹配 IoU。兩者都叫 IoU，用途不同。

## Python：影片與 `stream=True`

對影片或資料夾逐張推論時，加上 `stream=True`，以產生器逐張交出結果，避免一次把所有影格的結果堆在記憶體裡。

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")

for r in model.predict(source="video.mp4", device="cpu", stream=True):
    frame = r.path  # 來源識別；影格陣列見 r.orig_img
    if r.boxes is None or len(r.boxes) == 0:
        print(frame, "無偵測框")
        continue
    xyxy = r.boxes.xyxy.cpu().numpy()
    conf = r.boxes.conf.cpu().numpy()
    cls = r.boxes.cls.cpu().numpy()
    names = r.names
    print(f"=== {frame}  boxes={len(cls)} ===")
    for i in range(len(cls)):
        name = names[int(cls[i])]
        print(f"{name}  conf={conf[i]:.4f}  xyxy={xyxy[i].tolist()}")
```

完整可執行腳本可存成 `predict_cpu.py`，把 `source` 換成你的圖或影片路徑。

## 讀結果時的座標與 NMS

| 欄位 | 意義 |
|------|------|
| `boxes.xyxy` | 原圖像素座標 `[x1, y1, x2, y2]` |
| `boxes.conf` | 該框類別信心，約 0–1 |
| `boxes.cls` | 類別編號，用 `result.names` 對成字串 |
| NMS `iou` | 推論後處理：重疊框要不要抑制／丟棄（一般 greedy NMS 是抑制，不是合併） |
| 評估匹配 IoU | 訓練／驗證時預測與標註重疊多少，本頁不計算 |

下一步若要接訓練或匯出，先確保本頁的 CPU 推論能印出逐框內容。背景概念見 [第 08 章](../08/index.md)。
