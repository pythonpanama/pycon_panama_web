import reflex as rx
import dev_2025.styles.styles as styles
import dev_2025.constants as constants
from dev_2025.styles.styles import Size
from dev_2025.components.link_icon import link_icon


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
