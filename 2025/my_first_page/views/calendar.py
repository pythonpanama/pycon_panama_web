import reflex as rx
from my_first_page.constants import EVENTS
from my_first_page.styles.styles import Size, TextColor, Color
import my_first_page.styles.styles as styles
from my_first_page.components.presentation import presentation


def calendar() -> rx.Component:
    return rx.box(
        rx.vstack(
            presentation(),
            presentation(),
            presentation(),
        ),
        style=styles.max_width_style,
        margin_x="auto",
        display="flex",
        align_items="center",
        justify_content="center",
        padding_y=Size.BIG.value,
        flex_direction=["column", "column", "column", "row", "row", "row"],
    )
