import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.styles.colors import Color, TextColor


def sedes() -> rx.Component:
    return rx.vstack(
        rx.text(
            "Sedes",
            id="sedes",
            style=styles.sedes_title,
        ),
        rx.hstack(
            rx.vstack(
                rx.text(
                    "Día 1 My Office",
                    style=styles.upper_text_sede,
                    background=Color.PRIMARY.value,
                    border_color=Color.PRIMARY.value,
                ),
                rx.image(
                    src="PyConPet.jpg",
                    alt="mascota python",
                    style=styles.img_sede,
                ),
                rx.link(
                    "Ver maps",
                    color=TextColor.PRIMARY.value,
                    style=styles.lower_text_sede,
                ),
                style=styles.card_container_sede,
                box_shadow="8px 8px 0 #AB62CD",
            ),
            rx.vstack(
                rx.text(
                    "Día 2\nUniversidad Tecnologica de Panamá",
                    style=styles.upper_text_sede,
                    white_space="pre-line",
                    background=Color.FIFTH.value,
                    border_color=Color.FIFTH.value,
                ),
                rx.image(
                    src="PyConPet.jpg",
                    alt="mascota python",
                    style=styles.img_sede,
                ),
                rx.link(
                    "Ver maps",
                    color=TextColor.FIFTH.value,
                    style=styles.lower_text_sede,
                ),
                style=styles.card_container_sede,
                box_shadow=f"8px 8px 0 {Color.FIFTH.value}",
            ),
            rx.vstack(
                rx.text(
                    "Día 3 Itse",
                    style=styles.upper_text_sede,
                    background=Color.FOURTH.value,
                    border_color=Color.FOURTH.value,
                ),
                rx.image(
                    src="PyConPet.jpg",
                    alt="mascota python",
                    style=styles.img_sede,
                ),
                rx.link(
                    "Ver maps",
                    color=TextColor.FOURTH.value,
                    style=styles.lower_text_sede,
                ),
                style=styles.card_container_sede,
                box_shadow=f"8px 8px 0 {Color.FOURTH.value}",
            ),
            loading="lazy",
            flex_direction=["column", "column", "column", "row", "row", "row"],
            align_items="center",
            justify_content="center",
            margin_x="auto",
            margin_y="1rem",
            gap="2rem",
        ),
        style=styles.sedes_style,
    )
