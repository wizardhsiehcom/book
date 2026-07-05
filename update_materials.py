import glob
import re
import os

mappings = {
    "01": {"slides": "01_Introduction.pdf", "textbook": "Chapter 1"},
    "02": {"slides": "02_Convex sets.pdf", "textbook": "Chapter 2"},
    "03": {"slides": "03_Convex functions.pdf (及部分 Convex sets)", "textbook": "Chapter 2, Chapter 3"},
    "04": {"slides": "03_Convex functions.pdf", "textbook": "Chapter 3"},
    "05": {"slides": "04_Convex optimization problems.pdf", "textbook": "Chapter 3, Chapter 4"},
    "06": {"slides": "04_Convex optimization problems.pdf", "textbook": "Chapter 4"},
    "07": {"slides": "04_Convex optimization problems.pdf, 05_Duality.pdf", "textbook": "Chapter 4, Chapter 5"},
    "08": {"slides": "05_Duality.pdf", "textbook": "Chapter 5"},
    "09": {"slides": "05_Duality.pdf, 06_Approximation and fitting.pdf", "textbook": "Chapter 5, Chapter 6"},
    "10": {"slides": "07_Statistical estimation.pdf", "textbook": "Chapter 7"},
    "11": {"slides": "08_Geometric problems.pdf", "textbook": "Chapter 8"},
    "12": {"slides": "08_Geometric problems.pdf, 09_Numerical linear algebra background.pdf", "textbook": "Chapter 8, Appendix C"},
    "13": {"slides": "09_Numerical linear algebra background.pdf, 10_Unconstrained minimization.pdf", "textbook": "Appendix C, Chapter 9"},
    "14": {"slides": "10_Unconstrained minimization.pdf", "textbook": "Chapter 9"},
    "15": {"slides": "11_Equality constrained minimization.pdf", "textbook": "Chapter 10"},
    "16": {"slides": "12_Interior-point methods.pdf", "textbook": "Chapter 11"},
    "17": {"slides": "12_Interior-point methods.pdf, 13_Conclusions.pdf", "textbook": "Chapter 11"},
    "18": {"slides": "13_Conclusions.pdf", "textbook": "Chapter 6 (L1 norm heuristic) / Conclusions"}
}

for i in range(1, 19):
    idx = f"{i:02d}"
    files = glob.glob(f"docs/ee364a-convex-optimization/{idx}-*.md")
    if not files:
        continue
    filepath = files[0]
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace slides mapping
    content = re.sub(r'對應 slides（[^）]+）：.*', f'對應 slides（`data/EE364A/course material/slids/`）：`{mappings[idx]["slides"]}`', content)
    
    # Replace textbook mapping
    content = re.sub(r'對應教科書章節／頁碼（[^）]+）：.*', f'對應教科書章節／頁碼（`Convex Optimization` PDF）：{mappings[idx]["textbook"]}', content)
    
    # Also update "材料狀態"
    content = re.sub(r'材料狀態：.*', '材料狀態：已核對（基於課程順序與大綱對應）', content)

    with open(filepath, 'w') as f:
        f.write(content)

print("Updated 18 lecture markdown files.")
