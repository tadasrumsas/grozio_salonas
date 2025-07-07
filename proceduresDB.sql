--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-07-07 13:05:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 230 (class 1259 OID 57207)
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmarks (
    id integer NOT NULL,
    user_id integer,
    procedure_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bookmarks OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 57206)
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookmarks_id_seq OWNER TO postgres;

--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 229
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;


--
-- TOC entry 220 (class 1259 OID 57124)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    CONSTRAINT categories_name_check CHECK (((name)::text = ANY ((ARRAY['individual'::character varying, 'groups'::character varying])::text[])))
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 57123)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 224 (class 1259 OID 57153)
-- Name: procedure_dates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedure_dates (
    id integer NOT NULL,
    procedure_id integer,
    date_time timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.procedure_dates OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 57132)
-- Name: procedures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedures (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    image character varying(200),
    description text,
    location character varying(200),
    category_id integer,
    user_id integer,
    duration integer,
    price numeric(10,2),
    rating numeric(2,1) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.procedures OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 57166)
-- Name: registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    user_id integer,
    procedure_date_id integer,
    status character varying(10) DEFAULT 'pending'::character varying NOT NULL,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT registrations_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'cancelled'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.registrations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 57165)
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrations_id_seq OWNER TO postgres;

--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 225
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- TOC entry 228 (class 1259 OID 57186)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    procedure_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 57185)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 227
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 223 (class 1259 OID 57152)
-- Name: tour_dates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tour_dates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tour_dates_id_seq OWNER TO postgres;

--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 223
-- Name: tour_dates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tour_dates_id_seq OWNED BY public.procedure_dates.id;


--
-- TOC entry 221 (class 1259 OID 57131)
-- Name: tours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tours_id_seq OWNER TO postgres;

--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 221
-- Name: tours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tours_id_seq OWNED BY public.procedures.id;


--
-- TOC entry 218 (class 1259 OID 57112)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(10) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_banned boolean DEFAULT false,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 57111)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4740 (class 2604 OID 57210)
-- Name: bookmarks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 57127)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 57156)
-- Name: procedure_dates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_dates ALTER COLUMN id SET DEFAULT nextval('public.tour_dates_id_seq'::regclass);


--
-- TOC entry 4730 (class 2604 OID 57135)
-- Name: procedures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures ALTER COLUMN id SET DEFAULT nextval('public.tours_id_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 57169)
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 57189)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4725 (class 2604 OID 57115)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4931 (class 0 OID 57207)
-- Dependencies: 230
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bookmarks VALUES (3, 2, 5, '2025-07-07 10:22:28.481022');
INSERT INTO public.bookmarks VALUES (4, 2, 2, '2025-07-07 10:22:29.460309');
INSERT INTO public.bookmarks VALUES (5, 2, 1, '2025-07-07 10:22:43.667101');
INSERT INTO public.bookmarks VALUES (6, 2, 7, '2025-07-07 10:22:51.093743');
INSERT INTO public.bookmarks VALUES (7, 2, 6, '2025-07-07 10:22:53.155202');
INSERT INTO public.bookmarks VALUES (9, 3, 1, '2025-07-07 10:42:13.742491');
INSERT INTO public.bookmarks VALUES (19, 3, 6, '2025-07-07 11:07:56.499322');
INSERT INTO public.bookmarks VALUES (20, 3, 7, '2025-07-07 11:07:57.385819');
INSERT INTO public.bookmarks VALUES (23, 3, 11, '2025-07-07 13:03:25.774632');


--
-- TOC entry 4921 (class 0 OID 57124)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories VALUES (1, 'individual');
INSERT INTO public.categories VALUES (2, 'groups');


