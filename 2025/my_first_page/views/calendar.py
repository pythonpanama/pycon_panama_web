import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.views.navbar import navbar
from my_first_page.components.presentation_day_1 import presentation_day_1
from my_first_page.components.presentation_day_2 import presentation_day_2
from my_first_page.components.presentation_day_3 import presentation_day_3
from my_first_page.views.footer import footer


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
                    "background": "#AB62CD",
                    "color": "#FDE3C8",
                    "border": "3px solid #FDE3C8",
                    "box-shadow": "none",
                },
            ),
            rx.link(
                "Día 2",
                on_click=lambda: CalendarState.set_selected_day(2),
                style=styles.boton,
                _hover={
                    "background": "#AB62CD",
                    "color": "#FDE3C8",
                    "border": "3px solid #FDE3C8",
                    "box-shadow": "none",
                },
            ),
            rx.link(
                "Día 3",
                on_click=lambda: CalendarState.set_selected_day(3),
                style=styles.boton,
                _hover={
                    "background": "#AB62CD",
                    "color": "#FDE3C8",
                    "border": "3px solid #FDE3C8",
                    "box-shadow": "none",
                },
            ),
            padding_y=styles.Size.BIG.value,
            width="100%",
            align_items="center",
            justify_content="center",
            margin_x="auto",
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
        width="100%",
        align_items="center",
        justify_content="space-between",  # para que mantenga un espacio entre el footer y el contenido
        min_height="100vh",  # para que la pagina tenga altura minima de la pantalla
        margin_x="auto",
    )
