"""只修改自己建立的暫存檔案；不執行檔案中的程式。"""
from pathlib import Path
from tempfile import TemporaryDirectory, NamedTemporaryFile
import os


def replace_unique(path, old, new):
    """可信呼叫者提供檔案；只接受非空原文及唯一匹配。"""
    if not isinstance(old, bytes) or not old or not isinstance(new, bytes):
        raise ValueError("old 必須是非空 bytes，new 必須是 bytes")
    content = path.read_bytes()
    first = content.find(old)
    if first < 0:
        raise ValueError("找不到原文；需要恰好一次")
    if content.find(old, first + 1) >= 0:
        raise ValueError("匹配多次；需要恰好一次")
    # ponytail: 單一寫入者的暫存檔實驗；共用檔案需鎖定或版本衝突檢查。
    temporary = None
    try:
        with NamedTemporaryFile(dir=path.parent, delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(content.replace(old, new, 1))
        os.replace(temporary, path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def demo():
    original = b"def shipping_fee(total):\r\n    return 0 if total > 1000 else 60\r\n"
    old, new = b"total > 1000", b"total >= 1000"
    with TemporaryDirectory() as directory:
        path = Path(directory) / "price.py"
        for label, content, search, expected in [
            ("唯一匹配", original, old, original.replace(old, new)),
            ("找不到原文", original, b"total > 2000", None),
            ("兩處匹配", original + original, old, None),
            ("重疊匹配", b"aaa", b"aa", None),
            ("空白搜尋字串", original, b"", None),
        ]:
            path.write_bytes(content)
            try:
                replace_unique(path, search, new)
            except ValueError as error:
                assert expected is None
                assert path.read_bytes() == content
                print(f"{label}: 拒絕，原檔不變（{error}）")
            else:
                assert expected is not None
                assert path.read_bytes() == expected
                print(f"{label}: 修改成功，換行保留")
    print("PASS: edit checks")


if __name__ == "__main__":
    demo()
