import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const getCardContainerStyle = (isMobile) => {
    if (isMobile) {
        return {
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "8px",
            justifyContent: "center",
            margin: "0 auto",
            maxWidth: "180px"
        };
    }
    return {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "24px",
        justifyContent: "center",
        margin: "0 auto",
        maxWidth: "1400px"
    };
};

const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const imgStyle = {
    width: "180px",
    height: "247px",
    background: "#e0e0e0",
    objectFit: "cover",
    borderRadius: "4px",
    marginBottom: "12px"
};

const infoLineStyle = {
    display: "flex",
    width: "180px",
    borderTop: "1px solid #ccc",
    marginTop: "8px",
    paddingTop: "6px",
    fontSize: "15px",
    justifyContent: "space-between",
    alignItems: "center"
};

const bubbleStyle = {
    background: "#1976d2",
    color: "#fff",
    padding: "12px 32px",
    borderRadius: "24px",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
    display: "inline-block"
};

const linkStyle = {
    marginLeft: "12px",
    color: "#fff",
    textDecoration: "underline",
    fontSize: "16px",
    background: "none",
    border: "none",
    cursor: "pointer"
};

const Deck = ({ deck, setDeck }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const deckPoints = deck.reduce((acc, card) => acc + (card?.points || 0), 0);
    const cardContainerStyle = getCardContainerStyle(isMobile);

    return (
        <>
            <div style={bubbleStyle}>
                Total Deck Points: {deckPoints}
                <Link to="/ranking" style={linkStyle}>Ranking</Link>
            </div>
            <div style={cardContainerStyle}>
                {Array.from({ length: 20 }).map((_, idx) => {
                    const card = deck[idx];
                    return (
                        <div key={idx} style={cardStyle}>
                            {card ? (
                                <>
                                    <img
                                        src={card.image_url}
                                        alt={card.name}
                                        style={imgStyle}
                                    />
                                    <div style={infoLineStyle}>
                                        <span>{card.game_rarity || "Rareza"}</span>
                                        <span>{card.points}</span>
                                        <button style={{
                                            padding: "4px 10px",
                                            background: "#1976d2",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "13px"
                                        }}
                                            onClick={() => {
                                                const newDeck = [...deck];
                                                newDeck.splice(idx, 1);
                                                setDeck(newDeck);
                                            }}>
                                            Quitar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        ...imgStyle,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#aaa",
                                        fontSize: "22px"
                                    }}>
                                        +
                                    </div>
                                    <div style={infoLineStyle}>
                                        <span>Rareza</span>
                                        <span>Puntuación</span>
                                        <span></span>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Deck;