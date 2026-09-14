from pathlib import Path
import re

path = Path(__file__).resolve().parents[2] / 'docs/psi/06-thinning-services.md'
text = path.read_text(encoding='utf-8')
diagram = '''```mermaid
flowchart TD
    R1["再生監控片<br/>使用後薄膜與表面變化"] --- R2["矽基材<br/>保留足夠厚度供回用"]
    R2 -.->|"對照另一種工件；非加工順序"| T1["元件晶圓背面<br/>移除材料或後續加工"]
    T1 --- T2["矽基材<br/>達成目標厚度"]
    T2 --- T3["正面元件<br/>保護既有功能"]
    T3 --- T4["依流程使用保護膠帶<br/>或暫時支撐"]
```'''
text = re.sub(r'```mermaid\n.*?```', lambda _: diagram, text, count=1, flags=re.S)
text = text.replace('圖 06-1：工件各層的責任示意，非比例剖面；', '圖 06-1：工件各層的責任示意，非比例剖面；虛線分開两種工件的比較，不是把再生片變成元件片；').replace('分開两種', '分開兩種')
path.write_text(text, encoding='utf-8')
