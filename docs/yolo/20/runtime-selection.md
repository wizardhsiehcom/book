# YOLO 匯出目標：ONNX Runtime、TensorRT、OpenVINO、CoreML

固定形狀、batch 1、輸入 640 的 ONNX 基線見 [onnx-baseline.md](onnx-baseline.md)。那份基線回答「圖長什麼樣子」；本文回答「圖要交給誰跑、誰保證什麼、誰不保證」。截至 **2026-09-08**，Ultralytics 文件與各廠執行時文件仍以條件式支援為主，不要把「能匯出」讀成「任何裝置上同一顆引擎都能跑」。

官方入口：[Export 模式](https://docs.ultralytics.com/modes/export/)、[CoreML 整合](https://docs.ultralytics.com/integrations/coreml/)、[TensorRT 效能與最佳實務](https://docs.nvidia.com/deeplearning/tensorrt/latest/performance/best-practices.html)。實際 opset、輸入佈局、輸出頭必須對**你這顆檔**用圖檢查，沒有萬用輸出形狀。

## 先對齊圖，再選執行時

匯出後請至少確認：

- **Opset** 與圖輸入名稱、維度、dtype。
- **佈局**：常見為 NCHW、RGB、正規化、letterbox；以 metadata 與實際預處理為準，勿假設 BGR 或未 letterbox。
- **輸出**：detect／segment／pose 頭不同；NMS 內嵌與否會改輸出張量個數與語意。**輸出形狀不是萬用常數。**

NMS 旗標（文件語意，以當日 CLI／Python API 為準）：

| `nms` | 語意 |
| --- | --- |
| `None`（常見預設） | 原始頭，**外部** NMS |
| `True` | 在**支援的格式／路徑**上內嵌 NMS |
| `False` | 走可用的 **NMS-free** 頭路徑 |

YOLO11 **沒有**與舊版一對一對應的 NMS-free 保證。內嵌 NMS 是否真的進圖，要看該格式的 native 路徑，**不可宣稱「永遠是 raw」**。先匯、再開圖或跑一次 session，再寫後處理。

## 四家執行時對照

| 執行時 | 主要硬體／EP | 相容與設定要點 | 不要假設的事 |
| --- | --- | --- | --- |
| **ONNX Runtime** | CPU EP；GPU 另裝 CUDA／TensorRT 等 EP | `get_available_providers()` 只表示**已註冊**，不表示每個節點都落在該 EP；EP 可**條件式 fallback** 到 CPU | 列出 CUDA 不等於整圖在 GPU |
| **TensorRT** | **NVIDIA** GPU，依安裝的 TRT／CUDA／驅動 | 動態形狀用 **optimization profile** 的 min／opt／max；engine 綁硬體與版本 | **未知** engine 的跨機可攜性；先對照該機 [支援矩陣](https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/support-matrix.html)，**不給保證** |
| **OpenVINO** | Intel **CPU／GPU／NPU**，依 plugin | 裝置字串與 plugin 必須對得上實際硬體與 IR／ONNX | 「Intel」≠ 每顆 iGPU／NPU 都載入成功 |
| **CoreML** | **原生** Apple：**iOS／iPadOS／macOS** | `.mlpackage`／Neural Engine 是裝置端故事 | 與 Python 轉換／驗證環境分開看（見下） |

### CoreML：原生裝置 ≠ Python 工具鏈

- **推論／驗證 `coremltools` 的 `predict`**：文件與實務上以 **macOS** 為主。
- **匯出**：在 **x86 Linux** 上產出 CoreML 封裝**有可能**（轉換圖），但那不是「在 Linux 上跑 Apple Neural Engine」。
- **原生行動端**：iOS／iPadOS／macOS App 載入模型才是 CoreML 執行時。不要把 Linux 匯出成功、macOS `predict`、手機上的 ANE 混成同一句「CoreML 能跑」。

Python 環境用中性的 **`.venv-yolo`** 即可，不綁特定套件管理器敘事。

## ONNX Runtime：註冊 EP ≠ 實際落點

建立 session 時傳入的 provider 清單是**偏好順序**。某個 op 若該 EP 不實作，會落到下一個（常常是 CPU）。除錯時看 session 的實際 placement／profiling，不要只印 `get_available_providers()`。

下列片段只做**接線煙霧測試**：全零輸入、固定 `1×3×640×640`、`float32`。**不是準確度測試。** 跑完可 `end_profiling()` 看節點落在哪。

```python
# 接線煙霧：全零輸入，非準確度
import numpy as np
import onnxruntime as ort

so = ort.SessionOptions()
so.enable_profiling = True
sess = ort.InferenceSession(
    "weights/yolo11n.onnx",
    sess_options=so,
    providers=["CPUExecutionProvider"],  # 先 CPU；GPU EP 需另行安裝且仍可能 fallback
)
print("registered:", ort.get_available_providers())
print("session providers:", sess.get_providers())

for i in sess.get_inputs():
    print("in", i.name, i.shape, i.type)
for o in sess.get_outputs():
    print("out", o.name, o.shape, o.type)

x = np.zeros((1, 3, 640, 640), dtype=np.float32)
feeds = {sess.get_inputs()[0].name: x}

outs = sess.run(None, feeds)
prof = sess.end_profiling()
print("n_outputs", len(outs), "profile", prof)
```

動態 batch 或動態邊長時，把 `1,3,640,640` 換成圖上真實維度；維度是 symbolic 就必須對齊 export 時的動態軸，否則這段煙霧會直接失敗——那正是它的用途。

## TensorRT：profile 與不可攜引擎

TensorRT 的動態形狀不是「任意 H×W」。建 engine 時要給 **min／opt／max** profile；opt 應接近線上主流量，max 決定 workspace 與記憶體上界。換卡、換 TRT 大版、換 CUDA 後，舊 `.engine` 經常不能載。正確做法是在**目標機器**上從 ONNX 重建，並核對該安裝的支援矩陣。對來路不明的 engine：**先查支援，不保證能載、能對齊精度。**

固定 640、batch 1 時，許多部署其實不需要動態 profile；能固定就固定，比「預留所有解析度」更可預測。需要多解析度再加 profile，並在 opt 上量測，而不是只在 max 上看能不能建出來。

## OpenVINO：裝置字串對 plugin

Intel CPU、核顯 GPU、NPU 各走不同 plugin。編譯／載入時指定的 device（如 `CPU`、`GPU`、`NPU`）必須存在於該機 runtime。模型若含該裝置不支援的 op，會編譯失敗或部分落到 CPU——行為依版本與裝置而變，部署清單裡應寫死「哪顆機器、哪個 device、哪一版 OpenVINO」，而不是「Intel 通吃」。

## 建議驗收順序

1. 以 [onnx-baseline.md](onnx-baseline.md) 固定 640／batch 1 的 ONNX 對過輸入佈局與頭。
2. 明確 `nms`：raw＋外部 NMS、內嵌（僅在支援路徑）、或 YOLO11 上實際是否存在 NMS-free——以圖為準。
3. ORT CPU session 跑全零煙霧，再視需要加 GPU EP 並看 profiling／fallback。
4. NVIDIA 目標：本機建 TensorRT，寫明 profile；不搬未知 engine。
5. Intel：對目標 CPU／GPU／NPU plugin 各編譯一次。
6. Apple：Linux 頂多負責匯出；`predict` 在 macOS；手機／平板用原生 CoreML，三者分開寫進 runbook。

一句收束：執行時表格是**目標相容性與 plugin／EP 地圖**，不是精度 SLA。圖的 opset、RGB／letterbox、輸出頭、NMS 是否進圖，永遠以該次匯出的檔案為準。
