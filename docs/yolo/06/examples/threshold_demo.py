"""threshold_demo.py

合成資料、單類別、非 crowd、貪婪一對一匹配。
示範：IoU → TP/FP/FN、掃 cutoff 的框級成本。

CPU 合成資料的 assert 已於 2026-09-08 核對通過。不是完整 COCO 評估（無 IoU .50:.05:.95 平均、無 101 recall 點、
無 maxDets 1/10/100、無 ignore/crowd/area 協定）。無下載、無 GPU、無訓練實測。
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Box:
    x1: float
    y1: float
    x2: float
    y2: float
    score: float = 1.0  # GT 可忽略分數


def iou(a: Box, b: Box) -> float:
    ix1 = max(a.x1, b.x1)
    iy1 = max(a.y1, b.y1)
    ix2 = min(a.x2, b.x2)
    iy2 = min(a.y2, b.y2)
    inter = max(0.0, ix2 - ix1) * max(0.0, iy2 - iy1)
    area_a = max(0.0, a.x2 - a.x1) * max(0.0, a.y2 - a.y1)
    area_b = max(0.0, b.x2 - b.x1) * max(0.0, b.y2 - b.y1)
    union = area_a + area_b - inter
    if union <= 0.0:
        return 0.0
    return inter / union


def greedy_match(gts: list[Box], dets: list[Box], iou_thr: float) -> tuple[int, int, int]:
    """每個 GT 最多一個 det，每個 det 最多一個 GT。
    依 det 分數由高到低掃；在尚未配對且 IoU>=thr 的 GT 中取最大 IoU。
    """
    used_gt: set[int] = set()
    tp = 0
    fp = 0
    for det in sorted(dets, key=lambda d: d.score, reverse=True):
        best_j = -1
        best_iou = iou_thr
        for j, gt in enumerate(gts):
            if j in used_gt:
                continue
            v = iou(det, gt)
            if v >= best_iou:
                best_iou = v
                best_j = j
        if best_j >= 0:
            used_gt.add(best_j)
            tp += 1
        else:
            fp += 1
    fn = len(gts) - tp
    return tp, fp, fn


def box_level_cost(fp: int, fn: int, c_fp: float = 2.0, c_fn: float = 30.0) -> float:
    """合成範例的每框成本。事件成本必須先聚合並匹配事件後另計。"""
    return c_fp * fp + c_fn * fn


def synthetic_scene() -> tuple[list[Box], list[Box]]:
    # 10 個互不重疊 GT；第 10 個（x=180）刻意不放對應 det → 永遠 FN 候補
    gts = [Box(i * 20.0, 0.0, i * 20.0 + 10.0, 10.0) for i in range(10)]
    dets = [
        Box(0.0, 0.0, 10.0, 10.0, 0.95),
        Box(20.0, 0.0, 30.0, 10.0, 0.88),
        Box(40.0, 0.0, 50.0, 10.0, 0.84),
        Box(60.0, 0.5, 70.0, 10.5, 0.81),
        Box(80.0, 0.0, 90.0, 10.0, 0.70),
        Box(100.0, 0.0, 110.0, 10.0, 0.62),
        Box(120.0, 1.0, 130.0, 11.0, 0.55),
        Box(140.0, 0.0, 150.0, 10.0, 0.40),
        Box(160.0, 0.0, 170.0, 10.0, 0.28),
        Box(3.0, 30.0, 13.0, 40.0, 0.66),  # FP
        Box(25.0, 30.0, 35.0, 40.0, 0.45),  # FP
        Box(45.0, 30.0, 55.0, 40.0, 0.38),  # FP
        Box(65.0, 30.0, 75.0, 40.0, 0.30),  # FP
        Box(200.0, 0.0, 210.0, 10.0, 0.22),  # FP
    ]
    return gts, dets


def sweep(
    gts: list[Box],
    dets: list[Box],
    cutoffs: list[float],
    iou_thr: float = 0.5,
) -> list[tuple[float, int, int, int, float]]:
    rows: list[tuple[float, int, int, int, float]] = []
    for c in cutoffs:
        kept = [d for d in dets if d.score >= c]
        tp, fp, fn = greedy_match(gts, kept, iou_thr)
        rows.append((c, tp, fp, fn, box_level_cost(fp, fn)))
    return rows


def _self_check() -> None:
    a = Box(0.0, 0.0, 10.0, 10.0)
    assert abs(iou(a, Box(0.0, 0.0, 10.0, 10.0)) - 1.0) < 1e-9
    assert iou(a, Box(10.0, 0.0, 20.0, 10.0)) == 0.0
    assert abs(iou(a, Box(5.0, 0.0, 15.0, 10.0)) - (1.0 / 3.0)) < 1e-9

    gts, dets = synthetic_scene()
    tp_all, fp_all, fn_all = greedy_match(gts, dets, 0.5)
    assert tp_all + fn_all == len(gts)
    assert tp_all + fp_all == len(dets)
    assert (tp_all, fp_all, fn_all) == (9, 5, 1)

    expected = {
        0.20: (9, 5, 1, 40.0),
        0.50: (7, 1, 3, 92.0),
        0.80: (4, 0, 6, 180.0),
    }
    for cutoff, tp, fp, fn, cost in sweep(gts, dets, [0.20, 0.50, 0.80]):
        exp_tp, exp_fp, exp_fn, exp_cost = expected[cutoff]
        assert (tp, fp, fn) == (exp_tp, exp_fp, exp_fn)
        assert abs(cost - exp_cost) < 1e-9
        assert tp + fn == len(gts)


if __name__ == "__main__":
    _self_check()
    gts, dets = synthetic_scene()
    print("cutoff tp fp fn cost  # 框級示意，非每小時事件；未執行於真實資料")
    for row in sweep(gts, dets, [0.20, 0.50, 0.80]):
        print(row)
