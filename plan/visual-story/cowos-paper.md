# CoWoS 封裝剖面：A「紙本圖解」改版

日期：2026-09-28。範圍僅 `docs/cowos/resources/package-path/story.js`、`story.css`；未改 reader、template、tools、其他書。

## 各頁部件與理由

| 頁 | 部件 | 處理 | 理由 |
|---|---|---|---|
| 1 whole-package | 分層（物理剖面） | 重構 | 補上實際連接層：微凸塊、中介層上表面布線、S 的 TSV、C4、封裝基板、BGA 焊球、板端；圖內加材料圖例與「結構示意 · 不按比例」 |
| 2 three-layers | 分層（說明列） | 重構 | 原彩色圓角卡改為細線分隔的三列，左側色塊與剖面同一材料填色，讀者可把文字對回剖面 |
| 3 across | 剖面＋路徑 | 重構 | 朱紅線從 GPU 中央往下穿過微凸塊、沿布線層橫走、再上到 HBM 中央；路徑文字改細線＋朱紅底線 |
| 4 down | 剖面＋路徑 | 重構 | 朱紅 TSV 貫穿中介板，接續 C4、基板、焊球，經過的凸塊與焊球以朱紅點標出；其餘 TSV 維持灰色，可見「很多根、只追一根」 |
| 5 hbm-stack | 分層（放大） | 重構＋改色 | DRAM 用紙色、底部 die 用晶片色（與剖面內 HBM 底帶一致）；下方新增微凸塊與中性「中介層」帶，標出放大圖位於哪裡 |
| 6 predict-route | 對照 | 改版 | 兩欄以 1px 直線分隔、朱紅／灰色小標題，不再用淡藍底卡 |
| 7 variants（互動） | 剖面＋切換 | 改色＋結構 | 按下狀態改墨色；S 為斜線矽＋布線層＋TSV，R/L 為橫線 RDL（聚合物＋銅），L 另有斜線矽 LSI 位於兩晶片交界之下；previewArt 改為 S 剖面加不可操作的假按鈕（span，非 button） |
| 8 local-silicon | 剖面＋對照 | 改版 | LSI 以絕對定位橫跨 GPU 與 HBM 內緣，顯示「局部」是晶片交界 |
| 9 read-cross-section | 剖面＋題目 | 沿用 | 未標代號；未在 HBM 內畫 TSV，避免提前揭示答案 |

材料配色（story.css 的 `:root` 變數）：晶片 `#e2dccb`、矽 `#e6e2d6` 加斜線、RDL `#f1e7d2` 加褐色橫線、有機基板 `#ddd0b3` 加橫線；凸塊為灰褐。朱紅只用於目前追蹤的路徑、小標題與比例註記。按鈕按下改為墨色。

保留：模型、所有 page id、mount／cleanup／state、questions、章節連結、`pkg-path-*`、`pkg-via`（僅 S）、`pkg-bridge`（僅 L）、`data-variant`、`data-package`、`.mini-page` 桌面構圖覆寫。移除以顏色命名的 `pkg-blue/purple/green`。凸塊與焊球改由背景 `space` 重複繪製，窄螢幕不溢出、不裁半顆。

## 檢查結果

- `node tools/check-package-story.cjs`：PASS。
- `mkdocs build -q --strict -f configs/cowos.yml`：成功（僅 Material 2.0 橫幅）。
- `shoot.cjs cowos package-path 1..9`：PASS，1280／320／390×200% 逐頁無水平溢出、無頁首重疊、無 pageerror。
- 另以暫存腳本截取第 7 頁切到 R、L（桌面、320）、第 5 頁下方中介層帶（320）、第 9 頁圖例（320）與索引縮圖。
- 舊藍／紫／綠色值 grep 為 0。

## 實際看過的截圖

桌面 2、3、4、5、6、7（S）、8、9＋索引縮圖；320 的 4、5（捲到底部）、7-L、9；200% 文字的 3。截圖在 `data/visual-story/paper-restyle/package-path/`。

## 未解與待判斷

- 200% 文字時，第 3／4 頁中介板內的小字「TSV」與置中的「矽中介板」會部分重疊（可讀，但不乾淨）。
- 第 6 頁對照上方細線與 stage 邊框距離近，略顯重複。
- 第 4 頁朱紅 TSV 與 C4 凸塊的位置以固定百分比對齊，凸塊列用 `space` 平均分布，兩者並非同一模型計算；目前以另畫的朱紅點表示經過的凸塊。
- 剖面材料靠填色＋紋理＋圖例區分；色弱讀者是否分得出 RDL 與基板，未實測。
- 未做讀者試讀，亦未在實體手機檢查；以上是作者自查與無頭瀏覽器截圖，不是視覺驗收或學習成效證明。
