"""Freeze final acceptance results after browser_acceptance.py completes."""
from pathlib import Path
from hashlib import sha256
import json

root = Path(__file__).resolve().parents[2]
plan = root / 'plan/psi'
browser = json.loads((plan / 'browser-validation.json').read_text(encoding='utf-8'))
content = json.loads((plan / 'content-validation.json').read_text(encoding='utf-8'))
assert browser['summary']['page_checks'] == 32
assert browser['summary']['failures'] == 0
assert browser['summary']['small_labels'] == 0
assert not content['broken_links_or_anchors']

manifest_path = plan / 'image-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
for page in manifest['pages']:
    assert sha256((root / page['file']).read_bytes()).hexdigest() == page['body_sha256']
    for diagram in page['diagrams']:
        diagram['render_result'] = 'PASS: desktop 1440x1000 and mobile 390x844; visible SVG, no error node, effective labels >=12px'
        diagram['validation_report'] = 'plan/psi/browser-validation.json'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')

report = '''# PSI 書籍最終驗收

驗收日：2026-09-14。正文共 16 頁：導讀、全書地圖、10 章、來源／術語／待查附錄與圖表出處。出版入口為 `book/psi/html/index.html`。

## 結果

| 項目 | 結果與證據 |
|---|---|
| 建置 | `uv run mkdocs build --strict -f configs/psi.yml` 通過；無 MkDocs 文件警告 |
| 共享資源 | 已执行 `bash ./sync-assets.sh`；未改其他書正文或共用主題 |
| 本地連結與資源 | 16 頁共 874 個引用通過；包含來源錨點、跨書目標與回書庫；`content-validation.json` |
| 教學模型 | `reuse_model.py` 通過；獨立事件樹、加權公式與 q=0／q=1／R=0 邊界一致 |
| 瀏覽器 | Chrome headless；1440×1000、390×844，16 頁×2=32 次檢查，無頁面錯誤或頁面水平溢出 |
| Mermaid | 11 張圖×2=22 次真實 SVG 檢查，無 error 節點，圖中文字有效字級均至少 12px |
| 視覺 | 已檢查手機／桌機截圖；長流程改為直式，01／07 簡化排列，06 工件比較不再縮成極小字 |
| 版本追溯 | `image-manifest.json` 保留每頁 SHA-256、圖 ID、插入位置與渲染結果 |
| 書庫資料 | `js/books-data.js` 只新增一筆 PSI 卡片；Node 語法與 diff 空白檢查通過 |

## 驗收方法與修正

最終瀏覽器腳本是 `browser_acceptance.py`，結果是 `browser-validation.json`。Material 使用封閉 Shadow DOM 存放圖表，驗收環境僅將 attachShadow 模式開放以檢視 SVG；沒有將測試注入放入出版頁。先前 `validate_browser.py` 與 `data/psi/validation/validation-report.*` 是診斷用首輪結果，不作最終通過依據。

最終設定保留 Mermaid 10 載入與 Material 原生渲染，移除多餘共享初始化，補明示的 superfences 格式。設定依據另核對 [Material 官方圖表文件](https://squidfunk.github.io/mkdocs-material/reference/diagrams/)及本機已安裝的 bundle；未改共用腳本。原始 PDF 圖像由已下載原檔轉出，主編目視 I1 印刷頁 23、24、27。

最終截圖位於 `data/psi/validation/final/`，包含導讀、04、06、09 的桌機與手機全頁截圖；11 張圖全部做 DOM 和尺寸驗證。圖片為原創 Mermaid／表格，沒有外部點陣圖解碼項目。

## 保留的限制

- Chrome 對共用 `GenWanMin2-R.woff2`、`GenWanMin2-SB.woff2` 出現既有 OTS 字型解碼警告，頁面使用系統備援字型可正常閱讀。未為此修改全書庫字型檔；此警告與圖表語法錯誤分開記錄。
- MkDocs Material 安裝版本啟動時有套件自身的 MkDocs 2.0 公告，不是本書建置失敗；本次未升級相依套件。
- MOPS 歷史公告原件無法直接通過安全驗證；設備事件以具名公告鏡錄處理。最新完整財報附註、業務別毛利、客戶允收／認證及材料量產仍列待查。
- 圖表執行依既有書系使用外部 Mermaid CDN；未改成離線打包或部署遠端網站。

研究與模型由三位 Luna max 子代理處理；主編完成正文、整合、來源強度校對及最後圖表故障診斷與驗收。
'''.replace('已执行', '已執行')
(plan / 'validation.md').write_text(report, encoding='utf-8')
path = plan / 'psi-book-plan.md'
text = path.read_text(encoding='utf-8').replace('`validate_browser.py` 及驗收輸出：桌機／手機、Mermaid 與截圖。',
    '`browser_acceptance.py`、`browser-validation.json`：最終桌機／手機、Mermaid 與截圖；首輪 validate_browser.py 留作診斷紀錄。')
path.write_text(text, encoding='utf-8')
print('Final validation recorded; source hashes match.')
