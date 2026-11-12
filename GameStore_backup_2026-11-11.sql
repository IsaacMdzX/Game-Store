--
-- PostgreSQL database dump
--

\restrict sl9eetjYUAGbFTzYvbxDPL2fGoQKJzKpCIbCizC712rcO2gIKhuU7AfxHKiDhhe

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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
-- Name: chatbot_faq; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chatbot_faq (
    id integer NOT NULL,
    pregunta_normalizada character varying(300) NOT NULL,
    pregunta_original character varying(300) NOT NULL,
    primera_consulta timestamp without time zone NOT NULL,
    ultima_consulta timestamp without time zone NOT NULL,
    frecuencia integer NOT NULL,
    ultima_intencion character varying(80),
    ultima_pagina character varying(120)
);


--
-- Name: chatbot_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chatbot_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chatbot_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chatbot_faq_id_seq OWNED BY public.chatbot_faq.id;


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
-- Name: magic_link_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.magic_link_tokens (
    id integer NOT NULL,
    token character varying(128) NOT NULL,
    email character varying(200) NOT NULL,
    user_id integer,
    created_at timestamp without time zone,
    expires_at timestamp without time zone NOT NULL,
    used boolean
);


--
-- Name: magic_link_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.magic_link_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: magic_link_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.magic_link_tokens_id_seq OWNED BY public.magic_link_tokens.id;


--
-- Name: mensajes_contacto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensajes_contacto (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    asunto character varying(300) NOT NULL,
    mensaje text NOT NULL,
    fecha_creacion timestamp without time zone,
    leido boolean,
    respondido boolean
);


--
-- Name: mensajes_contacto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mensajes_contacto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mensajes_contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mensajes_contacto_id_seq OWNED BY public.mensajes_contacto.id;


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
-- Name: password_reset_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_codes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    email character varying(200) NOT NULL,
    code character varying(10) NOT NULL,
    created_at timestamp without time zone,
    expires_at timestamp without time zone NOT NULL,
    used boolean
);


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_reset_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_reset_codes_id_seq OWNED BY public.password_reset_codes.id;


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
-- Name: chatbot_faq id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chatbot_faq ALTER COLUMN id SET DEFAULT nextval('public.chatbot_faq_id_seq'::regclass);


--
-- Name: favoritos id_favorito; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN id_favorito SET DEFAULT nextval('public.favoritos_id_favorito_seq'::regclass);


--
-- Name: inventario_movimientos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario_movimientos ALTER COLUMN id SET DEFAULT nextval('public.inventario_movimientos_id_seq'::regclass);


--
-- Name: magic_link_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.magic_link_tokens ALTER COLUMN id SET DEFAULT nextval('public.magic_link_tokens_id_seq'::regclass);


--
-- Name: mensajes_contacto id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes_contacto ALTER COLUMN id SET DEFAULT nextval('public.mensajes_contacto_id_seq'::regclass);


--
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- Name: password_reset_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes ALTER COLUMN id SET DEFAULT nextval('public.password_reset_codes_id_seq'::regclass);


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
4	1	2026-11-12 01:25:31.528046	t
\.


--
-- Data for Name: carrito_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carrito_items (id_item, carrito_id, producto_id, cantidad, precio_unitario, fecha_agregado) FROM stdin;
1	1	1	3	1699.00	2026-02-10 03:31:54.592182
6	3	2	1	1099.00	2026-02-12 17:57:39.29753
8	4	5	1	19000.00	2026-11-12 01:25:35.451943
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
-- Data for Name: chatbot_faq; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chatbot_faq (id, pregunta_normalizada, pregunta_original, primera_consulta, ultima_consulta, frecuencia, ultima_intencion, ultima_pagina) FROM stdin;
2	pedidos	Pedidos	2026-11-11 04:34:19.130086	2026-11-11 04:34:19.130086	1	pedidos	/
3	métodos de pago	Métodos de pago	2026-11-11 04:35:04.04892	2026-11-11 04:35:04.04892	1	metodos_pago	/
1	hola	Hola	2026-11-11 04:34:16.623204	2026-11-11 04:39:25.472248	2	saludo	/juegos
4	compras	Compras	2026-11-11 04:39:33.457623	2026-11-11 04:39:33.457623	1	pedidos	/juegos
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
6	1	7	2026-11-12 00:55:32.492841
\.


