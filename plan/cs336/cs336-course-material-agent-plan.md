# CS336 課程材料多 agent 整合計畫

本計畫目標是把 `data/cs336/` 的 course material 讀成書稿可用的「材料層」，讓讀者原則上只看 `docs/cs336-language-modeling/` 就能掌握課程主線、lecture materials 的重點、assignment 的學習目標與實作範圍。

## 目標

- 將 lecture code / slides / trace / assets 中補充逐字稿的資訊整理進各章或附錄。
- 將 assignments 整理成學習目標、實作範圍、章節關聯與能力檢核，不提供解答。
- 將課務規則、honor code、AI policy、submission、late days、compute guidance 放在附錄或材料頁，不放入技術章節。
- 保留可追溯性：每一段材料補充都能回到本地檔案路徑。

## 非目標

- 不把 handout 或 lecture slides 全文搬進書稿。
- 不重寫已完成的逐字稿章節主線，除非材料揭示明確錯誤。
- 不補作業解答、測試答案、可直接提交的程式碼或 prompt。
- 不下載大型資料集，不執行昂貴訓練，不重跑 assignment。

## 產出位置

| 類型 | 目標檔案 | 內容 |
|---|---|---|
| 章節材料段 | `docs/cs336-language-modeling/NN-*.md` | 更新既有 `## 相關作業與材料`，加入精簡材料重點與本地路徑 |
| Lecture materials 附錄 | `docs/cs336-language-modeling/appendix-materials.md` | 逐講列出 code/slides/trace/assets 的用途、讀者應看什麼、哪些未讀或待補 |
| Coursework 附錄 | `docs/cs336-language-modeling/appendix-coursework.md` | Assignment 1-5 的學習目標、實作範圍、對應章節、honor-code-safe 能力檢核 |
| Compute / policy 附錄 | `docs/cs336-language-modeling/appendix-course-admin.md` | compute guidance、submission、late days、honor code、AI policy 等課務資訊 |
| 追蹤表 | `plan/cs336-materials-plan.md`、`plan/cs336-transcript-tracker.md` | 每批完成後同步閱讀狀態與缺口 |

## Worker 鐵律

1. 全程繁體中文。
2. 只使用本地材料；除非主控明確開啟外部查核，否則不網搜。
3. 資訊不足標 `待補`，不可猜檔名、URL、deadline、assignment 編號或材料對應。
4. Assignment 只整理「學習目標、實作範圍、章節關聯、能力檢核」，不得寫解答。
5. honor code / AI policy / submission / late days / compute price 只放附錄或材料頁。
6. 每個 worker 只改被指派檔案；不可碰 notes、其他書或無關 config。

## Agent 分工

| Worker | 範圍 | 讀取材料 | 可寫入 |
|---|---|---|---|
| M1 executable lectures | Lecture 1, 2, 6, 7, 10, 12, 13, 14, 17 | `lecture_XX.py`、對應 trace、stdout/PTX（若有） | 對應章節材料段、`appendix-materials.md`、plan/tracker |
| M2 slide lectures | Lecture 3, 4, 5, 8, 9, 11, 15, 16 | `lecture_XX.pdf` | 對應章節材料段、`appendix-materials.md`、plan/tracker |
| M3 assignments | Assignment 1-5 | README、PDF handout、tests/adapters、configs/scripts/data 目錄清單 | 對應章節材料段、`appendix-coursework.md`、plan/tracker |
| M4 assets / traces | cross-lecture assets | `assets/`、`images/`、`var/traces/`、`var/*.txt` | `appendix-materials.md`、plan/tracker |
| M5 admin materials | course admin | 官方本地摘錄、materials plan 中 policy/compute 段 | `appendix-course-admin.md`、plan/tracker |
| M6 integration reviewer | 全書 | 已更新章節與三個附錄 | 回報問題；必要時由主控改稿 |

## 批次順序

### Batch M1：先補 executable lecture materials

範圍：Lecture 1, 2, 6, 7, 10, 12, 13, 14, 17。

交付：
- 每講 3 到 6 個 material-derived 重點。
- 對應本地路徑。
- trace / stdout / PTX 若未讀，明確標 `未讀`。
- 若 material 只是重現逐字稿主線，不重複寫入正文。

### Batch M2：補 PDF slides

範圍：Lecture 3, 4, 5, 8, 9, 11, 15, 16。

交付：
- 每份 slides 的章節對應、主要圖表或公式、逐字稿未充分呈現的補充點。
- 不搬整張投影片文字。
- 圖表若要進書稿，只記為候選；是否實際插圖由主控決定。

### Batch M3：補 assignments

範圍：Assignment 1-5。

交付：
- 每份作業的學習目標。
- 實作範圍與相關章節。
- 需要讀者掌握的能力檢核。
- 不提供測試答案、實作策略、可提交程式碼或具體解題步驟。

### Batch M4：補 assets / traces

範圍：`data/cs336/lectures material/assets/`、`images/`、`var/traces/`、`var/*.txt`。

交付：
- 哪些 assets 是章節圖表候選。
- 哪些 traces 能幫讀者理解 lecture code 執行流程。
- 哪些輸出檔只適合作為開發紀錄，不進書稿。

### Batch M5：補課務附錄

範圍：compute guidance、honor code、AI policy、submission、late days、regrade、sponsor。

交付：
- `appendix-course-admin.md`。
- 技術章節只保留必要交叉連結，不放政策內容。

### Batch M6：整合審稿

範圍：所有主稿章節與材料附錄。

檢查：
- 讀者是否只看 book 就能知道每份 local material 的用途。
- 作業段落是否 honor-code-safe。
- 技術章節是否被課務規則污染。
- `待補` 是否集中、明確且可追蹤。
- 是否有材料與講次對不上的情況。

## Worker Prompt 範本

```text
你是 CS336 成書計畫的 course material worker。全程繁體中文，不網搜。

先讀 CLAUDE.md、plan/cs336-book-plan.md、plan/cs336-materials-plan.md、plan/cs336-transcript-tracker.md、plan/cs336-course-material-agent-plan.md。

本輪範圍：<填入 lectures 或 assignments>。

任務：
1. 完整讀取指定本地材料，只記錄能從檔案本身確認的事實。
2. 更新對應章節的「## 相關作業與材料」段落，使讀者看 book 就知道該材料的用途與章節關聯。
3. 更新指定附錄：appendix-materials.md / appendix-coursework.md / appendix-course-admin.md。
4. 同步更新 plan/cs336-materials-plan.md 與 plan/cs336-transcript-tracker.md。

限制：
- 不寫 assignment 解答。
- 不新增外部資料。
- 資訊不足標 `待補`。
- 只改本輪指定檔案。

收尾：
- 跑 `uv run mkdocs build -f configs/cs336-language-modeling.yml`。
- 回報已讀材料、更新檔案、仍待補材料、材料與講次對不上的地方。
```

## 主控驗收清單

- 每個材料補充都有本地路徑。
- 每章材料段短而可讀，不取代正文。
- 附錄能支撐「只看 book」的使用情境。
- Assignment 內容沒有越過 honor code。
- `待補` 沒有被偷偷改成推測內容。
- MkDocs build 通過。

