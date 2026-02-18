--
-- PostgreSQL database dump
--

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_activity (
    id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    descripcion text NOT NULL,
    usuario_id integer,
    referencia_tipo character varying(50),
    referencia_id integer,
    creado_en timestamp without time zone NOT NULL
);


--
-- Name: admin_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_activity_id_seq OWNED BY public.admin_activity.id;


--
-- Name: carrito; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carrito (
    id_carrito integer NOT NULL,
    usuario_id integer,
    fecha_creacion timestamp without time zone,
    activo boolean
);


--
-- Name: carrito_id_carrito_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carrito_id_carrito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carrito_id_carrito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carrito_id_carrito_seq OWNED BY public.carrito.id_carrito;


--
-- Name: carrito_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carrito_items (
    id_item integer NOT NULL,
    carrito_id integer,
    producto_id integer,
    cantidad integer,
    precio_unitario numeric(10,2),
    fecha_agregado timestamp without time zone
);


--
-- Name: carrito_items_id_item_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carrito_items_id_item_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carrito_items_id_item_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carrito_items_id_item_seq OWNED BY public.carrito_items.id_item;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- Name: favoritos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favoritos (
    id_favorito integer NOT NULL,
    usuario_id integer NOT NULL,
    producto_id integer NOT NULL,
    fecha_agregado timestamp without time zone
);


--
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favoritos_id_favorito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favoritos_id_favorito_seq OWNED BY public.favoritos.id_favorito;


--
-- Name: inventario_movimientos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventario_movimientos (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    cantidad integer NOT NULL,
    motivo character varying(200),
    usuario_id integer,
    creado_en timestamp without time zone NOT NULL
);


--
-- Name: inventario_movimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inventario_movimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inventario_movimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inventario_movimientos_id_seq OWNED BY public.inventario_movimientos.id;


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    pedido_id integer NOT NULL,
    proveedor character varying(30) NOT NULL,
    estado character varying(30) NOT NULL,
    monto numeric(10,2) NOT NULL,
    moneda character varying(10),
    referencia character varying(255),
    payload json,
    creado_en timestamp without time zone NOT NULL
);


--
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- Name: pedido_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedido_items (
    id_item integer NOT NULL,
    pedido_id integer,
    producto_id integer,
    cantidad integer,
    precio_unitario numeric(10,2)
);


--
-- Name: pedido_items_id_item_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedido_items_id_item_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedido_items_id_item_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedido_items_id_item_seq OWNED BY public.pedido_items.id_item;


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedidos (
    id_pedido integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha_pedido timestamp without time zone,
    total numeric(10,2) NOT NULL,
    estado character varying(50),
    direccion_envio text,
    metodo_pago character varying(50),
    id_transaccion_paypal character varying(255),
    id_transaccion_mercadopago character varying(255)
);


--
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedidos_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedidos_id_pedido_seq OWNED BY public.pedidos.id_pedido;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos (
    id_producto integer NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    stock integer,
    imagen character varying(500),
    categoria_id integer,
    activo boolean,
    fecha_creacion timestamp without time zone,
    destacado boolean DEFAULT false
);


--
-- Name: productos_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.productos_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.productos.id_producto;


--
-- Name: reporte_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reporte_items (
    id integer NOT NULL,
    reporte_id integer NOT NULL,
    clave character varying(100) NOT NULL,
    valor_texto character varying(255),
    valor_numero numeric(12,2),
    orden integer
);


--
-- Name: reporte_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reporte_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reporte_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reporte_items_id_seq OWNED BY public.reporte_items.id;


--
-- Name: reportes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reportes (
    id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    fecha_inicio date,
    fecha_fin date,
    estado character varying(20),
    total numeric(12,2),
    metadata_json json,
    creado_en timestamp without time zone NOT NULL,
    generado_en timestamp without time zone
);


--
-- Name: reportes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reportes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reportes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reportes_id_seq OWNED BY public.reportes.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id_rol integer NOT NULL,
    nombre character varying(30)
);


--
-- Name: roles_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_rol_seq OWNED BY public.roles.id_rol;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(50),
    correo character varying(100) NOT NULL,
    nombre_usuario character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    fecha_registro timestamp without time zone,
    ultimo_acceso timestamp without time zone,
    telefono character varying(15),
    rol_id integer NOT NULL,
    activo boolean,
    direccion_envio text,
    ciudad character varying(100),
    estado character varying(100),
    codigo_postal character varying(20)
);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: admin_activity id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_activity ALTER COLUMN id SET DEFAULT nextval('public.admin_activity_id_seq'::regclass);


