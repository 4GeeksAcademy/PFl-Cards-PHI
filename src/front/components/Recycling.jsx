import React, { useState } from "react";
import { apiFetch } from "../utils/apiFetch";
import { toast } from "react-toastify";
import Card from "./Card";
import backImg from "../assets/img/Dorso.png";

// Colores por rareza
const rarityColors = {
    common: "#9e9d9dff",
    rare: "#b217c7ff",
    legendary: "#ffd700"
};

const recyclingOptions = [
    { rarity: "common", required: 20, label: "20 common -> 1 pack" },
    { rarity: "rare", required: 10, label: "10 rare -> 1 pack" },
    { rarity: "legendary", required: 1, label: "1 legendary -> 1 pack" }
];

function getRandomCards(cards, count) {
    // Devuelve un array de cartas aleatorias dejando una copia
    const pool = [];
    cards.forEach(card => {
        for (let i = 0; i < card.quantity - 1; i++) {
            pool.push(card);
        }
    });
    // Mezcla el pool y toma las primeras 
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
}

const Recycling = ({ userCollection = [], onRecycle }) => {
    const [popup, setPopup] = useState(null);

    const getRepeats = (rarity) =>
        userCollection
            .filter(card => card.game_rarity === rarity)
            .reduce((acc, card) => acc + Math.max(0, card.quantity - 1), 0);

    const openPopup = (rarity, required) => {
        const repetidas = userCollection
            .filter(card => card.game_rarity === rarity && card.quantity > 1);
        let totalRepetidas = repetidas.reduce((acc, card) => acc + (card.quantity - 1), 0);

        if (totalRepetidas < required) {
            toast.error(`No tienes suficientes cartas repetidas (${rarity}) para reciclar.`);
            return;
        }

        setPopup({
            rarity,
            required,
            repetidas,
            selected: getRandomCards(repetidas, required)
        });
    };

    const reRandomize = () => {
        setPopup(p => ({
            ...p,
            selected: getRandomCards(p.repetidas, p.required)
        }));
    };

    const confirmRecycle = async () => {
        const payloadMap = {};
        popup.selected.forEach(card => {
            payloadMap[card.card_id] = (payloadMap[card.card_id] || 0) + 1;
        });
        const recyclePayload = Object.entries(payloadMap).map(([card_id, quantity]) => ({
            card_id,
            quantity
        }));

        try {
            await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/recycle`, {
                method: "POST",
                body: JSON.stringify({
                    rarity: popup.rarity,
                    cards: recyclePayload
                })
            });
            toast.success("Recycling done!");
            setPopup(null);
            if (onRecycle) onRecycle();
        } catch (err) {
            toast.error("Network error while recycling.");
        }
    };

    // Tamaño de la caja y de la imagen
    const boxWidth = 420;
    const boxHeight = 140;
    const cardWidth = 72;
    const cardHeight = 96;

    return (
        <div>
            {/* <h3 className="mb-3">Recycle duplicate cards</h3> */}
            <div className="d-flex flex-column gap-4 align-items-center">
                {recyclingOptions.map(option => (
                    <div
                        key={option.rarity}
                        style={{
                            width: `${boxWidth}px`,
                            minWidth: `${boxWidth}px`,
                            maxWidth: `${boxWidth}px`,
                            background: "rgba(180, 238, 248, 0.7)",
                            borderRadius: "16px",
                            boxShadow: "0 2px 8px rgba(70,33,33,0.1)",
                            padding: "18px 24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.7rem"
                        }}
                    >
                        <span style={{
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            width: "100%",
                            marginBottom: "0.2rem"
                        }}>
                            {option.label}
                        </span>
                        <span style={{
                            fontSize: "1rem",
                            textAlign: "center",
                            width: "100%",
                            marginBottom: "0.2rem",
                            display: "block"
                        }}>
                            ({getRepeats(option.rarity)}/{option.required})
                        </span>
                        <div
                            style={{
                                width: `${cardWidth}px`,
                                height: `${cardHeight}px`,
                                background: rarityColors[option.rarity],
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                marginBottom: "0.5rem"
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
                        <div className="d-flex gap-2" style={{ width: "100%", justifyContent: "center" }}>
                            <button
                                className="btn btn-primary"
                                style={{
                                    fontSize: "0.95rem",
                                    padding: "4px 18px",
                                    borderRadius: "8px",
                                    minWidth: "120px",
                                    maxWidth: "160px"
                                }}
                                disabled={getRepeats(option.rarity) < option.required}
                                onClick={() => openPopup(option.rarity, option.required)}
                            >
                                1 Pack
                            </button>
                            <button
                                className="btn btn-info"
                                style={{
                                    fontSize: "0.95rem",
                                    padding: "4px 18px",
                                    borderRadius: "8px",
                                    minWidth: "120px",
                                    maxWidth: "160px"
                                }}
                                disabled={getRepeats(option.rarity) < option.required * 5}
                                onClick={() => openPopup(option.rarity, option.required * 5)}
                            >
                                5 Packs
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* POPUP */}
            {popup && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onClick={() => setPopup(null)}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                            padding: "32px 24px",
                            minWidth: "320px",
                            maxWidth: "900px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                            maxHeight: "90vh",
                            overflowY: "auto"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Botones arriba */}
                        <div className="d-flex gap-3" style={{ width: "100%", justifyContent: "center", marginBottom: "1rem" }}>
                            <button
                                className="btn btn-secondary"
                                style={{ minWidth: "120px" }}
                                onClick={reRandomize}
                            >
                                Randomize
                            </button>
                            <button
                                className="btn btn-success"
                                style={{ minWidth: "120px" }}
                                onClick={confirmRecycle}
                            >
                                Confirm
                            </button>
                        </div>
                        {/* Cartas en filas de máximo 5, responsivo */}
                        <div
                            className="popup-card-grid"
                            style={{
                                display: "grid",
                                gap: "24px",
                                justifyItems: "center",
                                marginBottom: "1.5rem",
                                width: "100%",
                                maxWidth: "900px",
                                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"
                            }}
                        >
                            {popup.selected.map((card, idx) => (
                                <div key={idx}
                                    style={{
                                        width: "130px",
                                        height: "180px",
                                        background: rarityColors[popup.rarity],
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                        transition: "width 0.2s, height 0.2s"
                                    }}
                                >
                                    <Card
                                        card={card}
                                        style={{
                                            width: "120px",
                                            height: "170px",
                                            margin: 0,
                                            padding: 0,
                                            boxShadow: "none"
                                        }}
                                        hideRarity={true}
                                        hidePoints={true}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Botones abajo */}
                        <div className="d-flex gap-3" style={{ width: "100%", justifyContent: "center", marginBottom: "2.5rem" }}>
                            <button
                                className="btn btn-secondary"
                                style={{ minWidth: "120px" }}
                                onClick={reRandomize}
                            >
                                Randomize
                            </button>
                            <button
                                className="btn btn-success"
                                style={{ minWidth: "120px" }}
                                onClick={confirmRecycle}
                            >
                                Confirm
                            </button>
                        </div>
                        <button
                            className="btn btn-link"
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "18px",
                                fontSize: "1.5rem",
                                color: "#888",
                                zIndex: 2
                            }}
                            onClick={() => setPopup(null)}
                        >
                            ×
                        </button>
                        {/* Estilos responsivos para el grid y para la X */}
                        <style>
                            {`
                            @media (max-width: 500px) {
                                .popup-card-grid {
                                    grid-template-columns: 1fr !important;
                                }
                                .btn-link {
                                    top: 6px !important;
                                    right: 6px !important;
                                    font-size: 2rem !important;
                                    background: #fff !important;
                                    border-radius: 50% !important;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.10) !important;
                                }
                            }
                            `}
                        </style>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recycling;

