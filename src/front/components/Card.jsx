import React from "react";

function getCardBgColor(rarity) {
    if (rarity === "legendary") return "linear-gradient(135deg, #FFD700 60%, #FFFACD 100%)"; 
    if (rarity === "rare") return "linear-gradient(135deg, #8e44ad 60%, #d2b4de 100%)"; 
    return "linear-gradient(135deg, #888 60%, #ccc 100%)"; 
}

function getRarityLabel(rarity) {
    if (rarity === "legendary") return "Legendary";
    if (rarity === "rare") return "Rare";
    return "Common";
}

const Card = ({
    card,
    inDeck = false,
    onAddToDeck,
    onRemoveFromDeck,
    isAlreadyInDeck = false,
    hideAddToDeck = false,
    deckIsFull = false,
    style = {},
    hideRarity = false,      
    hidePoints = false       
}) => {
    if (!card) return null;
    const cardW = style.width || 220;
    const cardH = style.height || 340;
    const imgW = style.imgWidth || 180;
    const imgH = style.imgHeight || 270;
    const fontSize = "1rem";
    const buttonSize = "28px";
    const padding = style.padding || "8px";
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
                    marginBottom: "0px",
                    overflow: "hidden",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1
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
            {!(hideRarity && hidePoints) && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(63, 63, 63, 0.7)",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontWeight: "bold",
                        fontSize
                    }}
                >
                    {!hidePoints && (
                        <span style={{ color: "#333", fontSize }}>{card.points}</span>
                    )}
                    {!hideRarity && (
                        <span style={{ flex: 1, textAlign: "center", color: "#444", fontSize }}>
                            {getRarityLabel(card.game_rarity)}
                        </span>
                    )}
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
            )}
        </div>
    );
};

export default Card;