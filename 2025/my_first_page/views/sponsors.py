import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.styles.styles import Size, Color, TextColor
from my_first_page.views.navbar import navbar
from my_first_page.views.footer import footer
# logos = [
#     "/img/PSF-DenK-THt.png",
#     "/img/Pyladies-B4VQ2QPR.png",
#     "/img/SoftD3v-DxBzIADV.png",
#     "/img/jb_beam-2O1FuFIW.png",
# ]
# all_logos = logos * 2  # Se duplican para permitir efecto infinito


def sponsors() -> rx.Component:
    return rx.vstack(
        navbar(),
        rx.text(
            "Sponsors",
            id="sponsors",
            style=styles.sponsors_title,
        ),
        rx.box(
            rx.hstack(
                # *[
                #     rx.image(src=logo, height="70px", margin_x="30px")
                #     for logo in all_logos
                # ],
                # style=styles.carousel_track,
                rx.box(
                    rx.image(
                        src="/img/Pyladies-B4VQ2QPR.png",
                        width="100%",
                        height="100%",
                    ),
                    background=Color.TERTIARY.value,
                    width="300px",
                    height="300px",
                ),
                rx.box(
                    rx.image(
                        src="/img/PSF-DenK-THt.png",
                        width="100%",
                        height="100%",
                    ),
                    background=Color.TERTIARY.value,
                    width="300px",
                    height="300px",
                ),
                rx.box(
                    rx.image(
                        src="/img/SoftD3v-DxBzIADV.png",
                        width="100%",
                        height="100%",
                    ),
                    background=Color.TERTIARY.value,
                    width="300px",
                    height="300px",
                ),
                rx.box(
                    rx.image(
                        src="/img/jb_beam-2O1FuFIW.png",
                        width="100%",
                        height="100%",
                    ),
                    background=Color.TERTIARY.value,
                    width="300px",
                    height="300px",
                ),
                wrap="wrap",
            ),
            style=styles.sponsors_container,
        ),
        footer(),
        style=styles.sponsors,
    )
