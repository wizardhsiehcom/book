# MAS.531 計算相機與攝影 — 改善計畫

> 原審查日期：2026-07-11　審查者：主控 session（Claude Code）
> 對象：`docs/mas531-computational-photography/`（config：`configs/mas531-computational-photography.yml`）
> 課程本體：MIT MAS.531 *Computational Camera and Photography*，Fall 2009（Ramesh Raskar）。
>
> **狀態更新 2026-07-19：全計畫已執行完畢。以下就地標記完成度，僅保留真正未結項目。**

---

## 0. 執行狀態總覽（2026-07-19 驗證）

以 `docs/` 實檔與 `uv run mkdocs build` 驗證，原計畫全數落地：

| 項目 | 原審查狀態 | 現況 |
|---|---|---|
| P0-1 launcher 書卡 | 未登錄 | ✅ `js/books-data.js` 已有 mas531 條目 |
| P0-2 前言／參考資料空殼 | 全「待補」 | ✅ preface／references／README 皆無「待補／施工中」 |
| P0-3 notes/ orphan 頁面 | 16 檔在 docs/ 內公開 | ✅ 已移出 `docs/`；build 無 orphan 警告 |
| P1-4 骨架不一致 | ch7/8/9 缺常見誤解 | ✅ 三章皆補齊；ch9 改用「導讀」 |
| P1-5 零圖表 | 14 章無圖 | ✅ 12 檔含 Mermaid 圖 |
| P1-6 數字無出處 | references 空 | ✅ references.md 已定稿為權威來源頁 |
| P1-7 覆蓋缺口（Lec7／Transient） | 未決 | ✅ 依 R1 裁決不補章，於 preface／ch1 加註說明 |
| P1-8 水中雷射 420nm 疑誤 | 待查 | ✅ 正文改 473nm 並加 `[^water]` 註說明原講口誤 |
| P2-9 零交叉連結 | 無 | ✅ 85 條章間相對路徑連結 |
| P2-10/11 後續發展／glossary | 缺 | ✅ 已補時間錨點小註與術語回連 |
| build | — | ✅ 通過，無 nav／orphan／語法警告 |

正文（章節＋附錄＋references＋glossary）目前 `待查` 殘留 **0** 處。

---

## 1. 未結項目（真正剩下的工作）

- **research/ 內約 12 項 `待查`（非阻斷級）**：原 R2／R5 研究筆記檔尾標記的次要規格查證，未寫入正文、不影響書稿正確性。若日後要把 references 的少數條目從「依課堂講述」升級為兩來源確認，可回頭處理。
- **選配 `/mkdocs-add-images`**：目前以 Mermaid 圖為主，尚未跑真實照片補圖流程（人物／裝置照）。屬體驗補強，非必要。

除以上外無殘留動作。

---

## 2. 已封存的原計畫（供追溯）

原始改善計畫的完整審查結論（P0/P1/P2）、Phase 1 研究裁決、逐頁追蹤表、新增頁面決策、網路搜索規範、統一頁面模板、多 agent 執行制度與階段驗收清單，皆已據以執行完畢（見上方狀態總覽）。細節如需回溯，見本檔 git 歷史（2026-07-11／07-12 版本）。
