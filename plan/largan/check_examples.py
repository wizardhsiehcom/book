"""Recalculate published teaching examples using only the standard library."""
from pathlib import Path
import contextlib
import io
import json
import re

root = Path(__file__).resolve().parents[2]
chapter = (root / 'docs/largan/06-assembly-yield-cost.md').read_text()
snippet = re.search(r'```python\n(.*?)```', chapter, re.S).group(1)
namespace = {}
with contextlib.redirect_stdout(io.StringIO()):
    exec(snippet, namespace)
cost = namespace['cost_per_good']
cases = [({}, 8460, 1662800, 196.55),
         ({'y1': .97}, 8730, 1666400, 190.88),
         ({'y2': .82}, 7708, 1662800, 215.72),
         ({'fixed': 550000}, 8460, 1812800, 214.28)]
for kwargs, good, total, unit in cases:
    actual = cost(**kwargs)
    assert abs(actual[1] - good) < 1e-8
    assert abs(actual[2] - total) < 1e-8
    assert round(actual[3], 2) == unit
# Without rejects, every input incurs each station cost exactly once.
assert cost(y1=1, y2=1)[3] == 85 + 30 + 12 + 400000 / 10000

for price, yield_rate, fixed, expected_cost, expected_margin in [
    (100, .8, 3000000, 52.50, 47.50),
    (110, .8, 3000000, 52.50, 52.27),
    (90, .8, 3000000, 52.50, 41.67),
    (100, .9, 3000000, 46.67, 53.33),
    (100, .7, 3000000, 60, 40),
    (100, .8, 3600000, 55.50, 44.50),
    (100, .8, 2400000, 49.50, 50.50),
]:
    unit = (250000 * 30 + fixed) / (250000 * yield_rate)
    assert round(unit, 2) == expected_cost
    assert round(100 * (price - unit) / price, 2) == expected_margin
assert 100 * (20 - 12) - 500 == 300
assert 100 * (20 - 12) - 900 == -100
assert 150 * (20 - 12) - 900 == 300
result = {'chapter06_cases': 4, 'chapter09_cases': 7,
          'chapter12_cases': 3, 'no_reject_boundary': 'passed'}
(root / 'plan/largan/example-validation.json').write_text(json.dumps(result, indent=2))
print(json.dumps(result))
