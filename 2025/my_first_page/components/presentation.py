import reflex as rx
from my_first_page.styles.styles import Size, Color


class IterState(rx.State):
    name: list[str] = [
        "juan",
        "beto",
        "roberto",
    ]


# https://reflex.dev/docs/components/rendering-iterables/


def name_box(name: str):
    return rx.button(name)


def presentation() -> rx.Component:
    return rx.vstack(
        rx.html(
            """
<link rel="stylesheet" href="/card_style.css">
<div class="card-container">
<div class="upper-container">
<div class="image-container">
    <img src="/PyConPet.jpg" alt="profile image" />
</div>
</div>

<div class="lower-container">
<div>
    <h3>Mc Python</h3>
    <h4>Front-end Developer</h4>
</div>
<div>
    <p>Los efectos de la IA en la creación de páginas web.</p>
</div>
<div>
    <a href="#" class="btn">View profile</a>
</div>
</div>
</div>
        """
        ),
    )
