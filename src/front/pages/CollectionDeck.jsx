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

    const getCardId = (card, idx) => card.id || card.name || idx;

    const isCardInDeck = (card, idx) => {
        const cardId = getCardId(card, idx);
        return deck.some((d, i) => getCardId(d, i) === cardId);
    };

    const handleAddToDeck = (card, idx) => {
        if (deck.length < 20 && !isCardInDeck(card, idx)) {
            setDeck([...deck, card]);
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
                    onClick={() => setActiveTab("collection")}
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