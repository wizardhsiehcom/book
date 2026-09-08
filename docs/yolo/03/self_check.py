"""第 03 章：letterbox 座標往返檢查（僅標準庫）。

對應手冊：1920x1080 -> 640x640、scale=1/3、pad 上/下各 140。
只鎖平方輸入、等分 padding 的契約，不模擬 LetterBox(auto=True) 的 stride 取餘。
"""

from __future__ import annotations


def letterbox_params(src_w: int, src_h: int, dst: int = 640) -> tuple[float, float, float]:
    if src_w <= 0 or src_h <= 0 or dst <= 0:
        raise ValueError(f"illegal size: src=({src_w}, {src_h}), dst={dst}")
    scale = min(dst / src_w, dst / src_h)
    new_w = int(round(src_w * scale))
    new_h = int(round(src_h * scale))
    pad_left = (dst - new_w) / 2.0
    pad_top = (dst - new_h) / 2.0
    return scale, pad_left, pad_top


def boxes_to_letterbox(
    boxes: list[tuple[float, float, float, float]],
    scale: float,
    pad_left: float,
    pad_top: float,
) -> list[tuple[float, float, float, float]]:
    out: list[tuple[float, float, float, float]] = []
    for x1, y1, x2, y2 in boxes:
        out.append(
            (
                x1 * scale + pad_left,
                y1 * scale + pad_top,
                x2 * scale + pad_left,
                y2 * scale + pad_top,
            )
        )
    return out


def boxes_from_letterbox(
    boxes: list[tuple[float, float, float, float]],
    scale: float,
    pad_left: float,
    pad_top: float,
) -> list[tuple[float, float, float, float]]:
    out: list[tuple[float, float, float, float]] = []
    for x1, y1, x2, y2 in boxes:
        out.append(
            (
                (x1 - pad_left) / scale,
                (y1 - pad_top) / scale,
                (x2 - pad_left) / scale,
                (y2 - pad_top) / scale,
            )
        )
    return out


def _almost_eq(
    a: tuple[float, float, float, float],
    b: tuple[float, float, float, float],
    tol: float = 1e-9,
) -> bool:
    return all(abs(x - y) <= tol for x, y in zip(a, b))


def test_roundtrip() -> None:
    scale, pad_left, pad_top = letterbox_params(1920, 1080, 640)
    assert abs(scale - 1.0 / 3.0) < 1e-12, scale
    assert abs(pad_left - 0.0) < 1e-9, pad_left
    assert abs(pad_top - 140.0) < 1e-9, pad_top

    src = (300.0, 150.0, 900.0, 750.0)
    lb = boxes_to_letterbox([src], scale, pad_left, pad_top)[0]
    assert _almost_eq(lb, (100.0, 190.0, 300.0, 390.0)), lb

    back = boxes_from_letterbox([lb], scale, pad_left, pad_top)[0]
    assert _almost_eq(back, src), back


def test_empty_boxes() -> None:
    scale, pad_left, pad_top = letterbox_params(1920, 1080, 640)
    assert boxes_to_letterbox([], scale, pad_left, pad_top) == []
    assert boxes_from_letterbox([], scale, pad_left, pad_top) == []


def test_reject_illegal_size() -> None:
    illegal = [
        (0, 1080, 640),
        (1920, 0, 640),
        (1920, 1080, 0),
        (-1, 1080, 640),
        (1920, -1, 640),
        (1920, 1080, -640),
    ]
    for args in illegal:
        raised = False
        try:
            letterbox_params(*args)
        except ValueError:
            raised = True
        assert raised, f"should reject illegal size {args}"


if __name__ == "__main__":
    test_roundtrip()
    test_empty_boxes()
    test_reject_illegal_size()
    print("self_check ok")