--
-- Name: carrito id_carrito; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carrito ALTER COLUMN id_carrito SET DEFAULT nextval('public.carrito_id_carrito_seq'::regclass);


--
-- Name: carrito_items id_item; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carrito_items ALTER COLUMN id_item SET DEFAULT nextval('public.carrito_items_id_item_seq'::regclass);


--
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- Name: favoritos id_favorito; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN id_favorito SET DEFAULT nextval('public.favoritos_id_favorito_seq'::regclass);


--
-- Name: inventario_movimientos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_movimientos ALTER COLUMN id SET DEFAULT nextval('public.inventario_movimientos_id_seq'::regclass);


--
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- Name: pedido_items id_item; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_items ALTER COLUMN id_item SET DEFAULT nextval('public.pedido_items_id_item_seq'::regclass);


--
-- Name: pedidos id_pedido; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedidos_id_pedido_seq'::regclass);


--
-- Name: productos id_producto; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_id_producto_seq'::regclass);


--
-- Name: reporte_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reporte_items ALTER COLUMN id SET DEFAULT nextval('public.reporte_items_id_seq'::regclass);


--
-- Name: reportes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reportes ALTER COLUMN id SET DEFAULT nextval('public.reportes_id_seq'::regclass);


--
-- Name: roles id_rol; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id_rol SET DEFAULT nextval('public.roles_id_rol_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Data for Name: admin_activity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_activity (id, tipo, descripcion, usuario_id, referencia_tipo, referencia_id, creado_en) FROM stdin;
\.


--
-- Data for Name: carrito; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carrito (id_carrito, usuario_id, fecha_creacion, activo) FROM stdin;
1	2	2026-02-10 03:31:54.56891	t
2	8	2026-02-12 05:00:00.479437	t
3	9	2026-02-12 17:57:39.28994	t
\.


--
-- Data for Name: carrito_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carrito_items (id_item, carrito_id, producto_id, cantidad, precio_unitario, fecha_agregado) FROM stdin;
1	1	1	3	1699.00	2026-02-10 03:31:54.592182
6	3	2	1	1099.00	2026-02-12 17:57:39.29753
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias (id_categoria, nombre, descripcion) FROM stdin;
1	Consolas	Consolas y hardware
2	Juegos	Videojuegos
3	Accesorios	Accesorios y periféricos
4	Controles	Mandos y controladores
\.


--
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favoritos (id_favorito, usuario_id, producto_id, fecha_agregado) FROM stdin;
1	2	1	2026-02-10 03:31:47.592445
2	2	2	2026-02-10 03:31:48.744959
3	3	1	2026-02-11 05:23:06.172123
4	8	4	2026-02-12 04:56:37.348267
5	8	5	2026-02-12 05:15:45.821975
\.


--
-- Data for Name: inventario_movimientos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventario_movimientos (id, producto_id, tipo, cantidad, motivo, usuario_id, creado_en) FROM stdin;
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pagos (id, pedido_id, proveedor, estado, monto, moneda, referencia, payload, creado_en) FROM stdin;
\.


--
-- Data for Name: pedido_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedido_items (id_item, pedido_id, producto_id, cantidad, precio_unitario) FROM stdin;
1	1	1	1	1699.00
2	2	1	1	1699.00
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedidos (id_pedido, usuario_id, fecha_pedido, total, estado, direccion_envio, metodo_pago, id_transaccion_paypal, id_transaccion_mercadopago) FROM stdin;
1	2	2026-02-10 03:32:06.467664	1699.00	pendiente	\N	mercadopago	\N	\N
2	2	2026-02-10 03:32:25.931293	1699.00	pendiente	\N	mercadopago	\N	\N
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.productos (id_producto, nombre, descripcion, precio, stock, imagen, categoria_id, activo, fecha_creacion, destacado) FROM stdin;
1	RESIDENT EVIL REQUIEM PS5	Categoría: Software\n    Etiquetas: Capcom, Playstation, Preventa, Requiem, Resident Evil	1699.00	25	https://cdn2.gameplanet.com/wp-content/uploads/2025/09/08170146/Resident-Evil-Requiem-PS5-1.jpg	2	t	2026-02-10 03:28:51.549213	f
2	OCTOPATH TRAVELER 0	Categoría: Software\nEtiquetas: Nintendo, NSW, Octopath Traveler	1099.00	14	https://cdn2.gameplanet.com/wp-content/uploads/2025/12/03195522/662248928302-17647045225905.jpg	2	t	2026-02-10 03:30:50.692248	f
3	LITTLE NIGHTMARES III XSX	Categoría: Software\n    Etiquetas: Little Nightmares, Preventa, XSX	999.00	18	https://cdn2.gameplanet.com/wp-content/uploads/2022/08/11194716/The-Little-Nightmares-III-XSX-510x630.jpg	2	t	2026-02-11 05:21:07.084611	f
4	CONTROL PLAYSTATION 5 DUALSENSE MIDNIGHT BLACK	Categoría: Controles\nEtiquetas: Controles, Midnight Black, Playstation, PS5	1799.00	10	https://cdn2.gameplanet.com/wp-content/uploads/2022/09/04033751/dualsense_black_1-510x630.jpg	4	t	2026-02-11 05:22:41.641887	f
5	CONSOLA PLAYSTATION 5 PRO DIGITAL 2TB	Categoría: Hardware\nEtiquetas: Playstation, PS5, PS5 Pro	19000.00	20	https://cdn2.gameplanet.com/wp-content/uploads/2024/11/07112616/711719595496-P00000004362-ps5-pro-portada-510x630.jpg	1	t	2026-02-12 05:14:30.166316	f
\.


--
-- Data for Name: reporte_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reporte_items (id, reporte_id, clave, valor_texto, valor_numero, orden) FROM stdin;
\.


--
-- Data for Name: reportes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reportes (id, tipo, fecha_inicio, fecha_fin, estado, total, metadata_json, creado_en, generado_en) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id_rol, nombre) FROM stdin;
1	Administrador
2	Cliente
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id_usuario, nombre, correo, nombre_usuario, password, fecha_registro, ultimo_acceso, telefono, rol_id, activo, direccion_envio, ciudad, estado, codigo_postal) FROM stdin;
1	isaac	isaac13@gmail.com	isaac	scrypt:32768:8:1$uFIX7H4P4ZtPtriY$f73a2ba0f418b582e35dc48151b7cbe5ca8dadc9faf5b999ca9365aa0ccc899a459e51d2d56a814a775a81137cf13ee6a90f69a1e3622d82c401bfbc41936075	2026-02-09 10:33:33.948833	\N	\N	1	t	\N	\N	\N	\N
2	\N	carlo@gamial.com	Carlos	scrypt:32768:8:1$5iy9uy2LV5jmaBf4$fdf52d2043474dec7e87515db720d8a118b3ef03af86d57cbd3d3c1ff4738b307031de65efcb5f938c35cd0a8dc96e7232a1e93000e6391f7b11be802cd8c2e6	2026-02-09 21:31:35.542593	\N	\N	2	t	\N	\N	\N	\N
3	\N	pablo1@gmail.com	Pablo 	scrypt:32768:8:1$sjoysXz7ysgooMMk$2a849ee2b19ab3109fc3a90bd9f7652ce2b0d3db47d7d7c42f2e81b9dda915a52ff939bc6a36c0b9753a16981f9f6dccfbe8d3ae9cabaee0e927844fa9ff7513	2026-02-10 21:50:16.302434	\N	\N	2	t	\N	\N	\N	\N
4	\N	uro.ve90@gmail.com	penelope	scrypt:32768:8:1$9UnBgoEUAGCgzJjn$9fe64e3c060033d96fc35f90a68bd253d67e6402f8201fb970eeb3cb798e01ff16e78c0621d6757a08188ff180748bf6be4e6fd7680bafea63150ae7b2f18483	2026-02-10 22:45:16.946195	\N	\N	2	t	\N	\N	\N	\N
5	\N	bre@gmail.com	Brenda	scrypt:32768:8:1$chXfEl8hLf4PdN7o$a40b444458b8e84a126bbfad078e34783c3ffee11c0576e775e21438279900c6db982759affaad2c4776a72b4818d8d1f7b17dc37dbb9a88fbdf897b1bca77a7	2026-02-10 23:16:33.065244	\N	\N	1	t	\N	\N	\N	\N
6	\N	xim@gamil.com	Ximena 	scrypt:32768:8:1$sKmKuhP9Qhcirs3F$1877b886cb3a74fd2d62f15bafbdb818ca9ae32d024685fa825fb1de0f480ac6e6e95a5eb79fa275ce5d7c187f14a3f56841c82f1b63982761ed71dedf9b62c3	2026-02-10 23:37:45.084957	\N	\N	2	t	\N	\N	\N	\N
8	\N	pab@gmail.com	Pablo Méndez	pbkdf2:sha256:600000$0dks8l3kNIZM5bH0$61880da56a24d5b03b6004c3d80022ed44db6f405d9ef69c664c7834cce94d88	2026-02-11 22:53:39.592549	\N	562245866	1	t	Refroma Central 5	Ciudad de México	CDMX	09730
9	\N	da@gmail.com	david Martinez	pbkdf2:sha256:600000$UvYlN8XuINe2zqQx$cd9cfaebc7ccbf8366b4d709237caf277080ce234378c790529ab5e283dbacbc	2026-02-12 11:57:21.728215	\N	\N	2	t	\N	\N	\N	\N
\.


