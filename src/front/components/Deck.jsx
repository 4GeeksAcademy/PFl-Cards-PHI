import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

const TOTAL_SLOTS = 20; 

const Deck = () => {
    const [deckCards, setDeckCards] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    
    useEffect(() => {
        fetchDeck();
    }, []);

    const fetchDeck = async () => {
        const accessToken = localStorage.getItem("accessToken");
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

    const handleRemoveFromDeck = async (cardId) => {
        const accessToken = localStorage.getItem("accessToken");
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

    const slots = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
        slots.push(deckCards[i] || null);
    }

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
                {slots.map((card, idx) => (
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