#!/usr/bin/env python3
"""Valida las garantías básicas del sitio público de PyCon Panamá."""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys
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
    f"{CANONICAL_BASE}/2026/agenda.html",
    f"{CANONICAL_BASE}/2026/codigo_conducta.html",
    f"{CANONICAL_BASE}/2026/faq.html",
    f"{CANONICAL_BASE}/2026/registro.html",
    f"{CANONICAL_BASE}/2026/sedes.html",
    f"{CANONICAL_BASE}/2026/speaker.html",
}
EXTERNAL_SCHEMES = {"data", "http", "https", "javascript", "mailto", "tel"}


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
            if key and values.get("content"):
                self.meta[key] = values["content"]
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


def main() -> int:
    pages, errors = parse_pages()
    errors.extend(validate_references(pages))
    errors.extend(validate_sitemap())
    errors.extend(validate_conflict_markers())
    if errors:
        print("Validación del sitio falló:", *[f"- {error}" for error in errors], sep="\n")
        return 1
    print(f"Validación correcta: {len(pages)} páginas HTML de 2026, enlaces y metadatos consistentes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
