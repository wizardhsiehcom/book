"""Browser acceptance checks for the generated PSI MkDocs book.

Run from the repository root with:

    uv run --with playwright python plan/psi/validate_browser.py

The script launches the existing Chrome executable through Playwright and
serves the repository through a short-lived local ThreadingHTTPServer.  It
does not install a browser, change pyproject.toml, or alter publication
files.  Reports and the requested screenshots are written below
data/psi/validation.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import threading
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
HTML_ROOT = ROOT / "book" / "psi" / "html"
REPORT_ROOT = ROOT / "data" / "psi" / "validation"

EXPECTED_PAGES: list[tuple[str, str]] = [
    ("index.html", "導讀"),
    ("00-map.html", "全書地圖"),
    ("01-wafer-roles.html", "01"),
    ("02-reclaim-loop.html", "02"),
    ("03-quality-and-qualification.html", "03"),
    ("04-reuse-economics.html", "04"),
    ("05-demand-and-new-test-wafers.html", "05"),
    ("06-thinning-services.html", "06"),
    ("07-advanced-materials.html", "07"),
    ("08-capacity-and-cashflow.html", "08"),
    ("09-psi-evidence-map.html", "09"),
    ("10-reading-news.html", "10"),
    ("appendix-sources.html", "A 來源"),
    ("appendix-glossary.html", "B 術語"),
    ("appendix-open-questions.html", "C 待查"),
    ("99-image-credits.html", "D 圖表來源"),
]

VIEWPORTS: dict[str, dict[str, int]] = {
    "desktop": {"width": 1440, "height": 1000},
    "mobile": {"width": 390, "height": 844},
}

SCREENSHOT_PAGES = {
    "index.html": "guide",
    "04-reuse-economics.html": "04",
    "06-thinning-services.html": "06",
    "09-psi-evidence-map.html": "09",
}

CHROME_CANDIDATES = (
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
)


OPEN_SHADOW_ROOTS_SCRIPT = """
(() => {
    const original = Element.prototype.attachShadow;
    if (original.__psiValidationWrapped) return;
    const openAttachShadow = function(init) {
        const options = Object.assign({}, init || {}, { mode: "open" });
        return original.call(this, options);
    };
    openAttachShadow.__psiValidationWrapped = true;
    Element.prototype.attachShadow = openAttachShadow;
})();
"""

class QuietHandler(SimpleHTTPRequestHandler):
    """Serve the repository without filling the validation log with requests."""

    def log_message(self, format: str, *args: Any) -> None:
        return


class LocalServer:
    """Ephemeral local HTTP server rooted at the repository."""

    def __init__(self, root: Path) -> None:
        handler = partial(QuietHandler, directory=str(root))
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        self.server.daemon_threads = True
        self.thread = threading.Thread(
            target=self.server.serve_forever,
            name="psi-validation-http",
            daemon=True,
        )
        self.root = root

    @property
    def base_url(self) -> str:
        host, port = self.server.server_address
        return f"http://{host}:{port}"

    def start(self) -> None:
        self.thread.start()

    def close(self) -> None:
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=5)


class IdParser(HTMLParser):
    """Collect fragment targets from a local HTML page."""

    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.add(attributes["id"] or "")
        if tag.lower() == "a" and attributes.get("name"):
            self.ids.add(attributes["name"] or "")


class LocalLinkChecker:
    """Check local hrefs and fragment anchors against the running server."""

    def __init__(self, base_url: str) -> None:
        self.base_url = base_url
        self.origin = urllib.parse.urlparse(base_url).netloc
        self.cache: dict[str, tuple[int, str, str | None]] = {}

    def fetch(self, url: str) -> tuple[int, str, str | None]:
        parsed = urllib.parse.urlparse(url)
        key = urllib.parse.urlunparse(parsed._replace(fragment=""))
        if key in self.cache:
            return self.cache[key]
        try:
            request = urllib.request.Request(
                key,
                headers={"User-Agent": "psi-book-browser-validation/1.0"},
            )
            with urllib.request.urlopen(request, timeout=8) as response:
                body = response.read()
                content_type = response.headers.get_content_charset() or "utf-8"
                text = body.decode(content_type, errors="replace")
                result = (int(response.status), text, None)
        except urllib.error.HTTPError as exc:
            result = (int(exc.code), "", f"HTTP {exc.code}")
        except Exception as exc:  # pragma: no cover - platform/network detail
            result = (0, "", f"{type(exc).__name__}: {exc}")
        self.cache[key] = result
        return result

    def check(
        self,
        anchors: list[dict[str, str]],
        current_url: str,
    ) -> dict[str, Any]:
        broken: list[dict[str, str]] = []
        missing_fragments: list[dict[str, str]] = []
        local_count = 0
        external_count = 0
        bookshelf_count = 0
        cross_book_count = 0
        seen: set[tuple[str, str]] = set()

        for anchor in anchors:
            raw = anchor.get("raw", "")
            text = anchor.get("text", "")
            if not raw or raw.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                if raw.startswith("#"):
                    target_url = urllib.parse.urljoin(current_url, raw)
                    fragment = urllib.parse.urlparse(target_url).fragment
                    if fragment:
                        status, body, error = self.fetch(target_url)
                        self._check_fragment(
                            target_url,
                            fragment,
                            status,
                            body,
                            error,
                            text,
                            missing_fragments,
                            broken,
                        )
                continue

            target_url = urllib.parse.urljoin(current_url, raw)
            parsed = urllib.parse.urlparse(target_url)
            if parsed.netloc and parsed.netloc != self.origin:
                external_count += 1
                continue

            local_count += 1
            fragment = parsed.fragment
            clean_url = urllib.parse.urlunparse(parsed._replace(fragment=""))
            dedupe_key = (clean_url, fragment)
            if dedupe_key in seen:
                continue
            seen.add(dedupe_key)

            if parsed.path == "/index.html" or "回到書庫" in text:
                bookshelf_count += 1
            if (match := re.search(r"/book/([^/]+)/html/", parsed.path)) and match.group(1) != "psi":
                cross_book_count += 1

            status, body, error = self.fetch(target_url)
            if status != 200:
                broken.append(
                    {
                        "raw": raw,
                        "resolved": target_url,
                        "text": text,
                        "reason": error or f"HTTP {status}",
                    }
                )
                continue
            if fragment:
                self._check_fragment(
                    target_url,
                    fragment,
                    status,
                    body,
                    error,
                    text,
                    missing_fragments,
                    broken,
                )

        return {
            "anchor_count": len(anchors),
            "local_count": local_count,
            "external_count": external_count,
            "bookshelf_count": bookshelf_count,
            "cross_book_count": cross_book_count,
            "broken": broken,
            "missing_fragments": missing_fragments,
        }

    @staticmethod
    def _check_fragment(
        target_url: str,
        fragment: str,
        status: int,
        body: str,
        error: str | None,
        text: str,
        missing_fragments: list[dict[str, str]],
        broken: list[dict[str, str]],
    ) -> None:
        if status != 200:
            broken.append(
                {
                    "raw": target_url,
                    "resolved": target_url,
                    "text": text,
                    "reason": error or f"HTTP {status}",
                }
            )
            return
        parser = IdParser()
        parser.feed(body)
        if fragment not in parser.ids:
            missing_fragments.append(
                {
                    "resolved": target_url,
                    "fragment": fragment,
                    "text": text,
                }
            )


def find_chrome() -> Path | None:
    for candidate in CHROME_CANDIDATES:
        if candidate.is_file():
            return candidate
    return None


def preflight() -> dict[str, Any]:
    expected = {name for name, _ in EXPECTED_PAGES}
    actual = {path.name for path in HTML_ROOT.glob("*.html")}
    chrome = find_chrome()
    return {
        "html_root": str(HTML_ROOT),
        "expected_page_count": len(EXPECTED_PAGES),
        "actual_html_count": len(actual),
        "missing_pages": sorted(expected - actual),
        "unexpected_html": sorted(actual - expected),
        "chrome": str(chrome) if chrome else None,
        "html_root_exists": HTML_ROOT.is_dir(),
    }


def make_page_url(base_url: str, page_name: str) -> str:
    return f"{base_url}/book/psi/html/{urllib.parse.quote(page_name)}"


def collect_mermaid(page: Any) -> dict[str, Any]:
    """Inspect every diagram after Mermaid has had time to render."""

    page.wait_for_timeout(1200)
    page.evaluate(
        """() => new Promise(resolve => {
            const expected = document.querySelectorAll('.mermaid').length;
            if (!expected) { resolve(); return; }
            const deadline = Date.now() + 5000;
            const tick = () => {
                const rendered = document.querySelectorAll('.mermaid svg').length;
                if (rendered >= expected || Date.now() >= deadline) {
                    resolve();
                } else {
                    setTimeout(tick, 100);
                }
            };
            tick();
        })"""
    )
    details = page.evaluate(
        """() => Array.from(document.querySelectorAll('.mermaid')).map((el, index) => ({
            index,
            has_svg: Boolean(el.querySelector('svg')),
            svg_count: el.querySelectorAll('svg').length,
            has_error_node: Boolean(el.querySelector(
                '.error-icon, .error-text, [aria-roledescription="error"], [aria-label*="error" i]'
            )),
            text: (el.textContent || '').slice(0, 500),
            svg_valid: Array.from(el.querySelectorAll('svg')).every(svg =>
                svg.tagName.toLowerCase() === 'svg' &&
                (svg.getAttribute('viewBox') || svg.getAttribute('width') ||
                 svg.getAttribute('height'))
            )
        }))"""
    )
    mermaid_defined = page.evaluate("() => typeof window.mermaid !== 'undefined'")
    syntax_errors = [
        item
        for item in details
        if item["has_error_node"]
        or re.search(r"syntax error|parse error|mermaid error", item["text"], re.I)
    ]
    unrendered = [item for item in details if not item["has_svg"] or not item["svg_valid"]]
    return {
        "mermaid_defined": mermaid_defined,
        "diagram_count": len(details),
        "svg_count": sum(item["svg_count"] for item in details),
        "details": details,
        "syntax_errors": syntax_errors,
        "unrendered": unrendered,
    }


def collect_visual_metrics(page: Any) -> dict[str, Any]:
    """Return SVG geometry and effective text sizes at the current viewport."""

    return page.evaluate(
        """() => ({
            viewport_width_px: window.innerWidth,
            viewport_height_px: window.innerHeight,
            svgs: Array.from(document.querySelectorAll('.mermaid svg')).map((svg, index) => {
                const rect = svg.getBoundingClientRect();
                const viewBox = svg.viewBox && svg.viewBox.baseVal;
                const viewBoxWidth = viewBox && viewBox.width
                    ? viewBox.width
                    : (Number(svg.getAttribute('width')) || rect.width);
                const viewBoxHeight = viewBox && viewBox.height
                    ? viewBox.height
                    : (Number(svg.getAttribute('height')) || rect.height);
                const scaleX = viewBoxWidth ? rect.width / viewBoxWidth : 1;
                const scaleY = viewBoxHeight ? rect.height / viewBoxHeight : 1;
                const scale = Math.min(scaleX, scaleY);
                const textNodes = Array.from(
                    svg.querySelectorAll('text, foreignObject, foreignObject *')
                );
                const fontSizes = textNodes.map(node =>
                    parseFloat(getComputedStyle(node).fontSize)
                ).filter(size => Number.isFinite(size) && size > 0);
                const effective = fontSizes.map(size => size * scale);
                return {
                    index,
                    css_width_px: Math.round(rect.width * 100) / 100,
                    css_height_px: Math.round(rect.height * 100) / 100,
                    view_box: svg.getAttribute('viewBox') || '',
                    view_box_width: Math.round(viewBoxWidth * 100) / 100,
                    view_box_height: Math.round(viewBoxHeight * 100) / 100,
                    scale_x: Math.round(scaleX * 1000) / 1000,
                    scale_y: Math.round(scaleY * 1000) / 1000,
                    scale: Math.round(scale * 1000) / 1000,
                    text_count: textNodes.length,
                    computed_font_sizes_px: [...new Set(fontSizes.map(size =>
                        Math.round(size * 100) / 100
                    ))],
                    min_effective_font_px: effective.length
                        ? Math.round(Math.min(...effective) * 100) / 100
                        : null,
                    text_examples: textNodes.map(node =>
                        (node.textContent || '').trim()
                    ).filter(Boolean).slice(0, 6)
                };
            })
        })"""
    )


def collect_overflow(page: Any) -> dict[str, Any]:
    return page.evaluate(
        """() => {
            const allowed = (el) => {
                for (let node = el; node; node = node.parentElement) {
                    const style = getComputedStyle(node);
                    const cls = String(node.className || '');
                    if (node.tagName === 'TABLE' ||
                        cls.includes('scrollwrap') ||
                        cls.includes('highlight') ||
                        style.overflowX === 'auto' ||
                        style.overflowX === 'scroll') {
                        return true;
                    }
                }
                return false;
            };
            const offenders = [];
            for (const el of document.querySelectorAll('body *')) {
                const style = getComputedStyle(el);
                if (style.display === 'none' || style.position === 'fixed') continue;
                const rect = el.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0) continue;
                if (rect.right > window.innerWidth + 2 && !allowed(el)) {
                    offenders.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id || '',
                        class_name: String(el.className || '').slice(0, 160),
                        right: Math.round(rect.right),
                        viewport: window.innerWidth,
                        scroll_width: el.scrollWidth,
                        client_width: el.clientWidth
                    });
                }
            }
            return {
                document_scroll_width: document.documentElement.scrollWidth,
                body_scroll_width: document.body.scrollWidth,
                viewport_width: window.innerWidth,
                root_overflow: Math.max(
                    document.documentElement.scrollWidth,
                    document.body.scrollWidth
                ) - window.innerWidth,
                offenders: offenders.slice(0, 20)
            };
        }"""
    )


def anchors_from_page(page: Any) -> list[dict[str, str]]:
    return page.locator("a[href]").evaluate_all(
        """els => els.map(a => ({
            raw: a.getAttribute('href') || '',
            text: (a.innerText || a.textContent || '').trim().slice(0, 120)
        }))"""
    )


def check_page(
    page: Any,
    page_name: str,
    label: str,
    viewport_name: str,
    base_url: str,
    link_checker: LocalLinkChecker,
    screenshot_path: Path | None,
) -> dict[str, Any]:
    url = make_page_url(base_url, page_name)
    result: dict[str, Any] = {
        "page": page_name,
        "label": label,
        "viewport": viewport_name,
        "url": url,
        "navigation_error": None,
        "console_errors": [],
        "page_errors": [],
        "mermaid": {},
        "mermaid_visual": {},
        "overflow": {},
        "links": {},
        "screenshot": None,
    }
    console_errors: list[str] = []
    page_errors: list[str] = []
    responses: list[dict[str, Any]] = []
    failed_requests: list[dict[str, str]] = []
    page.on(
        "console",
        lambda message: (
            console_errors.append(message.text)
            if message.type == "error"
            else None
        ),
    )
    page.on("pageerror", lambda exc: page_errors.append(str(exc)))
    page.on(
        "response",
        lambda response: responses.append(
            {"url": response.url, "status": response.status}
        ),
    )
    page.on(
        "requestfailed",
        lambda request: failed_requests.append(
            {"url": request.url, "failure": request.failure or ""}
        ),
    )
    try:
        page.add_init_script(OPEN_SHADOW_ROOTS_SCRIPT)
        page.goto(url, wait_until="domcontentloaded", timeout=30_000)
        result["mermaid"] = collect_mermaid(page)
        result["mermaid_visual"] = result["mermaid"].get("svg_metrics", [])
        result["overflow"] = collect_overflow(page)
        result["links"] = link_checker.check(anchors_from_page(page), page.url)
        if screenshot_path is not None:
            screenshot_path.parent.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(screenshot_path), full_page=True)
            result["screenshot"] = str(screenshot_path)
    except Exception as exc:
        result["navigation_error"] = f"{type(exc).__name__}: {exc}"
    result["console_errors"] = console_errors
    result["page_errors"] = page_errors
    mermaid_responses = [
        item for item in responses if "unpkg.com/mermaid" in item["url"]
    ]
    mermaid_failures = [
        item for item in failed_requests if "unpkg.com/mermaid" in item["url"]
    ]
    result["mermaid_network"] = {
        "responses": mermaid_responses,
        "failed_requests": mermaid_failures,
    }
    return result


def collect_issues(report: dict[str, Any]) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    preflight_result = report["preflight"]
    if not preflight_result["html_root_exists"]:
        issues.append({"kind": "missing-build", "detail": "book/psi/html does not exist"})
    if preflight_result["missing_pages"]:
        issues.append(
            {"kind": "missing-pages", "detail": preflight_result["missing_pages"]}
        )
    if not preflight_result["chrome"]:
        issues.append({"kind": "missing-chrome", "detail": "Chrome executable not found"})

    for result in report["pages"]:
        prefix = f"{result['page']} [{result['viewport']}]"
        if result["navigation_error"]:
            issues.append(
                {"kind": "navigation", "page": prefix, "detail": result["navigation_error"]}
            )
            continue
        if result["console_errors"]:
            issues.append(
                {"kind": "console-error", "page": prefix, "detail": result["console_errors"]}
            )
        if result["page_errors"]:
            issues.append(
                {"kind": "page-error", "page": prefix, "detail": result["page_errors"]}
            )
        mermaid = result["mermaid"]
        if mermaid.get("diagram_count", 0) and not mermaid.get("mermaid_defined"):
            issues.append(
                {"kind": "mermaid-cdn", "page": prefix, "detail": mermaid}
            )
        if mermaid.get("syntax_errors"):
            issues.append(
                {"kind": "mermaid-syntax", "page": prefix, "detail": mermaid["syntax_errors"]}
            )
        if mermaid.get("unrendered"):
            issues.append(
                {"kind": "mermaid-unrendered", "page": prefix, "detail": mermaid["unrendered"]}
            )
        overflow = result["overflow"]
        if overflow.get("root_overflow", 0) > 2 or overflow.get("offenders"):
            issues.append(
                {"kind": "horizontal-overflow", "page": prefix, "detail": overflow}
            )
        links = result["links"]
        if links.get("broken"):
            issues.append(
                {"kind": "broken-links", "page": prefix, "detail": links["broken"]}
            )
        if links.get("missing_fragments"):
            issues.append(
                {
                    "kind": "missing-source-anchor",
                    "page": prefix,
                    "detail": links["missing_fragments"],
                }
            )
        if links and links.get("bookshelf_count", 0) == 0:
            issues.append(
                {"kind": "missing-bookshelf-link", "page": prefix, "detail": links}
            )
    if report["summary"]["cross_book_links"] == 0:
        issues.append(
            {
                "kind": "missing-cross-book-links",
                "detail": "No local cross-book links were found to validate",
            }
        )
    return issues


def make_markdown(report: dict[str, Any]) -> str:
    summary = report["summary"]
    lines = [
        "# PSI 瀏覽器驗收結果",
        "",
        f"- 產生時間：{report['generated_at']}",
        f"- 建置根目錄：{report['preflight']['html_root']}",
        f"- 檢查：{summary['pages_checked']} 次（{len(EXPECTED_PAGES)} 頁 × 2 viewport）",
        f"- Mermaid：{summary['mermaid_diagrams']} 個圖、{summary['mermaid_svgs']} 個 SVG",
        f"- 跨書連結：{summary['cross_book_links']} 條",
        f"- 問題數：{len(report['issues'])}",
        "",
        "## 頁面明細",
        "",
        "| 頁面 | viewport | Mermaid SVG | 水平溢出 | 斷鏈 | 來源錨點缺失 | 截圖 |",
        "|---|---|---:|---|---:|---:|---|",
    ]
    for result in report["pages"]:
        mermaid = result.get("mermaid", {})
        links = result.get("links", {})
        overflow = result.get("overflow", {})
        lines.append(
            "| {page} | {viewport} | {svg}/{diagrams} | {overflow} | {broken} | "
            "{fragments} | {shot} |".format(
                page=result["page"],
                viewport=result["viewport"],
                svg=mermaid.get("svg_count", 0),
                diagrams=mermaid.get("diagram_count", 0),
                overflow="FAIL"
                if overflow.get("root_overflow", 0) > 2
                or overflow.get("offenders")
                else "OK",
                broken=len(links.get("broken", [])),
                fragments=len(links.get("missing_fragments", [])),
                shot="yes" if result.get("screenshot") else "",
            )
        )
    lines.extend(["", "## 問題", ""])
    if report["issues"]:
        for issue in report["issues"]:
            lines.append(f"- {issue['kind']} {issue.get('page', '')}: {issue['detail']}")
    else:
        lines.append("- 無。")
    return "\n".join(lines) + "\n"


def write_reports(report: dict[str, Any]) -> None:
    REPORT_ROOT.mkdir(parents=True, exist_ok=True)
    (REPORT_ROOT / "validation-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (REPORT_ROOT / "validation-report.md").write_text(
        make_markdown(report),
        encoding="utf-8",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Show Chrome while validating; default is headless.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    report: dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "preflight": preflight(),
        "pages": [],
        "issues": [],
        "summary": {
            "pages_checked": 0,
            "mermaid_diagrams": 0,
            "mermaid_svgs": 0,
            "cross_book_links": 0,
        },
    }
    preflight_result = report["preflight"]
    if (
        not preflight_result["html_root_exists"]
        or preflight_result["missing_pages"]
        or not preflight_result["chrome"]
    ):
        report["issues"] = collect_issues(report)
        write_reports(report)
        print(json.dumps(report["issues"], ensure_ascii=False, indent=2))
        return 2

    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        report["issues"] = [
            {
                "kind": "missing-playwright",
                "detail": f"{type(exc).__name__}: {exc}; run with uv run --with playwright",
            }
        ]
        write_reports(report)
        print(report["issues"][0]["detail"], file=sys.stderr)
        return 2

    server = LocalServer(ROOT)
    server.start()
    link_checker = LocalLinkChecker(server.base_url)
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(
                executable_path=preflight_result["chrome"],
                headless=not args.headed,
                args=[
                    "--disable-gpu",
                    "--no-first-run",
                    "--no-default-browser-check",
                    "--disable-dev-shm-usage",
                ],
            )
            try:
                for viewport_name, viewport in VIEWPORTS.items():
                    context = browser.new_context(viewport=viewport)
                    try:
                        for page_name, label in EXPECTED_PAGES:
                            page = context.new_page()
                            try:
                                screenshot_path = None
                                if page_name in SCREENSHOT_PAGES:
                                    screenshot_path = (
                                        REPORT_ROOT
                                        / f"{SCREENSHOT_PAGES[page_name]}-{viewport_name}.png"
                                    )
                                result = check_page(
                                    page,
                                    page_name,
                                    label,
                                    viewport_name,
                                    server.base_url,
                                    link_checker,
                                    screenshot_path,
                                )
                                report["pages"].append(result)
                            finally:
                                page.close()
                    finally:
                        context.close()
            finally:
                browser.close()
    except Exception as exc:
        report["issues"].append(
            {"kind": "browser-launch-or-run", "detail": f"{type(exc).__name__}: {exc}"}
        )
    finally:
        server.close()

    report["summary"]["pages_checked"] = len(report["pages"])
    report["summary"]["mermaid_diagrams"] = sum(
        item.get("mermaid", {}).get("diagram_count", 0) for item in report["pages"]
    )
    report["summary"]["mermaid_svgs"] = sum(
        item.get("mermaid", {}).get("svg_count", 0) for item in report["pages"]
    )
    report["summary"]["cross_book_links"] = sum(
        item.get("links", {}).get("cross_book_count", 0) for item in report["pages"]
    )
    report["issues"].extend(collect_issues(report))
    unique_issues: list[dict[str, Any]] = []
    seen_issues: set[str] = set()
    for issue in report["issues"]:
        key = json.dumps(issue, ensure_ascii=False, sort_keys=True)
        if key not in seen_issues:
            seen_issues.add(key)
            unique_issues.append(issue)
    report["issues"] = unique_issues
    write_reports(report)

    print(
        f"PSI browser validation: {'PASS' if not report['issues'] else 'FAIL'} "
        f"({report['summary']['pages_checked']} pages × {len(VIEWPORTS)} viewports, "
        f"{report['summary']['mermaid_svgs']} Mermaid SVGs, "
        f"{len(report['issues'])} issues)"
    )
    print(f"Report: {REPORT_ROOT / 'validation-report.md'}")
    return 0 if not report["issues"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
