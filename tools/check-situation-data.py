"""Check a situation-analysis data dir: uv run python tools/check-situation-data.py plan/<name>"""
import sys

import yaml

d = sys.argv[1]
cases = {x["id"]: x for x in yaml.safe_load(open(f"{d}/cases.yml"))["cases"]}
m = yaml.safe_load(open(f"{d}/mechanisms.yml"))
refs = [r["case"] for mm in m["mechanisms"] for k in ("supports", "challenges") for r in mm[k]]
refs += [i for t in m.get("tests", []) for i in t["inputs"]]

missing = sorted(set(refs) - set(cases))
no_challenge = [mm["id"] for mm in m["mechanisms"] if not mm["challenges"]]
print("missing:", missing)
print("unused:", sorted(set(cases) - set(refs)))
print("no challenges:", no_challenge)
print("tests:", {t["id"]: t["status"] for t in m.get("tests", [])})
print("status:", {s: sum(c["evidence_status"] == s for c in cases.values()) for s in ("verified", "partial", "unverified")})
sys.exit(1 if missing else 0)
