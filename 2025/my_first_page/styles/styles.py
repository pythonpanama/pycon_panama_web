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


[id] = {
    "scroll-margin-top": "60px",
}

# https://bootswatch.com/brite/
STYLESHEETS = [
    "bootstrap.min.css",
    "https://fonts.googleapis.com/css2?family=Gravitas+One&family=Luckiest+Guy&display=swap",
    # "https://fonts.googleapis.com/css2?family=Gravitas+One&display=swap",
    # "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
    # "https://fonts.googleapis.com/css2?family=Space+Mono&display=swap",
    # "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
]

# ESTILO BASE, DE USO GENERAL PARA TODA LA PAGINA
BASE_STYLE = {
    "font_family": Font.DEFAULT.value,
    "font-weight": "400",
    "font-style": "normal",
    "background-image": "url('/Sprinkle_bg.svg')",
    "html": {
        "scrollBehavior": "smooth",
    },
    rx.heading: {"font_family": Font.DEFAULT.value, "color": TextColor.FIFTH.value},
    rx.el.span: {
        "font_size": Size.MEDIUM.value,
    },
}


# ESTILOS DEL HEADER
header_countdown_section = {
    "max_width": "900px",
    "margin_x": "0",
    "display": "flex",
    "align_items": "center",
    "justify_content": "center",
    "padding_y": Size.BIG.value,
    "flex_direction": ["column", "column", "column", "row", "row", "row"],
}

header = {
    "display": "flex",
    "margin": "0 auto",
    "align_items": "center",
    "justify_content": "center",
    "padding_y": Size.VERY_BIG.value,
}

header_title = {
    "width": "100%",
    "font_size": ["3em", "3em", "4em", "5em", "6em", "6em"],
    "text_align": "center",
    "text_shadow": "black 2px 2px",
}

# ESTILOS DE EL CONTADOR
countdown = {
    "width": ["90px", "110px", "120px", "140px", "160px", "180px"],
    "height": ["90px", "110px", "120px", "140px", "160px", "180px"],
    "padding": ["0.5em", "0.5em", "0.5em", "0.5em", "1em", "1em"],
    "margin": "0.5em auto",
    "font_size": ["1.5em", "1.5em", "1.6em", "2em", "2em", "2.2em"],
    "font_weight": "bold",
    "text_align": "center",
    "align_items": "center",
    "justify_content": "center",
    "background_color": Color.PRIMARY.value,
    "color": TextColor.TERTIARY.value,
    "border": "2px solid black",
    "border_radius": "10px",
    "box_shadow": "4px 4px 0 black",
    "text_shadow": "black 2px 2px",
}

# ESTILOS DE LOS TEXTOS DENTRO DEL CONTADOR
countdown_text = {
    "font_size": [
        "0.5em",
        "0.5em",
        "0.5em",
        "0.5em",
        "0.5em",
        "0.5em",
    ],
    "margin_top": "0.5em",
    "text_align": "center",
    "padding": "0",
}

# ESTILOS CAJA DE INSTRUCCIONES

instructions_boton_registro = {
    "font_size": [Size.DEFAULT.value, Size.BIG.value, Size.VERY_BIG.value],
    "display": "inline-block",
    "padding": "10px 20px",
    # "background": Color.ACCENT,
    "color": TextColor.TERTIARY,
    "text-decoration": "none",
    "border-radius": "15px",
    "border": f"3px solid {Color.TERTIARY.value}",
    # "transition": "all 0.2s ease",
    "box-shadow": f"4px 4px 0 {Color.TERTIARY.value}",
    "transition": "all 0.2s ease-in-out",
}


instructions_box = {
    "background_color": TextColor.PRIMARY.value,
    "padding": Size.BIG.value,
    "align_items": "center",
    "width": "100%",
    # cambio de color texto dentro de instrucciones
    "color": TextColor.FIFTH.value,
    "border": "3px solid black",
    "border_radius": "10px",
    "box-shadow": "8px 8px 0 black",
    "font_size": Size.DEFAULT.value,
    "text_align": "center",
}

instructions_paragraph = {
    "space": "2em",
    "font_size": ["1em", "1.1em", "1.2em"],
    "line_height": "1.6em",
    "text_align": "center",
    "color": TextColor.TERTIARY.value,
    "text_shadow": "1px 1px 0 black",
}

instructions_title = {
    "color": TextColor.ACCENT.value,
    "text_shadow": "2px 2px 0 black",
    # belleza de atributo para que el anchor no quede mal posicionado con el navbar en fixed
    "scroll-margin-top": Size.BIG.value,
    "text_align": "center",
    "font_size": ["3em", "3em", "4em", "5em", "6em", "6em"],
}

# ESTA AREA ES PARA LOS ESTILOS DE LA VISTA DE SPONSORS
sponsors = {
    "align_items": "center",
    "width": "100%",
    "justify_content": "space-between",
    "min_height": "100vh",  # para que la pagina tenga altura minima de la pantalla
}

sponsors_title = {
    "font_size": ["3em", "3em", "3em", "3em", "3em", "3em"],
    "color": TextColor.FOURTH.value,
    "text_shadow": "2px 2px 0 black",
    "scroll-margin-top": Size.BIG.value,
    "text_align": "center",
}

