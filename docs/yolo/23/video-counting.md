# 有限長度影片的穿越計數

本頁只做一件事：對**一段會結束的影片**，用追蹤 ID 判斷物體是否**完整穿越**一條水平帶，把每一次穿越寫成事件列，而不是把畫面裡的人數當答案。腳本是獨立產物 [`count_video.py`](count_video.py)；追蹤語意對 [`../16/index.md`](../16/index.md)，驗收對 [`../21/index.md`](../21/index.md)。

執行環境是**隔離的 YOLO venv**（例如 `yolo-venv`），環境準備見 [02 第一個推論](../02/index.md)。來源：[Ultralytics Track](https://docs.ultralytics.com/modes/track/)：`model.track` 連續影格、`boxes.id` 為追蹤編號。本頁**明確**傳 `tracker="bytetrack.yaml"` 且 `persist=True`；**不要**寫成「函式庫預設就是 ByteTrack／persist」。

## 規則（不是人數）

- 水平計數帶：正規化縱座標中心 `line_y`、半寬 `margin`（皆 ∈ (0,1)，相對影格高）。上側 `cy < line_y - margin`，下側 `cy > line_y + margin`，帶內不改側。
- **穩定側**從上變下或從下變上，各記一次穿越（雙向都算）。帶內抖動、未出帶就折返，**不算**。
- `track_id` 是追蹤器給的編號，**不是人**。遮擋、出畫、重現常換新 ID；同一人可能兩列，兩個 ID 也可能是同一人。
- 每次執行一個 `session_id`（UUID）。CSV 欄位固定：`session_id,frame,track_id,direction`。`direction` 為 `down` 或 `up`。
- 手標是**時間戳 + 方向**的一對一對應（容許窗），要數 **false / miss / duplicate**，**禁止**只比總次數。

## CLI

```text
python count_video.py \
  --video data/clip.mp4 \
  --model weights/yolo11n.pt \
  --class-id 0 \
  --line-y 0.50 \
  --margin 0.04 \
  --output events.csv
```

`--self-check`：不讀影片、不載權重；用合成中心點序列跑穿越狀態機（CPU）。

```text
python count_video.py --self-check
```

預期：行程結束碼 0，stdout 含 `self-check ok`。

## 輸入／輸出

輸入：本機短片（有限長度）、權重檔、`--class-id`（COCO 人常為 `0`，以你的模型為準）、正規化 `--line-y` / `--margin`。

以下為合成 CSV 格式示例，實際事件以輸入影片為準。

`events.csv`：

```text
session_id,frame,track_id,direction
3f2a9c1e-7b44-4c0a-9d21-0e8b1a2c4d5f,42,3,down
3f2a9c1e-7b44-4c0a-9d21-0e8b1a2c4d5f,88,3,up
3f2a9c1e-7b44-4c0a-9d21-0e8b1a2c4d5f,121,7,down
3f2a9c1e-7b44-4c0a-9d21-0e8b1a2c4d5f,190,12,down
```

同一 `session_id` 貫穿該檔；`frame` 為 OpenCV 成功解碼影格的序號（從 0）。不要把 `track_id` 3 與 12 加成「兩個人」除非手標同意。

## 手標對齊（本專案驗收）

手標表：`t_sec,direction`（或影格號 + 方向）。對每個預測事件，在容許窗內找**尚未配對**且方向相同的手標；配上則雙方用掉。

| 名稱 | 定義 |
| --- | --- |
| miss | 手標沒有預測 |
| false | 預測沒有手標 |
| duplicate | 同一手標被兩個 `track_id` 各打一次（遮擋換 ID） |

通過：**miss=0、false=0、duplicate=0**（或你在 [`../21/index.md`](../21/index.md) 寫死的上限）。**總事件數相等不算通過。**

## `--self-check` 必須覆蓋的合成軌

全在 CPU、不呼叫 CUDA、不讀真實 mp4：

1. **jitter**：中心在帶內上下抖 → 0 事件。
2. **return**：進入帶後回到原側 → 0 事件。
3. **newID**：舊 ID 在帶中消失、新 ID 在另一側出現 → **不算**穿越（沒有同一 ID 的穩定側轉換）。
4. **reset**：連續兩段序列、中間清空 `last_stable` → ID 重用不得繼承上一場的側。

自查失敗時以非零結束碼與 assertion 位置指出失敗條件。

## 診斷（先查表再改帶）

| 現象 | 先看 |
| --- | --- |
| 全檔無列 | `boxes.id` 是否皆為 `None`；`persist` 與 `tracker=` 是否都有傳；`class-id` 是否無此類 |
| 總數對、duplicate 高 | 遮擋換 ID；手標是人、CSV 是 track |
| 帶附近 false 高 | `margin` 過小，抖動被當成兩側跳變 |
| 折返被算進去 | 是否把「進帶」當成穿越；應等對側穩定 |
| 第二次跑 ID 從頭 | 預期；新 `session_id`，勿跨行程比 ID |
| 要測效能 | 依 [計時協定](../19/timing-protocol.md) 在目標裝置量測 |

帶位置用你自己的畫面決定，以正規化座標對齊影片尺寸。短片先跑通，再把同一腳本接到更長素材；計數定義不變。
