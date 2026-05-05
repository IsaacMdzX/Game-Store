import re

with open("app/static/css/responsive.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace any occurrence of 1fr grid template columns inside mobile break points just in case it competes
old_grid = """    .contenedor-productos {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        padding: 10px;
    }"""

new_grid = """    .contenedor-productos {
        display: grid;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px;
        padding: 5px;
    }"""

if old_grid in css:
    css = css.replace(old_grid, new_grid)
    print("Updated responsive grid to 2 columns in responsive.css")
else:
    print("old grid not found in responsive.css")

with open("app/static/css/responsive.css", "w", encoding="utf-8") as f:
    f.write(css)
