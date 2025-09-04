import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "./Card";
import { apiFetch } from "../utils/apiFetch";
import { toast } from "react-toastify";

const TOTAL_SLOTS = 20;

const Deck = () => {
    const [deckCards, setDeckCards] = useState([]);
    const [userRanking, setUserRanking] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        fetchDeck();
        fetchProfileAndRanking();
    }, []);

    const fetchDeck = async () => {
        const accessToken = localStorage.getItem("access_token");
        try {
            const resp = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await resp.json();
            setDeckCards(data.cards || []);
        } catch (err) {
            setDeckCards([]);
        }
    };

    const fetchProfileAndRanking = async () => {
        const accessToken = localStorage.getItem("access_token");
        try {
            // Perfil
            const respProfile = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            const dataProfile = await respProfile.json();
            setUserData(dataProfile);

            // Ranking
            const respRanking = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/ranking`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            const dataRanking = await respRanking.json();
            setUserRanking(dataRanking.position);
        } catch (err) {
            setUserRanking(null);
        }
    };

    const handleRemoveFromDeck = async (cardId) => {
        const accessToken = localStorage.getItem("access_token");
        try {
            const resp = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck/remove`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ card_id: cardId })
            });
            const data = await resp.json();
            if (!resp.ok) {
                toast.error(data.msg || data.error || "Error removing card from deck");
            } else {
                setDeckCards(data.cards || []);
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    const slots = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
        slots.push(deckCards[i] || null);
    }

    return (
        <div className="container mt-4">
            <div className="mb-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                    className="w-100"
                    style={{
                        maxWidth: "600px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {/* <h3 className="mb-0"> Your Deck </h3> */}
                    <Link
                        to="/ranking"
                        style={{
                            textDecoration: "none",
                            position: "center",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                    >
                        <span
                            className="badge bg-primary ms-2"
                            style={{
                                fontSize: "1.5rem",
                                padding: "0.4em 1em",
                                verticalAlign: "middle",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px #bbb"
                            }}
                            title="Ver ranking"
                        >
                            {userRanking && (
                                <span style={{ fontSize: "1.5rem", color: "#fff" }}>
                                    {userRanking}º -
                                </span>
                            )}
                            {userData?.deck_points}
                        </span>
                    </Link>
                </div>
            </div>
            <div className="row">
                {slots
                    .slice()
                    .sort((a, b) => {
                        // Si hay slots vacíos, los dejamos al final
                        if (!a && !b) return 0;
                        if (!a) return 1;
                        if (!b) return -1;
                        const rarityOrder = { legendary: 0, rare: 1, common: 2 };
                        return rarityOrder[a.game_rarity] - rarityOrder[b.game_rarity];
                    })
                    .map((card, idx) => (
                        <div
                            key={idx}
                            className={
                                isMobile
                                    ? "col-12 mb-4"
                                    : "col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                            }
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            {card ? (
                                <Card
                                    card={card}
                                    inDeck={true}
                                    onRemoveFromDeck={() => handleRemoveFromDeck(card.id)}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "220px",
                                        height: "340px",
                                        borderRadius: "14px",
                                        background: "#f2f2f2",
                                        boxShadow: "0 4px 16px #bbb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#aaa",
                                        fontSize: "2rem",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Empty
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Deck;