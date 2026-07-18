# 《Pfeffer on Power》改進計畫

- 原審查日期：2026-07-11
- 狀態更新：2026-07-19 —— 本計畫已大致執行完畢，以下就地標記完成度，僅保留真正未結項目。

---

## 0. 執行狀態總覽（2026-07-19 驗證）

以 `docs/pfeffer-on-power/` 實檔與 `uv run mkdocs build` 驗證，原計畫幾乎全數落地：

| 項目 | 原審查狀態 | 現況 |
|---|---|---|
| P0-1 launcher 書卡 | 未註冊 | ✅ 已在 `js/books-data.js` 註冊 |
| P0-2 外部查證（URL／發布日期） | 全部懸空 | ✅ 附錄 B 已回填 62 筆 YouTube 官方 URL |
| P1-1 內部超連結 | 全書零命中 | ✅ 87 條相對路徑連結 |
| P1-2 Mermaid 圖 | 零圖 | ✅ 3 張（README 結構、七規則、權力飛輪等） |
| P1-4 讀者自查段 | 0/19 | ✅ 19/19 章皆有 |
| 統一模板「相關章節」段 | 無 | ✅ 19/19 章皆有 |
| P2-1 附錄 A `authenticity` 待補 | 待補 | ✅ 已回填 |
| build | — | ✅ 通過，無 WARNING（僅 notes 的 "not in nav" INFO） |

---

## 1. 未結項目（真正剩下的工作）

### R-1 四處 `待查` 人物／調查背景（需上網兩來源查證，勿憑記憶補寫）

`grep -n 待查 docs/pfeffer-on-power/[0-9]*.md` 命中 4 處：

| 檔案:行 | 待查內容 |
|---|---|
| `15-workplace-leadership-bs.md:61` | Hamel/Zanini 轉述的「1995 年大型工作實務調查」出處 |
| `16-practice-and-keep-power.md:9` | Rudy Crew（Miami-Dade 學區）、Jamie Dimon／Sandy Weill 當時在 Citigroup 的具體職務 |
| `16-practice-and-keep-power.md:19` | Gary Loveman 詳細背景（Pfeffer 課堂常引企業高階主管） |
| `16-practice-and-keep-power.md:49` | Keith Ferrazzi、Marcelo Miranda、Deborah Liu 的身分／職務背景 |

**規則（延續原計畫第 4 節）**：官方＞學術＞產業＞新聞；敏感職稱與數字需兩個獨立來源；查不到維持 `待查`；逐字稿口述主張保留「Pfeffer 認為／受訪者自述」歸屬語態，外部資料只做溯源與年代標註。此項未在本輪執行——待主控決定是否啟動研究。

### 選配

- **notes/ 不在 nav（62 個 orphan，build INFO）**：刻意設計，可接受。若想乾淨，可在 config 加 `exclude_docs` 或建附錄 C 來源筆記索引頁。
- **README 進度表**：若日後補完 R-1，同步把相關章節狀態由「初稿」更新為「已查證」。

---

## 2. 已封存的原計畫（供追溯）

原始改進計畫的完整審查結論、逐頁追蹤表、新增頁面清單、網路搜索規範、統一頁面模板、多 agent 執行制度與階段驗收清單，皆已據以執行完畢（見上方狀態總覽）。除 R-1 外無殘留動作，故不再逐條保留；如需回溯細節，見本檔 git 歷史（2026-07-11 版本）。
