import json
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
EXE = Path(__file__).parent / "build/field_lab.exe"
EXAMPLES = ROOT / "docs/cpp-sql-field-tricks/examples"


class FieldTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.out = Path(self.temp.name) / "out"

    def run_case(self, *args, effect="preview", expected=0):
        result = subprocess.run([str(EXE), *args, "--effect", effect, "--out", str(self.out)],
                                capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
        return result

    def test_three_entries(self):
        for i, args in enumerate([("--input", "fixed"), ("--input", "cli", "--job-id", "1", "--value", "10"),
                                 ("--input", "fixture", "--fixture", str(EXAMPLES / "baseline.job"))]):
            self.out = Path(self.temp.name) / str(i)
            self.run_case(*args)
            self.assertEqual(json.loads((self.out / "result.jsonl").read_text()),
                             {"schema": 1, "rule": "double-v1", "job_id": 1, "score": 20, "accepted": True})
            self.assertIn("NOT EXECUTED", (self.out / "intent.txt").read_text())

    def test_below_threshold(self):
        self.run_case("--input", "cli", "--job-id", "1", "--value", "9")
        self.assertFalse(json.loads((self.out / "result.jsonl").read_text())["accepted"])

    def test_invalid_value(self):
        for value in ["10oops", "-1", "1001", "2147483648"]:
            self.run_case("--input", "cli", "--job-id", "1", "--value", value, expected=2)
            self.assertFalse(self.out.exists())

    def test_reject_write(self):
        self.run_case("--input", "fixed", effect="lab-write", expected=2)
        self.assertFalse(self.out.exists())

    def test_preserve_existing_output(self):
        self.run_case("--input", "fixed")
        original = (self.out / "result.jsonl").read_bytes()
        self.run_case("--input", "cli", "--job-id", "1", "--value", "9", expected=2)
        self.assertEqual(original, (self.out / "result.jsonl").read_bytes())

    def test_snapshot_roundtrip(self):
        self.run_case("--input", "fixed")
        snapshot = self.out / "snapshot.job"
        original = (self.out / "result.jsonl").read_bytes()
        self.out = Path(self.temp.name) / "replay"
        self.run_case("--input", "fixture", "--fixture", str(snapshot))
        self.assertEqual(original, (self.out / "result.jsonl").read_bytes())

    def test_fixture_contract(self):
        fixture = Path(self.temp.name) / "bad.job"
        base = (EXAMPLES / "baseline.job").read_text()
        for text in [base.replace("schema=1", "schema=2"), base + "job_id=2\n",
                     base + "extra=1\n", base.replace("note=null", "note=missing")]:
            fixture.write_text(text, encoding="utf-8")
            self.run_case("--input", "fixture", "--fixture", str(fixture), expected=2)
            self.assertFalse(self.out.exists())


if __name__ == "__main__":
    unittest.main()
