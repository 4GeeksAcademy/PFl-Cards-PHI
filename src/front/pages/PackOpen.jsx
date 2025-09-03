import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Opening from "../components/Opening";
import { toast } from "react-toastify";
import { apiFetch } from "../utils/apiFetch";


const packImg = "docs/Imagenes/1pack.png";

const PackOpen = () => {
    const [totalPacks, setTotalPacks] = useState(null);
    const [loading, setLoading] = useState(true);
    const buttonsRef = useRef(null);
    const [imgWidth, setImgWidth] = useState(220);
    const [cardsToShow, setCardsToShow] = useState([]);
    const [showOpening, setShowOpening] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false); // Nuevo estado

    useLayoutEffect(() => {
        if (buttonsRef.current) {
            setImgWidth(buttonsRef.current.offsetWidth);
        }
    }, [buttonsRef.current]);

    // Fetch available packs on load
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        const fetchTotalPacks = async () => {
            try {
                const resp = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/packs`, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
                if (!resp.ok) throw new Error("Error fetching total packs");
                const data = await resp.json();
                setTotalPacks(data.packs_available);
            } catch (err) {
                setTotalPacks(0);
            } finally {
                setLoading(false);
            }
        };
        fetchTotalPacks();
    }, []);

    // Open packs and show cards
    const handleOpenPack = async (quantity) => {
        if (buttonsDisabled) return; // Bloquea si ya está deshabilitado
        setButtonsDisabled(true); // Bloquea al instante

        const accessToken = localStorage.getItem("access_token");
        if (totalPacks < quantity) {
            toast.error("You don't have enough packs!");
            setButtonsDisabled(false); // Desbloquea si no hay suficientes packs
            return;
        }
        let cardsOpened = [];
        try {
            for (let i = 0; i < quantity; i++) {
                const resp = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/open-pack`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.msg || "Error opening the pack");
                cardsOpened.push(data.cards);
                // Actualiza el total de sobres disponibles después de cada apertura
                if (typeof data.packs_remaining === "number") {
                    setTotalPacks(data.packs_remaining);
                }
            }
            setCardsToShow(cardsOpened);
            setShowOpening(true);
        } catch (err) {
            toast.error(err.message);
            setButtonsDisabled(false); // Desbloquea si hay error
        }
    };

    // Cuando se cierra el popup, desbloquea los botones
    const handleCloseOpening = () => {
        setShowOpening(false);
        setCardsToShow([]);
        setButtonsDisabled(false); // Desbloquea aquí
    };

    return (
        <div className="container">
            {/* Packs info at the top */}
            <div style={{ marginTop: "2rem", marginBottom: "2rem", textAlign: "center" }}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <span style={{ fontSize: "1.5rem" }}>
                        You have{" "}
                        <span
                            style={{
                                background: "#b2f7c1",
                                color: "#155724",
                                borderRadius: "50%",
                                padding: "0.2em 0.6em",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                display: "inline-block",
                                minWidth: "1.5em"
                            }}
                        >
                            {totalPacks}
                        </span>{" "}
                        pack{totalPacks === 1 ? "" : "s"} available.
                    </span>
                )}
            </div>
            {/* Pack image and buttons closer to the top */}
            <div className="d-flex flex-column align-items-center" style={{ marginBottom: "2rem", width: "100%" }}>
                <img
                    src={packImg}
                    alt="Pack"
                    style={{
                        width: imgWidth,
                        height: "400px",
                        objectFit: "contain",
                        marginBottom: "1.5rem",
                        transition: "width 0.2s",
                        borderRadius: "24px"
                    }}
                />
                {/* Línea superior: 3 botones */}
                <div
                    className="d-flex justify-content-center gap-3"
                    ref={buttonsRef}
                    style={{ width: "320px", maxWidth: "100%" }}
                >
                    <button className="btn btn-primary flex-grow-1" onClick={() => handleOpenPack(1)} disabled={buttonsDisabled}>
                        Open 1
                    </button>
                    <button className="btn btn-primary flex-grow-1" onClick={() => handleOpenPack(5)} disabled={buttonsDisabled}>
                        Open 5
                    </button>
                    <button className="btn btn-primary flex-grow-1" onClick={() => handleOpenPack(10)} disabled={buttonsDisabled}>
                        Open 10
                    </button>
                </div>
                {/* Línea inferior: botón "Open All" con el mismo ancho */}
                <div
                    className="d-flex justify-content-center"
                    style={{ width: "320px", maxWidth: "100%", marginTop: "12px" }}
                >
                    <button
                        className="btn btn-danger flex-grow-1"
                        style={{ minWidth: "180px", maxWidth: "300px" }}
                        onClick={() => handleOpenPack(totalPacks)}
                        disabled={buttonsDisabled || totalPacks < 1}
                    >
                        Open All ({totalPacks})
                    </button>
                </div>
            </div>
            {showOpening && (
                <Opening packs={cardsToShow} onClose={handleCloseOpening} />
            )}
        </div>
    );
};

export default PackOpen;
