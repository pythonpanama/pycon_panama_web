from my_first_page.views import instructions
import reflex as rx
from my_first_page.styles.styles import Size, Color, TextColor
import my_first_page.styles.styles as styles
import my_first_page.constants as constants


def navbar() -> rx.Component:
    return (
        rx.vstack(
            rx.desktop_only(
                rx.hstack(
                    rx.box(
                        rx.el.span(
                            "PyCon ",
                            color=TextColor.PRIMARY.value,
                        ),
                        rx.el.span(
                            "Panamá ",
                            color=TextColor.SECONDARY.value,
                        ),
                        rx.el.span(
                            "2025 ",
                            color=TextColor.FOURTH.value,
                        ),
                        font_size=[
                            Size.MEDIUM.value,
                            Size.DEFAULT.value,
                            Size.BIG.value,
                        ],
                    ),
                    rx.spacer(),
                    rx.hstack(
                        rx.link(
                            "Inicio",
                            href=constants.INICIO_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Acerca de.",
                            href=constants.ACERCA_DE_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Agenda",
                            href=constants.CALENDAR_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Sedes",
                            href=constants.SEDES_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Sponsors",
                            href=constants.SPONSORS_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Código de conducta",
                            href=constants.CODIGO_CONDUCTA_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        justify_content="flex_end",
                        align_items="center",
                        # spacing="5",
                    ),
                    # width="100%",
                    # align_items="center",
                    style=styles.desktop_navbar_style,
                ),
                width="100%",
            ),
            rx.mobile_and_tablet(
                rx.hstack(
                    rx.box(
                        rx.el.span(
                            "PyCon ",
                            color=TextColor.PRIMARY.value,
                        ),
                        rx.el.span(
                            "Panamá ",
                            color=TextColor.SECONDARY.value,
                        ),
                        rx.el.span(
                            "2025 ",
                            color=TextColor.FOURTH.value,
                        ),
                        font_size=[
                            Size.DEFAULT.value,
                            Size.BIG.value,
                            Size.BIG.value,
                        ],
                    ),
                    rx.menu.root(
                        rx.menu.trigger(rx.icon("menu", size=30)),
                        rx.menu.content(
                            rx.menu.item(
                                "Inicio", on_click=rx.redirect(constants.INICIO_URL)
                            ),
                            rx.menu.item(
                                "Acerca de.",
                                on_click=rx.redirect(constants.ACERCA_DE_URL),
                            ),
                            rx.menu.item(
                                "Agenda", on_click=rx.redirect(constants.CALENDAR_URL)
                            ),
                            rx.menu.item(
                                "Sedes", on_click=rx.redirect(constants.SEDES_URL)
                            ),
                            rx.menu.item(
                                "Sponsors", on_click=rx.redirect(constants.SPONSORS_URL)
                            ),
                            rx.menu.item(
                                "Código de conducta",
                                on_click=rx.redirect(constants.CODIGO_CONDUCTA_URL),
                            ),
                        ),
                        justify="end",
                    ),
                    color=Color.PRIMARY.value,
                    justify="between",
                    align_items="center",
                ),
                style=styles.mobile_navbar_style,
                width="100%",
            ),
            width="100%",
            z_index="999",
            position="sticky",
            top="0",
        ),
    )
