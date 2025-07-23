from my_first_page.styles.colors import TextColor
import reflex as rx
import my_first_page.styles.styles as styles

from my_first_page.styles.styles import Size


def sponsors() -> rx.Component:
    logos = [
        "img/PSF-DenK-THt.png",
        "img/Pyladies-B4VQ2QPR.png",
        "img/SoftD3v-DxBzIADV.png",
        "img/jb_beam-2O1FuFIW.png",
    ]
    all_logos = logos * 2  # Se duplican para permitir efecto infinito

    return rx.vstack(
        rx.text(
            "Sponsors",
            font_size=Size.VERY_BIG.value,
            color=TextColor.FOURTH.value,
            text_shadow="4px 4px 0 black",
            id="sponsors",
        ),
        rx.box(
            rx.hstack(
                *[
                    rx.image(src=logo, height="100px", margin_x="30px")
                    for logo in all_logos
                ],
                style=styles.carousel_track,
            ),
            style=styles.carousel_container,
        ),
        style=styles.sponsors,
        margin_top="4rem",
    )
