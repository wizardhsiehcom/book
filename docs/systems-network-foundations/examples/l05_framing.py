"""L05：4 byte 大端長度加上 UTF-8 JSON。切在哪裡都要拼回同一筆，或明確拒絕。

契約版本是 1。正文必須是物件，且含字串欄位 id。對端提早關閉時，讀取在總期限內以截斷失敗。
"""

from __future__ import annotations

import json
import socket
import struct
import subprocess
import sys
import time
from pathlib import Path

MAX_BYTES = 64
VERSION = 1

HERE = Path(__file__).resolve().parent


class FrameError(ValueError):
    pass


def validate(message: object) -> dict[str, object]:
    """必填欄位與版本。JSON 能解析還不夠。"""
    if not isinstance(message, dict):
        raise FrameError("not-object")
    if message.get("v") != VERSION:
        raise FrameError("bad-version")
    job_id = message.get("id")
    if not isinstance(job_id, str) or job_id == "":
        raise FrameError("bad-id")
    return message


def encode(obj: dict[str, object]) -> bytes:
    body_obj = dict(obj)
    body_obj.setdefault("v", VERSION)
    validate(body_obj)
    body = json.dumps(body_obj, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    if len(body) > MAX_BYTES:
        raise FrameError("too-large")
    return struct.pack(">I", len(body)) + body


def push(buffer: bytes, chunk: bytes) -> tuple[list[dict[str, object]], bytes]:
    """把新位元組接上，取出已經完整且通過契約的訊息。"""
    buffer += chunk
    messages: list[dict[str, object]] = []
    while True:
        if len(buffer) < 4:
            return messages, buffer
        (size,) = struct.unpack(">I", buffer[:4])
        if size > MAX_BYTES:
            raise FrameError(f"declared {size} > {MAX_BYTES}")
        if len(buffer) < 4 + size:
            return messages, buffer
        body = buffer[4 : 4 + size]
        buffer = buffer[4 + size :]
        try:
            text = body.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise FrameError("bad-utf8") from exc
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as exc:
            raise FrameError("bad-json") from exc
        messages.append(validate(parsed))
    return messages, buffer


def finish(buffer: bytes) -> list[dict[str, object]]:
    messages, rest = push(buffer, b"")
    if rest:
        raise FrameError("truncated")
    return messages


def read_frame(sock: socket.socket, timeout: float) -> dict[str, object]:
    """在總期限內讀一筆。對端關閉且緩衝區不完整時，立刻以截斷失敗。"""
    deadline = time.monotonic() + timeout
    buffer = b""
    while True:
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise FrameError("deadline")
        sock.settimeout(remaining)
        try:
            chunk = sock.recv(64)
        except TimeoutError as exc:
            raise FrameError("deadline") from exc
        if chunk == b"":
            try:
                messages = finish(buffer)
            except FrameError as exc:
                raise FrameError("truncated") from exc
            if len(messages) != 1:
                raise FrameError("truncated")
            return messages[0]
        messages, buffer = push(buffer, chunk)
        if messages:
            if len(messages) != 1 or buffer:
                raise FrameError("extra")
            return messages[0]


def _raw(text: str) -> bytes:
    body = text.encode("utf-8")
    return struct.pack(">I", len(body)) + body


def _expect_error(feed: bytes, label: str) -> None:
    try:
        finish(feed)
    except FrameError:
        return
    raise SystemExit(f"FAIL 應拒絕 {label}")


def parser_tests() -> None:
    frame = encode({"id": "AOI-SYN-001", "ok": True})
    expected = {"v": VERSION, "id": "AOI-SYN-001", "ok": True}
    for cut in range(len(frame) + 1):
        messages, rest = push(b"", frame[:cut])
        more, rest = push(rest, frame[cut:])
        messages += more
        if messages != [expected] or rest:
            raise SystemExit(f"FAIL 切點 {cut}：{messages} {rest!r}")
    two, rest = push(b"", frame + frame)
    if len(two) != 2 or rest:
        raise SystemExit("FAIL 連續兩筆應一次取出")
    _expect_error(frame[:6], "truncated")
    _expect_error(struct.pack(">I", MAX_BYTES + 1) + b"x", "oversize")
    _expect_error(struct.pack(">I", 1) + b"\xff", "bad-utf8")
    _expect_error(struct.pack(">I", 1) + b"{", "bad-json")
    _expect_error(_raw("{}"), "missing-fields")
    _expect_error(_raw('{"v":1}'), "missing-id")
    _expect_error(_raw('{"v":1,"id":1}'), "bad-id-type")
    _expect_error(_raw("[]"), "not-object")
    _expect_error(_raw("null"), "null")
    _expect_error(_raw('{"v":2,"id":"AOI-SYN-001"}'), "bad-version")


def _peer_close_tests() -> None:
    """回覆標頭未到齊，以及正文未到齊，對端關閉都要在期限內失敗。"""
    samples = (
        b"\x00\x00",
        struct.pack(">I", 10) + b"abc",
    )
    for sample in samples:
        left, right = socket.socketpair()
        try:
            right.sendall(sample)
            right.close()
            started = time.monotonic()
            try:
                read_frame(left, 1.0)
            except FrameError as exc:
                if "truncated" not in str(exc):
                    raise SystemExit(f"FAIL 提早關閉應為截斷：{exc}") from exc
            else:
                raise SystemExit("FAIL 提早關閉仍交出訊息")
            if time.monotonic() - started >= 1.0:
                raise SystemExit("FAIL 提早關閉沒有在期限內結束")
        finally:
            left.close()
            right.close()


def server_main(mode: str) -> None:
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.bind(("127.0.0.1", 0))
    listener.listen(1)
    print(listener.getsockname()[1], flush=True)
    client, _ = listener.accept()
    buffer = b""
    client.settimeout(2)
    try:
        while True:
            chunk = client.recv(1)  # 每次一個 byte，刻意不跟傳送端的 send 次數對齊。
            if not chunk:
                break
            messages, buffer = push(buffer, chunk)
            for message in messages:
                if mode == "close-silent":
                    return
                if mode == "close-partial":
                    client.sendall(struct.pack(">I", 20) + b"xx")
                    return
                client.sendall(encode({"id": str(message["id"]), "seen": str(message["id"])}))
        finish(buffer)
    except FrameError as exc:
        client.sendall(encode({"id": "rejected", "error": str(exc)}))
    finally:
        client.close()
        listener.close()


def _tcp_once(mode: str, job_id: str) -> dict[str, object] | None:
    from labutil import popen_group, reap

    proc = popen_group(
        [sys.executable, str(HERE / "l05_framing.py"), "--server", mode],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    try:
        assert proc.stdout is not None
        port_line = proc.stdout.readline().strip()
        if not port_line:
            raise SystemExit(f"FAIL server 沒有印出 port：{proc.stderr}")
        port = int(port_line)
        started = time.monotonic()
        with socket.create_connection(("127.0.0.1", port), timeout=2) as sock:
            payload = encode({"id": job_id})
            if mode == "reply":
                for index in range(len(payload)):
                    sock.sendall(payload[index : index + 1])
                return read_frame(sock, 2.0)
            sock.sendall(payload)
            try:
                read_frame(sock, 1.0)
            except FrameError as exc:
                if "truncated" not in str(exc):
                    raise SystemExit(f"FAIL {mode} 應為截斷：{exc}") from exc
            else:
                raise SystemExit(f"FAIL {mode} 仍交出訊息")
            if time.monotonic() - started >= 1.0:
                raise SystemExit(f"FAIL {mode} 沒有在期限內結束")
            return None
    finally:
        reap(proc, timeout=2)


def run_tests() -> None:
    parser_tests()
    _peer_close_tests()
    silent = _tcp_once("close-silent", "AOI-SYN-010")
    partial = _tcp_once("close-partial", "AOI-SYN-011")
    if silent is not None or partial is not None:
        raise SystemExit("FAIL 提早關閉不該有訊息")
    message = _tcp_once("reply", "AOI-SYN-009")
    if message != {"v": VERSION, "id": "AOI-SYN-009", "seen": "AOI-SYN-009"}:
        raise SystemExit(f"FAIL TCP 組幀：{message}")
    print("L05 PASS")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--server":
        server_main(sys.argv[2] if len(sys.argv) > 2 else "reply")
    else:
        run_tests()
