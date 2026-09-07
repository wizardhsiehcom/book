#!/usr/bin/env python3
import argparse
import json
import math
import sys

KEYS = ("class_id", "box", "score")


def die_arg(msg):
    raise argparse.ArgumentTypeError(msg)


def is_num(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool) and math.isfinite(float(x))


def validate_det(obj, path):
    if not isinstance(obj, dict):
        die_arg("%s: each entry must be an object" % path)
    extra = set(obj) - set(KEYS)
    missing = set(KEYS) - set(obj)
    if extra or missing:
        die_arg("%s: required keys %s" % (path, ", ".join(KEYS)))
    cid = obj["class_id"]
    if isinstance(cid, bool) or not isinstance(cid, int) or cid < 0:
        die_arg("%s.class_id must be int >= 0 (bool not allowed)" % path)
    box = obj["box"]
    if not isinstance(box, list) or len(box) != 4:
        die_arg("%s.box must be [x1, y1, x2, y2]" % path)
    for i, v in enumerate(box):
        if not is_num(v):
            die_arg("%s.box[%d] must be finite number" % (path, i))
    x1, y1, x2, y2 = (float(v) for v in box)
    if not (x2 > x1 and y2 > y1):
        die_arg("%s.box must have positive area (x2>x1 and y2>y1)" % path)
    sc = obj["score"]
    if not is_num(sc):
        die_arg("%s.score must be finite number in [0, 1]" % path)
    sc = float(sc)
    if sc < 0.0 or sc > 1.0:
        die_arg("%s.score must be in [0, 1]" % path)
    return {
        "class_id": cid,
        "box": [x1, y1, x2, y2],
        "score": sc,
        "index": None,
    }


def load_dets(path, label):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except OSError as e:
        die_arg("cannot read %s %s: %s" % (label, path, e))
    except json.JSONDecodeError as e:
        die_arg("invalid JSON in %s %s: %s" % (label, path, e))
    if not isinstance(data, list):
        die_arg("%s must be a top-level JSON list" % label)
    out = []
    for i, item in enumerate(data):
        det = validate_det(item, "%s[%d]" % (label, i))
        det["index"] = i
        out.append(det)
    return out