--
-- TOC entry 4925 (class 0 OID 57153)
-- Dependencies: 224
-- Data for Name: procedure_dates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.procedure_dates VALUES (1, 1, '2025-07-09 07:42:00', '2025-07-07 08:40:40.654937');
INSERT INTO public.procedure_dates VALUES (5, 5, '2025-07-08 08:41:00', '2025-07-07 09:39:39.89167');
INSERT INTO public.procedure_dates VALUES (11, 2, '2025-07-30 23:27:00', '2025-07-07 09:43:14.633884');
INSERT INTO public.procedure_dates VALUES (12, 6, '2025-07-10 07:49:00', '2025-07-07 09:49:10.368303');
INSERT INTO public.procedure_dates VALUES (13, 7, '2025-07-12 09:09:00', '2025-07-07 10:07:42.792643');
INSERT INTO public.procedure_dates VALUES (15, 8, '2025-08-28 05:45:00', '2025-07-07 10:58:42.907789');
INSERT INTO public.procedure_dates VALUES (18, 11, '2025-07-23 13:25:00', '2025-07-07 12:23:02.923672');
INSERT INTO public.procedure_dates VALUES (20, 9, '2025-07-18 02:13:00', '2025-07-07 12:55:03.203193');


--
-- TOC entry 4923 (class 0 OID 57132)
-- Dependencies: 222
-- Data for Name: procedures; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.procedures VALUES (1, 'testas', 'https://images-cdn.redletterdays.co.uk/content-rld/MainContent/SubCategoryPages/Contentful/Pampering/BeautyTreatments/facial.webp', 'ffff', 'vilnius', 1, 1, 50, 50.00, 5.0, '2025-07-07 08:40:40.654937');
INSERT INTO public.procedures VALUES (5, 'Kirpimas', 'https://media.vyaparify.com/vcards/blogs/14836/Male-Hair-Treatment-Clinic-in-Dhayari-Pune.jpg', 'Vyru kirpimas', 'Klaipeda', 1, 1, 30, 25.00, 0.0, '2025-07-07 09:39:39.89167');
INSERT INTO public.procedures VALUES (6, 'Nagu lakavimas', 'https://greenweddingshoes.com/wp-content/uploads/2024/12/classy-black-french-tip-trendy-simple-nail-designs-with-cute-bow-ideas-thumb.jpg', 'Nagu lakavimas', 'Trakai', 1, 1, 45, 60.00, 0.0, '2025-07-07 09:49:10.368303');
INSERT INTO public.procedures VALUES (7, 'Plauku pinimas', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTht47ssCX9oOn0OTYyL3iymwqotNQdsfOoyw&s', 'Plauku pinimas', 'Utena', 1, 1, 50, 60.00, 0.0, '2025-07-07 10:07:42.792643');
INSERT INTO public.procedures VALUES (2, 'Masazas', 'https://www.wayspa.com/wp-content/uploads/2022/01/massage-table.jpg', 'Masazas', 'Kaunas', 2, 1, 30, 200.00, 4.0, '2025-07-07 09:34:57.509055');
INSERT INTO public.procedures VALUES (8, 'Druskos terapijos', 'https://lsveikata.lt/upload/articles_images/3950/def/druska.jpg', 'Druskos terapija maziems ir dideliems', 'Druskininkai', 2, 1, 45, 150.00, 0.0, '2025-07-07 10:41:50.645298');
INSERT INTO public.procedures VALUES (11, 'Antakiai', 'https://hoopshype.com/wp-content/uploads/sites/92/2025/02/i_c2_90_57_anthony-davis.png?w=1000&h=600&crop=1', 'Antakiai', 'Vilnius', 1, 1, 25, 35.00, 0.0, '2025-07-07 12:23:02.923672');
INSERT INTO public.procedures VALUES (9, 'Blakstienu auginimas', 'https://images.delfi.lt/media-api-image-cropper/v1/d2c1ba50-7bd7-11ed-9dc9-bd018b585244.jpg?noup&w=1200&h=711&fx=0.5&fy=0.25', 'Ilgos blakstienos', 'Varena', 1, 1, 30, 25.00, 0.0, '2025-07-07 11:13:21.656881');


--
-- TOC entry 4927 (class 0 OID 57166)
-- Dependencies: 226
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.registrations VALUES (1, 2, 1, 'completed', '2025-07-07 08:51:32.902311');
INSERT INTO public.registrations VALUES (4, 3, 12, 'approved', '2025-07-07 10:37:20.152658');
INSERT INTO public.registrations VALUES (3, 3, 11, 'completed', '2025-07-07 10:37:13.143905');
INSERT INTO public.registrations VALUES (2, 2, 1, 'completed', '2025-07-07 08:55:36.437151');
INSERT INTO public.registrations VALUES (5, 3, 18, 'approved', '2025-07-07 12:40:07.309855');
INSERT INTO public.registrations VALUES (6, 3, 20, 'pending', '2025-07-07 13:03:22.249535');


--
-- TOC entry 4929 (class 0 OID 57186)
-- Dependencies: 228
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews VALUES (1, 2, 1, 5, 'geras', '2025-07-07 09:14:02.636866');
INSERT INTO public.reviews VALUES (2, 3, 2, 4, 'neblogas masaziukas', '2025-07-07 10:38:32.172554');


--
-- TOC entry 4919 (class 0 OID 57112)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'tadas', 'tadas@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$YVQD/j0zPeTcfquMGZLz9g$0uWzrxUNkb9o0VcUaPjOlmiU9BW0pz+D9W1C/Q/6VRE', 'admin', '2025-07-07 08:13:37.797464', false);
INSERT INTO public.users VALUES (2, 'tadas123', 'tadas123@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$sZ4SVN9BNfy5S8wi3hD29w$43QWNbwhOP59pgDHkyuiAO7o+zW5y6ETlqFX54S7p2Q', 'user', '2025-07-07 08:51:14.711665', false);
INSERT INTO public.users VALUES (3, 'tadas1234', 'tadas1234@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$PdB9r2Hzt2qAuXiH7BKSvg$Tgp0Iai39eZC2J1/YKtnsKY97Jw9rvegRy3hg7k7Ml4', 'user', '2025-07-07 10:37:03.330719', false);


