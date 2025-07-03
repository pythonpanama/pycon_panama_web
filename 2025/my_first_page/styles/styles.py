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
    "https://fonts.googleapis.com/css2?family=Gravitas+One&family=Luckiest+Guy&display=swap",
    # "https://fonts.googleapis.com/css2?family=Gravitas+One&display=swap",
    # "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
    # "https://fonts.googleapis.com/css2?family=Space+Mono&display=swap",
    # "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
]

# estilo base, de uso general para toda la pagina
BASE_STYLE = {
    "font_family": Font.DEFAULT.value,
    "font-weight": "400",
    "font-style": "normal",
    # "color": TextColor.FOURTH.value,
    "background": "linear-gradient(120deg, #FFAA88 25%, #FDE3C8 50%, #FFAA88 75%, #FDE3C8 100%)",
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
}

# estilos del header
header = {
    "max_width": "900px",
    "margin_x": "auto",
    "display": "flex",
    "align_items": "center",
    "justify_content": "center",
    "padding_y": Size.BIG.value,
    "flex_direction": ["column", "column", "column", "row", "row", "row"],
}

BUTTON = {
    "display": "inline-block",
    "padding": "10px 20px",
    "background": "#AB62CD",
    "color": "#FDE3C8",
    "text-decoration": "none",
    "font-weight": "bold",
    "border": "3px solid #1E4171",
    "box-shadow": "4px 4px 0 #6FC7E1",
    "transition": "all 0.2s ease",
    "hover": {
        "background": "#AB62CD",
        "color": "#FDE3C8",
        "border": "3px solid #1E4171",
        "box-shadow": "none",
    },
}


# estilos de el contador
countdown = {
    # xs, sm, md, lg, xl
    "width": [
        "50px",
        "80px",
        "100px",
        "140px",
        "160px",
        "200px",
    ],  # movil, tablet, desktop
    "padding": "0",
    "margin": "0 auto",
    "font_size": [Size.MEDIUM.value, Size.DEFAULT.value, Size.BIG.value],
    "font-weight": "bold",
    "text_align": "center",
    "background_color": Color.PRIMARY.value,
    "color": TextColor.TERTIARY.value,
    "text_shadow": "black 2px 2px",
}

# estilos de los textos dentro del contador
countdown_text = {
    "font_size": [
        Size.SMALL.value,
        Size.SMALL.value,
        "0.4em",
        Size.SMALL.value,
        Size.SMALL.value,
        Size.SMALL.value,
    ],
    "margin_top": "0",
    "padding_top": "0",
}

# esta area es para los estilos de la vista de sponsors
sponsors = {
    "padding_y": Size.VERY_BIG.value,
    # "bg": Color.ACCENT.value,
    "align_items": "center",
    "width": "100%",
}

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
max_width_style = {
    "align_items": "start",
    "padding_x": Size.BIG.value,
    "width": "100%",
    "max_width": MAX_WIDTH,
}

# estilos de los links en el navbar
nav_links = {
    "color": TextColor.PRIMARY.value,
    "font_size": Size.MEDIUM.value,
    "margin_right": Size.BIG.value,
}

# ESTILOS ESPECIFICOS PARA EL FORMULARIO
STYLE_FORM = {
    "input, select, label": {
        "margin_bottom": "1em",
    },
    "button": {
        "background_color": Color.PRIMARY.value,
        "height": Size.BUTTON.value,
        "color": f"{TextColor.TERTIARY.value} !important",
        "_hover": {
            "background_color": f"{Color.PRIMARY.value}",
            "color": f"{TextColor.TERTIARY.value} !important",
            "text_decoration": "none",
        },
    },
    "background_color": Color.FOURTH.value,
    "padding": Size.BIG.value,
    "align_items": "start",
    "width": "100%",
    "color": TextColor.FIFTH.value,
    "font_size": [Size.SMALL.value, Size.MEDIUM.value, Size.DEFAULT.value],
}

# APARTADO PARA LAS CARTAS DE PRESENTACION
card_container = (
    {
        "width": "320px",
        "background": "#FDE3C8",
        "border": "4px solid #1E4171",
        "border-radius": "10px",
        "box-shadow": "8px 8px 0 #AB62CD",
    },
)
upper_container = (
    {
        "height": "140px",
        "background": "#6FC7E1",
        "border-bottom": "4px solid #1E4171",
        "display": "flex",
        "justify-content": "center",
        "align-items": "flex-end",
    },
)
image_container = (
    {
        "width": "100px",
        "height": "100px",
        "background": "#ffffff",
        "border": "4px solid #1E4171",
        "transform": "translateY(50%)",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
    },
)
image_container_img = (
    {
        "width": "90px",
        "height": "90px",
        "object-fit": "cover",
        "border": "2px solid #6FC7E1",
    },
)
lower_container = (
    {
        "padding": "60px 20px 30px",
        "text-align": "center",
    },
)
lower_container_h3 = (
    {
        "margin": "0",
        "font-size": "20px",
        "font-weight": "bold",
        "color": "#1E4171",
    },
)
lower_container_h4 = (
    {
        "margin": "5px 0 15px",
        "font-size": "14px",
        "color": "#1E4171",
        "font-weight": "normal",
    },
)
lower_container_p = (
    {
        "font-size": "14px",
        "color": "#1E4171",
        "border": "2px inset #1E4171",
        "padding": "10px",
        "background": "#D49EE7",
        "margin-bottom": "20px",
    },
)


boton = (
    {
        "display": "inline-block",
        "padding": "10px 20px",
        "background": "#AB62CD",
        "color": "#FDE3C8",
        "text-decoration": "none",
        "font-weight": "bold",
        "border-radius": "15px",
        "border": "3px solid #AB62CD",
        "box-shadow": "4px 4px 0 #D49EE7",
        "transition": "all 0.2s ease",
        # "_hover": {
        #     "background": "#FDE3C8",
        #     "color": "#1E4171",
        #     "box-shadow": "none",
        # },
    },
)
