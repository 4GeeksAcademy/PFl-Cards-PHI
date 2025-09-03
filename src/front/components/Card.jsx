import React from "react";

function getCardBgColor(rarity) {
    if (rarity === "legendary") return "linear-gradient(135deg, #FFD700 60%, #FFFACD 100%)"; // gold
    if (rarity === "rare") return "linear-gradient(135deg, #8e44ad 60%, #d2b4de 100%)"; // purple
    return "linear-gradient(135deg, #888 60%, #ccc 100%)"; // gray
}

function getRarityInitial(rarity) {
    if (rarity === "legendary") return "L";
    if (rarity === "rare") return "R";
    return "C";
}

const Card = ({
    card,
    inDeck = false,
    onAddToDeck,
    onRemoveFromDeck,
    isAlreadyInDeck = false,
    hideAddToDeck = false,
    deckIsFull = false,
    style = {}
}) => {
    if (!card) return null;

    // Solo escritorio
    const cardW = style.width || 220;
    const cardH = style.height || 340;
    const imgW = 180;
    const imgH = 270;
    const fontSize = "1.3rem";
    const buttonSize = "32px";
    const padding = style.padding || "16px";
    const margin = style.margin || "16px auto";

    const disableAdd = isAlreadyInDeck || deckIsFull;

    return (
        <div
            className="card"
            style={{
                ...style,
                width: cardW,
                height: cardH,
                borderRadius: "14px",
                boxShadow: "0 4px 16px #bbb",
                background: getCardBgColor(card.game_rarity),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding,
                margin,
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    width: imgW,
                    height: imgH,
                    borderRadius: "10px",
                    marginBottom: "12px",
                    overflow: "hidden",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <img
                    src={card.image_url}
                    alt={card.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "10px",
                        background: "transparent"
                    }}
                />
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontWeight: "bold",
                    fontSize
                }}
            >
                <span style={{ color: "#333", fontSize }}>{card.points}</span>
                <span style={{ flex: 1, textAlign: "center", color: "#444", fontSize }}>
                    {card.game_rarity}
                </span>
                {inDeck ? (
                    <button
                        className="btn"
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            background: "#dc3545",
                            color: "#fff",
                            borderRadius: "6px",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize,
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
                                width: buttonSize,
                                height: buttonSize,
                                background: disableAdd ? "#bbb" : "#28a745",
                                color: "#fff",
                                borderRadius: "6px",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize,
                                fontWeight: "bold",
                                cursor: disableAdd ? "not-allowed" : "pointer",
                                opacity: disableAdd ? 0.6 : 1
                            }}
                            disabled={disableAdd}
                            title={
                                deckIsFull
                                    ? "Deck lleno"
                                    : isAlreadyInDeck
                                        ? "Ya está en el deck"
                                        : "Añadir al deck"
                            }
                            onClick={() => {
                                if (!disableAdd && onAddToDeck) {
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