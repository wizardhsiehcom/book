from pathlib import Path
import re

docs = Path(__file__).resolve().parents[2] / 'docs/psi'
diagrams = {
    '01-wafer-roles.md': '''flowchart TD
    W["辨識一片晶圓"] --> U["先記用途<br/>產品、監控測試或擋片"]
    U --> H["再記加工歷史<br/>新片或再生片"]
    H --> X["加上此次允收條件<br/>才是完整工件身分"]''',
    '07-advanced-materials.md': '''flowchart TD
    H["散熱端"] --- I["接觸與界面材料"]
    I --- D["發熱元件與周邊結構<br/>可有依設計配置的填充工件"]
    D --- B["基板或其他支承結構"]
    B -.->|"製程期間的支撐關係"| C["製程載具<br/>可能在加工後移除"]''',
}
for name, diagram in diagrams.items():
    path = docs / name
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'```mermaid\n.*?```', lambda _: '```mermaid\n' + diagram + '\n```', text, count=1, flags=re.S)
    text = text.replace('兩個分類軸。匯入同一框表示要一起記錄，不表示所有用途與歷史組合都可行。',
                        '兩個分類軸的記錄順序，不是加工流程；用途與歷史要一起記錄，不表示所有組合都可行。')
    path.write_text(text, encoding='utf-8')
print('Two mobile diagrams simplified without changing their concepts.')
