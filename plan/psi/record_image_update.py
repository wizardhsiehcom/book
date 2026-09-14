"""Record only checks actually completed for this supplement."""
from pathlib import Path
from hashlib import sha256
import json

ROOT = Path(__file__).resolve().parents[2]
PLAN = ROOT / 'plan/psi'
report = json.loads((PLAN / 'image-update-validation.json').read_text(encoding='utf-8'))
assert report['summary'] == {'page_checks':10,'image_checks':12,'mermaid_checks':8,'failures':0}
content = json.loads((PLAN / 'content-validation.json').read_text(encoding='utf-8'))
assert not content['broken_links_or_anchors']
items = json.loads((PLAN / 'image-additions.json').read_text(encoding='utf-8'))
for item in items:
    assert sha256((ROOT / 'docs/psi' / item['page']).read_bytes()).hexdigest() == item['body_sha256']
    item['status'] = '已驗收'
    item['validation_report'] = 'plan/psi/image-update-validation.json'
    item['visual_review'] = '主編核對照片內容與剖面關係；瀏覽器確認桌機／手機解碼、尺寸及無頁面溢出'
(PLAN / 'image-additions.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
path = PLAN / 'image-manifest.json'
manifest = json.loads(path.read_text(encoding='utf-8'))
manifest['image_type'] = 'original Mermaid, teaching tables, local SVG and remote Wikimedia Commons photos'
manifest['external_images'] = [i for i in items if i['src'].startswith('https://')]
manifest['supplemental_images'] = items
for page in manifest['pages']:
    assert sha256((ROOT / page['file']).read_bytes()).hexdigest() == page['body_sha256']
    for d in page['diagrams']:
        if Path(page['file']).name in {i['page'] for i in items}:
            d['validation_report'] = 'plan/psi/image-update-validation.json'
            d['render_result'] = 'PASS: 1440x1000 and 390x844; visible SVG, no error nodes, labels >=12px after image additions'
        else:
            d['validation_report'] = 'plan/psi/browser-validation.json'
            d['render_result'] = 'PASS: unchanged diagram; prior desktop/mobile acceptance retained'
path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
path = PLAN / 'psi-image-tasks.md'
text = path.read_text(encoding='utf-8').replace('查核中','已驗收').replace('待渲染驗收','已驗收')
text += '\n補充 photo-02-bench：第 02 章功能表後加入 Danchip 濕式蝕刻工作台，區分設備環境與完整再生流程；Commons 遠端縮圖、640 px 顯示，已驗收。其作者、授權、來源與正文版本一併記於 image-additions.json。\n'
text += '\n六張圖均完成實際解碼與桌機／手機檢查。原有受影響的四張 Mermaid 也通過重驗。主編已目視四張照片及兩張 SVG 的手機渲染，未將照片用於推定公司營運事實。\n'
path.write_text(text,encoding='utf-8')
summary = '''# PSI 補圖驗收

日期：2026-09-14。採用使用者指定 mkdocs-update 流程；Luna max 協助 Commons 素材查核及縮圖整理，主編完成圖稿、整合與驗收。

- 第 01 章：圖案晶圓照片，對照晶圓與晶粒。
- 第 02 章：濕式蝕刻工作台、FOSB 晶圓運輸盒照片，補足加工設備與交付邊界。
- 第 03 章：NASA 鏡面晶圓照片，以及厚度差／整片彎曲原創 SVG。
- 第 06 章：一般薄化／TAIKO 原創剖面 SVG。
- 圖表出處：六筆來源方式、作者、File 頁或原理來源、實際授權與修改資訊；其他章節及公司數據未改動。

## 已通過

`bash ./sync-assets.sh`、`uv run mkdocs build --strict -f configs/psi.yml` 成功。
`validate_content.py`：16 頁、909 個本地連結與資源，零失效；11 張既有 Mermaid 保留。
`validate_image_update.py`：5 個受影響頁面 × 桌機 1440×1000／手機 390×844，共 10 次頁面檢查；12 次圖片解碼及 8 次 Mermaid 渲染檢查，零失敗，無頁面水平溢出，回書庫連結存在。
新增 SVG 的手機顯示寬度為 358 px，文字約 15.9 px；主編目視確認文字與幾何關係可辨識。

四张照片均經主編目視核對；六張圖片都有繁中 alt、圖說及可導向署名的連結。照片依 Commons 各檔案頁確認授權，不以全站授權代替；兩張 SVG 依原理自行繪製，未重製原廠圖像。已更新正文 SHA-256 及受影響 Mermaid 的來源行號與驗收依據。

原始結果：`image-update-validation.json`；截圖：`data/psi/validation/image-update/`；候選來源：`wiki-image-candidates.md`。舊 `browser-validation.json` 是補圖前的全書驗收，本輪只重驗受影響頁面。

## 資源方式

四張照片使用 Commons／Wikimedia 遠端網址，其中三張為 Special:FilePath 動態縮圖；兩張 SVG 隨書本地發布。遠端照片需要網路，暫存於 data 的查核圖片不作離線備援。原有共享字型備援與 Mermaid CDN 方式沿用。
'''.replace('四张','四張')
(PLAN / 'image-update-validation.md').write_text(summary,encoding='utf-8')
path = PLAN / 'validation.md'
text = path.read_text(encoding='utf-8')
notice = '> 本文件保留初次建書驗收；其後已補入 4 張 Commons 照片與 2 張原創 SVG。最新補圖結果見 [補圖驗收](image-update-validation.md)，最新正文版本見 image-manifest.json。\n\n'
if notice not in text:
    text = text.replace('# PSI 書籍最終驗收\n\n','# PSI 書籍最終驗收\n\n'+notice)
path.write_text(text,encoding='utf-8')
print('Six images accepted; current body hashes verified.')
