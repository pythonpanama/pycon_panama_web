# https://reflex.dev/docs/components/rendering-iterables/
# https://codepen.io/rustcode/pen/MYYMrVQ       link referencia estilo
import reflex as rx
from my_first_page.constants import EVENTS_DAY_3
import my_first_page.styles.styles as styles
from my_first_page.components.link_icon import link_icon


def presentation_day_3():
    return rx.box(
        # Estructura del div.card-container
        rx.flex(
            rx.foreach(
                EVENTS_DAY_3,
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
                                            "background": "#AB62CD",
                                            "color": "#FDE3C8",
                                            "border": "3px solid #FDE3C8",
                                            "box-shadow": "none",
                                        },
                                    ),
                                ),
                                # contenido del dialog
                                rx.dialog.content(
                                    rx.flex(
                                        # Imagen a la izquierda
                                        rx.image(
                                            src=event["image_url"],
                                            alt="Foto de perfil",
                                            width="200px",
                                            height="300px",
                                            # box_size="150px",
                                            border_radius="25px",
                                            object_fit="fill",
                                        ),
                                        # Información a la derecha
                                        rx.box(
                                            rx.box(
                                                rx.heading(
                                                    event["name"],
                                                    style=styles.lower_container_h3,
                                                ),
                                                rx.heading(
                                                    event["title"],
                                                    style=styles.lower_container_h4,
                                                ),
                                            ),
                                            rx.box(
                                                rx.text(
                                                    event["legend"],
                                                ),
                                            ),
                                            rx.hstack(
                                                link_icon("twitter", event["twitter"]),
                                                link_icon(
                                                    "instagram", event["instagram"]
                                                ),
                                                link_icon(
                                                    "linkedin", event["linkedin"]
                                                ),
                                            ),
                                            max_w="400px",
                                            wrap="wrap",
                                            color=styles.TextColor.FIFTH,
                                        ),
                                        flex_direction="row",
                                        align_items="center",
                                        gap="1rem",
                                        margin_y="2rem",
                                    ),
                                    rx.dialog.close(
                                        rx.link(
                                            "Cerrar",
                                            size="2",
                                            mt="1.5rem",
                                            # variant="soft",
                                            style=styles.boton,
                                            _hover={
                                                "background": "#AB62CD",
                                                "color": "#FDE3C8",
                                                "border": "3px solid #FDE3C8",
                                                "box-shadow": "none",
                                            },
                                        )
                                    ),
                                    # padding="2rem",
                                    # border_radius="lg",
                                    # box_shadow="lg",
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
            # "repeat(auto-fit, minmax(250px, 1fr))"
            # template_columns=[1, 2, 3],
            # spacing="2",
            # gap="2rem",
        ),
    )
