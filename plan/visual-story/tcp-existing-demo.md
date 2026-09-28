# TCP 既有實驗盤點

## 結論

可沿用 `templates/visual-story/` 的閱讀器外殼與資料契約，也可把 `tcp-story.js` 的十頁敘事當分鏡素材；正式整合時須改連結路徑，並替 TCP 圖解 class 加主題前綴。這份盤點只讀程式與文件，沒有開啟瀏覽器或看過實際畫面。

## 可沿用

| 項目 | 可沿用內容 | 搬入正式主題時的處理 |
| --- | --- | --- |
| 閱讀器外殼 | `templates/visual-story/index.html` 的標記與載入順序：reader CSS、主題 CSS、主題 JS、reader JS。`story.html` 已採相同契約。 | 複製範本的三個主題檔，再放入 TCP 分鏡；不把 playground HTML 當正式檔案直接複製。 |
| 分鏡 | `tcp-story.js` 以「看到資料不足 → 猜訊息是否完整 → 加入結尾約定 → 接合暫存資料 → 引入名詞」逐步展開；頁面 `id`、預測題及 `detail` 都符合 reader 契約。 | 頁序與互動可作素材，數量不必固定。若改採原書長度前綴契約，須重寫換行定界的例子與文字，不能只換標題。 |
| 題目與縮圖 | 第 3 頁使用 reader 支援的 `question` 和 `hideFuturePreviews`；靜態頁可共用 `art` 產生預覽。 | 新互動若直接操作 DOM，照範本提供靜態 `previewArt` 和 `mount` 清理函式；本 TCP 故事目前沒有頁內互動。 |
| 圖解樣式 | `tcp-story.css` 的訊息色彩、完成／待收狀態、串流排列、terms 格狀排版，以及 `.mini-page` 的預覽尺寸調整，可作視覺素材。 | 將 `.row`、`.label`、`.message`、`.terms` 等主題 class 改成 `tcp-` 前綴，並同步改 `art` 字串與 CSS。保留 reader 的 `.mini-page` 外殼 class。 |
| 自動檢查 | `playground/check-story.cjs` 展示如何用 DOM stub 檢查頁數、翻頁、預測題、索引釘選與本機引用。 | 可沿用檢查意圖；它只讀取相對檔案是否存在，不驗證正式建置後的 URL，也不檢查 CSS 或畫面。本次沒有執行它。 |

README 另提到的 A/B/C 實驗在 `playground/dist/app.js`：這是另一個單頁 SVG 比較器，使用 `CAT\nDOG\n` 的 8 bytes、4 個逐步場景、1／3／6／8 byte 接收控制，並以 128 種切法做 Node 自我檢查。這些數字屬於 CAT/DOG 實驗，不能挪到 `tcp-story.js` 的 HELLO/WORLD 分鏡或新故事中。`tcp-story.js` 是十頁、固定採 HELLO/WORLD 與換行定界的另一份實驗。

## 正式整合必修路徑

`configs/systems-network-foundations.yml` 設定 `use_directory_urls: false`，因此返回章節應指向建置後的 `.html`。若主題放在 `docs/systems-network-foundations/resources/tcp-stream/`：

| 位置 | playground 現值 | 正式主題值 |
| --- | --- | --- |
| 主題 HTML 的 reader CSS／JS | `../../docs/assets/story-reader/reader.css`、`../../docs/assets/story-reader/reader.js` | `../../assets/story-reader/reader.css`、`../../assets/story-reader/reader.js` |
| `story.back.href` | `index.html`（返回實驗比較頁） | `../../08-tcp-stream.html` |
| 第 10 頁的章節連結 | `../../docs/systems-network-foundations/08-tcp-stream.md`、`09-message-contract.md`（repo 原稿） | `../../08-tcp-stream.html`、`../../09-message-contract.html` |
| 第 08 章開啟故事 | 尚未整合 | `resources/tcp-stream/index.html` |

閱讀器來源位於 `docs/assets/story-reader/`，建置前須同步，主題 HTML 只引用書內生成的 `../../assets/story-reader/`。不需把主題 HTML 加入 Markdown `nav`，也不應在全書 `extra_javascript` 載入 reader。

## 技術內容與限制

- 十頁故事明確使用 ASCII 的 `HELLO↵WORLD↵`，共 12 bytes；第 2、4 頁展示無邊界文字流，第 5 頁起重新加入換行定界。這是教學模型，故事已明說並非真實 TCP 測量，也不是原書第 09 章的協定。
- 圖解呈現 `HE`、`LLO↵WO`、`RLD↵` 的分段；按換行取出完整訊息、保留下一筆的未完成尾巴，概念與原書的串流說明一致。它沒有真的呼叫 socket，也不代表 `recv` 每次回傳指定大小。
- 第 9 頁寫「此例全是 ASCII，含換行共 12 bytes」正確；UTF-8 多位元組字元可能跨接收邊界的提醒也正確。若故事改成中文正文，需改用 bytes 層級的示意，不能直接以字元數當 byte 數。
- 搬遷時可把原書 `.md` 連結改為建置後 `.html`；`check-story.cjs` 對目前 playground 的 `.md` 連結只檢查原稿檔存在，因此無法發現這類發布路徑錯誤。

## 尚未確認

沒有做瀏覽器 QA，因此沒有實際畫面證據。尚未確認窄螢幕與放大文字時的排版、縮圖裁切與可讀性、索引釘選及 hover 行為、鍵盤操作、減少動態效果，以及建置後返回章節連結是否可用。`check-story.cjs` 是 DOM stub，不會產生畫面；其結果本次也未執行。正式整合後需在建置產物上做瀏覽器檢查。
