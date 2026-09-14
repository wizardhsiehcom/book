"""Apply publication integration corrections; run from repository root."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
docs = root / 'docs/psi'

def replace_once(file, old, new):
    path = docs / file
    text = path.read_text(encoding='utf-8')
    if new in text:
        return
    assert old in text, (file, old)
    path.write_text(text.replace(old, new), encoding='utf-8')

replace_once('appendix-sources.md',
    '沒有業務別資料，不能用總公司結果倒推單項產品毛利。',
    '''沒有業務別資料，不能用總公司結果倒推單項產品毛利。

本次另讀 [TWSE 綜合損益 OpenAPI](https://openapi.twse.com.tw/v1/opendata/t187ap06_L_ci)、[資產負債 OpenAPI](https://openapi.twse.com.tw/v1/opendata/t187ap07_L_ci)及 [8028 公司資料 PDF](https://wwwc.twse.com.tw/pdf/ch/8028_ch.pdf)。以年度 115、季別 2、公司代號 8028 定位；損益為 2026-01-01 至 2026-06-30 累計，資產負債為期末存量。官方資料出表日 2026-09-14，這不是會計期間終日。官網財報索引當日仍只列到 Q1，因此未以該索引代替完整時效查核。

### N1 設備取得公告鏡錄 {#n1}

[MoneyDJ 公司公告鏡錄](https://www.moneydj.com/KMDJ/news/newsviewer.aspx?a=225ccd97-7f47-49ab-864e-06c876e264f1)，公告 2025-08-05，事實期間 2024-10-04 至 2025-08-05。內容為機器設備一批、5.51 億元、對手均豪，公告列非關係人。原始申報機關為 MOPS；本次直讀受安全驗證阻擋，故不稱為已讀原件。第 10 章據鏡錄做有界判讀，設備型號、安裝與客戶認證仍未知。''')

replace_once('07-advanced-materials.md',
    '昇陽的 2026 年第二季法說簡報設有先進材料段落；',
    '''昇陽的 2026 年第二季法說簡報印刷頁 23–24，具體列出 **Si Dummy Die／Si Dummy Filler、SiC Carrier／散熱，以及 Al₂O₃ 陶瓷基座／翹曲控制**。這三項分別對應填充、熱管理和結構變形問題；年報印刷頁 63、95 另將 12 吋 Si／SiC carrier 列為開發方向。材料頁的背景物性不是公司交付實測，方案圖中的位置也不能當作具名客戶採用證據。

''')

replace_once('08-capacity-and-cashflow.md',
    '新廠與 ESG 主張也需不同證據。',
    '''I1 印刷頁 27 的 2026Q1 欄，可作時間差的具體閱讀例：營業現金流列 263 百萬元，資本支出現金流出列 669 百萬元，自由現金流量列 -406 百萬元；依該表口徑，263−669=-406。這是第一季公司摘要，不是最新上半年現金流，也不能由此推算個別廠的投資回報。表中其他期別存在符號／四捨五入差異，未使用它們自行外推。

新廠與 ESG 主張也需不同證據。''')

for path in docs.glob('*.md'):
    text = path.read_text(encoding='utf-8').replace('当日', '當日')
    # These targets belong to sibling built sites, outside this docs_dir.
    text = re.sub(r'\[([^\]]+)\]\((\.\./\.\./(?:gpm|sigurd)/html/[^)]+)\)',
                  r'<a href="\2">\1</a>', text)
    path.write_text(text, encoding='utf-8')
print('Publication corrections applied.')
