import reflex as rx
import dev_2025.styles.styles as styles
from dev_2025.views.navbar import navbar
from dev_2025.views.footer import footer
from dev_2025.styles.styles import Color


def sponsors() -> rx.Component:
    return rx.vstack(
        navbar(),
        rx.text(
            "Agradecemos el gran apoyo de nuestros Sponsors.",
            id="sponsors",
            style=styles.sponsors_title,
        ),
        rx.box(
            rx.hstack(
                rx.box(
                    rx.link(
                        rx.el.img(
                            src="/images/Sponsor1-Pyladies-B4VQ2QPR.png",
                            style=styles.sponsors_img,
                        ),
                        href="#",
                    ),
                    style=styles.sponsors_img_container,
                    _hover={
                        "transform": "scale(1.02)",
                        "transition": "transform 0.3s ease-in-out",
                        # "border": "3px solid black",
                        "animation": "textoAnimado 2s linear infinite",
                        "@keyframes textoAnimado": {
                            "0%": {"color": Color.ACCENT.value},
                            "50%": {"color": Color.SECONDARY.value},
                            "100%": {"color": Color.FOURTH.value},
                        },
                    },
                ),
                rx.box(
                    rx.link(
                        rx.el.img(
                            src="/images/Sponsor2-PSF-DenK-THt.png",
                            style=styles.sponsors_img,
                        ),
                        href="https://www.python.org/psf-landing/",
                    ),
                    style=styles.sponsors_img_container,
                    _hover={
                        "transform": "scale(1.02)",
                        "transition": "transform 0.3s ease-in-out",
                        # "border": "3px solid black",
                        "animation": "textoAnimado 2s linear infinite",
                        "@keyframes textoAnimado": {
                            "0%": {"color": Color.ACCENT.value},
                            "50%": {"color": Color.SECONDARY.value},
                            "100%": {"color": Color.FOURTH.value},
                        },
                    },
                ),
                rx.box(
                    rx.link(
                        rx.el.img(
                            src="/images/Sponsor3-SoftD3v-DxBzIADV.png",
                            style=styles.sponsors_img,
                        ),
                        href="#",
                    ),
                    style=styles.sponsors_img_container,
                    _hover={
                        "transform": "scale(1.02)",
                        "transition": "transform 0.3s ease-in-out",
                        # "border": "3px solid black",
                        "animation": "textoAnimado 2s linear infinite",
                        "@keyframes textoAnimado": {
                            "0%": {"color": Color.ACCENT.value},
                            "50%": {"color": Color.SECONDARY.value},
                            "100%": {"color": Color.FOURTH.value},
                        },
                    },
                ),
                rx.box(
                    rx.link(
                        rx.el.img(
                            src="/images/Sponsor4-jb_beam-2O1FuFIW.png",
                            style=styles.sponsors_img,
                        ),
                        href="https://www.jetbrains.com/",
                    ),
                    style=styles.sponsors_img_container,
                    _hover={
                        "transform": "scale(1.02)",
                        "transition": "transform 0.3s ease-in-out",
                        # "border": "3px solid black",
                        "animation": "textoAnimado 2s linear infinite",
                        "@keyframes textoAnimado": {
                            "0%": {"color": Color.ACCENT.value},
                            "50%": {"color": Color.SECONDARY.value},
                            "100%": {"color": Color.FOURTH.value},
                        },
                    },
                ),
                wrap="wrap",
                dislpay="flex",
                align_items="center",
                justify_content="center",
                gap="2rem",
            ),
            style=styles.sponsors_container,
        ),
        footer(),
        style=styles.sponsors,
        background_image="url('/2025/images/Sprinkle_bg.svg')",
        # la direccion abajo es para pruebas en reflex run
        # background_image="url('/images/Sprinkle_bg.svg')",
    )
