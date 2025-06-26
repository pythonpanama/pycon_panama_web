import reflex as rx
from enum import Enum
from .fonts import Font as Font
from .colors import Color, TextColor

MAX_WIDTH = "1000px"


class Size(Enum):
    ZERO = "0 !important"
    SMALL = "0.5em"
    MEDIUM = "0.8em"
    DEFAULT = "1em"
    BIG = "2em"
    BUTTON = "2.75em"
    VERY_BIG = "4em"


# https://bootswatch.com/brite/
STYLESHEETS = [
    "bootstrap.min.css",
    "https://fonts.googleapis.com/css2?family=Gravitas+One&display=swap",
    "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
]

# estilo base, de uso general para toda la pagina
BASE_STYLE = {
    "font_family": Font.DEFAULT.value,
    "color": TextColor.FIFTH.value,
    "background": "linear-gradient(120deg, #D49EE7 25%, #FDE3C8 50%, #D49EE7 75%, #FDE3C8 100%)",
    "background-size": "400% 400%",
    "animation": "fondoAnimado 20s ease infinite",
    "@keyframes fondoAnimado": {
        "0%": {"background-position": "0% 50%"},
        "50%": {"background-position": "100% 50%"},
        "100%": {"background-position": "0% 50%"},
    },
    rx.heading: {"font_family": Font.DEFAULT.value, "color": TextColor.FIFTH.value},
    rx.link: {
        "text_decoration": "none",
        "_hover": {"color": TextColor.ACCENT.value, "text_decoration": "none"},
    },
    rx.el.span: {
        "font_size": Size.MEDIUM.value,
    },
    rx.button: {
        "border_color": Color.FIFTH.value,
        "background_color": Color.PRIMARY.value,
        "height": Size.BUTTON.value,
        "color": f"{TextColor.TERTIARY.value} !important",
        "_hover": {
            "background_color": f"{Color.PRIMARY.value}",
            "color": f"{TextColor.TERTIARY.value} !important",
            "text_decoration": "none",
        },
    },
}

# estilos del header
header = dict(
    max_width="900px",
    margin_x="auto",
    display="flex",
    align_items="center",
    justify_content="center",
    padding_y=Size.BIG.value,
    flex_direction=["column", "column", "column", "row", "row", "row"],
)

# estilos de el contador
countdown = dict(
    # xs, sm, md, lg, xl
    width=[
        "50px",
        "80px",
        "100px",
        "140px",
        "160px",
        "200px",
    ],  # movil, tablet, desktop
    padding="0",
    margin="0 auto",
    font_size=[Size.MEDIUM.value, Size.DEFAULT.value, Size.BIG.value],
    font_weight="bold",
    text_align="center",
    background_color=Color.PRIMARY.value,
    color=TextColor.TERTIARY.value,
    text_shadow="black 2px 2px",
)

# estilos de los textos dentro del contador
countdown_text = dict(
    font_size=[
        Size.SMALL.value,
        Size.SMALL.value,
        "0.4em",
        Size.SMALL.value,
        Size.SMALL.value,
        Size.SMALL.value,
    ],
    margin_top="0",
    padding_top="0",
)

# esta area es para los estilos de la vista de sponsors
sponsors = dict(
    padding_y=Size.VERY_BIG.value,
    bg=Color.ACCENT.value,
    align_items="center",
    width="100%",
)

carousel_container = {
    "position": "relative",
    "width": "100%",
    "overflow": "hidden",
    "white_space": "nowrap",
    "padding": "1em 0",
}

carousel_track = {
    "animation": "scroll-left 20s linear infinite",
    "display": "inline-flex",
    "min_width": "200%",
    "@keyframes scroll-left": {
        "0%": {"transform": "translateX(50%)"},
        "100%": {"transform": "translateX(-100%)"},
    },
}

# Area del footer

estilo_footer = {
    "background": "linear-gradient(120deg, #1E4171 25%, #AB62CD 50%, #1E4171 75%, #AB62CD 100%)",
    "background-size": "400% 400%",
    "animation": "fondoAnimado 20s ease infinite",
    "@keyframes fondoAnimado": {
        "0%": {"background-position": "0% 50%"},
        "50%": {"background-position": "100% 50%"},
        "100%": {"background-position": "0% 50%"},
    },
    "align_items": "start",
    "padding_x": Size.BIG.value,
    "width": "100%",
    "max_width": "MAX_WIDTH",
    "color": TextColor.FOURTH.value,
    "size": Size.MEDIUM.value,  # font_size
}


# estilos generales, para aplicar a las pantallas grandes, abierto a cambios
max_width_style = dict(
    align_items="start", padding_x=Size.BIG.value, width="100%", max_width=MAX_WIDTH
)

# estilos de los links en el navbar
nav_links = dict(
    color=TextColor.TERTIARY.value,
    font_size=Size.MEDIUM.value,
    margin_right=Size.BIG.value,
)
