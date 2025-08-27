import reflex as rx
import dev_2025.styles.styles as styles
from dev_2025.styles.styles import Color, Size, TextColor
import dev_2025.constants as constants


def instructions() -> rx.Component:
    return rx.vstack(
        rx.box(
            rx.text(
                "Acerca del evento",
                style=styles.instructions_title,
                id="instructions",
            ),
            rx.vstack(
                rx.el.span(
                    "La PyCon es una conferencia que reúne a entusiastas y profesionales del lenguaje Python en un espacio dinámico, colaborativo y enriquecedor. El evento está diseñado para fomentar la innovación, el aprendizaje continuo y el intercambio de experiencias entre la comunidad.",
                    style=styles.instructions_paragraph,
                ),
                rx.el.span(
                    "Durante dos días, tendrás la oportunidad de conectar con personas apasionadas por la tecnología y el desarrollo en Python, participar en charlas, talleres y actividades especiales.",
                    style=styles.instructions_paragraph,
                ),
                rx.el.span(
                    "La entrada es gratuita. ¡Pronto habilitaremos un formulario de registro para que puedas asegurar tu puesto!",
                    style=styles.instructions_paragraph,
                ),
                # BOTON CON REDIRECCION AL FORMULARIO DE REGISTRO
                # rx.link(
                #     "Registrate Aquí!!!",
                #     href=constants.FORM_URL,
                #     style=styles.instructions_boton_registro,
                #     _hover={
                #         "border": f"3px solid {Color.TERTIARY.value}",
                #         # "box-shadow": "none",
                #         "transform": "scale(1.05)",
                #         "animation": "textoAnimado 2s linear infinite",
                #         "@keyframes textoAnimado": {
                #             "0%": {"color": Color.ACCENT.value},
                #             "50%": {"color": Color.SECONDARY.value},
                #             "100%": {"color": Color.FOURTH.value},
                #         },
                #     },
                # ),
                rx.el.span(
                    "Consulta nuestra agenda para conocer a los expositores y descubrir los temas que estarán compartiendo con nosotros.",
                    style=styles.instructions_paragraph,
                ),
                style=styles.instructions_box,
                # data_animate="slideUp",
                spacing="4",
            ),
            style=styles.max_width_style,
        ),
    )
