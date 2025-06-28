import reflex as rx
from my_first_page.styles.styles import Size
from my_first_page.components.presentation import (
    presentation_day_1,
    presentation_day_2,
    presentation_day_3,
)


# Creamos el State
class CalendarState(rx.State):
    selected_day: int = 1  # Por defecto mostrar el día 1


def calendar() -> rx.Component:
    return rx.box(
        rx.html('<link rel="stylesheet" href="/styles.css">'),
        rx.vstack(
            rx.hstack(
                rx.link(
                    "Día 1",
                    on_click=lambda: CalendarState.set_selected_day(1),
                    class_name="btn",
                ),
                rx.link(
                    "Día 2",
                    on_click=lambda: CalendarState.set_selected_day(2),
                    class_name="btn",
                ),
                rx.link(
                    "Día 3",
                    on_click=lambda: CalendarState.set_selected_day(3),
                    class_name="btn",
                ),
                padding_y=Size.BIG.value,
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
        padding_y=Size.BIG.value,
        padding_x=Size.BIG.value,
        width="100%",
    )


# viejo calendar
# import reflex as rx
# from my_first_page.styles.styles import Size
# from my_first_page.components.presentation import (
#     presentation_day_1,
#     presentation_day_2,
#     presentation_day_3,
# )
#
#
# def calendar() -> rx.Component:
#     return rx.box(
#         rx.hstack(
#             rx.link(
#                 "Día 1",
#             ),
#             rx.link(
#                 "Día 2",
#             ),
#             rx.link(
#                 "Día 3",
#             ),
#             padding_y=Size.BIG.value,
#             width="100%",
#             align_items="center",
#             justify_content="center",
#             margin_x="auto",
#         ),
#         rx.hstack(
#             presentation_day_1(),
#             # wrap="wrap",
#         ),
#         padding_y=Size.BIG.value,
#         padding_x=Size.BIG.value,
#         width="100%",
#     )
