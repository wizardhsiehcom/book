# GPU 矩陣運算：同一筆資料，要從 HBM 搬幾次？

2026-09-28。主題目錄 `docs/gpu/resources/tiling-reuse/`；章節入口 `docs/gpu/prerequisites/matrix-math.md`（「為什麼 GPU 擅長 GEMM？」一節）。輔助章節 `docs/gpu/architecture/memory-hierarchy.md`（Compute Bound vs Memory Bound、`__shared__`）。來源與假設見 [tiling-reuse-sources.md](tiling-reuse-sources.md)。

## 章節支持什麼、故事補了什麼

- 章節已說：GEMM 定義與 C[i][j] 是點積；計算量 O(mkn)；A 的每一列重用 n 次、B 的每一行重用 m 次；Shared Memory 放在 SM 內、「一次載入 tile」避免反覆讀 HBM；Compute Bound / Memory Bound 兩種瓶頸；開發者用 `__shared__` 手動搬資料。
- 故事補充（標為教學補充並附來源）：tiled 演算法的具體分塊與分階段載入（CUDA C++ Programming Guide 3.2.4）；讀取次數封閉公式 2N³ 與 2N³/T；算術強度與 roofline（Williams, Waterman & Patterson 2009）。
- 不引用任何 GPU 的頻寬或 FLOPS 數字。roofline 的峰值 10 TFLOP/s、頻寬 2 TB/s 是自設教學假設，圖上標明。

## 讀者能力

讀者讀過章節「矩陣運算基礎」，知道矩陣乘法與點積；不需要會寫 CUDA。讀完能：

1. 算出 naive 矩陣乘法的全域記憶體讀取次數（2N³），並指出多出的讀取來自同一元素被重複讀 N 次。
2. 說明 tiling 為何把讀取次數除以 T（不是 T²）：每個載入共享記憶體的元素被 block 內 T 個執行緒重用。
3. 由讀取次數算算術強度（FP32：T/4 FLOP/byte），並在 roofline 上判斷受頻寬或受算力限制。
4. 預測硬體參數改變時，哪一種 kernel 會受益。

## 計數模型（story.js 內唯一來源）

- C = A × B，三者 N×N，FP32（4 bytes）。一個執行緒算一個 C 元素。
- naive：逐元素迴圈，每個 (i, j, k) 各從全域記憶體讀 A[i][k]、B[k][j]。
- tiled：T×T block，分 N/T 階段；每階段每執行緒各搬 A、B 一個元素進共享記憶體，再從共享記憶體讀 T 對運算元。
- 只計「全域記憶體讀取次數」。未含：L1/L2 快取、合併存取、bank conflict、同步成本、C 的寫回（N² 次，兩種寫法相同，另外列出）；累加值在暫存器、不計。
- 頁面上所有次數、長條長度、格子深淺、算術強度、roofline 點位都由 `trNaive`／`trTiled`／`trRoof` 算出；`tools/check-tiling-reuse-story.cjs` 用封閉公式比對。

## 分鏡

| # | 頁 | 因果：改了什麼 → 中間狀態 → 結果 | 圖解 |
|---|---|---|---|
| 1 | 一個 C 元素要兩條資料 | 算 C[1][2] → 讀 A 第 1 列與 B 第 2 行 → N 次乘加 | 對照：三個矩陣格子，列／行標示 |
| 2 | 資料在遠處，計算在近處 | 運算元來源層級 → HBM 遠而大、共享記憶體近而小 | 分層（章節支持，不列頻寬數字） |
| 3 | 互動：naive 逐格算 | 已算完 C 元素數 k → 各元素被讀次數累積 → 全域讀取 8k，最後 128 = 下限 32 的 4 倍 | 模型驅動：讀取次數熱圖＋共同尺度長條 |
| 4 | 重複從哪裡來 | C 同一列 N 格共用 A 同一列 → 同一筆資料被搬 N 次 | 對照：C 一列 ↔ A 一列（章節「重用 n 次」） |
| 5 | tiling：先搬進來，大家一起用 | block (0,0) 分兩階段載入 2×2 tile → 每元素進共享記憶體後被 2 個執行緒使用 | 步驟：兩階段 tile 位置（由模擬的 phases 產生） |
| 6 | 互動：換 T 與 N | T → 每元素全域讀取 N/T 次 → 總讀取 2N³/T；共享記憶體讀取仍是 2N³ | 模型驅動：熱圖＋與 naive 同尺度長條＋下限線 |
| 7 | 預測一 | 新例 N=6、T=3 | 題目（只給設定） |
| 8 | 算術強度 | T → 每讀 1 byte 做 T/4 次運算 | 表＋長條（N=32 實際模擬） |
| 9 | 互動：roofline | T → AI → min(峰值, 頻寬×AI) → 受頻寬或受算力限制 | 模型驅動：log-log roofline（教學假設參數） |
| 10 | 模型邊界 | 未納入項；章節的 Compute Bound 判斷依賴重用 | 對照清單 |
| 11 | 預測二 | 新例：頻寬加倍、峰值不變，T=4 與 T=32 各變幾倍 | 題目（只給設定） |