--
-- Name: admin_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_activity_id_seq', 1, false);


--
-- Name: carrito_id_carrito_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carrito_id_carrito_seq', 3, true);


--
-- Name: carrito_items_id_item_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carrito_items_id_item_seq', 6, true);


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 4, true);


--
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favoritos_id_favorito_seq', 5, true);


--
-- Name: inventario_movimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventario_movimientos_id_seq', 1, false);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- Name: pedido_items_id_item_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedido_items_id_item_seq', 2, true);


--
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedidos_id_pedido_seq', 2, true);


--
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.productos_id_producto_seq', 5, true);


--
-- Name: reporte_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reporte_items_id_seq', 1, false);


--
-- Name: reportes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reportes_id_seq', 1, false);


--
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_rol_seq', 1, false);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 9, true);


--
-- Name: admin_activity admin_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_activity
    ADD CONSTRAINT admin_activity_pkey PRIMARY KEY (id);


--
-- Name: carrito_items carrito_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carrito_items
    ADD CONSTRAINT carrito_items_pkey PRIMARY KEY (id_item);


--
-- Name: carrito carrito_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (id_carrito);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id_favorito);


--
-- Name: inventario_movimientos inventario_movimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_movimientos
    ADD CONSTRAINT inventario_movimientos_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: pedido_items pedido_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_items
    ADD CONSTRAINT pedido_items_pkey PRIMARY KEY (id_item);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id_pedido);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id_producto);


