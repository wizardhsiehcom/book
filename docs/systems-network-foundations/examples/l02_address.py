"""L02：兩個程序各自改自己的值。印出的 id 只是觀察，不能拿來當答案。"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from labutil import popen_group, reap

HERE = Path(__file__).resolve().parent


def child_main() -> None:
    # 這個整數物件活在本程序。另一個程序就算印出相同數字，也不是這一個物件。
    box = {"n": 0}
    target = int(sys.argv[2])
    box["n"] = target
    print(json.dumps({"pid": __import__("os").getpid(), "n": box["n"], "id": id(box)}))


def run_tests() -> None:
    procs = []
    try:
        for target in (10, 20):
            procs.append(
                popen_group(
                    [sys.executable, str(HERE / "l02_address.py"), "--child", str(target)],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )
            )
        rows = []
        for proc in procs:
            assert proc.stdout is not None
            line = proc.stdout.readline()
            code = reap(proc, timeout=2)
            if code != 0:
                raise SystemExit(f"FAIL child exit {code}")
            rows.append(json.loads(line))
    finally:
        for proc in procs:
            if proc.poll() is None:
                reap(proc)
    by_value = {row["n"] for row in rows}
    if by_value != {10, 20}:
        raise SystemExit(f"FAIL 兩個程序的值應各自保留：{rows}")
    if rows[0]["pid"] == rows[1]["pid"]:
        raise SystemExit(f"FAIL 應是兩個 PID：{rows}")
    print("L02 PASS", json.dumps({"rows": rows}, ensure_ascii=False))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--child":
        child_main()
    else:
        run_tests()