sponsors_img = {
    "max_width": "230px",
    "width": "100%",
    "height": "auto",
    "margin": "0.5rem",
    "justify_content": "center",
    "align_items": "center",
}

sponsors_img_container = {
    "background": Color.TERTIARY.value,
    "text_align": "center",
}

sponsors_container = {
    "position": "relative",
    "width": "100%",
    "overflow": "hidden",
    "white_space": "nowrap",
    "padding": "1em 0",
}

# AREA DEL FOOTER

footer_style = {
    "background": f"linear-gradient(120deg, {Color.FIFTH.value} 25%, {Color.PRIMARY.value} 50%, {Color.FIFTH.value} 75%, {Color.PRIMARY.value} 100%)",
    "background-size": "400% 400%",
    "animation": "fondoAnimado 20s ease infinite",
    "@keyframes fondoAnimado": {
        "0%": {"background-position": "0% 50%"},
        "50%": {"background-position": "100% 50%"},
        "100%": {"background-position": "0% 50%"},
    },
    "width": "100%",
    "max_width": "MAX_WIDTH",
    "color": TextColor.FOURTH.value,
    "size": Size.MEDIUM.value,  # font_size
    "padding": Size.BIG.value,
}


# ESTILOS GENERALES, PARA APLICAR A LAS PANTALLAS GRANDES, ABIERTO A CAMBIOS
max_width_style = {
    "align_items": "start",
    "padding_x": Size.BIG.value,
    "width": "100%",
    "max_width": MAX_WIDTH,
}
# ESTILOS DEL NAVBAR

desktop_navbar_style = {
    "width": "100%",
    "justify_content": "space-between",
    "align_items": "center",
    # "background": Color.TERTIARY.value,
    "border_bottom": f"0.25em solid {Color.SECONDARY.value}",
    "padding_x": Size.BIG.value,
    "padding_y": Size.DEFAULT.value,
    "background": f"linear-gradient(90deg, {Color.SECONDARY.value} 25%, {Color.TERTIARY.value} 50%, {Color.SECONDARY.value} 75%, {Color.TERTIARY.value} 100%)",
    "background-size": "400% 400%",
    "animation": "fondoAnimado 10s ease infinite",
    "@keyframes fondoAnimado": {
        "0%": {"background-position": "0% 50%"},
        "50%": {"background-position": "100% 50%"},
        "100%": {"background-position": "0% 50%"},
    },
}

