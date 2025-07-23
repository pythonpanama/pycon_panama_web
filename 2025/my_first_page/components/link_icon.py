from my_first_page.styles.colors import Color, TextColor
import reflex as rx


def link_icon(icon: str, url: str) -> rx.Component:
    return rx.link(
        rx.icon(icon),
        href=url,
        is_external=True,
    )