--
-- Name: reporte_items reporte_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reporte_items
    ADD CONSTRAINT reporte_items_pkey PRIMARY KEY (id);


--
-- Name: reportes reportes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reportes
    ADD CONSTRAINT reportes_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);


--
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- Name: usuarios usuarios_nombre_usuario_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_usuario_key UNIQUE (nombre_usuario);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: admin_activity admin_activity_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_activity
    ADD CONSTRAINT admin_activity_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: carrito_items carrito_items_carrito_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carrito_items
    ADD CONSTRAINT carrito_items_carrito_id_fkey FOREIGN KEY (carrito_id) REFERENCES public.carrito(id_carrito);


--
-- Name: carrito_items carrito_items_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carrito_items
    ADD CONSTRAINT carrito_items_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id_producto);


--
-- Name: carrito carrito_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: favoritos favoritos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id_producto);


--
-- Name: favoritos favoritos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: inventario_movimientos inventario_movimientos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_movimientos
    ADD CONSTRAINT inventario_movimientos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id_producto);


--
-- Name: inventario_movimientos inventario_movimientos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_movimientos
    ADD CONSTRAINT inventario_movimientos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: pagos pagos_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id_pedido);


--
-- Name: pedido_items pedido_items_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_items
    ADD CONSTRAINT pedido_items_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id_pedido);


--
-- Name: pedido_items pedido_items_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_items
    ADD CONSTRAINT pedido_items_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id_producto);


--
-- Name: pedidos pedidos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario);


--
-- Name: productos productos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id_categoria);


--
-- Name: reporte_items reporte_items_reporte_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reporte_items
    ADD CONSTRAINT reporte_items_reporte_id_fkey FOREIGN KEY (reporte_id) REFERENCES public.reportes(id);


--
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id_rol);


--
-- PostgreSQL database dump complete
--

