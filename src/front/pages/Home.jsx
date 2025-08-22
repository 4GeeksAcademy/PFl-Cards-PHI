import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Home = () => {

    const { store, dispatch } = useGlobalReducer();

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(`${backendUrl}/hello`);
            const data = await response.json();

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
                <div className="col-lg-8 mb-5 px-5">
                    <h1 className="mb-4">Welcome to (nombre del juego)!</h1>

                    {/* Placeholder grande */}
                    <div
                        className="bg-secondary text-white d-flex align-items-center justify-content-center mb-4"
                        style={{ height: "280px", borderRadius: "10px" }}
                    >
                        <span>{'{ Placeholder }'}</span>
                    </div>

                    {/* Texto descriptivo */}
                    <p className="mb-5">
                        ¡Ya está aquí Secret Lair para celebrar todo lo que nos gusta de Magic (además de algunas colaboraciones épicas)!
                        Encontrarás cartas con ilustraciones alucinantes, nuevos artistas y estilos que jamás te imaginaste.
                        ¡Pero debes decidirte rápido!
                        Cada drop solo está disponible durante un tiempo limitado. ¡Si te lo pierdes, desaparece!
                    </p>
                </div>

                {/* Columna derecha */}
                <div className="col-lg-4 mt-lg-4 px-5">
                    <h3 className="mb-4">Latest news</h3>

                    {/* Noticia 1 */}
                    <div className="mb-4">
                        <h6>New pack offer!</h6>
                        <div
                            className="bg-light border d-flex align-items-center justify-content-center mb-2"
                            style={{ height: "240px", borderRadius: "8px" }}
                        >
                            <span>Imagen pack</span>
                        </div>
                    </div>

                    {/* Ranking */}
                    <div className="mb-4">
                        <h6>Top 5 Ranking!</h6>
                        <div
                            className="bg-light border d-flex align-items-center justify-content-center mb-2"
                            style={{ height: "240px", borderRadius: "8px" }}
                        >
                            <span>Imagen ranking</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};