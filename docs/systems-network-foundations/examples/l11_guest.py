"""在容器裡執行。就緒檔在掛載、停止處理與 bind 都完成後才換上名稱。"""

from __future__ import annotations

import json
import os
import signal
import socket
import sys
import time
from pathlib import Path


def main() -> None:
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "/out")
    out.mkdir(parents=True, exist_ok=True)
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.bind(("127.0.0.1", 0))
    Path("/tmp/only-inside.txt").write_text("hidden\n", encoding="utf-8")
    (out / "mounted.txt").write_text("from-container\n", encoding="utf-8")
    if os.environ.get("SNF_L11_PAUSE") == "before-ready":
        time.sleep(0.7)

    def on_term(_signum: int, _frame: object) -> None:
        (out / "stopped.txt").write_text("sigterm\n", encoding="utf-8")
        raise SystemExit(0)

    signal.signal(signal.SIGTERM, on_term)
    report = {
        "pid": os.getpid(),
        "ppid": os.getppid(),
        "hostname": socket.gethostname(),
        "bind": list(listener.getsockname()),
        "ready": True,
    }
    temporary = out / ".guest.json.partial"
    temporary.write_text(json.dumps(report), encoding="utf-8")
    os.replace(temporary, out / "guest.json")
    print("READY", flush=True)
    signal.pause()


if __name__ == "__main__":
    main()
