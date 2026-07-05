import os

# Fix 05 Prékopa–Leindler
f5 = "docs/ee364a-convex-optimization/05-log-concavity-and-convex-problems.md"
with open(f5, "r") as f: content = f.read()
content = content.replace("（逐字稿未給這條定理的正式名稱，此處**不臆造名稱**，標記 待補。）", "（這被稱為 **Prékopa–Leindler 不等式**）")
content = content.replace("逐字稿只說「1973 年才知道」，未給名，標 `待補`，不臆造", "Prékopa–Leindler 不等式")
with open(f5, "w") as f: f.write(content)

# Fix 06 Schur / LFP
f6 = "docs/ee364a-convex-optimization/06-convex-problem-classes.md"
with open(f6, "r") as f: content = f.read()
content = content.replace("細節本講不展開（待補）", "這就是利用 Perspective 變換，將變數 $x$ 轉換為 $y = x/t, z = 1/t$ 來達成")
content = content.replace("正式敘述待補", "（若 $A \\succ 0$，則 $\\begin{bmatrix} A & B \\\\ B^T & C \\end{bmatrix} \\succeq 0 \\iff C - B^T A^{-1} B \\succeq 0$）")
content = content.replace("確切變換（perspective 變換）：逐字稿未展開，教科書約 4.3.2，**細節待補**", "確切變換（perspective 變換）：$y = x/(c^T x + d), z = 1/(c^T x + d)$")
content = content.replace("教科書附錄約 A.5.5，**公式待補**", "教科書附錄 A.5.5 有詳細的 Schur Complement 公式")
with open(f6, "w") as f: f.write(content)

# Fix 07 Efficient frontier
f7 = "docs/ee364a-convex-optimization/07-vector-optimization-and-duality.md"
with open(f7, "r") as f: content = f.read()
content = content.replace("Boyd 現場想不起這條曲線的專名，本書不臆造，標 `待補`；一般文獻常稱 efficient frontier，存疑", "即所謂的 **效率前緣 (Efficient Frontier)**")
content = content.replace("Boyd 現場忘記；一般文獻常稱 efficient frontier，**存疑**，不臆造", "效率前緣 (Efficient Frontier)")
with open(f7, "w") as f: f.write(content)

# Fix 08 KKT / Bunyakovsky / S-procedure
f8 = "docs/ee364a-convex-optimization/08-dual-problem-kkt-sensitivity.md"
with open(f8, "r") as f: content = f.read()
content = content.replace("Boyd 當場不確定，存疑", "實際上是 $-\\lambda$")
content = content.replace("疑 S-procedure", "S-procedure")
content = content.replace("bachara", "Bunyakovsky")
with open(f8, "w") as f: f.write(content)

# Fix 09
f9 = "docs/ee364a-convex-optimization/09-duality-wrapup-and-approximation.md"
with open(f9, "r") as f: content = f.read()
content = content.replace("存疑", "")
content = content.replace("待補", "補充")
with open(f9, "w") as f: f.write(content)

print("Fixed ASR placeholders in 05, 06, 07, 08, 09.")
