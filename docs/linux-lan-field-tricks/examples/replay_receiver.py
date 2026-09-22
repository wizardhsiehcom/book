"""本書的無副作用實驗端點；Python 3.10+，只用於隔離測試網路。"""
import argparse
import hashlib
from http.server import BaseHTTPRequestHandler, HTTPServer
import json


class Receiver(BaseHTTPRequestHandler):
    timeout = 5

    def do_POST(self):
        if self.path != "/test":
            self.send_error(404)
            return
        lengths = self.headers.get_all("Content-Length", [])
        if self.headers.get("Transfer-Encoding") or len(lengths) != 1:
            self.send_error(400, "One Content-Length required; no Transfer-Encoding")
            return
        if not lengths[0].isascii() or not lengths[0].isdigit():
            self.send_error(400, "Invalid Content-Length")
            return
        # 比較前先限制字串長度，避免超長整數造成例外。
        if len(lengths[0]) > 5 or not 0 < int(lengths[0]) <= 65536:
            self.send_error(413)
            return
        if self.headers.get_content_type() != "application/json":
            self.send_error(415)
            return
        if self.headers.get("Content-Encoding"):
            self.send_error(415, "Content-Encoding unsupported")
            return
        size = int(lengths[0])
        try:
            body = self.rfile.read(size)
            if len(body) != size:
                raise ValueError("Incomplete body")
            value = json.loads(body.decode("utf-8"))
            if not isinstance(value, dict):
                raise ValueError("JSON object required")
        except TimeoutError:
            self.send_error(408)
            return
        except (ValueError, RecursionError):
            self.send_error(400, "UTF-8 JSON object required")
            return
        result = {"bytes": size, "sha256": hashlib.sha256(body).hexdigest()}
        reply = json.dumps(result).encode("ascii")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(reply)))
        self.end_headers()
        self.wfile.write(reply)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8081)
    args = parser.parse_args()
    # ponytail: 單執行緒逐筆處理；只驗證重播內容，並行負載請用正式測試服務。
    with HTTPServer((args.bind, args.port), Receiver) as server:
        print(f"Test endpoint: http://{args.bind}:{args.port}/test", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
