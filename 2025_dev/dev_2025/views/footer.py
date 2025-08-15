import reflex as rx
import dev_2025.styles.styles as styles
import dev_2025.constants as constants
from dev_2025.styles.styles import Size
from dev_2025.components.link_icon import link_icon
from dev_2025.styles.styles import TextColor


# viejo footer
# def footer() -> rx.Component:
#     return rx.hstack(
#         rx.vstack(
#             rx.hstack(
#                 link_icon("facebook", constants.FACEBOOK_URL_PYTHON_PANAMA),
#                 link_icon("twitter", constants.TWITTER_URL_PYTHON_PANAMA),
#                 link_icon("linkedin", constants.LINKEDIN_URL_PYTHON_PANAMA),
#                 link_icon("instagram", constants.INSTAGRAM_URL_PYTHON_PANAMA),
#                 margin="0 auto",
#                 size=Size.BIG.value,
#             ),
#             rx.link(
#                 "© 2025 Copyright Python Panamá",
#                 href=constants.PYCON_HASHTAG_URL,
#                 is_external=True,
#                 font_size=Size.DEFAULT.value,
#                 margin="0 auto",
#             ),
#             margin="0 auto",
#         ),
#         style=styles.footer_style,
#     )
def footer_item(text: str, href: str) -> rx.Component:
    return rx.link(
        rx.text(text, size="3"),
        href=href,
        text_shadow="black 2px 2px",
    )


def footer_items_1() -> rx.Component:
    return rx.flex(
        rx.heading(
            "RECURSOS",
            size="5",
            weight="bold",
            as_="h3",
            color=TextColor.FOURTH.value,
            text_shadow="black 2px 2px",
        ),
        footer_item("PyCon 2024", constants.PYCON_2024),
        footer_item("Blog", constants.PYTHON_BLOG),
        spacing="4",
        text_align=["center", "center", "start"],
        flex_direction="column",
    )


def footer_items_2() -> rx.Component:
    return rx.flex(
        rx.heading(
            "ABOUT US",
            size="5",
            weight="bold",
            as_="h3",
            color=TextColor.FOURTH.value,
            text_shadow="black 2px 2px",
        ),
        footer_item(
            "Código de conducta",
            constants.CODIGO_CONDUCTA_URL,
        ),
        footer_item(
            "Meetup",
            constants.MEETUP_URL_PYTHOH_PANAMA,
        ),
        spacing="4",
        text_align=["center", "center", "start"],
        flex_direction="column",
    )


def socials() -> rx.Component:
    return rx.flex(
        link_icon("instagram", constants.INSTAGRAM_URL_PYTHON_PANAMA),
        link_icon("twitter", constants.TWITTER_URL_PYTHON_PANAMA),
        link_icon("facebook", constants.FACEBOOK_URL_PYTHON_PANAMA),
        link_icon("linkedin", constants.LINKEDIN_URL_PYTHON_PANAMA),
        spacing="3",
        justify_content=["center", "center", "end"],
        width="100%",
    )


def footer() -> rx.Component:
    return rx.el.footer(
        rx.vstack(
            rx.flex(
                rx.vstack(
                    rx.hstack(
                        rx.heading(
                            "PyCon 2025",
                            size="7",
                            weight="bold",
                            color=TextColor.FOURTH.value,
                            text_shadow="black 2px 2px",
                        ),
                        align_items="center",
                    ),
                    spacing="4",
                    align_items=[
                        "center",
                        "center",
                        "start",
                    ],
                ),
                footer_items_1(),
                footer_items_2(),
                justify="between",
                spacing="6",
                flex_direction=["column", "column", "row"],
                width="100%",
            ),
            rx.divider(),
            rx.flex(
                rx.hstack(
                    rx.link(
                        "© 2025 Copyright Python Panamá",
                        href=constants.PYCON_HASHTAG_URL,
                        size="3",
                        white_space="nowrap",
                        weight="medium",
                    ),
                    spacing="2",
                    align="center",
                    justify_content=[
                        "center",
                        "center",
                        "start",
                    ],
                    width="100%",
                ),
                socials(),
                spacing="4",
                flex_direction=["column", "column", "row"],
                width="100%",
            ),
            spacing="5",
            width="100%",
        ),
        style=styles.footer_style,
    )
