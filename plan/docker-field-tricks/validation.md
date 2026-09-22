# Docker 現場招式｜成書驗收

驗收日期：2026-09-22。交付導讀＋13章＋4附錄，共18個讀者頁面；不是骨架或只有計畫。正文、網站設定及書庫入口已完成。

## 實機驗證

- 13章核心fixture均在Desktop4.60.1／Engine29.2.0／Linux arm64完成，原始指令與輸出見 [runs索引](../../data/docker-field-tricks/runs/README.md)。
- 第12章為0/5/10秒 × started/healthy × 3輪，以及1次假探針；第11章為首輪＋四輪AB/BA與資料未同步反例。
- 第06章兩組最終各4行，輪詢首筆3968/16ms；第13章A/B/C分別3.126/0.136/3.137秒，只有B有cleanup標記。數字的起訖定義已寫入正文，不混成同種效能指標。
- 初稿的跨程序monotonic計時與shell變數全形冒號問題已修正並完整重跑，保留首次失敗紀錄；沒有只刪失敗輸出。
- 最終只讀核對：field測試容器、測試tags、network與volume均無殘留。基底映像與build cache保留；沒有全域prune。
- 原生Linux、WSL2、amd64、遠端daemon及其他driver未測。第11章VMM／共享後端有效設定仍未知，保留單環境結論。

## 程式與出版檢查

執行 [verify-book.py](verify-book.py)：18頁、45個Bash區塊通過bash -n，17個Python heredoc通過語法解析；章間連結及本版實測標記核對通過。主機端另檢查ready狀態邊界、輸入改動會改變摘要、cleanup handler寫標記後退出。此腳本本身不執行Docker，容器證據是上一節獨立保存的13份run log。

`node --check js/books-data.js` 通過。依專案 `bash ./sync-assets.sh` 同步資源後，`uv run mkdocs build --strict -f configs/docker-field-tricks.yml` 成功（MkDocs1.6.1）。生成18個一般出版頁面＋404；18頁的一般本地連結與資源存在，搜尋索引未包含plan/data工作檔。

19個HTML頁面的回書庫連結各恰好一個，解析後都回專案index.html。沿用的Material 404樣板，其其他導覽／資源採site-root絕對路徑；從整個書庫根提供HTTP時，直接開單書404頁不是已驗證的錯誤路由。這是既有樣板的部署邊界，未改動共用模板。

## 實際畫面

原生CUA沒有可用瀏覽器，因此使用隔離profile的本機headless Chrome驗證，不使用使用者現有登入session。

- 桌面1440px：第01章文字／程式碼、11章實測表格可讀。
- 手機390px：第07章正文正常換行、程式碼保留水平捲動區；document scrollWidth等於viewport，沒有整頁水平溢出。
- 實際點擊回書庫，location.pathname為 /index.html。
- [畫面與尺寸紀錄](../../data/docker-field-tricks/previews/render-validation.json)、[桌面章節](../../data/docker-field-tricks/previews/chapter01.png)、[實測表格](../../data/docker-field-tricks/previews/io-results.png)、[手機正文](../../data/docker-field-tricks/previews/mobile07.png)。
- 無Mermaid或外部圖片的必要任務；表格與PID文字圖即為最終視覺。

## 交付位置

- [書籍入口](../../docs/docker-field-tricks/README.md)
- [MkDocs設定](../../configs/docker-field-tricks.yml)
- [生成HTML](../../book/docker-field-tricks/html/index.html)
- [完整書籍計畫與章節進度](docker-field-tricks-book-plan.md)

data與book輸出沿專案慣例被git忽略；本輪沒有commit、對外部署或發送訊息。其他同時進行的書籍檔案未修改或清除。
