import reflex as rx
import dev_2025.styles.styles as styles
from dev_2025.styles.colors import Color, TextColor
from dev_2025.views.footer import footer
from dev_2025.views.navbar import navbar
from dev_2025.components.presentation_day_1 import presentation_day_1
from dev_2025.components.presentation_day_2 import presentation_day_2
from dev_2025.components.presentation_day_3 import presentation_day_3


# Creamos el State
class CalendarState(rx.State):
    selected_day: int = 1  # Por defecto mostrar el día 1


def calendar() -> rx.Component:
    return rx.vstack(
        # rx.vstack(
        navbar(),
        rx.hstack(
            rx.link(
                "Día 1",
                on_click=lambda: CalendarState.set_selected_day(1),
                style=styles.boton,
                _hover={
                    "background": Color.PRIMARY.value,
                    "color": TextColor.TERTIARY.value,
                    "border": f"3px solid {Color.TERTIARY.value}",
                    "box-shadow": "none",
                },
            ),
            rx.link(
                "Día 2",
                on_click=lambda: CalendarState.set_selected_day(2),
                style=styles.boton,
                _hover={
                    "background": Color.PRIMARY.value,
                    "color": TextColor.TERTIARY.value,
                    "border": f"3px solid {Color.TERTIARY.value}",
                    "box-shadow": "none",
                },
            ),
            rx.link(
                "Día 3",
                on_click=lambda: CalendarState.set_selected_day(3),
                style=styles.boton,
                _hover={
                    "background": Color.PRIMARY.value,
                    "color": TextColor.TERTIARY.value,
                    "border": f"3px solid {Color.TERTIARY.value}",
                    "box-shadow": "none",
                },
            ),
            style=styles.calendar_buttons_area,
        ),
        rx.cond(
            CalendarState.selected_day == 1,
            presentation_day_1(),
        ),
        rx.cond(
            CalendarState.selected_day == 2,
            presentation_day_2(),
        ),
        rx.cond(
            CalendarState.selected_day == 3,
            presentation_day_3(),
        ),
        footer(),
        style=styles.calendar_style,
    )