## 能力 → 頁 → 新例

| 能力 | 圖解／操作頁 | 新例與答案 |
|---|---|---|
| naive 讀取次數與重複來源 | 1、3、4 | 7 的 naive 部分：2×6³ = 432 |
| tiling 除以 T | 5、6 | 7：N=6、T=3 → 432/3 = 144 次，每元素讀 2 次（誤答：÷T² 得 48、只讀一次得 72） |
| 算術強度與 roofline | 8、9 | 11：頻寬 2→4 TB/s。T=4：AI 1 → 2→4 TFLOP/s（2 倍）；T=32：AI 8，兩次都頂到峰值 10（不變） |

## 驗收紀錄（2026-09-28，作者自查＋瀏覽器巡檢；未做讀者試讀）

已寫：`story.js`（11 頁、3 個互動：第 3、6、9 頁；2 題預測：第 7、11 頁）、`story.css`、`index.html`、`tools/check-tiling-reuse-story.cjs`；章節入口只加一行於 `docs/gpu/prerequisites/matrix-math.md` 標題下。

### 自動檢查（全部通過）

- `node tools/check-tiling-reuse-story.cjs`：N ∈ {4, 6, 8, 12, 32} 與所有整除的 T，逐元素模擬對封閉公式（naive 2N³、tiled 2N³/T、每元素 N/T 次、共享讀取與 FLOP 2N³、phases (N/T)³、AI = T/4）；naive 部分累積 8k；T=1 等於 naive、T=N 等於下限 2N²；兩題答案與誤答數字；roofline 值、log-log 座標等距；視圖長條寬度／下限線位置與數字一致；三個 mount 的狀態保留與清理；題目頁不洩漏答案；無固定 ID。
- `bash sync-assets.sh`；`mkdocs build -f configs/gpu.yml` 與 `--strict` 皆無警告。
- `node tools/check-story-reader.cjs`、`uv run python tools/check-story-package.py`。
- `shoot.cjs gpu tiling-reuse 1–11`：desktop / small 320 / text200 逐頁無水平溢出、無頁首遮擋、無 pageerror。
- `/private/tmp/tiling-qa/controls.cjs`（playwright）：第 3 頁拉到 16、第 6 頁 N=8/T=4、第 9 頁 T=32、第 11 頁作答後截圖（`ctl-*.png`）；離頁返回後第 6 頁 T 狀態保留；返回章節連結在建置結果中指向存在的 `prerequisites/matrix-math.html`；建置後章節頁入口 `../resources/tiling-reuse/index.html` 有效。

### 看過的畫面

桌面 1、3、4、5、6、7、8、9、10；窄版 6、9；兩倍文字 6、9；操作後：桌面 6（N=8,T=4）、9（T=32），窄版 3（k=16）、9（T=32）、11（作答後）。

### 看完後修正

- 第 5 頁：兩階段並排時 C 矩陣掉到下一行、箭頭懸空 → 縮小格子並禁止換行（窄版才換行）。
- 第 9 頁：縱軸標籤原本旋轉後中文側躺 → 改成圖上方橫排「縱軸：可達效能（TFLOP/s）」；斜線標籤角度調到接近實際斜率。
- 第 9 頁窄版／兩倍文字：「峰值」與「屋脊點」標籤重疊 → 窄版峰值標籤移到左側、隱藏屋脊點標籤，改在圖說寫「屋脊點（虛線）= 峰值 ÷ 頻寬 = 5」。

### 已知取捨與未做

- 兩倍文字巡檢是逐元素放大字級、不放大 px 寬度，矩陣格內數字在 text200 顯得擠；真實瀏覽器縮放會一起放大格子，未另外處理。
- 窄版第 3、6 頁的矩陣與長條在控制項下方需捲動；控制項正下方的結論列（讀取次數、每元素次數、算術強度）與控制項同屏可見。
- 全頁截圖中固定導覽列會蓋在頁面中段，是截圖方式造成，非版面問題。
- 未做：讀者試讀、實體手機、色覺辨識測試、深色模式（共用 reader 未提供）。
