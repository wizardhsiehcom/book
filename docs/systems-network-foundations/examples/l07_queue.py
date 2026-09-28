"""L07：有界佇列的滿載政策是拒絕。對帳的是工作數，不是佇列瞬間長度。"""

from __future__ import annotations

import threading
import time
from collections import deque


class Station:
    def __init__(self, capacity: int) -> None:
        self.capacity = capacity
        self._items: deque[str] = deque()
        self._cv = threading.Condition()
        self.submitted = 0
        self.accepted = 0
        self.rejected = 0
        self.completed = 0
        self.cancelled = 0
        self.unfinished = 0
        self.inflight = 0
        self._stop = False

    def submit(self, job_id: str) -> str:
        with self._cv:
            self.submitted += 1
            if len(self._items) >= self.capacity:
                self.rejected += 1
                return "rejected"
            self._items.append(job_id)
            self.accepted += 1
            self._cv.notify()
            return "accepted"

    def close(self) -> None:
        with self._cv:
            self._stop = True
            self._cv.notify_all()

    def consume_one(self, delay: float) -> None:
        with self._cv:
            while not self._items and not self._stop:
                self._cv.wait()
            if not self._items:
                return
            self._items.popleft()
            self.inflight += 1
        time.sleep(delay)
        with self._cv:
            self.inflight -= 1
            self.completed += 1

    def snapshot(self) -> dict[str, int]:
        with self._cv:
            return {
                "capacity": self.capacity,
                "queued": len(self._items),
                "inflight": self.inflight,
                "submitted": self.submitted,
                "accepted": self.accepted,
                "rejected": self.rejected,
                "completed": self.completed,
                "cancelled": self.cancelled,
                "unfinished": self.unfinished,
            }


def run_tests() -> None:
    station = Station(capacity=2)
    # 消費者先不要跑，滿載政策才看得到拒絕，而不是剛好被慢慢排掉。
    for index in range(5):
        station.submit(f"AOI-SYN-{index}")
    shot = station.snapshot()
    if shot["queued"] != 2 or shot["accepted"] != 2 or shot["rejected"] != 3:
        raise SystemExit(f"FAIL 滿載：{shot}")

    def consume() -> None:
        for _ in range(2):
            station.consume_one(0.02)

    thread = threading.Thread(target=consume)
    thread.start()
    thread.join(timeout=2)
    station.close()
    shot = station.snapshot()
    if shot["submitted"] != shot["accepted"] + shot["rejected"]:
        raise SystemExit(f"FAIL 提交帳：{shot}")
    if shot["accepted"] != shot["completed"] + shot["cancelled"] + shot["unfinished"]:
        raise SystemExit(f"FAIL 接受帳：{shot}")
    if shot["queued"] != 0 or shot["inflight"] != 0:
        raise SystemExit(f"FAIL 結束後仍有在途：{shot}")
    print("L07 PASS", shot)


if __name__ == "__main__":
    run_tests()
