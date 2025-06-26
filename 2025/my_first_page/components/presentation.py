import reflex as rx
from my_first_page.styles.styles import Size, Color


def presentation() -> rx.Component:
    return rx.vstack(
        rx.html(
            """
            <link rel="stylesheet" href="/card_style.css">
            <div class="card-container">
            <div class="upper-container">
            <div class="image-container">
                <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=Alaina" alt="profile image" />
            </div>
            </div>

            <div class="lower-container">
            <div>
                <h3>Alaina Wick</h3>
                <h4>Front-end Developer</h4>
            </div>
            <div>
                <p>sodales accumsan ligula. Aenean sed diam tristique, fermentum mi nec, ornare arcu.</p>
            </div>
            <div>
                <a href="#" class="btn">View profile</a>
            </div>
            </div>
            </div>

            <a target="_blank" href="https://www.rustcodeweb.com/" 
            style="position: fixed; bottom: 1rem; right: 1rem; background: #FFD166; color: #073B4C; text-decoration: none; padding: 0.5rem 1rem; border: 3px solid #073B4C; box-shadow: 3px 3px 0 #073B4C; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: 0.875rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1200; border-radius: 2px; display: flex; align-items: center; gap: 0.5rem;"
            onmouseover="this.style.background='#F8F9FA'; this.style.transform='translate(-1px, -1px)'; this.style.boxShadow='4px 4px 0 #073B4C';"
            onmouseout="this.style.background='#FFD166'; this.style.transform='translate(0, 0)'; this.style.boxShadow='3px 3px 0 #073B4C';"
            onmousedown="this.style.transform='translate(0, 0)'; this.style.boxShadow='2px 2px 0 #073B4C';"
            onmouseup="this.style.transform='translate(-1px, -1px)'; this.style.boxShadow='4px 4px 0 #073B4C';"
            aria-label="Visit rustcodeweb.com">
            <i class="fas fa-link" style="font-size: 1rem;"></i>
            rustcodeweb.com
            </a>
        """
        ),
    )
