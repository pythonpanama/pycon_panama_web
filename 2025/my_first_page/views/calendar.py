import reflex as rx
from my_first_page.constants import EVENTS
from my_first_page.styles.styles import Size, TextColor, Color
import my_first_page.styles.styles as styles

def calendar() -> rx.Component:
    return rx.box(
        rx.text(
            "Calendario de Eventos",
            font_size=Size.BIG.value,
            color=TextColor.PRIMARY.value,
            padding_bottom=Size.BIG.value,
        ),
        rx.hstack(
                rx.text("El evento comenzara en"),
                rx.text(id="countdown",
                        color="#ffffff",
                        font_size="2rem",
                        font_weight="bold",),
                align_items="start",
            ),
        rx.grid(
            rx.foreach(
                EVENTS,
                lambda event: rx.box(
                    rx.image(
                        src=event["image"],
                        alt="Imagen del presentador",
                        width="150px",
                        height="150px",
                        border_radius="50%",
                        margin_bottom="1rem",
                    ),
                    rx.text(
                        event["topic"],
                        font_size="1.2rem",
                        font_weight="bold",
                        margin_bottom="0.5rem",
                    ),
                    rx.text(
                        f"Fecha: {event['date']} - Hora: {event['time']}",
                        font_size="1rem",
                        margin_bottom="0.5rem",
                    ),
                    rx.link(
                        "Ver Redes Sociales",
                        href=event["social_link"],
                        color=TextColor.ACCENT.value,
                        is_external=True,
                    ),
                    padding="1rem",
                    border="1px solid #ccc",
                    border_radius="8px",
                    box_shadow="0 4px 6px rgba(0, 0, 0, 0.1)",
                    width="100%",
                    text_align="start",
                    bg_color=Color.TERTIARY.value,
                ),
            ),
            template_columns="repeat(auto-fit, minmax(250px, 1fr))",
            gap="2rem",
            width="100%",
        ),
        rx.script(src="/js/countdown.js"),
        style=styles.max_width_style,
    )