"""實際 MkDocs 建置與可攜性檢查：uv run python tools/check-story-package.py。"""
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "templates/visual-story"
READER = ROOT / "docs/assets/story-reader"


def check():
    # 暫存書籍不碰真實章節；兩個主題共用一份閱讀器。
    with tempfile.TemporaryDirectory(prefix="book-story-check-") as temp:
        base = Path(temp)
        docs = base / "docs"
        docs.mkdir()
        shutil.copytree(READER, docs / "assets/story-reader")
        (docs / "index.md").write_text(
            "# 打包驗證\n\n[第一個主題](resources/first/index.html)\n\n"
            "[第二個主題](resources/second/index.html)\n", encoding="utf-8"
        )
        for name in ("first", "second"):
            target = docs / "resources" / name
            target.mkdir(parents=True)
            for filename in ("index.html", "story.js", "story.css"):
                content = (TEMPLATE / filename).read_text(encoding="utf-8")
                if filename == "index.html":
                    content = content.replace("../../docs/assets/story-reader/", "../../assets/story-reader/")
                if filename == "story.js":
                    content = content.replace("const story = {", "const story = {\n  back: { href: '../../index.html', label: '返回本章' },")
                (target / filename).write_text(content, encoding="utf-8")
        config = base / "mkdocs.yml"
        config.write_text("site_name: Story packaging check\ndocs_dir: docs\nsite_dir: site\nuse_directory_urls: false\n", encoding="utf-8")
        subprocess.run([sys.executable, "-m", "mkdocs", "build", "-f", str(config)], check=True)
        # 搬移輸出後，以交付目錄為唯一基準解析引用，不能偷偷回到原始 repo。
        bundle = base / "delivery" / "standalone-book"
        bundle.parent.mkdir()
        shutil.move(str(base / "site"), bundle)
        for filename in ("reader.js", "reader.css"):
            copies = list(bundle.rglob(filename))
            assert len(copies) == 1, (filename, copies)
            assert copies[0].read_bytes() == (READER / filename).read_bytes()
        assert not any(file.is_symlink() for file in bundle.rglob("*"))
        assert not (bundle / "resources/first/README.html").exists()
        for name in ("first", "second"):
            topic = bundle / "resources" / name
            for filename in ("index.html", "story.js", "story.css"):
                assert (topic / filename).read_bytes() == (docs / "resources" / name / filename).read_bytes()
            html = (topic / "index.html").read_text(encoding="utf-8")
            story = (topic / "story.js").read_text(encoding="utf-8")
            urls = re.findall(r'(?:src|href)="([^"]+)"', html)
            urls += re.findall(r"href:\s*'([^']+)'", story)
            for url in urls:
                parsed = urlsplit(url)
                assert not parsed.scheme and not parsed.netloc and not parsed.path.startswith("/"), url
                resource = (topic / unquote(parsed.path)).resolve()
                assert resource.is_relative_to(bundle.resolve()), url
                assert resource.is_file(), url
            assert "playground" not in html and "templates/" not in html
        chapter = (bundle / "index.html").read_text(encoding="utf-8")
        assert 'href="resources/first/index.html"' in chapter
        assert 'href="resources/second/index.html"' in chapter
    print("PASS: MkDocs copies two topics, one shared reader, relative links survive relocation (not browser QA)")


if __name__ == "__main__":
    check()
