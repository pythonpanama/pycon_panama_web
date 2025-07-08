import reflex as rx
from my_first_page.styles.styles import Size, Color, TextColor
import my_first_page.styles.styles as styles


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
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Acerca de.",
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Agenda",
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Sedes",
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Sponsors",
                            style=styles.nav_links,
                            _hover={
                                "color": TextColor.FOURTH.value,
                                "text_decoration": "underline",
                            },
                        ),
                        rx.link(
                            "Código de conducta",
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
                    width="100%",
                    justify_content="space-between",
                    align_items="center",
                    bg=Color.TERTIARY.value,
                    position="sticky",
                    border_bottom=f"0.25em solid {Color.SECONDARY.value}",
                    padding_x=Size.BIG.value,
                    padding_y=Size.DEFAULT.value,
                    z_index="999",
                    top="0",
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
                            Size.MEDIUM.value,
                            Size.DEFAULT.value,
                            Size.BIG.value,
                        ],
                    ),
                    rx.menu.root(
                        rx.menu.trigger(rx.icon("menu", size=30)),
                        rx.menu.content(
                            rx.menu.item("Inicio"),
                            rx.menu.item("Acerca de."),
                            rx.menu.item("Agenda"),
                            rx.menu.item("Sedes"),
                            rx.menu.item("Sponsors"),
                            rx.menu.item("Código de conducta"),
                        ),
                        justify="end",
                    ),
                    justify="between",
                    align_items="center",
                ),
                bg=Color.PRIMARY.value,
                position="sticky",
                border_bottom=f"0.25em solid {Color.SECONDARY.value}",
                padding_x=Size.BIG.value,
                padding_y=Size.DEFAULT.value,
                z_index="999",
                top="0",
                width="100%",
            ),
            width="100%",
        ),
    )
