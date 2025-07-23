import reflex as rx

# import my_first_page.constants as constants
from my_first_page.styles.styles import Size, TextColor
import my_first_page.styles.styles as styles


def instructions() -> rx.Component:
    return rx.box(
        # rx.html('<link rel="stylesheet" href="/styles.css">'),
        rx.text(
            "Como funciona el evento",
            size="8",
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
                    "background": "#AB62CD",
                    "color": "#FDE3C8",
                    "border": "3px solid #FDE3C8",
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
                    "background": "#AB62CD",
                    "color": "#FDE3C8",
                    "border": "3px solid #FDE3C8",
                    "box-shadow": "none",
                },
            ),
            rx.el.span("loremp ipsum dolor sit amet, consectetur adipiscing elit. "),
            style=styles.instructions_box,
        ),
        style=styles.max_width_style,
    )
