            {
                id: 'favoritos',
                pattern: /\b(favorito|favoritos|corazon|corazón|deseo|deseos|lista de deseos|guardar producto|guardado)\b/,
                response: 'Puedes agregar productos a tus favoritos presionando en el corazón que aparece en cada producto. Recuerda que para poder agregarlos a tu lista de deseos debes iniciar sesión primero. Si deseas, te puedo llevar a tu lista.'
            },
            {
                id: 'inventario_ps5_xbox',
                pattern: /\b(ps5|ps4|xbox|nintendo switch|switch).*disponible|\b(tienen|hay|busco|venden).*(ps5|ps4|xbox|switch)\b/,
                response: '¡Por supuesto! Tratamos de mantener nuestro inventario al día. Puedes revisar la disponibilidad exacta y las ediciones especiales directamente en nuestra categoría de Consolas.'
            },
            {
                id: 'precios_juegos',
                pattern: /\b(precio|cuanto cuesta|cuánto cuesta|costo).*(octopath|juego|juegos)\b/,
                response: 'Contamos con excelentes precios y ofertas constantes. Para ver el costo exacto de cualquier título como Octopath Traveler, te recomiendo usar el buscador superior o ir a la sección de Juegos.'
            },
            {
                id: 'juegos_oferta',
                pattern: /\b(juegos|switch|nintendo).*(oferta|descuento|promocion|baratos)\b/,
                response: '¡Siempre tenemos algo en promoción! Entra a la categoría "Juegos" y podrás filtrar o buscar las etiquetas de descuento en los títulos de Nintendo Switch, PS5 y Xbox.'
            },
            {
                id: 'color_accesorios',
                pattern: /\b(controles|control|accesorio).*(color|rojo|azul|negro|blanco)\b/,
                response: 'En nuestra sección de Controles tenemos varios colores y ediciones especiales (como rojo, azul y más). Te invito a darle un vistazo haciendo click aquí abajo.'
            },
            {
                id: 'estado_pedido_especifico',
                pattern: /\b(donde esta mi pedido|donde está mi pedido|estado.*pedido|ya enviaron.*pedido)\b/,
                response: 'Para ubicar exactamente dónde está tu pedido y si ya fue enviado, por favor dirígete a la sección de "Pedidos" en tu perfil. Allí verás el rastreo desde que sale de tienda hasta tu casa.'
            },
            {
                id: 'tiempo_envio',
                pattern: /\b(cuanto tarda|tiempo.*llegar|llega a|envio a|envío a|demora)\b/,
                response: 'El tiempo de envío estándar suele ser de 2 a 5 días hábiles dependiendo de la zona (ej. Ciudad de México suele ser rápido). Puedes ver una estimación exacta al estar en el Carrito.'
            },
            {
                id: 'numero_guia',
                pattern: /\b(numero de guia|número de guía|tracking|codigo de rastreo)\b/,
                response: 'El número de guía se genera automáticamente una vez despachado. Revisa en "Mis Compras" -> "Pedidos", haces click en tu compra reciente y allí aparecerá tu guía.'
            },
            {
                id: 'soporte_sincronizar',
                pattern: /\b(no sincroniza|no conecta|falla.*control|problema.*hardware)\b/,
                response: 'Si tu control o consola está fallando o no sincroniza, te sugerimos reiniciar el dispositivo de fábrica. Si el problema persiste, ponte en contacto con nosotros para validar una posible garantía.'
            },
            {
                id: 'tiempo_garantia',
                pattern: /\b(tiempo.*garantia|garantía|cuanta.*garantia)\b/,
                response: 'La mayoría de nuestras consolas (como Nintendo Switch, PS5, Xbox) cuentan con mínimo 1 año de garantía por defectos de fábrica directamente con el fabricante o mediante nosotros en los primeros 30 días.'
            },
            {
                id: 'devolucion_abierto',
                pattern: /\b(devolver.*juego.*abierto|devolucion.*juego.*abierto)\b/,
                response: 'Por políticas de seguridad, los juegos físicos no se pueden devolver si los sellos originales o el empaque ya fueron abiertos. Si tienes un defecto de fábrica, repórtalo en nuestra sección de Contacto.'
            },
            {
                id: 'canje_codigo',
                pattern: /\b(canjear.*codigo|codigo de descarga|canjeo.*codigo)\b/,
                response: 'Para canjear un juego digital, ve a la tienda oficial de tu consola (eShop, PS Store o Xbox Store), busca la opción de "Canjear código" e introduce los 12 o 16 caracteres tal cual aparecen en tu compra.'
            },
            {
                id: 'problemas_login',
                pattern: /\b(no puedo iniciar sesion|no puedo entrar|error iniciar sesion|error en cuenta)\b/,
                response: 'Lamento que tengas problemas de acceso. A veces es tema del navegador; intenta borrar la caché o presionar en "Recuperar contraseña". Si el problema sigue, escríbenos directamente en Contacto.'
            },
            {
                id: 'metodos_pago_seguros',
                pattern: /\b(metodos de pago|PayPal|tarjeta).*aceptan\b|\b(como puedo pagar|es seguro comprar)\b/,
                response: 'Tu compra es 100% segura. Contamos con conexión cifrada. Aceptamos diversas opciones: Tarjetas de Crédito/Débito, PayPal y Mercadopago. Podrás elegir tu preferida en el checkout.'
            },
            {
                id: 'recuperar_password',
                pattern: /\b(recuperar.*contraseña|olvide.*contraseña|olvidé.*clave|resetear.*contraseña)\b/,
                response: 'En la pantalla de Ingreso/Login, verás un botón que dice "¿Olvidaste tu contraseña?". Haz click ahí, ingresa tu correo y te enviaremos un link para restablecerla.'
            },
