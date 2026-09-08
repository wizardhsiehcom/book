# 實務模型選型：以日期標註的能力矩陣

選型不是挑「最新一代」或「表上最大的 AP」，而是把任務、資料、可維護執行環境與授權條款對上**實際可下載的權重與官方 API**。下列能力矩陣以 2026-09-08 核對的公開文件為準；本頁沒有獨立硬體測試、沒有本地套件版本、也沒有自行跑模型。延遲是供應商在特定卡與引擎上的量測，不是相機／RTSP 佇列／整條產線的 FPS 保證。指標定義見 [評估](../06/index.md)，任務邊界見 [任務](../15/index.md)，追蹤與開放詞彙另見 [追蹤](../16/index.md)、[開放詞彙](../17/index.md)。

## 同一套 COCO bbox，頭不同仍可比

Ultralytics 官方 YOLO26 COCO 640 表同時列出 regular AP 與 e2e AP。兩者用**同一套 COCO bbox 評估協定**；不同偵測頭是兩套完整系統，在同一資料集、同一指標、同一計時條件下**完全可以互相比較**。禁止的只有一件事：把 one-to-many 的 AP 接到 one-to-one 的延遲上，拼出表上不存在的假工作點。不要說「不同頭不能比」，也不要說 e2e 是另一套評估協定。DFL-free 是 YOLO26 **整網架構特徵**，不是某一顆頭的開關。

官方表（供應商自報，非本頁複測）：n 的 regular AP 為 40.9%、e2e AP 為 40.1%、T4 TensorRT 10 延遲 1.7 ms；x 的 regular AP 為 57.5%、e2e AP 為 56.9%、延遲 11.8 ms。Speed 欄以 `nms=False` 的 one-to-one 路徑量測，因此合法配對是 **40.1% 對 1.7 ms**、**56.9% 對 11.8 ms**。40.9% 與 57.5% 是合法準確度數字，但本頁**沒有**對應的 one-to-many 延遲，不得自行配對。AP 40.9% 即 0.409，百分比與 0..1 兩種寫法皆合法，但須標明所用尺度且不可混用。延遲不是產線 FPS。

## 能力矩陣（架構／權重／API／匯出／本機未測分開）

| 產品線 | 公開任務（文件） | 實際 scale 權重 | API 模式 | 匯出 | 本機硬體 |
|---|---|---|---|---|---|
| YOLO11 | detect／instance-seg／classify／pose／OBB 五項 | n／s／m／l／x 各任務皆列權重 | train／val／predict／export | 文件列出 export | **未測** |
| YOLO26 | 上列再加 semantic／depth 共七項 | 常見 scale 有權重；**P2／P6 僅 YAML 架構，無對應 scale `.pt`** | 同一套 API 模式 | 文件列出 export | **未測** |
| YOLOE | prompted／prompt-free | 依官方頁面，勿假設等於 YOLO26 七任務 | 依該頁 | 依該頁 | **未測** |
| YOLOv10、YOLOv12 | 原作者倉庫另成譜系 | Ultralytics 整合**不證明**原倉庫匯出行為相同 | 各自文件 | 各自文件 | **未測** |

YOLO11 五任務與各 scale 權重、四種模式見 [YOLO11 文件](https://docs.ultralytics.com/models/yolo11/)。YOLO26 七任務、同一 API、P2／P6 僅架構見 [YOLO26 文件](https://docs.ultralytics.com/models/yolo26/)。YOLOE 見 [YOLOE](https://docs.ultralytics.com/models/yoloe/)。YOLOv10、YOLOv12 原倉庫為 [THU-MIG/yolov10](https://github.com/THU-MIG/yolov10)、[sunsmarterjie/yolov12](https://github.com/sunsmarterjie/yolov12)。矩陣「有架構」≠「有可下載權重」≠「匯出目標已驗證」。

## 決策表：先任務與資料，再對工作點

假設產線要 **COCO 風格水平框偵測**、可接受官方 T4 TensorRT 量測當**相對**參考、且必須能用維護中的 `train/val/predict/export`。不要一開始就開 semantic／depth。

| 條件 | 選 | 不選／緩選 | 理由 |
|---|---|---|---|
| 偵測／實例分割／分類／姿態／OBB | YOLO11 為既定教學基準，YOLO26 亦為相容候選 | 勿僅因 YOLO26 另有七任務就排除 | 依官方文件（https://docs.ultralytics.com/models/yolo11/、https://docs.ultralytics.com/models/yolo26/，文件核對日 2026-09-08）兩者皆支援上述五任務；應比較目標資料、硬體與執行環境，而非以任務清單長度決定取捨 |
| 需要 semantic 或 depth | YOLO26 對應權重 | YOLO11 | 文件任務數不同 |
| 要比延遲與準確的成對點 | n：40.1%／1.7 ms；x：56.9%／11.8 ms | 40.9% 配 1.7 ms、57.5% 配 11.8 ms | 後者是假工作點 |
| 要更高 regular AP | 可報 40.9%／57.5% 當準確度 | 同時宣稱已有匹配延遲 | 本頁無 one-to-many 延遲 |
| 要 P2 或 P6 | 僅能當架構實驗 | 當成已釋出 n／x 權重 | 無 scale `.pt` |
| 開放詞彙提示 | YOLOE | 假設 YOLO26 已含 prompted | 產品線不同 |
| 原論文實作／原匯出腳本 | 原作者倉庫 | 「已整合所以匯出相同」 | 整合≠原倉庫行為 |

授權必須對照**當時實際條款**（套件授權、權重授權、第三方引擎如 TensorRT 的授權），本頁不是法律保證。執行環境要選**仍在維護**的官方 Python API 與文件中的 export 路徑；細節與格式陷阱見 [匯出](../20/index.md)。複測協定、拆開準確度與延遲、禁止拼假點的操作清單見 [基準測試](../19/index.md)。

## 失敗模式

把 YOLO26 七任務當成 YOLO11 權重「免費升級」，部署當天才發現沒有 semantic／depth checkpoint。把 P2／P6 YAML 當成可下載的 n／x。用 40.9% 配 1.7 ms 向主管簡報「又準又快」。把 T4 TensorRT 1.7 ms 說成現場攝影機 FPS。把 Ultralytics 裡的 v10／v12 名稱當成原倉庫 export 已驗證。把 DFL-free 講成「可以在 YOLO11 某一頭關掉」。條款只看部落格一句「開源」而未打開實際授權檔。

## 驗收

選型紀錄須寫明任務與資料集、實際權重／尺度／套件版本、head 模式，以及可取得時的完整 AP–延遲量測點；若引用對照表而一對多路徑的速度未提供，則標「未知」。供應商數字視為其自報；2026-09-08 為文件核對日而非量測日，未給實際量測日則標未知。本地硬體未經量測前不得當成已測；授權依實際條款並做匯出驗證。基準見 [基準測試](../19/index.md)，匯出見 [匯出](../20/index.md)。不要求只有端到端速度才算有效：協議下任何已量測的完整組態皆可入檔。不宣稱已實測，亦不指定萬用最佳模型。