mobile_navbar_style = {
    "background": f"linear-gradient(90deg, {Color.SECONDARY.value} 25%, {Color.TERTIARY.value} 50%, {Color.SECONDARY.value} 75%, {Color.TERTIARY.value} 100%)",
    "background-size": "400% 400%",
    "animation": "fondoAnimado 10s ease infinite",
    "@keyframes fondoAnimado": {
        "0%": {"background-position": "0% 50%"},
        "50%": {"background-position": "100% 50%"},
        "100%": {"background-position": "0% 50%"},
    },
    "border_bottom": f"0.25em solid {Color.SECONDARY.value}",
    "padding_x": Size.BIG.value,
    "padding_y": Size.DEFAULT.value,
}
# ESTILOS DE LOS LINKS EN EL NAVBAR
nav_links = {
    "color": TextColor.PRIMARY.value,
    "background_color": "transparent",
    "font_size": Size.DEFAULT.value,
    # "margin_right": Size.BIG.value,
    "border_radius": "5px",
    "padding": Size.SMALL.value,
    "text_shadow": "1px 1px 0 black",
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
card_container = {
    "width": "90%",  # responsivo
    "max_width": "300px",  # límite en pantallas grandes
    "height": "auto",  # más flexible
    "min_height": "500px",  # mantener consistencia visual
    "box-sizing": "border-box",  # evitar desbordes
    "overflow": "hidden",
    "background": Color.TERTIARY.value,
    "border": f"4px solid {Color.FIFTH.value}",
    "border-radius": "10px",
    "box-shadow": f"8px 8px 0 {Color.PRIMARY.value}",
}

upper_container = {
    "height": "140px",
    "background": Color.FOURTH.value,
    "border-bottom": f"4px solid {Color.FIFTH.value}",
    "display": "flex",
    "justify-content": "center",
    "align-items": "flex-end",
}

image_container = {
    "width": "100px",
    "height": "100px",
    "background": "#ffffff",
    "border": f"4px solid {Color.FIFTH.value}",
    "transform": "translateY(50%)",
    "display": "flex",
    "justify-content": "center",
    "align-items": "center",
}

image_container_img = {
    "width": "90px",
    "height": "90px",
    "object-fit": "cover",
    "border": f"2px solid {Color.FOURTH.value}",
}

lower_container = {
    "padding": "60px 20px 30px",
    "text-align": "center",
}

lower_container_h3 = {
    "margin": "0",
    "font-size": "20px",
    "font-weight": "bold",
    "color": TextColor.FIFTH.value,
}

lower_container_h4 = {
    "margin": "5px 0 15px",
    "font-size": "14px",
    "color": TextColor.FIFTH.value,
    "font-weight": "normal",
}

lower_container_p = {
    "font-size": "14px",
    "color": TextColor.FIFTH.value,
    "border": f"2px inset {Color.FIFTH.value}",
    "padding": "10px",
    "background": Color.ACCENT.value,
    "margin-bottom": "20px",
    "height": "50px",  # Limita la altura del párrafo
    "overflow": "hidden",  # Muestra scroll si hay mucho texto
    "display": "flex",
    "-webkit-line-clamp": "4",  # Número máximo de líneas visibles
    "-webkit-box-orient": "vertical",
    "align_items": "center",
    "justify_content": "center",
}


boton = {
    "display": "inline-block",
    "padding": "10px 20px",
    "background": Color.ACCENT,
    "color": TextColor.FIFTH,
    "text-decoration": "none",
    "border-radius": "15px",
    "border": f"3px solid {Color.PRIMARY.value}",
    "transition": "all 0.2s ease",
    "box-shadow": f"4px 4px 0 {Color.PRIMARY.value}",
}


# ESTILOS DEL VER MAS EN LAS CARTAS
ver_mas = {
    "padding": "2rem",
    "border_radius": "12px",
    "box_shadow": "0px 8px 16px rgba(0, 0, 0, 0.2)",
    "max_width": "700px",
    "width": "100%",
    "justify": "center",
    "background": f"linear-gradient(120deg, {Color.SECONDARY.value} 25%, {Color.TERTIARY.value} 50%, {Color.SECONDARY.value} 75%, {Color.TERTIARY.value} 100%)",
    "background-size": "400% 400%",
    "animation": "fondoAnimado 10s ease infinite",
    "@keyframes fondoAnimado": {
        "0%": {"background-position": "0% 50%"},
        "50%": {"background-position": "100% 50%"},
        "100%": {"background-position": "0% 50%"},
    },
}

ver_mas_img = {
    "width": "200px",
    "height": "200px",
    "border_radius": "50%",
    "object_fit": "cover",
    "margin": "0 auto",
    "margin_bottom": "1rem",
    "border": f"3px solid {Color.PRIMARY.value}",
}

ver_mas_socials = {
    "justify": "center",
    "color": Color.FIFTH.value,
}

legend = {
    "font_size": "1rem",
    "color": TextColor.FIFTH.value,
    "margin_top": "1rem",
    "line_height": "1.5",
}

ver_mas_close_boton = {
    "text_align": "center",
    "padding": "10px 20px",
    "background": Color.ACCENT,
    "color": TextColor.FIFTH,
    "text-decoration": "none",
    "border-radius": "15px",
    "border": f"3px solid {Color.PRIMARY.value}",
    "transition": "all 0.2s ease",
    "box-shadow": f"4px 4px 0 {Color.PRIMARY.value}",
}


# ESTILOS SEDES

sedes_style = {
    "align_items": "center",
    "width": "100%",
    "margin_top": "4rem",
}

sedes_title = {
    "font_size": ["3em", "3em", "4em", "5em", "6em", "6em"],
    "color": TextColor.FIFTH.value,
    "text_shadow": "2px 2px 0 black",
    "scroll-margin-top": Size.BIG.value,
}

card_container_sede = {
    "gap": "0",
    "width": "90%",  # responsivo
    "max_width": "300px",  # límite en pantallas grandes
    "height": "auto",  # más flexible
    "min_height": "300px",  # mantener consistencia visual
    "box-sizing": "border-box",  # evitar desbordes
    "overflow": "hidden",
    "border-radius": "10px",
    "border": "4px solid black",
    "background": Color.TERTIARY.value,
}


upper_text_sede = {
    "width": "100%",
    "color": TextColor.TERTIARY.value,
    "font_size": ["0.875rem", "1rem"],
    "text_align_last": "center",
    "margin": "0 auto",
    "display": "flex",
    "height": "50px",  # Limita la altura del párrafo
    "overflow": "hidden",  # Muestra scroll si hay mucho texto
    "-webkit-line-clamp": "4",  # Número máximo de líneas visibles
    "-webkit-box-orient": "vertical",
    "align_items": "center",
    "justify_content": "center",
    "text_shadow": "black 2px 2px",
}

img_sede = {
    "width": "100%",
    "height": "100%",
    "margin_x": "auto",
    "margin_y": "0",
    "border_bottom": "4px solid black",
}
lower_text_sede = {
    "width": "100%",
    "color": TextColor.FIFTH.value,
    "height": "100%",
    "display": "flex",
    "align_items": "center",
    "justify_content": "center",
}

estilo_main_page = {
    "padding_top": "200px",
}

# estilos del calendario de eventos
calendar_style = {
    "width": "100%",
    "align_items": "center",
    "justify_content": "space-between",  # para que mantenga un espacio entre el footer y el contenido
    "min_height": "100vh",  # para que la pagina tenga altura minima de la pantalla
    "margin_x": "auto",
}

calendar_buttons_area = {
    "padding_y": Size.BIG.value,
    "width": "100%",
    "align_items": "center",
    "justify_content": "center",
    "margin_x": "auto",
}
