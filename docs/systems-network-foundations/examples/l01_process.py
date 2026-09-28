"""L01：父程序啟動 worker，用握手與退出碼分辨完成、失敗與卡住。

協定（同一台機器、標準輸入輸出，不走網路）：
- worker 啟動後先寫一行 READY <pid>，代表程序已開始，不代表工作完成。
- 父程序寫入一行：<mode> <job_id>
- mode=ok：寫 RESULT 後以退出碼 0 結束。
- mode=fail：寫 STARTED 後以退出碼 2 結束。STARTED 不是完成。
- mode=hang：握手後不再結束，用來練逾時與回收。
- 其他 mode：寫 REJECT，退出碼 3。
"""

from __future__ import annotations

import os
import select
import subprocess
import sys
import time
from pathlib import Path

from labutil import popen_group, reap

HERE = Path(__file__).resolve().parent


def worker_main() -> None:
    # flush=True：不要等緩衝區滿才讓父程序看見這一行。
    print(f"READY {os.getpid()}", flush=True)
    line = sys.stdin.readline()
    if not line.strip():
        raise SystemExit(2)
    mode, job_id = line.split()
    if mode == "hang":
        time.sleep(3600)
        raise SystemExit(0)
    if mode == "fail":
        print(f"STARTED {job_id}", flush=True)
        raise SystemExit(2)
    if mode == "ok":
        print(f"RESULT {job_id} ok", flush=True)
        raise SystemExit(0)
    print(f"REJECT {job_id} unknown-mode", flush=True)
    raise SystemExit(3)


def _readline_until(proc: subprocess.Popen[str], timeout: float) -> str | None:
    """在總時限內讀一行。超時不代表對方已死，呼叫端還要終止並 wait。"""
    assert proc.stdout is not None
    deadline = time.monotonic() + timeout
    fd = proc.stdout.fileno()
    pending = ""
    while time.monotonic() < deadline:
        if "\n" in pending:
            line, pending = pending.split("\n", 1)
            return line
        remain = max(0.0, deadline - time.monotonic())
        readable, _, _ = select.select([fd], [], [], min(0.05, remain))
        if not readable:
            if proc.poll() is not None:
                rest = proc.stdout.read()
                pending += rest or ""
                if "\n" in pending:
                    line, _ = pending.split("\n", 1)
                    return line
                return None
            continue
        chunk = os.read(fd, 256).decode()
        if chunk == "" and proc.poll() is not None:
            return None
        pending += chunk
    return None


def run_job(mode: str, job_id: str, *, ignore_exit: bool, timeout: float) -> dict[str, object]:
    """啟動一個 child。ignore_exit=True 是錯誤版：看見 STARTED 就當成功。"""
    proc = popen_group(
        [sys.executable, str(HERE / "l01_process.py"), "--worker"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    started = False
    result_line = None
    error = None
    try:
        ready = _readline_until(proc, timeout)
        if ready is None or not ready.startswith("READY "):
            error = "no-handshake"
        else:
            ready_pid = int(ready.split()[1])
            if ready_pid != proc.pid:
                error = "pid-mismatch"
            assert proc.stdin is not None
            proc.stdin.write(f"{mode} {job_id}\n")
            proc.stdin.flush()
            line = _readline_until(proc, timeout)
            if line is not None and line.startswith("STARTED "):
                started = True
            elif line is not None and (line.startswith("RESULT ") or line.startswith("REJECT ")):
                result_line = line
        try:
            code = proc.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            code = reap(proc, timeout=timeout)
            if error is None and result_line is None:
                error = "child-timeout"
    finally:
        if proc.poll() is None:
            reap(proc, timeout=timeout)
    code = proc.returncode
    # 錯誤版：輸出裡出現過 STARTED 就回報成功，不看退出碼。
    if ignore_exit:
        ok = started or (result_line is not None and result_line.startswith("RESULT "))
    else:
        ok = error is None and code == 0 and result_line == f"RESULT {job_id} ok"
    alive = _still_alive(proc.pid)
    return {
        "pid": proc.pid,
        "returncode": code,
        "started_line": started,
        "result_line": result_line,
        "error": error,
        "ok": ok,
        "alive_after_reap": alive,
    }


def _still_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True


def _expect(cond: bool, message: str) -> None:
    if not cond:
        raise SystemExit(f"FAIL {message}")


def run_tests() -> None:
    ok = run_job("ok", "AOI-SYN-001", ignore_exit=False, timeout=2.0)
    _expect(ok["ok"] is True, f"正常路徑應成功：{ok}")
    _expect(ok["alive_after_reap"] is False, f"正常路徑不應留下 child：{ok}")

    early = run_job("fail", "AOI-SYN-002", ignore_exit=False, timeout=2.0)
    _expect(early["ok"] is False, f"提早失敗不應算完成：{early}")
    _expect(early["started_line"] is True, f"應看見 STARTED 但那不是成功：{early}")
    _expect(early["returncode"] == 2, f"退出碼應為 2：{early}")
    _expect(early["alive_after_reap"] is False, f"失敗路徑仍應回收：{early}")

    # 錯誤版會把 STARTED 當成完成。測試必須抓到這個誤判，實驗才算有效。
    buggy = run_job("fail", "AOI-SYN-002", ignore_exit=True, timeout=2.0)
    _expect(buggy["ok"] is True and buggy["returncode"] == 2, f"錯誤版應被抓到誤判：{buggy}")

    rejected = run_job("nope", "AOI-SYN-003", ignore_exit=False, timeout=2.0)
    _expect(rejected["ok"] is False, f"未認得模式不應成功：{rejected}")
    _expect(rejected["returncode"] == 3, f"未認得模式退出碼應為 3：{rejected}")
    _expect(rejected["result_line"] == "REJECT AOI-SYN-003 unknown-mode", f"應保留診斷：{rejected}")
    _expect(rejected["alive_after_reap"] is False, f"拒絕路徑應回收：{rejected}")

    hung = run_job("hang", "AOI-SYN-004", ignore_exit=False, timeout=0.4)
    _expect(hung["ok"] is False, f"卡住不應成功：{hung}")
    _expect(hung["error"] == "child-timeout", f"應在時限內結束等待：{hung}")
    _expect(hung["alive_after_reap"] is False, f"逾時後應回收 child：{hung}")
    print("L01 PASS")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--worker":
        worker_main()
    else:
        run_tests()
