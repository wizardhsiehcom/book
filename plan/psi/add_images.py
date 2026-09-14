"""Insert the reviewed PSI image additions; preserve the book's existing content."""
from pathlib import Path
import json
from hashlib import sha256

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/psi'

items = [
    dict(id='photo-03', page='03-quality-and-qualification.md', anchor='## 結構：厚度均勻與整片彎曲是不同問題',
         src='https://upload.wikimedia.org/wikipedia/commons/5/5d/Silicon_wafer_with_mirror_finish.jpg',
         title='Silicon wafer with mirror finish.jpg', author='NASA Glenn Research Center',
         source='https://commons.wikimedia.org/wiki/File:Silicon_wafer_with_mirror_finish.jpg',
         license='Public domain（美國，PD-USGov-NASA）', license_url='https://commons.wikimedia.org/wiki/Template:PD-USGov-NASA',
         changes='使用 Commons 現行版本（原站已裁去原圖說）；本書未再裁切或改色', width=305,
         alt='鏡面矽晶圓反射上方物體，旁邊有公分刻度',
         caption='照片 03-A：鏡面反射能幫助觀察外觀，但照片無法提供 TTV、金屬殘留或顆粒檢出限；看起來明亮不能代替允收報告。此為 NASA 圖片，並非昇陽產品。'),
    dict(id='svg-03', page='03-quality-and-qualification.md', anchor='| 指標 | 要回答的問題 | 不能混成什麼 |',
         src='images/thickness-vs-shape.svg', title='厚度差與整片彎曲', author='本書編寫者',
         source='https://www.kobelcokaken.co.jp/leo/en/item/sbw/', license='原創教學 SVG，未重製來源圖像', license_url='',
         changes='依量測概念自行繪製', width=360,
         alt='上方剖面厚薄不均，下方薄片整體彎曲但厚度近似一致',
         caption='圖 03-B：兩面間距與整片形貌是兩種資訊。下圖只表示彎曲概念，沒有畫出 bow／warp 的參考面、支撐及邊緣排除條件，不能據此讀取量測值。'),
    dict(id='svg-06', page='06-thinning-services.md', anchor='```mermaid\nflowchart TD\n    A["正面已有元件的進料"]',
         src='images/thinning-cross-sections.svg', title='一般薄化與 TAIKO 剖面比較', author='本書編寫者',
         source='https://www.disco.co.jp/eg/solution/library/grinder/taiko_process.html', license='原創教學 SVG，未重製來源圖像', license_url='',
         changes='依文字所述幾何原理自行繪製', width=360,
         alt='一般薄化整體變薄；TAIKO 內側薄化並保留外周厚環，正面元件側位於下方',
         caption='圖 06-C：A、B 是兩種加工結果的比較，並非先做 A 再做 B。TAIKO 兩端較厚的部分是同一外環在剖面上的交點；外環寬度與厚度未按比例，保護／暫時支撐和後續去環步驟亦省略。TAIKO 為 DISCO 註冊商標。')
]

def insert(item):
    path = DOCS / item['page']
    text = path.read_text(encoding='utf-8')
    if f'id="{item["id"]}"' in text:
        return
    assert item['anchor'] in text, item['id']
    credit = f'99-image-credits.md#{item["id"]}'
    # Markdown images and captions remain readable even if the remote host is unavailable.
    block = (f'<span id="{item["id"]}"></span>\n\n'
             f'![{item["alt"]}]({item["src"]}){{ width="{item["width"]}" }}\n\n'
             f'*{item["caption"]}* [來源與署名]({credit})\n\n')
    path.write_text(text.replace(item['anchor'], block + item['anchor'], 1), encoding='utf-8')

if __name__ == '__main__':
    for item in items:
        insert(item)
    (ROOT / 'plan/psi/image-additions.json').write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Inserted initial reviewed images.')
