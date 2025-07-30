import reflex as rx
import dev_2025.styles.styles as styles
from dev_2025.styles.styles import Size
from dev_2025.views.navbar import navbar


def form() -> rx.Component:
    return rx.box(
        navbar(),
        rx.vstack(
            rx.html(
                """
        <html>
        <head>
        <link rel="stylesheet" href="bootstrap.min.css">
        </head>
        <body>
        <form name="register-form" method="POST" data-netlify="true" action="/gracias.html">
            <input type="hidden" name="form-name" value="register-form" />

            <div>
                <fieldset>
                <legend>Registro Formulario</legend>

                <div>
                <input type="text" class="form-control" id="nombre" placeholder="Nombre Completo" name="nombre" required>
                </div>

                <div>
                <input type="email" class="form-control" id="email" placeholder="Correo electrónico" name="email" required>
                </div>
                
                <div>
                <input type="text" class="form-control" id="telefono" placeholder="Teléfono de Contacto" name="telefono" required>
                </div>

                
                <fieldset>
                <label class="mt-4">Selecciona los días en los que deseas participar</label>
                
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="dia_1">
                    <label class="form-check-label" for="dia_1">
                    Por Definir.
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="dia_2">
                    <label class="form-check-label" for="dia_2">
                    Por Definir.
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="dia_3">
                    <label class="form-check-label" for="dia_3">
                    Por Definir.
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="dia_3_virtual">
                    <label class="form-check-label" for="dia_3_virtual">
                    Por Definir.
                    </label>
                </div>

            </fieldset>
                
                <div>
                <label for="perfil" class="form-label mt-4">Selecciona tu perfil</label>
                <select class="form-select" id="perfil" value="">
                    <option>Estudiante</option>
                    <option>Profesor</option>
                    <option>Profesional</option>
                    <option>Otro</option>
                </select>
                </div>

                <div>
                <input type="text" class="form-control" id="institucion" placeholder="Institución o Empresa" name="institucion" required>
                </div>

                <div>
                <label for="como_se_entero" class="form-label mt-4">¿Cómo te enteraste del evento?</label>
                <select class="form-select" id="como_se_entero">
                    <option>Redes Sociales</option>
                    <option>Correo Electrónico</option>
                    <option>Amigos/Familiares</option>
                    <option>Otros</option>
                </select>
                </div>
        
                <fieldset>
                <label class="mt-4">¿Requieres algún tipo de asistencia especial durante el evento</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="requiere_asistencia_Si" id="requiere_asistencia_Si" value="Si">
                    <label class="form-check-label" for="requiere_asistencia_Si">
                    Sí
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="requiere_asistencia_No" id="requiere_asistencia_No" value="No">
                    <label class="form-check-label" for="requiere_asistencia_No">
                    No
                    </label>
                </div>
                </fieldset>


            </div>
        </form>
        </body>
        </html>
        """,
                style=styles.STYLE_FORM,
                class_name="card",
                align_items="center",
            ),
            align_items="center",
            padding_y=Size.BIG.value,
            padding_x=Size.BIG.value,
            width="100%",
            margin_x="auto",
            max_width="800px",
            #             boton deshabilitado de momento
            #             <div style="display:flex;justify-content:center;">
            # <button type="submit" class="btn btn-primary">Enviar</button>
            # </div>
        ),
    )
