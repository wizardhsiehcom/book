# V5 門檻與複判：A「紙本圖解」改版

日期：2026-09-28。只改 `docs/v5/resources/threshold-review/story.js`、`story.css`；模型、頁面 id、題目、章節連結、mount／cleanup／state 與 `[data-threshold]`、`[data-review-output]`、`[data-threshold-label]`、`.rev-live`、`.rev-control` 都保留。

## 各頁部件

| 頁 | 部件 | 為何 | 改版方式 |
|---|---|---|---|
| 01 固定集合 | 分流（單條） | 10 : 90 應從長度看出 | 重構：總量 → 按個數的橫條 → 兩格說明 |
| 02 分數重疊 | 分流＋對照（左右鏡像長條） | 看出同一分數同時有良好與缺陷 | 重構：原計數表改成良好向左、缺陷向右的同尺度長條（滿格 = 最大計數 22），門檻線切在第一個送複判列之前 |
| 03 分流規則 | 分流 | 送複判／放行由同一條拆開 | 重構：TP、FP、FN、TN 四段按個數排成一條，下方朱紅括號標出送複判範圍 |
| 04 預測題 | 區間 | 降門檻 = 送複判範圍向左擴大 | 重構：0–100 分數軸，灰段兩次相同，只有新增的 [30, 60) 與 35／45／55 刻度用朱紅 |
| 05 親手分流 | 分流＋對照（工時尺） | 滑桿同步分流、工時與容量 | 重構：即時區改為四段分流條、括號、圖例、工時尺（滿格 200 分鐘 = 全部送複判，直線 = 容量 60，超出部分朱紅）；展開區保留四格與分數帶 |
| 06 分母 | 對照 | 相同集合、每項比例以自身分母為滿格 | 重構：兩欄中線對照，每項加比例條 |
| 07 負荷 | 對照 | 共同起點、共同尺度與容量線 | 重構：大數字＋與第 05 頁同尺度的工時尺 |
| 08 ADC | 流程 | 判斷與兩條路徑 | 主要是換色與流程化；人工路徑用朱紅框 |
| 09 新例子 | 同第 02 頁（門檻 50） | 讀者自行加總 | 沿用新分數帶；不顯示總數，答案只在回饋 |

配色：填色只表示參考判定（缺陷 = `--orange`，良好 = 暖灰米色）；朱紅只用在送複判範圍、新增區段、超出容量與相關文字。其餘為 `--ink`／`--muted`／`--line`／`--tint`。

模型：新增 `reviewMinutesEach`、`reviewCapacity`、`reviewTotal`（由 reviewBins 加總）、`reviewScale`、`reviewBinMax`；`reviewLoad` 改用常數但輸出不變。所有寬度、位置與容量線都由這些常數與 `reviewCounts` 算出，沒有固定百分比。分流條用 `flex: n 1 0` 且括號線用 inset 陰影，避免邊框扭曲比例。

內容變動：第 02 頁 detail 原寫「不以色塊寬度表示數量」，改為「長條長度與個數成正比，兩側共用同一尺度」以符合新圖。第 05 頁 previewArt 改為靜態門檻文字＋即時區（改用 `rev-live-preview`／`rev-control-static` class，避免與 `.rev-live`／`.rev-control` 重複，讓瀏覽器腳本的選擇器仍唯一）。其他 point、lead、題目未改。

## 檢查結果

- `node tools/check-review-story.cjs`：PASS。
- `node tools/check-story-reader.cjs`：PASS（DOM stub）。
- `uv run mkdocs build -q --strict -f configs/v5.yml`：成功（僅 Material 的 MkDocs 2.0 提示）。
- `shoot.cjs v5 threshold-review`：3 種版面 × 9 頁無水平溢出、無頁首重疊、無 pageerror。
- 新增 `plan/visual-story/checks/paper-restyle/v5-controls.cjs`：390×844 捲到滑桿後，門檻 60／30／50／0／100 時控制項頂 10px、即時結果底 431px、導覽頂 716px；分流段、括號、工時尺與容量線寬度都與模型個數／分鐘相符（誤差 ≤ 1px）；離頁返回保留 30；無 pageerror。數值在 `data/visual-story/paper-restyle/threshold-review/controls-metrics.json`。
- 縮圖：索引展開後無重複 ID、縮圖內沒有 input／button。

## 人工看過的截圖

`data/visual-story/paper-restyle/threshold-review/`：desktop 1–9、small 2／4／5／7／8、text200-5、controls-390-t30、index-thumbs。發現並修正：第 01 頁色塊與標題錯行、放行段半透明後與底色難分、第 02 頁複判外框過重、第 04 頁新門檻整段朱紅（改成只標新增區段）、括號邊框使比例偏差約 2px、窄版分數帶標頭換行。

## 待決問題

- FP 與 TN 同為米色，只靠下方括號區分送複判／放行；是否要再加紋理，需使用者判斷。
- 第 05 頁在 200% 文字時，右對齊的「放行…」一行會換成兩行，可讀但不整齊。
- 第 07 頁手機版兩欄改上下，兩條工時尺不在同一視野內，對照需捲動。
- 全頁截圖中的固定導覽出現在長圖中段，是已知截圖現象。
- 未做真實讀者試讀或實體手機測試；以上屬作者自查與無頭 Chromium 檢查，不代表已證明學習成效。
