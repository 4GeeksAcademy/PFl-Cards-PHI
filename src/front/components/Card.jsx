import React from "react";

function getCardBgColor(rarity) {
    if (rarity === "legendary") return "linear-gradient(135deg, #FFD700 60%, #FFFACD 100%)"; // gold
    if (rarity === "rare") return "linear-gradient(135deg, #8e44ad 60%, #d2b4de 100%)"; // purple
    return "linear-gradient(135deg, #888 60%, #ccc 100%)"; // gray
}

const Card = ({
    card,
    inDeck = false, // true if rendering from deck view
    onAddToDeck,
    onRemoveFromDeck,
    isAlreadyInDeck = false, // true if this card is already in deck
    hideAddToDeck = false // <-- nueva prop
}) => {
    if (!card) return null;

    return (
        <div
            style={{
                width: "220px",
                borderRadius: "14px",
                boxShadow: "0 4px 16px #bbb",
                background: getCardBgColor(card.game_rarity),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px",
                margin: "16px auto"
            }}
        >
            <img
                src={card.image_url}
                alt={card.name}
                style={{
                    width: "180px",
                    height: "270px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    marginBottom: "12px"
                }}
            />
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontWeight: "bold"
                }}
            >
                <span style={{ color: "#333" }}>{card.points}</span>
                <span style={{ flex: 1, textAlign: "center", color: "#444" }}>{card.game_rarity}</span>
                {inDeck ? (
                    <button
                        className="btn"
                        style={{
                            width: "32px",
                            height: "32px",
                            background: "#dc3545",
                            color: "#fff",
                            borderRadius: "6px",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                        title="Remove from deck"
                        onClick={() => {
                            if (onRemoveFromDeck) {
                                onRemoveFromDeck(card.id);
                            }
                        }}
                    >
                        −
                    </button>
                ) : (
                    !hideAddToDeck && (
                        <button
                            className="btn"
                            style={{
                                width: "32px",
                                height: "32px",
                                background: isAlreadyInDeck ? "#bbb" : "#28a745",
                                color: "#fff",
                                borderRadius: "6px",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                cursor: isAlreadyInDeck ? "not-allowed" : "pointer",
                                opacity: isAlreadyInDeck ? 0.6 : 1
                            }}
                            disabled={isAlreadyInDeck}
                            title={isAlreadyInDeck ? "Already in deck" : "Add to deck"}
                            onClick={() => {
                                if (!isAlreadyInDeck && onAddToDeck) {
                                    onAddToDeck(card.id);
                                }
                            }}
                        >
                            +
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default Card;