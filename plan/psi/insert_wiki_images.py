from add_images import insert, ROOT
import json

items = [
    dict(id='photo-01', page='01-wafer-roles.md', anchor='## 工件分類有兩個軸',
         src='https://commons.wikimedia.org/wiki/Special:FilePath/Wafer_with_multiple_Microprocessor_dies_on_it.jpg?width=1280',
         title='Wafer with multiple Microprocessor dies on it.jpg', author='Dualmodem Bytton',
         source='https://commons.wikimedia.org/wiki/File:Wafer_with_multiple_Microprocessor_dies_on_it.jpg',
         license='CC BY-SA 2.0', license_url='https://creativecommons.org/licenses/by-sa/2.0/',
         changes='使用 Commons 1280 px 縮圖；未裁切或改色', width=500,
         alt='未切割的矽晶圓上排列大量重複的微處理器晶粒區塊',
         caption='照片 01-A：整片圓形工件是晶圓，重複的小區塊是尚未切割分離的晶粒。照片可幫助辨認兩者，卻不能從外觀判定一片晶圓此次是產品片、監控片或再生片；此圖不是昇陽或其客戶產品的證據。'),
    dict(id='photo-02', page='02-reclaim-loop.md', anchor='## 量測與控制：每一輪都會改變可用餘裕',
         src='https://commons.wikimedia.org/wiki/Special:FilePath/Front_opening_shipping_box_%28bottom_side%29.jpg?width=960',
         title='Front opening shipping box (bottom side).jpg', author='Cepheiden',
         source='https://commons.wikimedia.org/wiki/File:Front_opening_shipping_box_(bottom_side).jpg',
         license='CC BY-SA 3.0', license_url='https://creativecommons.org/licenses/by-sa/3.0/',
         changes='使用 Commons 縮圖；未裁切或改色', width=420,
         alt='前開式晶圓運輸盒中的槽位分隔並承載多片晶圓',
         caption='照片 02-A：前開式運輸盒（FOSB）將晶圓分隔在槽位中。交付還要考慮包裝與搬運能否維持加工後狀態；照片本身不能證明盒內潔淨度，也不代表昇陽使用的載具。'),
    dict(id='photo-02-bench', page='02-reclaim-loop.md', anchor='設備原廠對去膜、清洗與殘留移除的功能說明',
         src='https://commons.wikimedia.org/wiki/Special:FilePath/WetEtchBench.jpg?width=960',
         title='WetEtchBench.jpg', author='Kristian Mølhave',
         source='https://commons.wikimedia.org/wiki/File:WetEtchBench.jpg',
         license='CC BY 2.5', license_url='https://creativecommons.org/licenses/by/2.5/',
         changes='使用 Commons 縮圖；未裁切或改色', width=640,
         alt='Danchip 潔淨室的濕式蝕刻工作台及晶圓載具',
         caption='照片 02-B：Danchip 潔淨室的濕式蝕刻工作台，讓「去除膜層」對應到實際設備環境。它不是完整再生產線；不同膜種與來料仍須選擇相容程序，不能照照片推定配方或昇陽設備。')
]
path = ROOT / 'plan/psi/image-additions.json'
all_items = json.loads(path.read_text(encoding='utf-8'))
for item in items:
    insert(item)
    if not any(existing['id'] == item['id'] for existing in all_items):
        all_items.append(item)
path.write_text(json.dumps(all_items, ensure_ascii=False, indent=2), encoding='utf-8')
print('Inserted Commons images.')
