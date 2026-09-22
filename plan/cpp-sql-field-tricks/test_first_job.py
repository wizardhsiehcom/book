"""Compile the actual chapter snippets; run from an x64 MSVC environment."""
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs/cpp-sql-field-tricks"


def cpp_blocks(chapter):
    return re.findall(r"```cpp\n(.*?)\n```", (DOCS / chapter).read_text(encoding="utf-8"), re.S)


class FirstJobTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="cpp-sql-first-job-")
        cls.addClassCleanup(cls.temp.cleanup)
        cls.work = Path(cls.temp.name)
        shutil.copy2(DOCS / "examples/job_core.h", cls.work / "job_core.h")
        base = (DOCS / "examples/first_job.cpp").read_text(encoding="utf-8")
        chapter2 = cpp_blocks("02-one-job.md")
        original = next(b for b in chapter2 if b.startswith('std::cout << "input_value?'))
        fixed = next(b for b in chapter2 if b == "row.input_value = 10;")
        original = textwrap.indent(original, " " * 8)
        if base.count(original) != 1:
            raise AssertionError("Chapter 02 replacement does not match downloadable source")
        fixed_source = base.replace(original, textwrap.indent(fixed, " " * 8))
        chapter3 = cpp_blocks("03-test-mode.md")
        switch = next(b for b in chapter3 if b.startswith("if (test_mode)"))
        declaration = next(b for b in chapter3 if b.startswith("constexpr bool test_mode"))
        enabled = fixed_source.replace(textwrap.indent(fixed, " " * 8), textwrap.indent(switch, " " * 8))
        enabled = enabled.replace("int main()", declaration + "\n\nint main()")
        cls.sources = {
            "interactive": base,
            "fixed10": fixed_source,
            "fixed9": fixed_source.replace("row.input_value = 10;", "row.input_value = 9;"),
            "on": enabled,
            "off": enabled.replace("test_mode = true", "test_mode = false"),
        }
        for name, source in cls.sources.items():
            cls.compile(name, source)

    @classmethod
    def compile(cls, name, source):
        (cls.work / f"{name}.cpp").write_text(source, encoding="utf-8")
        result = subprocess.run(
            ["cl", "/nologo", "/std:c++17", "/EHsc", "/W4", "/WX", "/utf-8",
             f"{name}.cpp", f"/Fe{name}.exe", f"/Fo{name}.obj"],
            cwd=cls.work, capture_output=True, timeout=60,
        )
        if result.returncode:
            raise AssertionError(result.stdout.decode(errors="replace") + result.stderr.decode(errors="replace"))

    def run_case(self, name, value="", expected=0):
        result = subprocess.run([str(self.work / f"{name}.exe")], input=value,
                                capture_output=True, text=True, timeout=5)
        self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
        return result.stdout + result.stderr

    def test_interactive_threshold(self):
        self.assertIn("score=20 accepted=true", self.run_case("interactive", "10\n"))
        self.assertIn("score=18 accepted=false", self.run_case("interactive", "9\n"))

    def test_invalid_input(self):
        self.assertIn("expected an integer", self.run_case("interactive", "oops\n", 2))
        self.assertIn("0..1000", self.run_case("interactive", "1001\n", 2))

    def test_fixed_does_not_need_stdin(self):
        for name, expected in [("fixed10", "20 accepted=true"), ("fixed9", "18 accepted=false")]:
            output = self.run_case(name)
            self.assertNotIn("input_value?", output)
            self.assertIn("score=" + expected, output)

    def test_enabled_ignores_keyboard(self):
        output = self.run_case("on", "9\n")
        self.assertIn("input=fixed", output)
        self.assertIn("score=20 accepted=true", output)

    def test_disabled_uses_keyboard(self):
        output = self.run_case("off", "9\n")
        self.assertNotIn("input=fixed", output)
        self.assertIn("score=18 accepted=false", output)

    def test_source_edit_requires_rebuild(self):
        self.compile("stale", self.sources["on"])
        (self.work / "stale.cpp").write_text(self.sources["off"], encoding="utf-8")
        self.assertIn("input=fixed", self.run_case("stale", "9\n"))
        self.compile("stale", self.sources["off"])
        self.assertIn("score=18 accepted=false", self.run_case("stale", "9\n"))

    def test_all_variants_keep_core(self):
        for source in self.sources.values():
            self.assertEqual(source.count("const Result result = process_job(row);"), 1)

    def test_observation_is_not_a_receipt(self):
        self.assertIn("(NOT EXECUTED)", self.run_case("interactive", "10\n"))


if __name__ == "__main__":
    unittest.main()
