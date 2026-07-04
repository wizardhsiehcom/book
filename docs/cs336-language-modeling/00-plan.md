# 全書地圖

本書以 CS336 的 18 份逐字稿為主資料來源。每一章必須先完成完整閱讀筆記，再寫成書稿。

## 篇章安排

| 篇 | 章節 | 主題 |
|---|---|---|
| 第一篇：起點與工具 | 01-02 | 課程哲學、tokenization、PyTorch 與 einops |
| 第二篇：模型架構 | 03-04 | Transformer 架構與 attention 替代方案 |
| 第三篇：訓練系統 | 05-08 | GPU/TPU、kernel、compiler、平行化 |
| 第四篇：規模、推論與評估 | 09-12 | scaling laws、inference、evaluation |
| 第五篇：資料與 post-training | 13-16 | 資料來源、資料處理、mid/post-training、RLVR |
| 第六篇：多模態與推論延伸 | 17-18 | multimodality、表示對齊、inference systems、guest lecture |

## 寫作流程

1. 完整讀完單講逐字稿。
2. 寫閱讀筆記，記錄主問題、概念、工程取捨與跨章連結。
3. 將筆記改寫成章節初稿。
4. 所有逐字稿初稿完成後，再搜尋外部理解與補充資料。
5. 最後統一術語、交叉引用、圖表與參考資料格式。

## 材料附錄

| 附錄 | 用途 |
|---|---|
| [課程材料索引](appendix-materials.md) | 整理 lecture code、PDF slides、trace、stdout、PTX、assets/images 與圖表候選。 |
| [作業與能力檢核](appendix-coursework.md) | 整理 Assignment 1-5 的學習目標、實作範圍、對應章節與能力檢核；不提供解答。 |
| [課務與算力資訊](appendix-course-admin.md) | 集中放 honor code、AI policy、submission、late days、regrade 與 compute guidance。 |
| [參考資料](appendix-references.md) | 整理外部論文、專案、benchmark 與已查核 references。 |

## 材料與圖表狀態

| 項目 | 狀態 |
|---|---|
| 本地材料索引 | Lecture 1-17 的 code / slides / traces / stdout / PTX / assets 已整理到材料附錄；Lecture 18 guest material 仍待補。 |
| 第一輪書內替代 | 已完成第 1、2、6、7、9、10、12、13、14、17 章的 Mermaid 或 Markdown 表格替代，不直接使用原圖片。 |
| 仍需查核 | 原圖來源、授權、caption、PDF 公式排版、stdout/PTX 執行環境與日期。 |

## 章節狀態

| 章 | 標題 | 狀態 |
|---:|---|---|
| 01 | Overview, Tokenization | 初稿完成；材料圖表已入書 |
| 02 | PyTorch (einops) | 初稿完成；材料圖表已入書 |
| 03 | Architectures | 初稿完成 |
| 04 | Attention Alternatives | 初稿完成 |
| 05 | GPUs, TPUs | 初稿完成 |
| 06 | Kernels, Triton, XLA | 初稿完成；材料圖表已入書 |
| 07 | Parallelism I | 初稿完成；材料圖表已入書 |
| 08 | Parallelism II | 初稿完成 |
| 09 | Scaling Laws I | 初稿完成；材料圖表已入書 |
| 10 | Inference | 初稿完成；材料圖表已入書 |
| 11 | Scaling Laws II | 初稿完成 |
| 12 | Evaluation | 初稿完成；材料圖表已入書 |
| 13 | Data: Sources and Datasets | 初稿完成；材料圖表已入書 |
| 14 | Data Pipeline and Quality | 初稿完成；材料圖表已入書 |
| 15 | Mid/Post-Training | 初稿完成 |
| 16 | Post-Training: RLVR | 初稿完成 |
| 17 | 多模態與表示對齊 | 初稿完成；材料圖表已入書 |
| 18 | 推論系統延伸：Dan Fu 客座講座 | 初稿完成 |
