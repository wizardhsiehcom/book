# EE274 算術編碼：第一手來源核對

查詢日期：2026-09-28（Asia/Taipei）。核對範圍是固定機率模型下的教學算例與基本實作限制；不代表完整的有限精度編碼器規格。

| 主張 | Stanford EE274 第一手來源 | 教學界線 |
|---|---|---|
| 算術編碼從半開單位區間 `[0,1)` 開始，依符號的累計機率將目前的 `[L,H)` 再切成子區間；序列區間長度等於序列機率。 | [EE274 算術編碼講義：區間更新與長度](https://stanforddatacompressionclass.github.io/notes/lossless_iid/arithmetic_coding.html#step-i-finding-the-interval-lh)；[Lecture 6 投影片，第 20–26 張](https://stanforddatacompressionclass.github.io/Fall22/static_files/L6_slide.pdf) | 字母順序及累計機率邊界是模型的一部分。本例明訂順序為 A、B、C，因此子區間依序為 `[0,1/2)`、`[1/2,3/4)`、`[3/4,1)`。 |
| k 位元小數前綴代表一個二進位區間；只有整個前綴區間都包含在序列區間內，截短的位元串及其後綴才都能解碼為該序列。 | [EE274 算術編碼講義：選擇截短位元數](https://stanforddatacompressionclass.github.io/notes/lossless_iid/arithmetic_coding.html#determining-how-many-bits-to-truncate-z-to)；[Lecture 6 投影片，第 41–47 張](https://stanforddatacompressionclass.github.io/Fall22/static_files/L6_slide.pdf) | 前綴 `10011` 的區間是 `[19/32,20/32)`，也就是 `[0.59375,0.625)`。此例剛好與 BAC 的序列區間完全相等；必須保留半開端點慣例，`0.625` 不屬於該區間。上端正好是下一個前綴區間的邊界，因此應驗證「前綴區間包含於序列區間」，不要要求兩個端點以一般二進位表示時都顯示相同的五位前綴。 |
| 解碼需要停止條件：可另外提供序列長度，或把 EOF 納入符號表並在解出 EOF 時停止。 | [EE274 算術編碼講義：停止解碼](https://stanforddatacompressionclass.github.io/notes/lossless_iid/arithmetic_coding.html#arithmetic-decoding-theoretical)；[Lecture 6 投影片，第 27–36 張](https://stanforddatacompressionclass.github.io/Fall22/static_files/L6_slide.pdf) | `n=3` 是本教學例另外已知的資訊，不包含在 `10011` 這五個位元內。若採 EOF，EOF 機率須非零，且 EOF 會改變被編碼序列及其區間。 |
| 有限精度會讓快速縮小的區間無法再由可用數值精確表示；實作會用重縮放／正規化處理。 | [EE274 算術編碼講義：實務限制與重縮放](https://stanforddatacompressionclass.github.io/notes/lossless_iid/arithmetic_coding.html#arithmetic-coding-in-practice)；[Lecture 6 投影片，第 54–63 張](https://stanforddatacompressionclass.github.io/Fall22/static_files/L6_slide.pdf) | 共同前綴輸出不能涵蓋所有窄區間：講義另舉跨越 `0.5` 的中段區間，需採用中段重縮放或其他處理。EE274 來源沒有給出「64 位元浮點在幾十個符號後必定失效」的通用門檻；門檻會受機率、資料與實作影響。 |

## 算例驗算

令 `P(A)=1/2`、`P(B)=1/4`、`P(C)=1/4`，且符號順序為 A、B、C：

| 步驟 | BAC 前綴 | 區間 |
|---|---|---|
| 初始 | 空 | `[0,1)` |
| 編碼 B | B | `[1/2,3/4)` |
| 編碼 A | BA | `[1/2,5/8)` |
| 編碼 C | BAC | `[19/32,5/8)` = `[0.59375,0.625)` |

序列機率是 `(1/4)(1/2)(1/4)=1/32`，與最終區間寬度相同。`10011` 作為二進位小數的值是 `19/32`；作為五位元前綴，它表示 `[19/32,20/32)`，恰好等於 BAC 的區間。長度三另已知時，解碼器讀三個符號便停止。這個對齊也使例子正好用 5 位元，等於 `-log₂(1/32)`；長度資訊的傳送成本未計入。

## 來源索引

- [Stanford EE274 課程筆記首頁](https://stanforddatacompressionclass.github.io/notes/)：說明這套筆記是 Stanford EE274 講義，並標示內容仍在編修中。
- [Fall 2023 EE274 Lecture 6 課程頁](https://stanforddatacompressionclass.github.io/Fall23/lectures/)：將第 6 講列為 Arithmetic Coding，並連到算術編碼筆記與投影片。
