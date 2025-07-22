from my_first_page.styles.colors import TextColor
import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.styles.styles import Size


def location() -> rx.Component:
    return rx.vstack(
        rx.text(
            "Sedes",
            font_size=Size.BIG.value,
            color=TextColor.FIFTH.value,
        ),
        rx.hstack(
            rx.vstack(
                rx.text(
                    "Día 1 My Office",
                    style=styles.upper_text_sede,
                    background="#AB62CD",
                    border="2px solid #AB62CD",
                ),
                rx.image(
                    src="PyConPet.jpg",
                    alt="mascota python",
                    style=styles.img_sede,
                    border_bottom="4px solid #AB62CD",
                ),
                rx.link(
                    "Ver maps",
                    style=styles.lower_text_sede,
                ),
                style=styles.card_container_sede,
                border="4px solid #AB62CD",
                box_shadow="8px 8px 0 #AB62CD",
            ),
            rx.vstack(
                rx.text(
                    "Día 2 Universidad Tecnologica de Panamá",
                    style=styles.upper_text_sede,
                    background="#1E4171",
                    border="2px solid #1E4171",
                ),
                rx.image(
                    src="PyConPet.jpg",
                    alt="mascota python",
                    style=styles.img_sede,
                    border_bottom="4px solid #1E4171",
                ),
                rx.link(
                    "Ver maps",
                    style=styles.lower_text_sede,
                ),
                style=styles.card_container_sede,
                border="4px solid #1E4171",
                box_shadow="8px 8px 0 #1E4171",
            ),
            rx.vstack(
                rx.text(
                    "Día 3 Itse",
                    style=styles.upper_text_sede,
                    background="#6FC7E1",
                    border="2px solid #6FC7E1",
                ),
                rx.image(
                    src="PyConPet.jpg",
                    alt="mascota python",
                    style=styles.img_sede,
                    border_bottom="4px solid #6FC7E1",
                ),
                rx.link(
                    "Ver maps",
                    style=styles.lower_text_sede,
                ),
                style=styles.card_container_sede,
                border="4px solid #6FC7E1",
                box_shadow="8px 8px 0 #6FC7E1",
            ),
            loading="lazy",
            flex_direction=["column", "column", "column", "row", "row", "row"],
            align_items="center",
            justify_content="center",
            margin_x="auto",
            margin_y="1rem",
            gap="2rem",
        ),
        align_items="center",
        width="100%",
    )
