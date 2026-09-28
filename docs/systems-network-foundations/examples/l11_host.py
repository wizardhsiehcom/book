"""L11：用一次新的容器執行觀察邊界。失敗時也要清掉這次的容器。"""

from __future__ import annotations

import json
import socket
import subprocess
import time
import uuid
from pathlib import Path

from labutil import make_workdir

IMAGE = "python:3.13-alpine"
HERE = Path(__file__).resolve().parent


class Injected(Exception):
    """測試自己丟出的失敗。finally 仍要回收容器。"""


def _container_ids(name: str) -> list[str]:
    proc = subprocess.run(
        ["docker", "ps", "-aq", "--filter", f"name=^{name}$"],
        capture_output=True,
        text=True,
    )
    return [line for line in proc.stdout.split() if line]


def _remove(name: str) -> None:
    subprocess.run(["docker", "rm", "-f", name], capture_output=True, text=True)


def _wait_ready(out: Path, name: str, pause: bool) -> dict[str, object]:
    deadline = time.monotonic() + 5
    saw_early_gap = not pause
    while time.monotonic() < deadline:
        mounted = (out / "mounted.txt").exists()
        ready_path = out / "guest.json"
        if pause and mounted and not ready_path.exists():
            saw_early_gap = True
            time.sleep(0.05)
            continue
        if not ready_path.exists():
            time.sleep(0.05)
            continue
        try:
            report = json.loads(ready_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            time.sleep(0.05)
            continue
        if report.get("ready") is True:
            if not saw_early_gap:
                raise SystemExit("FAIL 停頓期間沒有觀察到尚未就緒")
            return report
        time.sleep(0.05)
    logs = subprocess.run(["docker", "logs", name], capture_output=True, text=True)
    raise SystemExit(f"FAIL 沒有等到就緒檔：{logs.stdout} {logs.stderr}")


def scenario(mode: str, host: str, image_id: str) -> dict[str, object] | None:
    name = f"snf-l11-{uuid.uuid4().hex[:8]}"
    pause = mode == "pause"
    try:
        with make_workdir("l11-") as raw:
            out = Path(raw)
            command = [
                "docker", "run", "-d", "--name", name,
                "-e", f"SNF_L11_PAUSE={'before-ready' if pause else ''}",
                "-v", f"{HERE}:/work:ro",
                "-v", f"{out}:/out",
                IMAGE, "python", "/work/l11_guest.py", "/out",
            ]
            proc = subprocess.run(command, check=True, capture_output=True, text=True)
            container = proc.stdout.strip()
            if mode == "fail-report":
                raise Injected("injected-report")
            report = _wait_ready(out, name, pause)
            mounted = (out / "mounted.txt").read_text(encoding="utf-8")
            if mode == "fail-check":
                raise Injected("injected-check")
            if report["pid"] != 1:
                raise SystemExit(f"FAIL 這個進入點的 PID 應為 1：{report}")
            if mounted != "from-container\n":
                raise SystemExit("FAIL 掛載目錄沒有看到容器寫入")
            if report["hostname"] == host:
                raise SystemExit(f"FAIL 這次容器 hostname 與主機相同：{host}")
            if report["bind"][0] != "127.0.0.1":
                raise SystemExit(f"FAIL 容器內 bind 位址：{report}")
            stop = subprocess.run(["docker", "stop", name], check=True, capture_output=True, text=True)
            stopped = (out / "stopped.txt").read_text(encoding="utf-8") if (out / "stopped.txt").exists() else ""
            if stopped != "sigterm\n":
                raise SystemExit(f"FAIL docker stop 後沒有看見 SIGTERM 紀錄：{stop.stderr}")
            inspect = subprocess.run(
                ["docker", "inspect", name, "--format", "{{.State.ExitCode}}"],
                check=True,
                capture_output=True,
                text=True,
            )
            if inspect.stdout.strip() != "0":
                raise SystemExit(f"FAIL 退出碼：{inspect.stdout}")
            if mode == "pause":
                return None
            inside = subprocess.run(
                ["docker", "run", "--rm", IMAGE, "cat", "/tmp/only-inside.txt"],
                capture_output=True,
                text=True,
            )
            if inside.returncode == 0:
                raise SystemExit("FAIL 新容器不該看見上一個容器的 /tmp")
            return {
                "image_id": image_id,
                "container": container[:12],
                "guest": report,
                "host_hostname": host,
            }
    finally:
        _remove(name)
        if _container_ids(name):
            raise SystemExit(f"FAIL 容器殘留 {name}")


def run_tests() -> None:
    host = socket.gethostname()
    info = subprocess.run(
        ["docker", "image", "inspect", IMAGE, "--format", "{{.Id}}"],
        check=True,
        capture_output=True,
        text=True,
    )
    image_id = info.stdout.strip()
    others = set(subprocess.run(["docker", "ps", "-aq"], capture_output=True, text=True).stdout.split())
    for mode in ("fail-report", "fail-check"):
        try:
            scenario(mode, host, image_id)
        except Injected:
            pass
        else:
            raise SystemExit(f"FAIL {mode} 沒有失敗")
    scenario("pause", host, image_id)
    summary = scenario("ok", host, image_id)
    now = set(subprocess.run(["docker", "ps", "-aq"], capture_output=True, text=True).stdout.split())
    leaked = now - others
    if leaked:
        raise SystemExit(f"FAIL 多留下容器 {sorted(leaked)}")
    print("L11 PASS", json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    run_tests()
