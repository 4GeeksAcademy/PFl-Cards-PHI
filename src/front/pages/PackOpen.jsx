import React, { useEffect, useState, useRef, useLayoutEffect, useCallback, useMemo } from "react";
import Opening from "../components/Opening";
import { toast } from "react-toastify";
import { apiFetch } from "../utils/apiFetch";
import packImg from "../assets/img/1pack.png";
import { useNavigate } from "react-router-dom";


const PackOpen = () => {
    const [totalPacks, setTotalPacks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openingLoader, setOpeningLoader] = useState(false);
    const buttonsRef = useRef(null);
    const [imgWidth, setImgWidth] = useState(220);
    const [cardsToShow, setCardsToShow] = useState([]);
    const [showOpening, setShowOpening] = useState(false);
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (buttonsRef.current) {
            setImgWidth(buttonsRef.current.offsetWidth);
        }
    }, []); // Solo al montar

    // Fetch available packs on load
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/packs`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then(async resp => {
                if (!resp.ok) throw new Error("Error fetching total packs");
                const data = await resp.json();
                setTotalPacks(data.packs_available);
            })
            .catch(() => setTotalPacks(0))
            .finally(() => setLoading(false));
    }, []);

    // Open packs and show cards
    const handleOpenPack = useCallback(async (quantity) => {
        if (openingLoader || loading || totalPacks < quantity || quantity < 1) return;
        setOpeningLoader(true);
        const accessToken = localStorage.getItem("access_token");
        try {
            const resp = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/open-pack`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ quantity })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.msg || "Error opening the pack");
            setCardsToShow(data.packs);
            setShowOpening(true);
            if (typeof data.packs_remaining === "number") {
                setTotalPacks(data.packs_remaining);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setOpeningLoader(false);
        }
    }, [openingLoader, loading, totalPacks]);

    // Cuando se cierra el popup, desbloquea los botones
    const handleCloseOpening = useCallback(() => {
        setShowOpening(false);
        setCardsToShow([]);
        setOpeningLoader(false);
    }, []);

    return (
        <div className="container">
            <div style={{ marginTop: "2rem", marginBottom: "2rem", textAlign: "center" }}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <span style={{ fontSize: "1.5rem" }}>
                        You have{' '}
                        <span
                            style={{
                                background: "#10af33ff",
                                color: "#068d26ff",
                                borderRadius: "50%",
                                padding: "0.2em 0.6em",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                display: "inline-block",
                                minWidth: "1.5em"
                            }}
                        >
                            {totalPacks}
                        </span>{' '}
                        pack{totalPacks === 1 ? '' : 's'} available.
                    </span>
                )}
            </div>
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
                <div
                    className="d-flex justify-content-center gap-3"
                    ref={buttonsRef}
                    style={{ width: "320px", maxWidth: "100%" }}
                >
                    {[1, 5, 10].map(qty => (
                        <button
                            key={qty}
                            className="btn btn-primary-custom flex-grow-1"
                            onClick={() => handleOpenPack(qty)}
                            disabled={openingLoader || loading || totalPacks < qty}
                        >
                            {openingLoader ? "Opening..." : `Open ${qty}`}
                        </button>
                    ))}
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{ width: "320px", maxWidth: "100%", marginTop: "12px" }}
                >
                    <button
                        className="btn btn-danger-custom flex-grow-1"
                        style={{ minWidth: "180px", maxWidth: "300px" }}
                        onClick={() => handleOpenPack(totalPacks)}
                        disabled={openingLoader || loading || totalPacks < 1}
                    >
                        {openingLoader ? "Opening..." : `Open All (${totalPacks})`}
                    </button>
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{ width: "320px", maxWidth: "100%", marginTop: "12px" }}
                >
                    <button
                        className="btn btn-success-custom flex-grow-1"
                        style={{ minWidth: "180px", maxWidth: "300px" }}
                        onClick={() => navigate("/CollectionDeck")}
                    >
                        Go to Collection
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
