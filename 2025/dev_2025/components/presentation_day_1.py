# https://reflex.dev/docs/components/rendering-iterables/
# https://codepen.io/rustcode/pen/MYYMrVQ       link referencia estilo
import reflex as rx
import dev_2025.styles.styles as styles
from dev_2025.constants import EVENTS_DAY_1
from dev_2025.styles.colors import Color, TextColor
from dev_2025.components.link_icon import link_icon


def presentation_day_1():
    return rx.box(
        # Estructura del div.card-container
        rx.flex(
            rx.foreach(
                EVENTS_DAY_1,
                lambda event: rx.box(
                    # upper-container
                    rx.box(
                        rx.box(
                            rx.image(
                                src=event["image_url"],
                                alt="profile image",
                                style=styles.image_container_img,
                            ),
                            # class_name="image-container",
                            style=styles.image_container,
                        ),
                        # class_name="upper-container",
                        style=styles.upper_container,
                    ),
                    # lower-container
                    rx.box(
                        rx.box(
                            rx.heading(event["name"], style=styles.lower_container_h3),
                            rx.heading(event["title"], style=styles.lower_container_h4),
                            rx.heading(event["time"], style=styles.lower_container_h4),
                        ),
                        rx.box(
                            rx.text(
                                event["description"], style=styles.lower_container_p
                            )
                        ),
                        # dialog box
                        rx.box(
                            rx.dialog.root(
                                rx.dialog.trigger(
                                    rx.link(
                                        "Ver mas",
                                        style=styles.boton,
                                        _hover={
                                            "background": Color.PRIMARY.value,
                                            "color": TextColor.TERTIARY.value,
                                            "border": f"3px solid {Color.TERTIARY.value}",
                                            "box-shadow": "none",
                                        },
                                    ),
                                ),
                                # contenido del dialog
                                rx.dialog.content(
                                    rx.flex(
                                        rx.box(
                                            rx.image(
                                                src=event["image_url"],
                                                alt="Foto de perfil",
                                                style=styles.ver_mas_img,
                                            ),
                                            rx.heading(
                                                event["title"],
                                                style=styles.lower_container_h4,
                                                align="center",
                                            ),
                                            rx.hstack(
                                                # *[
                                                #     link_icon(name, url)
                                                #     for name, url in (
                                                #         event.get("socials") or {}
                                                #     ).items()
                                                # ],
                                                link_icon("twitter", event["twitter"]),
                                                link_icon(
                                                    "instagram", event["instagram"]
                                                ),
                                                link_icon(
                                                    "linkedin", event["linkedin"]
                                                ),
                                                justify="center",
                                                style=styles.ver_mas_socials,
                                                _hover={
                                                    "color": Color.FOURTH.value,
                                                },
                                            ),
                                            width="100%",
                                            height="100%",
                                        ),
                                        rx.box(
                                            rx.heading(
                                                event["name"],
                                                style=styles.lower_container_h3,
                                                align="center",
                                            ),
                                            rx.text(
                                                event["legend"], style=styles.legend
                                            ),
                                            rx.center(
                                                rx.dialog.close(
                                                    rx.link(
                                                        "Cerrar",
                                                        size="2",
                                                        mt="1.5rem",
                                                        style=styles.ver_mas_close_boton,
                                                        _hover={
                                                            "background": Color.PRIMARY.value,
                                                            "color": TextColor.TERTIARY.value,
                                                            "border": f"3px solid {Color.TERTIARY.value}",
                                                            "box-shadow": "none",
                                                        },
                                                    ),
                                                ),
                                            ),
                                            max_w="400px",
                                            color=styles.TextColor.FIFTH,
                                        ),
                                        flex_direction=["column", "column", "row"],
                                        align_items="center",
                                        gap="2rem",
                                        padding="1rem",
                                    ),
                                    style=styles.ver_mas,
                                ),
                            ),
                        ),
                        # class_name="lower-container",
                        style=styles.lower_container,
                    ),
                    # class_name="card-container",
                    style=styles.card_container,
                ),
            ),
            wrap="wrap",
            loading="lazy",
            align_items="center",
            justify_content="center",
            margin_x="auto",
            margin_y="2rem",
            gap="2rem",
            flex_direction=["column", "column", "column", "row", "row", "row"],
        ),
    )
