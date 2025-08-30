import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

const TOTAL_SLOTS = 20; // 5 lines x 4 cards

const Deck = () => {
    const [deckCards, setDeckCards] = useState([]);

    // Fetch deck cards from API when component mounts
    useEffect(() => {
        fetchDeck();
    }, []);

    const fetchDeck = async () => {
        const accessToken = localStorage.getItem("access_token");
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck`, {
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

    // Remove card from deck via API
    const handleRemoveFromDeck = async (cardId) => {
        const accessToken = localStorage.getItem("access_token");
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck/remove`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ card_id: cardId })
            });
            const data = await resp.json();
            if (!resp.ok) {
                alert(data.msg || data.error || "Error removing card from deck");
            } else {
                setDeckCards(data.cards || []);
            }
        } catch (err) {
            alert("Network error");
        }
    };

    // Fill slots with deck cards or null for empty
    const slots = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
        slots.push(deckCards[i] || null);
    }

    // Calculate total points
    const totalPoints = deckCards.reduce((sum, card) => sum + (card.points || 0), 0);

    return (
        <div className="container mt-4">
            <div className="mb-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3 style={{ textAlign: "center" }}>
                    Your Deck
                    <span style={{ marginLeft: "18px", fontSize: "1.1rem", color: "#28a745" }}>
                        ({totalPoints} pts)
                    </span>
                </h3>
                <Link to="/ranking" className="btn btn-outline-primary mt-2" style={{ alignSelf: "center" }}>
                    Go to Ranking
                </Link>
            </div>
            <div className="row">
                {[0, 1, 2, 3, 4].map((rowIdx) => (
                    <div key={rowIdx} className="d-flex mb-4 justify-content-center">
                        {slots.slice(rowIdx * 4, rowIdx * 4 + 4).map((card, idx) => (
                            <div key={idx} style={{ margin: "0 10px" }}>
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
                ))}
            </div>
        </div>
    );
};

export default Deck;