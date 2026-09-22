"""執行 python3 check_receiver.py；本機 HTTP 成功／拒絕檢查，不代表 LAN 測試。"""
import hashlib
from http.client import HTTPConnection
from http.server import HTTPServer
import json
from threading import Thread
from replay_receiver import Receiver


def request(server, body, path="/test", headers=None):
    client = HTTPConnection("127.0.0.1", server.server_port, timeout=3)
    try:
        client.request("POST", path, body, headers or {"Content-Type": "application/json"})
        response = client.getresponse()
        return response.status, response.read()
    finally:
        client.close()


if __name__ == "__main__":
    with HTTPServer(("127.0.0.1", 0), Receiver) as server:
        worker = Thread(target=server.serve_forever, daemon=True)
        worker.start()
        try:
            body = '{"machine":"C1","value":7}\n'.encode("utf-8")
            first = request(server, body)
            assert first == request(server, body)
            assert first[0] == 200
            assert json.loads(first[1]) == {
                "bytes": len(body), "sha256": hashlib.sha256(body).hexdigest()
            }
            changed = request(server, body.replace(b"7", b"8"))
            assert changed[0] == 200 and changed[1] != first[1]
            assert request(server, b"broken")[0] == 400
            assert request(server, b"[]")[0] == 400
            assert request(server, b"\xff")[0] == 400
            assert request(server, body, "/missing")[0] == 404
            assert request(server, body, headers={"Content-Type": "text/plain"})[0] == 415
            assert request(server, b"x" * 65537)[0] == 413
            assert request(server, body, headers={
                "Content-Type": "application/json", "Transfer-Encoding": "chunked"
            })[0] == 400
            print("PASS: repeat, changed input, malformed and unsupported input")
        finally:
            server.shutdown()
            worker.join()
