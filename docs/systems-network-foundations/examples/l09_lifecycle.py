"""L09：假健康、就緒、drain，以及 SIGKILL 後不能用 cleanup 檔宣稱成功。"""

from __future__ import annotations

import os
import signal
import subprocess
import sys
import threading
import time
from pathlib import Path

from labutil import make_workdir, popen_group, reap

HERE = Path(__file__).resolve().parent


class Service:
    """完成只來自 worker 做完後的那一次寫入。drain 只負責停止接收與期限。"""

    def __init__(self) -> None:
        self.phase = "startup"
        self.jobs: dict[str, str] = {}
        self.finished_at: dict[str, float] = {}
        self._events: dict[str, threading.Event] = {}
        self._lock = threading.Lock()
        self.drain_deadline = 0.0

    def fake_health(self) -> int:
        return 200

    def ready(self) -> int:
        return 200 if self.phase == "live" else 503

    def open_gate(self) -> None:
        if self.phase != "startup":
            raise RuntimeError(self.phase)
        self.phase = "live"

    def submit(self, job_id: str, delay: float) -> str:
        with self._lock:
            if self.phase != "live":
                return "rejected"
            self.jobs[job_id] = "accepted"
            event = threading.Event()
            self._events[job_id] = event

        def run() -> None:
            time.sleep(delay)
            with self._lock:
                # 期限過了被標成 incomplete 之後，晚到的結果不能改回完成。
                if self.jobs.get(job_id) == "accepted":
                    self.jobs[job_id] = "completed"
                    self.finished_at[job_id] = time.monotonic()
            event.set()

        threading.Thread(target=run, daemon=True).start()
        return "accepted"

    def drain(self, timeout: float) -> None:
        with self._lock:
            self.phase = "draining"
            pending = list(self._events.items())
        deadline = time.monotonic() + timeout
        self.drain_deadline = deadline
        for job_id, event in pending:
            remaining = deadline - time.monotonic()
            if remaining > 0:
                event.wait(remaining)
            with self._lock:
                if self.jobs.get(job_id) == "accepted":
                    self.jobs[job_id] = "incomplete"
        with self._lock:
            self.phase = "stopped"

    def assert_completion_evidence(self) -> None:
        for job_id, status in self.jobs.items():
            if status != "completed":
                continue
            finished = self.finished_at.get(job_id)
            if finished is None or finished > self.drain_deadline:
                raise SystemExit(f"FAIL {job_id} 沒有期限內的完成訊號")


def child_hold(marker: str) -> None:
    print("READY", flush=True)
    try:
        time.sleep(30)
    finally:
        Path(marker).write_text("cleaned\n", encoding="utf-8")


def run_tests() -> None:
    service = Service()
    if service.fake_health() == 200 and service.ready() == 200:
        raise SystemExit("FAIL 啟動階段不應同時健康又就緒")
    if service.fake_health() != 200 or service.ready() != 503:
        raise SystemExit("FAIL 假健康探針沒有與就緒分開")
    if service.submit("early", 0.0) != "rejected":
        raise SystemExit("FAIL 未就緒不應接工作")
    service.open_gate()
    if service.submit("A", 0.0) != "accepted" or service.submit("B", 0.05) != "accepted":
        raise SystemExit("FAIL 就緒後應接受工作")
    service.drain(0.4)
    if service.submit("C", 0.0) != "rejected":
        raise SystemExit("FAIL 停止後應拒收")
    if service.jobs != {"A": "completed", "B": "completed"}:
        raise SystemExit(f"FAIL 逐筆對帳：{service.jobs}")
    service.assert_completion_evidence()

    # 逾時沒做完的工作必須留在帳上，而且不能事後被標成完成。
    late = Service()
    late.open_gate()
    late.submit("slow", 5.0)
    late.drain(0.05)
    if late.submit("later", 0.0) != "rejected":
        raise SystemExit("FAIL 逾時停止後仍應拒收")
    if late.jobs != {"slow": "incomplete"}:
        raise SystemExit(f"FAIL 逾時未完成應入帳：{late.jobs}")
    time.sleep(0.05)
    if late.jobs["slow"] == "completed":
        raise SystemExit("FAIL 沒有期限內的完成訊號卻被標成完成")

    with make_workdir("l09-") as raw:
        marker = str(Path(raw) / "cleanup.txt")
        proc = popen_group(
            [sys.executable, str(HERE / "l09_lifecycle.py"), "--hold", marker],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        try:
            assert proc.stdout is not None
            if proc.stdout.readline().strip() != "READY":
                raise SystemExit("FAIL 沒有等到 child")
            os.kill(proc.pid, signal.SIGKILL)
            code = proc.wait(timeout=2)
        finally:
            if proc.poll() is None:
                reap(proc)
        if code != -signal.SIGKILL:
            raise SystemExit(f"FAIL 預期 SIGKILL 退出狀態，得到 {code}")
        if Path(marker).exists():
            raise SystemExit("FAIL 強制終止後不應憑 cleanup 檔宣稱成功")
    print("L09 PASS")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--hold":
        child_hold(sys.argv[2])
    else:
        run_tests()
