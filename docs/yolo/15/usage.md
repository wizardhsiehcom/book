# YOLO26 四任務實務：分類、實例分割、姿態、旋轉框

本頁提供四種任務的 CLI／Python 介面與最小操作流程。檢查日期 2026-09-08（文件檢索日，不是量測日）。未實際執行訓練或推論，文中不含任何自造 mAP、loss 或預測分數。目前文件以 **YOLO26** 權重為現行 API 世代；對應的 **YOLO11** 權重（`yolo11n-cls.pt`、`yolo11n-seg.pt`、`yolo11n-pose.pt`、`yolo11n-obb.pt`）可當教學基線，後綴與任務契約相同。標註欄位見 [標註契約](task-contracts.md)；指標解讀見 [評估](../06/index.md)。

## 先決條件

- 已安裝 `ultralytics`（官方建議用目前穩定版）。
- 工作目錄有你自己提供的 `image.jpg`（內容需對得上任務與預訓練類別）。
- `epochs=1` 只做冒煙：確認資料能讀、權重能存，**不是**收斂或準確度實驗。
- 小型官方資料（`mnist160`、`coco8-seg.yaml`、`coco8-pose.yaml`、`dota8.yaml`）只驗證管線，**不是**正式測試集。
- 訓練產物路徑以實際 `runs/` 為準；下列 `project`／`name` 分開寫，便於讀到已知的 `best.pt`。若目錄已存在，加上 `exist_ok=True` 讓輸出位置穩定。

## 任務不是同一套輸出

| 任務 | 權重（文件示例） | 驗證指標（不可互換） | 預測主物件 |
|------|------------------|----------------------|------------|
| classify | `yolo26n-cls.pt` | `metrics.top1` / `metrics.top5` | `result.probs` |
| segment | `yolo26n-seg.pt` | `metrics.seg.map`（遮罩）與 `metrics.box.map`（框）分開 | `masks` + 同序 `boxes` |
| pose | `yolo26n-pose.pt` | `metrics.pose.map`（關鍵點 AP）與 `metrics.box.map` 不同 | `keypoints` |
| obb | `yolo26n-obb.pt` | `metrics.box.map`（旋轉任務） | `obb` |

驗證指標不可跨任務解讀：分類沒有 `map`；分割的 `seg.map` 不是框的 `box.map`；姿態的 `pose.map` 不是框 AP；OBB 的 `box.map` 是旋轉框任務指標。

---

## 1. 影像分類 classify

官方頁：<https://docs.ultralytics.com/tasks/classify/>

文件示例權重 `yolo26n-cls.pt`；資料 `mnist160`；訓練影像邊長 `imgsz=64`。預測用 `result.probs.top1`、`result.probs.top1conf`，類別名 `names[top1]`。驗證看 `metrics.top1`、`metrics.top5`。

```bash
yolo classify train model=yolo26n-cls.pt data=mnist160 epochs=1 imgsz=64 project=runs/cls name=smoke exist_ok=True
yolo classify predict model=runs/cls/smoke/weights/best.pt source=image.jpg project=runs/cls name=pred exist_ok=True
```

若尚未訓練、只要預訓練推論，改用 `model=yolo26n-cls.pt`（不是 `best.pt`）。

```python
from ultralytics import YOLO

model = YOLO("yolo26n-cls.pt")
results = model.predict(source="image.jpg")
if not results:
    raise SystemExit("empty results")
r = results[0]
if r.probs is None:
    raise SystemExit("no classification probs")
top1 = int(r.probs.top1)
print(r.names[top1], float(r.probs.top1conf))
```

---

## 2. 實例分割 segment

官方頁：<https://docs.ultralytics.com/tasks/segment/>

文件示例 `yolo26n-seg.pt`、`data=coco8-seg.yaml`。`masks.data` 形狀 `N,H,W`；`masks.xy` 為像素多邊形。同一實例順序下，`boxes.cls`／`boxes.conf` 與遮罩對齊。驗證時 `metrics.seg.map` 對遮罩、`metrics.box.map` 對框，兩者不同。

```bash
yolo segment train model=yolo26n-seg.pt data=coco8-seg.yaml epochs=1 project=runs/seg name=smoke exist_ok=True
yolo segment predict model=runs/seg/smoke/weights/best.pt source=image.jpg project=runs/seg name=pred exist_ok=True
```

預訓練推論：`model=yolo26n-seg.pt`。

```python
from ultralytics import YOLO

model = YOLO("yolo26n-seg.pt")
results = model.predict(source="image.jpg")
if not results:
    raise SystemExit("empty results")
r = results[0]
if r.masks is None or r.boxes is None or len(r.masks) == 0:
    raise SystemExit("no instance masks")
print(tuple(r.masks.data.shape), len(r.masks.xy), r.boxes.cls, r.boxes.conf)
```

---

## 3. 姿態 pose

官方頁：<https://docs.ultralytics.com/tasks/pose/>

文件示例 `yolo26n-pose.pt`、`data=coco8-pose.yaml`。`keypoints.xy` 為 `N,K,2` 像素座標；`xyn` 為正規化座標；`data` 為 `N,K,2` 或 `N,K,3`（第三維可為模型輸出信心）。**模型輸出的 conf 不是 COCO 標註裡的 0/1/2 visibility。** `metrics.pose.map` 是關鍵點 AP，與 `metrics.box.map` 不同。

