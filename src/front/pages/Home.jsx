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
                    <h1 className="mb-4 text-center" style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 1)"}}>Welcome to BattleCards!</h1>

                    {/* Placeholder grande */}
                    <div className="d-flex align-items-center justify-content-center mb-4"
                         style={{ height: "280px", borderRadius: "10px", background: "rgba(20, 20, 20, 0.8)", border: "1px solid #9b9b9bff"}}
                    >
                        <div className="mb-5 px-3" style={{textAlign: "justify" }}>
                            <h3 className="text-center">Pedro</h3>
                            <p>Este es un proyecto de ejemplo para mostrar las capacidades de Full Stack con Python y React.</p>
                        </div>
                        <div className="mb-5 px-3" style={{textAlign: "justify" }}>
                            <h3 className="text-center">Ignacio</h3>
                            <p>Este es un proyecto de ejemplo para mostrar las capacidades de Full Stack con Python y React.</p>
                        </div>
                        <div className="mb-5 px-3" style={{textAlign: "justify" }}>
                            <h3 className="text-center">Hector</h3>
                            <p>Este es un proyecto de ejemplo para mostrar las capacidades de Full Stack con Python y React.</p>
                        </div>
                    </div>


                    <div
                        className="d-flex align-items-center justify-content-center mb-4"
                        style={{ height: "280px", borderRadius: "10px", background: "rgba(20, 20, 20, 0.8)", border: "1px solid #9b9b9bff" }}>
                        <News />
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="col-lg-4 mt-lg-4 px-5">
                    <h3 className="mb-4">Latest news</h3>

                    {/* Shop */}
                    <div className="mb-4" style={{ borderRadius: "10px", backgroundColor: "rgba(36, 36, 36, 0.8)", border: "1px solid rgba(99, 99, 99, 1)" }}>
                        <PackCarousel />
                    </div>

                    {/* Ranking */}
                    <div className="mb-4" style={{ borderRadius: "10px", backgroundColor: "rgba(36, 36, 36, 0.8)", border: "1px solid rgba(99, 99, 99, 1)" }}>
                        <RankingPreview />
                    </div>
                </div>
            </div>
        </div>
    );
};