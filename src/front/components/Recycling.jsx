import React from "react";
import { apiFetch } from "../utils/apiFetch";
import { toast } from "react-toastify";
import backImg from "../assets/img/Dorso.png";

// Colores por rareza
const rarityColors = {
    common: "#9e9d9dff",
    rare: "#b217c7ff",
    legendary: "#ffd700"
};

const buttonBgColor = "#90caf9"; // Azul claro

const recyclingOptions = [
    { rarity: "common", required: 20, label: "20 common -> 1 pack" },
    { rarity: "rare", required: 10, label: "10 rare -> 1 pack" },
    { rarity: "legendary", required: 3, label: "3 legendary -> 1 pack" }
];

const Recycling = ({ userCollection = [], onRecycle }) => {
    const getRepeats = (rarity) =>
        userCollection
            .filter(card => card.game_rarity === rarity)
            .reduce((acc, card) => acc + Math.max(0, card.quantity - 1), 0);

    const handleRecycle = async (rarity, required) => {
        const repeat = userCollection
            .filter(card => card.game_rarity === rarity && card.quantity > 1);

        let totalRepeat = repeat.reduce((acc, card) => acc + (card.quantity - 1), 0);

        if (totalRepeat < required) {
            toast.error(`You don't have enough duplicate cards (${rarity}) to recycle.`);
            return;
        }

        const recyclePayload = [];
        let toRecycle = required;
        for (const card of repeat) {
            let canRecycle = Math.min(card.quantity - 1, toRecycle);
            if (canRecycle > 0) {
                recyclePayload.push({ card_id: card.card_id, quantity: canRecycle });
                toRecycle -= canRecycle;
            }
            if (toRecycle <= 0) break;
        }

        try {
            await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/recycle`, {
                method: "POST",
                body: JSON.stringify({
                    rarity,
                    cards: recyclePayload
                })
            });
            toast.success("Recycling successful! You've received 1 pack.");
            if (onRecycle) onRecycle();
        } catch (err) {
            toast.error("Network error while recycling.");
        }
    };

    // Tamaño del botón y de la caja
    const buttonWidth = 420;
    const buttonHeight = 110;
    const boxWidth = 72;
    const boxHeight = 96;

    return (
        <div>
            <h3 className="mb-3">Recycle duplicate cards</h3>
            <div className="d-flex flex-column gap-3 align-items-center">
                {recyclingOptions.map(option => (
                    <button
                        key={option.rarity}
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                            width: `${buttonWidth}px`,
                            height: `${buttonHeight}px`,
                            padding: "12px 18px",
                            gap: "0.5rem",
                            minWidth: `${buttonWidth}px`,
                            maxWidth: `${buttonWidth}px`,
                            background:  `rgba(180, 238, 248, 0.7)`,
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(70, 33, 33, 0.1)",
                            color: "#222",
                            fontWeight: "bold",
                            cursor: getRepeats(option.rarity) < option.required ? "not-allowed" : "pointer",
                            opacity: getRepeats(option.rarity) < option.required ? 0.6 : 1
                        }}
                        disabled={getRepeats(option.rarity) < option.required}
                        onClick={() => handleRecycle(option.rarity, option.required)}
                    >
                        <span style={{
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            marginBottom: "0.3rem",
                            width: "100%"
                        }}>
                            {option.label} ({getRepeats(option.rarity)}/{option.required})
                        </span>
                        <div
                            style={{
                                width: `${boxWidth}px`,
                                height: `${boxHeight}px`,
                                background: rarityColors[option.rarity],
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
                            }}
                        >
                            <img
                                src={backImg}
                                alt="Card back"
                                style={{
                                    width: "80%",
                                    height: "80%",
                                    objectFit: "contain"
                                }}
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Recycling;