def iou(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1 = max(ax1, bx1)
    iy1 = max(ay1, by1)
    ix2 = min(ax2, bx2)
    iy2 = min(ay2, by2)
    iw = ix2 - ix1
    ih = iy2 - iy1
    if iw <= 0.0 or ih <= 0.0:
        return 0.0
    inter = iw * ih
    area_a = (ax2 - ax1) * (ay2 - ay1)
    area_b = (bx2 - bx1) * (by2 - by1)
    union = area_a + area_b - inter
    if union <= 0.0:
        return 0.0
    return inter / union


def match(refs, cands, iou_thr):
    pairs = []
    for i, r in enumerate(refs):
        for j, c in enumerate(cands):
            if r["class_id"] != c["class_id"]:
                continue
            v = iou(r["box"], c["box"])
            if v >= iou_thr:
                pairs.append((v, i, j))
    pairs.sort(key=lambda t: (-t[0], t[1], t[2]))
    used_r = set()
    used_c = set()
    matched = []
    for v, i, j in pairs:
        if i in used_r or j in used_c:
            continue
        used_r.add(i)
        used_c.add(j)
        r, c = refs[i], cands[j]
        matched.append({
            "ref_index": r["index"],
            "cand_index": c["index"],
            "class_id": r["class_id"],
            "iou": v,
            "ref_score": r["score"],
            "cand_score": c["score"],
            "score_abs_diff": abs(r["score"] - c["score"]),
            "ref_box": r["box"],
            "cand_box": c["box"],
        })
    unmatched_ref = [public(refs[i]) for i in range(len(refs)) if i not in used_r]
    unmatched_cand = [public(cands[j]) for j in range(len(cands)) if j not in used_c]
    return matched, unmatched_ref, unmatched_cand


def public(d):
    return {
        "index": d["index"],
        "class_id": d["class_id"],
        "box": d["box"],
        "score": d["score"],
    }


def report(refs, cands, iou_thr, score_tol):
    matched, uref, ucand = match(refs, cands, iou_thr)
    drift = [m for m in matched if m["score_abs_diff"] > score_tol]
    ok = (not uref) and (not ucand) and (not drift)
    return {
        "ok": ok,
        "kind": "diagnostic",
        "iou_threshold": iou_thr,
        "score_tol": score_tol,
        "n_ref": len(refs),
        "n_cand": len(cands),
        "matched": matched,
        "unmatched_ref": uref,
        "unmatched_cand": ucand,
        "score_drift": drift,
    }


def parse_args(argv):
    p = argparse.ArgumentParser(
        description="Diagnostic one-to-one same-class IoU matching of detection lists (not AP)."
    )
    p.add_argument("ref", nargs="?", help="reference detections JSON list")
    p.add_argument("cand", nargs="?", help="candidate detections JSON list")
    p.add_argument("--iou", type=float, default=0.9, help="IoU match threshold (default 0.9)")
    p.add_argument("--score-tol", type=float, default=0.02, dest="score_tol",
                   help="abs score difference tolerated as match (default 0.02)")
    p.add_argument("--self-check", action="store_true", help="run stdlib assertions and exit")
    return p.parse_args(argv)


def det(cid, box, score):
    return {"class_id": cid, "box": list(box), "score": score}


def run_self_check():
    def tagged(items):
        out = []
        for i, x in enumerate(items):
            d = validate_det(x, "self[%d]" % i)
            d["index"] = i
            out.append(d)
        return out

    a = det(0, [0, 0, 10, 10], 0.9)
    b = det(0, [1, 1, 11, 11], 0.91)
    c = det(1, [0, 0, 10, 10], 0.8)
    d = det(0, [100, 100, 110, 110], 0.7)

    r1 = tagged([a, c])
    c1 = tagged([c, a])
    rep = report(r1, c1, 0.9, 0.02)
    assert rep["ok"]
    assert len(rep["matched"]) == 2
    assert not rep["unmatched_ref"] and not rep["unmatched_cand"] and not rep["score_drift"]

    empty = tagged([])
    rep = report(empty, empty, 0.9, 0.02)
    assert rep["ok"]
    assert rep["n_ref"] == 0 and rep["n_cand"] == 0

    rep = report(tagged([a]), tagged([a, d]), 0.9, 0.02)
    assert not rep["ok"]
    assert len(rep["unmatched_cand"]) == 1
    assert rep["unmatched_cand"][0]["index"] == 1
    assert not rep["unmatched_ref"]

    rep = report(tagged([a, d]), tagged([a]), 0.9, 0.02)
    assert not rep["ok"]
    assert len(rep["unmatched_ref"]) == 1
    assert not rep["unmatched_cand"]

    rep = report(tagged([a]), tagged([c]), 0.9, 0.02)
    assert not rep["ok"]
    assert len(rep["unmatched_ref"]) == 1
    assert len(rep["unmatched_cand"]) == 1
    assert not rep["matched"]

    a_hi = det(0, [0, 0, 10, 10], 0.95)
    rep = report(tagged([a]), tagged([a_hi]), 0.9, 0.02)
    assert not rep["ok"]
    assert len(rep["matched"]) == 1
    assert len(rep["score_drift"]) == 1
    assert rep["score_drift"][0]["score_abs_diff"] > 0.02

    dup_ref = tagged([a])
    dup_cand = tagged([a, det(0, [0, 0, 10, 10], 0.9)])
    rep = report(dup_ref, dup_cand, 0.9, 0.02)
    assert len(rep["matched"]) == 1
    assert len(rep["unmatched_cand"]) == 1
    used = {rep["matched"][0]["cand_index"]}
    assert used == {0} or used == {1}

    bad_cases = [
        {"class_id": True, "box": [0, 0, 1, 1], "score": 0.5},
        {"class_id": -1, "box": [0, 0, 1, 1], "score": 0.5},
        {"class_id": 0, "box": [0, 0, 0, 1], "score": 0.5},
        {"class_id": 0, "box": [0, 0, 1, 1], "score": float("nan")},
        {"class_id": 0, "box": [0, float("nan"), 1, 1], "score": 0.5},
        {"class_id": 0, "box": [0, 0, float("inf"), 1], "score": 0.5},
        {"class_id": 0.0, "box": [0, 0, 1, 1], "score": 0.5},
        {"class_id": 0, "box": [0, 0, 1, 1], "score": 1.1},
        {"class_id": 0, "box": [0, 0, 1, 1], "score": True},
    ]
    for i, case in enumerate(bad_cases):
        try:
            validate_det(case, "bad[%d]" % i)
        except argparse.ArgumentTypeError:
            continue
        raise AssertionError("expected invalid: %r" % (case,))

    return True


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    try:
        args = parse_args(argv)
        if args.self_check:
            run_self_check()
            print(json.dumps({"ok": True, "self_check": True}, indent=2, sort_keys=True))
            return 0
        if args.ref is None or args.cand is None:
            die_arg("ref.json and cand.json are required unless --self-check")
        if not is_num(args.iou) or args.iou < 0.0 or args.iou > 1.0:
            die_arg("--iou must be a finite float in [0, 1]")
        if not is_num(args.score_tol) or args.score_tol < 0.0:
            die_arg("--score-tol must be a finite float >= 0")
        refs = load_dets(args.ref, "ref")
        cands = load_dets(args.cand, "cand")
        rep = report(refs, cands, float(args.iou), float(args.score_tol))
        print(json.dumps(rep, indent=2, sort_keys=True))
        return 0 if rep["ok"] else 1
    except argparse.ArgumentTypeError as e:
        print("error: %s" % e, file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
