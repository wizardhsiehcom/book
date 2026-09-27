"""Run with Python 3.10+. Checks remain active under -O."""
def check(condition, reason):
    if not condition:
        raise RuntimeError(reason)

original = [{"id": 1, "judge": -1}]
outer_copy = list(original)
outer_copy[0]["judge"] = 2
check(original[0]["judge"] == 2, "nested dict should be shared")
separate_rows = [dict(row) for row in original]
separate_rows[0]["judge"] = 3
check(original[0]["judge"] == 2, "independent dict")
# This copies only each dict: nested mutable values would need a separate policy.
caught = False
try:
    check(False, "deliberate failure")
except RuntimeError:
    caught = True
check(caught, "check mechanism inactive")
print("PASS: shared nested row, copied row, active checks")
