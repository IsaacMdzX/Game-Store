import re

with open('app/routes/web.py', 'r') as f:
    content = f.read()

# Buscamos la funcion api_productos
new_func = """def api_productos():
    try:
        # Obtener parámetro de categoría y buscar si existe
        categoria_nombre = request.args.get('categoria')
        buscar = request.args.get('buscar')

        # ✅ SOLO MOSTRAR PRODUCTOS ACTIVOS Y CON STOCK > 0
        query = Producto.query.filter(
            Producto.activo == True,
            Producto.stock > 0
        )
        
        if categoria_nombre:
            query = query.join(Categoria).filter(Categoria.nombre == categoria_nombre)
            print(f"🔍 Filtrando por categoría: {categoria_nombre}")

        if buscar:
            # Buscar en nombre ignorando mayúsculas/minúsculas
            # Reemplazamos los espacios por % para que sea más flexible
            buscar_tokens = buscar.split()
            for token in buscar_tokens:
                query = query.filter(Producto.nombre.ilike(f'%{token}%'))
            print(f"🔍 Filtrando por búsqueda: {buscar}")

        productos = query.all()
        print(f"📦 Productos encontrados: {len(productos)} productos")

        productos_data = []
        for producto in productos:
            productos_data.append({
                'id': producto.id_producto,
                'nombre': producto.nombre,
                'descripcion': producto.descripcion,
                'precio': float(producto.precio) if producto.precio else 0,
                'stock': producto.stock,
                'imagen': producto.imagen,
                'categoria': producto.categoria.nombre if producto.categoria else 'Sin categoría',
                'categoria_id': producto.categoria_id
            })

        return jsonify({
            'success': True,
            'productos': productos_data,
            'filtro_aplicado': categoria_nombre if categoria_nombre else 'todos'
        })

    except Exception as e:
        print(f"❌ Error obteniendo productos: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Error al obtener productos'}), 500"""

# Expresión regular para reemplazar todo el cuerpo de api_productos
pattern = re.compile(r"def api_productos\(\):\n(?:(?: {4}.*\n)*)(?: {4}return.*?500)", re.MULTILINE)

new_content, count = pattern.subn(new_func, content, count=1)

if count > 0:
    with open('app/routes/web.py', 'w') as f:
        f.write(new_content)
    print("Reemplazo exitoso.")
else:
    print("No se encontró la función api_productos.")
