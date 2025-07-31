import reflex as rx
import dev_2025.styles.styles as styles
import dev_2025.constants as constants
from dev_2025.styles.styles import Size, Color, TextColor


def navbar() -> rx.Component:
    return (
        rx.vstack(
            rx.desktop_only(
                rx.hstack(
                    rx.box(
                        rx.el.span(
                            "PyCon ",
                            color=TextColor.PRIMARY.value,
                            text_shadow="black 2px 2px",
                        ),
                        rx.el.span(
                            "Panamá ",
                            color=TextColor.FOURTH.value,
                            text_shadow="black 2px 2px",
                        ),
                        rx.el.span(
                            "2025 ",
                            color=TextColor.FIFTH.value,
                            text_shadow="black 1px 1px",
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
                                "background": TextColor.PRIMARY.value,
                                "text_decoration": "none",
                            },
                        ),
                        rx.link(
                            "Acerca de.",
                            href=constants.ACERCA_DE_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "background": TextColor.PRIMARY.value,
                                "text_decoration": "none",
                            },
                        ),
                        rx.link(
                            "Agenda",
                            href=constants.CALENDAR_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "background": TextColor.PRIMARY.value,
                                "text_decoration": "none",
                            },
                        ),
                        rx.link(
                            "Sedes",
                            href=constants.SEDES_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "background": TextColor.PRIMARY.value,
                                "text_decoration": "none",
                            },
                        ),
                        rx.link(
                            "Sponsors",
                            href=constants.SPONSORS_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "background": TextColor.PRIMARY.value,
                                "text_decoration": "none",
                            },
                        ),
                        rx.link(
                            "Código de conducta",
                            href=constants.CODIGO_CONDUCTA_URL,
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "background": TextColor.PRIMARY.value,
                                "text_decoration": "none",
                            },
                        ),
                        justify_content="flex_end",
                        align_items="center",
                    ),
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
                            text_shadow="black 2px 2px",
                        ),
                        rx.el.span(
                            "Panamá ",
                            color=TextColor.FOURTH.value,
                            text_shadow="black 2px 2px",
                        ),
                        rx.el.span(
                            "2025 ",
                            color=TextColor.FIFTH.value,
                            text_shadow="black 1px 1px",
                        ),
                        font_size=[
                            Size.BIG.value,
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
