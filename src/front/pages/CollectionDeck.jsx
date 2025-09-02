import { useState, useEffect } from "react";
import Deck from "../components/Deck";
import Collection from "../components/Collection";

const tabStyle = (active) => ({
    padding: "10px 24px",
    cursor: "pointer",
    border: "none",
    borderBottom: active ? "3px solid #1976d2" : "3px solid transparent",
    background: "none",
    fontWeight: active ? "bold" : "normal",
    color: active ? "#1976d2" : "#333",
    outline: "none",
    transition: "border-bottom 0.2s"
});

const CollectionDeck = () => {
    const [activeTab, setActiveTab] = useState("collection");
    const [cards, setCards] = useState([]);
    const [deck, setDeck] = useState([]);


    useEffect(() => {
        fetch("/src/data/cards_catalog_3sets.json")
            .then((res) => res.json())
            .then((data) => setCards(data.cards));
    }, []);

    // Fetch deck from API
    useEffect(() => {
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
                setDeck(data.cards || []);
            } catch (err) {
                setDeck([]);
            }
        };
        fetchDeck();
    }, []);

    const getCardId = (card, idx) => card.id || card.name || idx;

    const isCardInDeck = (card, idx) => {
        const cardId = getCardId(card, idx);
        return deck.some((d, i) => getCardId(d, i) === cardId);
    };

    // Actualiza para usar la API
    const handleAddToDeck = async (card, idx) => {
        if (deck.length >= 20 || isCardInDeck(card, idx)) return;
        const accessToken = localStorage.getItem("access_token");
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck/add`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ card_id: card.id })
            });
            const data = await resp.json();
            if (!resp.ok) {
                alert(data.error || data.msg || "Error adding card to deck");
            } else {
                setDeck(data.cards || []);
            }
        } catch (err) {
            alert("Network error");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px" }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                borderBottom: "1px solid #ccc",
                width: "320px",
                marginBottom: "24px"
            }}>
                <button
                    onClick={() => window.location.reload()} // Recarga la página al pulsar "Collection"
                    style={tabStyle(activeTab === "collection")}
                >
                    Collection
                </button>
                <button
                    onClick={() => setActiveTab("deck")}
                    style={tabStyle(activeTab === "deck")}
                >
                    Deck
                </button>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
                {activeTab === "collection" && (
                    <Collection
                        cards={cards}
                        deck={deck}
                        handleAddToDeck={handleAddToDeck}
                        isCardInDeck={isCardInDeck}
                    />
                )}
                {activeTab === "deck" && (
                    <Deck deck={deck} setDeck={setDeck} />
                )}
            </div>
        </div>
    );
};

export default CollectionDeck;