"""L06：等待不一定吃 CPU；每步加鎖仍可能讓讀改寫組合失敗。"""

from __future__ import annotations

import asyncio
import socket
import sys
import threading
import time


def _wait_blocking() -> tuple[float, float]:
    left, right = socket.socketpair()
    try:
        def peer() -> None:
            time.sleep(0.2)
            right.send(b"x")

        threading.Thread(target=peer, daemon=True).start()
        started = time.perf_counter()
        cpu = time.process_time()
        got = left.recv(1)
        wall = time.perf_counter() - started
        cpu = time.process_time() - cpu
        if got != b"x":
            raise SystemExit("FAIL blocking 沒有等到那一個 byte")
        return wall, cpu
    finally:
        left.close()
        right.close()


async def _wait_async() -> tuple[float, float]:
    left, right = socket.socketpair()
    left.setblocking(False)
    try:
        def peer() -> None:
            time.sleep(0.2)
            right.send(b"x")

        threading.Thread(target=peer, daemon=True).start()
        loop = asyncio.get_running_loop()
        started = time.perf_counter()
        cpu = time.process_time()
        got = await loop.sock_recv(left, 1)
        wall = time.perf_counter() - started
        cpu = time.process_time() - cpu
        if got != b"x":
            raise SystemExit("FAIL async 沒有等到那一個 byte")
        return wall, cpu
    finally:
        left.close()
        right.close()


def _cpu_burn() -> None:
    total = 0
    for number in range(1_500_000):
        total += number
    if total <= 0:
        raise SystemExit("FAIL burn")


async def _cpu_gather() -> tuple[float, float]:
    started = time.perf_counter()
    await asyncio.gather(asyncio.to_thread(_cpu_burn), asyncio.to_thread(_cpu_burn))
    threaded = time.perf_counter() - started
    started = time.perf_counter()
    _cpu_burn()
    _cpu_burn()
    serial = time.perf_counter() - started
    return threaded, serial


def _logic_race(locked_together: bool) -> int:
    """先讀、兩邊都讀完，再寫回。只有把讀和寫放進同一個鎖，結果才會是 2。"""
    value = {"n": 0}
    lock = threading.Lock()
    gate = threading.Barrier(2)

    def worker() -> None:
        if locked_together:
            with lock:
                snapshot = value["n"]
                gate.wait()
                value["n"] = snapshot + 1
            return
        with lock:
            snapshot = value["n"]
        gate.wait()
        with lock:
            value["n"] = snapshot + 1

    # Barrier 在鎖裡面會互等對方釋放鎖，所以上面的正確版不能這樣寫。
    # 正確版改成：用鎖保護整個讀改寫，同步點放在鎖外面。
    if locked_together:
        def worker() -> None:  # type: ignore[no-redef]
            gate.wait()
            with lock:
                value["n"] = value["n"] + 1

    threads = [threading.Thread(target=worker) for _ in range(2)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join(timeout=2)
    return value["n"]


def run_tests() -> None:
    wall, cpu = _wait_blocking()
    if wall < 0.15 or cpu > 0.1:
        raise SystemExit(f"FAIL blocking 等待 wall={wall:.3f} cpu={cpu:.3f}")
    awall, acpu = asyncio.run(_wait_async())
    if awall < 0.15 or acpu > 0.1:
        raise SystemExit(f"FAIL async 等待 wall={awall:.3f} cpu={acpu:.3f}")

    raced = _logic_race(False)
    fixed = _logic_race(True)
    if raced != 1:
        raise SystemExit(f"FAIL 分開的讀和寫應留下 1，實際 {raced}")
    if fixed != 2:
        raise SystemExit(f"FAIL 整個加一應留下 2，實際 {fixed}")

    gil = sys._is_gil_enabled() if hasattr(sys, "_is_gil_enabled") else None
    # to_thread 會把工作丟到別的執行緒。預設建置的 GIL 仍讓這兩個純計算不能一起跑完。
    # 這個比較只描述本次 CPython，不能外推到 C++ 或 free-threaded 建置。
    threaded, serial = asyncio.run(_cpu_gather())
    if gil and threaded < serial * 0.6:
        raise SystemExit(f"FAIL 這次 GIL 建置不應把 CPU 工作平行成 {threaded:.3f} < {serial:.3f}")
    print(
        "L06 PASS",
        f"block_wall={wall:.3f}",
        f"block_cpu={cpu:.3f}",
        f"async_wall={awall:.3f}",
        f"async_cpu={acpu:.3f}",
        f"gil_enabled={gil}",
        f"to_thread_wall={threaded:.3f}",
        f"serial_wall={serial:.3f}",
    )


if __name__ == "__main__":
    run_tests()
