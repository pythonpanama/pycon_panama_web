# referencia para diseño responsive con flex_direction
# https://reflex.dev/docs/styling/responsive/
# estilo boostrap utilizado
# https://bootswatch.com/brite/
# pagina utilizada para generar fondos:
# https://bgjar.com/sprinkle
# pagina de donde saque el icon de python:
# https://icon-icons.com/es/
import reflex as rx
import my_first_page.styles.styles as styles
from my_first_page.views.navbar import navbar
from my_first_page.views.header import header
from my_first_page.views.instructions import instructions
from my_first_page.views.footer import footer
from my_first_page.views.form import form
from my_first_page.views.sponsors import sponsors
from my_first_page.views.calendar import calendar
from my_first_page.views.sedes import sedes


def index() -> rx.Component:
    return rx.box(
        rx.script("document.documentElement.lang='es'"),
        navbar(),
        rx.vstack(
            header(),
            instructions(),
            sedes(),
            footer(),
            align="center",
            width="100%",
            # el video decia Size.VERY_BIG.value
            # pero el spacing solo puede ser usado con numeros fijos como el siguiente, tener en cuenta eso
            spacing="4",
        ),
    )


app = rx.App(
    stylesheets=styles.STYLESHEETS,
    style=styles.BASE_STYLE,
)

app.add_page(
    index,
    title="PyCon Panamá 2025",
    description="Main page de la PyCon Panamá 2025",
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
    description="Recopilacion de expositores y horarios de presentacion",
    route="/calendar",
)

app.add_page(
    sponsors,
    title="Patrocinadores",
    description="Recopilación de patrocinadores de Python Panamá 2025",
    route="/sponsors",
)
