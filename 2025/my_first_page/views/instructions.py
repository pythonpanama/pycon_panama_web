import reflex as rx

# import my_first_page.constants as constants
from my_first_page.styles.styles import Size, TextColor
import my_first_page.styles.styles as styles


def instructions() -> rx.Component:
    return rx.box(
        rx.html('<link rel="stylesheet" href="/styles.css">'),
        rx.vstack(
            rx.text(
                "Como funciona el evento", size="8", color=TextColor.TERTIARY.value
            ),
            rx.el.span("del dia tal hasta el dia tal se haran charlas de "),
            rx.el.span("todos pueden participar de forma gratuita"),
            rx.el.span("Solo tienes que registrarte en nuestra pagina"),
            rx.link(
                "Registrarse",
                class_name="btn",
                on_click=rx.redirect(
                    "/form",
                ),
            ),
            rx.el.span(
                "loremp ipsum dolor sit amet, consectetur adipiscing elit. ",
            ),
            rx.link(
                "Ver charlas",
                class_name="btn",
                on_click=rx.redirect(
                    "/calendar",
                ),
            ),
            rx.el.span("loremp ipsum dolor sit amet, consectetur adipiscing elit. "),
            background_color=TextColor.SECONDARY.value,
            class_name="card",
            padding=Size.BIG.value,
            align_items="start",
            width="100%",
            # cambio de color texto dentro de instrucciones
            color=TextColor.FIFTH.value,
        ),
        style=styles.max_width_style,
    )
