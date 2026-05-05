import re

with open("app/static/css/mobile-aesthetic.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace the header block in mobile-aesthetic.css
new_header_block = """    /* ================= NAVBAR SUPERIOR ================= */
    header.encabezado {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 10px 15px !important;
        gap: 15px 0 !important; /* Espacio vertical para separar buscador */
    }

    .hamburger-btn {
        order: 1 !important;
        margin: 0 !important;
        width: 44px !important;
        height: 44px !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 50% !important;
    }

    .encabezado .iconos {
        order: 2 !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important; /* Separar iconos por igual */
        flex: 1 !important; /* Llenar espacio restante superior */
        margin: 0 0 0 15px !important; /* Separar de hamburger btn */
        padding: 0 !important;
        width: auto !important;
        gap: 0 !important; /* Use space-between en vez de gap por si acaso */
    }

    .encabezado .buscador {
        order: 3 !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
    }

    .buscador input {
        width: 100% !important;
        flex: 1 !important;
    }

    /* Asegurar que los botones sean idénticos en tamaño */
    .btn_notificaciones, .carrito-link, .user-menu-btn {
        width: 44px !important;
        height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 50% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
    }
    .user-menu-container {
        width: 44px !important;
        height: 44px !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* Eliminar chevron de usuario en móvil para mantener estetica de un solo icono */
    .user-menu-btn .fa-chevron-down {
        display: none !important;
    }
"""

css = re.sub(r'/\*\s*================= NAVBAR SUPERIOR =================\s*\*/.*?\.theme-toggle-label[^}]+}', new_header_block, css, flags=re.DOTALL)

with open("app/static/css/mobile-aesthetic.css", "w", encoding="utf-8") as f:
    f.write(css)
