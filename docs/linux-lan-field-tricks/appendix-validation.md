# 附錄｜實測與出版驗證

日期：2026-09-22。此頁區分「書可以閱讀」「範例程式可用」與「現場招式已重現」，三者沒有互相代替。

## 已執行的程式檢查

在本機 macOS 的 Python 3.12 環境執行 `examples/check_receiver.py`，只綁 `127.0.0.1` 隨機埠，結果通過：相同輸入重送得到相同 bytes／SHA-256；單欄位變動得到不同指紋；錯誤 JSON、非 object、非 UTF-8、錯誤路徑、Content-Type、超過上限與不支援 Transfer-Encoding 都被拒絕。

這證明第 06 章這個小接收器的指定行為，在此次本機檢查成立；不證明 Windows PowerShell、跨實體線路、TLS、五台並行或機台產品已測。接收器沒有接觸任何使用者設備。

## 全部仍待實機重現的項目

| 章 | 待補證據 |
|---|---|
| 01–02、04 | Windows＋Linux 真實線路、換機／bind／停服務三態、實際工具版本 |
| 03 | 原名稱、proxy 與單次 resolve 對照；HTTPS 需現場可信名稱與憑證 |
| 05 | tcpdump 權限、介面、限時收尾、擷取遺漏與跨端對時 |
| 06 | Windows curl 到 Linux 的輸入指紋；真實 GUI 與測試接口比較 |
| 07 | Windows iperf2 發行檔、雙端版本、正反向各三次與五台競爭 |
| 08 | 現場 ICMP 大小探測；PMTU 故障重現另需隔離路由環境 |
| 09 | 獨立介面上的 netem、client timeout／取消與撤回基線 |
| 10 | Windows OpenSSH、server forwarding policy、隧道三態 |
| 11 | 既有具名共享與帳號、兩台 edition/build、登入與讀檔結果 |

F01–F06 都是來源作者的案例，本書沒有取得其完整環境與原始資料重跑。第 08 章維持進階選讀，不假設純交換器 LAN 一定會遇到 PMTU 黑洞。

## 出版檢查

已以專案共用資源同步流程及 `uv run mkdocs build --strict -f configs/linux-lan-field-tricks.yml` 建置成功。Markdown 內部連結、出版頁面／nav 範圍、HTML 本地資源、每頁唯一「回到書庫」連結與實際根入口路徑已做靜態核對。研究卡與計畫未放入出版目錄；公開範例僅含接收器、檢查程式與虛構 JSON。

**瀏覽器視覺驗收尚未完成。** 已嘗試瀏覽器與原生 Chrome 預覽：沒有可用 browser connector，原生控制回報 Computer Use permissions are not granted。因此目前只確認 Mermaid 容器與腳本存在，未宣稱兩張圖在瀏覽器成功渲染；桌面／手機排版、CDN 載入及 file URL 操作仍待人工預覽。這個限制不影響 HTML 已生成，但本書不能標為完成視覺出版驗收。

Material 預設 `404.html` 的部分資源與導覽使用根絕對 URL；若部署在網站子路徑，錯誤頁需由部署端另外設定。一般 17 頁已通過本地相對路徑檢查；本輪沒有修改全書庫共用錯誤頁模板。
