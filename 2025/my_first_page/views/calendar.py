import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.views.navbar import navbar
from my_first_page.components.presentation_day_1 import presentation_day_1
from my_first_page.components.presentation_day_2 import presentation_day_2
from my_first_page.components.presentation_day_3 import presentation_day_3


# Creamos el State
class CalendarState(rx.State):
    selected_day: int = 1  # Por defecto mostrar el día 1


def calendar() -> rx.Component:
    return rx.box(
        navbar(),
        rx.vstack(
            rx.hstack(
                rx.link(
                    "Día 1",
                    on_click=lambda: CalendarState.set_selected_day(1),
                    # class_name="btn",
                    style=styles.boton,
                    _hover={
                        "background": "#D49EE7",
                        "color": "#1E4171",
                        "border": "3px solid #FDE3C8",
                        "box-shadow": "none",
                    },
                ),
                rx.link(
                    "Día 2",
                    on_click=lambda: CalendarState.set_selected_day(2),
                    # class_name="btn",
                    style=styles.boton,
                    _hover={
                        "background": "#D49EE7",
                        "color": "#1E4171",
                        "border": "3px solid #FDE3C8",
                        "box-shadow": "none",
                    },
                ),
                rx.link(
                    "Día 3",
                    on_click=lambda: CalendarState.set_selected_day(3),
                    # class_name="btn",
                    style=styles.boton,
                    _hover={
                        "background": "#D49EE7",
                        "color": "#1E4171",
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
            width="100%",
            align_items="center",
            justify_content="center",
            margin_x="auto",
        ),
        width="100%",
        padding_y=styles.Size.BIG.value,
        padding_x=styles.Size.BIG.value,
    )
