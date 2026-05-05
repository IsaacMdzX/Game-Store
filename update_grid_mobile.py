import re

with open("app/static/css/mobile-aesthetic.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace the Bento Grid block
new_grid_block = """    /* 3. Ajuste del Bento Grid (Productos y Categorías) para 2x Fila */
    .contenedor-productos, .grid-productos, .productos-grid {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8px !important;
        padding: 5px !important;
    }

    .producto, .card {
        border-radius: 12px !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        background: rgba(42, 42, 62, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
        min-height: auto !important;
        max-width: 100% !important;
        margin: 0 !important;
    }

    /* Reducir tamaño de imágenes dentro de producto */
    .producto img, .card img {
        width: 100% !important;
        height: 140px !important; /* Altura fija pequeña para que entren 2 por fila sin ser enormes */
        object-fit: cover !important;
        border-radius: 12px 12px 0 0 !important;
    }

    /* Ajustar botones e info dentro de la tarjeta */
    .producto .info-producto {
        padding: 8px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        flex-grow: 1 !important;
    }

    .producto .titulo-producto, .producto h3 {
        font-size: 13px !important;
        margin-bottom: 5px !important;
        line-height: 1.2 !important;
    }

    .producto .precio {
        font-size: 14px !important;
        margin-bottom: 8px !important;
    }

    .producto .acciones, .producto .botones {
        display: flex !important;
        flex-direction: column !important; /* O row si caben, mejor column para 2xfila */
        gap: 5px !important;
        margin-top: auto !important;
    }
    
    .producto .btn-producto, .producto .btn-comprar, .producto button {
        width: 100% !important;
        padding: 6px !important;
        font-size: 12px !important;
        min-height: 32px !important; /* Más pequeño */
    }"""

css = re.sub(r'/\*\s*3\. Ajuste del Bento Grid \(Productos y Categorías\)\s*\*/.*?\/\*\s*4\. Optimización del Menú y Botones\s*\*/', new_grid_block + "\n\n    /* 4. Optimización del Menú y Botones */", css, flags=re.DOTALL)

with open("app/static/css/mobile-aesthetic.css", "w", encoding="utf-8") as f:
    f.write(css)
