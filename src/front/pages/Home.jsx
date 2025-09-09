import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import News from "../components/News";
import PackCarousel from "../components/PackCarousel.jsx";
import RankingPreview from "../components/RankingPreview.jsx";


export const Home = () => {

    const { store, dispatch } = useGlobalReducer();

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hello`)//(backendUrl + "/api/hello")
            const data = await response.json()

            if (response.ok) dispatch({ type: "set_hello", payload: data.message });

            return data;

        } catch (error) {
            if (error.message) throw new Error(
                `Could not fetch the message from the backend.
                Please check if the backend is running and the backend port is public.`
            );
        }
    };

    useEffect(() => {
        loadMessage();
    }, []);

    return (
        <div className="container-fluid px-4 my-5" style={{ maxWidth: "1600px", margin: "0 auto" }}>
            <div className="row">
                {/* Columna izquierda */}
                <div className="col-lg-8 mb-5 px-5" >
                    <h1 className="mb-4 text-center" style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 1)" }}>Welcome to BattleCards!</h1>

                    {/* Placeholder grande */}
                    <div
                        className="container my-4 p-4 rounded"
                        style={{
                            background: "rgba(20,20,20,0.8)",
                            border: "1px solid #9b9b9bff",
                            color: "#f5f5f5",
                        }}
                    >
                        <h1 className="text-center mb-4">BattleCards</h1>

                        <p>
                            <strong>BattleCards</strong> es una aplicación web inspirada en los juegos de cartas
                            coleccionables. Permite a los usuarios registrarse, construir un mazo único y competir en un
                            ranking global con cartas obtenidas al comprar y abrir sobres virtuales.
                        </p>
                        <p>
                            Este proyecto ha sido desarrollado por estudiantes de la{" "}
                            <strong>Cohorte 112 del Bootcamp de Full Stack Developer en 4Geeks Academy</strong> en un plazo
                            de <strong>3 semanas</strong>, abarcando desde los primeros diseños y mockups hasta una
                            aplicación funcional.
                        </p>

                        <h2 className="h4 mt-4">¿Cómo funciona la app?</h2>

                        <h3 className="h5 mt-3">1) Registro, login y perfil</h3>
                        <p>
                            Los jugadores pueden <strong>crear una cuenta</strong> con un email y contraseña{" "}
                            <strong>inventados</strong>.
                        </p>
                        <p>
                            <strong>Aviso importante:</strong> no se envían correos de confirmación; usa datos inventados y
                            contraseñas simples de recordar (por ejemplo, <em>1234</em>).
                        </p>
                        <p>
                            Tras iniciar sesión, el usuario accede a su <strong>perfil personal</strong>, donde ve sobres,
                            colección, mazo y estadísticas, y también puede consultar perfiles de otros jugadores.
                        </p>

                        <h3 className="h5 mt-3">2) Sobres y cartas</h3>
                        <p>
                            Los sobres se <strong>compran de manera simulada</strong> (sin dinero real). Al abrir un sobre,
                            el jugador recibe <strong>5 cartas aleatorias</strong>.
                        </p>
                        <p>
                            Todas las cartas provienen de la API externa{" "}
                            <a
                                href="https://tcgdex.dev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-light"
                            >
                                tcgdex.dev
                            </a>
                            , que ofrece imágenes y datos de cartas de <strong>Pokémon</strong>.
                        </p>

                        <h3 className="h5 mt-3">3) Colección y mazo</h3>
                        <p>
                            Las cartas obtenidas pasan a la <strong>colección personal</strong>. Cada usuario gestiona{" "}
                            <strong>un único mazo</strong>, al que añade cartas de su colección.
                        </p>
                        <ul>
                            <li>Solo se permite <strong>una copia</strong> de cada carta en el mazo.</li>
                            <li>Los mazos <strong>puntúan automáticamente</strong> según valor y rareza.</li>
                        </ul>

                        <h3 className="h5 mt-3">4) Reciclaje de cartas repetidas</h3>
                        <p>Puedes <strong>reciclar cartas duplicadas</strong> para obtener sobres gratis:</p>
                        <ul>
                            <li>20 cartas <strong>comunes</strong> → 1 sobre</li>
                            <li>10 cartas <strong>raras</strong> → 1 sobre</li>
                            <li>1 carta <strong>legendaria</strong> → 1 sobre</li>
                        </ul>

                        <h3 className="h5 mt-3">5) Ranking y estadísticas</h3>
                        <p>
                            Los puntos del mazo alimentan un <strong>ranking global</strong>. La app muestra{" "}
                            <strong>estadísticas</strong> de cartas: rarezas, uso en mazos y evolución de la colección.
                        </p>

                        <h2 className="h4 mt-4">Tecnologías utilizadas</h2>
                        <ul>
                            <li>
                                <strong>Frontend:</strong> React.js (Vite), Bootstrap.
                            </li>
                            <li>
                                <strong>Backend:</strong> Python con Flask y Flask-RESTful.
                            </li>
                            <li>
                                <strong>Base de datos:</strong> PostgreSQL con SQLAlchemy y Flask-Migrate.
                            </li>
                            <li>
                                <strong>Autenticación:</strong> JWT (JSON Web Tokens).
                            </li>
                            <li>
                                <strong>Control de versiones:</strong> Git y GitHub.
                            </li>
                            <li>
                                <strong>Gestión de tareas y diseño:</strong> Figma (mockups) y HacknPlan/Jira (Scrum).
                            </li>
                        </ul>
                    </div>




                </div>

                {/* Columna derecha */}
                <div className="col-12 col-md-6 col-lg-4 mt-4 mt-lg-0 px-3 px-lg-5">
                    <h3 className="mb-4 text-center text-lg-start">Latest news</h3>

                    {/* Shop */}
                    <div
                        className="mb-4 shadow-sm"
                        style={{
                            borderRadius: "10px",
                            backgroundColor: "rgba(36, 36, 36, 0.8)",
                            border: "1px solid rgba(99, 99, 99, 1)"
                        }}
                    >
                        <PackCarousel />
                    </div>

                    {/* Ranking */}
                    <div
                        className="mb-4 shadow-sm"
                        style={{
                            borderRadius: "10px",
                            backgroundColor: "rgba(36, 36, 36, 0.8)",
                            border: "1px solid rgba(99, 99, 99, 1)"
                        }}
                    >
                        <RankingPreview />
                    </div>

                    {/* News */}
                    <div
                        className="d-flex align-items-center justify-content-center mb-4 shadow-sm"
                        style={{
                            minHeight: "220px", // más compacto en móvil
                            height: "280px",
                            borderRadius: "10px",
                            background: "rgba(20, 20, 20, 0.8)",
                            border: "1px solid #9b9b9bff"
                        }}
                    >
                        <News />
                    </div>
                </div>
            </div>
        </div>
    );
};