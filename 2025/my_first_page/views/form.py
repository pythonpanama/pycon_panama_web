import reflex as rx

def form() -> rx.Component:
    return rx.html(
        """
        <form name="register-form" method="POST" data-netlify="true" action="/gracias.html">
            <input type="hidden" name="form-name" value="register-form" />
            
            <h2 style="font-size: 1.5em; padding-top: 1em;">Registro al Evento</h2>

            <input type="text" name="name" placeholder="Nombre" required 
                style="display:block; margin: 1em 0; padding: 0.5em; width: 100%;" />

            <input type="email" name="email" placeholder="Correo Electrónico" required 
                style="display:block; margin: 1em 0; padding: 0.5em; width: 100%;" />

            <button type="submit" 
                style="background-color: #3B82F6; color: white; padding: 0.75em 1.5em; border: none; border-radius: 5px;">
                Enviar
            </button>
        </form>
        """
    )