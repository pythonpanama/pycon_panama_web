# # components/dialog_box.py
# import reflex as rx
# from dev_2025.components.link_icon import link_icon
# import dev_2025.styles.styles as styles
#
#
# def dialogbox(event: dict) -> rx.Component:
#     return rx.dialog.root(
#         rx.dialog.trigger(
#             rx.link(
#                 "Ver más",
#                 style=styles.boton,
#                 _hover={
#                     "background": "#AB62CD",
#                     "color": "#FDE3C8",
#                     "border": "3px solid #FDE3C8",
#                     "box-shadow": "none",
#                 },
#             )
#         ),
#         rx.dialog.content(
#             rx.flex(
#                 rx.box(
#                     rx.image(
#                         src=event["image_url"],
#                         alt="Foto de perfil",
#                         width="200px",
#                         height="200px",
#                         border_radius="50%",
#                         object_fit="cover",
#                         margin_bottom="1rem",
#                     ),
#                     rx.hstack(
#                         link_icon("twitter", event["twitter"]),
#                         link_icon("instagram", event["instagram"]),
#                         link_icon("linkedin", event["linkedin"]),
#                         justify="center",
#                         spacing="1rem",
#                     ),
#                     align="center",
#                 ),
#                 rx.box(
#                     rx.heading(event["name"], style=styles.lower_container_h3),
#                     rx.heading(event["title"], style=styles.lower_container_h4),
#                     rx.text(event["legend"], margin_top="1rem"),
#                     max_w="400px",
#                     color=styles.TextColor.FIFTH,
#                 ),
#                 flex_direction=["column", "column", "row"],
#                 align_items="center",
#                 gap="2rem",
#                 padding="1rem",
#             ),
#             rx.dialog.close(
#                 rx.link(
#                     "Cerrar",
#                     size="2",
#                     mt="1.5rem",
#                     style=styles.boton,
#                     _hover={
#                         "background": "#AB62CD",
#                         "color": "#FDE3C8",
#                         "border": "3px solid #FDE3C8",
#                         "box-shadow": "none",
#                     },
#                 )
#             ),
#             style=styles.ver_mas,
#         ),
#     )
