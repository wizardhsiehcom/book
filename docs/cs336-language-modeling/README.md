# 導讀：從零建立語言模型的完整堆疊

這本書整理 Stanford CS336《Language Modeling from Scratch》Spring 2026 的課程逐字稿。寫作原則是先完整讀完每一講逐字稿，再把口語課程整理成繁體中文的技術書稿；不以課名、片段或既有印象代替逐字稿本身。

CS336 的核心不是「知道 Transformer 是什麼」而已，而是從 tokenizer、張量程式、模型架構、GPU kernel、平行化、scaling laws、推論、評估、資料處理到 post-training，建立一套能真的動手訓練語言模型的工程心智模型。

## 這本書的讀法

1. 先讀[全書地圖](00-plan.md)，掌握課程如何把語言模型拆成可實作的堆疊。
2. 依章節順序閱讀。每章都會標註對應的完整逐字稿。
3. 遇到術語時可回到[術語表](appendix-glossary.md)。
4. 想理解 lecture code、slides、trace 與圖表素材時，看[課程材料索引](appendix-materials.md)。
5. 想知道作業訓練哪些能力時，看[作業與能力檢核](appendix-coursework.md)；該附錄不提供作業解答。
6. 課務規則、AI policy、late days 與算力提示集中在[課務與算力資訊](appendix-course-admin.md)。
7. 外部資料只會在逐字稿初稿完成後補入，並集中整理於[參考資料](appendix-references.md)。

## 目前進度

18 講逐字稿已全部整理成章，並已完成課程材料與 Assignment 1-5 的「關聯層」整理。每章的「相關作業與材料」段落只記錄本地路徑、學習目標、實作範圍與材料狀態，不提供作業解答；完整材料入口集中在三個附錄頁。

目前進入全書整合階段：第 17 章與第 18 章的章節定位、跨章連結、核心 references 與材料索引已完成第一輪；剩餘工作集中在少數 ASR 存疑名詞、Lecture 18 guest lecture 材料，以及圖像授權 / caption 查核。
