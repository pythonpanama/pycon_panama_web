import reflex as rx
from my_first_page.styles.styles import Color

def button(text: str, url: str) -> rx.Component:
    return rx.link(
        rx.button(
        text,
        class_name="btn",
        ),
        href=url,
        is_external=True,
    )