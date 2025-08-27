import { useState, useEffect } from "react";

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

const addButtonStyle = (disabled) => ({
    padding: "4px 10px",
    background: disabled ? "#bbb" : "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "13px"
});

const Collection = ({ cards, deck, handleAddToDeck, isCardInDeck }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const cardContainerStyle = getCardContainerStyle(isMobile);

    return (
        <div style={cardContainerStyle}>
            {cards.map((card, idx) => {
                const disabled = deck.length >= 20 || isCardInDeck(card, idx);
                return (
                    <div key={idx} style={cardStyle}>
                        <img
                            src={card.image_url}
                            alt={card.name}
                            style={imgStyle}
                        />
                        <div style={infoLineStyle}>
                            <span>{card.game_rarity || "Rareza"}</span>
                            <span>{card.points}</span>
                            <button
                                style={addButtonStyle(disabled)}
                                onClick={() => handleAddToDeck(card, idx)}
                                disabled={disabled}
                            >
                                +
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Collection;