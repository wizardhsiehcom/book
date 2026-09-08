# manifest.py
from __future__ import annotations
import hashlib, sys
from pathlib import Path

ROOT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("releases/r001")
MANIFEST = ROOT / "SHA256SUMS.txt"
TRACK = [
    Path("model/best.onnx"),
    Path("config/dataset.yaml"),
    Path("freeze/classes.txt"),
    Path("freeze/requirements.lock.txt"),
]

def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def create() -> None:
    lines = []
    for rel in TRACK:
        p = ROOT / rel
        if not p.is_file():
            raise SystemExit(f"MISSING {rel}")
        lines.append(f"{sha256(p)}  {rel.as_posix()}\n")
    MANIFEST.write_text("".join(lines), encoding="utf-8")
    print("wrote", MANIFEST)

def verify() -> None:
    if not MANIFEST.is_file():
        raise SystemExit("MISSING SHA256SUMS.txt")
    expected = {}
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        digest, name = line.split(None, 1)
        expected[Path(name)] = digest.lower()
    if MANIFEST.name in {p.name for p in expected}:
        raise SystemExit("manifest must not hash itself")
    for rel in TRACK:
        if rel not in expected:
            raise SystemExit(f"UNLISTED {rel}")
        p = ROOT / rel
        if not p.is_file():
            raise SystemExit(f"MISSING {rel}")
        got = sha256(p)
        if got != expected[rel]:
            raise SystemExit(f"HASH_MISMATCH {rel} expected={expected[rel]} got={got}")
    extra = set(expected) - set(TRACK)
    if extra:
        raise SystemExit(f"UNEXPECTED {sorted(extra)}")
    print("OK", len(TRACK), "files")

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "create":
        create()
    elif cmd == "verify":
        verify()
    else:
        raise SystemExit("usage: python manifest.py create|verify [release_root]")
