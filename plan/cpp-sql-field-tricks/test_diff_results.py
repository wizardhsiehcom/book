import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[2] / "docs/cpp-sql-field-tricks/examples/diff_results.py"
spec = importlib.util.spec_from_file_location("diff_results", SCRIPT)
diff = importlib.util.module_from_spec(spec)
spec.loader.exec_module(diff)


class DiffTests(unittest.TestCase):
    def read(self, text):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "rows.jsonl"
            path.write_text(text, encoding="utf-8")
            return diff.load_rows(path)

    def test_reorder(self):
        a = self.read('{"job_id":1}\n{"job_id":2}\n')
        b = self.read('{"job_id":2}\n{"job_id":1}\n')
        self.assertFalse(any(diff.compare(a, b).values()))

    def test_null_missing_empty_distinct(self):
        rows = [{1: {"job_id": 1}}, {1: {"job_id": 1, "note": None}},
                {1: {"job_id": 1, "note": ""}}]
        for a, b in zip(rows, rows[1:]):
            self.assertTrue(diff.compare(a, b)["changed"])

    def test_duplicate_key(self):
        with self.assertRaises(ValueError):
            self.read('{"job_id":1}\n{"job_id":1}\n')

    def test_duplicate_field(self):
        with self.assertRaises(ValueError):
            self.read('{"job_id":1,"job_id":2}\n')

    def test_type_sensitive(self):
        for value in [True, 1.0, "1"]:
            self.assertTrue(diff.compare({1: {"v": 1}}, {1: {"v": value}})["changed"])

    def test_added_missing(self):
        self.assertEqual(diff.compare({1: {}}, {2: {}}), {"added": [2], "missing": [1], "changed": []})

    def test_bad_input(self):
        for text in ['{"job_id":true}', '{"job_id":0}', '[]', '\n',
                     '{"job_id":1,"v":NaN}', '{"job_id":1,"v":Infinity}', '{"job_id":1,"v":1e999}']:
            with self.subTest(text=text), self.assertRaises(ValueError):
                self.read(text)

    def test_empty_is_comparison_not_workload_validation(self):
        self.assertFalse(any(diff.compare(self.read(""), self.read("")).values()))

    def test_no_business_schema_validation(self):
        a = self.read('{"job_id":1}\n')
        self.assertFalse(any(diff.compare(a, a).values()))


if __name__ == "__main__":
    unittest.main()
