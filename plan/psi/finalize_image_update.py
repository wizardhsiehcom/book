"""Refresh credits and source-version tracking for the reviewed image update."""
from pathlib import Path
from hashlib import sha256
import json
import re

ROOT = Path(__file__).resolve().parents[2]
PLAN = ROOT / 'plan/psi'
items = json.loads((PLAN / 'image-additions.json').read_text(encoding='utf-8'))
path = ROOT / 'docs/psi/99-image-credits.md'
text = path.read_text(encoding='utf-8')
text = text.replace('本書圖表由編寫者依來源與教學模型自行整理，沒有重製外部照片或產品圖。Mermaid 圖是原創教學示意，沒有以其他工廠畫面代表昇陽現場。',
                    '本書保留原創 Mermaid 教學圖與表格，另以 Wikimedia Commons 照片補充實物觀察，並加入原創 SVG 剖面圖。外部照片不是昇陽現場或產品的證據。')
text = text.replace('圖的編寫方式為原創整理，未借用外部圖檔，因此沒有外部圖像授權或修改署名事項。',
                    '既有流程圖與表格為原創整理；本次補入照片及 SVG 的來源、授權與修改情況分列如下。')
text = text.split('\n## 補充圖片與剖面圖')[0]
text += '\n## 補充圖片與剖面圖\n\n外部照片透過 Wikimedia 的圖片網址載入，點選原始檔案頁可查看原圖與授權；照片未用來推定公司設備、製程參數或客戶認證。\n'
for item in items:
    text += f'\n### {item["id"]}：{item["title"]} {{ #{item["id"]} }}\n\n'
    text += f'- 使用位置：[{item["page"][:2]} 章]({item["page"]}#{item["id"]})。\n'
    text += f'- 作者／來源方式：{item["author"]}。\n'
    text += f'- 原始檔案頁或原理來源：[{item["title"]}]({item["source"]})。\n'
    lic = f'[{item["license"]}]({item["license_url"]})' if item['license_url'] else item['license']
    text += f'- 授權／圖像來源：{lic}。\n- 修改情況：{item["changes"]}。\n'
path.write_text(text, encoding='utf-8')

manifest_path = PLAN / 'image-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
manifest['image_type'] = 'original Mermaid, teaching tables, local SVG and remote Wikimedia Commons photos'
manifest['external_images'] = [i for i in items if i['src'].startswith('https://')]
manifest['supplemental_images'] = items
for page in manifest['pages']:
    body = (ROOT / page['file']).read_bytes()
    page['body_sha256'] = sha256(body).hexdigest()
    for diagram, match in zip(page['diagrams'], re.finditer(r'```mermaid\n(.*?)```', body.decode('utf-8').replace('\r\n','\n'), re.S)):
        diagram['source_line'] = body.decode('utf-8').replace('\r\n','\n')[:match.start()].count('\n') + 1
        if Path(page['file']).name in {i['page'] for i in items}:
            diagram['render_result'] = '待重驗：正文補圖後檢查既有 Mermaid'
            diagram['validation_report'] = 'plan/psi/image-update-validation.json'
for item in items:
    item['body_sha256'] = sha256((ROOT / 'docs/psi' / item['page']).read_bytes()).hexdigest()
    item['status'] = '待渲染驗收'
    if not item['src'].startswith('https://'):
        item['image_sha256'] = sha256((ROOT / 'docs/psi' / item['src']).read_bytes()).hexdigest()
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
(PLAN / 'image-additions.json').write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding='utf-8')
plan_path = PLAN / 'psi-book-plan.md'
plan_text = plan_path.read_text(encoding='utf-8')
if '## 11. 補圖更新' not in plan_text:
    plan_path.write_text(plan_text + '\n## 11. 補圖更新\n\n2026-09-14 依使用者指定 mkdocs-update 工作流補上 Commons 實物照片與原創剖面 SVG；任務與教學規格見 [補圖任務](psi-image-tasks.md)，新驗收另記 image-update-validation.json。\n', encoding='utf-8')
print('Credits and source versions refreshed.')
