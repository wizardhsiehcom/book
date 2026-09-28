"""依序跑 L01–L11，並把這台機器的摘要寫到 verification/。"""

from __future__ import annotations

import json
import platform
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
PY = sys.executable

LABS = [
    "l01_process.py",
    "l02_address.py",
    "l03_publish.py",
    "l04_layers.py",
    "l05_framing.py",
    "l06_sync.py",
    "l07_queue.py",
    "l08_deadline.py",
    "l09_lifecycle.py",
    "l10_observe.py",
    "station_skeleton.py",
]


def run_script(path: Path, cwd: Path | None = None) -> dict[str, object]:
    proc = subprocess.run(
        [PY, str(path)],
        cwd=cwd or HERE,
        capture_output=True,
        text=True,
        timeout=60,
    )
    return {
        "script": path.name,
        "returncode": proc.returncode,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
    }


def _tool_ok(argv: list[str]) -> bool:
    try:
        return subprocess.run(argv, capture_output=True).returncode == 0
    except FileNotFoundError:
        return False


def run_cpp(source: str, binary: str) -> dict[str, object]:
    if not _tool_ok(["clang++", "--version"]):
        return {
            "script": source,
            "returncode": 0,
            "stdout": "SKIP 這次環境沒有 clang++",
            "stderr": "",
        }
    binary_path = HERE / binary
    compile_proc = subprocess.run(
        ["clang++", "-std=c++17", "-O2", "-Wall", "-Wextra", str(HERE / source), "-o", str(binary_path)],
        capture_output=True,
        text=True,
    )
    if compile_proc.returncode != 0:
        return {
            "script": source,
            "returncode": compile_proc.returncode,
            "stdout": "",
            "stderr": compile_proc.stderr.strip(),
        }
    run_proc = subprocess.run([str(binary_path)], capture_output=True, text=True, timeout=30)
    binary_path.unlink(missing_ok=True)
    return {
        "script": source,
        "returncode": run_proc.returncode,
        "stdout": run_proc.stdout.strip(),
        "stderr": (compile_proc.stderr + run_proc.stderr).strip(),
    }


def main() -> None:
    rows = [run_script(HERE / name) for name in LABS]
    rows.append(run_cpp("l02_copy.cpp", "l02_copy.bin"))
    rows.append(run_cpp("l06_logic_race.cpp", "l06_logic_race.bin"))
    if _tool_ok(["docker", "info"]):
        rows.append(run_script(HERE / "l11_host.py"))
    else:
        rows.append({
            "script": "l11_host.py",
            "returncode": 0,
            "stdout": "SKIP 這次環境沒有 Docker，容器實驗留在有 Engine 的那一欄",
            "stderr": "",
        })
    failed = [row for row in rows if row["returncode"] != 0]
    summary = {
        "python": sys.version,
        "platform": platform.platform(),
        "machine": platform.machine(),
        "rows": rows,
    }
    out = ROOT / "verification"
    out.mkdir(parents=True, exist_ok=True)
    label = "linux-docker" if Path("/proc/1/cgroup").exists() or platform.system() == "Linux" else "macos-native"
    # 在 macOS 上跑 run_all 時，L11 仍是 Linux 容器；摘要檔名用主機系統。
    label = "macos-native" if platform.system() == "Darwin" else "linux-container"
    (out / f"{label}.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for row in rows:
        status = "PASS" if row["returncode"] == 0 else "FAIL"
        print(status, row["script"], row["stdout"][:180])
        if row["returncode"] != 0:
            print(row["stderr"][:800])
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
