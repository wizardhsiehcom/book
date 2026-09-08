# 兩條互不混用的攝入路徑：Ultralytics 代管串流 vs 自管 RTSP 重連

現場攝影機進 YOLO，不要把「誰負責開鏡頭」跟「誰負責推論」糊成同一段。下面是兩條**分開**的攝入路徑。路徑 A 把 `VideoCapture` 完全交給 Ultralytics；路徑 B 自己用 OpenCV FFmpeg 後端開 RTSP，並把逾時寫進**建構／open 參數**，不是 `open()` 之後再 `cap.set`。兩條不要疊：A 的呼叫端只消費 `Results`；B 的呼叫端自己讀 frame，再對單張影像做普通 `predict`。

官方依據請直接讀：

- OpenCV Video I/O 旗標與屬性：<https://docs.opencv.org/4.x/d4/d15/group__videoio__flags__base.html>
- Ultralytics Predict：<https://docs.ultralytics.com/modes/predict/>

營運側的背壓與重啟節奏見同目錄 [`backpressure.md`](backpressure.md)、[`operations.md`](operations.md)。

## 路徑 A：Ultralytics 代管來源

`model.predict(source=...)` 在 `source` 是 URL／裝置／檔案時，由套件內部開解碼器。`stream=True` 回傳 **generator**，官方文件強調的是**記憶體**：不要一次把整個影片的 `Results` 堆進 list。這不是「永遠拿到最新一幀」的保證。`stream_buffer=False` 讓內部佇列不要為了填滿緩衝而囤舊幀；`vid_stride=1` 不跳幀；`verbose=False` 關掉 Ultralytics 自己的進度列，**不能**當成憑證脫敏。

原生 FFmpeg／GStreamer 仍可能把完整 URL（含帳密）打進它們自己的 log。生產環境必須做一次 log 存取與脫敏測試，而不是假設 `verbose=False` 就夠。URL 只從環境變數讀，程式只檢查「有沒有設」，**不要 print 整段 URL**。

路徑 A 的呼叫端**不要自己 `VideoCapture`**。斷線、重連、後端選擇都在套件內部；你要可觀測的重連與逾時，用路徑 B。

```python
# path_a_ultralytics_managed.py
import os
import uuid
from ultralytics import YOLO

def main() -> None:
    url = os.environ.get("CAMERA_URL")
    if not url:
        raise SystemExit("CAMERA_URL is not set")

    session_id = str(uuid.uuid4())
    model = YOLO("yolo11n.pt")
    print(f"session={session_id} path=A ingest=ultralytics-managed")

    results_iter = model.predict(
        source=url,
        stream=True,
        stream_buffer=False,
        vid_stride=1,
        verbose=False,
    )
    for result in results_iter:
        n = 0 if result.boxes is None else len(result.boxes)
        print(f"session={session_id} detections={n}")

if __name__ == "__main__":
    main()
```

`CAMERA_URL=rtsp://user:pass@host:554/stream python path_a_ultralytics_managed.py`

檔案 EOF 對路徑 A 是正常結束；RTSP 上 generator 停住或丟錯，語意是來源沒了，不是「這一幀沒偵測到物件」。空偵測仍會產出 `Results`，只是 `boxes` 長度為 0。

## 路徑 B：自管 RTSP、建構期逾時、有界重連

OpenCV 文件把 `CAP_PROP_OPEN_TIMEOUT_MSEC`、`CAP_PROP_READ_TIMEOUT_MSEC` 標成與 **open** 相關的設定；實際是否同時管 open／read，取決於後端。FFmpeg 與 GStreamer 路線對 open／read 逾時的支援較完整。這些值必須進 `VideoCapture` **建構子（或等價的 open 參數列表）**。`open()` 成功之後再 `cap.set(OPEN_TIMEOUT)` 常常無效，因為 socket／demux 已經用預設逾時建好了。

開完立刻核對：

- `cap.isOpened()`
- `cap.get(cv2.CAP_PROP_BACKEND)` 是否真的是 FFmpeg（數值依建置而變，失敗時不要假裝連上）
- `read()` 回 `False`：**RTSP 上這是斷線或 read timeout**，不是偵測空窗。本機檔案讀到 EOF 的 `False` 是另一件事，不要用同一套「重連 6 次」去對待檔案播放結束。

失敗計數**不是** `open()` 成功就歸零。串流常會 open 成功、吐兩三幀、再卡死。只有連續 **30 幀** `ret is True` 且 `frame is not None`，才把失敗次數歸零。重試上限 **6**；退避指數成長，加上 jitter，上限 **30 秒**。每一次失敗的 cap、每一次例外、以及 `KeyboardInterrupt`，都要 `release()`；`finally` 再保險一次。

路徑 B 的推論是 **普通 list 路徑**：`model.predict(frame, verbose=False)`，不要加 `stream=`、不要加 tracker、不要 `persist`。這份腳本只做純偵測。session 用 UUID，log 只打 session 與計數。