```bash
yolo pose train model=yolo26n-pose.pt data=coco8-pose.yaml epochs=1 project=runs/pose name=smoke exist_ok=True
yolo pose predict model=runs/pose/smoke/weights/best.pt source=image.jpg project=runs/pose name=pred exist_ok=True
```

預訓練推論：`model=yolo26n-pose.pt`。

```python
from ultralytics import YOLO

model = YOLO("yolo26n-pose.pt")
results = model.predict(source="image.jpg")
if not results:
    raise SystemExit("empty results")
r = results[0]
if r.keypoints is None or len(r.keypoints) == 0:
    raise SystemExit("no keypoints")
print(tuple(r.keypoints.xy.shape), tuple(r.keypoints.xyn.shape), tuple(r.keypoints.data.shape))
```

---

## 4. 旋轉框 OBB

官方頁：<https://docs.ultralytics.com/tasks/obb/>

文件示例 `yolo26n-obb.pt`、`data=dota8.yaml`。`obb.xywhr` 為 `N,5`（含弧度角）；`obb.xyxyxyxy` 為 `N,4,2` 像素四角。類別與信心為 `obb.cls`、`obb.conf`。驗證指標為旋轉任務的 `metrics.box.map`。文件亦說明：預測角**不是**「永遠長邊為準」的正規化朝向；旋轉 **180° 的框視為同一幾何，不代表物體航向**。

```bash
yolo obb train model=yolo26n-obb.pt data=dota8.yaml epochs=1 project=runs/obb name=smoke exist_ok=True
yolo obb predict model=runs/obb/smoke/weights/best.pt source=image.jpg project=runs/obb name=pred exist_ok=True
```

預訓練推論：`model=yolo26n-obb.pt`。

```python
from ultralytics import YOLO

model = YOLO("yolo26n-obb.pt")
results = model.predict(source="image.jpg")
if not results:
    raise SystemExit("empty results")
r = results[0]
if r.obb is None or len(r.obb) == 0:
    raise SystemExit("no OBB")
print(tuple(r.obb.xywhr.shape), tuple(r.obb.xyxyxyxy.shape), r.obb.cls, r.obb.conf)
```

驗證（冒煙，讀實際 `runs/` 下的 `best.pt`）：

```bash
yolo classify val model=runs/cls/smoke/weights/best.pt data=mnist160
yolo segment val model=runs/seg/smoke/weights/best.pt data=coco8-seg.yaml
yolo pose val model=runs/pose/smoke/weights/best.pt data=coco8-pose.yaml
yolo obb val model=runs/obb/smoke/weights/best.pt data=dota8.yaml
```

訓練完成後請打開實際路徑：`runs/cls/smoke/weights/best.pt`、`runs/seg/smoke/weights/best.pt`、`runs/pose/smoke/weights/best.pt`、`runs/obb/smoke/weights/best.pt`。

單標籤封閉集分類器對 OOD 圖通常仍會吐出某個類別機率，不會像偵測可以是零個物件。高分數只代表在訓練標籤上自信，不能證明輸入屬於訓練域。

## 失敗模式

- **任務／權重後綴不符**：`yolo26n-seg.pt` 拿去 `classify predict` 會缺 `probs`；分類權重沒有 `masks`／`keypoints`／`obb`。Python 必須對 `None` 與空長度守衛。
- **把 visibility 當 conf**：姿態 `data[...,2]` 是模型信心（文件所述），不是 GT 的 0/1/2。
- **把 OBB 角當航向**：180° 等價框不是物體朝向；也不是保證長邊對齊的正規化。
- **用 `seg.map` 當偵測成績、用 `pose.map` 當框成績、用分類 `top1` 當 mAP**：指標契約不相通。
- **`epochs=1` 當準確度結論**：只證明管線，數字無比較意義。
- **缺少 `image.jpg` 或資料 yaml 未下載**：CLI 會失敗；先確認檔案與官方小型資料名稱。
- **讀錯 `best.pt`**：`project`／`name` 必須與訓練一致；否則應改用文件中的預訓練檔名並在命令裡寫明。

## 驗收（通過／不通過）

1. 四個 `train`（`epochs=1`）各自寫入對應 `project/name`，且磁碟上存在 `weights/best.pt`（或該版本實際寫出的權重檔）。
2. 四個 `predict` 明確指向該 `best.pt` **或** 文件中的預訓練權重，不得混用未聲明路徑。
3. 四段 Python 分別 `YOLO("yolo26n-*.pt")`，`source="image.jpg"`，並在 `results`／任務頭為 `None` 或長度 0 時退出。
4. `val` 只報該任務文件所列指標：classify 看 top1/top5；segment 同時承認 `seg.map` 與 `box.map` 不同；pose 承認 `pose.map` 與 `box.map` 不同；obb 承認旋轉任務的 `box.map`。
5. 未把冒煙數字當成正式測試；未把 OBB 角解釋成航向；未把 pose conf 解釋成 visibility。
