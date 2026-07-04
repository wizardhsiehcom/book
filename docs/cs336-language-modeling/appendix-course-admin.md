# 課務、提交與算力資訊

本附錄集中整理課務規則與算力提示。這些內容會影響作業執行方式，但不屬於技術章節主線，因此不放進各章正文。

## Honor Code

- 可組讀書會，但每位學生必須理解並完成自己的作業。
- 若與他人討論或組隊學習，提交時需依課程規則註明。
- 不應查閱未被 handout 允許的第三方既有實作。

## AI Policy

- 可用 AI 工具詢問低階程式問題或高階概念問題。
- 禁止直接用 AI 產出作業解答。
- 課程建議完成作業時關閉 AI autocomplete，以避免跳過真正需要練習的理解。

## Submission

- 作業透過 Gradescope 提交。
- 截止前可多次提交，以最後一次提交為準。
- Partial work 比完全不提交好。

## Late Days

- 每位學生有 6 個 late days。
- 每份作業最多使用 3 個 late days。

## Regrade

若認為評分有客觀錯誤，可在成績發布後 3 天內於 Gradescope 提出 regrade request。

## Compute Guidance

課程對自學者的原則建議是：先在 CPU 上 debug correctness，再用 GPU 做 training runs 或 GPU benchmarks。

網站摘錄曾列出 2026-03-28 單張 B200 GPU 公開價格範例，但價格會變動；本書不把這些價格當成正式建議。

| Provider | 網站摘錄價格 | 備註 | 查核狀態 |
|---|---:|---|---|
| Modal | $6.25/hour | sponsor；每月 $30 free compute；依實際 compute 計費 | 未重新查核 |
| Lambda Labs | $6.69/hour |  | 未重新查核 |
| RunPod | $4.99/hour |  | 未重新查核 |
| Nebius | $5.50/hour；preemptible $3.05/hour |  | 未重新查核 |
| Together | $7.49/hour；minimum 8 GPUs | 長期承諾較便宜 | 未重新查核 |

## Sponsor

課程網站列出 Modal sponsor compute。