追蹤是**另一條延伸**，不要寫進下面這支可執行檔，也不要在程式裡假裝「reset tracker」。若重連後要跟：對**新串流**建 **新的 `YOLO()`**，再顯式 `model.track(..., persist=True, tracker="bytetrack.yaml")`。舊 session 的 ByteTrack 狀態不要沿用。

```python
# path_b_rtsp_reconnect.py
import os
import sys
import time
import uuid
import random
from typing import Optional

import cv2
from ultralytics import YOLO

MAX_RETRIES = 6
GOOD_FRAMES_TO_RESET = 30
OPEN_TIMEOUT_MS = 5000
READ_TIMEOUT_MS = 3000
BACKOFF_CAP_S = 30.0


def open_rtsp(url: str) -> Optional[cv2.VideoCapture]:
    cap = cv2.VideoCapture(
        url,
        cv2.CAP_FFMPEG,
        [
            cv2.CAP_PROP_OPEN_TIMEOUT_MSEC,
            OPEN_TIMEOUT_MS,
            cv2.CAP_PROP_READ_TIMEOUT_MSEC,
            READ_TIMEOUT_MS,
        ],
    )
    if not cap.isOpened():
        cap.release()
        return None
    backend = cap.get(cv2.CAP_PROP_BACKEND)
    print(f"backend={backend} opened=1")
    return cap


def backoff_sleep(attempt: int) -> None:
    base = min(BACKOFF_CAP_S, 2 ** attempt)
    delay = min(BACKOFF_CAP_S, base + random.uniform(0, 1.0))
    print(f"backoff_s={delay:.2f} attempt={attempt}")
    time.sleep(delay)


def main() -> None:
    url = os.environ.get("CAMERA_URL")
    if not url:
        raise SystemExit("CAMERA_URL is not set")

    session_id = str(uuid.uuid4())
    print(f"session={session_id} path=B ingest=self-managed-rtsp")
    model = YOLO("yolo11n.pt")

    retries = 0
    cap: Optional[cv2.VideoCapture] = None
    good_streak = 0

    try:
        while retries <= MAX_RETRIES:
            if cap is None:
                cap = open_rtsp(url)
                if cap is None:
                    retries += 1
                    print(f"session={session_id} open_failed retries={retries}")
                    if retries > MAX_RETRIES:
                        break
                    backoff_sleep(retries)
                    continue

            ret, frame = cap.read()
            if not ret or frame is None:
                print(f"session={session_id} read_false rtsp_disconnect_or_timeout")
                cap.release()
                cap = None
                good_streak = 0
                retries += 1
                if retries > MAX_RETRIES:
                    break
                backoff_sleep(retries)
                continue

            good_streak += 1
            if good_streak >= GOOD_FRAMES_TO_RESET:
                retries = 0

            results = model.predict(frame, verbose=False)
            n = 0
            if results and results[0].boxes is not None:
                n = len(results[0].boxes)
            print(f"session={session_id} detections={n} good_streak={good_streak}")
    except KeyboardInterrupt:
        print(f"session={session_id} interrupt")
    except Exception as exc:
        print(f"session={session_id} error={type(exc).__name__}")
        if cap is not None:
            cap.release()
            cap = None
        raise
    finally:
        if cap is not None:
            cap.release()


if __name__ == "__main__":
    try:
        main()
    except Exception:
        sys.exit(1)
```

`CAMERA_URL=rtsp://user:pass@host:554/stream python path_b_rtsp_reconnect.py`

追蹤延伸（**不要**併進上面迴圈當「假 reset」）示意：

```python
# 重連成功、新串流開始之後才執行；新 YOLO，顯式 ByteTrack
model = YOLO("yolo11n.pt")
results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)
```

## 對照與營運銜接

| | 路徑 A | 路徑 B |
|---|---|---|
| 誰開 cap | Ultralytics | 呼叫端 FFmpeg `VideoCapture` |
| 逾時 | 套件／解碼器預設 | 建構參數 5s open／3s read |
| 重連 | 不在呼叫端 | 6 次、退避 cap 30s + jitter |
| 失敗歸零 | 不適用 | 連續 30 好幀，不是 mere open |
| 推論 API | `predict(source=url, stream=True, ...)` | `predict(frame)` list |
| `read False` | 由套件消化 | RTSP＝斷線／timeout |

路徑 A 適合先把模型跑通、接受套件代管生命週期。路徑 B 適合要對 RTSP 逾時、重試、release 與 session log 負責的現場。背壓（推論慢於取幀）與程序級重啟寫在 [`backpressure.md`](backpressure.md)、[`operations.md`](operations.md)；不要在 B 的 `predict(frame)` 上再套 `stream=True` 來「假裝即時」。generator 管的是記憶體佔用，新鮮度靠路徑 B 的 `stream_buffer` 對應物——也就是你自己決定讀到的那一張 `frame` 立刻送進模型，並且在 `read False` 時拆掉 cap，而不是讓舊 decoder 殭屍繼續佔著 URL。
