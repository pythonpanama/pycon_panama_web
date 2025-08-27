import reflex as rx
import dev_2025.styles.styles as styles
import dev_2025.constants as constants
from dev_2025.styles.styles import Size, TextColor


def header() -> rx.Component:
    return rx.vstack(
        # header de bienvenida
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
            style=styles.header_title,
            # data_animate="fadeIn",
        ),
        # SECCION LOGO CON CONTADOR
        rx.hstack(
            rx.vstack(
                rx.text(
                    "No te lo pierdas los días 16 y 17 de octubre. ",
                    font_size=["1.5em", "1.5em", Size.BIG.value],
                    color=TextColor.PRIMARY.value,
                    text_align="center",
                    text_shadow="black 1px 1px",
                ),
                rx.text(
                    "Faltan:",
                    font_size=["1.5em", "1.5em", Size.BIG.value],
                    color=TextColor.PRIMARY.value,
                    text_align="center",
                    text_shadow="black 1px 1px",
                ),
                # CAJA DONDE SE MUESTRA EL CONTADOR
                # EL CONTADOR ES UNA FUNCION QUE SE ENCUENTRA EN LOS ASSETS ECHO CON JS
                # DE SER NECESARIO UN CAMBIO DE FORMATO DIRIGIRSE A ESA FUNCION LA CUAL ES "countdown.js"
                # ------------------------
                rx.hstack(
                    rx.box(
                        rx.text(
                            id="days",
                        ),
                        rx.text("Días", style=styles.countdown_text),
                        style=styles.countdown,
                        # class_name="alert alert-dismissible",
                    ),
                    rx.box(
                        rx.text(id="hours"),
                        rx.text("Horas", style=styles.countdown_text),
                        style=styles.countdown,
                        # class_name="alert alert-dismissible",
                    ),
                    rx.box(
                        rx.text(id="minutes"),
                        rx.text("Minutos", style=styles.countdown_text),
                        style=styles.countdown,
                        # class_name="alert alert-dismissible",
                    ),
                    # rx.box(
                    #     rx.text(id="seconds"),
                    #     rx.text("Segundos", style=styles.countdown_text),
                    #     style=styles.countdown,
                    #     # class_name="alert alert-dismissible",
                    # ),
                    id="countdown",
                    width="100%",
                    wrap="wrap",
                    direction="row",
                    justify="center",
                    gap="1em",
                ),
                # ------------------------
                # MENSAJE QUE SE MUESTRA CUANDO TERMINA EL CONTEO
                rx.box(
                    rx.text(
                        "¡La PyCon 2025 ha comenzado!",
                        style=styles.countdown_finish,
                    ),
                    id="event-started",
                    display="none",
                ),
                # HASHTAG PARA COMPARTIR REDES SOCIALES
                # rx.link(
                #     "Conocenos en #PYTHON PANAMÁ",
                #     href=constants.PYCON_HASHTAG_URL,
                #     is_external=True,
                #     color=TextColor.FOURTH.value,
                #     font_size=[Size.DEFAULT.value, Size.BIG.value, Size.BIG.value],
                #     margin="0 auto",
                #     text_shadow="black 2px 2px",
                # ),
                align_items="center",
            ),
            style=styles.header_countdown_section,
        ),
        rx.script(src="js/countdown.js"),
        style=styles.header,
    )
