#!/usr/bin/env python3
"""Valida las garantías básicas del sitio público de PyCon Panamá."""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
EDITION = ROOT / "2026"
CANONICAL_BASE = "https://pycon.pa"
OPTIONAL_LOCAL_ASSETS = {EDITION / "js" / "env.js"}
REQUIRED_META = {
    "description",
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "twitter:card",
    "twitter:image",
}
SITEMAP_REQUIRED = {
    f"{CANONICAL_BASE}/2026/",
    f"{CANONICAL_BASE}/2026/about.html",
    f"{CANONICAL_BASE}/2026/codigo_conducta.html",
    f"{CANONICAL_BASE}/2026/faq.html",
    f"{CANONICAL_BASE}/2026/patrocinadores.html",
    f"{CANONICAL_BASE}/2026/privacidad.html",
    f"{CANONICAL_BASE}/2026/registro.html",
    f"{CANONICAL_BASE}/2026/ponentes.html",
    f"{CANONICAL_BASE}/2026/voluntariado/",
}
EXTERNAL_SCHEMES = {"data", "http", "https", "javascript", "mailto", "tel"}
USER_AGENT = "PyConPanamaSiteValidator/1.0 (+https://github.com/pythonpanama/pycon_panama_web)"
EXTERNAL_TIMEOUT = 12
EXTERNAL_WORKERS = 8
# Hosts that GitHub Actions cannot check reliably. A CI 403/timeout is not
# evidence the public URL is gone; confirm those in a browser instead.
SKIP_EXTERNAL_HOSTS = frozenset(
    {
        "facebook.com",
        "instagram.com",
        "linkedin.com",
        "meetup.com",
        "pylatam.org",  # GitHub Actions times out; HEAD returns 200 elsewhere
    }
)


class PageParser(HTMLParser):
    """Recopila enlaces, IDs y metadatos sin requerir dependencias externas."""

    def __init__(self) -> None:
        super().__init__()
        self.canonicals: list[str] = []
        self.ids: set[str] = set()
        self.duplicate_ids: set[str] = set()
        self.meta: dict[str, str] = {}
        self.references: list[str] = []
        self.title = ""
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            if element_id in self.ids:
                self.duplicate_ids.add(element_id)
            self.ids.add(element_id)

        if tag == "title":
            self._in_title = True
        if tag == "meta":
            key = values.get("name") or values.get("property")
            content = values.get("content")
            if key and content:
                self.meta[key] = content
                if key in {"og:image", "twitter:image"}:
                    self.references.append(content)
        if tag == "link" and "canonical" in (values.get("rel") or "").split():
            if values.get("href"):
                self.canonicals.append(values["href"])
        if tag in {"a", "img", "iframe", "link", "script", "source"}:
            reference = values.get("href") or values.get("src")
            if reference:
                self.references.append(reference)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data


def canonical_url(page: Path) -> str:
    relative = page.relative_to(ROOT).as_posix()
    if relative.endswith("/index.html"):
        relative = relative[: -len("index.html")]
    return f"{CANONICAL_BASE}/{relative}"


def target_for(page: Path, reference: str) -> tuple[Path | None, str]:
    parsed = urlsplit(reference)
    if parsed.scheme.lower() in EXTERNAL_SCHEMES or reference.startswith("//"):
        return None, parsed.fragment
    path = unquote(parsed.path)
    if not path:
        return page, parsed.fragment
    target = ROOT / path.lstrip("/") if path.startswith("/") else page.parent / path
    if target.is_dir() or path.endswith("/"):
        target /= "index.html"
    return target.resolve(), parsed.fragment


def absolute_http_url(reference: str) -> str | None:
    candidate = f"https:{reference}" if reference.startswith("//") else reference
    parsed = urlsplit(candidate)
    if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
        return None
    return parsed._replace(fragment="").geturl()


def host_is_skipped(host: str) -> bool:
    host = host.lower()
    return any(host == skipped or host.endswith("." + skipped) for skipped in SKIP_EXTERNAL_HOSTS)


def local_production_target(url: str) -> Path | None:
    parsed = urlsplit(url)
    if parsed.netloc.lower() != "pycon.pa":
        return None
    path = unquote(parsed.path)
    target = ROOT / path.lstrip("/")
    if target.is_dir() or path.endswith("/"):
        target = target / "index.html"
    return target


def collect_http_urls(pages: dict[Path, PageParser]) -> dict[str, str]:
    found: dict[str, str] = {}
    for page, parser in pages.items():
        label = page.relative_to(ROOT).as_posix()
        for reference in parser.references:
            url = absolute_http_url(reference)
            if url and url not in found:
                found[url] = label
    return found


def parse_pages() -> tuple[dict[Path, PageParser], list[str]]:
    pages: dict[Path, PageParser] = {}
    errors: list[str] = []
    for page in sorted(EDITION.rglob("*.html")):
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        pages[page.resolve()] = parser
        label = page.relative_to(ROOT)
        if not parser.title.strip():
            errors.append(f"{label}: falta <title>.")
        missing = REQUIRED_META - parser.meta.keys()
        if missing:
            errors.append(f"{label}: faltan metadatos: {', '.join(sorted(missing))}.")
        expected = canonical_url(page)
        if parser.canonicals != [expected]:
            errors.append(f"{label}: canonical debe ser {expected}.")
        if parser.meta.get("og:url") != expected:
            errors.append(f"{label}: og:url debe ser {expected}.")
        for image_key in ("og:image", "twitter:image"):
            image = parser.meta.get(image_key, "")
            parsed_image = urlsplit(image)
            if parsed_image.scheme != "https" or parsed_image.netloc != "pycon.pa":
                errors.append(f"{label}: {image_key} debe ser una URL HTTPS absoluta de pycon.pa.")
        if len(parser.canonicals) != 1:
            errors.append(f"{label}: debe tener exactamente un canonical.")
        if parser.duplicate_ids:
            errors.append(f"{label}: IDs duplicados: {', '.join(sorted(parser.duplicate_ids))}.")
    return pages, errors


