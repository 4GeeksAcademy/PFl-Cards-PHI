import React, { useEffect, useState } from "react";
import Card from "./Card";
import { apiFetch } from "../utils/apiFetch";

const Collection = () => {
    const [allCards, setAllCards] = useState([]);
    const [userCollection, setUserCollection] = useState({});
    const [loading, setLoading] = useState(true);
    const [deckCards, setDeckCards] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respAll = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/cards`);
                const all = await respAll.json();

                const accessToken = localStorage.getItem("access_token");
                // Colección del usuario
                const respUser = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/collection`, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
                const userData = await respUser.json();

                // Deck del usuario
                const respDeck = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck`, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
                const deckData = await respDeck.json();

                // Mapeo de cartas y cantidades
                const userCardsMap = {};
                if (userData["User collection"]) {
                    userData["User collection"].forEach(card => {
                        userCardsMap[card.card_id] = card.quantity;
                    });
                }
                setAllCards(all);
                setUserCollection(userCardsMap);
                setDeckCards(deckData.cards || []);
            } catch (err) {
                setAllCards([]);
                setUserCollection({});
                setDeckCards([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddToDeck = async (cardId) => {
        const accessToken = localStorage.getItem("acces_token");
        try {
            const resp = await apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck/add`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ card_id: cardId })
            });
            const data = await resp.json();
            if (!resp.ok) {
                alert(data.error || data.msg || "Error adding card to deck");
            } else {
                setSuccessMsg("Card added to deck successfully!");
                setTimeout(() => setSuccessMsg(""), 2000);
                // Actualiza deckCards tras añadir
                setDeckCards(data.cards || []);
            }
        } catch (err) {
            alert("Network error");
        }
    };

    // Verifica si la carta ya está en el deck
    const isCardInDeck = (cardId) => deckCards.some(card => card.id === cardId);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Your Card Collection</h2>
            {successMsg && (
                <div className="alert alert-success" role="alert" style={{ position: "fixed", top: "80px", right: "30px", zIndex: 9999 }}>
                    {successMsg}
                </div>
            )}
            {loading ? (
                <p>Loading cards...</p>
            ) : (
                <div className="row">
                    {allCards.filter(card => userCollection[card.id] > 0).length === 0 ? (
                        <p>You don't have any cards in your collection yet.</p>
                    ) : (
                        allCards
                            .filter(card => userCollection[card.id] > 0)
                            .map((card, idx) => (
                                <div key={card.id || idx} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div style={{ position: "relative" }}>
                                        <Card
                                            card={card}
                                            onAddToDeck={() => handleAddToDeck(card.id)}
                                            isAlreadyInDeck={isCardInDeck(card.id)}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: "12px",
                                                right: "16px",
                                                background: "#eee",
                                                borderRadius: "8px",
                                                padding: "4px 10px",
                                                fontWeight: "bold",
                                                color: "#333"
                                            }}
                                        >
                                            x{userCollection[card.id]}
                                        </span>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Collection;