import reflex as rx
from my_first_page.styles.styles import Size, Color


def day(number: int, image: str = "bird_logo.jpg", url: str = "") -> rx.Component:
    return rx.box(
        rx.cond(
            url != "",
            #condicion de en caso de ser una url dibuje esta opcion
            rx.link(
                rx.image(
                    src=image,
                    alt="Regalo asociado al dia {number}",
                ),
                href=url,
                is_external=True,
                position="absolute",
            )
        ),
        rx.cond(
            url == "",
            #condicion de en caso de NO ser una url dibuje esta opcion
                rx.image(
                    src=image,
                    alt="Regalo asociado al dia {number}",
                    position="absolute",
                ),
        ),
        rx.text(
            number,
            padding=Size.DEFAULT.value,
            position="absolute",
        ),
        bg=Color.ACCENT.value,
        width="100%",
        aspect_ratio="1",
        position="relative",
    )
    
