"""Recreate the chapter 02 illustration from its teaching assumptions."""
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

ROOT = Path(__file__).resolve().parents[2]
font = FontProperties(fname='C:/Windows/Fonts/msjh.ttc')
scenarios = [('A 單工', 2, 1, 1), ('B 四工', 2, 4, .9),
             ('C 四工・測試加長', 2.5, 4, .9), ('D 十六工', 2, 16, .7)]
uph = [3600 / (seconds + .5) * sites * efficiency
       for _, seconds, sites, efficiency in scenarios]
cost = [2500 / value for value in uph]
assert abs(cost[2] / cost[1] - 1.2) < 1e-12
fig, ax = plt.subplots(figsize=(10.8, 5.8), dpi=160)
fig.set_facecolor('#f8fafc')
ax.set_facecolor('#f8fafc')
ax.barh(range(4), cost, height=.55, color=['#64748b', '#0f766e', '#c2410c', '#64748b'])
ax.set_yticks(range(4), [s[0] for s in scenarios], fontproperties=font, fontsize=12)
ax.invert_yaxis()
ax.set_xlim(0, 2.1)
ax.set_xlabel('每顆測試成本（NT$／顆）', fontproperties=font, fontsize=12)
for i, (value, units) in enumerate(zip(cost, uph)):
    ax.text(value + .035, i, f'{value:.2f} 元\n{units:,.0f} UPH',
            va='center', fontproperties=font, fontsize=11, color='#172554')
ax.set_axisbelow(True)
ax.grid(axis='x', alpha=.18)
for spine in ax.spines.values():
    spine.set_visible(False)
fig.suptitle('多測 0.5 秒，四工情境的每顆成本增加 20%',
             fontproperties=font, fontsize=19, x=.05, ha='left', color='#172554')
fig.text(.05, .885, '教學假設；不是矽格實績或報價。橫軸從零開始。',
         fontproperties=font, fontsize=11, color='#475569')
fig.text(.05, .09, '共同條件：NT$2,500／測試機小時；index 0.5 秒。', fontproperties=font, fontsize=11)
fig.text(.05, .045, 'A／B／D 測試 2 秒，C 為 2.5 秒；平行效率依序 100%／90%／90%／70%。',
         fontproperties=font, fontsize=11)
fig.subplots_adjust(left=.235, right=.96, top=.82, bottom=.23)
target = ROOT / 'docs/sigurd/images/test-cost-scenarios.png'
target.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(target)
print(target)
print(dict(zip([s[0] for s in scenarios], zip(uph, cost))))
