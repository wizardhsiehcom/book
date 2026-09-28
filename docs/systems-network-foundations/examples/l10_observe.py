"""L10：先預測瓶頸，再用這支程式自己的樣本核對。樣本不能外推產線效能。"""

from __future__ import annotations

import json
import math
import platform
import queue
import threading
import time
from pathlib import Path


def nearest_rank(samples: list[float], fraction: float) -> float:
    """最近名次：k = ceil(p * n)，取排序後第 k 個（從 1 數）。n 必須一起報告。"""
    if not samples or not 0 < fraction <= 1:
        raise ValueError("empty sample or fraction")
    ordered = sorted(samples)
    rank = max(1, math.ceil(fraction * len(ordered)))
    return ordered[rank - 1]


def _blank() -> dict[str, float]:
    return {"cpu_s": 0.0, "io_wait_s": 0.0, "queue_wait_s": 0.0, "lock_wait_s": 0.0}


def measure_cpu() -> dict[str, float]:
    """累積約 0.05 秒的 process time。迴圈次數隨機器而變，所以答案看時間不看次數。"""
    sample = _blank()
    cpu = time.process_time()
    total = 0
    number = 0
    while time.process_time() - cpu < 0.05 and number < 80_000_000:
        total += number
        number += 1
    if number == 0 or total < 0:
        raise SystemExit("FAIL cpu")
    sample["cpu_s"] = time.process_time() - cpu
    return sample


def measure_io() -> dict[str, float]:
    sample = _blank()
    cpu = time.process_time()
    started = time.perf_counter()
    time.sleep(0.12)
    sample["cpu_s"] = time.process_time() - cpu
    sample["io_wait_s"] = time.perf_counter() - started
    return sample


def measure_queue() -> dict[str, float]:
    sample = _blank()
    jobs: queue.Queue[str] = queue.Queue()
    holder = {"wait": 0.0}

    def consumer() -> None:
        started = time.perf_counter()
        item = jobs.get()
        holder["wait"] = time.perf_counter() - started
        if item != "AOI-SYN":
            raise SystemExit("FAIL queue item")

    thread = threading.Thread(target=consumer)
    thread.start()
    time.sleep(0.12)
    jobs.put("AOI-SYN")
    thread.join(timeout=1)
    sample["queue_wait_s"] = holder["wait"]
    return sample


def measure_lock() -> dict[str, float]:
    sample = _blank()
    lock = threading.Lock()
    lock.acquire()
    holder = {"wait": 0.0}

    def waiter() -> None:
        started = time.perf_counter()
        with lock:
            holder["wait"] = time.perf_counter() - started

    thread = threading.Thread(target=waiter)
    thread.start()
    time.sleep(0.12)
    lock.release()
    thread.join(timeout=1)
    sample["lock_wait_s"] = holder["wait"]
    return sample


def classify(sample: dict[str, float]) -> str:
    waits = (sample["io_wait_s"], sample["queue_wait_s"], sample["lock_wait_s"])
    if sample["cpu_s"] >= 0.02 and sample["cpu_s"] >= max(waits):
        return "cpu"
    if sample["lock_wait_s"] >= 0.08 and sample["cpu_s"] < 0.05:
        return "lock"
    if sample["queue_wait_s"] >= 0.08 and sample["cpu_s"] < 0.05:
        return "queue"
    if sample["io_wait_s"] >= 0.08 and sample["cpu_s"] < 0.05:
        return "io"
    return "unknown"


def observe(job_id: str, stage: str, sample: dict[str, float]) -> list[dict[str, object]]:
    """同一工作的三種紀錄：log 記事件，metric 記可彙總的數，trace 記這一段花了多久。"""
    duration = max(sample["cpu_s"], sample["io_wait_s"], sample["queue_wait_s"], sample["lock_wait_s"])
    return [
        {"kind": "log", "job": job_id, "stage": stage, "note": "stage-finished"},
        {"kind": "metric", "job": job_id, "stage": stage, "name": "stage_s", "value": duration},
        {"kind": "trace", "job": job_id, "stage": stage, "seconds": duration},
    ]


def run_tests() -> None:
    job_id = "AOI-SYN-OBS"
    cpu_samples = [measure_cpu()["cpu_s"] for _ in range(7)]
    stages = {
        "cpu": measure_cpu(),
        "io": measure_io(),
        "queue": measure_queue(),
        "lock": measure_lock(),
    }
    kinds = {name: classify(sample) for name, sample in stages.items()}
    if kinds != {"cpu": "cpu", "io": "io", "queue": "queue", "lock": "lock"}:
        raise SystemExit(f"FAIL 預測與觀測不一致：{kinds}")
    median = nearest_rank(cpu_samples, 0.5)
    if nearest_rank(list(cpu_samples), 0.5) != median:
        raise SystemExit("FAIL 樣本無法重算分位數")
    records: list[dict[str, object]] = []
    for name, sample in stages.items():
        records.extend(observe(job_id, name, sample))
    jobs = {str(row["job"]) for row in records}
    stage_names = {str(row["stage"]) for row in records}
    kinds_seen = {str(row["kind"]) for row in records}
    if jobs != {job_id} or stage_names != set(stages) or kinds_seen != {"log", "metric", "trace"}:
        raise SystemExit(f"FAIL 工作紀錄沒有對上：{records}")
    label = "macos" if platform.system() == "Darwin" else "linux"
    out = Path(__file__).resolve().parents[1] / "verification" / f"l10-cpu-samples-{label}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    saved = {
        "job": job_id,
        "n": len(cpu_samples),
        "quantile": "nearest-rank",
        "fraction": 0.5,
        "cpu_s": cpu_samples,
        "median": median,
        "records": records,
    }
    out.write_text(json.dumps(saved) + "\n", encoding="utf-8")
    reread = json.loads(out.read_text(encoding="utf-8"))
    if nearest_rank([float(item) for item in reread["cpu_s"]], 0.5) != median:
        raise SystemExit("FAIL 寫出的樣本重算不一致")
    print(
        "L10 PASS",
        f"job={job_id}",
        f"n={len(cpu_samples)}",
        f"cpu_median_s={median:.4f}",
        "quantile=nearest-rank",
        f"classes={kinds}",
        f"samples={out.name}",
    )


if __name__ == "__main__":
    run_tests()
