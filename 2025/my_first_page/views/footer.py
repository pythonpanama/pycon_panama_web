import reflex as rx
import my_first_page.styles.styles as styles
import my_first_page.constants as constants
from my_first_page.styles.styles import Size
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
            ),
            align_items="start",
            # lo mismo de antes, spacing no acepta valores 4em, tiene que usar definidos ya por reflex
            spacing="4",
        ),
        rx.spacer(),
        # la idea es tener la mascota junto con los links, abierto a cambios
        # rx.image(
        #     src="PyConPet.jpg",
        #     alt="mascota python",
        #     width="5em",
        #     height="5em",
        # ),
        rx.hstack(
            link_icon("facebook", constants.FACEBOOK_URL_PYTHON_PANAMA),
            link_icon("twitter", constants.TWITTER_URL_PYTHON_PANAMA),
            link_icon("linkedin", constants.LINKEDIN_URL_PYTHON_PANAMA),
            link_icon("instagram", constants.INSTAGRAM_URL_PYTHON_PANAMA),
            link_icon("whatsapp", constants.WHATSAPP_URL_PYTHON_PANAMA),
        ),
        style=styles.footer_style,
    )
