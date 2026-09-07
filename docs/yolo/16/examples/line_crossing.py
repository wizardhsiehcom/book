def stable_side(x, line_x, band):
    if x <= line_x - band:
        return "L"
    if x >= line_x + band:
        return "R"
    return None  # hysteresis band; not a stable side


def count_line_events(samples, line_x=100.0, band=5.0):
    """Full-height vertical line x=line_x. samples: (t, track_id, x, y); y ignored."""
    last_stable = {}
    n_lr = 0
    n_rl = 0
    events = []
    for t, tid, x, _y in samples:
        side = stable_side(x, line_x, band)
        if side is None:
            continue
        prev = last_stable.get(tid)
        if prev is None:
            last_stable[tid] = side
            continue
        if side == prev:
            continue
        if prev == "L" and side == "R":
            n_lr += 1
            events.append((t, tid, "L->R"))
        elif prev == "R" and side == "L":
            n_rl += 1
            events.append((t, tid, "R->L"))
        last_stable[tid] = side
    return n_lr, n_rl, events


def test_cross_jitter_reverse():
    line_x, band = 100.0, 5.0

    cross = [
        (0, 1, 80.0, 10.0),
        (1, 1, 90.0, 50.0),
        (2, 1, 94.0, 200.0),
        (3, 1, 98.0, 0.0),
        (4, 1, 102.0, 999.0),
        (5, 1, 110.0, 40.0),
        (6, 1, 120.0, 40.0),
    ]
    n_lr, n_rl, ev = count_line_events(cross, line_x, band)
    assert n_lr == 1 and n_rl == 0
    assert ev == [(5, 1, "L->R")]
    assert len(cross) > n_lr + n_rl

    jitter = [
        (0, 2, 90.0, 1.0),
        (1, 2, 96.0, 1.0),
        (2, 2, 100.0, 1.0),
        (3, 2, 104.0, 1.0),
        (4, 2, 100.0, 1.0),
        (5, 2, 92.0, 1.0),
    ]
    n_lr, n_rl, ev = count_line_events(jitter, line_x, band)
    assert n_lr == 0 and n_rl == 0 and ev == []

    reverse = [
        (0, 3, 80.0, 0.0),
        (1, 3, 120.0, 0.0),
        (2, 3, 120.0, 0.0),
        (3, 3, 80.0, 0.0),
        (4, 3, 80.0, 0.0),
        (5, 3, 120.0, 0.0),
    ]
    n_lr, n_rl, ev = count_line_events(reverse, line_x, band)
    assert n_lr == 2 and n_rl == 1
    assert [e[2] for e in ev] == ["L->R", "R->L", "L->R"]

    reset = [
        (0, 10, 80.0, 0.0),
        (1, 10, 120.0, 0.0),
        (2, 11, 120.0, 0.0),
        (3, 11, 80.0, 0.0),
    ]
    n_lr, n_rl, ev = count_line_events(reset, line_x, band)
    assert n_lr == 1 and n_rl == 1


if __name__ == "__main__":
    test_cross_jitter_reverse()
