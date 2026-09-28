"""L03：讀者只接受發布點之後的檔案。半檔就算路徑存在也要拒絕。

這支程式比較的是程序終止前後檔案是否已發布，不是斷電或裝置掉電。
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

from labutil import make_workdir, popen_group, reap

MAGIC = b"AOI1\n"
DONE = b"\nCOMPLETE\n"


def publish(directory: Path, name: str, payload: bytes) -> None:
    """寫到同目錄暫存檔，fsync 檔案內容，再 rename 成正式名稱。"""
    final = directory / name
    temporary = directory / f".{name}.partial"
    with temporary.open("wb") as handle:
        handle.write(MAGIC)
        handle.write(f"LEN {len(payload)}\n".encode())
        handle.write(payload)
        handle.write(DONE)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temporary, final)  # 同一目錄，避免跨檔案系統的複製。
    _fsync_directory(directory)


def expose_partial(directory: Path, name: str, payload: bytes) -> None:
    """錯誤版：把還沒寫完的位元組直接放在讀者會看的路徑。"""
    final = directory / name
    with final.open("wb") as handle:
        handle.write(MAGIC)
        handle.write(f"LEN {len(payload)}\n".encode())
        handle.write(payload[: max(1, len(payload) // 2)])
        handle.flush()


def accept(path: Path, payload: bytes) -> bool:
    if not path.exists():
        return False
    data = path.read_bytes()
    expected = MAGIC + f"LEN {len(payload)}\n".encode() + payload + DONE
    return data == expected


def _fsync_directory(directory: Path) -> str:
    """目錄項是否跟著 fsync，依作業系統而定。失敗只記錄，不當成斷電證明。"""
    try:
        fd = os.open(directory, os.O_RDONLY)
    except OSError as exc:
        return f"open:{exc}"
    try:
        os.fsync(fd)
    except OSError as exc:
        return f"fsync:{exc}"
    finally:
        os.close(fd)
    return "ok"


def _reader_main(directory: str, payload_text: str) -> None:
    """另一個程序只負責打開正式路徑。父程序的位址空間不參與這次判斷。"""
    accepted = accept(Path(directory) / "frame.bin", payload_text.encode())
    print("ACCEPT" if accepted else "REJECT", flush=True)


def _ask_new_reader(directory: Path, payload: bytes) -> str:
    proc = popen_group(
        [sys.executable, str(Path(__file__).resolve()), "--read", str(directory), payload.decode()],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    try:
        assert proc.stdout is not None
        line = proc.stdout.readline().strip()
        code = reap(proc, timeout=2)
    finally:
        if proc.poll() is None:
            reap(proc)
    if code != 0 or line not in {"ACCEPT", "REJECT"}:
        raise SystemExit(f"FAIL 新 reader 異常：code={code} line={line!r}")
    return line


def _writer_pause(directory: str, name: str) -> None:
    expose_partial(Path(directory), name, b"synthetic-image")
    print("PAUSED", flush=True)
    # 停在發布之前。父程序會終止這個程序；finally 不應被當成檔案已完成。
    sys.stdin.readline()


def run_tests() -> None:
    payload = b"synthetic-image"
    directory_sync = "not-run"
    with make_workdir("l03-") as raw:
        directory = Path(raw)
        expose_partial(directory, "frame.bin", payload)
        if accept(directory / "frame.bin", payload):
            raise SystemExit("FAIL 半檔不應被接受")
        publish(directory, "frame.bin", payload)
        directory_sync = _fsync_directory(directory)
        if not accept(directory / "frame.bin", payload):
            raise SystemExit("FAIL 發布後同一程序應讀到完整內容")

    with make_workdir("l03-kill-") as raw:
        directory = Path(raw)
        proc = popen_group(
            [sys.executable, str(Path(__file__).resolve()), "--pause", raw, "frame.bin"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        try:
            assert proc.stdout is not None
            line = proc.stdout.readline().strip()
            if line != "PAUSED":
                raise SystemExit(f"FAIL 沒有停在指定點：{line!r}")
            if accept(directory / "frame.bin", payload):
                raise SystemExit("FAIL 停住時讀者不應接受")
            reap(proc, timeout=1)
        finally:
            if proc.poll() is None:
                reap(proc)
        if _ask_new_reader(directory, payload) != "REJECT":
            raise SystemExit("FAIL 新 reader 不應接受未發布檔")
        publish(directory, "frame.bin", payload)
        if _ask_new_reader(directory, payload) != "ACCEPT":
            raise SystemExit("FAIL 發布後新 reader 應接受")
    print("L03 PASS", f"dir_fsync={directory_sync}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--pause":
        _writer_pause(sys.argv[2], sys.argv[3])
    elif len(sys.argv) > 1 and sys.argv[1] == "--read":
        _reader_main(sys.argv[2], sys.argv[3])
    else:
        run_tests()
