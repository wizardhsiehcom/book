# PSI 補圖任務

依使用者指定 `D:/Wizard-Agent-Tool/plugins/book/commands/mkdocs-update.md` 更新，2026-09-14。優先使用 Wikimedia Commons 遠端圖片，逐張核對 File 頁；原創剖面使用本地 SVG。研究素材可放 `data/psi/images/`，不作為出版路徑。

| ID | 目標位置與教學問題 | 關係／條件與錯誤暗示 | 類型／輸出 | 狀態 |
|---|---|---|---|---|
| photo-01 | 01 開場：晶圓與晶粒的關係 | 看見重複元件區；不得當作再生片或昇陽產品證據 | Commons 遠端照片，Luna max 查找 | 已驗收 |
| photo-02 | 02 搬運與再污染：加工後如何保持狀態 | 看見工件與承載方式；不能推論實際潔淨度或本公司設備 | Commons 遠端照片，Luna max 查找 | 已驗收 |
| photo-03 | 03 開場：鏡面外觀能證明什麼 | 可見反射，不可由照片量測 TTV 或金屬污染 | NASA／Commons 遠端 305×357 原圖 | 已驗收 |
| svg-03 | 03 指標表之前：厚度差與彎曲 | 兩面間距與整體彎曲分開；不呈現標準 bow／warp 量測架構 | 原創 SVG，360×350；docs/psi/images/thickness-vs-shape.svg | 已驗收 |
| svg-06 | 06 TAIKO 解釋之後：外環在哪 | 同一外環在剖面兩端；兩種結果為比較，非加工順序；非比例 | 原創 SVG，360×500；docs/psi/images/thinning-cross-sections.svg | 已驗收 |

以上為補充教學圖片，不設定每章張數。04／05／08 的數學與流量已有圖表，07／09／10 的證據界線已有示意與矩陣，本次不為這些章節加入裝飾性照片。

正文版本與確切插入位置記在 `image-additions.json`、`image-manifest.json`。受影響正文原有 Mermaid 一併重驗；最終依新版本 SHA-256 記錄。

補充 photo-02-bench：第 02 章功能表後加入 Danchip 濕式蝕刻工作台，區分設備環境與完整再生流程；Commons 遠端縮圖、640 px 顯示，已驗收。其作者、授權、來源與正文版本一併記於 image-additions.json。

六張圖均完成實際解碼與桌機／手機檢查。原有受影響的四張 Mermaid 也通過重驗。主編已目視四張照片及兩張 SVG 的手機渲染，未將照片用於推定公司營運事實。