def validate_references(pages: dict[Path, PageParser]) -> list[str]:
    errors: list[str] = []
    for page, parser in pages.items():
        for reference in parser.references:
            target, fragment = target_for(page, reference)
            if target is None:
                continue
            label = page.relative_to(ROOT)
            if target in OPTIONAL_LOCAL_ASSETS:
                continue
            if not target.exists():
                errors.append(f"{label}: enlace local inexistente: {reference}.")
                continue
            if fragment and target.suffix == ".html":
                target_page = pages.get(target)
                if target_page and fragment not in target_page.ids:
                    errors.append(f"{label}: fragmento inexistente {reference}.")
    return errors


def validate_production_assets(pages: dict[Path, PageParser]) -> list[str]:
    errors: list[str] = []
    for url, label in sorted(collect_http_urls(pages).items()):
        target = local_production_target(url)
        if target is None:
            continue
        if target in OPTIONAL_LOCAL_ASSETS:
            continue
        if not target.exists():
            errors.append(f"{label}: recurso de pycon.pa inexistente en el repositorio: {url}.")
    return errors


def probe_once(url: str, method: str) -> int | str:
    last_error = "sin respuesta"
    request = urllib.request.Request(
        url,
        method=method,
        headers={"User-Agent": USER_AGENT, "Accept": "*/*"},
    )
    for _attempt in range(2):
        try:
            with urllib.request.urlopen(request, timeout=EXTERNAL_TIMEOUT) as response:
                response.read(64)
                return response.status
        except urllib.error.HTTPError as error:
            return error.code
        except urllib.error.URLError as error:
            last_error = str(error.reason) if error.reason else "URLError"
            if "timed out" in last_error.lower():
                last_error = "tiempo agotado"
        except TimeoutError:
            last_error = "tiempo agotado"
    return last_error


def probe_url(url: str) -> tuple[bool, str]:
    head = probe_once(url, "HEAD")
    if isinstance(head, int) and head < 400:
        return True, f"HTTP {head}"
    if isinstance(head, int) and head in {404, 410}:
        return False, f"HTTP {head}"
    get = probe_once(url, "GET")
    if isinstance(get, int) and get < 400:
        return True, f"HTTP {get}"
    if isinstance(get, int):
        return False, f"HTTP {get}"
    if isinstance(head, int):
        return False, f"HTTP {head}"
    return False, str(get)


def validate_external_links(pages: dict[Path, PageParser]) -> list[str]:
    to_check: list[tuple[str, str]] = []
    for url, label in sorted(collect_http_urls(pages).items()):
        parsed = urlsplit(url)
        if parsed.netloc.lower() == "pycon.pa":
            continue
        if host_is_skipped(parsed.netloc):
            continue
        to_check.append((url, label))

    errors: list[str] = []
    with ThreadPoolExecutor(max_workers=EXTERNAL_WORKERS) as pool:
        results = list(pool.map(lambda item: (item, probe_url(item[0])), to_check))
    for (url, label), (ok, detail) in results:
        if not ok:
            errors.append(f"{label}: enlace externo no disponible ({detail}): {url}.")
    return errors


def validate_sitemap() -> list[str]:
    try:
        tree = ET.parse(ROOT / "sitemap.xml")
    except ET.ParseError as exc:
        return [f"sitemap.xml no es XML válido: {exc}."]
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locations = {node.text for node in tree.findall("sm:url/sm:loc", namespace) if node.text}
    missing = SITEMAP_REQUIRED - locations
    extra = locations - SITEMAP_REQUIRED
    if missing or extra:
        errors = []
        if missing:
            errors.append(f"sitemap.xml no incluye: {', '.join(sorted(missing))}.")
        if extra:
            errors.append(f"sitemap.xml contiene URLs no canónicas: {', '.join(sorted(extra))}.")
        return errors
    return []


def validate_conflict_markers() -> list[str]:
    errors: list[str] = []
    sources = [ROOT / "README.md", ROOT / "netlify.toml", ROOT / "robots.txt", ROOT / "sitemap.xml"]
    sources.extend(EDITION.rglob("*"))
    for source in sources:
        if not source.is_file() or source.suffix.lower() not in {".css", ".html", ".js", ".xml", ".md", ".toml", ".txt"}:
            continue
        if any(line.startswith(("<<<<<<<", "=======", ">>>>>>>")) for line in source.read_text(encoding="utf-8").splitlines()):
            errors.append(f"{source.relative_to(ROOT)}: contiene marcadores de conflicto.")
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--skip-external",
        action="store_true",
        help="No comprueba URLs HTTP(S) de terceros (útil sin red).",
    )
    args = parser.parse_args(argv)
    pages, errors = parse_pages()
    errors.extend(validate_references(pages))
    errors.extend(validate_production_assets(pages))
    if not args.skip_external:
        errors.extend(validate_external_links(pages))
    errors.extend(validate_sitemap())
    errors.extend(validate_conflict_markers())
    if errors:
        print("Validación del sitio falló:", *[f"- {error}" for error in errors], sep="\n")
        return 1
    checked = "enlaces locales, enlaces externos y metadatos" if not args.skip_external else "enlaces locales y metadatos"
    print(f"Validación correcta: {len(pages)} páginas HTML de 2026, {checked} consistentes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
