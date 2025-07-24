import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.styles.styles import Color, TextColor


def instructions() -> rx.Component:
    return rx.box(
        rx.text(
            "Como funciona el evento",
            style=styles.instructions_title,
            id="instructions",
        ),
        rx.vstack(
            rx.el.span("del dia tal hasta el dia tal se haran charlas de "),
            rx.el.span("todos pueden participar de forma gratuita"),
            rx.el.span("Solo tienes que registrarte en nuestra pagina"),
            rx.link(
                "Registrarse",
                href="/form",
                style=styles.boton,
                _hover={
                    "background": Color.PRIMARY.value,
                    "color": TextColor.TERTIARY.value,
                    "border": f"3px solid {Color.TERTIARY.value}",
                    "box-shadow": "none",
                },
            ),
            rx.el.span(
                "loremp ipsum dolor sit amet, consectetur adipiscing elit. ",
            ),
            rx.link(
                "Ver charlas",
                href="/calendar",
                style=styles.boton,
                _hover={
                    "background": Color.PRIMARY.value,
                    "color": TextColor.TERTIARY.value,
                    "border": f"3px solid {Color.TERTIARY.value}",
                    "box-shadow": "none",
                },
            ),
            rx.el.span("loremp ipsum dolor sit amet, consectetur adipiscing elit. "),
            style=styles.instructions_box,
        ),
        style=styles.max_width_style,
    )
