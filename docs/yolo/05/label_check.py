#!/usr/bin/env python3
import argparse, math, os, sys, tempfile

TOL = 1e-6

def check_line(path, i, line, n):
    p = line.split()
    if len(p) != 5:
        return f"{path}:{i}: expected 5 fields, got {len(p)}"
    c = p[0]
    if not c.isascii() or not c.isdigit():
        return f"{path}:{i}: class is not an ASCII decimal integer"
    ci = int(c)
    if not 0 <= ci < n:
        return f"{path}:{i}: class {ci} not in [0, {n})"
    nums = []
    for s in p[1:]:
        try:
            x = float(s)
        except ValueError:
            return f"{path}:{i}: invalid number {s!r}"
        if not math.isfinite(x):
            return f"{path}:{i}: non-finite {s!r}"
        nums.append(x)
    xc, yc, w, h = nums
    if not (w > 0 and h > 0):
        return f"{path}:{i}: w/h must be > 0"
    l, r, t, b = xc - w / 2, xc + w / 2, yc - h / 2, yc + h / 2
    if l < -TOL or t < -TOL or r > 1 + TOL or b > 1 + TOL:
        return f"{path}:{i}: box edges out of [0, 1]"
    return None

def check_file(path, n):
    errs = []
    try:
        with open(path, encoding="utf-8") as f:
            for i, line in enumerate(f, 1):
                if not line.strip():
                    continue
                e = check_line(path, i, line, n)
                if e:
                    errs.append(e)
    except UnicodeDecodeError:
        errs.append(f"{path}: invalid UTF-8")
    except OSError as e:
        errs.append(f"{path}: {e.strerror}")
    return errs

def collect(paths):
    files = []
    errs = []
    for p in paths:
        if not os.path.exists(p):
            errs.append(p)
            continue
        if os.path.isfile(p):
            files.append(p)
            continue
        if not os.path.isdir(p):
            errs.append(p)
            continue
        found = []
        def onerror(e, _errs=errs):
            name = getattr(e, "filename", None)
            _errs.append(name if name else str(e))
        for root, _dirs, names in os.walk(p, followlinks=False, onerror=onerror):
            for name in names:
                if name.endswith(".txt"):
                    fp = os.path.join(root, name)
                    if os.path.isfile(fp):
                        found.append(fp)
        found.sort()
        if not found:
            errs.append(p)
        else:
            files.extend(found)
    return files, errs

def run(paths, n):
    files, errs = collect(paths)
    if errs:
        return errs, 0
    for f in files:
        errs.extend(check_file(f, n))
    return errs, len(files)

def _w(path, text):
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)

def self_test():
    with tempfile.TemporaryDirectory() as d:
        n = 2
        ok = os.path.join(d, "ok.txt")
        _w(ok, "0 0.5 0.5 0.2 0.2\n1 0.3 0.4 0.1 0.1\n")
        e, c = run([ok], n)
        assert not e and c == 1
        empty = os.path.join(d, "empty.txt")
        _w(empty, "")
        e, c = run([empty], n)
        assert not e and c == 1
        bad = os.path.join(d, "bad.txt")
        _w(bad, "0 0.5 0.5 -0.1 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0 0.5 0.5 0 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0 0.5 0.5 nan 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0 0.5 0.5 inf 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0 0.0 0.5 0.2 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0 1.0 0.5 0.2 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0 0.5 0.0 0.2 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0 0.5 1.0 0.2 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "0.5 0.5 0.5 0.2 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        _w(bad, "² 0.5 0.5 0.2 0.2\n")
        e, _ = run([bad], n)
        assert e and ":1:" in e[0]
        ed = os.path.join(d, "empty_dir")
        os.mkdir(ed)
        e, _ = run([ed], n)
        assert e
        e, _ = run([os.path.join(d, "missing.txt")], n)
        assert e
    print("self-test ok")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--classes", type=int)
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        self_test()
        return 0
    if a.classes is None or a.classes < 1:
        print("--classes must be a positive integer", file=sys.stderr)
        return 1
    if not a.paths:
        print("paths required", file=sys.stderr)
        return 1
    errs, count = run(a.paths, a.classes)
    if errs:
        print("\n".join(errs), file=sys.stderr)
        return 1
    print(count)
    return 0

if __name__ == "__main__":
    sys.exit(main())
