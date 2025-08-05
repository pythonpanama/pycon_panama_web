import reflex as rx
import dev_2025.styles.styles as styles
from dev_2025.views.navbar import navbar
from dev_2025.views.footer import footer


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
                    rx.el.img(
                        src="/images/Sponsor1-Pyladies-B4VQ2QPR.png",
                        style=styles.sponsors_img,
                    ),
                    style=styles.sponsors_img_container,
                ),
                rx.box(
                    rx.el.img(
                        src="/images/Sponsor2-PSF-DenK-THt.png",
                        style=styles.sponsors_img,
                    ),
                    style=styles.sponsors_img_container,
                ),
                rx.box(
                    rx.el.img(
                        src="/images/Sponsor3-SoftD3v-DxBzIADV.png",
                        style=styles.sponsors_img,
                    ),
                    style=styles.sponsors_img_container,
                ),
                rx.box(
                    rx.el.img(
                        src="/images/Sponsor4-jb_beam-2O1FuFIW.png",
                        style=styles.sponsors_img,
                    ),
                    style=styles.sponsors_img_container,
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
    )
