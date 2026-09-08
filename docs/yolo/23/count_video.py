#!/usr/bin/env python3
"""Line-crossing event CSV from YOLO ByteTrack IDs.

Track IDs are tracker IDs, not unique people. Occlusion, re-init, and
fragmentation can duplicate or recycle IDs; events are per track_id only.
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
import uuid


EXPIRE_AFTER = 300


class CrossingCounter:
    """Hysteresis line crossing on normalized vertical coordinate.

    Stable sides are y < line_y - margin (below) and y > line_y + margin
    (above). Samples inside the band keep the last stable side and emit
    no event. A complete crossing is last stable below -> above ('down',
    image y increases downward) or above -> below ('up').
    """

    def __init__(self, line_y: float, margin: float) -> None:
        self.line_y = line_y
        self.margin = margin
        self._stable: dict[int, str] = {}
        self._last_seen: dict[int, int] = {}

    def _stable_side(self, center_y: float) -> str | None:
        lo = self.line_y - self.margin
        hi = self.line_y + self.margin
        if center_y < lo:
            return "below"
        if center_y > hi:
            return "above"
        return None

    def update(self, track_id: int, center_y: float, frame: int) -> str | None:
        self._last_seen[track_id] = frame
        side = self._stable_side(center_y)
        if side is None:
            return None
        prev = self._stable.get(track_id)
        self._stable[track_id] = side
        if prev is None or prev == side:
            return None
        if prev == "below" and side == "above":
            return "down"
        if prev == "above" and side == "below":
            return "up"
        return None

    def expire(self, frame: int) -> None:
        stale = [
            tid
            for tid, last in self._last_seen.items()
            if frame - last >= EXPIRE_AFTER
        ]
        for tid in stale:
            del self._last_seen[tid]
            self._stable.pop(tid, None)


def self_check() -> None:
    line_y, margin = 0.5, 0.05
    lo, hi = line_y - margin, line_y + margin

    c = CrossingCounter(line_y, margin)
    f = 0
    # jitter in band / around one side: no event
    for y in (lo - 0.01, lo + 0.01, line_y, hi - 0.01, lo - 0.02, lo + 0.02):
        f += 1
        assert c.update(1, y, f) is None

    # complete crossing below -> above
    f += 1
    assert c.update(1, lo - 0.02, f) is None
    f += 1
    assert c.update(1, line_y, f) is None  # band retains below
    f += 1
    assert c.update(1, hi + 0.02, f) == "down"

    # returning crossing above -> below
    f += 1
    assert c.update(1, hi + 0.03, f) is None
    f += 1
    assert c.update(1, lo - 0.03, f) == "up"

    # distinct ID: no false event from other track's history
    f += 1
    assert c.update(2, hi + 0.02, f) is None
    f += 1
    assert c.update(2, lo - 0.02, f) == "up"

    # new counter is reset
    c2 = CrossingCounter(line_y, margin)
    f += 1
    assert c2.update(1, hi + 0.02, f) is None

    # stale expire: after 300 unseen frames, state is gone (no leftover side)
    c3 = CrossingCounter(line_y, margin)
    assert c3.update(9, lo - 0.02, 0) is None
    c3.expire(EXPIRE_AFTER)
    assert 9 not in c3._stable and 9 not in c3._last_seen
    assert c3.update(9, hi + 0.02, EXPIRE_AFTER) is None

    print("self-check ok")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="YOLO horizontal line crossing CSV")
    p.add_argument("--self-check", action="store_true")
    p.add_argument("--video")
    p.add_argument("--model")
    p.add_argument("--class-id", type=int)
    p.add_argument("--line-y", type=float)
    p.add_argument("--margin", type=float)
    p.add_argument("--output")
    return p.parse_args(argv)


def validate_real(args: argparse.Namespace) -> None:
    missing = [
        n
        for n, v in (
            ("--video", args.video),
            ("--model", args.model),
            ("--class-id", args.class_id),
            ("--line-y", args.line_y),
            ("--margin", args.margin),
            ("--output", args.output),
        )
        if v is None
    ]
    if missing:
        raise SystemExit("required: " + ", ".join(missing))
    if args.class_id < 0:
        raise SystemExit("class-id must be >= 0")
    if not (0.0 < args.line_y - args.margin < args.line_y + args.margin < 1.0):
        raise SystemExit("need 0 < line-y - margin < line-y + margin < 1")
    if args.margin <= 0:
        raise SystemExit("margin must be > 0")
    if not os.path.isfile(args.video):
        raise SystemExit("video not found: %s" % args.video)
    if not os.path.isfile(args.model):
        raise SystemExit("model not found: %s" % args.model)


def xyxy_centroid_norm_y(xyxy, height: float) -> float:
    x1, y1, x2, y2 = (float(v) for v in xyxy)
    cy = (y1 + y2) / 2.0
    return cy / height


def run_video(args: argparse.Namespace) -> None:
    import cv2
    from ultralytics import YOLO

    validate_real(args)
    session_id = str(uuid.uuid4())
    flags = os.O_CREAT | os.O_EXCL | os.O_WRONLY
    fd = os.open(args.output, flags)
    cap = None
    counter = CrossingCounter(args.line_y, args.margin)
    out = None
    try:
        cap = cv2.VideoCapture(args.video)
        model = YOLO(args.model)
        if not cap.isOpened():
            raise SystemExit("cannot open video: %s" % args.video)
        out = os.fdopen(fd, "w", newline="")
        fd = -1
        w = csv.writer(out)
        w.writerow(["session_id", "frame", "track_id", "direction"])
        frame_i = 0
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            counter.expire(frame_i)
            h = float(frame.shape[0])
            results = model.track(
                frame,
                persist=True,
                tracker="bytetrack.yaml",
                verbose=False,
            )
            r0 = results[0] if results else None
            boxes = getattr(r0, "boxes", None) if r0 is not None else None
            if boxes is not None and getattr(boxes, "is_track", False):
                ids = boxes.id
                cls = boxes.cls
                xyxy = boxes.xyxy
                if ids is not None:
                    n = len(ids)
                    for i in range(n):
                        cid = int(cls[i])
                        if cid != args.class_id:
                            continue
                        tid = int(ids[i])
                        ny = xyxy_centroid_norm_y(xyxy[i], h)
                        direction = counter.update(tid, ny, frame_i)
                        if direction is not None:
                            w.writerow([session_id, frame_i, tid, direction])
            frame_i += 1
    finally:
        if cap is not None:
            cap.release()
        if out is not None:
            out.close()
        elif fd >= 0:
            os.close(fd)


def main(argv: list[str] | None = None) -> None:
    args = parse_args(argv)
    if args.self_check:
        self_check()
        return
    run_video(args)


if __name__ == "__main__":
    main()
