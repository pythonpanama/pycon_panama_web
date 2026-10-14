import unittest
from pathlib import Path

from scripts.validate_site import PageParser, ROOT, collect_http_urls


class PageParserTests(unittest.TestCase):
    def test_embedded_maps_are_not_checked_as_external_links(self) -> None:
        parser = PageParser()
        parser.feed(
            '<iframe src="https://www.google.com/maps?q=venue&amp;output=embed"></iframe>'
            '<a href="https://www.google.com/maps/search/?api=1">Open map</a>'
        )
        page = ROOT / "2026" / "sedes.html"

        self.assertEqual(len(parser.embedded_references), 1)
        self.assertEqual(len(parser.references), 1)
        self.assertEqual(
            collect_http_urls({page: parser}),
            {"https://www.google.com/maps/search/?api=1": "2026/sedes.html"},
        )
        self.assertEqual(
            collect_http_urls({page: parser}, include_embedded=True),
            {
                "https://www.google.com/maps?q=venue&output=embed": "2026/sedes.html",
                "https://www.google.com/maps/search/?api=1": "2026/sedes.html",
            },
        )


if __name__ == "__main__":
    unittest.main()
