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

BASE_STYLE = {
    "font_family": Font.DEFAULT.value,
    "color": TextColor.FIFTH.value,
    "background": "linear-gradient(120deg, #D49EE7 25%, #FDE3C8 50%, #D49EE7 75%, #FDE3C8 100%)",
    # "background": "linear-gradient(120deg, #FDE3C8 0%, #D49EE7 25% , #FDE3C8 50%, #D49EE7 100%)",
    "background-size": "400% 400%",
    "animation": "fondoAnimado 20s ease infinite",
    "@keyframes fondoAnimado": {
        "0%": {"background-position": "0% 50%"},
        "50%": {"background-position": "100% 50%"},
        "100%": {"background-position": "0% 50%"},
    },
    # ACCENT = "#D49EE7"
    # PRIMARY = "#AB62CD"
    # SECONDARY = "#FFAA88"
    # TERTIARY = "#FDE3C8"
    # FOURTH = "#6FC7E1"
    # FIFTH = "#1E4171"
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
