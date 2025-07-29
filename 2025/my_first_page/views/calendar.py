import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.styles.colors import Color, TextColor
from my_first_page.views.footer import footer
from my_first_page.views.navbar import navbar
from my_first_page.components.presentation_day_1 import presentation_day_1
from my_first_page.components.presentation_day_2 import presentation_day_2
from my_first_page.components.presentation_day_3 import presentation_day_3


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
