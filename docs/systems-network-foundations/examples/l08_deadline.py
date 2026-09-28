"""L08：多段等待共用一個剩餘預算；丟掉回覆不會讓 worker 的完成消失。"""

from __future__ import annotations

import threading
import time


TOLERANCE = 0.12


def run_budget(stage_s: list[float], budget: float, *, reuse_full_budget: bool) -> float:
    started = time.monotonic()
    deadline = started + budget
    for cost in stage_s:
        if reuse_full_budget:
            time.sleep(cost)
            continue
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            break
        time.sleep(min(cost, remaining))
    return time.monotonic() - started


def _worker(cancel: threading.Event, done: threading.Event, state: dict[str, str], work_s: float) -> None:
    started = time.monotonic()
    while time.monotonic() - started < work_s:
        if cancel.is_set():
            state["worker"] = "cancelled"
            return
        time.sleep(0.01)
    state["worker"] = "completed"
    state["reply"] = "ok"
    done.set()


def scenario_finish() -> tuple[str, str]:
    cancel = threading.Event()
    done = threading.Event()
    state: dict[str, str] = {"worker": "running"}
    threading.Thread(target=_worker, args=(cancel, done, state, 0.05), daemon=True).start()
    if not done.wait(0.5):
        raise SystemExit("FAIL worker 沒有完成")
    return state["worker"], "received"


def scenario_cancel() -> tuple[str, str]:
    cancel = threading.Event()
    done = threading.Event()
    state: dict[str, str] = {"worker": "running"}
    threading.Thread(target=_worker, args=(cancel, done, state, 5.0), daemon=True).start()
    time.sleep(0.03)
    cancel.set()
    deadline = time.monotonic() + 0.5
    while state["worker"] == "running" and time.monotonic() < deadline:
        time.sleep(0.01)
    return state["worker"], "cancelled"


def scenario_drop_reply() -> tuple[str, str]:
    cancel = threading.Event()
    done = threading.Event()
    state: dict[str, str] = {"worker": "running"}
    threading.Thread(target=_worker, args=(cancel, done, state, 0.05), daemon=True).start()
    if not done.wait(0.5):
        raise SystemExit("FAIL 回覆遺失情境裡 worker 沒有完成")
    # 客戶端丟掉應用回覆。worker 狀態仍是完成；客戶端沒有獨立收件證據。
    state.pop("reply", None)
    client = "unknown"
    return state["worker"], client


def run_tests() -> None:
    stages = [0.15, 0.15, 0.15]
    shared = run_budget(stages, 0.20, reuse_full_budget=False)
    naive = run_budget(stages, 0.20, reuse_full_budget=True)
    if shared > 0.20 + TOLERANCE:
        raise SystemExit(f"FAIL 共用預算超出：{shared:.3f}")
    if naive < 0.40:
        raise SystemExit(f"FAIL 各段自取完整等待沒有被抓到：{naive:.3f}")
    finished = scenario_finish()
    cancelled = scenario_cancel()
    dropped = scenario_drop_reply()
    if finished != ("completed", "received"):
        raise SystemExit(f"FAIL 完成情境：{finished}")
    if cancelled != ("cancelled", "cancelled"):
        raise SystemExit(f"FAIL 取消情境：{cancelled}")
    if dropped != ("completed", "unknown"):
        raise SystemExit(f"FAIL 丟回覆情境：{dropped}")
    print(
        "L08 PASS",
        f"shared={shared:.3f}",
        f"naive={naive:.3f}",
        f"tolerance={TOLERANCE}",
    )


if __name__ == "__main__":
    run_tests()
