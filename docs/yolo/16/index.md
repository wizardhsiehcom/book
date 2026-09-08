# 追蹤工程：影格偵測與身份連續

影像偵測每張影格給出框與類別；追蹤要在時間軸上把「同一物體」連成一條身份。兩者不是同一驗收：框準不等於身份穩。底下用合成數字把操作、失敗假說與接受條件寫清楚，不宣稱任何真實執行結果。公開 API 事實以 2026-09-08 查過的 [Ultralytics Track](https://docs.ultralytics.com/modes/track/) 為準：預設 tracker 是 TrackTrack；8.4.63 起可換新 tracker；呼叫形如 `model.track(source=video, tracker="bytetrack.yaml", stream=True)`；同一串流連續影格用 `persist=True`。[ByteTrack](https://github.com/FoundationVision/ByteTrack) 用低分框做第二次關聯；[BoT-SORT](https://github.com/NirAharon/BoT-SORT) 結合運動、外觀與相機運動補償。此頁不報公開基準分數。

相關概念見 [評估](../06/index.md)、[卷積](../08/index.md)、[架構](../09/index.md)、[訓練](../10/index.md)、[推論](../11/index.md)、[除錯](../13/index.md)、[改善](../14/index.md)、[基準](../19/index.md)、[匯出](../20/index.md)、[即時](../21/index.md)，以及 [神經網路總覽](../08/index.md)。過線計數另見 [事件計數](event-counting.md)：tracker 品質與過線事件檢查必須分開驗收。

## 身份切換與軌跡破碎

假設 30 fps、長度 6.0 s 的合成片段，真值只有一人。影格 0–89 偵測框連續，追蹤器給 `id=3`。影格 90–119 完全被柱子擋住，沒有框。影格 120–179 人再出現，框回來但 `id=7`。這是**同一物體以新 ID 重生**：新軌跡、軌跡破碎（fragmentation）。它**不是**所有協議裡都會自動計成「ID switch」。指標定義跟協議走，不可把「ID 變了」一律當成同一種錯誤。

需求端常寫「遮擋後要恢復同一 ID」。那是**你要的身份連續接受條件**，不是演算法保證。一張合成截圖看不見遮擋區間，不能推論「一定恢復」。接受條件應寫成可測句子，例如：遮擋短於 0.40 s（12 影格）且重現框與最後一框 IoU≥0.30 時，允許同一 `id`；超過則允許新 `id`，並在報告裡分開列破碎次數，而不是假裝演算法承諾永不換號。

## 缺口、時間戳與預處理陷阱

缺口先問時間戳從哪來：檔案影格序、容器 PTS，還是相機牆鐘。長缺口（例如串流中斷 8 s）不要把舊身份永遠留著，也不要把「凍結最後位置」當萬用規則。較穩的操作是：新串流、重置 tracker、或給相機命名空間前綴（`camA-3` 與 `camB-3` 不是同一人）。`persist=True` 只適用**同一串流的連續呼叫**；無關鏡頭之間不要共用同一個 tracker 狀態。

ByteTrack 需要一部分低分框做第二次關聯。若在送進 tracker 前用 `conf=0.50` 砍掉 0.20–0.49 的框，第二次關聯沒有原料，遮擋邊緣的人更容易碎成新軌。預處理可以清雜訊，也可以把 tracker 需要的弱偵測一起刪掉；改門檻時要用同一段合成序列對照破碎次數，而不是只看單張高分框。

## 串流迴圈與雙軌驗收

下列片段假設本機已有 video.mp4、已安裝 ultralytics，且 yolo11n.pt 會在首次載入時下載。它只把每幀的 boxes（xyxy）與 track ID 取出，用框底邊中點當腳點，組成該幀 samples：(tid, x, y)。完整過線事件迴圈見 [影片過線計數](../23/count_video.py)。

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")
video = "video.mp4"

for result in model.track(source=video, tracker="bytetrack.yaml", stream=True, persist=True):
    boxes = result.boxes
    if boxes is None or boxes.id is None:
        continue
    xyxy = boxes.xyxy.cpu().tolist()
    ids = boxes.id.cpu().tolist()
    samples = []
    for tid, (x1, y1, x2, y2) in zip(ids, xyxy):
        samples.append((int(tid), float((x1 + x2) / 2), float(y2)))
    print(samples)
```

`boxes` 或 `id` 為 `None` 時跳過，避免空影格當成人消失而誤重置。失敗假說三條：（1）過線邏輯把破碎新 ID 當成新人，事件數膨脹；（2）長缺口仍沿用舊 `id`，跨鏡頭撞號；（3）高 `conf` 預處理造成弱框消失、破碎上升。接受條件：tracker 報告 ID 連續性與 [事件計數](event-counting.md) 的過線次數分開簽核；後者只信時間戳與線幾何，不把 tracker 當事件真相。
