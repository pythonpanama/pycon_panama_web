# https://reflex.dev/docs/components/rendering-iterables/
import reflex as rx
from my_first_page.constants import EVENTS


def presentation():
    return rx.box(
        # Vinculamos el CSS externo
        rx.html('<link rel="stylesheet" href="/card_style.css">'),
        # Estructura del div.card-container
        rx.flex(
            rx.foreach(
                EVENTS,
                lambda event: rx.box(
                    # upper-container
                    rx.box(
                        rx.box(
                            rx.image(src=event["image_url"], alt="profile image"),
                            class_name="image-container",
                        ),
                        class_name="upper-container",
                    ),
                    # lower-container
                    rx.box(
                        rx.box(
                            rx.heading(event["name"], as_="h3"),
                            rx.heading(event["title"], as_="h4"),
                            rx.heading(event["time"], as_="h4"),
                        ),
                        rx.box(rx.text(event["description"])),
                        rx.box(
                            rx.link(
                                "Ver mas",
                                href="#",
                                class_name="btn",
                            ),
                        ),
                        class_name="lower-container",
                    ),
                    class_name="card-container",
                ),
            ),
            wrap="wrap",
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
