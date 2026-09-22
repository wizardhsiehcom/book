"""Static book checks and host-only fixture checks; never runs Docker experiments."""
import ast
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BOOK = ROOT / 'docs/docker-field-tricks'


def python_snippets(text):
    return re.findall(r"<<'PY'\n(.*?)\nPY(?=\n|$)", text, re.S)


def main():
    files = sorted(BOOK.glob('*.md'))
    assert len(files) == 18, f'expected 18 pages, got {len(files)}'
    chapters = sorted(BOOK.glob('[0-9][0-9]-*.md'))
    assert len(chapters) == 13
    shells = programs = 0
    functions = {}
    for path in files:
        text = path.read_text()
        prose = re.sub(r'^```[^\n]*\n.*?^```[ \t]*$', '', text, flags=re.M | re.S)
        assert len(re.findall(r'^# ', prose, re.M)) == 1, path
        assert len(re.findall(r'^```', text, re.M)) % 2 == 0, path
        assert not re.search(r'[ \t]+$', text, re.M), path
        if path in chapters:
            assert '本版實測記錄' in text, path
            assert '實測' in text and ('預期' in text or '假設' in text), path
            assert '撤回' in text and '反例' in text, path
        for link in re.findall(r'\]\(([^)]+)\)', text):
            if link.startswith(('http:', 'https:', '#', 'mailto:')):
                continue
            target = (path.parent / link.split('#')[0]).resolve()
            assert target.is_relative_to(BOOK.resolve()), (path, link, 'outside published book')
            assert target.exists(), (path, link)
        for shell in re.findall(r'^```(?:bash|sh)\n(.*?)^```', text, re.M | re.S):
            checked = subprocess.run(['bash', '-n'], input=shell, text=True, capture_output=True)
            assert checked.returncode == 0, (path, checked.stderr)
            shells += 1
        for source in python_snippets(text):
            tree = ast.parse(source, filename=str(path))
            programs += 1
            names = {node.name for node in tree.body if isinstance(node, ast.FunctionDef)}
            if names & {'ready_status', 'scan', 'finish'}:
                namespace = {'__name__': 'fixture_check'}
                exec(compile(tree, str(path), 'exec'), namespace)
                functions.update({name: namespace[name] for name in names})
    assert functions['ready_status'](4.999, 5) == 503
    assert functions['ready_status'](5, 5) == 200
    with tempfile.TemporaryDirectory(prefix='docker-book-check-') as temp:
        directory = Path(temp)
        (directory / 'a.txt').write_text('A')
        first = functions['scan'](directory)
        assert first[0] == 1
        assert functions['scan'](directory) == first
        (directory / 'a.txt').write_text('B')
        assert functions['scan'](directory)[1] != first[1]
        finish = functions['finish']
        finish.__globals__['Path'] = lambda name: directory / Path(name).name
        try:
            finish(15, None)
        except SystemExit as stopped:
            assert stopped.code == 0
        else:
            raise AssertionError('cleanup handler must exit')
        assert (directory / 'cleanup-done').read_text() == 'cleanup-done\n'
    print(f'PASS: {len(files)} pages, {shells} Bash blocks, {programs} Python snippets, local links')
    print('PASS: host-only readiness boundary, scan checksum change, cleanup handler checks')
    print('SCOPE: this checker does not execute Docker; recorded container runs are separate evidence')


if __name__ == '__main__':
    main()
