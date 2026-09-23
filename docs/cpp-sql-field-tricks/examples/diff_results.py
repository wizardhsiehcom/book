# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""比較兩份合成結果。不連資料庫，也不把不同寫法的值偷偷折成同一個。"""
import argparse
import json
from pathlib import Path


def unique_object(pairs):
    """同一列 JSON 裡，同一個欄位名出現兩次就拒絕。不要讓後者蓋掉前者。"""
    result = {}
    for name, value in pairs:
        if name in result:
            raise ValueError(f"duplicate JSON field: {name}")
        result[name] = value
    return result


def reject_constant(value):
    """NaN、Infinity 這類不是普通 JSON 值的寫法，直接當壞資料。"""
    raise ValueError(f"non-JSON constant: {value}")


def load_rows(path):
    """一列一行。空行不行；job_id 必須是正整數，而且整份檔案裡不能重複。"""
    rows = {}
    for line_no, line in enumerate(Path(path).read_text(encoding="utf-8-sig").splitlines(), 1):
        if not line.strip():
            raise ValueError(f"{path}:{line_no}: blank record")
        row = json.loads(line, object_pairs_hook=unique_object, parse_constant=reject_constant)
        if not isinstance(row, dict) or type(row.get("job_id")) is not int or row["job_id"] <= 0:
            raise ValueError(f"{path}:{line_no}: positive integer job_id required")
        if row["job_id"] in rows:
            raise ValueError(f"{path}:{line_no}: duplicate job_id {row['job_id']}")
        canonical(row)  # 順便拒絕溢位數字，例如 1e999。能讀進來不代表能當穩定的比較鍵。
        rows[row["job_id"]] = row
    return rows


def canonical(value):
    # 比對前先排成固定寫法。bool 和 int、null 和缺欄位、int 和 float 仍然算不同。
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def compare(before, after):
    """以 job_id 對齊。多出來的、不見的、內容變了的，分三欄，不混成一句「不一樣」。"""
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
        # "x" 表示檔案已存在就失敗。不蓋掉輸入，也不蓋掉上一份比較結果。
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
