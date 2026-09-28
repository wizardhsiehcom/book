"""終點題的可執行起點。

開關在 fixtures/station-jobs.json，合成檔在 fixtures/measurements/。
容量、半檔是否拒收、丟掉回覆時計入哪一格，留在下面三個常數。
改契約之後，用同一份輸入看哪一筆帳先對不上。
程式印出的帳是這組開關的觀察，書面理由要另外寫。
"""

from __future__ import annotations

import json
import threading
import time
from pathlib import Path

# 讀者可以改的政策。預設對得上這份合成輸入。
CAPACITY = 2
REJECT_PARTIAL = True
DROPPED_REPLY_STATE = "unknown"

HERE = Path(__file__).resolve().parent
FIXTURES = HERE.parent / "fixtures"
MAGIC = b"AOI1\n"
DONE = b"\nCOMPLETE\n"


def file_complete(path: Path) -> bool:
    if not path.exists():
        return False
    data = path.read_bytes()
    if not data.startswith(MAGIC) or DONE not in data:
        return False
    return data.endswith(DONE)


def run() -> list[dict[str, str]]:
    spec = json.loads((FIXTURES / "station-jobs.json").read_text(encoding="utf-8"))
    capacity = CAPACITY
    rows: list[dict[str, str]] = []
    inflight: list[tuple[str, threading.Event]] = []
    phase = "live"

    def settle_finished() -> None:
        nonlocal inflight
        still: list[tuple[str, threading.Event]] = []
        for job_id, event in inflight:
            if event.is_set():
                continue
            still.append((job_id, event))
        inflight = still

    def start_worker(job_id: str, delay_s: float) -> threading.Event:
        event = threading.Event()

        def work() -> None:
            time.sleep(delay_s)
            event.set()

        threading.Thread(target=work, daemon=True).start()
        inflight.append((job_id, event))
        return event

    for job in spec["jobs"]:
        if job["arrive"] != "before-stop":
            continue
        settle_finished()
        path = FIXTURES / "measurements" / job["file"]
        if REJECT_PARTIAL and not file_complete(path):
            rows.append({"id": job["id"], "accepted": "no", "worker": "none", "client": "rejected-partial"})
            continue
        if len(inflight) >= capacity:
            rows.append({"id": job["id"], "accepted": "no", "worker": "none", "client": "rejected-full"})
            continue
        event = start_worker(job["id"], float(job["delay_s"]))
        if event.wait(0.05):
            worker = "completed"
            settle_finished()
        else:
            worker = "accepted"
        client = DROPPED_REPLY_STATE if job["drop_reply"] else ("received" if worker == "completed" else "inflight")
        rows.append({"id": job["id"], "accepted": "yes", "worker": worker, "client": client})

    phase = "draining"
    deadline = time.monotonic() + float(spec["drain_s"])
    for row in rows:
        if row["worker"] != "accepted":
            continue
        remaining = deadline - time.monotonic()
        matched = [event for job_id, event in inflight if job_id == row["id"]]
        finished = bool(matched) and matched[0].wait(max(0.0, remaining))
        if finished:
            row["worker"] = "completed"
            if row["client"] == "inflight":
                row["client"] = "received"
        else:
            row["worker"] = "incomplete"
            row["client"] = "incomplete"
    phase = "stopped"
    for job in spec["jobs"]:
        if job["arrive"] != "during-stop":
            continue
        if phase != "live":
            rows.append({"id": job["id"], "accepted": "no", "worker": "none", "client": "rejected-stopped"})
    return rows


def run_tests() -> None:
    rows = {row["id"]: row for row in run()}
    if rows["M-3"]["client"] != "rejected-partial":
        raise SystemExit(f"FAIL 半檔沒有被擋下：{rows['M-3']}")
    if rows["M-4"]["worker"] != "completed" or rows["M-4"]["client"] != "unknown":
        raise SystemExit(f"FAIL 回覆遺失：{rows['M-4']}")
    if rows["M-5"]["worker"] != "incomplete":
        raise SystemExit(f"FAIL 停止時的在途工作：{rows['M-5']}")
    if rows["M-6"]["accepted"] != "no":
        raise SystemExit(f"FAIL 停止期間仍接受新工作：{rows['M-6']}")
    print("STATION PASS", json.dumps(list(rows.values()), ensure_ascii=False))


if __name__ == "__main__":
    run_tests()
