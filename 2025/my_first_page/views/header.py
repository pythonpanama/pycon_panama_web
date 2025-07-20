import reflex as rx
import my_first_page.constants as constants
from my_first_page.styles.styles import Size, TextColor, Color
import my_first_page.styles.styles as styles


def header() -> rx.Component:
    return rx.vstack(
        # cabezera de bienvenida
        rx.box(
            rx.el.span(
                "BIENVENIDOS A ",
                color=TextColor.ACCENT.value,
            ),
            rx.el.span(
                "PYCON PANAMÁ ",
                color=TextColor.SECONDARY.value,
            ),
            rx.el.span(
                "2025",
                color=TextColor.FOURTH.value,
            ),
            # size y spacing solo aceptan literales de tipo ["1","2","3","4","5","6","7","8","9"]
            # no aceptan cosas como lg, sm, ni 2rem, 2em, nada de esto acepta
            width="100%",
            font_size=["3em", "3em", "4em", "5em", "6em", "6em"],
            text_align="start",
            text_shadow="black 2px 2px",
        ),
        # SECCION LOGO CON CONTADOR
        # EL LOGO TODAVIA ESTA ABIERTO A CAMBIOS
        # revisar diferencia entre rx.hstack y rx.flex
        rx.hstack(
            rx.image(
                src="PyConPet.jpg",
                alt="mascota python",
                width="16em",
                height="16em",
                margin_x="auto",
            ),
            rx.vstack(
                rx.text(
                    "No te lo pierdas, el dia 20 de octubre, faltan:",
                    font_size=[Size.MEDIUM.value, Size.DEFAULT.value, Size.BIG.value],
                    color=TextColor.PRIMARY.value,
                    text_align="center",
                    text_shadow="black 1px 1px",
                ),
                # CAJA DONDE SE MUESTRA EL CONTADOR
                # EL CONTADOR ES UNA FUNCION QUE SE ENCUENTRA EN LOS ASSETS ECHO CON JS
                # DE SER NECESARIO UN CAMBIO DE FORMATO DIRIGIRSE A ESA FUNCION LA CUAL ES "countdown.js"
                rx.hstack(
                    rx.box(
                        rx.text(
                            id="days",
                        ),
                        rx.text("Días", style=styles.countdown_text),
                        style=styles.countdown,
                        class_name="alert alert-dismissible",
                    ),
                    rx.box(
                        rx.text(id="hours"),
                        rx.text("Horas", style=styles.countdown_text),
                        style=styles.countdown,
                        class_name="alert alert-dismissible",
                    ),
                    rx.box(
                        rx.text(id="minutes"),
                        rx.text("Minutos", style=styles.countdown_text),
                        style=styles.countdown,
                        class_name="alert alert-dismissible",
                    ),
                    rx.box(
                        rx.text(id="seconds"),
                        rx.text("Segundos", style=styles.countdown_text),
                        style=styles.countdown,
                        class_name="alert alert-dismissible",
                    ),
                    id="countdown",
                    spacing="4",
                ),
                # MENSAJE QUE SE MUESTRA CUANDO TERMINA EL CONTEO
                rx.box(
                    rx.text("¡Comienza la PyCon!"),
                    id="event-started",
                    display="none",
                    class_name="alert alert-dismissible",
                    style=styles.countdown,
                ),
                # HASHTAG PARA COMPARTIR REDES SOCIALES
                rx.link(
                    "#PYTHON PANAMA",
                    href=constants.PYCON_HASHTAG_URL,
                    is_external=True,
                    color=TextColor.FIFTH.value,
                    font_size=Size.DEFAULT.value,
                ),
                align_items="center",
            ),
            style=styles.header,
        ),
        rx.script(src="/js/countdown.js"),
        padding_y=Size.VERY_BIG.value,
    )
