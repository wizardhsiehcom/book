"""L04：把名稱解析、TCP 連線、HTTP 狀態與內容分成四層看。只使用 loopback。"""

from __future__ import annotations

import socket
import subprocess
import sys
from pathlib import Path

from labutil import popen_group, reap

HERE = Path(__file__).resolve().parent


def server_main() -> None:
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listener.bind(("127.0.0.1", 0))
    listener.listen(16)
    print(listener.getsockname()[1], flush=True)
    while True:
        try:
            client, _ = listener.accept()
        except OSError:
            return
        with client:
            data = b""
            client.settimeout(1.0)
            try:
                while b"\r\n\r\n" not in data and len(data) < 8192:
                    chunk = client.recv(1024)
                    if not chunk:
                        break
                    data += chunk
            except TimeoutError:
                pass
            line = data.split(b"\r\n", 1)[0].decode("iso-8859-1", "replace")
            parts = line.split(" ")
            target = parts[1] if len(parts) > 1 else ""
            if target == "/ok":
                status, body = "200 OK", b"picture-ok"
            elif target == "/missing":
                status, body = "404 Not Found", b"missing"
            else:
                status, body = "400 Bad Request", b"bad"
            head = (
                f"HTTP/1.1 {status}\r\n"
                f"Content-Length: {len(body)}\r\n"
                "Connection: close\r\n\r\n"
            ).encode("ascii")
            client.sendall(head + body)


def _http_get(port: int, path: str) -> tuple[str, bytes]:
    with socket.create_connection(("127.0.0.1", port), timeout=2) as sock:
        sock.sendall(f"GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n".encode())
        data = b""
        while True:
            chunk = sock.recv(1024)
            if not chunk:
                break
            data += chunk
    head, _, body = data.partition(b"\r\n\r\n")
    status = head.split(b"\r\n", 1)[0].decode()
    return status, body


def run_tests() -> None:
    loopback = socket.getaddrinfo("localhost", None, type=socket.SOCK_STREAM)
    addresses = {item[4][0] for item in loopback}
    if not addresses.intersection({"127.0.0.1", "::1"}):
        raise SystemExit(f"FAIL localhost 應解析到 loopback：{addresses}")
    try:
        socket.getaddrinfo("no-such-name.invalid", 80, type=socket.SOCK_STREAM)
    except socket.gaierror:
        pass
    else:
        raise SystemExit("FAIL .invalid 不應解析成功")

    probe = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    probe.bind(("127.0.0.1", 0))
    closed_port = probe.getsockname()[1]
    probe.close()
    try:
        socket.create_connection(("127.0.0.1", closed_port), timeout=2)
    except ConnectionRefusedError:
        pass
    else:
        raise SystemExit("FAIL 沒有 listener 時不應連上")

    proc = popen_group(
        [sys.executable, str(HERE / "l04_layers.py"), "--server"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    try:
        assert proc.stdout is not None
        port = int(proc.stdout.readline().strip())
        # 只建立 TCP，不送 HTTP。連上不等於有狀態碼。
        with socket.create_connection(("127.0.0.1", port), timeout=2) as bare:
            bare.sendall(b"not-http")
            bare.shutdown(socket.SHUT_WR)
            raw = b""
            bare.settimeout(1)
            try:
                while True:
                    chunk = bare.recv(1024)
                    if not chunk:
                        break
                    raw += chunk
            except TimeoutError:
                pass
        if raw.startswith(b"HTTP/1.1 200"):
            raise SystemExit("FAIL 不是 HTTP 請求不應得到 200")
        ok_status, ok_body = _http_get(port, "/ok")
        missing_status, missing_body = _http_get(port, "/missing")
        if ok_status != "HTTP/1.1 200 OK" or ok_body != b"picture-ok":
            raise SystemExit(f"FAIL 正常內容：{ok_status} {ok_body!r}")
        if missing_status != "HTTP/1.1 404 Not Found" or missing_body != b"missing":
            raise SystemExit(f"FAIL HTTP 錯誤應與連線錯誤分開：{missing_status}")
    finally:
        reap(proc, timeout=1)
    print("L04 PASS", sorted(addresses))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--server":
        server_main()
    else:
        run_tests()
