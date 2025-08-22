import React, { useState } from "react";

const PackOpen = () => {
    const [showCards, setShowCards] = useState([]);
    const [packs, setPacks] = useState(parseInt(localStorage.getItem("packsBuy") || "0", 10));
    const [loading, setLoading] = useState(false);

    const fetchRandomCards = async (n) => {
        setLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/cards/random?n=${n}`);
            const data = await response.json();
            setShowCards(data.cards); // data.cards debe ser un array de objetos { image, name, ... }
        } catch (error) {
            setShowCards([]);
        }
        setLoading(false);
    };

    const handleOpenOne = async () => {
        if (packs >= 1) {
            localStorage.setItem("packsBuy", packs - 1);
            setPacks(packs - 1);
            await fetchRandomCards(5);
        }
    };

    const handleOpenFive = async () => {
        if (packs >= 5) {
            localStorage.setItem("packsBuy", packs - 5);
            setPacks(packs - 5);
            await fetchRandomCards(25);
        }
    };

    const handleOpenTen = async () => {
        if (packs >= 10) {
            localStorage.setItem("packsBuy", packs - 10);
            setPacks(packs - 10);
            await fetchRandomCards(50);
        }
    };

    function renderCardBlocks(cards) {
        const blocks = [];
        for (let i = 0; i < cards.length; i += 5) {
            blocks.push(cards.slice(i, i + 5));
        }
        return blocks.map((block, blockIdx) => (
            <div key={blockIdx} className="mb-4">
                <div className="d-flex justify-content-center mb-2">
                    {block.slice(0, 2).map((card, idx) => (
                        <img
                            key={idx}
                            src={card.image}
                            alt={card.name || `Card ${blockIdx * 5 + idx + 1}`}
                            style={{ width: "100px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", margin: "0 8px" }}
                        />
                    ))}
                </div>
                <div className="d-flex justify-content-center">
                    {block.slice(2, 5).map((card, idx) => (
                        <img
                            key={idx}
                            src={card.image}
                            alt={card.name || `Card ${blockIdx * 5 + idx + 3}`}
                            style={{ width: "100px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", margin: "0 8px" }}
                        />
                    ))}
                </div>
            </div>
        ));
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-start" style={{ minHeight: "60vh", marginTop: "1.5rem" }}>
            <p style={{ fontSize: "1.3rem", textAlign: "center", marginTop: "0" }}>
                You have{" "}
                <span
                    style={{
                        backgroundColor: "#b9fbc0",
                        borderRadius: "12px",
                        padding: "0.3em 0.8em",
                        fontWeight: "bold",
                        color: "#155724",
                        fontSize: "1.3rem"
                    }}
                >
                    {packs}
                </span>{" "}
                packs to open.
            </p>
            <img
                src="https://images.wikidexcdn.net/mwuploads/wikidex/thumb/d/de/latest/20240212215431/Jirachi_%28Brecha_Parad%C3%B3jica_TCG%29.png/230px-Jirachi_%28Brecha_Parad%C3%B3jica_TCG%29.png"
                alt="Pack"
                style={{ width: "180px", margin: "1.5rem 0" }}
            />
            <div className="d-flex gap-3 mb-4">
                <button
                    className="btn btn-success"
                    onClick={handleOpenOne}
                    disabled={packs < 1 || loading}
                >
                    Open 1 pack
                </button>
                <button
                    className="btn btn-success"
                    onClick={handleOpenFive}
                    disabled={packs < 5 || loading}
                >
                    Open 5 packs
                </button>
                <button
                    className="btn btn-success"
                    onClick={handleOpenTen}
                    disabled={packs < 10 || loading}
                >
                    Open 10 packs
                </button>
            </div>
            {loading && <p>Loading cards...</p>}
            {showCards.length > 0 && (
                <div>
                    {renderCardBlocks(showCards)}
                </div>
            )}
        </div>
    );
};

export default PackOpen;