import reflex as rx


def link_icon(icon: str, url: str) -> rx.Component:
    return rx.link(
        rx.icon(icon),
        href=url,
        is_external=True,
    )
