# https://reflex.dev/docs/components/rendering-iterables/
import reflex as rx
from my_first_page.constants import EVENTS_DAY_2
import my_first_page.styles.styles as styles


def presentation_day_2():
    return rx.box(
        # Vinculamos el CSS externo
        # rx.html('<link rel="stylesheet" href="/card_style.css">'),
        # Estructura del div.card-container
        rx.flex(
            rx.foreach(
                EVENTS_DAY_2,
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
                        rx.box(
                            rx.link(
                                "Ver mas",
                                href="#",
                                # class_name="btn",
                                style=styles.boton,
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
            gap="2rem",
            flex_direction=["column", "column", "column", "row", "row", "row"],
            # "repeat(auto-fit, minmax(250px, 1fr))"
            # template_columns=[1, 2, 3],
            # spacing="2",
            # gap="2rem",
        ),
    )
