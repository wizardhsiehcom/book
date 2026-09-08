#!/usr/bin/env python3
"""Synthetic timing-statistics check (not hardware measurement)."""

from __future__ import annotations

import math
from typing import Iterable, Sequence


def nearest_rank(values: Iterable[float], p: float) -> float:
    """Nearest-rank percentile: sorted[ceil(n * p / 100) - 1].

    Accepts a finite, nonempty sequence of nonnegative values and 0 < p <= 100.
    """
    if not (0.0 < p <= 100.0) or not math.isfinite(p):
        raise ValueError("p must be finite and satisfy 0 < p <= 100")
    data: Sequence[float] = list(values)
    if not data:
        raise ValueError("values must be nonempty")
    cleaned: list[float] = []
    for v in data:
        if not math.isfinite(v):
            raise ValueError("values must be finite")
        if v < 0.0:
            raise ValueError("values must be nonnegative")
        cleaned.append(float(v))
    n = len(cleaned)
    cleaned.sort()
    rank = math.ceil(n * p / 100.0)
    return cleaned[rank - 1]


def _self_check() -> None:
    singleton = [42.0]
    assert nearest_rank(singleton, 50) == 42.0
    assert nearest_rank(singleton, 95) == 42.0

    unordered = [9.0, 1.0, 5.0, 3.0, 7.0]
    ordered = sorted(unordered)
    n = len(unordered)
    assert nearest_rank(unordered, 50) == ordered[math.ceil(n * 50 / 100.0) - 1]
    assert nearest_rank(unordered, 95) == ordered[math.ceil(n * 95 / 100.0) - 1]

    try:
        nearest_rank([], 50)
        raise AssertionError("empty should be invalid")
    except ValueError:
        pass

    try:
        nearest_rank([1.0, float("nan")], 50)
        raise AssertionError("NaN should be invalid")
    except ValueError:
        pass

    try:
        nearest_rank([1.0, -0.1], 50)
        raise AssertionError("negative should be invalid")
    except ValueError:
        pass

    try:
        nearest_rank([1.0], 0)
        raise AssertionError("p=0 should be invalid")
    except ValueError:
        pass


if __name__ == "__main__":
    _self_check()
    print("self-check passed")
