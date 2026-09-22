# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Compare synthetic result rows; no DB access, no normalization of values."""
import argparse
import json
from pathlib import Path


def unique_object(pairs):
    result = {}
    for name, value in pairs:
        if name in result:
            raise ValueError(f"duplicate JSON field: {name}")
        result[name] = value
    return result


def reject_constant(value):
    raise ValueError(f"non-JSON constant: {value}")


def load_rows(path):
    rows = {}
    for line_no, line in enumerate(Path(path).read_text(encoding="utf-8-sig").splitlines(), 1):
        if not line.strip():
            raise ValueError(f"{path}:{line_no}: blank record")
        row = json.loads(line, object_pairs_hook=unique_object, parse_constant=reject_constant)
        if not isinstance(row, dict) or type(row.get("job_id")) is not int or row["job_id"] <= 0:
            raise ValueError(f"{path}:{line_no}: positive integer job_id required")
        if row["job_id"] in rows:
            raise ValueError(f"{path}:{line_no}: duplicate job_id {row['job_id']}")
        canonical(row)  # Also reject overflowed JSON numbers such as 1e999.
        rows[row["job_id"]] = row
    return rows


def canonical(value):
    # JSON serialization distinguishes bool/int, null/missing, and int/float.
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def compare(before, after):
    old, new = set(before), set(after)
    return {
        "added": sorted(new - old),
        "missing": sorted(old - new),
        "changed": [{"job_id": key, "before": before[key], "after": after[key]}
                    for key in sorted(old & new) if canonical(before[key]) != canonical(after[key])],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("before", type=Path)
    parser.add_argument("after", type=Path)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    try:
        report = compare(load_rows(args.before), load_rows(args.after))
        # Exclusive create: never overwrite input or earlier evidence.
        with args.out.open("x", encoding="utf-8") as stream:
            json.dump(report, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
    except (OSError, ValueError) as error:
        print(f"invalid: {error}")
        return 2
    different = any(report.values())
    print("DIFFERENT" if different else "EQUAL")
    return 1 if different else 0


if __name__ == "__main__":
    raise SystemExit(main())
