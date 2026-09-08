# 06、08–18 批次交付紀錄

查核日：2026-09-08。正文由 Claude Code / Grok CLI 產生；操作者負責來源查核、定點修訂派工、限定路徑落檔、連結／格式整合與驗收，未以本機主模型代寫章節。

## CLI 與範圍

- Claude Code 2.1.263：沙箱外確認已登入；非互動 `claude -p`，`dontAsk`、Read/WebFetch 與限定路徑 Write/Edit，未使用 bypass permissions。
- 首輪檔案規則使用單斜線絕對路徑而未匹配；改為 `Write(//Users/.../**)` 後成功寫入第 06 章四頁。後續收到真實 HTTP 429 monthly spend limit，依使用者授權切換 Grok。
- Grok 大提示曾轉成提示檔案引用；`--tools ''` 並未移除工具。改為 `grok -p`（Python subprocess 參數傳遞）、`--verbatim --max-turns 1 --permission-mode dontAsk --no-subagents --output-format streaming-messages-json --include-partial-messages`，部分修訂使用 `--reasoning-effort low`。逐頁回傳正文，由操作者限定映射到既定路徑。
- 明列 `--disallowed-tools` 可移除多數工具，但初始化仍保留部分執行／代理工具；未將其誤報為完整禁工具。成功的最終正文回應以直接文字／JSON 擷取，未授權 CLI commit、push、安裝大型依賴或訓練。
- 原始提示、工具證據與輸出由主 agent 歸檔於本機暫存目录 `yolo-cli-archive-ytfj862v/cli-runs/`；不將原始 session 或推理日誌加入書籍。
- agy 可執行檔及 help 可用，但 Grok 接手後能完成任務，未切至 agy。

## 來源閱讀證據

| 主題 | 一手來源 | 實際閱讀範圍與限制 |
|---|---|---|
| bbox 指標 | https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py | Claude WebFetch 讀取 raw 官方檔之 Params、evaluateImg、accumulate／摘要相關函式摘取；非執行完整 COCO evaluator，未鎖 commit |
| validation / predict | https://docs.ultralytics.com/modes/val/ 、https://docs.ultralytics.com/modes/predict/ | 參數與指標說明；conf 候選下界、NMS IoU、summary max-F1 與 confusion matrix 差異；動態文件 |
| 指標／配對實作 | https://docs.ultralytics.com/reference/utils/metrics/ 、https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/engine/validator.py | ap_per_class 的 F1 選點與 match_predictions 摘取；不宣稱與所有版本 COCO 實作完全等同 |
| 卷積幾何 | https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html | output shape、stride、padding、dilation；奇偶輸出及感受野案例為分析算例 |
| assignment / loss | https://docs.ultralytics.com/reference/utils/tal/ 、https://docs.ultralytics.com/reference/utils/loss/ | TaskAlignedAssigner、候選／top-k／衝突，BboxLoss、DFLoss 條件與 target bins；限制到實際類別與版本，不泛化全家族 |
| 訓練改善 | https://docs.ultralytics.com/guides/model-training-tips/ 、https://docs.ultralytics.com/modes/train/ | scale / multi_scale、patience 相關段落與 API 入口；不把官方起始建議當普適最佳值 |
| 家族原始材料 | https://arxiv.org/abs/1506.02640 、https://arxiv.org/abs/2405.14458 、https://github.com/THU-MIG/yolov10 、https://github.com/sunsmarterjie/yolov12 | 摘要與原作者 repo 入口／概要；未完整重現論文實驗，不據此宣稱排名 |
| 當代能力 | https://docs.ultralytics.com/models/yolo11/ 、https://docs.ultralytics.com/models/yolo26/ | 任務／權重／模式表、YOLO26 雙 head 與 DFL-free、P2/P6 architecture-only、COCO640 AP 與速度條件；供應者自報、非獨立實測 |
| 任務標註 | https://docs.ultralytics.com/datasets/classify/ 、https://docs.ultralytics.com/datasets/segment/ 、https://docs.ultralytics.com/datasets/pose/ 、https://docs.ultralytics.com/datasets/obb/ | 分類目錄、polygon 最少三點、pose 5+K×D 欄／kpt_shape／flip_idx、OBB 四角九欄；相關完整格式／YAML／使用段落已讀 |
| pose 可見度 | https://docs.ultralytics.com/platform/data/annotation | Task Details 與 Keypoint Visibility：0 未標、1 已標遮擋、2 已標可見；不等同預測 confidence |
| 追蹤 | https://docs.ultralytics.com/modes/track/ 、https://github.com/FoundationVision/ByteTrack 、https://github.com/NirAharon/BoT-SORT | 當前 quickstart、tracker 支援、persist / stream；原 repo 概述，未做追蹤精度重現 |
| 開放詞彙 | https://docs.ultralytics.com/models/yoloe/ 、https://docs.ultralytics.com/models/yolo-world/ | prompting mode、checkpoint、文字 encoder 準備、支援表與 World/Worldv2 export 差異；動態版本語義，不保證任意新詞可靠 |

Grok 在純文字階段承接的是外層已讀公開事實／摘取，不宣称自己再次連網全文閱讀。所有日期化能力均以查核日表示；若來源未提供實際量測日期，不以查核日代替。

## 產物與驗收

- `docs/yolo/06/`：評估入口、TP/FP/FN、IoU、precision/recall、confidence、AP、validation/test、事件率；`examples/threshold_demo.py`。
- `docs/yolo/08/` 至 `14/`：必要原理選讀、錯誤分析、改善；`13/examples/slice_check.py`。
- `docs/yolo/15/` 至 `18/`：任務／標註契約、追蹤／事件、開放詞彙、日期化選型；`16/examples/line_crossing.py`。
- 已由本機 Python 執行三個合成核對：閾值示例 assert 通過（成本 40 / 92 / 180）、日夜切片 unittest 通過、越線／抖動／折返／新 ID assert 通過。
- 範例只核對幾何／計數／事件狀態邏輯，不是完整 COCO evaluator、真實 tracker 品質、模型訓練或 GPU benchmark。
- 越線示例限定單一串流、ID 不重用、連續時間軸；未加入長缺口過期機制，不是可直接上線成品。部署須依文中契約拒絕或重置缺口，並用真實 held-out 事件驗收。
- 本批未做 YOLO 權重下載、完整模型推論／訓練、GPU／NPU／TensorRT 硬體實測。網頁建置、全書交叉連結與出版驗收由主 agent 統一整合。

## 最後補齊（2026-09-08）

- Grok CLI 追加 `15/usage.md`、`17/semantic-depth.md`：四任務 train/predict/val 與 Results，稠密任務資料格式、API、指標。`16/index.md` 補 model/video 初始化與框底中點 samples 接線。均由 CLI 產出後限定路徑落檔；外層校對數值、路徑與誤句。
- 實讀 Ultralytics 官方 `/tasks/classify/`、`/tasks/segment/`、`/tasks/pose/`、`/tasks/obb/` 的 Train/Val/Results；`/tasks/semantic/`、`/tasks/depth/`、`/datasets/semantic/`、`/datasets/depth/` 的輸出與標註／尺度規格。來源根網址為 `https://docs.ultralytics.com`，日期是查核日。
- 新兩頁與追蹤片段 Python AST 通過；未執行模型。新 CLI 原始日誌保留系統暫存目录，不納入提交。
- 18 定點修正 AP 尺度、查核日、YOLO11/26 同任務候選；17 修文字編碼器檔名及提示凍結屬部署政策。語意 PNG/NPY 寫清擇一與查找順序；16 刪除過窄 ID-switch 定義。
