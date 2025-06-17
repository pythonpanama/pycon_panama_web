import reflex as rx
from my_first_page.styles.styles import Size, TextColor

def header_text(icon: str, text: str, dark=True) -> rx.Component:
    return rx.hstack(
        rx.box(
            class_name=f"nes-icon is-medium {icon}",
        ),
        rx.heading(
            text,
            size="6",
            color=TextColor.SECONDARY.value if dark else TextColor.PRIMARY.value
        ),
        spacing="2",
        padding_bottom=Size.BUTTON.value,
        align_items="center"
    )