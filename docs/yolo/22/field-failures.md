# 預測失敗診斷：光學、像素、門檻與模式

本章只處理一件事：**把「模型不行」拆成可重放、可單變因的工程診斷**。不在測試集上調參當成績。建議是工程綜合，不是實驗證據。監控與回滾見 [monitoring-rollback.md](monitoring-rollback.md)；資料與標註契約見 [資料設計](../04/index.md) 與 [標註健檢](../05/index.md)。參數以 [Predict](https://docs.ultralytics.com/modes/predict/) 與 [Export](https://docs.ultralytics.com/modes/export/) 為準，讀當前版本文檔與你鎖定的套件版本，不要背死預設值。

## 單變因，禁止測集調參

一次只改一個旋鈕。先凍結權重與前處理，再決定問題屬 **資料／模型／門檻／模式（source、stream、影片 vs 單張）**。在測試集上掃 `conf` 當指標是洩漏，不是診斷。

## 症狀與候選原因（不是唯一根因）

| 症狀 | 先查（光學／曝光） | 再查（像素與縮放） | 後查（偵測後處理） | 常誤判成 |
|------|-------------------|-------------------|-------------------|----------|
| 小目標漏檢 | 焦距、物距、解析度是否讓目標佔像素過少 | `imgsz` 下採樣把目標壓到幾像素；letterbox | `conf` 過高；密集低分小框可能被 `max_det` 截斷 | 「模型小物體不行」 |
| 密集擠成一團 | 曝光是否糊成一片；運動模糊 | 縮放後框重疊幾何改變 | `iou`、`agnostic_nms`、`max_det` 截斷 | 「NMS 壞了」或「要切 tile」 |
| 夜間漏／假陽 | 增益、噪點、頭燈過曝、IR | 暗部被 resize 抹平 | `conf` 對噪點極敏感 | 「要再訓夜景」 |
| 模糊漏檢 | 對焦、快門、壓縮 | 模糊核大於目標尺度 | 低 `conf` 只換假陽 | 「要資料增強」 |
| 域偏移（鏡頭／廠商／季節） | 光譜、白平衡、畸變 | 訓練解析度 ≠ 部署相機 | 資料、前處理、head 語意與門檻均須核對 | 「重訓全部」 |

**光學／曝光**不是超參數。像素尺寸來自感光元件與光學，不是 `imgsz`。`imgsz` 只決定網路看到的柵格；目標在原圖的寬高像素才是物理可達性。

## 直接讀原始碼契約：Predict 與頭輸出

Predict 常用旋鈕（名稱以文件為準）：`source`、`imgsz`、`conf`、`iou`、`max_det`、`agnostic_nms`、`classes`、`retina_masks`、`stream`、`vid_stride`、`visualize`。`max_det` 是每張圖保留框上限；密集場景先看是否被截斷，再談模型。NMS 的 `iou` 與 class-agnostic 會改「誰活下來」，不是改分數校準。

Export 後要對齊**頭輸出**：框、分數、類別，以及是否已含 NMS。ONNX／TensorRT／CoreML 的後處理是否在圖內，決定你能不能拿 PyTorch Predict 的 `conf`／`iou` 當同一旋鈕。部署引擎若自帶 NMS，書裡的 `max_det` 可能無效或語意不同——用同一張脫敏圖對拍輸出框數與座標。

```python
from ultralytics import YOLO
m = YOLO("yolo11n.pt")  # 換成你鎖定的權重檔名
r = m.predict(
    source="replay/redacted.jpg",
    imgsz=640,
    conf=0.25,
    iou=0.7,
    max_det=300,
    agnostic_nms=False,
    verbose=True,
)[0]
boxes = r.boxes
print(0 if boxes is None else len(boxes), None if boxes is None else boxes.xyxy[:5])
```

預期：可重放時框數與座標穩定（允許浮點誤差）。若只改 `max_det` 而框數卡在上限，截斷可能正是造成漏檢的原因。

## Slice／tiling：重疊與去重成本，不是魔法

大圖切塊能提高小目標在網路柵格上的佔比，但必須付：**重疊帶計算量、邊界框跨 tile 的重複、去重（NMS 或 IoU 合併）的假陰／假陽**。重疊太小則切邊漏；太大則同一物體多框且延遲線性上升。這是系統成本，不是準確率開關。先證明原圖像素已足夠、`max_det` 未截斷，再引入 tiling。

## 建議（工程綜合）

先重放脫敏樣本與版本；再依表區分光學、曝光、原圖像素、`imgsz`、`max_det`、NMS、mode、資料／模型／門檻。一個變因走完再動權重。Tiling 當預算項入帳。匯出頭與 Predict 後處理對齊後才談「模型精度」。
