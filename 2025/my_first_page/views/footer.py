import reflex as rx
import my_first_page.constants as constants
from my_first_page.styles.styles import Size, Color, TextColor
import my_first_page.styles.styles as styles
from my_first_page.components.link_icon import link_icon


def footer() -> rx.Component:
    return rx.hstack(
        rx.vstack(
            rx.text(
                "Python Panama 2025.",
                font_size=Size.MEDIUM.value,
                margin_bottom=Size.ZERO.value,
            ),
            rx.link(
                "creado por la comunidad python con amor para que todos puedan conocernos mejor",
                href=constants.PYCON_HASHTAG_URL,
                is_external=True,
                font_size=Size.MEDIUM.value,
                color=TextColor.FIFTH.value,
            ),
            align_items="start",
            # lo mismo de antes, spacing no acepta valores 4em, tiene que usar definidos ya por reflex
            spacing="4",
        ),
        rx.spacer(),
        rx.image(
            src="PyConPet.jpg",
            alt="mascota python",
            # aca mauro uso un class_name de el estilo que el importo para el tamaño
            # como el mio no tiene estilos para imagenes ajuste con width y height
            width="5em",
            height="5em",
        ),
        rx.vstack(
            link_icon("youtube", constants.YOUTUBE_URL),
            link_icon("twitter", constants.TWITTER_URL),
            link_icon("instagram", constants.INSTAGRAM_URL),
        ),
        width="100%",
        padding_bottom=Size.BIG.value,
        style=styles.max_width_style,
    )

