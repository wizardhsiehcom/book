# 來源

下列為查閱入口，不是跑分成績單。**不記載已讀日期，不捏造 FPS／mAP。** Ultralytics 文件隨套件變；對文件前先鎖 `ultralytics` 版本，CLI 與 Python API 以該版為準。

## Ultralytics（動態 API，必須鎖版）

- [Predict](https://docs.ultralytics.com/modes/predict/)：單張／資料夾推論、conf、IoU（此處多為 **NMS IoU**）、影像尺寸。限制：預設 letterbox 與後處理版本相關；對齊 [02 推論](../02/index.md)、[03 座標](../03/index.md)。建議讀：Results 物件裡的 `xyxy`／`orig_shape`。
- [Train](https://docs.ultralytics.com/modes/train/)：資料 yaml、epochs、imgsz、增強。限制：訓練 imgsz **不必**等於推論 imgsz，但 letterbox 契約要一致。建議讀：資料路徑與 `rect`／快取選項，避免 silently 改幾何。
- [Datasets](https://docs.ultralytics.com/datasets/)：官方資料格式與現成清單。限制：公開集標註規範≠你的產品本體；類別名對不上會讓 mAP 類別等權平均變得無意義。建議讀：偵測 yaml 的 `train`／`val` 分離。
- [Detect 任務](https://docs.ultralytics.com/tasks/detect/)：偵測任務邊界。分割／姿態／OBB 見 [15](../15/index.md)，不要從 detect 頁推導。
- [Export](https://docs.ultralytics.com/modes/export/)：ONNX、TensorRT、CoreML 等。限制：匯出後 NMS 可能在圖內或圖外；quantization 精度必須另測。對齊 [20 匯出](../20/index.md)。
- [Benchmark](https://docs.ultralytics.com/modes/benchmark/)：格式間速度／大小比較入口。限制：數字綁硬體與版本；只能當方法參考，不能當你的 SLA。對齊 [19 benchmark](../19/index.md)。
- [Quickstart](https://docs.ultralytics.com/quickstart/)：安裝與最小範例。限制：預設模型與預設資料不是你的契約。

## 評估、歷史、分支、洩漏、執行時

- [COCO cocoapi（評估實作）](https://github.com/cocodataset/cocoapi)：TP matching IoU 掃描、AP、mAP 的參考實作。限制：假設 GT 完整；漏標會把正確預測打成 FP。建議讀：`cocoeval.py` 的匹配邏輯，對照 [06 評估](../06/index.md)。
- [You Only Look Once（arXiv:1506.02640）](https://arxiv.org/abs/1506.02640)：原 YOLO 把偵測收成單次迴歸的歷史論文。限制：錨框、損失、NMS 細節已被後續版本改寫。建議讀：問題設定與「整圖一次看」的動機；實作以你鎖的套件為準。對齊 [12 演進](../12/index.md)。
- [THU-MIG/yolov10](https://github.com/THU-MIG/yolov10)：YOLOv10 作者倉庫（one-to-one 一致雙重指派，用以支援 NMS-free 推論）。限制：與 Ultralytics 主線不一定同一推論圖。建議讀：README 的推論設定與論文連結。
- [sunsmarterjie/yolov12](https://github.com/sunsmarterjie/yolov12)：YOLOv12 分支作者倉庫。限制：同名「YOLO」權重與頭結構可能不互通。建議讀：官方權重與模組列表，再進 [18 選型](../18/index.md)。
- [scikit-learn Common pitfalls（資料洩漏）](https://scikit-learn.org/stable/common_pitfalls.html)：切分、預處理擬合範圍、重複樣本。限制：範例是表格學習；原則直接適用影像：同一場景／同一幀進 train 與 val 就是洩漏。對齊 [04 資料切分](../04/index.md)。
- [ONNX Runtime](https://onnxruntime.ai/docs/)：跨硬體執行 ONNX。建議讀：圖優化與 IO binding；限制：自帶與不自帶 NMS 的模型行為不同。
- [NVIDIA TensorRT](https://docs.nvidia.com/deeplearning/tensorrt/)：NVIDIA GPU 上的引擎與 INT8。建議讀：精度校正與動態 shape；限制：校正集不是驗證集。
- [PyTorch 文件](https://pytorch.org/docs/stable/index.html)：訓練、AMP、`torch.onnx`。建議讀：你鎖的 minor 版對應頁，避免 API 漂移。
