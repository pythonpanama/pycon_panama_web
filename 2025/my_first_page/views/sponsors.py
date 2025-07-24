import reflex as rx
import my_first_page.styles.styles as styles


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
            id="sponsors",
            style=styles.sponsors_title,
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
    )
