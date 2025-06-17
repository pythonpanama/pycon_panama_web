import reflex as rx
from datetime import datetime, timezone


class CountdownState(rx.State):
    target: datetime = datetime(2025, 10, 25, 15, 0, 0, tzinfo=timezone.utc)
    now: datetime = datetime.now(timezone.utc)

    def on_load(self):
        self.update()

    def update(self):
        self.now = datetime.now(timezone.utc)
        if self.target > self.now:
            return rx.set_timeout(self.update, 1000)

    @rx.var
    def remaining_time(self) -> str:
        diff = self.target - self.now
        if diff.total_seconds() <= 0:
            return "¡Comienza la PyCon!"

        days = diff.days
        hours = (diff.seconds // 3600) % 24
        minutes = (diff.seconds % 3600) // 60
        seconds = diff.seconds % 60

        return f"{days}d {hours}h {minutes}m {seconds}s"


def contador()-> rx.Component:
    return rx.center(
        rx.box(
            rx.text(
                CountdownState.remaining_time,
                font_family="monospace",
                font_size="2em",
                id="countdown",
            ),
            padding="1em",
            border="2px solid black",
            border_radius="lg",
            width="fit-content",
            text_align="center",
        ),
        on_mount=CountdownState.on_load,
        height="100vh",
    )
