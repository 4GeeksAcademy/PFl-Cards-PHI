import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Opening from "../components/Opening";

const packImg = "docs/Imagenes/Sobre.png";

const PackOpen = () => {
    const [totalPacks, setTotalPacks] = useState(null);
    const [loading, setLoading] = useState(true);
    const buttonsRef = useRef(null);
    const [imgWidth, setImgWidth] = useState(220);
    const [cardsToShow, setCardsToShow] = useState([]);
    const [showOpening, setShowOpening] = useState(false);

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
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/packs`, {
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
        const accessToken = localStorage.getItem("access_token");
        if (totalPacks < quantity) {
            alert("You don't have enough packs!");
            return;
        }
        let cardsOpened = [];
        try {
            for (let i = 0; i < quantity; i++) {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/open-pack`, {
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
            alert(err.message);
        }
    };

    const handleCloseOpening = () => {
        setShowOpening(false);
        setCardsToShow([]);
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
            <div className="d-flex flex-column align-items-center" style={{ marginBottom: "2rem" }}>
                <img
                    src={packImg}
                    alt="Pack"
                    style={{
                        width: imgWidth,
                        height: "400px",
                        objectFit: "contain",
                        marginBottom: "1.5rem",
                        transition: "width 0.2s",
                        borderRadius:"24px"
                    }}
                />
                <div className="d-flex justify-content-center gap-3" ref={buttonsRef}>
                    <button className="btn btn-primary" onClick={() => handleOpenPack(1)}>
                        Open 1
                    </button>
                    <button className="btn btn-primary" onClick={() => handleOpenPack(5)}>
                        Open 5
                    </button>
                    <button className="btn btn-primary" onClick={() => handleOpenPack(10)}>
                        Open 10
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