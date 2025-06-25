# referencia para diseño responsive con flex_direction
# https://reflex.dev/docs/styling/responsive/
# estilo boostrap utilizado
# https://bootswatch.com/brite/
import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.views.navbar import navbar
from my_first_page.views.header import header
from my_first_page.views.instructions import instructions
from my_first_page.views.footer import footer
from my_first_page.views.form import form
from my_first_page.views.partners import partners
from my_first_page.views.calendar import calendar


def index() -> rx.Component:
    return rx.box(
        rx.script("document.documentElement.lang='es'"),
        navbar(),
        rx.vstack(
            header(),
            instructions(),
            partners(),
            footer(),
            align="center",
            width="100%",
            # el video decia Size.VERY_BIG.value
            # pero el spacing solo puede ser usado con numeros fijos como el siguiente, tener en cuenta eso
            # tengo que checar esto bien porque no me esta apareciendo como a mauro
            spacing="9",
        ),
    )


app = rx.App(
    stylesheets=styles.STYLESHEETS,
    style=styles.BASE_STYLE,
)
app.add_page(
    index,
    title="PyCon Panamá 2025, 3 dìas, regalos",
    description="Aqui esta el calendario de actividades para este 2025",
)

app.add_page(
    form,
    title="Registro al evento",
    description="Registrate para participar en el evento",
    route="/form",
)

app.add_page(
    calendar,
    title="Calendario del evento",
    description="Recopilacion de expositores y fechas de presentacion",
    route="/calendar",
)

