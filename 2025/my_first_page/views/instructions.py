import reflex as rx
import my_first_page.constants as constants
from my_first_page.styles.styles import Size, TextColor, Color
import my_first_page.styles.styles as styles
from my_first_page.components.button import button

def instructions() -> rx.Component:
    return rx.box(
        rx.vstack(
            rx.text(
                "Como funciona el evento",
                size="8",
                color=TextColor.TERTIARY.value
                    ),
            rx.el.span("del dia tal hasta el dia tal se haran charlas de "),
            rx.el.span("todos pueden participar de forma gratuita"),
            rx.el.span("Solo tienes que registrarte en nuestra pagina"),
            button(
                "Registrarse",
                constants.FORM_URL,
            ),
            rx.el.span(
                "loremp ipsum dolor sit amet, consectetur adipiscing elit. ",
            ),
            button(
                "Ver charlas",
                constants.CALENDAR_URL
                ),
            rx.el.span(
                "loremp ipsum dolor sit amet, consectetur adipiscing elit. "
                ),
            background_color=TextColor.SECONDARY.value,
            class_name="card",
            padding=Size.BIG.value,
            align_items="start",
            width="100%",
            #cambio de color texto dentro de instrucciones
            color=TextColor.FIFTH.value
        ),
        style=styles.max_width_style
    )