--
-- Data for Name: inventario_movimientos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventario_movimientos (id, producto_id, tipo, cantidad, motivo, usuario_id, creado_en) FROM stdin;
\.


--
-- Data for Name: magic_link_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.magic_link_tokens (id, token, email, user_id, created_at, expires_at, used) FROM stdin;
\.


--
-- Data for Name: mensajes_contacto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mensajes_contacto (id, nombre, email, asunto, mensaje, fecha_creacion, leido, respondido) FROM stdin;
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pagos (id, pedido_id, proveedor, estado, monto, moneda, referencia, payload, creado_en) FROM stdin;
\.


--
-- Data for Name: password_reset_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_codes (id, user_id, email, code, created_at, expires_at, used) FROM stdin;
\.


--
-- Data for Name: pedido_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedido_items (id_item, pedido_id, producto_id, cantidad, precio_unitario) FROM stdin;
1	1	1	1	1699.00
2	2	1	1	1699.00
3	3	32	1	1599.00
4	3	5	1	19000.00
5	4	32	1	1599.00
6	4	5	1	19000.00
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedidos (id_pedido, usuario_id, fecha_pedido, total, estado, direccion_envio, metodo_pago, id_transaccion_paypal, id_transaccion_mercadopago) FROM stdin;
1	2	2026-02-10 03:32:06.467664	1699.00	pendiente	\N	mercadopago	\N	\N
2	2	2026-02-10 03:32:25.931293	1699.00	pendiente	\N	mercadopago	\N	\N
3	1	2026-11-12 01:28:29.233549	20599.00	pendiente	\N	paypal	\N	\N
4	1	2026-11-12 01:28:46.130525	20599.00	pendiente	\N	paypal	\N	\N
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
6	GRAND THEFT AUTO VI ESTANDAR PS5	Sobre esta preventa\nPrecio final confirmado: SI\nFecha de lanzamiento confirmada: SI\nFecha de lanzamiento: 12 de noviembre, 2026\nFecha límite de apartado: 11 de noviembre, 2026	1699.99	100	https://cdn2.gameplanet.com/wp-content/uploads/2026/06/11103654/GP-PV-2026-PackShots-1200x1483-GTA-VI-PS5-510x630.jpg	2	t	2026-11-12 00:54:04.028146	f
7	CONSOLA NINTENDO SWITCH 2 EDICION DEL 40 ANIVERSARIO THE LEGEND OF ZELDA NSW2	Nintendo Switch 2 Edición del 40.º aniversario The Legend of Zelda\n\nLa consola Nintendo Switch 2 presenta un diseño inspirado en la serie The Legend of Zelda que incluye el legendario símbolo de la Trifuerza en la parte delantera de la base. (El juego no está incluido). \n\nBase de color negro y dorado con el símbolo de la Trifuerza. En la superficie de la base de color negro y dorado se pueden apreciar decoraciones inspiradas en los juegos de la serie The Legend of Zelda junto con el símbolo dorado de la Trifuerza. Equipo con diseños de la serie.	17999.00	50	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/19113608/CONSOLA-THE-LEGEND-OF-ZELDA-NSW2-GP-1-510x630.jpg	1	t	2026-11-12 00:55:14.483598	f
8	CALL OF DUTY MODERN WARFARE 4 PS5	Guerra sin límites\n\nLa guerra estalla en la península de Corea cuando Corea del Norte lanza una invasión a gran escala que amenaza con desestabilizar el equilibrio mundial. En Call of Duty®: Modern Warfare® 4, los jugadores vivirán una intensa historia de acción militar donde el conflicto se extiende por distintos puntos del planeta y pone a prueba a viejos y nuevos héroes.	1300.00	35	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/23073553/CoD_MW4_PS5_GP-17811171740482.jpg	2	t	2026-11-12 00:56:34.741159	f
9	CONTROL PLAYSTATION 5 DUALSENSE GRAND THEFT AUTO VI WHITE	Inspirados en Grand Theft Auto VI, estos controles inalámbricos DualSense de edición limitada capturan el estilo y el lujo de Vice City. Con un acabado brillante e iridiscente, detalles texturizados de hoja de palmera y la marca oficial de Grand Theft Auto VI, son un tributo audaz a la Vice City moderna.\n\nDescubre una experiencia de juego más intensa y profundamente inmersiva que lleva toda la acción al alcance de tus manos. El control inalámbrico DualSense ofrece respuesta háptica envolvente, gatillos adaptativos dinámicos y un micrófono incorporado, todo en un diseño cómodo e icónico.	1699.00	20	https://cdn2.gameplanet.com/wp-content/uploads/2026/09/10102230/CONTROL-DUALSENSE-GTA-VI-WHITE-GP-510x630.jpg	4	t	2026-11-12 00:57:39.848866	f
10	GRAND THEFT AUTO VI ESTANDAR XSX	IMPORTANTE – CONTENIDO DEL PRODUCTO – La caja contiene un código de descarga digital del videojuego. No incluye disco físico.\nEl juego se lanzará y será jugable a partir del 19 de noviembre de 2026. El producto estará disponible a partir del 12 de noviembre de 2026. Se contará con un plazo de 30 días a partir de esa fecha para recogerlo. Si después de los 30 días el producto no ha sido recogido, se realizará la devolución del monto pagado en saldo GamePlanet.\n\nReserva Grand Theft Auto VI y prepárate para vivir la experiencia más ambiciosa jamás creada por Rockstar Games.	1699.00	56	https://cdn2.gameplanet.com/wp-content/uploads/2026/06/11103657/GP-PV-2026-PackShots-1200x1483-GTA-VI-XSX-510x630.jpg	2	t	2026-11-12 00:58:36.105203	f
11	EA SPORTS FC 27	El Juego del Mundo está de regreso. Vive la experiencia futbolística más completa con EA SPORTS FC™ 27, una entrega que amplía la forma de jugar, competir y crear tu legado dentro y fuera de la cancha.\n\nDescubre The Grounds\n\nExplora The Grounds, un nuevo espacio dedicado al futbol social donde se unen las calles y el estadio. Conoce jugadores, recluta miembros para tu Club y participa en diferentes actividades, desde partidos rápidos y desafíos reducidos hasta intensos torneos entre clubes.	1299.00	67	https://cdn2.gameplanet.com/wp-content/uploads/2026/09/25082146/EA-Sports-FC-27-PS5-GP-17855203283953.jpg	2	t	2026-11-12 00:59:30.259	f
12	LLAVERO SORPRESA YOSHI	Llavero Sorpresa Yoshi – Backpack Buddies\n\n¡Lleva la diversión de Super Mario contigo a todas partes! Los Yoshi Backpack Buddies son el accesorio perfecto para darle personalidad y color a tu mochila, llaves o bolso.	259.00	35	https://cdn2.gameplanet.com/wp-content/uploads/2026/03/09200003/5056577718522-17728244319076-510x630.jpg	3	t	2026-11-12 01:00:27.210711	f
13	CALL OF DUTY MODERN WARFARE 4 XSX	Guerra sin límites\n\nLa guerra estalla en la península de Corea cuando Corea del Norte lanza una invasión a gran escala que amenaza con desestabilizar el equilibrio mundial. En Call of Duty®: Modern Warfare® 4, los jugadores vivirán una intensa historia de acción militar donde el conflicto se extiende por distintos puntos del planeta y pone a prueba a viejos y nuevos héroes.	1399.00	62	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/23073532/GP-PV-2026-PackShots-1200x1483-CoD-MWF4-XSX-17811148706684.png	2	t	2026-11-12 01:01:11.617474	f
14	CONTROL INALAMBRICO CORE INNOVATIONS	Lleva tu experiencia de juego al siguiente nivel con el Core Innovations Wireless Controller, un control diseñado para ofrecer comodidad, precisión y libertad de movimiento. Compatible con Nintendo Switch y PC, es la opción ideal para disfrutar de tus juegos favoritos con total comodidad y control.	89.00	15	https://cdn2.gameplanet.com/wp-content/uploads/2026/07/16084740/Core-Innovations-WRLS-Controller-NSW-17839628194859-510x630.jpg	4	t	2026-11-12 01:01:55.753626	f
15	CONSOLA NINTENDO SWITCH 2 CON MARIO KART WORLD FISICO Y ADAPTADOR DE CORRIENTE	Consola Nintendo Switch 2 + Mario Kart World (Físico) + Adaptador de Corriente\n\nDescubre la nueva generación del entretenimiento con la Nintendo Switch 2, una consola híbrida que lleva la experiencia de juego a otro nivel. Con un diseño icónico en colores azul y rojo, combina potencia, innovación y versatilidad para jugar donde y como quieras.	12599.00	30	https://cdn2.gameplanet.com/wp-content/uploads/2026/05/15073239/7506127526940-17787692284750-510x630.jpg	1	t	2026-11-12 01:02:29.234326	f
16	CALL OF DUTY MODERN WARFARE 4	Guerra sin límites\n\nLa guerra estalla en la península de Corea cuando Corea del Norte lanza una invasión a gran escala que amenaza con desestabilizar el equilibrio mundial. En Call of Duty®: Modern Warfare® 4, los jugadores vivirán una intensa historia de acción militar donde el conflicto se extiende por distintos puntos del planeta y pone a prueba a viejos y nuevos héroes.	1499.00	26	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/23073517/CALL-OF-DUTY-MODERN-WARFARE-4-NSW2-GP-17885357659931-510x630.jpg	2	t	2026-11-12 01:03:02.148196	f
28	ESTUCHE NINTENDO SWITCH SUPER MARIO BROS 8 BIT	– Diseños exclusivos de 8bit Super Mario en ambos lados\n– La cubierta exterior suave con cremallera se adapta perfectamente a la consola en modo portátil\n– Forro interior de fieltro con soporte de juego incorporado para modo de mesa\n– Almacenamiento para 5 tarjetas de juego más bolsillo de malla\n– Licencia oficial para Nintendo Switch	189.00	16	https://cdn2.gameplanet.com/wp-content/uploads/2022/09/02030914/estuche-mario-8-bits-510x630.jpg	3	t	2026-11-12 01:11:44.023685	f
29	CONTROL XBOX ALAMBRICO POWER A ADV WOODLAND CAMO	Control Alámbrico PowerA DV WOODLAND CAMO \n\nDomina cada partida con el Control Alámbrico PowerA en color verde, diseñado para ofrecer precisión y comodidad en cada movimiento. Su compatibilidad con Xbox One, Windows y Xbox Series X lo convierte en una opción versátil para cualquier gamer.	599.00	16	https://cdn2.gameplanet.com/wp-content/uploads/2025/05/21183037/control201NEW20PRODUCT-17478738226770.jpg	4	t	2026-11-12 01:12:30.426309	f
30	POWER A HEADSET PIKACHU GOLD	isfruta de audio inmersivo y un estilo inconfundible con los PowerA Headset Pikachu Gold, unos auriculares diseñados para gamers que buscan comodidad, rendimiento y un diseño icónico.\n\nSu elegante acabado negro con detalles dorados de Pikachu los convierte en un accesorio ideal tanto para jugar como para escuchar música o participar en llamadas y chats. El sonido estéreo de alta fidelidad ofrece graves potentes y gran claridad, permitiéndote sumergirte por completo en cada partida y detectar detalles clave en el entorno.	599.00	14	https://cdn2.gameplanet.com/wp-content/uploads/2026/05/08130442/617885021176-17781836841797-510x630.jpg	3	t	2026-11-12 01:13:02.92021	f
32	CONTROL XBOX INALAMBRICO PULSE RED PARA XBOX ONE SERIES X Y S	Control inalámbrico Xbox – Pulse Red\n\n● Vive la experiencia del diseño modernizado del control inalámbrico de Xbox – Pulse Red con superficies esculpidas y una geometría refinada para mayor comodidad y control con el menor esfuerzo durante el juego.\n● Mantén siempre tu objetivo con el agarre texturizado en los gatillos, en los botones superiores y en la carcasa trasera con un nuevo pad direccional para una entrada precisa pero familiar.\n● Aprópiate del control personalizando la asignación de botones con la aplicación Accesorios de Xbox.\n● Conecta cualquier auricular compatible con la entrada de audio de 3.5 mm.\n● Incluye tecnología Xbox Wireless y Bluetooth® para un juego inalámbrico en consolas seleccionadas, PC con Windows, teléfonos celulares y tabletas Android y iOS.	1599.00	25	https://cdn2.gameplanet.com/wp-content/uploads/2022/09/03190501/rojo_4_1.jpg	1	t	2026-11-12 01:14:13.562419	f
36	CONTROL INALAMBRICO NINTENDO VOLTEDGE CX60 MINECRAFT CREEPER	Lleva la emoción de Minecraft a cada partida con el Minecraft Creeper Wireless Controller CX60 para Nintendo Switch, un control inalámbrico inspirado en uno de los personajes más emblemáticos y reconocibles del juego. Diseñado para ofrecer comodidad, precisión y libertad de movimiento, es el accesorio ideal para quienes buscan una experiencia de juego más inmersiva y personalizada.	799.00	16	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/15080049/CONTROL-INALAMBRICO-NINTENDO-VOLTEDGE-CX60-MINECRAFT-CREEPER-NSW-GP-17919850348206.jpg	4	t	2026-11-12 01:16:54.432017	f
37	KIT DE CARGA PARA CONTROLES XBOX SERIE X VOLTEDGE BX15		299.00	26	https://cdn2.gameplanet.com/wp-content/uploads/2022/11/30162637/850021579456-voltedge-bx15-kit-carga.jpg	3	t	2026-11-12 01:17:27.445455	f
41	SILENT HILL F		499.00	17	https://cdn2.gameplanet.com/wp-content/uploads/2025/09/24194910/083717203650-17587640548347-2-510x630.jpg	2	t	2026-11-12 01:19:54.084311	f
42	THE BLOOD OF DAWNWALKER		999.00	16	https://cdn2.gameplanet.com/wp-content/uploads/2026/09/03073854/GP-PV-2026-1200x1483-BL-DW-PS5-17794582384128.jpg	2	t	2026-11-12 01:20:21.949175	f
44	NINTENDO SWITCH SPORTS RESORT		1199.00	23	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/22072657/Nintendo-Switch-Sports-Resort-GP-17840515513772-510x630.jpg	2	t	2026-11-12 01:21:43.393022	f
45	CONSOLA PLAYSTATION 5 MEGAPACK BUNDLE GT7 Y ASTROBOT DIGITAL		9999.00	16	https://cdn2.gameplanet.com/wp-content/uploads/2025/11/12184336/711719570936-17629941500481-510x630.jpg	1	t	2026-11-12 01:22:28.039417	f
17	CONTROL PLAYSTATION 5 DUALSENSE GRAND THEFT AUTO VI BLACK	Inspirados en Grand Theft Auto VI, estos controles inalámbricos DualSense de edición limitada capturan el estilo y el lujo de Vice City. Con un acabado brillante e iridiscente, detalles texturizados de hoja de palmera y la marca oficial de Grand Theft Auto VI, son un tributo audaz a la Vice City moderna.	1699.00	26	https://cdn2.gameplanet.com/wp-content/uploads/2026/09/10102227/CONTROL-DUALSENSE-GTA-VI-BLACK-GP.jpg	4	t	2026-11-12 01:04:08.288293	f
33	HEADSET INALAMBRICO TURTLE BEACH RECON 70 BLANCOS NSW2	Audífonos Turtle Beach® Recon 70 – Blancos (Licencia Oficial Nintendo®\n\nTu aliado perfecto para cada partida\n\nLos Turtle Beach® Recon 70 combinan comodidad, estilo y un audio de alta fidelidad para que disfrutes cada sesión de juego al máximo. Con licencia oficial de Nintendo y la reconocida ingeniería de Turtle Beach, son la elección ideal para jugadores de todos los niveles que buscan rendimiento y claridad en cada comando.	399.00	12	https://cdn2.gameplanet.com/wp-content/uploads/2025/12/30181648/731855080007-17671326650220-510x630.jpg	3	t	2026-11-12 01:15:14.443401	f
18	PDP HEADSET AIRLITE MARIO CON CABLE	Juega durante horas con total comodidad y sumérgete en cada partida con los PDP Airlite Headset Mario, unos audífonos diseñados para ofrecer ligereza, audio envolvente y comunicación clara, todo con el estilo inconfundible del universo Mario.	199.00	12	https://cdn2.gameplanet.com/wp-content/uploads/2026/05/08130452/708056069742-17781838373047-510x630.jpg	3	t	2026-11-12 01:04:43.475935	f
22	CONSOLA XBOX SERIES X RECERT	Disfruta del máximo rendimiento de Xbox con la Consola Xbox Series X Recertificada, una potente consola diseñada para ofrecer tiempos de carga ultrarrápidos, gráficos impresionantes y una experiencia de juego de nueva generación. Gracias a su proceso de recertificación, podrás disfrutar de la calidad y desempeño característicos de Xbox.	18999.00	42	https://cdn2.gameplanet.com/wp-content/uploads/2026/09/03073612/CONSOLA-XSX-RECERT-17882742155521.jpg	1	t	2026-11-12 01:07:28.737258	f
23	CONSOLA XBOX SERIES X GALAXY 2 TB	Lleva tu experiencia de juego al siguiente nivel con la Xbox Series X Galaxy Black de 2 TB, la consola más potente de Xbox, diseñada para ofrecer gráficos impresionantes, tiempos de carga ultrarrápidos y un amplio espacio de almacenamiento para tus títulos favoritos.	29999.00	29	https://cdn2.gameplanet.com/wp-content/uploads/2026/08/13073056/CONSOLA20XBOX20SERIES20X20GALAXY20220TB-XSX-GP-17863888719123-510x630.jpg	1	t	2026-11-12 01:08:08.740342	f
24	CONSOLA XBOX SERIES S	¡Listo para la acción!\n\nDisfruta de una velocidad y rendimiento de nueva generación con nuestra biblioteca digital más grande hasta la fecha. Disfruta de mundos más dinámicos y tiempos de carga más rápidos, y agrega Xbox Game Pass Ultimate (la suscripción se vende por separado) para jugar a títulos nuevos el mismo día de su lanzamiento. Además, disfruta de cientos de juegos de alta calidad.	9999.00	29	https://cdn2.gameplanet.com/wp-content/uploads/2022/09/03134148/series_s_1_1_1-510x630.jpg	1	t	2026-11-12 01:08:47.450607	f
25	PLAYSTATION PORTAL 30 ANIVERSARIO	Celebra el 30.º aniversario de la consola PlayStation® original con el Reproductor remoto PlayStation Portal™: edición limitada del 30.º aniversario. Este PS Portal especial cuenta con elementos de diseño retro y un esquema de colores heredado que rinde homenaje a la legendaria consola original PlayStation, que se lanzó el 3 de diciembre de 1994.	6999.00	12	https://cdn2.gameplanet.com/wp-content/uploads/2024/11/21163741/711719596073-P00000004365-ps-portal-remote-30aniv-portada-510x630.jpg	1	t	2026-11-12 01:09:34.052914	f
26	CONSOLA PLAYSTATION 5 EDICION LIMITADA ORO GHOST OF YOTEI	*“A PARTIR DE ENERO DE 2028, LOS NUEVOS LANZAMIENTOS DE JUEGOS PARA PLAYSTATION ESTARÁN DISPONIBLES PARA SU COMPRA EN PLAYSTATION STORE Y A TRAVÉS DE MINORISTAS ÚNICAMENTE EN FORMATO DIGITAL. LOS DISCOS DE JUEGOS LANZADOS ANTES DE ENERO DE 2028 SEGUIRÁN SIENDO COMPATIBLES CON ESTA CONSOLA.”*	10999.00	21	https://cdn2.gameplanet.com/wp-content/uploads/2026/08/06093916/711719599845-17575310950794-510x630.jpg	1	t	2026-11-12 01:10:04.858818	f
27	CONSOLA NINTENDO SWITCH LITE HYRULE EDITION	Esta edición especial de la consola Nintendo Switch Lite también incluye una suscripción individual de 12 meses a Nintendo Switch Online + Expansion Pack, que incluye un amplio catálogo de juegos clásicos, entre ellos diez de la serie Legend of Zelda.	3999.00	19	https://cdn2.gameplanet.com/wp-content/uploads/2024/09/25200918/045496884994-nsw-lite-hyrule-edition-portada-510x630.jpg	1	t	2026-11-12 01:10:42.22168	f
19	CONTROL ALAMBRICO POWER A NSW2 LUMECTRA BLANCO	Control Alámbrico PowerA Advantage Lumectra Blanco para Nintendo Switch 2\n\nHaz que tu experiencia de juego brille con el control PowerA Advantage Lumectra, equipado con tecnología LED Ghost RGB y funciones avanzadas que te ofrecen precisión, comodidad y estilo en cada partida.	299.00	20	https://cdn2.gameplanet.com/wp-content/uploads/2025/10/29133809/617885152917-17613300822438-510x630.jpg	4	t	2026-11-12 01:05:24.076969	f
20	CONSOLA NINTENDO SWITCH OLED BLANCA MARIO WONDER + 3 MESES ONLINE	Nintendo Switch OLED Blanca – Bundle Super Mario Bros Wonder + 3 Meses Online\n\nDescubre una nueva forma de jugar con la consola híbrida más versátil del mercado. Esta edición especial incluye el vibrante juego Super Mario Bros Wonder y una suscripción de 3 meses a Nintendo Switch Online, para que disfrutes de partidas multijugador, títulos clásicos y mucho más desde el primer día.	5999.00	29	https://cdn2.gameplanet.com/wp-content/uploads/2025/09/04164547/045496885489-17568522333450.jpg	1	t	2026-11-12 01:06:01.581292	f
21	CONSOLA PLAYSTATION 5 DIGITAL FORTNITE FLOWERING	*“A PARTIR DE ENERO DE 2028, LOS NUEVOS LANZAMIENTOS DE JUEGOS PARA PLAYSTATION ESTARÁN DISPONIBLES PARA SU COMPRA EN PLAYSTATION STORE Y A TRAVÉS DE MINORISTAS ÚNICAMENTE EN FORMATO DIGITAL. LOS DISCOS DE JUEGOS LANZADOS ANTES DE ENERO DE 2028 SEGUIRÁN SIENDO COMPATIBLES CON ESTA CONSOLA.”*	11999.00	63	https://cdn2.gameplanet.com/wp-content/uploads/2026/08/06073337/CONSOLA20PLAYSTATION20520DIGITAL20FORTNITE20FLOWERING20CHAOS-GP-17859588386214-510x630.jpg	1	t	2026-11-12 01:06:34.607798	f
31	KIT DE CARGA DOBLE XBOX ONE VOLTEDGE BX25		399.00	42	https://cdn2.gameplanet.com/wp-content/uploads/2022/09/26165935/850021579432-kit-carga-bx25-voltedge-510x630.jpg	3	t	2026-11-12 01:13:30.567929	f
34	CONTROL PLAYSTATION 5 DUALSENSE GRAN TURISMO	Celebra 30 años del verdadero simulador de manejo con este control inalámbrico DualSense de edición limitada, inspirado en la calidad artesanal y la ingeniería características de Gran Turismo.  Su diseño, para pilotos que van siempre detrás de la perfección, combina franjas con estilo de carreras, gráficos inspirados en el automovilismo y una placa que simula fibra de carbono texturada.	1699.00	16	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/21081617/DualSense_Gran_Turismo_1_GP.jpg	4	t	2026-11-12 01:15:46.63528	f
35	KIT DE CARGA VOLTEDGE BX25 MINECRAFT CREEPER AND TNT 2 PACK	Mantén tus controles siempre listos para la acción con el Minecraft Creeper & TNT 2 Pack Charge Kit BX25, un práctico kit de carga inspirado en dos de los elementos más icónicos del universo Minecraft. Diseñado para ofrecer mayor autonomía y comodidad, es la solución perfecta para disfrutar de largas sesiones de juego sin interrupciones.	699.00	26	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/15075703/KIT-DE-CARGA-VOLTEDGE-BX25-MINECRAFT-TNT-CREPEER-GP-1-17919944613467-510x630.jpg	3	t	2026-11-12 01:16:20.278034	f
38	CONTROL PLAYSTATION 5 DUALSENSE TECHNO RED		1699.00	25	https://cdn2.gameplanet.com/wp-content/uploads/2026/03/11200433/711719021612-17694541458312-510x630.jpg	4	t	2026-11-12 01:17:54.174552	f
39	BUNDLE ESTUCHE Y CONTROL NINTENDO SWITCH POWER A SUPER MARIO BROS	Abrete camino a través de Mushroom Kingdom con este icónico control de Mario. Con el plomero favorito de todos con su encendido de bola de fuego, este controlador viene con dos botones de juego avanzados asignables para un control eficiente, un diseño ergonómico cómodo, un conector para auriculares estéreo de 3,5 mm y un par de anillos antifricción integrados.	399.00	31	https://cdn2.gameplanet.com/wp-content/uploads/2022/12/15163114/617885022517-bundle-super-mario-control-estuche-hori-1-510x630.jpg	4	t	2026-11-12 01:18:39.552826	f
40	SUPER SMASH BROS ULTIMATE		999.00	25	https://cdn2.gameplanet.com/wp-content/uploads/2022/09/27183251/super_smash_bros_ultimate_main_45496598709_1-2-510x630.jpg	2	t	2026-11-12 01:19:26.1782	f
43	RESIDENT EVIL 4 REMAKE LENTICULAR EDITION		999.00	23	https://cdn2.gameplanet.com/wp-content/uploads/2026/10/13084134/RESIDENT-EVIL-4-REMAKE-XSX-GP20-17915724184842.jpg	2	t	2026-11-12 01:20:56.248308	f
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

SELECT pg_catalog.setval('public.carrito_id_carrito_seq', 4, true);


--
-- Name: carrito_items_id_item_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carrito_items_id_item_seq', 8, true);


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 4, true);


