import reflex as rx
import my_first_page.styles.styles as styles
import my_first_page.constants as constants
from my_first_page.styles.styles import Size
from my_first_page.components.link_icon import link_icon


def footer() -> rx.Component:
    return rx.hstack(
        rx.vstack(
            rx.hstack(
                link_icon("facebook", constants.FACEBOOK_URL_PYTHON_PANAMA),
                link_icon("twitter", constants.TWITTER_URL_PYTHON_PANAMA),
                link_icon("linkedin", constants.LINKEDIN_URL_PYTHON_PANAMA),
                link_icon("instagram", constants.INSTAGRAM_URL_PYTHON_PANAMA),
                margin="0 auto",
                size=Size.BIG.value,
            ),
            rx.link(
                "© 2025 Copyright Python Panamá",
                href=constants.PYCON_HASHTAG_URL,
                is_external=True,
                font_size=Size.DEFAULT.value,
                margin="0 auto",
            ),
            margin="0 auto",
        ),
        style=styles.footer_style,
    )
