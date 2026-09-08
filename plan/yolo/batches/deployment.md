# 第 19–23 章交付與驗證

查核日：2026-09-08。定位：工程使用、效能量測、部署與維運；原理用來解釋操作條件。

## 產出

- 19：比較契約、指定裝置同步與百分位計時、吞吐／延遲／新鮮度。
- 20：ONNX FP32 配方、FP16／INT8 校正、執行時選擇、同類一對一偵測輸出診斷。
- 21：Ultralytics 代管與 OpenCV 自管 RTSP、建構期 timeout、背壓、排程與故障驗收。
- 22：現場失效候選原因、以人工標註核對代理漂移、發布與回滾、授權與資料處理建議。
- 23：自訂紙箱／棧板、影片越線計數、CPU ONNX 候選套件與完整性驗收。
- 共 21 篇 Markdown（含各章入口）、5 支 Python 腳本。架構圖以 Mermaid 說明延遲與背壓；無外部圖片授權需求。

## 寫作來源與 CLI 執行

先由操作者讀取 CLAUDE.md、既有書籍計畫與使用者指定 book workflow 的 iteration/evidence。Claude CLI 實讀一手頁的重點 sections 並先寫第 19 章，遇到 HTTP 429（月支出／session 額度限制）退出。依使用者授權改由 Grok CLI 逐頁產生正文與範例；未啟用 agy，因 Grok 可完成。

Claude 指令使用 `-p --permission-mode dontAsk --strict-mcp-config --disable-slash-commands --no-session-persistence`，Write/Edit 僅本批路徑。首次 broad Read 被自動核准審查拒絕後，縮成明確授權檔案與本批章節，取得核准；未使用 bypass。

Grok 使用短 `-p`、`--verbatim --permission-mode dontAsk --no-subagents --reasoning-effort low --output-format json`。為避免專案技能自動讀檔，後段採空白工作目錄、純文字編輯角色與明列 disallowed tools。`--tools ''` 本身不保證移除 Grok 內建工具，因此不能將此旗標稱為完整工具沙箱。遇到 cancelled 或只有操作旁白，不視為交付；只有有效正文才原樣落檔。

原始紀錄位於 `/tmp/yolo-deployment-stdout.jsonl`、`/tmp/yolo-deployment-v2-stdout.jsonl`、`/tmp/yolo-deployment-page-*.json`、`/tmp/yolo-deployment-script-*.json` 與 `/tmp/yolo-deployment-revision-*.json`，屬本機暫存紀錄，不納入成書與 git。操作者與主 agent 進行刪重、連結、API／程式錯誤修正及語句整合；沒有自行代寫整章。Manifest 自查是出版驗證程式。

## 來源評比與已讀範圍

動態文件以查核日為時間錨點，未宣稱所有內容已逐字全文閱讀或固定到 package release。本文不捏造套件 pin、權重 SHA 或硬體測量值。

| 一手來源 | 已讀重點 | 採用與限制 |
| --- | --- | --- |
| [Ultralytics Benchmark](https://docs.ultralytics.com/modes/benchmark/) | Arguments、格式與計時範圍 | 可重現操作入口；供應者報告不能當獨立排名，跨硬體速度不泛化 |
| [Ultralytics Export](https://docs.ultralytics.com/modes/export/) | Arguments、quantize、data/split、nms 三態、匯出後 predict/val | API／支援範圍一手來源；當代 `quantize=8/16` 不套用到所有舊版 |
| [Ultralytics Predict](https://docs.ultralytics.com/modes/predict/) | stream、stream_buffer、vid_stride、Results、推論參數 | generator 管結果記憶體，不等同整條相機管線的新鮮度保證 |
| [Ultralytics Track](https://docs.ultralytics.com/modes/track/) | persist、boxes.id、串流狀態與多執行緒模式 | 明示 ByteTrack 設定，不假設當代預設 tracker；ID 不等於真實物件身份 |
| [ONNX Runtime Quantization](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html) | 靜態／動態量化、scale/zero-point、校正與 debugging | 原理可直接支援校正與逐層查錯；不保證各模型／provider 都會加速 |
| [TensorRT Best Practices](https://docs.nvidia.com/deeplearning/tensorrt/latest/performance/best-practices.html) | 暖機、同步、計時邊界、硬體狀態 | NVIDIA 路徑一手指南；不是其他硬體的數值保證 |
| [OpenCV Video I/O](https://docs.opencv.org/4.x/d4/d15/group__videoio__flags__base.html) | open/read timeout、CAP_FFMPEG、backend 限制 | timeout 在建構／open 階段設定；仍需驗證目標後端與串流設備 |
| [CoreML 整合](https://docs.ultralytics.com/integrations/coreml/) | 匯出平台、Python 推論／驗證、原生 Apple 部署分工 | 區分 macOS Python 工具與 iOS/iPadOS 原生執行，不混為同一限制 |
| [Training](https://docs.ultralytics.com/modes/train/)、[Detection Dataset](https://docs.ultralytics.com/datasets/detect/) | 預訓練與 train 使用、資料 YAML 與正規化 xywh | 專案配方以真實資料與凍結設定為前提；coco8 只作接線煙霧測試 |
| [Ultralytics License](https://www.ultralytics.com/license) | 開源／Enterprise 方案 | 供工程資產清冊核對，非法律判決；條款修訂日未確認 |
| [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html) | 官方搜尋結果與 FAQ 的第 13 節摘要；直接全文 fetch timeout | 留直接原文導讀，不宣稱全文已讀；具體授權義務仍依實際資產與條款判斷 |

## 已執行驗證

- `python3 docs/yolo/19/timing_check.py`：通過；最近秩百分位、空集合／NaN／負值條件。這是統計邏輯自查。
- `python3 docs/yolo/20/compare_detections.py --self-check`：通過；重排、空集合、漏／多框、類別、分數漂移、唯一匹配與無效輸入。這是診斷，不是 COCO AP。
- `python3 docs/yolo/23/count_video.py --self-check`：通過；滯後帶抖動、雙向穿越、新 ID、session 清空、過期狀態。每幀先清過期 ID，資源初始化受 finally 保護。
- `python3 docs/yolo/23/manifest_check.py`：通過；合成套件完整時通過，篡改與缺檔時拒絕。沒有載入模型或操作真實 release。
- 本批 Markdown Python code fences 經 `ast.parse`，本批本機相對連結檢查通過。

修正的重點包括：指定 CUDA 裝置同步、binary read、缺失 speed 不填零、量測邊界與第一筆預測分開、INT8 校正集不混 final test、AP 與固定工作點召回分工、OpenCV timeout 建構參數、模型／追蹤狀態重連分工、授權流程改為工程建議、發布候選不覆寫 current、雜湊以程式失敗狀態作為驗收。

## 未執行與驗收邊界

未安裝大型 YOLO／GPU／runtime 依賴，未下載權重、跑訓練、實際模型推論、匯出、INT8 校正、RTSP 或目標裝置長跑。書中這些步驟是供讀者執行的配方與驗收條件，不是本輪實測結果。效能、準確度、GPU／CoreML／OpenVINO 相容性需要讀者在凍結版本與目標硬體驗證。

主 agent 維護 nav／主計畫、統一建置、網站連結／畫面與 git commit/push；本批未修改 nav 或自行 commit。