--
-- Name: chatbot_faq_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chatbot_faq_id_seq', 4, true);


--
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favoritos_id_favorito_seq', 6, true);


--
-- Name: inventario_movimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventario_movimientos_id_seq', 1, false);


--
-- Name: magic_link_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.magic_link_tokens_id_seq', 1, false);


--
-- Name: mensajes_contacto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mensajes_contacto_id_seq', 1, false);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.password_reset_codes_id_seq', 1, false);


--
-- Name: pedido_items_id_item_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedido_items_id_item_seq', 6, true);


--
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedidos_id_pedido_seq', 4, true);


--
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.productos_id_producto_seq', 45, true);


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
-- Name: chatbot_faq chatbot_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chatbot_faq
    ADD CONSTRAINT chatbot_faq_pkey PRIMARY KEY (id);


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
-- Name: magic_link_tokens magic_link_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.magic_link_tokens
    ADD CONSTRAINT magic_link_tokens_pkey PRIMARY KEY (id);


--
-- Name: magic_link_tokens magic_link_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.magic_link_tokens
    ADD CONSTRAINT magic_link_tokens_token_key UNIQUE (token);


--
-- Name: mensajes_contacto mensajes_contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensajes_contacto
    ADD CONSTRAINT mensajes_contacto_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: password_reset_codes password_reset_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT password_reset_codes_pkey PRIMARY KEY (id);


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
-- Name: ix_chatbot_faq_pregunta_normalizada; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_chatbot_faq_pregunta_normalizada ON public.chatbot_faq USING btree (pregunta_normalizada);


--
-- Name: ix_password_reset_codes_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_password_reset_codes_email ON public.password_reset_codes USING btree (email);


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
-- Name: password_reset_codes password_reset_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT password_reset_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id_usuario);


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

\unrestrict sl9eetjYUAGbFTzYvbxDPL2fGoQKJzKpCIbCizC712rcO2gIKhuU7AfxHKiDhhe

