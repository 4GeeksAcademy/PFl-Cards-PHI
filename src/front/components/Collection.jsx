import React, { useEffect, useState } from "react";
import Card from "./Card";
import { apiFetch } from "../utils/apiFetch";
import Order from "./Order";


const MAX_DECK_SIZE = 20;

const Collection = ({ cards = [], deck = [], handleAddToDeck, isCardInDeck }) => {
    const [userCollection, setUserCollection] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [orderAsc, setOrderAsc] = useState(true);
    const [search, setSearch] = useState(""); // Estado para la búsqueda
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        apiFetch(`${import.meta.env.VITE_BACKEND_URL}/api/collection`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(userData => {
                const userCardsMap = {};
                if (userData["User collection"]) {
                    userData["User collection"].forEach(card => {
                        userCardsMap[card.id || card.card_id] = card.quantity;
                    });
                }
                setUserCollection(userCardsMap);
            })
            .catch(() => setUserCollection({}))
            .finally(() => setLoading(false));
    }, []);

    const ownedCards = cards.filter(card => userCollection[card.id] > 0);
    const uniqueOwned = ownedCards.length;
    const totalUnique = cards.length;
    // Cartas totales (incluyendo repetidas)
    const totalOwned = ownedCards.reduce((acc, card) => acc + (userCollection[card.id] || 0), 0);

    let filteredCards = ownedCards;
    if (filter === "rarity") {
        const rarityOrder = ["common", "rare", "legendary"];
        filteredCards = [...ownedCards].sort((a, b) => {
            const aIdx = rarityOrder.indexOf(a.game_rarity);
            const bIdx = rarityOrder.indexOf(b.game_rarity);
            return orderAsc ? aIdx - bIdx : bIdx - aIdx;
        });
    } else if (filter === "points") {
        filteredCards = [...ownedCards].sort((a, b) =>
            orderAsc ? b.points - a.points : a.points - b.points
        );
    } else if (filter === "missing") {
        filteredCards = cards.filter(card => !userCollection[card.id]);
    } else if (filter === "all_with_missing") {
        filteredCards = [...cards];
    }

    // Filtra por búsqueda de nombre
    if (search.trim() !== "") {
        filteredCards = filteredCards.filter(card =>
            card.name && card.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    const deckIsFull = deck.length >= MAX_DECK_SIZE;

    return (
        <div className="container mt-4" style={{ marginTop: "10px", marginBottom: "20px" }}>
            <div
                className="mb-4"
                style={{
                    fontSize: "1.1rem",
                    color: "#1976d2",
                    fontWeight: "bold",
                    textAlign: "center"
                }}
            >
                <div className="d-flex flex-wrap justify-content-center gap-4">
                    <div className="d-flex flex-column align-items-center" style={{ background: "#4594ddff", borderRadius: "8px", padding: "6px 18px", marginBottom: "8px", minWidth: "140px" }}>
                        <span style={{ color: "#333", fontWeight: "bold" }}>Total cards</span>
                        <span style={{ color: "#333", fontSize: "1.2rem" }}>
                            {totalOwned}
                        </span>
                    </div>
                    <div className="d-flex flex-column align-items-center" style={{ background: "#3ea351ff", borderRadius: "8px", padding: "6px 18px", marginBottom: "8px", minWidth: "140px" }}>
                        <span style={{ color: "#333", fontWeight: "bold" }}>Unique cards</span>
                        <span style={{ color: "#333", fontSize: "1.2rem" }}>
                            {uniqueOwned} / {totalUnique}
                        </span>
                    </div>
                </div>
            </div>
            <Order
                filter={filter}
                setFilter={setFilter}
                orderAsc={orderAsc}
                setOrderAsc={setOrderAsc}
            />
            {/* Barra de búsqueda */}
            <div className="mb-3" style={{ display: "flex", justifyContent: "center" }}>
                <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: 320 }}
                    placeholder="Search cards by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            {loading ? (
                <p>Loading cards...</p>
            ) : (
                <div className="row">
                    {filteredCards.length === 0 ? (
                        <p>No cards to display.</p>
                    ) : (
                        filteredCards.map((card, idx) => {
                            const owned = userCollection[card.id] > 0;
                            return (
                                <div
                                    key={card.id || idx}
                                    className={
                                        isMobile
                                            ? "col-12 mb-4"
                                            : "col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                                    }
                                    style={{ display: "flex", justifyContent: "center" }}
                                >
                                    <div style={{ position: "relative" }}>
                                        <Card
                                            card={card}
                                            onAddToDeck={() => handleAddToDeck(card, idx)}
                                            isAlreadyInDeck={isCardInDeck(card, idx)}
                                            hideAddToDeck={!owned}
                                            deckIsFull={deckIsFull}
                                            style={
                                                (filter === "missing" || (filter === "all_with_missing" && !owned))
                                                    ? { filter: "grayscale(1)", opacity: 0.6 }
                                                    : {}
                                            }
                                        />
                                        {owned && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "12px",
                                                    right: "16px",
                                                    background: "#ff3e3eff", // verde
                                                    borderRadius: "8px",
                                                    padding: "4px 10px",
                                                    fontWeight: "bold",
                                                    color: "#fff"
                                                }}
                                            >
                                                x{userCollection[card.id]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default Collection;