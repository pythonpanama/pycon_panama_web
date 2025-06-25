import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.styles.styles import Color, Size
from my_first_page.components.header_text import header_text


def partners() -> rx.Component:
    return rx.vstack(
        rx.vstack(
            header_text("star", "Patrocinado por", False),
            rx.el.span("loremp ipsum dolor sit amet, consectetur adipiscing elit. "),
            rx.el.span("loremp ipsum dolor sit amet, consectetur adipiscing elit. "),
            padding_y=Size.VERY_BIG.value,
            style=styles.max_width_style,
            bg=Color.ACCENT.value,
            class_name="card",
            # padding=Size.BIG.value,
        ),
        align_items="center",
        width="100%",
    )

