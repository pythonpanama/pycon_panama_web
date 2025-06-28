from my_first_page.styles.styles import Size
import reflex as rx
from my_first_page.components.presentation import presentation


def calendar() -> rx.Component:
    return rx.box(
        rx.hstack(
            presentation(),
            # wrap="wrap",
        ),
        padding_y=Size.BIG.value,
        padding_x=Size.BIG.value,
        width="100%",
    )
