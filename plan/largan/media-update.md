# Wikimedia 線上圖解更新（2026-09-15）

依使用者更正，四段 GIF 動畫與一張球差圖改為直接引用 upload.wikimedia.org 線上網址。保留來源、作者、授權與中文讀圖提示；不下載或轉檔。已移除上一版新增的 13 個 GIF、MP4、PNG 本地素材，建置後亦不再包含這些副本。既有兩張原創 SVG 不屬於這次 Wikimedia 素材。

MkDocs 建置成功；18 頁、1436 個本地連結與資源目標檢查通過，仍有既有 9 個跨書警告。check_media.py 驗證兩種閱讀寬度的線上圖片解碼與頁面寬度；最新結果見 media-validation.json。GIF 載入後依原檔自動播放，需要網路連線。

上一版本地 MP4 播放與 HTTP Range 的驗證已不適用。
