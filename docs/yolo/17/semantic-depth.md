# YOLO26 語意分割與單目深度：像素標籤與公尺估計

本頁只講 Ultralytics YOLO 的兩個**稠密影像**任務：語意分割把每個像素標成類別 ID；單目深度把每個像素估成公尺。兩者都不是實例框或實例遮罩。任務總覽見 [任務總覽](../15/index.md)。事實核對日期：2026-09-08（非實測日期）。官方頁：[語意任務](https://docs.ultralytics.com/tasks/semantic/)、[語意資料集](https://docs.ultralytics.com/datasets/semantic/)、[深度任務](https://docs.ultralytics.com/tasks/depth/)、[深度資料集](https://docs.ultralytics.com/datasets/depth/)。

## 前置與可執行最小輸入

安裝 `ultralytics` 與 PyTorch 後，權重會在首次 CLI／Python 呼叫時下載。語意預訓練權重 `yolo26n-sem.pt` 的**類名是預訓練集合**，不是你自訂 YAML 的 `names`。自訂類名只在你用自己的 `data.yaml` **train** 之後才成立。

讀者需自建資料目錄（下列 YAML 的相對路徑）。語意：`images/train/a.jpg` 必須對到 `masks/train/a.png`（單通道 class-ID PNG，值 `0..N-1`，`255` 為忽略）。RGB 彩色預覽圖**不是**訓練標籤。縮放標籤用 nearest。深度：`images/train/a.jpg` 配對 `depth/train/a.png` 或 `depth/train/a.npy`，擇一即可；載入器優先尋找 PNG，找不到才找 NPY。PNG 為 2D `uint16`，公尺 = 像素值 / `depth_scale`（例如 1500 → 1.5 m）；NPY 已是 2D float 公尺。`<=0` 為無效並排除。

語意 YAML（`datasets/toy_semantic/data.yaml`）：

```yaml
path: datasets/toy_semantic
train: images/train
val: images/val
masks_dir: masks
names:
  0: background
  1: road
  2: building
```

深度 YAML（`datasets/toy_depth/data.yaml`）：

```yaml
path: datasets/toy_depth
train: images/train
val: images/val
nc: 1
names:
  0: depth
depth_scale: 1000
```

CLI（語意／深度；`image.jpg` 換成你的檔）：

```bash
yolo semantic predict model=yolo26n-sem.pt source=image.jpg
yolo semantic train model=yolo26n-sem.pt data=datasets/toy_semantic/data.yaml
yolo semantic val model=yolo26n-sem.pt data=cityscapes.yaml

yolo predict task=depth model=yolo26n-depth.pt source=image.jpg
yolo train task=depth model=yolo26n-depth.pt data=datasets/toy_depth/data.yaml
yolo val task=depth model=yolo26n-depth.pt data=nyu-depth.yaml
```

`val(data="cityscapes.yaml")` 回傳 `.miou`、`.pixel_accuracy`。[語意任務](https://docs.ultralytics.com/tasks/semantic/)\
`val(data="nyu-depth.yaml")` 回傳 `.delta1`、`.abs_rel`、`.rmse`、`.silog`。`delta1` 為 `max(預測/真值, 真值/預測) < 1.25` 的有效像素比例（愈高愈好）；其餘愈低愈好，RMSE 單位為公尺。[深度任務](https://docs.ultralytics.com/tasks/depth/)

## Python：抽出語意 ID 圖與深度公尺圖

```python
from ultralytics import YOLO

sem = YOLO("yolo26n-sem.pt")
r0 = sem("image.jpg")[0]
semantic_mask = r0.semantic_mask.data  # 整數 H×W，像素 class ID；非實例 mask／box

dep = YOLO("yolo26n-depth.pt")
d0 = dep("image.jpg")[0]
depth_m = d0.depth.data  # float32 H×W，公尺；學習到的估計，不是萬用尺

# 官方資料集驗證（需備妥對應資料）
# sem_metrics = YOLO("yolo26n-sem.pt").val(data="cityscapes.yaml")
# print(sem_metrics.miou, sem_metrics.pixel_accuracy)
# dep_metrics = YOLO("yolo26n-depth.pt").val(data="nyu-depth.yaml")
# print(dep_metrics.delta1, dep_metrics.abs_rel, dep_metrics.rmse, dep_metrics.silog)
```

`semantic_mask.data` 是整數 `H,W` class ID，**不是**實例遮罩或框。[語意任務](https://docs.ultralytics.com/tasks/semantic/)\
`result.depth.data` 是 `H,W` `float32` 公尺，屬**學得估計**，**不是**通用測距尺。[深度任務](https://docs.ultralytics.com/tasks/depth/)

語意分割的類別 IoU 是 TP/(TP+FP+FN)，不是只看預測對的像素。mIoU 是對「有納入評估」的類別取平均，忽略標籤（ignore）的像素不進 TP/FP/FN，政策必須寫清楚。像素準確率常被大面積背景拉高：全當背景也能很高。應同時報稀有／細長類別失敗。合成混淆：兩類 90% 背景、10% 道路，全預測背景可得約 90% 像素準確率，但道路 IoU=0。

## 對齊協定與失敗模式

官方深度表常報 **TTA + log-least-squares 對齊**；一般 `val` 多用**中位數尺度對齊**。對齊可以**掩蓋原始絕對尺度誤差**。測距應用必須寫明協定，並另外驗證**未對齊**的物理誤差。[深度任務](https://docs.ultralytics.com/tasks/depth/)

真實 hold-out 才算數：光照、相機、感測器對位、細邊界、反光物體。合成資料只作冒煙。常見失敗：語意把 RGB 預覽當標籤、雙線性縮放 ID 圖、檔名對不上 `masks/`；深度把 PNG 當已是公尺、忽略 `depth_scale`、把 `<=0` 當有效深度。

## 驗收

- 語意：`semantic_mask` 為整數 `H×W`，值在標籤 ID 範圍（忽略 255 不參與訓練統計）；CLI `semantic predict/train/val` 可跑；`val` 露出 `miou`、`pixel_accuracy`。
- 深度：`depth.data` 為 `float32` `H×W` 公尺；PNG/NPY 配對與 `depth_scale` 正確；`val` 露出 `delta1`、`abs_rel`、`rmse`、`silog`；報告寫明對齊與否，測距另查未對齊誤差。
