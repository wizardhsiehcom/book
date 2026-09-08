# 基礎與查閱批次操作紀錄

日期：2026-09-08。範圍：docs/yolo/01–05、07、README.md、24。

## 寫作來源與交接

正文由外部 CLI 產生，操作者只解析輸出、限定路徑落檔、套用 CLI 產生的定點替換及驗收，不自行代寫正文。

- Claude CLI（預設模型）完成第 01 章四頁。先前單斜線 allow 規則在開始写入前中止，改成 `Write(//Users/...)` 後成功。使用 dontAsk 與限定讀寫/網頁工具，未 bypass。
- Claude 回報 HTTP 429 `You've hit your monthly spend limit`，exit 1。依使用者授權改用 Grok。
- Grok 初次使用工具的 `search_replace` 被 dontAsk 取消，沒有落檔；後改為 `-p`、`--verbatim`、單輪純文字 JSON 產出，操作者驗證路徑後落檔。`--tools ''` 未可靠移除 Grok 工具，因此提示明確禁止工具；成功正文 run 無工具呼叫。
- 所有 CLI 原始日誌保留 `/tmp/yolo-foundations-*.jsonl`，不納入版本庫。
- Claude 來源工具結果保存 `/tmp/yolo-foundations-sources.txt`；後續純文字 Grok 僅收到通用章節任務與官方 URL，沒有聲稱重新查核文件。

## 已讀來源與用途評比

以下為 Claude WebFetch 工具所回傳的定向段落與原始程式定位摘要，不等於全文逐字審查；動態網頁發布日未知，查核日 2026-09-08。書中來源連結是導讀入口，應以實際安裝版本再核對。

| 來源 | 已讀範圍 | 評比與使用限制 |
|---|---|---|
| https://docs.ultralytics.com/quickstart/ | 安裝、Python/PyTorch要求、裝置路線 | API一手入口且可讀性高；不能據此宣稱本機套件已測或pip按GPU硬體選wheel |
| https://docs.ultralytics.com/modes/predict/ | 輸入來源、conf/iou/stream、Results欄位 | 操作直接；預設值易變，範例需記實際版本 |
| https://docs.ultralytics.com/datasets/detect/ | 標籤格式、正規化、類別id、data.yaml | 格式權威；無法代替特定場景遮擋/漏標政策 |
| https://docs.ultralytics.com/modes/train/ | 微調、train參數、resume、best/last、裝置與seed | 訓練入口一手文件；不保證硬體訓練時間或完全重現 |
| https://docs.ultralytics.com/tasks/ | 任務名稱與輸出 | 可界定模型與系統功能；不是單權重支援所有任務的證據 |
| https://docs.ultralytics.com/reference/data/augment/ | LetterBox new_shape/auto/scale_fill/scaleup/center/stride | 原始實作導讀，能確認padding分支；動態API須鎖版本 |
| https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/data/augment.py | LetterBox定位及比例、round與padding流程 | 機制一手來源但未鎖commit；本書數學自查只覆蓋固定平方、等分pad範例 |
| https://docs.ultralytics.com/reference/engine/results/ | Boxes xyxy/xywh/xyn/conf/cls/id與orig_shape | 精確輸出契約，避免原圖座標二次還原 |
| https://docs.ultralytics.com/models/yolo11/ | 發布與模型變體 | 教學權重來源，非當代性能冠軍排名 |
| https://scikit-learn.org/stable/common_pitfalls.html#data-leakage | 洩漏定義、測試集不可fit、特徵選擇反例 | 方法透明且一手；移植到影像group切分屬工程類推 |
| https://scikit-learn.org/stable/modules/cross_validation.html#group-cv | group與時間相依切分 | 可支撐防相依樣本洩漏；不保證任意資料都有固定最佳比例 |

## 驗收紀錄

- 第 01 章已修正部署conf與召回率關係、NMS IoU與評估匹配IoU分工；假想eval.py明確標示非交付腳本。
- 第 02 章已改為CPU執行基線；先下載权重再hash；pip依索引/版本/平台選wheel；Python真正print逐框結果。過量作者免責移除。
- 第 03 章 `python docs/yolo/03/self_check.py` 通過。含比例、pad、框往返、空框、非法尺寸。
- 第 04 章兩段標準庫 group 切分皆通過。第一段自查 tuple API 缺陷經 CLI 提供定點修正後重跑成功。
- README與24已依實際24章對應回修，避免章號含義錯置。
- 所有模型推論、下載、訓練、GPU/MPS、匯出/效能測試未在此批執行；沒有新增大型依賴。
- 01–04概念圖採Mermaid；最終全書MkDocs與Mermaid出版驗收由主agent整合。
- 05/07 已完成。第 05 章標籤器 `--self-test` 通過；額外 CLI 驗證遞迴目錄、零面積框、Unicode class、越界框、空目錄皆符合 exit 語意。第 07 章已修正 pretrained flag 與 resume 恢復範圍表述。

## 最終交付

24 篇 Markdown（約 75,500 字元）與 2 支 Python：01 四頁；02/03/04/05/07各三頁；README與24共五頁。相對連結檢查只有其他批次第23章入口當時尚未落檔；本組章內連結全部存在。正文主張區分文件與工程建議，硬體效能未實測。

標籤器定點碼片段傳 Grok 曾遭自動審查拒絕（理由：私有程式外傳）；未繞過，改用不含原碼的通用需求從零產生，審查允許。新的通用程式與CLI驗證均完成，無未解阻擋。

追加 QA：第 24 章兩處 greedy NMS 閾值方向錯誤已由 Grok 定點修正；明確驗算 IoU=0.6 時閾值0.5抑制、0.7保留。首輪重產的排錯段仍錯誤，未採用；第二輪核對後套用。其餘24指標未見同類方向反轉。