--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 229
-- Name: bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookmarks_id_seq', 23, true);


--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 225
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrations_id_seq', 6, true);


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 227
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 2, true);


--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 223
-- Name: tour_dates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tour_dates_id_seq', 20, true);


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 221
-- Name: tours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tours_id_seq', 11, true);


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4761 (class 2606 OID 57213)
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- TOC entry 4763 (class 2606 OID 57215)
-- Name: bookmarks bookmarks_user_id_tour_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_tour_id_key UNIQUE (user_id, procedure_id);


--
-- TOC entry 4751 (class 2606 OID 57130)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4757 (class 2606 OID 57174)
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4759 (class 2606 OID 57195)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 57159)
-- Name: procedure_dates tour_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_dates
    ADD CONSTRAINT tour_dates_pkey PRIMARY KEY (id);


--
-- TOC entry 4753 (class 2606 OID 57141)
-- Name: procedures tours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT tours_pkey PRIMARY KEY (id);


--
-- TOC entry 4747 (class 2606 OID 57122)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4749 (class 2606 OID 57120)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 57221)
-- Name: bookmarks bookmarks_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_tour_id_fkey FOREIGN KEY (procedure_id) REFERENCES public.procedures(id);


--
-- TOC entry 4772 (class 2606 OID 57216)
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4767 (class 2606 OID 57180)
-- Name: registrations registrations_tour_date_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_tour_date_id_fkey FOREIGN KEY (procedure_date_id) REFERENCES public.procedure_dates(id);


--
-- TOC entry 4768 (class 2606 OID 57175)
-- Name: registrations registrations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4769 (class 2606 OID 57201)
-- Name: reviews reviews_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_tour_id_fkey FOREIGN KEY (procedure_id) REFERENCES public.procedures(id);


--
-- TOC entry 4770 (class 2606 OID 57196)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4766 (class 2606 OID 57160)
-- Name: procedure_dates tour_dates_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedure_dates
    ADD CONSTRAINT tour_dates_tour_id_fkey FOREIGN KEY (procedure_id) REFERENCES public.procedures(id);


--
-- TOC entry 4764 (class 2606 OID 57142)
-- Name: procedures tours_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT tours_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 4765 (class 2606 OID 57147)
-- Name: procedures tours_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedures
    ADD CONSTRAINT tours_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-07-07 13:05:33

--
-- PostgreSQL database dump complete
--

