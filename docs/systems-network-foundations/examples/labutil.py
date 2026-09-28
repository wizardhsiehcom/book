"""各實驗共用的暫存目錄與程序回收。第一次遇到的觀念在呼叫端註解。"""

from __future__ import annotations

import os
import signal
import subprocess
import tempfile
from pathlib import Path


def repo_examples_dir() -> Path:
    return Path(__file__).resolve().parent


def make_workdir(prefix: str) -> tempfile.TemporaryDirectory[str]:
    """每個實驗用自己的暫存目錄，結束時整棵刪掉。"""
    return tempfile.TemporaryDirectory(prefix=prefix)


def reap(proc: subprocess.Popen[str], timeout: float = 2.0) -> int:
    """確保這個 Popen 被 wait。逾時就先 SIGTERM，再 SIGKILL，最後一定 wait。"""
    if proc.poll() is not None:
        return proc.returncode if proc.returncode is not None else 0
    try:
        return proc.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        _terminate_tree(proc)
    try:
        return proc.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        _kill_tree(proc)
        return proc.wait(timeout=timeout)


def _terminate_tree(proc: subprocess.Popen[str]) -> None:
    if os.name == "nt":
        proc.terminate()
        return
    try:
        os.killpg(proc.pid, signal.SIGTERM)
    except (ProcessLookupError, PermissionError):
        proc.terminate()


def _kill_tree(proc: subprocess.Popen[str]) -> None:
    if os.name == "nt":
        proc.kill()
        return
    try:
        os.killpg(proc.pid, signal.SIGKILL)
    except (ProcessLookupError, PermissionError):
        proc.kill()


def popen_group(argv: list[str], **kwargs: object) -> subprocess.Popen[str]:
    """start_new_session 讓這個 child 成為新的 process group，方便整組回收。"""
    return subprocess.Popen(
        argv,
        start_new_session=True,
        text=True,
        **kwargs,  # type: ignore[arg-type]
    )
