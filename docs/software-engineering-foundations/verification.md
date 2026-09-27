# 驗證紀錄

本版建置日期：2026-09-26。內容定位為 B01 初版與 C00 基礎短課；不是完整資工學位教材，也尚未有讀者驗收結果。

## 已執行

| 項目 | 結果 |
|---|---|
| 本書 concepts.cpp | Apple Clang 21，C++17 Debug 與 -O2 -DNDEBUG 均 PASS |
| Python 語意例子 | Python 3.9.6，含 -O 模式均維持有效檢查 |
| C00 G00–G06 與遷移參考解 | Debug／Release 各 199 項行為檢查通過；最終 repo 以 Python 3.12.12 重建通過 |
| 環境反例 | G00 以 C++11 仍可執行並回報需 C++17；錯 fixture 也會失敗 |
| 課程文件 | 132 個連結引用與各階命令核對通過；檢查器能拒絕刻意不存在的連結 |
| MkDocs | `uv run mkdocs build --strict -f configs/software-engineering-foundations.yml` 通過 |
| 桌面閱讀 | Safari 實際開啟導讀、全書地圖、輸入契約；圖形有渲染，表格與程式區塊可讀 |

## 重現

原理實驗命令見[實驗頁](labs.md)。C00 在 courses/aoi-preflight-course/ 課程目錄執行 `python3 tools/course.py test`；完整命令與 final-run.txt 在課程的 verification/。編譯產物與私人資料不包含在[來源下載](downloads/aoi-preflight-course.zip)。

所有 fixture 是合成，真 filesystem 檢查不代表真影像解碼。成功狀態只表示本階檔案契約；缺圖是正常檢查結果，和無法讀清單的錯誤不同。

## 尚未驗證

Windows／MSVC、Linux 實機、遠端 GitHub Actions、手機／窄視窗視覺、互動 debugger 完整教學操作、Unicode 路徑、權限故障的全部平台差異、真機台格式與資料。提供操作路徑不等於已在該平台驗證。macOS Safari 抽查也不代表每個瀏覽器與每種寬度都測過。

書附的來源定位採持續更新文件，日後改 compiler 或 API 時仍應重新查證。讀者免修診斷與末階遷移必須自己完成，不由教材測試 PASS 代替。
